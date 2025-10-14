"use server";

import { stackServerApp } from "@/stack";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import {
  triggerMatching,
  isProfileCompleteForMatching,
} from "@/lib/matching-algorithm";
import type {
  investors as InvestorProfile,
  startups as StartupProfile,
  development_stage_enum,
  involvement_level_enum,
} from "@prisma/client";

type readProfileType =
  | { ok: true; profile: InvestorProfile | StartupProfile }
  | { ok: false; error: string };

type readAllStartupProfilesType =
  | { ok: true; profiles: StartupProfile[] }
  | { ok: false; error: string };

type updateProfileType =
  | { ok: true; profile: StartupProfile | InvestorProfile }
  | { ok: false; error: string };

export async function readProfile(): Promise<readProfileType> {
  const user = await stackServerApp.getUser();

  if (!user) {
    return { ok: false, error: "No user found" };
  }

  if (user.serverMetadata.userType === "Investor") {
    const investorProfile = await prisma.investors.findFirst({
      where: { user_id: user.id },
      include: {
        users_sync: true,
      },
    });

    if (!investorProfile) {
      return { ok: false, error: "Investor profile not found" };
    }

    return { ok: true, profile: investorProfile };
  }

  if (user.serverMetadata.userType === "Startup") {
    const startupProfile = await prisma.startups.findFirst({
      where: { user_id: user.id },
      include: {
        users_sync: true,
      },
    });

    if (!startupProfile) {
      return { ok: false, error: "Startup profile not found" };
    }

    return { ok: true, profile: startupProfile };
  }

  return { ok: false, error: "An unexpected error occurred" };
}

export async function readAllStartupProfiles(): Promise<readAllStartupProfilesType> {
  const user = await stackServerApp.getUser();

  if (!user) {
    return { ok: false, error: "No user found" };
  }

  if (user.serverMetadata.userType !== "Startup") {
    return { ok: false, error: "User is not a startup" };
  }

  try {
    const startupProfiles = await prisma.startups.findMany({
      where: { user_id: user.id },
      include: {
        users_sync: true,
      },
    });

    return { ok: true, profiles: startupProfiles };
  } catch (error) {
    console.error("Error fetching startup profiles:", error);
    return { ok: false, error: "Failed to fetch startup profiles" };
  }
}

// Server action: replace a verification document for a Startup
export async function replaceStartupDocument(formData: FormData) {
  const user = await stackServerApp.getUser();
  if (!user) {
    return { ok: false, error: "No user found" } as const;
  }

  if (user.serverMetadata.userType !== "Startup") {
    return { ok: false, error: "User is not a startup" } as const;
  }

  try {
    const file = formData.get("file") as File | null;
    const docType = formData.get("docType") as
      | "validId"
      | "birCor"
      | "proofOfBank"
      | null;

    if (!file) return { ok: false, error: "No file provided" } as const;
    if (!docType) return { ok: false, error: "Missing document type" } as const;

    // File size limit (4MB per file)
    const MAX_FILE_SIZE = 4 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return {
        ok: false,
        error: `File must be smaller than 4MB. Current size: ${(
          file.size /
          1024 /
          1024
        ).toFixed(2)}MB`,
      } as const;
    }

    // Ensure startup profile exists
    const existingProfile = await prisma.startups.findFirst({
      where: { user_id: user.id },
    });
    if (!existingProfile) {
      return { ok: false, error: "Startup profile not found" } as const;
    }

    // Upload to Vercel Blob (ensure content length is known by passing a Blob)
    const extension = (file.name.split(".").pop() || "").toLowerCase();
    const safeExt = extension ? `.${extension}` : "";
    const fileName = `${user.id}/startup-${docType}-${randomUUID()}${safeExt}`;
    const arrayBuffer = await file.arrayBuffer();
    const uploaded = await put(fileName, Buffer.from(arrayBuffer), {
      access: "public",
      contentType: file.type || "application/octet-stream",
    });

    // Check if the user was previously rejected
    const wasRejected =
      user.serverMetadata?.legalVerified === false &&
      user.serverMetadata?.rejectedAt;

    // Map docType to column
    const dataUpdate: Record<string, string | null> = {};
    if (docType === "validId") dataUpdate["govt_id_image_url"] = uploaded.url;
    if (docType === "birCor") dataUpdate["bir_cor_image_url"] = uploaded.url;
    if (docType === "proofOfBank")
      dataUpdate["proof_of_bank_image_url"] = uploaded.url;

    // If user was rejected, reset legal_verified to null (pending status)
    if (wasRejected) {
      dataUpdate["legal_verified"] = null;
    }

    const updated = await prisma.startups.update({
      where: { id: existingProfile.id },
      data: dataUpdate,
    });

    // If the user was previously rejected, clear rejection status in database and Stack Auth
    if (wasRejected) {
      try {
        // Clear rejection metadata from database
        await prisma.$executeRaw`
          UPDATE neon_auth.users_sync 
          SET raw_json = raw_json 
            #- '{server_metadata,legalVerified}'
            #- '{server_metadata,rejectedAt}'
            #- '{server_metadata,rejectionReason}'
          WHERE id = ${user.id}
        `;

        // Clear rejection metadata from Stack Auth user
        await user.update({
          serverMetadata: {
            ...user.serverMetadata,
            legalVerified: undefined,
            rejectedAt: undefined,
            rejectionReason: undefined,
          },
        });

        console.log(
          "Cleared rejection status for startup document upload:",
          user.id
        );
      } catch (clearError) {
        console.error("Error clearing rejection status:", clearError);
        // Don't fail the document upload if clearing rejection status fails
      }
    }

    revalidatePath("/profile");
    revalidatePath("/profile/edit");
    revalidatePath("/home");

    return { ok: true, url: uploaded.url, profile: updated } as const;
  } catch (error) {
    console.error("Error replacing startup document:", error);
    return { ok: false, error: "Failed to upload/replace document" } as const;
  }
}

