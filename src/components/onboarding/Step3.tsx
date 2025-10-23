import InvestorStep3 from "./investor-step3";
import StartupStep3 from "./startup-step3";

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

interface Step3Props {
  role?: "Investor" | "Startup";
  setStep: (step: number) => void;
  startupFormData?: StartupStep3FormData;
  setStartupFormData?: (data: StartupStep3FormData) => void;
}

export default function Step3({
  role,
  setStep,
  startupFormData,
  setStartupFormData,
}: Step3Props) {
  return (
    <div>
      {role === "Investor" && <InvestorStep3 setStep={setStep} />}
      {role === "Startup" && (
        <StartupStep3
          setStep={setStep}
          formData={startupFormData}
          setFormData={setStartupFormData}
        />
      )}
    </div>
  );
}
