"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Step1 } from "@/components/onboarding/Step1";
import { Step2 } from "@/components/onboarding/Step2";
import { Step3 } from "@/components/onboarding/Step3";
import { toast } from "sonner";

// User type definitions
export type UserType = "investor" | "startup";
export type BusinessStructure = "Sole" | "Partnership" | "Corporation";

// Step 2 data interfaces
export interface InvestorData {
  firstName: string;
  lastName: string;
  organization: string;
  linkedinURL: string;
}

export interface StartupData {
  firstName: string;
  lastName: string;
  position: string;
  contactNumber: string;
  linkedinLink: string;
  name: string;
}

// Step 3 data interfaces
export interface DocumentFiles {
  validId: File | null;
  proofOfBank: File | null;
  selfie: File | null;
  birCor: File | null;
}

export interface Step3Data {
  files: DocumentFiles;
  tin: string;
  businessName: string;
}

// Complete form data interface
export interface OnboardingFormData {
  step: number;
  userType: UserType | null;
  businessStructure: BusinessStructure | null;
  investorData: InvestorData;
  startupData: StartupData;
  step3Data: Step3Data;
}

export default function OnboardingPage() {
  const router = useRouter();

  // Main form state
  const [formData, setFormData] = useState<OnboardingFormData>({
    step: 1,
    userType: null,
    businessStructure: null,
    investorData: {
      firstName: "",
      lastName: "",
      organization: "",
      linkedinURL: "",
    },
    startupData: {
      firstName: "",
      lastName: "",
      position: "",
      contactNumber: "+63",
      linkedinLink: "",
      name: "",
    },
    step3Data: {
      files: {
        validId: null,
        proofOfBank: null,
        selfie: null,
        birCor: null,
      },
      tin: "",
      businessName: "",
    },
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  // Utility functions for form data management
  const updateFormData = (updates: Partial<OnboardingFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const updateInvestorData = (updates: Partial<InvestorData>) => {
    setFormData((prev) => ({
      ...prev,
      investorData: { ...prev.investorData, ...updates },
    }));
  };

  const updateStartupData = (updates: Partial<StartupData>) => {
    setFormData((prev) => ({
      ...prev,
      startupData: { ...prev.startupData, ...updates },
    }));
  };

  const updateStep3Data = (updates: Partial<Step3Data>) => {
    setFormData((prev) => ({
      ...prev,
      step3Data: { ...prev.step3Data, ...updates },
    }));
  };

  // Check if form has any data
  const hasFormData = useCallback((): boolean => {
    const {
      userType,
      businessStructure,
      investorData,
      startupData,
      step3Data,
    } = formData;

    return (
      userType !== null ||
      businessStructure !== null ||
      Object.values(investorData).some(
        (value) => value !== "" && value !== "+63"
      ) ||
      Object.values(startupData).some(
        (value) => value !== "" && value !== "+63"
      ) ||
      Object.values(step3Data.files).some((file) => file !== null) ||
      step3Data.tin !== "" ||
      step3Data.businessName !== ""
    );
  }, [formData]);

  // Before unload warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasFormData() && !isSubmitted) {
        e.preventDefault();
        return "You have unsaved changes. Are you sure you want to leave?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isSubmitted, hasFormData]);

  function handleInvestorChange(field: keyof InvestorData, value: string) {
    updateInvestorData({ [field]: value });
  }

  function handleStartupChange(field: keyof StartupData, value: string) {
    updateStartupData({ [field]: value });
  }

  function isFormValid(): boolean {
    const { step, userType, investorData, startupData } = formData;

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
        return !!startupData.name;
      }
    }
    return false;
  }

  // TODO: Change to server action
  async function handleSubmit() {
    // Handle step 3 submission
    setIsSubmitted(true);

    const {
      step,
      userType,
      businessStructure,
      investorData,
      startupData,
      step3Data,
    } = formData;

    const userData = {
      step,
      userType,
      businessStructure,
      ...(userType === "investor" ? investorData : startupData),
      // Step 3 data
      files: step3Data.files,
      tin: userType === "investor" ? step3Data.tin : undefined,
      businessName: userType === "startup" ? step3Data.businessName : undefined,
    };

    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
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
  }

  return (
    <>
      {formData.step === 1 && (
        <Step1
          userType={formData.userType}
          setUserType={(userType) => updateFormData({ userType })}
          setStep={(step) => updateFormData({ step })}
          businessStructure={formData.businessStructure}
          setBusinessStructure={(businessStructure) =>
            updateFormData({ businessStructure })
          }
        />
      )}
      {formData.step === 2 && formData.userType && (
        <Step2
          userType={formData.userType}
          investorData={formData.investorData}
          startupData={formData.startupData}
          handleInvestorChange={handleInvestorChange}
          handleStartupChange={handleStartupChange}
          isFormValid={isFormValid}
          setStep={(step) => updateFormData({ step })}
        />
      )}
      {formData.step === 3 && formData.userType && (
        <Step3
          userType={formData.userType}
          businessStructure={formData.businessStructure}
          files={formData.step3Data.files}
          setFiles={(files) => updateStep3Data({ files })}
          tin={formData.step3Data.tin}
          setTin={(tin) => updateStep3Data({ tin })}
          businessName={formData.step3Data.businessName}
          setBusinessName={(businessName) => updateStep3Data({ businessName })}
          onSubmit={handleSubmit}
          onCancel={() => updateFormData({ step: 2 })}
        />
      )}
    </>
  );
}
