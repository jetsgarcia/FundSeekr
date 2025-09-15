"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("User verification page error:", error);
  }, [error]);

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

        {/* Error Card */}
        <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm max-w-2xl mx-auto">
          <CardContent className="p-12 text-center">
            <div className="flex flex-col items-center space-y-6">
              <div className="p-4 rounded-full bg-destructive/10">
                <AlertTriangle className="h-12 w-12 text-destructive" />
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl font-bold">Something went wrong</h1>
                <p className="text-muted-foreground max-w-md">
                  We encountered an error while loading the user profile for
                  verification. This might be due to a network issue or the user
                  data might be unavailable.
                </p>
              </div>

              {/* Error Details (for development) */}
              {process.env.NODE_ENV === "development" && (
                <div className="w-full max-w-lg">
                  <details className="bg-secondary/50 p-4 rounded-lg text-left">
                    <summary className="cursor-pointer font-medium">
                      Error Details (Development Only)
                    </summary>
                    <pre className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
                      {error.message}
                    </pre>
                  </details>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="outline" asChild>
                  <Link href="/admin/verification">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go Back
                  </Link>
                </Button>
                <Button onClick={reset}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Help */}
        <Card className="mt-6 shadow-lg border-0 bg-card/80 backdrop-blur-sm max-w-2xl mx-auto">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                • Check if the user ID is valid and the user exists in the
                system
              </p>
              <p>
                • Verify your network connection and try refreshing the page
              </p>
              <p>• If the problem persists, contact the development team</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
