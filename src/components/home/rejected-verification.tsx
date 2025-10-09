import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface RejectedVerificationProps {
  rejectionReason?: string;
  rejectedAt?: string;
  currentStartupProfile?: {
    id: string;
    name: string | null;
  } | null;
}

export default function RejectedVerification({
  rejectionReason,
  rejectedAt,
  currentStartupProfile,
}: RejectedVerificationProps) {
  function formatRejectionDate(dateString?: string) {
    if (!dateString) return "recently";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "recently";
    }
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
          <svg
            className="w-8 h-8 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          Verification Declined
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          We were unable to verify your account at this time. Please review the
          reason below and take the necessary steps to resubmit your
          verification.
        </p>
        {/* Profile Context */}
        {currentStartupProfile && (
          <div className="bg-card rounded-lg p-3 border border-gray-200 dark:border-gray-700 mt-4 max-w-md mx-auto">
            <div className="text-sm text-muted-foreground">
              Startup:{" "}
              <span className="font-medium text-foreground">
                {currentStartupProfile.name || "Unnamed Startup"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Rejection Details Card */}
      <Card className="max-w-2xl mx-auto border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            Verification Declined
          </CardTitle>
          <CardDescription>
            Declined on {formatRejectionDate(rejectedAt)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
            <h3 className="font-medium text-red-900 dark:text-red-100 mb-2">
              Reason for Decline:
            </h3>
            <p className="text-red-800 dark:text-red-200 text-sm">
              {rejectionReason ||
                "No specific reason provided. Please contact support for more details."}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">
              What you can do next:
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  Review and update your submitted information based on the
                  feedback provided
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  Ensure all required documents are clear, complete, and meet
                  our verification standards
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  Contact our support team if you need clarification on the
                  requirements
                </span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Actions Card */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
          <CardDescription>
            Take action to get your account verified
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-blue-900 dark:text-blue-100">
                  Update your profile
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                  Review and update your information based on the feedback
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900/20"
              >
                <Link href="/profile/edit">Update Profile</Link>
              </Button>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-gray-600 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Contact support
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Get help understanding the verification requirements
                </p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="mailto:support@fundseekr.com">Contact Us</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
