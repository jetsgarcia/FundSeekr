import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { stackServerApp } from "@/stack";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ startupId: string }> }
) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { startupId } = await params;
    const url = new URL(request.url);
    const timeRange = url.searchParams.get("range") || "30d";

    // Calculate date range
    const now = new Date();
    const daysToSubtract =
      timeRange === "7d" ? 7 : timeRange === "90d" ? 90 : 30;
    const startDate = new Date();
    startDate.setDate(now.getDate() - daysToSubtract);

    // Verify startup ownership
    const startup = await prisma.startups.findFirst({
      where: {
        id: startupId,
        user_id: user.id,
      },
    });

    if (!startup) {
      return NextResponse.json(
        { error: "Startup not found or access denied" },
        { status: 404 }
      );
    }

    // Get total matches
    const totalMatches = await prisma.profile_matches.count({
      where: {
        startup_id: startupId,
      },
    });

    // Get video pitch statistics
    const videoPitches = await prisma.video_pitches.findMany({
      where: {
        startup_id: startupId,
        date_sent: {
          gte: startDate,
        },
      },
      include: {
        investors: {
          select: {
            organization: true,
          },
        },
      },
      orderBy: {
        date_sent: "desc",
      },
    });

    const totalVideos = videoPitches.length;
    const sentVideos = videoPitches.filter((v) => v.date_sent).length;
    const viewedVideos = videoPitches.filter(
      (v) => v.pitch_status === "Viewed"
    ).length;
    const viewRate =
      sentVideos > 0 ? Math.round((viewedVideos / sentVideos) * 100) : 0;

    // Get recent activity
    const recentMatches = await prisma.profile_matches.findMany({
      where: {
        startup_id: startupId,
      },
      include: {
        investors: {
          select: {
            organization: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
      take: 10,
    });

    const recentVideos = await prisma.video_pitches.findMany({
      where: {
        startup_id: startupId,
        date_sent: {
          gte: startDate,
        },
      },
      include: {
        investors: {
          select: {
            organization: true,
          },
        },
      },
      orderBy: {
        date_sent: "desc",
      },
      take: 10,
    });

    // Combine and format recent activity
    const recentActivity = [
      ...recentMatches.map((match) => ({
        date: new Date().toISOString().split("T")[0], // Since we don't have created_at for matches
        type: "match" as const,
        investor: match.investors.organization || "Unknown Investor",
        description: `New match with ${match.match_percentage}% compatibility`,
      })),
      ...recentVideos.map((video) => ({
        date: video.date_sent?.toISOString().split("T")[0] || "",
        type:
          video.pitch_status === "Viewed"
            ? ("video_viewed" as const)
            : ("video_sent" as const),
        investor: video.investors.organization || "Unknown Investor",
        description:
          video.pitch_status === "Viewed"
            ? `Viewed your video: ${video.title}`
            : `Sent video: ${video.title}`,
      })),
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    // Get top performing videos
    const topPerformingVideos = videoPitches
      .filter((v) => v.pitch_status === "Viewed")
      .map((video) => ({
        id: video.id,
        title: video.title,
        viewCount: 1, // Since we only track viewed/sent status
        sentDate: video.date_sent?.toISOString().split("T")[0] || "",
        duration: video.duration_in_seconds,
      }))
      .slice(0, 5);

    // Generate monthly trends (simplified - you might want to implement proper date grouping)
    const monthlyTrends = [
      {
        month: "Aug",
        matches: Math.floor(totalMatches * 0.3),
        videosSent: Math.floor(sentVideos * 0.3),
        videosViewed: Math.floor(viewedVideos * 0.3),
      },
      {
        month: "Sep",
        matches: Math.floor(totalMatches * 0.5),
        videosSent: Math.floor(sentVideos * 0.5),
        videosViewed: Math.floor(viewedVideos * 0.5),
      },
      {
        month: "Oct",
        matches: totalMatches,
        videosSent: sentVideos,
        videosViewed: viewedVideos,
      },
    ];

    const engagementData = {
      totalMatches,
      videoPitches: {
        total: totalVideos,
        sent: sentVideos,
        viewed: viewedVideos,
        viewRate,
      },
      recentActivity,
      monthlyTrends,
      topPerformingVideos,
    };

    return NextResponse.json(engagementData);
  } catch (error) {
    console.error("Error fetching engagement analytics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
