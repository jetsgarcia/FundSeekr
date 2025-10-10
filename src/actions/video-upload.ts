"use server";

import { put } from "@vercel/blob";
import prisma from "@/lib/prisma";
import { stackServerApp } from "@/stack";
import { revalidatePath } from "next/cache";

export async function uploadVideoFile(formData: FormData) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Verify user is a startup
    if (user.serverMetadata.userType !== "Startup") {
      throw new Error("Only startups can upload videos");
    }

    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const startupId = formData.get("startupId") as string;

    if (!file || !title || !description || !startupId) {
      throw new Error("Missing required fields");
    }

    // Validate title and description length
    if (title.trim().length < 3) {
      throw new Error("Title must be at least 3 characters long");
    }

    if (description.trim().length < 10) {
      throw new Error("Description must be at least 10 characters long");
    }

    // Validate file type more strictly
    const allowedTypes = [
      "video/mp4",
      "video/mpeg",
      "video/quicktime",
      "video/x-msvideo", // .avi
      "video/x-ms-wmv", // .wmv
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        "Unsupported video format. Please use MP4, MPEG, MOV, AVI, or WMV"
      );
    }

    // File size limit (100MB)
    const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("Video file must be smaller than 100MB");
    }

    // Verify the startup belongs to the user
    const startup = await prisma.startups.findFirst({
      where: {
        id: startupId,
        user_id: user.id,
      },
    });

    if (!startup) {
      throw new Error("Startup not found or access denied");
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split(".").pop();
    const fileName = `videos/${user.id}/${startupId}-${timestamp}.${extension}`;

    // Upload to Vercel Blob
    const result = await put(fileName, file, {
      access: "public",
      contentType: file.type,
    });

    // Get video duration (we'll approximate based on file size for now)
    // In a real implementation, you might want to use a library to get actual duration
    const estimatedDuration = Math.floor(file.size / (1024 * 1024)); // Rough estimation

    // For general startup videos (not targeted to specific investors),
    // we'll use a placeholder approach. In a production system, you might want to:
    // 1. Make investor_id nullable in the schema, or
    // 2. Create a separate table for general startup videos, or
    // 3. Use a system investor ID for general videos

    // For now, let's create general videos without linking to specific investors
    // by finding a system/default investor or creating a placeholder
    let defaultInvestorId: string;

    // Try to find an existing investor to use as default
    const firstInvestor = await prisma.investors.findFirst({
      select: { id: true },
    });

    if (firstInvestor) {
      defaultInvestorId = firstInvestor.id;
    } else {
      // If no investors exist, we can't create the video pitch with current schema
      throw new Error(
        "Cannot upload video: No investors found in system. Please contact support."
      );
    }

    // Save video record to database
    await prisma.video_pitches.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        duration_in_seconds: estimatedDuration,
        pitch_status: "Sent",
        video_url: result.url,
        attachment_links: [],
        date_sent: new Date(),
        startup_id: startupId,
        investor_id: defaultInvestorId, // Using default investor for general videos
      },
    });

    // Revalidate the profile page
    revalidatePath("/profile");

    return {
      success: true,
      url: result.url,
      message: "Video uploaded successfully",
    };
  } catch (error) {
    console.error("Video upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload video",
    };
  }
}

export async function getStartupVideos(startupId: string) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Verify the startup belongs to the user
    const startup = await prisma.startups.findFirst({
      where: {
        id: startupId,
        user_id: user.id,
      },
    });

    if (!startup) {
      throw new Error("Startup not found or access denied");
    }

    const videos = await prisma.video_pitches.findMany({
      where: {
        startup_id: startupId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        video_url: true,
        duration_in_seconds: true,
        pitch_status: true,
        date_sent: true,
      },
      orderBy: {
        date_sent: "desc",
      },
    });

    return { success: true, videos };
  } catch (error) {
    console.error("Get videos error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch videos",
      videos: [],
    };
  }
}

export async function deleteVideo(videoId: number) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Verify the video belongs to the user's startup
    const video = await prisma.video_pitches.findFirst({
      where: {
        id: videoId,
        startups: {
          user_id: user.id,
        },
      },
    });

    if (!video) {
      throw new Error("Video not found or access denied");
    }

    // Delete from database
    await prisma.video_pitches.delete({
      where: { id: videoId },
    });

    // Note: In a production app, you might also want to delete the file from Vercel Blob
    // This would require additional API calls to Vercel Blob's delete endpoint

    // Revalidate the profile page
    revalidatePath("/profile");

    return { success: true, message: "Video deleted successfully" };
  } catch (error) {
    console.error("Delete video error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete video",
    };
  }
}
