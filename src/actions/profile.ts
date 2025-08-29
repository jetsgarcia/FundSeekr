import { stackServerApp } from "@/stack";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type {
  investors as InvestorProfile,
  startups as StartupProfile,
} from "@prisma/client";

type readProfileType =
  | { ok: true; profile: InvestorProfile | StartupProfile }
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

export async function updateStartupProfile(data: {
  name?: string;
  description?: string;
  industry?: string;
  city?: string;
  website?: string;
  valuation?: number | null;
  date_founded?: Date | null;
  product_demo_url?: string;
  development_stage?: string | null;
  target_market?: string[];
  keywords?: string[];
  team_members?: any[];
  advisors?: any[];
  key_metrics?: any[];
  intellectual_property?: any[];
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

    // Update the startup profile
    const updatedProfile = await prisma.startups.update({
      where: { id: existingProfile.id },
      data: {
        name: data.name,
        description: data.description,
        industry: data.industry,
        city: data.city,
        website: data.website,
        valuation: data.valuation,
        date_founded: data.date_founded,
        product_demo_url: data.product_demo_url,
        development_stage: data.development_stage as any, 
        target_market: data.target_market,
        keywords: data.keywords,
        team_members: data.team_members,
        advisors: data.advisors,
        key_metrics: data.key_metrics,
        intellectual_property: data.intellectual_property,
      },
    });

    // Revalidate the profile page to ensure fresh data
    revalidatePath("/profile");
    revalidatePath("/profile/edit");

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
  investor_type?: string | null;
  involvement_level?: string | null;
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
  notable_exits?: any[];
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
        investor_type: data.investor_type as any, // Cast to enum
        involvement_level: data.involvement_level as any, // Cast to enum
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

    // Revalidate the profile page to ensure fresh data
    revalidatePath("/profile");
    revalidatePath("/profile/edit");

    return { ok: true, profile: updatedProfile };
  } catch (error) {
    console.error("Error updating investor profile:", error);
    return { ok: false, error: "Failed to update investor profile" };
  }
}
