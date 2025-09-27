import type { startups as StartupProfile } from "@prisma/client";
import { CompanyInfo } from "./startup/company-info";
import { KeyMetrics } from "./startup/key-metrics";
import { TeamMembers } from "./startup/team-members";
import { Advisors } from "./startup/advisors";
import { Documents } from "./startup/documents";
import { MarketAndKeywords } from "./startup/market-and-keywords";
import { DescriptionAndDemo } from "./startup/description-and-demo";
import { VerificationDocuments } from "./startup/verification-documents";

interface TeamMember {
  name?: string | null;
  position?: string | null;
  linkedin?: string | null;
}

interface Advisor {
  name?: string | null;
  expertise?: string | null;
  company?: string | null;
  linkedin?: string | null;
}

interface KeyMetric {
  name?: string | null;
  value?: string | null;
  description?: string | null;
  [key: string]: unknown; // Allow for flexible key-value structure
}

interface Document {
  link?: string | null;
  type?: string | null;
  title?: string | null;
}

export interface ExtendedStartupProfile {
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
  development_stage: string | null;
  user_id: string | null;
  govt_id_image_url: string;
  bir_cor_image_url: string;
  proof_of_bank_image_url: string | null;
  business_structure: string | null;
  documents: Document[];
  team_members: TeamMember[];
  advisors: Advisor[];
  key_metrics: KeyMetric[];
}

export function StartupProfile({
  startup,
}: {
  startup: ExtendedStartupProfile;
}) {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Highlighted Verification Documents Section */}
      <div className="mb-8 p-6 border-2 border-primary/20 rounded-lg bg-primary/5 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <h2 className="text-xl font-semibold text-primary">
            Verification Documents
          </h2>
        </div>
        <VerificationDocuments
          govt_id_image_url={startup.govt_id_image_url}
          bir_cor_image_url={startup.bir_cor_image_url}
          proof_of_bank_image_url={startup.proof_of_bank_image_url}
        />
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          <CompanyInfo
            name={startup.name}
            industry={startup.industry}
            city={startup.city}
            development_stage={startup.development_stage}
            business_structure={startup.business_structure}
            date_founded={startup.date_founded}
            website_url={startup.website_url}
          />

          <TeamMembers members={startup.team_members} />
        </div>

        {/* Middle Column */}
        <div className="lg:col-span-1 space-y-6">
          <DescriptionAndDemo
            description={startup.description}
            product_demo_url={startup.product_demo_url}
          />

          <Advisors advisors={startup.advisors} />

          <KeyMetrics metrics={startup.key_metrics} />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-6">
          <MarketAndKeywords
            target_market={startup.target_market}
            keywords={startup.keywords}
          />

          <Documents documents={startup.documents} />
        </div>
      </div>
    </div>
  );
}
