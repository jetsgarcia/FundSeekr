import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserX, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/home" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Recommendations
            </Link>
          </Button>
        </div>

        {/* Not Found Card */}
        <Card>
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3">
                <UserX className="h-8 w-8 text-gray-600 dark:text-gray-400" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-foreground">
                  Profile Not Found
                </h1>
                <p className="text-muted-foreground">
                  The profile you&apos;re looking for doesn&apos;t exist or may
                  have been removed.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild variant="default">
                  <Link href="/home">Return to Recommendations</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/search">Search Profiles</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
