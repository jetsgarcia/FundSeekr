import type { investors as InvestorProfile } from "@prisma/client";
import {
  BasicInfoCard,
  InvestmentDetailsCard,
  ContactInfoCard,
  VerificationDocumentsCard,
  PreferencesCards,
  PortfolioCards,
} from "./investor";

export function InvestorProfile({ investor }: { investor: InvestorProfile }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Highlighted Verification Documents Section */}
        <div className="mb-8 p-6 border-2 border-primary/20 rounded-lg bg-primary/5 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <h2 className="text-xl font-semibold text-primary">
              Verification Documents
            </h2>
          </div>
          <VerificationDocumentsCard investor={investor} />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2">
          {/* Core Information Section */}
          <BasicInfoCard investor={investor} />
          <InvestmentDetailsCard investor={investor} />
          <ContactInfoCard investor={investor} />

          {/* Preferences Section */}
          <PreferencesCards investor={investor} />

          {/* Portfolio Section */}
          <PortfolioCards investor={investor} />
        </div>
      </div>
    </div>
  );
}
