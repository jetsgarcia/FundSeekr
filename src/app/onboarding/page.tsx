"use client";

import EmailVerification from "@/components/onboarding/email-verification";
import MultiStepForm from "@/components/onboarding/multi-step-form";
import { useUser } from "@stackframe/stack";
import { useEffect, useState } from "react";

export default function OnboardingPage() {
  const user = useUser();
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // Check email verification status on mount so we don't load the verification component
  useEffect(() => {
    if (user?.primaryEmailVerified) {
      setIsEmailVerified(true);
    }
  }, [user]);

  if (!isEmailVerified) {
    return <EmailVerification setIsEmailVerified={setIsEmailVerified} />;
  }

  return <MultiStepForm />;
}
