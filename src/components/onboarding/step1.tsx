import { Rocket, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface Step1Props {
  role?: "Investor" | "Startup";
  setStep: (step: number) => void;
  setRole: (role: "Investor" | "Startup") => void;
}

export default function Step1({ role, setRole, setStep }: Step1Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Please select your role</CardTitle>
        <CardDescription>
          Choose whether you&apos;re looking to invest in startups or seeking
          investment for your business.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4">
          <button
            onClick={() => setRole("Investor")}
            className={cn(
              "p-6 sm:p-[8vw] rounded-xl border-2 border-gray-300 dark:border-gray-600 transition-all duration-200 cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 hover:shadow-lg",
              role === "Investor"
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50"
            )}
          >
            <div className="flex flex-col items-center space-y-3 sm:space-y-3">
              <TrendingUp className="w-8 h-8 sm:w-8 sm:h-8" />
              <span className="text-sm sm:text-sm font-medium">Investor</span>
            </div>
          </button>

          <button
            onClick={() => setRole("Startup")}
            className={cn(
              "p-6 sm:p-6 rounded-xl border-2 border-gray-300 dark:border-gray-600 transition-all duration-200 cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 hover:shadow-lg",
              role === "Startup"
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50"
            )}
          >
            <div className="flex flex-col items-center space-y-3 sm:space-y-3">
              <Rocket className="w-8 h-8 sm:w-8 sm:h-8" />
              <span className="text-sm sm:text-sm font-medium">Startup</span>
            </div>
          </button>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button onClick={() => setStep(2)} disabled={!role}>
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}
