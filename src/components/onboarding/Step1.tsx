"use client";

import { Button } from "@/components/ui/button";
import { TrendingUp, Rocket } from "lucide-react";

interface Step1Props {
  userType: "investor" | "startup" | null;
  setUserType: (type: "investor" | "startup" | null) => void;
  setStep: (step: number) => void;
}

export function Step1({ userType, setUserType, setStep }: Step1Props) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg mx-4">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">
              Please select your role
            </h1>
            <p className="text-slate-600 leading leading-tight">
              Choose whether you&apos;re looking to invest in startups or
              seeking investment for your business.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setUserType("investor")}
              className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                userType === "investor"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex flex-col items-center space-y-3">
                <TrendingUp
                  className={`w-8 h-8 ${
                    userType === "investor" ? "text-blue-600" : "text-gray-400"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    userType === "investor" ? "text-blue-900" : "text-gray-600"
                  }`}
                >
                  Investor
                </span>
              </div>
            </button>

            <button
              onClick={() => setUserType("startup")}
              className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                userType === "startup"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex flex-col items-center space-y-3">
                <Rocket
                  className={`w-8 h-8 ${
                    userType === "startup" ? "text-blue-600" : "text-gray-400"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    userType === "startup" ? "text-blue-900" : "text-gray-600"
                  }`}
                >
                  Startup
                </span>
              </div>
            </button>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => setStep(2)}
              disabled={!userType}
              className="w-full px-6 bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