// Server action: replace a verification document for an Investor
export async function replaceInvestorDocument(formData: FormData) {
  const user = await stackServerApp.getUser();
  if (!user) {
    return { ok: false, error: "No user found" } as const;
  }

  if (user.serverMetadata.userType !== "Investor") {
    return { ok: false, error: "User is not an investor" } as const;
  }

  try {
    const file = formData.get("file") as File | null;
    const docType = formData.get("docType") as
      | "validId"
      | "selfie"
      | "proofOfBank"
      | null;

    if (!file) return { ok: false, error: "No file provided" } as const;
    if (!docType) return { ok: false, error: "Missing document type" } as const;

    // File size limit (4MB per file)
    const MAX_FILE_SIZE = 4 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return {
        ok: false,
        error: `File must be smaller than 4MB. Current size: ${(
          file.size /
          1024 /
          1024
        ).toFixed(2)}MB`,
      } as const;
    }

    // Ensure investor profile exists
    const existingProfile = await prisma.investors.findFirst({
      where: { user_id: user.id },
    });
    if (!existingProfile) {
      return { ok: false, error: "Investor profile not found" } as const;
    }

    // Upload to Vercel Blob (ensure content length is known by passing a Blob)
    const extension = (file.name.split(".").pop() || "").toLowerCase();
    const safeExt = extension ? `.${extension}` : "";
    const fileName = `${user.id}/investor-${docType}-${randomUUID()}${safeExt}`;
    const arrayBuffer = await file.arrayBuffer();
    const uploaded = await put(fileName, Buffer.from(arrayBuffer), {
      access: "public",
      contentType: file.type || "application/octet-stream",
    });

    // Check if the user was previously rejected
    const wasRejected =
      user.serverMetadata?.legalVerified === false &&
      user.serverMetadata?.rejectedAt;

    // Map docType to column
    const dataUpdate: Record<string, string> = {};
    if (docType === "validId") dataUpdate["govt_id_image_url"] = uploaded.url;
    if (docType === "selfie") dataUpdate["selfie_image_url"] = uploaded.url;
    if (docType === "proofOfBank")
      dataUpdate["proof_of_bank_image_url"] = uploaded.url;

    const updated = await prisma.investors.update({
      where: { id: existingProfile.id },
      data: dataUpdate,
    });

    // If the user was previously rejected, clear rejection status in database and Stack Auth
    if (wasRejected) {
      try {
        // Clear rejection metadata from database
        await prisma.$executeRaw`
          UPDATE neon_auth.users_sync 
          SET raw_json = raw_json 
            #- '{server_metadata,legalVerified}'
            #- '{server_metadata,rejectedAt}'
            #- '{server_metadata,rejectionReason}'
          WHERE id = ${user.id}
        `;

        // Clear rejection metadata from Stack Auth user
        await user.update({
          serverMetadata: {
            ...user.serverMetadata,
            legalVerified: undefined,
            rejectedAt: undefined,
            rejectionReason: undefined,
          },
        });

        console.log(
          "Cleared rejection status for investor document upload:",
          user.id
        );
      } catch (clearError) {
        console.error("Error clearing rejection status:", clearError);
        // Don't fail the document upload if clearing rejection status fails
      }
    }

    revalidatePath("/profile");
    revalidatePath("/profile/edit");
    revalidatePath("/home");

    return { ok: true, url: uploaded.url, profile: updated } as const;
  } catch (error) {
    console.error("Error replacing investor document:", error);
    return { ok: false, error: "Failed to upload/replace document" } as const;
  }
}

