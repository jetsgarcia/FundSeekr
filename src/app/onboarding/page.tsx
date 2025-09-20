"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Step1 } from "@/components/onboarding/Step1";
import { Step2 } from "@/components/onboarding/Step2";
import { Step3 } from "@/components/onboarding/Step3";
import { toast } from "sonner";

interface InvestorData {
  firstName: string;
  lastName: string;
  organization: string;
  linkedinURL: string;
}

interface StartupData {
  firstName: string;
  lastName: string;
  position: string;
  contactNumber: string;
  linkedinLink: string;
  name: string;
  website: string;
  description: string;
  city: string;
  dateFounded: string;
  keywords: string;
  industry: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<null | "investor" | "startup">(null);
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [investorData, setInvestorData] = useState<InvestorData>({
    firstName: "",
    lastName: "",
    organization: "",
    linkedinURL: "",
  });

  const [startupData, setStartupData] = useState<StartupData>({
    firstName: "",
    lastName: "",
    position: "",
    contactNumber: "+63",
    linkedinLink: "",
    name: "",
    website: "",
    description: "",
    city: "",
    dateFounded: "",
    keywords: "",
    industry: "",
  });

  // Before unload warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Check if user has started filling the form
      const hasData =
        userType !== null ||
        Object.values(investorData).some(
          (value) => value !== "" && value !== "+63"
        ) ||
        Object.values(startupData).some(
          (value) => value !== "" && value !== "+63"
        );

      if (hasData && !isSubmitted) {
        e.preventDefault();
        return "You have unsaved changes. Are you sure you want to leave?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [userType, investorData, startupData, isSubmitted]);

  const handleInvestorChange = (field: keyof InvestorData, value: string) => {
    setInvestorData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStartupChange = (field: keyof StartupData, value: string) => {
    setStartupData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (step === 2) {
      setStep(3);
      return;
    }

    if (step === 3) {
      // Handle step 3 submission
      setIsSubmitted(true);
      // Add step 3 data to submission
      const data = {
        step,
        userType,
        ...(userType === "investor" ? investorData : startupData),
        // Add step 3 data here when ready
      };

      try {
        const response = await fetch("/api/onboarding", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          let errorMessage = "An error occurred";
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
          }
          console.error("Server error:", response.status, errorMessage);
          setIsSubmitted(false);

          toast.error(errorMessage);
          return;
        }

        // Success case
        toast.success("Onboarding completed successfully!");
        router.push("/home");
      } catch (error) {
        console.error("Network error:", error);
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unknown error occurred");
        }
        setIsSubmitted(false);
      }
      return;
    }

    setIsSubmitted(true); // Prevent warning from unload

    const data = {
      step,
      userType,
      ...(userType === "investor" ? investorData : startupData),
    };

    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let errorMessage = "An error occurred";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        console.error("Server error:", response.status, errorMessage);
        setIsSubmitted(false);

        toast.error(errorMessage);
        return; // Early return on error
      }

      // Success case
      toast.success("Onboarding completed successfully!");
      router.push("/home");
    } catch (error) {
      console.error("Network error:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
      setIsSubmitted(false); // Allow retry
    }
  };

  const isFormValid = (): boolean => {
    if (step === 2) {
      if (userType === "investor") {
        return !!(investorData.firstName && investorData.lastName);
      } else {
        return !!(
          startupData.firstName &&
          startupData.lastName &&
          startupData.position &&
          startupData.contactNumber.length > 3
        );
      }
    } else if (step === 3) {
      if (userType === "investor") {
        // For investors, step 3 is just document upload, so always return true
        // The actual validation will be handled by Step3 component
        return true;
      } else {
        return !!(
          startupData.name &&
          startupData.description &&
          startupData.city &&
          startupData.dateFounded &&
          startupData.industry
        );
      }
    }
    return false;
  };

  return (
    <>
      {step === 1 && (
        <Step1
          userType={userType}
          setUserType={setUserType}
          setStep={setStep}
        />
      )}
      {step === 2 && userType && (
        <Step2
          userType={userType}
          investorData={investorData}
          startupData={startupData}
          handleInvestorChange={handleInvestorChange}
          handleStartupChange={handleStartupChange}
          handleSubmit={handleSubmit}
          isFormValid={isFormValid}
          setStep={setStep}
        />
      )}
      {step === 3 && userType && (
        <Step3 onSubmit={handleSubmit} onCancel={() => setStep(2)} />
      )}
    </>
  );
}
