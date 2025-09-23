"use server";

import { put } from "@vercel/blob";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { stackServerApp } from "@/stack";

// Individual file upload action
export async function uploadFile(formData: FormData) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const file = formData.get("file") as File | null;
    const fileType = formData.get("fileType") as string;

    if (!file) {
      throw new Error("No file provided");
    }

    // File size limit (4MB per file)
    const MAX_FILE_SIZE = 4 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(
        `File must be smaller than 4MB. Current size: ${(
          file.size /
          1024 /
          1024
        ).toFixed(2)}MB`
      );
    }

    // Generate unique filename
    const userId = user.id;
    const timestamp = Date.now();
    const extension = file.name.split(".").pop();
    const fileName = `${userId}/${fileType}-${timestamp}.${extension}`;

    // Upload to Vercel Blob
    const result = await put(fileName, file, { access: "public" });

    return { success: true, url: result.url, fileType };
  } catch (error) {
    console.error("File upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload file",
    };
  }
}

export async function submitOnboarding(formData: FormData) {
  try {
    // Get authenticated user
    const user = await stackServerApp.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Extract form data
    const userType = formData.get("userType") as "investor" | "startup";
    const businessStructure = formData.get("businessStructure") as
      | "Sole"
      | "Partnership"
      | "Corporation"
      | null;

    // Extract user info
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const fullName =
      firstName && lastName ? `${firstName} ${lastName}`.trim() : "";
    const organization = formData.get("organization") as string;
    const linkedinURL = formData.get("linkedinURL") as string;
    const position = formData.get("position") as string;
    const name = formData.get("name") as string;

    // Extract step 3 data
    const tin = formData.get("tin") as string;
    const businessName = formData.get("businessName") as string;

    // Extract file URLs (these should be uploaded separately)
    const validIdUrl = formData.get("validIdUrl") as string;
    const proofOfBankUrl = formData.get("proofOfBankUrl") as string;
    const selfieUrl = formData.get("selfieUrl") as string;
    const birCorUrl = formData.get("birCorUrl") as string;

    // Validate required file URLs
    if (!validIdUrl || !proofOfBankUrl) {
      throw new Error("Valid ID and Proof of Bank files must be uploaded");
    }

    if (userType === "investor" && !selfieUrl) {
      throw new Error("Selfie must be uploaded for investors");
    }

    if (userType === "startup" && !birCorUrl) {
      throw new Error("BIR/COR document must be uploaded for startups");
    }

    const userId = user.id;

    // Save to database based on user type
    if (userType === "investor") {
      await prisma.investors.upsert({
        where: { id: userId },
        update: {
          organization: organization || null,
          position: position || null,
          investor_linkedin: linkedinURL || null,
          // Document URLs
          govt_id_image_url: validIdUrl,
          proof_of_bank_image_url: proofOfBankUrl,
          selfie_image_url: selfieUrl || "",
          // TIN is required for investors
          tin: tin ? parseInt(tin) : 0,
        },
        create: {
          id: userId,
          user_id: user.id,
          organization: organization || null,
          position: position || null,
          investor_linkedin: linkedinURL || null,
          // Document URLs
          govt_id_image_url: validIdUrl,
          proof_of_bank_image_url: proofOfBankUrl,
          selfie_image_url: selfieUrl || "",
          // TIN is required for investors
          tin: tin ? parseInt(tin) : 0,
        },
      });

      // Set user metadata
      await user.update({
        displayName: fullName,
        serverMetadata: {
          userType: "Investor",
          onboarded: true,
        },
      });
    } else if (userType === "startup") {
      await prisma.startups.upsert({
        where: { id: userId },
        update: {
          name: name || businessName || null,
          business_structure: businessStructure,
          // Document URLs
          govt_id_image_url: validIdUrl,
          proof_of_bank_image_url: proofOfBankUrl,
          bir_cor_image_url: birCorUrl || "",
          documents: [],
        },
        create: {
          id: userId,
          user_id: user.id,
          name: name || businessName || null,
          business_structure: businessStructure,
          // Document URLs
          govt_id_image_url: validIdUrl,
          proof_of_bank_image_url: proofOfBankUrl,
          bir_cor_image_url: birCorUrl || "",
          documents: [],
        },
      });

      // Set user metadata
      await user.update({
        displayName: fullName,
        serverMetadata: {
          userType: "Startup",
          onboarded: true,
        },
      });
    }
  } catch (error) {
    console.error("Onboarding submission error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to submit onboarding"
    );
  }

  // Revalidate and redirect outside of try-catch to avoid catching redirect errors
  revalidatePath("/home");
  redirect("/home");
}
