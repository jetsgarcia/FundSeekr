import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { UserProfileHeader } from "@/components/profile/user-profile-header";
import { InvestorProfile } from "@/components/profile/investor-profile";
import {
  StartupProfile,
  type ExtendedStartupProfile,
} from "@/components/profile/startup-profile";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Building2, Users, User } from "lucide-react";
import Link from "next/link";
import { VerificationActions } from "@/components/admin/verification-actions";
import { Prisma } from "@prisma/client";

interface PageProps {
  params: Promise<{
    userId: string;
  }>;
}

// Define custom types for our data structures
type TeamMember = Prisma.JsonObject & {
  name?: string | null;
  position?: string | null;
  bio?: string | null;
  linkedin?: string | null;
};

type Advisor = Prisma.JsonObject & {
  name?: string | null;
  expertise?: string | null;
  company?: string | null;
};

type KeyMetric = Prisma.JsonObject & {
  name?: string | null;
  value?: string | null;
  description?: string | null;
};

type IntellectualProperty = Prisma.JsonObject & {
  type?: string | null;
  title?: string | null;
  description?: string | null;
  status?: string | null;
  application_number?: string | null;
};

async function getUserData(userId: string) {
  // First, get the user from users_sync table
  const user = await prisma.users_sync.findUnique({
    where: { id: userId },
    include: {
      startups: {
        include: {
          funding_requests: true,
        },
      },
      investors: true,
    },
  });

  if (!user) {
    return null;
  }

  return user;
}

export default async function UserVerificationPage({ params }: PageProps) {
  const { userId } = await params;
  const userData = await getUserData(userId);

  if (!userData) {
    notFound();
  }

  // Determine user type and profile data
  const isStartup = !!userData.startups;
  const isInvestor = !!userData.investors && userData.investors.length > 0;
  const userType = isStartup ? "Startup" : isInvestor ? "Investor" : "User";

  // Transform startup data to match ExtendedStartupProfile interface
  const startupProfile: ExtendedStartupProfile | null = userData.startups
    ? {
        id: userData.startups.id,
        name: userData.startups.name,
        description: userData.startups.description,
        valuation: userData.startups.valuation,
        target_market: userData.startups.target_market,
        city: userData.startups.city,
        date_founded: userData.startups.date_founded,
        industry: userData.startups.industry,
        website: userData.startups.website,
        keywords: userData.startups.keywords,
        product_demo_url: userData.startups.product_demo_url,
        development_stage: userData.startups.development_stage,
        user_id: userData.startups.user_id,
        team_members: (userData.startups.team_members as TeamMember[]) || [],
        advisors: (userData.startups.advisors as Advisor[]) || [],
        key_metrics: (userData.startups.key_metrics as KeyMetric[]) || [],
        intellectual_property:
          (userData.startups.intellectual_property as IntellectualProperty[]) ||
          [],
        funding_requests: userData.startups.funding_requests,
      }
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      <div className="container mx-auto px-4 py-8 pb-32 max-w-7xl">
        {/* Navigation */}
        <div className="mb-6">
          <Link
            href="/admin/verification"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Verification Dashboard
          </Link>
        </div>

        {/* User Header */}
        <div className="mb-8">
          <UserProfileHeader
            displayName={userData.name || "Unknown User"}
            userType={userType}
            primaryEmail={userData.email || "No email"}
          />
        </div>

        {/* Profile Content */}
        <div className="space-y-8">
          {isStartup && startupProfile && (
            <div>
              <h2 className="text-2xl font-semibold mb-6 flex items-center space-x-2">
                <Building2 className="h-6 w-6" />
                <span>Startup Profile Details</span>
              </h2>
              <StartupProfile startup={startupProfile} />
            </div>
          )}

          {isInvestor &&
            userData.investors &&
            userData.investors.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6 flex items-center space-x-2">
                  <Users className="h-6 w-6" />
                  <span>Investor Profile Details</span>
                </h2>
                <InvestorProfile investor={userData.investors[0]} />
              </div>
            )}

          {!isStartup && !isInvestor && (
            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Incomplete Profile
                </h3>
                <p className="text-muted-foreground">
                  This user has not completed their startup or investor profile
                  yet.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Floating Verification Actions */}
        <VerificationActions
          userId={userId}
          userName={userData.name || "Unknown User"}
          userType={userType}
        />
      </div>
    </div>
  );
}
