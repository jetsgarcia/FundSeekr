"use client";

import { useState } from "react";
import { Step1 } from "@/components/onboarding/Step1";
import { Step2 } from "@/components/onboarding/Step2";
import { Step3 } from "@/components/onboarding/Step3";

interface InvestorFormData {
  firstName: string;
  lastName: string;
  organization: string;
  position: string;
  organizationWebsite: string;
  investorLinkedin: string;
}

interface StartupFormData {
  firstName: string;
  lastName: string;
  position: string;
  contactNumber: string;
  linkedinLink: string;
}

interface StartupProfileData {
  name: string;
  website: string;
  description: string;
  city: string;
  dateFounded: string;
  keywords: string;
  industry: string;
}

interface InvestorProfileData {
  investorType: string;
  city: string;
  keyContactPersonName: string;
  keyContactNumber: string;
  keyContactLinkedin: string;
  decisionPeriodInWeeks: string;
  typicalCheckSizeInPhp: string;
}

export default function OnboardingPage() {
  const [userType, setUserType] = useState<null | "investor" | "startup">(null);
  const [step, setStep] = useState(1);

  const [investorData, setInvestorData] = useState<InvestorFormData>({
    firstName: "",
    lastName: "",
    organization: "",
    position: "",
    organizationWebsite: "",
    investorLinkedin: "",
  });

  const [investorProfileData, setInvestorProfileData] =
    useState<InvestorProfileData>({
      investorType: "",
      city: "",
      keyContactPersonName: "",
      keyContactNumber: "+63",
      keyContactLinkedin: "",
      decisionPeriodInWeeks: "",
      typicalCheckSizeInPhp: "",
    });

  const [startupData, setStartupData] = useState<StartupFormData>({
    firstName: "",
    lastName: "",
    position: "",
    contactNumber: "+63",
    linkedinLink: "",
  });

  const [startupProfileData, setStartupProfileData] =
    useState<StartupProfileData>({
      name: "",
      website: "",
      description: "",
      city: "",
      dateFounded: "",
      keywords: "",
      industry: "",
    });

  const handleInvestorChange = (
    field: keyof InvestorFormData,
    value: string
  ) => {
    setInvestorData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStartupChange = (field: keyof StartupFormData, value: string) => {
    setStartupData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStartupProfileChange = (
    field: keyof StartupProfileData,
    value: string
  ) => {
    setStartupProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleInvestorProfileChange = (
    field: keyof InvestorProfileData,
    value: string
  ) => {
    setInvestorProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (step === 2) {
      setStep(3);
      return;
    }

    const basicData = userType === "investor" ? investorData : startupData;
    const profileData =
      userType === "investor" ? investorProfileData : startupProfileData;
    console.log("Final form submitted:", { userType, basicData, profileData });
    // Add your final submission logic here
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
          investorProfileData.investorType &&
          investorProfileData.city &&
          investorProfileData.keyContactPersonName &&
          investorProfileData.keyContactNumber.length > 3 &&
          investorProfileData.decisionPeriodInWeeks
        );
      } else {
        return !!(
          startupProfileData.name &&
          startupProfileData.description &&
          startupProfileData.city &&
          startupProfileData.dateFounded &&
          startupProfileData.industry
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
          investorProfileData={investorProfileData}
          startupProfileData={startupProfileData}
          handleInvestorProfileChange={handleInvestorProfileChange}
          handleStartupProfileChange={handleStartupProfileChange}
          handleSubmit={handleSubmit}
          isFormValid={isFormValid}
          setStep={setStep}
        />
      )}
    </>
  );
}
