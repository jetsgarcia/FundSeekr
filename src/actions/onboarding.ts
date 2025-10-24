"use server";

import { put } from "@vercel/blob";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { stackServerApp } from "@/stack";
import { randomUUID } from "crypto";

// Save investor step 2 data
export async function saveInvestorStep2Data(formData: {
  name: string;
  phone_number: string;
  city: string;
  organization?: string;
  position?: string;
  organization_website?: string;
  investor_linkedin?: string;
  key_contact_person_name: string;
  key_contact_linkedin?: string;
  key_contact_number: string;
  tin: string;
}) {
  try {
    // Get authenticated user
    const user = await stackServerApp.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const userId = user.id;

    // Convert TIN to number (remove any formatting)
    const tinNumber = parseInt(formData.tin.replace(/[-\s]/g, ""));
    if (isNaN(tinNumber)) {
      throw new Error("Invalid TIN format");
    }

    // Check if investor record already exists for this user
    const existingInvestor = await prisma.investors.findFirst({
      where: { user_id: userId },
    });

    let investor;
    if (existingInvestor) {
      // Update existing record
      investor = await prisma.investors.update({
        where: { id: existingInvestor.id },
        data: {
          organization: formData.organization || null,
          position: formData.position || null,
          city: formData.city,
          organization_website: formData.organization_website || null,
          investor_linkedin: formData.investor_linkedin || null,
          key_contact_person_name: formData.key_contact_person_name,
          key_contact_linkedin: formData.key_contact_linkedin || null,
          key_contact_number: formData.key_contact_number,
          tin: tinNumber,
          phone_number: formData.phone_number,
        },
      });
    } else {
      // Create new record
      investor = await prisma.investors.create({
        data: {
          id: randomUUID(),
          user_id: userId,
          organization: formData.organization || null,
          position: formData.position || null,
          city: formData.city,
          organization_website: formData.organization_website || null,
          investor_linkedin: formData.investor_linkedin || null,
          key_contact_person_name: formData.key_contact_person_name,
          key_contact_linkedin: formData.key_contact_linkedin || null,
          key_contact_number: formData.key_contact_number,
          tin: tinNumber,
          phone_number: formData.phone_number,
          // Placeholder values for required fields that will be filled in step 3
          govt_id_image_url: "",
          selfie_image_url: "",
          proof_of_bank_image_url: "",
        },
      });
    }

    // Update user display name if provided
    if (formData.name.trim()) {
      await user.update({
        displayName: formData.name.trim(),
      });
    }

    return { success: true, data: investor };
  } catch (error) {
    console.error("Error saving investor step 2 data:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to save investor data"
    );
  }
}

// Save investor step 3 data
export async function saveInvestorStep3Data(formData: {
  typical_check_size_in_php: string;
  preferred_industries: string[];
  excluded_industries: string[];
  preferred_business_models: string[];
  preferred_funding_stages: string[];
  geographic_focus: string[];
  value_proposition: string[];
  involvement_level: string;
  portfolio_companies: string[];
  decision_period_in_weeks?: number;
  notable_exits?: Array<{
    company: string;
    exit_type: string;
    amount?: string;
  }>;
}) {
  try {
    // Get authenticated user
    const user = await stackServerApp.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const userId = user.id;

    // Convert typical check size to BigInt (for PHP currency)
    const checkSizeNumber = parseInt(formData.typical_check_size_in_php);
    if (isNaN(checkSizeNumber) || checkSizeNumber <= 0) {
      throw new Error("Invalid typical check size");
    }

    // Validate involvement level enum
    const validInvolvementLevels = [
      "Hands_off",
      "Advisor",
      "Active",
      "Controlling",
    ];
    if (!validInvolvementLevels.includes(formData.involvement_level)) {
      throw new Error("Invalid involvement level");
    }

    // Check if investor record exists for this user
    const existingInvestor = await prisma.investors.findFirst({
      where: { user_id: userId },
    });

    if (!existingInvestor) {
      throw new Error(
        "Investor record not found. Please complete step 2 first."
      );
    }

    // Update existing investor record with step 3 data
    const investor = await prisma.investors.update({
      where: { id: existingInvestor.id },
      data: {
        typical_check_size_in_php: BigInt(checkSizeNumber),
        preferred_industries: formData.preferred_industries,
        excluded_industries: formData.excluded_industries,
        preferred_business_models: formData.preferred_business_models,
        preferred_funding_stages: formData.preferred_funding_stages,
        geographic_focus: formData.geographic_focus,
        value_proposition: formData.value_proposition,
        involvement_level: formData.involvement_level as
          | "Hands_off"
          | "Advisor"
          | "Active"
          | "Controlling",
        portfolio_companies: formData.portfolio_companies,
        decision_period_in_weeks: formData.decision_period_in_weeks || null,
        notable_exits: formData.notable_exits || [],
      },
    });

    return { success: true, data: investor };
  } catch (error) {
    console.error("Error saving investor step 3 data:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to save investment preferences"
    );
  }
}

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

    // Validate required files per user type
    if (!validIdUrl) {
      throw new Error("Valid ID must be uploaded");
    }

    if (userType === "investor") {
      if (!proofOfBankUrl) {
        throw new Error("Proof of Bank must be uploaded for investors");
      }
      if (!selfieUrl) {
        throw new Error("Selfie must be uploaded for investors");
      }
    }

    if (userType === "startup") {
      if (!birCorUrl) {
        throw new Error("BIR/COR document must be uploaded for startups");
      }
      // Note: Proof of Bank is optional for startups
    }

    const userId = user.id;
    const profileId = randomUUID(); // Generate UUID for database record

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
          id: profileId,
          user_id: userId,
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
          // Document URLs (Proof of Bank is optional for startups)
          govt_id_image_url: validIdUrl,
          proof_of_bank_image_url: proofOfBankUrl || null,
          bir_cor_image_url: birCorUrl || "",
          documents: [],
        },
        create: {
          id: profileId,
          user_id: userId,
          name: name || businessName || null,
          business_structure: businessStructure,
          // Document URLs (Proof of Bank is optional for startups)
          govt_id_image_url: validIdUrl,
          proof_of_bank_image_url: proofOfBankUrl || null,
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
          currentProfileId: profileId,
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
