import InvestorStep4 from "./investor-step4";
import StartupStep4 from "./startup-step4";

interface Step4Props {
  role?: "Investor" | "Startup";
  setStep: (step: number) => void;
}

export default function Step4({ role, setStep }: Step4Props) {
  return (
    <div>
      {role === "Investor" && <InvestorStep4 setStep={setStep} />}
      {role === "Startup" && <StartupStep4 setStep={setStep} />}
    </div>
  );
}
