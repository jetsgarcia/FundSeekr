import { stackServerApp } from "@/stack";
import { readProfile } from "@/actions/profile";
import ErrorPage from "@/components/error-page";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, MapPin, Edit3, Mail } from "lucide-react";
import { InvestorProfile } from "@/components/profile/investor-profile";
import {
  StartupProfile,
  ExtendedStartupProfile,
} from "@/components/profile/startup-profile";
import type { investors as InvestorProfileType } from "@prisma/client";
import Link from "next/link";

export default async function ProfilePage() {
  const user = await stackServerApp.getUser();
  const response = await readProfile();

  if (!response.ok) {
    return <ErrorPage error={response.error} />;
  }

  if (response.ok) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
        <div className="container mx-auto p-6 space-y-8">
          {/* Hero Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl"></div>
            <Card className="relative border-0 shadow-xl bg-card/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                        <User className="h-10 w-10 text-primary-foreground" />
                      </div>
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                        {user?.displayName}
                      </h1>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-accent">
                          {user?.serverMetadata.userType}
                        </span>
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">
                            {response?.profile.city}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center text-muted-foreground mt-1">
                        <Mail className="h-4 w-4 mr-2" />
                        <span className="text-sm">{user?.primaryEmail}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
                    asChild
                  >
                    <Link href="/profile/edit">
                      <Edit3 />
                      Edit Profile
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Content */}
          {user?.serverMetadata.userType === "Investor" && (
            <InvestorProfile
              investor={response.profile as InvestorProfileType}
            />
          )}
          {user?.serverMetadata.userType === "Startup" && (
            <StartupProfile
              startup={response.profile as unknown as ExtendedStartupProfile}
            />
          )}
        </div>
      </div>
    );
  }
}
