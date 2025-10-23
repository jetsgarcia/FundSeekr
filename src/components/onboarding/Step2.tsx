import InvestorStep2 from "./investor-step2";
import StartupStep2 from "./startup-step2";

interface Step2Props {
  role?: "Investor" | "Startup";
  setStep: (step: number) => void;
}

export default function Step2({ role, setStep }: Step2Props) {
  return (
    <div>
      {role === "Investor" && <InvestorStep2 setStep={setStep} />}
      {role === "Startup" && <StartupStep2 setStep={setStep} />}
    </div>
  );
}
