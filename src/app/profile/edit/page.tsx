import { stackServerApp } from "@/stack";
import {
  readProfile,
  updateStartupProfile,
  updateInvestorProfile,
} from "@/actions/profile";
import ErrorPage from "@/components/error-page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { EditInvestorProfile } from "@/components/profile/edit/edit-investor";
import { EditStartupProfile } from "@/components/profile/edit/edit-startup";
import type { investors as InvestorProfileType } from "@prisma/client";
import type { ExtendedStartupProfile } from "@/components/profile/startup-profile";
import Link from "next/link";

export default async function EditProfilePage() {
  const user = await stackServerApp.getUser();
  const response = await readProfile();

  if (!response.ok) {
    return <ErrorPage error={response.error} />;
  }

  const handleStartupSave = async (data: any) => {
    "use server";
    const result = await updateStartupProfile(data);
    return result;
  };

  const handleInvestorSave = async (data: any) => {
    "use server";
    const result = await updateInvestorProfile(data);
    return result;
  };

  if (response.ok) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
        <div className="container mx-auto p-6 space-y-8">
          {/* Header Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl"></div>
            <Card className="relative border-0 shadow-xl bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/profile">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Profile
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div>
                    <CardTitle className="text-2xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      Edit Profile
                    </CardTitle>
                    <p className="text-muted-foreground">
                      Update your {user?.serverMetadata.userType?.toLowerCase()}{" "}
                      profile information
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Edit Profile Content */}
          {user?.serverMetadata.userType === "Investor" && (
            <EditInvestorProfile
              investor={response.profile as InvestorProfileType}
              onSave={handleInvestorSave}
            />
          )}
          {user?.serverMetadata.userType === "Startup" && (
            <EditStartupProfile
              startup={response.profile as ExtendedStartupProfile}
              onSave={handleStartupSave}
            />
          )}
        </div>
      </div>
    );
  }
}
