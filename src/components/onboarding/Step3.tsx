import InvestorStep3 from "./investor-step3";
import StartupStep3 from "./startup-step3";

interface Step3Props {
  role?: "Investor" | "Startup";
  setStep: (step: number) => void;
}

export default function Step3({ role, setStep }: Step3Props) {
  return (
    <div>
      {role === "Investor" && <InvestorStep3 setStep={setStep} />}
      {role === "Startup" && <StartupStep3 setStep={setStep} />}
    </div>
  );
}
