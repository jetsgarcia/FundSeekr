"use client";

import { useState, useEffect, useCallback } from "react";
import { Step1 } from "@/components/onboarding/Step1";
import { Step2 } from "@/components/onboarding/Step2";
import { Step3 } from "@/components/onboarding/Step3";
import { toast } from "sonner";
import { submitOnboarding } from "@/actions/onboarding";

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

  // Track uploaded file URLs from Step3
  const [fileUrls, setFileUrls] = useState({
    validIdUrl: "",
    proofOfBankUrl: "",
    selfieUrl: "",
    birCorUrl: "",
  });

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

  // Server action for form submission
  async function handleSubmit() {
    setIsSubmitted(true);

    const {
      userType,
      businessStructure,
      investorData,
      startupData,
      step3Data,
    } = formData;

    try {
      // Create FormData object for server action
      const formDataObj = new FormData();

      // Add basic form data
      formDataObj.append("userType", userType || "");
      formDataObj.append("businessStructure", businessStructure || "");

      // Add user-specific data
      if (userType === "investor") {
        formDataObj.append("organization", investorData.organization);
        formDataObj.append("linkedinURL", investorData.linkedinURL);
        formDataObj.append("position", ""); // investors don't have position in step 2
      } else if (userType === "startup") {
        formDataObj.append("name", startupData.name);
        formDataObj.append("position", startupData.position);
      }

      // Add step 3 data
      formDataObj.append("tin", step3Data.tin);
      formDataObj.append("businessName", step3Data.businessName);

      // Add file URLs (instead of files)
      formDataObj.append("validIdUrl", fileUrls.validIdUrl);
      formDataObj.append("proofOfBankUrl", fileUrls.proofOfBankUrl);
      formDataObj.append("selfieUrl", fileUrls.selfieUrl);
      formDataObj.append("birCorUrl", fileUrls.birCorUrl);

      // Call server action
      await submitOnboarding(formDataObj);

      // If we reach here, redirect didn't happen - something might be wrong
      // But don't show success toast since redirect should happen
    } catch (error) {
      console.error("Onboarding error:", error);

      // Don't show toast for redirect errors (NEXT_REDIRECT)
      if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
        // This is a redirect, not an actual error - let it happen silently
        return;
      }

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
          onFileUpload={(fileType, url) => {
            setFileUrls((prev) => ({ ...prev, [`${fileType}Url`]: url }));
          }}
        />
      )}
    </>
  );
}
