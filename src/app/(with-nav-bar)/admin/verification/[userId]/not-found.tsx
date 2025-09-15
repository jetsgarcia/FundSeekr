import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserX, ArrowLeft, Search } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
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

        {/* Not Found Card */}
        <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm max-w-2xl mx-auto">
          <CardContent className="p-12 text-center">
            <div className="flex flex-col items-center space-y-6">
              <div className="p-4 rounded-full bg-muted">
                <UserX className="h-12 w-12 text-muted-foreground" />
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl font-bold">User Not Found</h1>
                <p className="text-muted-foreground max-w-md">
                  The user profile you&apos;re looking for doesn&apos;t exist or
                  may have been removed. Please check the user ID and try again.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="outline" asChild>
                  <Link href="/admin/verification">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go Back
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/admin/verification">
                    <Search className="h-4 w-4 mr-2" />
                    Browse Users
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card className="mt-6 shadow-lg border-0 bg-card/80 backdrop-blur-sm max-w-2xl mx-auto">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Possible Reasons</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• The user ID in the URL is incorrect or malformed</p>
              <p>• The user account has been deleted or deactivated</p>
              <p>• The user has not completed their profile setup</p>
              <p>
                • You don&apos;t have permission to view this user&apos;s
                profile
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
