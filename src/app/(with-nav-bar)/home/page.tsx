import { stackServerApp } from "@/stack";
import PendingVerification from "@/components/home/pending-verification";
import RejectedVerification from "@/components/home/rejected-verification";
import RecommendationsList from "@/components/recommendations-list";
import { StartupAnalyticsWidget } from "@/components/startup/analytics-widget";
import prisma from "@/lib/prisma";
import {
  getRecommendations,
  type StartupRecommendation,
  type InvestorRecommendation,
} from "@/actions/recommendations";

export default async function HomePage() {
  const user = await stackServerApp.getUser();

  if (!user) {
    return <div>Not authenticated</div>;
  }

  // Extract user type from metadata
  const userType = user?.serverMetadata?.userType as
    | "Startup"
    | "Investor"
    | undefined;
  const isStartup = userType === "Startup";
  const currentProfileId = user?.serverMetadata?.currentProfileId as
    | string
    | undefined;

  let legalVerified = null;
  let rejectedAt = null;
  let rejectionReason = null;
  let currentStartupProfile = null;

  if (isStartup && currentProfileId) {
    // For startups, check the legal_verified field for the current selected profile
    currentStartupProfile = await prisma.startups.findUnique({
      where: { id: currentProfileId },
      select: {
        id: true,
        name: true,
        legal_verified: true,
        users_sync: {
          select: {
            raw_json: true,
          },
        },
      },
    });

    // Use the current startup profile's legal_verified field as the primary source
    legalVerified = currentStartupProfile?.legal_verified;

    // Get rejection info from users_sync metadata as fallback
    if (
      currentStartupProfile?.users_sync?.raw_json &&
      typeof currentStartupProfile.users_sync.raw_json === "object" &&
      currentStartupProfile.users_sync.raw_json !== null &&
      "server_metadata" in currentStartupProfile.users_sync.raw_json &&
      currentStartupProfile.users_sync.raw_json.server_metadata &&
      typeof currentStartupProfile.users_sync.raw_json.server_metadata ===
        "object"
    ) {
      const metadata =
        currentStartupProfile.users_sync.raw_json.server_metadata;
      rejectedAt = "rejectedAt" in metadata ? metadata.rejectedAt : null;
      rejectionReason =
        "rejectionReason" in metadata ? metadata.rejectionReason : null;
    }
  } else if (isStartup && !currentProfileId) {
    // No profile selected, show message to select a profile
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="bg-card rounded-lg p-8">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Startup Profile Selected
              </h3>
              <p className="text-muted-foreground">
                Please select a startup profile to view recommendations and
                verification status.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    // For investors, use the existing logic with users_sync metadata
    const dbUser = await prisma.users_sync.findUnique({
      where: { id: user.id },
      select: { raw_json: true },
    });

    // Extract legal verification status from database
    const dbLegalVerified =
      dbUser?.raw_json &&
      typeof dbUser.raw_json === "object" &&
      dbUser.raw_json !== null &&
      "server_metadata" in dbUser.raw_json &&
      dbUser.raw_json.server_metadata &&
      typeof dbUser.raw_json.server_metadata === "object" &&
      "legalVerified" in dbUser.raw_json.server_metadata
        ? dbUser.raw_json.server_metadata.legalVerified
        : null;

    // Extract rejection information from database
    const dbRejectedAt =
      dbUser?.raw_json &&
      typeof dbUser.raw_json === "object" &&
      dbUser.raw_json !== null &&
      "server_metadata" in dbUser.raw_json &&
      dbUser.raw_json.server_metadata &&
      typeof dbUser.raw_json.server_metadata === "object" &&
      "rejectedAt" in dbUser.raw_json.server_metadata
        ? dbUser.raw_json.server_metadata.rejectedAt
        : null;

    const dbRejectionReason =
      dbUser?.raw_json &&
      typeof dbUser.raw_json === "object" &&
      dbUser.raw_json !== null &&
      "server_metadata" in dbUser.raw_json &&
      dbUser.raw_json.server_metadata &&
      typeof dbUser.raw_json.server_metadata === "object" &&
      "rejectionReason" in dbUser.raw_json.server_metadata
        ? dbUser.raw_json.server_metadata.rejectionReason
        : null;

    // If database has legal verification status but Stack user doesn't, update Stack user
    if (
      dbLegalVerified !== null &&
      user.serverMetadata?.legalVerified !== dbLegalVerified
    ) {
      try {
        await user.update({
          serverMetadata: {
            ...user.serverMetadata,
            legalVerified: dbLegalVerified,
          },
        });
      } catch (error) {
        console.error("Failed to sync legal verification status:", error);
      }
    }

    // Sync rejection information from database to Stack user if needed
    if (
      (dbRejectedAt !== null &&
        user.serverMetadata?.rejectedAt !== dbRejectedAt) ||
      (dbRejectionReason !== null &&
        user.serverMetadata?.rejectionReason !== dbRejectionReason)
    ) {
      try {
        await user.update({
          serverMetadata: {
            ...user.serverMetadata,
            rejectedAt: dbRejectedAt || user.serverMetadata?.rejectedAt,
            rejectionReason:
              dbRejectionReason || user.serverMetadata?.rejectionReason,
          },
        });
      } catch (error) {
        console.error("Failed to sync rejection information:", error);
      }
    }

    // Use the database values as the source of truth, fallback to Stack user metadata
    legalVerified = dbLegalVerified ?? user?.serverMetadata?.legalVerified;
    rejectedAt = dbRejectedAt ?? user?.serverMetadata?.rejectedAt;
    rejectionReason =
      dbRejectionReason ?? user?.serverMetadata?.rejectionReason;
  }

  // Fetch recommendations if user is verified
  let recommendationsData = null;
  if (legalVerified) {
    const result = await getRecommendations(
      isStartup ? currentProfileId : undefined
    );
    if (result.ok) {
      recommendationsData = result.recommendations;
    } else {
      console.error("Failed to fetch recommendations:", result.error);
    }
  }

  // Get startup name for display
  const startupName = currentStartupProfile?.name || "Your Startup";

  return (
    <div className="p-4 h-[calc(100dvh-72px)]">
      <div className="max-w-6xl mx-auto">
        {legalVerified ? (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="border-b bg-card rounded-lg p-6">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground text-balance">
                    {isStartup
                      ? `Dashboard for ${startupName}`
                      : "Recommended Startups Matched to Your Profile"}
                  </h1>
                  <p className="text-muted-foreground text-sm text-pretty">
                    {isStartup
                      ? `Track your investor interactions and view recommended investors for ${startupName}`
                      : "Discover promising startups tailored to your investment preferences and portfolio strategy"}
                  </p>
                  {isStartup && currentStartupProfile && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      Currently viewing:{" "}
                      {currentStartupProfile.name || "Unnamed Startup"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Startup Analytics Section */}
            {isStartup && currentProfileId && (
              <div className="bg-card rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Quick Analytics Overview
                </h2>
                <StartupAnalyticsWidget startupId={currentProfileId} />
              </div>
            )}

            {/* Recommendations Section */}
            <div className="bg-card rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                {isStartup ? "Recommended Investors" : "Recommended Startups"}
              </h2>
              {recommendationsData && recommendationsData.length > 0 ? (
                <RecommendationsList
                  isStartup={isStartup}
                  startups={
                    isStartup
                      ? []
                      : (recommendationsData as StartupRecommendation[]) || []
                  }
                  investors={
                    isStartup
                      ? (recommendationsData as InvestorRecommendation[]) || []
                      : []
                  }
                />
              ) : (
                <div className="text-center py-12">
                  <div className="bg-muted/30 rounded-lg p-8">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No recommendations available yet
                    </h3>
                    <p className="text-muted-foreground">
                      {isStartup
                        ? `We're working on finding the perfect investors for ${startupName}. Please check back soon!`
                        : "We're working on finding the perfect startups for your investment profile. Please check back soon!"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : rejectedAt ? (
          <RejectedVerification
            rejectionReason={rejectionReason}
            rejectedAt={rejectedAt}
            currentStartupProfile={currentStartupProfile}
          />
        ) : (
          <PendingVerification currentStartupProfile={currentStartupProfile} />
        )}
      </div>
    </div>
  );
}
