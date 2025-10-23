import InvestorStep2 from "./investor-step2";
import StartupStep2 from "./startup-step2";

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

interface Step2Props {
  role?: "Investor" | "Startup";
  setStep: (step: number) => void;
  startupFormData?: StartupStep2FormData;
  setStartupFormData?: (data: StartupStep2FormData) => void;
}

export default function Step2({
  role,
  setStep,
  startupFormData,
  setStartupFormData,
}: Step2Props) {
  return (
    <div>
      {role === "Investor" && <InvestorStep2 setStep={setStep} />}
      {role === "Startup" && (
        <StartupStep2
          setStep={setStep}
          formData={startupFormData}
          setFormData={setStartupFormData}
        />
      )}
    </div>
  );
}
