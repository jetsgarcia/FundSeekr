import prisma from "@/lib/prisma";
import { VerifyUsers } from "@/components/admin/verify-users";

// Type for the user metadata from Stack Auth
interface UserMetadata {
  server_metadata?: {
    userType?: string;
    onboarded?: boolean;
    legalVerified?: boolean;
    rejectedAt?: string;
    rejectionReason?: string;
    verifiedAt?: string;
  };
}

async function getUsers() {
  try {
    // Fetch startups with their user information
    const startups = await prisma.startups.findMany({
      include: {
        users_sync: true,
      },
    });

    // Fetch investors with their user information
    const investors = await prisma.investors.findMany({
      include: {
        users_sync: true,
      },
    });

    // Separate startups based on the legal_verified field in the startups table
    const pendingStartups = startups.filter((startup) => {
      // For startups, use the legal_verified field directly
      return startup.legal_verified === null;
    });

    const approvedStartups = startups.filter((startup) => {
      // For startups, use the legal_verified field directly
      return startup.legal_verified === true;
    });

    const rejectedStartups = startups.filter((startup) => {
      // For startups, use the legal_verified field directly
      return startup.legal_verified === false;
    });

    // Separate investors based on server_metadata (keep existing logic for investors)
    const pendingInvestors = investors.filter((investor) => {
      const metadata = investor.users_sync?.raw_json as UserMetadata;
      return (
        metadata?.server_metadata?.legalVerified === undefined ||
        (metadata?.server_metadata?.legalVerified === false &&
          !metadata?.server_metadata?.rejectedAt)
      );
    });

    const approvedInvestors = investors.filter((investor) => {
      const metadata = investor.users_sync?.raw_json as UserMetadata;
      return metadata?.server_metadata?.legalVerified === true;
    });

    const rejectedInvestors = investors.filter((investor) => {
      const metadata = investor.users_sync?.raw_json as UserMetadata;
      return (
        metadata?.server_metadata?.legalVerified === false &&
        metadata?.server_metadata?.rejectedAt
      );
    });

    return {
      pendingStartups,
      approvedStartups,
      rejectedStartups,
      pendingInvestors,
      approvedInvestors,
      rejectedInvestors,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      pendingStartups: [],
      approvedStartups: [],
      rejectedStartups: [],
      pendingInvestors: [],
      approvedInvestors: [],
      rejectedInvestors: [],
    };
  }
}

export default async function AdminVerificationPage() {
  const {
    pendingStartups,
    approvedStartups,
    rejectedStartups,
    pendingInvestors,
    approvedInvestors,
    rejectedInvestors,
  } = await getUsers();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">User Verification</h1>
          <p className="text-muted-foreground">
            Review and verify user profiles for startups and investors
          </p>
        </div>
      </div>

      {/* User Verification Component */}
      <VerifyUsers
        pendingStartups={pendingStartups}
        approvedStartups={approvedStartups}
        rejectedStartups={rejectedStartups}
        pendingInvestors={pendingInvestors}
        approvedInvestors={approvedInvestors}
        rejectedInvestors={rejectedInvestors}
      />
    </div>
  );
}
