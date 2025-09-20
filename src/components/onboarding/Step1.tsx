"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TrendingUp, Rocket, AlertCircle } from "lucide-react";

interface Step1Props {
  userType: "investor" | "startup" | null;
  setUserType: (type: "investor" | "startup" | null) => void;
  setStep: (step: number) => void;
  businessStructure: "Sole" | "Partnership" | "Corporation" | null;
  setBusinessStructure: (
    structure: "Sole" | "Partnership" | "Corporation" | null
  ) => void;
}

export function Step1({
  userType,
  setUserType,
  setStep,
  businessStructure,
  setBusinessStructure,
}: Step1Props) {
  const [showValidationError, setShowValidationError] = useState(false);

  const handleNext = () => {
    if (userType === "startup" && !businessStructure) {
      setShowValidationError(true);
      return;
    }
    setStep(2);
  };

  const handleUserTypeChange = (type: "investor" | "startup") => {
    setUserType(type);
    // Reset business structure when switching away from startup
    if (type !== "startup") {
      setBusinessStructure(null);
      setShowValidationError(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 w-full max-w-lg mx-4">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Please select your role
            </h1>
            <p className="text-slate-600 dark:text-slate-300 leading-tight">
              Choose whether you&apos;re looking to invest in startups or
              seeking investment for your business.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleUserTypeChange("investor")}
              className={`p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                userType === "investor"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                  : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              }`}
            >
              <div className="flex flex-col items-center space-y-3">
                <TrendingUp
                  className={`w-8 h-8 ${
                    userType === "investor"
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    userType === "investor"
                      ? "text-blue-900 dark:text-blue-300"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  Investor
                </span>
              </div>
            </button>

            <button
              onClick={() => handleUserTypeChange("startup")}
              className={`p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                userType === "startup"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                  : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              }`}
            >
              <div className="flex flex-col items-center space-y-3">
                <Rocket
                  className={`w-8 h-8 ${
                    userType === "startup"
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    userType === "startup"
                      ? "text-blue-900 dark:text-blue-300"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  Startup
                </span>
              </div>
            </button>
          </div>

          {userType === "startup" && (
            <div className="w-full space-y-3">
              <div className="text-center">
                <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Business Structure <span className="text-red-500">*</span>
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Select your company&apos;s legal structure
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => {
                    setBusinessStructure("Corporation");
                    setShowValidationError(false);
                  }}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer text-left ${
                    businessStructure === "Corporation"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span
                        className={`font-medium ${
                          businessStructure === "Corporation"
                            ? "text-blue-900 dark:text-blue-300"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        Corporation
                      </span>
                      <p
                        className={`text-xs mt-1 ${
                          businessStructure === "Corporation"
                            ? "text-blue-700 dark:text-blue-400"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        Separate legal entity, limited liability
                      </p>
                    </div>
                    {businessStructure === "Corporation" && (
                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                    )}
                  </div>
                </button>

                <button
                  onClick={() => {
                    setBusinessStructure("Partnership");
                    setShowValidationError(false);
                  }}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer text-left ${
                    businessStructure === "Partnership"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span
                        className={`font-medium ${
                          businessStructure === "Partnership"
                            ? "text-blue-900 dark:text-blue-300"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        Partnership
                      </span>
                      <p
                        className={`text-xs mt-1 ${
                          businessStructure === "Partnership"
                            ? "text-blue-700 dark:text-blue-400"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        Shared ownership and responsibilities
                      </p>
                    </div>
                    {businessStructure === "Partnership" && (
                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                    )}
                  </div>
                </button>

                <button
                  onClick={() => {
                    setBusinessStructure("Sole");
                    setShowValidationError(false);
                  }}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer text-left ${
                    businessStructure === "Sole"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span
                        className={`font-medium ${
                          businessStructure === "Sole"
                            ? "text-blue-900 dark:text-blue-300"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        Sole Proprietorship
                      </span>
                      <p
                        className={`text-xs mt-1 ${
                          businessStructure === "Sole"
                            ? "text-blue-700 dark:text-blue-400"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        Single owner, simplest business structure
                      </p>
                    </div>
                    {businessStructure === "Sole" && (
                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                    )}
                  </div>
                </button>
              </div>

              {showValidationError && !businessStructure && (
                <div className="flex items-center justify-center gap-2 text-sm text-red-600 dark:text-red-400 mt-2">
                  <AlertCircle className="w-4 h-4" />
                  Please select a business structure to continue.
                </div>
              )}
            </div>
          )}

          <div className="space-y-4">
            <Button
              onClick={handleNext}
              disabled={!userType}
              className="w-full px-6 transition-colors shadow-lg disabled:cursor-not-allowed"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