// Define types for complex fields
type TeamMember = {
  name: string;
  position: string;
  linkedin?: string;
  bio?: string;
};

type Advisor = {
  name: string;
  position?: string;
  company?: string;
  linkedin?: string;
  expertise?: string;
};

type KeyMetric = {
  metric_name: string;
  value: string | number;
  period?: string;
  description?: string;
};

type NotableExit = {
  company_name: string;
  exit_type: string;
  exit_value?: string | number;
  exit_date?: string;
  description?: string;
};

export async function updateStartupProfile(data: {
  name?: string;
  description?: string;
  industry?: string;
  city?: string;
  website?: string;
  date_founded?: Date | null;
  product_demo_url?: string;
  development_stage?: development_stage_enum | null;
  target_market?: string[];
  keywords?: string[];
  team_members?: TeamMember[];
  advisors?: Advisor[];
  key_metrics?: KeyMetric[];
}): Promise<updateProfileType> {
  const user = await stackServerApp.getUser();

  if (!user) {
    return { ok: false, error: "No user found" };
  }

  if (user.serverMetadata.userType !== "Startup") {
    return { ok: false, error: "User is not a startup" };
  }

  try {
    // First check if the startup profile exists
    const existingProfile = await prisma.startups.findFirst({
      where: { user_id: user.id },
    });

    if (!existingProfile) {
      return { ok: false, error: "Startup profile not found" };
    }

    // Check if the user was previously rejected
    const wasRejected =
      user.serverMetadata?.legalVerified === false &&
      user.serverMetadata?.rejectedAt;

    // Update the startup profile
    const updatedProfile = await prisma.startups.update({
      where: { id: existingProfile.id },
      data: {
        name: data.name,
        description: data.description,
        industry: data.industry,
        city: data.city,
        website_url: data.website,
        date_founded: data.date_founded,
        product_demo_url: data.product_demo_url,
        development_stage: data.development_stage,
        target_market: data.target_market,
        keywords: data.keywords,
        team_members: data.team_members,
        advisors: data.advisors,
        key_metrics: data.key_metrics,
        // If user was rejected, reset legal_verified to null (pending status)
        legal_verified: wasRejected ? null : existingProfile.legal_verified,
      },
    });

    // If the user was previously rejected, clear rejection status in database and Stack Auth
    if (wasRejected) {
      try {
        // Clear rejection metadata from database
        await prisma.$executeRaw`
          UPDATE neon_auth.users_sync 
          SET raw_json = raw_json 
            #- '{server_metadata,legalVerified}'
            #- '{server_metadata,rejectedAt}'
            #- '{server_metadata,rejectionReason}'
          WHERE id = ${user.id}
        `;

        // Clear rejection metadata from Stack Auth user
        await user.update({
          serverMetadata: {
            ...user.serverMetadata,
            legalVerified: undefined,
            rejectedAt: undefined,
            rejectionReason: undefined,
          },
        });

        console.log("Cleared rejection status for startup:", user.id);
      } catch (clearError) {
        console.error("Error clearing rejection status:", clearError);
        // Don't fail the profile update if clearing rejection status fails
      }
    }

    // Revalidate the profile page to ensure fresh data
    revalidatePath("/profile");
    revalidatePath("/profile/edit");
    revalidatePath("/home");

    // Trigger matching algorithm if profile is complete enough
    try {
      if (isProfileCompleteForMatching(updatedProfile, "Startup")) {
        await triggerMatching(updatedProfile.id, "Startup");
        console.log(
          "Matching algorithm triggered for startup:",
          updatedProfile.id
        );
      }
    } catch (error) {
      console.error("Error triggering matching algorithm:", error);
      // Don't fail the profile update if matching fails
    }

    return { ok: true, profile: updatedProfile };
  } catch (error) {
    console.error("Error updating startup profile:", error);
    return { ok: false, error: "Failed to update startup profile" };
  }
}

