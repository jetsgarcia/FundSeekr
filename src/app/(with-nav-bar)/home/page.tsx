import { stackServerApp } from "@/stack";
import PendingVerification from "@/components/home/pending-verification";
import RejectedVerification from "@/components/home/rejected-verification";
import RecommendationsList from "@/components/recommendations-list";
import prisma from "@/lib/prisma";

// Mock data for startup recommendations with investor preview format
const startups = [
  {
    id: 1,
    name: "Atlas",
    industry: "Software",
    location: "Makati",
    stage: "MVP",
    description: "AI-powered SaaS solution for SMBs",
    keyMetrics: ["500 users", "₱2M revenue"],
    matchScore: 85,
  },
  {
    id: 2,
    name: "AIHealth Solutions",
    industry: "HealthTech",
    location: "BGC",
    stage: "Seed",
    description: "AI-driven platform for hospital optimization",
    keyMetrics: ["1,200 users", "₱5M revenue"],
    matchScore: 92,
  },
  {
    id: 3,
    name: "FinFlow Analytics",
    industry: "FinTech",
    location: "Makati",
    stage: "Series A",
    description: "Real-time financial analytics for SMBs",
    keyMetrics: ["800 users", "₱3.5M revenue"],
    matchScore: 88,
  },
  {
    id: 4,
    name: "TechFlow Solutions",
    industry: "Enterprise Tech",
    location: "Ortigas",
    stage: "Seed",
    description: "Digital transformation software suite",
    keyMetrics: ["300 clients", "₱4M revenue"],
    matchScore: 79,
  },
  {
    id: 5,
    name: "SmartLogistics AI",
    industry: "LogTech",
    location: "Pasig",
    stage: "MVP",
    description: "AI-powered supply chain optimization",
    keyMetrics: ["150 partners", "₱1.8M revenue"],
    matchScore: 91,
  },
];

// Mock data for investor recommendations with startup preview format
const investors = [
  {
    id: 1,
    name: "John Doe",
    position: "CEO",
    organization: "AB Normal Ventures",
    location: "Makati",
    typicalCheck: "₱1M",
    preferredIndustries: ["Tech", "AI"],
    fundingStages: ["Pre-seed", "Seed"],
    involvementLevel: "Active",
    matchScore: 92,
  },
  {
    id: 2,
    name: "Maria Santos",
    position: "Managing Partner",
    organization: "Philippine Venture Capital",
    location: "BGC",
    typicalCheck: "₱2.5M",
    preferredIndustries: ["FinTech", "HealthTech"],
    fundingStages: ["Seed", "Series A"],
    involvementLevel: "Strategic",
    matchScore: 88,
  },
  {
    id: 3,
    name: "David Chen",
    position: "Investment Director",
    organization: "Southeast Capital",
    location: "Ortigas",
    typicalCheck: "₱1.5M",
    preferredIndustries: ["Enterprise Tech", "LogTech"],
    fundingStages: ["Pre-seed", "Seed", "Series A"],
    involvementLevel: "Active",
    matchScore: 85,
  },
  {
    id: 4,
    name: "Lisa Rodriguez",
    position: "Senior Partner",
    organization: "Innovation Fund Asia",
    location: "Makati",
    typicalCheck: "₱3M",
    preferredIndustries: ["AI", "Software"],
    fundingStages: ["Series A", "Series B"],
    involvementLevel: "Strategic",
    matchScore: 90,
  },
  {
    id: 5,
    name: "Robert Tan",
    position: "Founding Partner",
    organization: "Startup Catalyst PH",
    location: "Pasig",
    typicalCheck: "₱800K",
    preferredIndustries: ["Tech", "HealthTech"],
    fundingStages: ["Pre-seed", "MVP"],
    involvementLevel: "Active",
    matchScore: 87,
  },
];

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
            <RecommendationsList
              isStartup={isStartup}
              startups={startups}
              investors={investors}
            />
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
