import { Card, CardContent } from "@/components/ui/card";
import { Loader2, User } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Loading Header */}
        <Card className="mb-8 shadow-lg border-0 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">Loading User Profile</h2>
                <p className="text-muted-foreground">
                  Please wait while we fetch the user details for
                  verification...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading Skeleton */}
        <div className="space-y-6">
          {/* Profile Header Skeleton */}
          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center space-x-6">
                <div className="h-20 w-20 rounded-full bg-secondary animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-8 w-48 bg-secondary rounded animate-pulse"></div>
                  <div className="h-4 w-32 bg-secondary rounded animate-pulse"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification Status Skeleton */}
          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-6 w-64 bg-secondary rounded animate-pulse"></div>
                  <div className="h-4 w-48 bg-secondary rounded animate-pulse"></div>
                </div>
                <div className="flex gap-3">
                  <div className="h-10 w-20 bg-secondary rounded animate-pulse"></div>
                  <div className="h-10 w-24 bg-secondary rounded animate-pulse"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Content Skeleton */}
          <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card
                key={index}
                className="shadow-lg border-0 bg-card/80 backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="h-6 w-32 bg-secondary rounded animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-secondary rounded animate-pulse"></div>
                      <div className="h-4 w-3/4 bg-secondary rounded animate-pulse"></div>
                      <div className="h-4 w-1/2 bg-secondary rounded animate-pulse"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