export async function updateInvestorProfile(data: {
  organization?: string;
  position?: string;
  city?: string;
  organization_website?: string;
  investor_linkedin?: string;
  typical_check_size_in_php?: bigint | null;
  decision_period_in_weeks?: number | null;
  involvement_level?: involvement_level_enum | null;
  key_contact_person_name?: string;
  key_contact_linkedin?: string;
  key_contact_number?: string;
  preferred_industries?: string[];
  excluded_industries?: string[];
  preferred_business_models?: string[];
  preferred_funding_stages?: string[];
  geographic_focus?: string[];
  value_proposition?: string[];
  portfolio_companies?: string[];
  notable_exits?: NotableExit[];
}): Promise<updateProfileType> {
  const user = await stackServerApp.getUser();

  if (!user) {
    return { ok: false, error: "No user found" };
  }

  if (user.serverMetadata.userType !== "Investor") {
    return { ok: false, error: "User is not an investor" };
  }

  try {
    // First check if the investor profile exists
    const existingProfile = await prisma.investors.findFirst({
      where: { user_id: user.id },
    });

    if (!existingProfile) {
      return { ok: false, error: "Investor profile not found" };
    }

    // Check if the user was previously rejected
    const wasRejected =
      user.serverMetadata?.legalVerified === false &&
      user.serverMetadata?.rejectedAt;

    // Update the investor profile
    const updatedProfile = await prisma.investors.update({
      where: { id: existingProfile.id },
      data: {
        organization: data.organization,
        position: data.position,
        city: data.city,
        organization_website: data.organization_website,
        investor_linkedin: data.investor_linkedin,
        typical_check_size_in_php: data.typical_check_size_in_php,
        decision_period_in_weeks: data.decision_period_in_weeks,
        involvement_level: data.involvement_level,
        key_contact_person_name: data.key_contact_person_name,
        key_contact_linkedin: data.key_contact_linkedin,
        key_contact_number: data.key_contact_number,
        preferred_industries: data.preferred_industries,
        excluded_industries: data.excluded_industries,
        preferred_business_models: data.preferred_business_models,
        preferred_funding_stages: data.preferred_funding_stages,
        geographic_focus: data.geographic_focus,
        value_proposition: data.value_proposition,
        portfolio_companies: data.portfolio_companies,
        notable_exits: data.notable_exits,
      },
    });

    // If the user was previously rejected, clear rejection status in database and Stack Auth
    if (wasRejected) {
      try {
        // Clear rejection metadata from database
        await prisma.$executeRaw`
          UPDATE neon_auth.users_sync 
          SET raw_json = raw_json 
            #- '{server_metadata,legalVerified}'
            #- '{server_metadata,rejectedAt}'
            #- '{server_metadata,rejectionReason}'
          WHERE id = ${user.id}
        `;

        // Clear rejection metadata from Stack Auth user
        await user.update({
          serverMetadata: {
            ...user.serverMetadata,
            legalVerified: undefined,
            rejectedAt: undefined,
            rejectionReason: undefined,
          },
        });

        console.log("Cleared rejection status for investor:", user.id);
      } catch (clearError) {
        console.error("Error clearing rejection status:", clearError);
        // Don't fail the profile update if clearing rejection status fails
      }
    }

    // Revalidate the profile page to ensure fresh data
    revalidatePath("/profile");
    revalidatePath("/profile/edit");
    revalidatePath("/home");

    // Trigger matching algorithm if profile is complete enough
    try {
      if (isProfileCompleteForMatching(updatedProfile, "Investor")) {
        await triggerMatching(updatedProfile.id, "Investor");
        console.log(
          "Matching algorithm triggered for investor:",
          updatedProfile.id
        );
      }
    } catch (error) {
      console.error("Error triggering matching algorithm:", error);
      // Don't fail the profile update if matching fails
    }

    return { ok: true, profile: updatedProfile };
  } catch (error) {
    console.error("Error updating investor profile:", error);
    return { ok: false, error: "Failed to update investor profile" };
  }
}

export async function changeCurrentStartup(newStartupId: string) {
  const user = await stackServerApp.getUser();

  if (!user) {
    return { ok: false, error: "No user found" };
  }

  try {
    // Update the user's current startup profile
    await user.update({
      serverMetadata: {
        ...user.serverMetadata,
        currentProfileId: newStartupId,
      },
    });

    return { ok: true };
  } catch (error) {
    console.error("Error changing current startup:", error);
    return { ok: false, error: "Failed to change current startup" };
  }
}
