import { useState } from "react";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";

// Define interfaces for form data
interface StartupStep2FormData {
  name: string;
  phone_number: string;
  linkedin_url: string;
  business_name: string;
  business_description: string;
  web_url: string;
  city: string;
  date_founded: Date | undefined;
  business_structure: string;
}

interface TeamMember {
  name: string;
  linkedin: string;
  position: string;
}

interface Advisor {
  name: string;
  company: string;
  linkedin: string;
  expertise: string;
}

interface KeyMetric {
  name: string;
  value: string;
}

interface StartupStep3FormData {
  industry: string;
  development_stage: string;
  target_market: string[];
  keywords: string[];
  product_demo_url: string;
  key_metrics: KeyMetric[];
  team_members: TeamMember[];
  advisors: Advisor[];
}

export default function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"Investor" | "Startup">();

  // Centralized state for startup onboarding
  const [startupStep2Data, setStartupStep2Data] =
    useState<StartupStep2FormData>({
      name: "",
      phone_number: "",
      linkedin_url: "",
      business_name: "",
      business_description: "",
      web_url: "",
      city: "",
      date_founded: undefined,
      business_structure: "",
    });

  const [startupStep3Data, setStartupStep3Data] =
    useState<StartupStep3FormData>({
      industry: "",
      development_stage: "",
      target_market: [],
      keywords: [],
      product_demo_url: "",
      key_metrics: [{ name: "", value: "" }],
      team_members: [{ name: "", linkedin: "", position: "" }],
      advisors: [{ name: "", company: "", linkedin: "", expertise: "" }],
    });

  const totalSteps = 4;

  function getStepClasses(stepNumber: number) {
    const isActive = step === stepNumber;
    const isCompleted = step > stepNumber;
    const isNotLast = stepNumber < totalSteps;
    const isLineCompleted = step > stepNumber; // Line should be colored if current step is beyond this step

    const baseClasses = "flex items-center";
    const widthClasses = isNotLast ? "w-full" : "";
    const colorClasses =
      isActive || isCompleted
        ? "text-blue-600 dark:text-blue-500"
        : "text-gray-500 dark:text-gray-400";

    // Color the line if the step is completed (meaning we've moved past it)
    const afterClasses = isNotLast
      ? `after:content-[''] after:w-full after:h-1 after:border-b after:border-1 after:inline-block after:mx-2 sm:after:mx-6 xl:after:mx-10 ${
          isLineCompleted
            ? "after:border-blue-600 dark:after:border-blue-500"
            : "after:border-gray-200 dark:after:border-gray-700"
        }`
      : "";

    return `${baseClasses} ${widthClasses} ${colorClasses} ${afterClasses}`.trim();
  }

  return (
    <div className="flex justify-center p-0 sm:p-4">
      <div className="rounded-lg shadow-lg p-4 w-full">
        {/* Progress Steps */}
        <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base mb-5 sm:mb-10">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map(
            (stepNumber) => {
              const isCompleted = step > stepNumber;

              return (
                <li key={stepNumber} className={getStepClasses(stepNumber)}>
                  <span className="flex items-center">
                    {isCompleted ? (
                      <svg
                        className="w-8 h-8"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                      </svg>
                    ) : (
                      <span className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-current">
                        {stepNumber}
                      </span>
                    )}
                  </span>
                </li>
              );
            }
          )}
        </ol>

        {/* Form Content */}
        <div>
          {step === 1 && (
            <Step1 role={role} setStep={setStep} setRole={setRole} />
          )}
          {step === 2 && (
            <Step2
              role={role}
              setStep={setStep}
              startupFormData={startupStep2Data}
              setStartupFormData={setStartupStep2Data}
            />
          )}
          {step === 3 && (
            <Step3
              role={role}
              setStep={setStep}
              startupFormData={startupStep3Data}
              setStartupFormData={setStartupStep3Data}
            />
          )}
        </div>
      </div>
    </div>
  );
}
