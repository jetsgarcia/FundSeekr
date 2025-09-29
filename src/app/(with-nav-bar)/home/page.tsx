import { stackServerApp } from "@/stack";
import PendingVerification from "@/components/home/pending-verification";
import RejectedVerification from "@/components/home/rejected-verification";
import RecommendationsList from "@/components/recommendations-list";
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

  // Check database for legal verification status
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
  const legalVerified = dbLegalVerified ?? user?.serverMetadata?.legalVerified;
  const rejectedAt = dbRejectedAt ?? user?.serverMetadata?.rejectedAt;
  const rejectionReason =
    dbRejectionReason ?? user?.serverMetadata?.rejectionReason;

  // Extract user type from metadata
  const userType = user?.serverMetadata?.userType as
    | "Startup"
    | "Investor"
    | undefined;
  const isStartup = userType === "Startup";

  // Fetch recommendations if user is verified
  let recommendationsData = null;
  if (legalVerified) {
    const result = await getRecommendations();
    if (result.ok) {
      recommendationsData = result.recommendations;
    } else {
      console.error("Failed to fetch recommendations:", result.error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        {legalVerified ? (
          <div className="space-y-3">
            {/* Header Section */}
            <div className="border-b bg-card rounded-lg p-6">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground text-balance">
                    {isStartup
                      ? "Recommended Investors Matched to Your Profile"
                      : "Recommended Startups Matched to Your Profile"}
                  </h1>
                  <p className="text-muted-foreground text-sm text-pretty">
                    {isStartup
                      ? "Discover promising investors tailored to your funding needs and business strategy"
                      : "Discover promising startups tailored to your investment preferences and portfolio strategy"}
                  </p>
                </div>
              </div>
            </div>

            {/* Cards Grid */}
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
                <div className="bg-card rounded-lg p-8">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No recommendations available yet
                  </h3>
                  <p className="text-muted-foreground">
                    {isStartup
                      ? "We're working on finding the perfect investors for your startup. Please check back soon!"
                      : "We're working on finding the perfect startups for your investment profile. Please check back soon!"}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : rejectedAt ? (
          <RejectedVerification
            rejectionReason={rejectionReason}
            rejectedAt={rejectedAt}
          />
        ) : (
          <PendingVerification />
        )}
      </div>
    </div>
  );
}
