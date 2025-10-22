import { useUser } from "@stackframe/stack";
import { useEffect } from "react";
import { checkEmailVerification } from "@/actions/onboarding/check-email-verification";

interface EmailVerificationProps {
  setIsEmailVerified: (verified: boolean) => void;
}

export default function EmailVerification({
  setIsEmailVerified,
}: EmailVerificationProps) {
  const user = useUser();

  useEffect(() => {
    if (user?.primaryEmailVerified) {
      setIsEmailVerified(true);
    }

    let intervalId: NodeJS.Timeout | null = null;

    const startPolling = () => {
      if (intervalId) return; // Already polling

      intervalId = setInterval(async () => {
        const result = await checkEmailVerification();

        if (result.verified) {
          setIsEmailVerified?.(true);
          if (intervalId) clearInterval(intervalId);
        }
      }, 1000);
    };

    const stopPolling = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling();
      } else {
        startPolling();
      }
    };

    if (!document.hidden) {
      startPolling();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user, setIsEmailVerified]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Email Icon with Animation */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
              <svg
                className="w-12 h-12 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center animate-bounce">
              <span className="text-xs text-primary-foreground font-bold">
                !
              </span>
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Verify Your Email
          </h2>
          <p className="text-muted-foreground">
            We&apos;ve sent a verification link to your email address
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-muted/50 rounded-lg p-6 space-y-4 text-left">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-sm font-semibold text-primary">1</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Check your inbox for an email from us
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-sm font-semibold text-primary">2</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Click the verification link in the email
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-sm font-semibold text-primary">3</span>
            </div>
            <p className="text-sm text-muted-foreground">
              You&apos;ll be automatically redirected once verified
            </p>
          </div>
        </div>

        {/* Help Text */}
        <div className="pt-4 space-y-2">
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive the email? Check your spam folder
          </p>
          <p className="text-xs text-muted-foreground">
            Email:{" "}
            <span className="font-medium text-foreground">
              {user?.primaryEmail}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
