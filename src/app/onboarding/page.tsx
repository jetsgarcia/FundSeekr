"use client";

import { useState, useEffect } from "react";
import { Step1 } from "@/components/onboarding/Step1";
import { Step2 } from "@/components/onboarding/Step2";
import { Step3 } from "@/components/onboarding/Step3";

interface InvestorData {
  firstName: string;
  lastName: string;
  organization: string;
  position: string;
  organizationWebsite: string;
  investorLinkedin: string;
  investorType: string;
  city: string;
  keyContactPersonName: string;
  keyContactNumber: string;
  keyContactLinkedin: string;
  decisionPeriodInWeeks: string;
  typicalCheckSizeInPhp: string;
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
  const [userType, setUserType] = useState<null | "investor" | "startup">(null);
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [investorData, setInvestorData] = useState<InvestorData>({
    firstName: "",
    lastName: "",
    organization: "",
    position: "",
    organizationWebsite: "",
    investorLinkedin: "",
    investorType: "",
    city: "",
    keyContactPersonName: "",
    keyContactNumber: "+63",
    keyContactLinkedin: "",
    decisionPeriodInWeeks: "",
    typicalCheckSizeInPhp: "",
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

  // Add beforeunload warning
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

  const handleSubmit = () => {
    if (step === 2) {
      setStep(3);
      return;
    }

    setIsSubmitted(true); // Prevent warning from unload

    // if (userType === "investor") {
    //   console.log("Complete Investor Data:", {
    //     fullData: investorData,
    //   });
    // } else {
    //   console.log("Complete Startup Data:", {
    //     fullData: startupData,
    //   });
    // }
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
        return !!(
          investorData.investorType &&
          investorData.city &&
          investorData.keyContactPersonName &&
          investorData.keyContactNumber.length > 3 &&
          investorData.decisionPeriodInWeeks &&
          investorData.typicalCheckSizeInPhp
        );
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
        <Step3
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
    </>
  );
}
