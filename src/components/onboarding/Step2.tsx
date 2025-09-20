"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { User, Building2, Phone, Linkedin } from "lucide-react";

interface InvestorData {
  firstName: string;
  lastName: string;
  organization: string;
  linkedinURL: string;
}

interface StartupData {
  firstName: string;
  lastName: string;
  position: string;
  contactNumber: string;
  linkedinLink: string;
  name: string;
  website: string;
  description: string;
  city: string;
  dateFounded: string;
  keywords: string;
  industry: string;
}

interface Step2Props {
  userType: "investor" | "startup";
  investorData: InvestorData;
  startupData: StartupData;
  handleInvestorChange: (field: keyof InvestorData, value: string) => void;
  handleStartupChange: (field: keyof StartupData, value: string) => void;
  setStep: (step: number) => void;
  isFormValid: () => boolean;
  handleSubmit: () => void;
}

export function Step2({
  userType,
  investorData,
  startupData,
  handleInvestorChange,
  handleStartupChange,
  setStep,
  isFormValid,
  handleSubmit,
}: Step2Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-5xl mx-auto space-y-8">
        <Card className="w-full shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="space-y-6 pt-8 pb-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                Basic Information
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-lg">
                Tell us about yourself
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {userType === "investor" ? (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="firstName"
                      className="text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                      <Input
                        id="firstName"
                        value={investorData.firstName}
                        onChange={(e) =>
                          handleInvestorChange("firstName", e.target.value)
                        }
                        className="pl-10 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
                        placeholder="John"
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="lastName"
                      className="text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                      <Input
                        id="lastName"
                        value={investorData.lastName}
                        onChange={(e) =>
                          handleInvestorChange("lastName", e.target.value)
                        }
                        className="pl-10 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
                        placeholder="Smith"
                      />
                    </div>
                  </div>
                </div>

                {/* Organization */}
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="organization"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Organization
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <Input
                      id="organization"
                      value={investorData.organization}
                      onChange={(e) =>
                        handleInvestorChange("organization", e.target.value)
                      }
                      className="pl-10 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
                      placeholder="ABC Venture Capital"
                    />
                  </div>
                </div>

                {/* LinkedIn Profile */}
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="linkedinProfile"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    LinkedIn Profile
                  </Label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <Input
                      id="linkedinProfile"
                      type="url"
                      value={investorData.linkedinURL}
                      onChange={(e) =>
                        handleInvestorChange("linkedinURL", e.target.value)
                      }
                      className="pl-10 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
                      placeholder="https://linkedin.com/in/johnsmith"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="firstName"
                      className="text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                      <Input
                        id="firstName"
                        value={startupData.firstName}
                        onChange={(e) =>
                          handleStartupChange("firstName", e.target.value)
                        }
                        className="pl-10 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
                        placeholder="John"
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="lastName"
                      className="text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                      <Input
                        id="lastName"
                        value={startupData.lastName}
                        onChange={(e) =>
                          handleStartupChange("lastName", e.target.value)
                        }
                        className="pl-10 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
                        placeholder="Smith"
                      />
                    </div>
                  </div>
                </div>

                {/* Position */}
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="position"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Position <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <Input
                      id="position"
                      value={startupData.position}
                      onChange={(e) =>
                        handleStartupChange("position", e.target.value)
                      }
                      className="pl-10 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
                      placeholder="CEO, CTO, Founder"
                    />
                  </div>
                </div>

                {/* Contact Number and LinkedIn in one row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="contactNumber"
                      className="text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Contact Number <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                      <Input
                        id="contactNumber"
                        type="tel"
                        value={startupData.contactNumber}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Accept empty input (reset to +63) or valid Philippine phone pattern
                          if (value === "") {
                            handleStartupChange("contactNumber", "+63");
                          } else if (
                            value.startsWith("+63") &&
                            /^\+63[0-9]{0,10}$/.test(value)
                          ) {
                            // Only allow +63 followed by up to 10 digits
                            handleStartupChange("contactNumber", value);
                          }
                          // Ignore all other inputs (incomplete prefixes like "+" or "+6")
                        }}
                        className="pl-10 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
                        placeholder="+639123456789"
                        maxLength={13}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="linkedinProfile"
                      className="text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      LinkedIn Profile
                    </Label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                      <Input
                        id="linkedinProfile"
                        type="url"
                        value={startupData.linkedinLink}
                        onChange={(e) =>
                          handleStartupChange("linkedinLink", e.target.value)
                        }
                        className="pl-10 border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100"
                        placeholder="https://linkedin.com/in/johnsmith"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end gap-3 pt-6">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="px-6 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors bg-transparent dark:bg-transparent dark:text-slate-200"
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!isFormValid()}
                className="px-6 bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg"
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
