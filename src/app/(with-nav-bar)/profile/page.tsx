import { stackServerApp } from "@/stack";
import { readProfile, readAllStartupProfiles } from "@/actions/profile";
import ErrorPage from "@/components/error-page";
import { InvestorProfile } from "@/components/profile/investor-profile";
import {
  StartupProfile,
  ExtendedStartupProfile,
} from "@/components/profile/startup-profile";
import type { investors as InvestorProfileType } from "@prisma/client";
import { UserProfileHeader } from "@/components/profile/user-profile-header";
import PendingVerification from "@/components/home/pending-verification";
import RejectedVerification from "@/components/home/rejected-verification";
import prisma from "@/lib/prisma";

export default async function ProfilePage() {
  const user = await stackServerApp.getUser();

  if (!user) {
    return <div>Not authenticated</div>;
  }

  // Check if user is a startup and get their verification status from the database
  if (user?.serverMetadata.userType === "Startup") {
    // Get startup profile with verification status
    const startupProfile = await prisma.startups.findFirst({
      where: { user_id: user.id },
      select: {
        legal_verified: true,
        users_sync: {
          select: {
            raw_json: true,
          },
        },
      },
    });

    // Check for rejection information from users_sync metadata as fallback
    const rejectionInfo =
      startupProfile?.users_sync?.raw_json &&
      typeof startupProfile.users_sync.raw_json === "object" &&
      startupProfile.users_sync.raw_json !== null &&
      "server_metadata" in startupProfile.users_sync.raw_json &&
      startupProfile.users_sync.raw_json.server_metadata &&
      typeof startupProfile.users_sync.raw_json.server_metadata === "object"
        ? {
            rejectedAt:
              "rejectedAt" in startupProfile.users_sync.raw_json.server_metadata
                ? String(
                    startupProfile.users_sync.raw_json.server_metadata
                      .rejectedAt
                  )
                : null,
            rejectionReason:
              "rejectionReason" in
              startupProfile.users_sync.raw_json.server_metadata
                ? String(
                    startupProfile.users_sync.raw_json.server_metadata
                      .rejectionReason
                  )
                : null,
          }
        : { rejectedAt: null, rejectionReason: null };

    // If legal_verified is null (pending) or false (rejected)
    if (startupProfile?.legal_verified === null) {
      // Pending verification
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
          <div className="max-w-6xl mx-auto">
            <PendingVerification />
          </div>
        </div>
      );
    } else if (startupProfile?.legal_verified === false) {
      // Rejected verification
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
          <div className="max-w-6xl mx-auto">
            <RejectedVerification
              rejectionReason={rejectionInfo.rejectionReason || undefined}
              rejectedAt={rejectionInfo.rejectedAt || undefined}
            />
          </div>
        </div>
      );
    }
  }

  const response = await readProfile();

  if (!response.ok) {
    return <ErrorPage error={response.error} />;
  }

  // For startup users, fetch all their startup profiles
  let allStartupProfiles: ExtendedStartupProfile[] = [];
  if (user?.serverMetadata.userType === "Startup") {
    const startupProfilesResponse = await readAllStartupProfiles();
    if (startupProfilesResponse.ok) {
      allStartupProfiles =
        startupProfilesResponse.profiles as unknown as ExtendedStartupProfile[];
    }
  }

  if (response.ok) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
        <div className="container mx-auto p-6 space-y-8">
          <UserProfileHeader
            profileImageUrl={user?.profileImageUrl}
            displayName={user?.displayName ?? undefined}
            userType={user?.serverMetadata.userType}
            primaryEmail={user?.primaryEmail ?? undefined}
          />

          {/* Profile Content - Only shown if startup is verified or user is investor */}
          {user?.serverMetadata.userType === "Investor" && (
            <InvestorProfile
              investor={response.profile as InvestorProfileType}
            />
          )}
          {user?.serverMetadata.userType === "Startup" && (
            <StartupProfile
              startups={
                allStartupProfiles.length > 0 ? allStartupProfiles : undefined
              }
              startup={
                allStartupProfiles.length === 0
                  ? (response.profile as unknown as ExtendedStartupProfile)
                  : undefined
              }
            />
          )}
        </div>
      </div>
    );
  }
}
