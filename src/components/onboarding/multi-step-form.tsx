import { useState } from "react";
import Step1 from "./step1";
import Step2 from "./step2";

export default function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"Investor" | "Startup">();

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
        <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base mb-10">
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
          {step === 2 && <Step2 role={role} setStep={setStep} />}
        </div>
      </div>
    </div>
  );
}
