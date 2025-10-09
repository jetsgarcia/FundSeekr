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

export default async function ProfilePage() {
  const user = await stackServerApp.getUser();
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

          {/* Profile Content */}
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
