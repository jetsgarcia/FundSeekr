"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function OnboardingPage() {
  const [userType, setUserType] = useState<null | "investor" | "startup">(null);
  const [step, setStep] = useState(1);

  return (
    <>
      {step === 1 && (
        <div className="flex flex-col items-center justify-center h-screen gap-2">
          <p className="text-2xl">Please select a role</p>
          <div className="flex space-y-4 gap-2">
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                setUserType("investor");
                setStep(2);
              }}
            >
              Investor
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                setUserType("startup");
                setStep(2);
              }}
            >
              Startup
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
