import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PendingVerificationProps {
  currentStartupProfile?: {
    id: string;
    name: string | null;
  } | null;
}

export default function PendingVerification({
  currentStartupProfile,
}: PendingVerificationProps) {
  return (
    <div className="flex items-center justify-center p-4 h-[calc(100dvh-100px)]">
      <div className="max-w-md w-full space-y-6">
        {/* Main Card */}
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-amber-600 dark:text-amber-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <CardTitle className="text-2xl">Verification Pending</CardTitle>
            <CardDescription className="text-center">
              Verification typically takes 1-3 business days. You&apos;ll
              receive an email notification once the review is complete.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Context */}
            {currentStartupProfile && (
              <div className="rounded-lg border p-3 text-center">
                <div className="text-sm text-muted-foreground">
                  Startup:
                  <span className="font-medium text-foreground ml-1">
                    {currentStartupProfile.name || "Unnamed Startup"}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
