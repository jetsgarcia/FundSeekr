"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
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

        {/* Error Card */}
        <Card>
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-3">
                <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-foreground">
                  Something went wrong
                </h1>
                <p className="text-muted-foreground">
                  We couldn&apos;t load the profile you requested. This might be
                  due to a temporary issue or the profile may no longer be
                  available.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={reset} variant="default">
                  Try again
                </Button>
                <Button asChild variant="outline">
                  <Link href="/home">Return to Recommendations</Link>
                </Button>
              </div>

              {process.env.NODE_ENV === "development" && (
                <details className="mt-4 w-full">
                  <summary className="cursor-pointer text-sm text-muted-foreground">
                    Error details (development only)
                  </summary>
                  <pre className="mt-2 text-xs text-left bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
                    {error.message}
                  </pre>
                </details>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
