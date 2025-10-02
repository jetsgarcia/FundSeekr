"use server";

import { stackServerApp } from "@/stack";
import prisma from "@/lib/prisma";

// Define types for the profile data
export interface StartupProfile {
  id: string;
  name: string | null;
  description: string | null;
  target_market: string[];
  city: string | null;
  date_founded: Date | null;
  industry: string | null;
  website_url: string | null;
  keywords: string[];
  product_demo_url: string | null;
  key_metrics: KeyMetric[];
  team_members: TeamMember[];
  advisors: Advisor[];
  development_stage: string | null;
  business_structure: string | null;
  documents: Document[];
  govt_id_image_url: string;
  bir_cor_image_url: string;
  proof_of_bank_image_url: string | null;
}

export interface InvestorProfile {
  id: string;
  organization: string | null;
  position: string | null;
  city: string | null;
  organization_website: string | null;
  investor_linkedin: string | null;
  decision_period_in_weeks: number | null;
  typical_check_size_in_php: bigint | null;
  preferred_industries: string[];
  excluded_industries: string[];
  preferred_business_models: string[];
  preferred_funding_stages: string[];
  geographic_focus: string[];
  value_proposition: string[];
  involvement_level: string | null;
  portfolio_companies: string[];
  notable_exits: NotableExit[];
  key_contact_person_name: string | null;
  key_contact_linkedin: string | null;
  key_contact_number: string | null;
  govt_id_image_url: string;
  selfie_image_url: string;
  proof_of_bank_image_url: string;
  tin: number;
  users_sync: {
    name: string | null;
    email: string | null;
  } | null;
}

export interface KeyMetric {
  name?: string;
  metric?: string;
  value: string;
  description?: string;
}

export interface TeamMember {
  name: string;
  position?: string;
  role?: string;
  linkedin?: string;
}

export interface Advisor {
  name: string;
  position?: string;
  role?: string;
  company?: string;
}

export interface Document {
  name?: string;
  title?: string;
  url: string;
}

export interface NotableExit {
  company?: string;
  name?: string;
  exit_value?: string;
  year?: string;
}

type ProfileDataResult =
  | {
      ok: true;
      data: StartupProfile | InvestorProfile;
    }
  | { 
      ok: false; 
      error: string; 
    };

export async function getProfileData(
  profileId: string, 
  profileType: "startup" | "investor"
): Promise<ProfileDataResult> {
  try {
    // Get current user for authorization
    const user = await stackServerApp.getUser();
    
    if (!user) {
      return { ok: false, error: "Not authenticated" };
    }

    // Check if user is legally verified
    const dbUser = await prisma.users_sync.findUnique({
      where: { id: user.id },
      select: { raw_json: true },
    });

    const dbLegalVerified =
      dbUser?.raw_json &&
      typeof dbUser.raw_json === "object" &&
      dbUser.raw_json !== null &&
      "server_metadata" in dbUser.raw_json &&
      dbUser.raw_json.server_metadata &&
      typeof dbUser.raw_json.server_metadata === "object" &&
      "legalVerified" in dbUser.raw_json.server_metadata
        ? dbUser.raw_json.server_metadata.legalVerified
        : false;

    const legalVerified = dbLegalVerified ?? user?.serverMetadata?.legalVerified;

    if (!legalVerified) {
      return { ok: false, error: "User not verified" };
    }

    if (profileType === "startup") {
      const startup = await prisma.startups.findUnique({
        where: { id: profileId },
        include: {
          users_sync: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      if (!startup) {
        return { ok: false, error: "Startup not found" };
      }

      const startupProfile: StartupProfile = {
        id: startup.id,
        name: startup.name,
        description: startup.description,
        target_market: startup.target_market,
        city: startup.city,
        date_founded: startup.date_founded,
        industry: startup.industry,
        website_url: startup.website_url,
        keywords: startup.keywords,
        product_demo_url: startup.product_demo_url,
        key_metrics: (startup.key_metrics as unknown) as KeyMetric[],
        team_members: (startup.team_members as unknown) as TeamMember[],
        advisors: (startup.advisors as unknown) as Advisor[],
        development_stage: startup.development_stage,
        business_structure: startup.business_structure,
        documents: (startup.documents as unknown) as Document[],
        govt_id_image_url: startup.govt_id_image_url,
        bir_cor_image_url: startup.bir_cor_image_url,
        proof_of_bank_image_url: startup.proof_of_bank_image_url,
      };

      return { ok: true, data: startupProfile };
    } else {
      const investor = await prisma.investors.findUnique({
        where: { id: profileId },
        include: {
          users_sync: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      if (!investor) {
        return { ok: false, error: "Investor not found" };
      }

      const investorProfile: InvestorProfile = {
        id: investor.id,
        organization: investor.organization,
        position: investor.position,
        city: investor.city,
        organization_website: investor.organization_website,
        investor_linkedin: investor.investor_linkedin,
        decision_period_in_weeks: investor.decision_period_in_weeks,
        typical_check_size_in_php: investor.typical_check_size_in_php,
        preferred_industries: investor.preferred_industries,
        excluded_industries: investor.excluded_industries,
        preferred_business_models: investor.preferred_business_models,
        preferred_funding_stages: investor.preferred_funding_stages,
        geographic_focus: investor.geographic_focus,
        value_proposition: investor.value_proposition,
        involvement_level: investor.involvement_level,
        portfolio_companies: investor.portfolio_companies,
        notable_exits: (investor.notable_exits as unknown) as NotableExit[],
        key_contact_person_name: investor.key_contact_person_name,
        key_contact_linkedin: investor.key_contact_linkedin,
        key_contact_number: investor.key_contact_number,
        govt_id_image_url: investor.govt_id_image_url,
        selfie_image_url: investor.selfie_image_url,
        proof_of_bank_image_url: investor.proof_of_bank_image_url,
        tin: investor.tin,
        users_sync: investor.users_sync,
      };

      return { ok: true, data: investorProfile };
    }
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return { ok: false, error: "Failed to fetch profile data" };
  }
}