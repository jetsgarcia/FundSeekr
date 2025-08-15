"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { User, Building2, Globe, Phone, Linkedin } from "lucide-react";

interface InvestorFormData {
  firstName: string;
  lastName: string;
  organization: string;
  position: string;
  organizationWebsite: string;
  investorLinkedin: string;
}

interface StartupFormData {
  firstName: string;
  lastName: string;
  position: string;
  contactNumber: string;
  linkedinLink: string;
}

interface Step2Props {
  userType: "investor" | "startup";
  investorData: InvestorFormData;
  startupData: StartupFormData;
  handleInvestorChange: (field: keyof InvestorFormData, value: string) => void;
  handleStartupChange: (field: keyof StartupFormData, value: string) => void;
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
        <Card className="w-full shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-6 pt-8 pb-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-slate-900">
                Basic Information
              </h1>
              <p className="text-slate-600 text-lg">
                {userType === "investor"
                  ? "Tell us about yourself as an investor"
                  : "Tell us about yourself and your startup"}
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {userType === "investor" ? (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="firstName"
                      className="text-sm font-medium text-slate-700"
                    >
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        id="firstName"
                        value={investorData.firstName}
                        onChange={(e) =>
                          handleInvestorChange("firstName", e.target.value)
                        }
                        className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="John"
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="lastName"
                      className="text-sm font-medium text-slate-700"
                    >
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        id="lastName"
                        value={investorData.lastName}
                        onChange={(e) =>
                          handleInvestorChange("lastName", e.target.value)
                        }
                        className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Smith"
                      />
                    </div>
                  </div>
                </div>

                {/* Organization */}
                <div className="space-y-1">
                  <Label
                    htmlFor="organization"
                    className="text-sm font-medium text-slate-700"
                  >
                    Organization
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      id="organization"
                      value={investorData.organization}
                      onChange={(e) =>
                        handleInvestorChange("organization", e.target.value)
                      }
                      className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="ABC Venture Capital"
                    />
                  </div>
                </div>

                {/* Position and Website (only if organization is filled) */}
                {investorData.organization && (
                  <>
                    <div className="space-y-1">
                      <Label
                        htmlFor="position"
                        className="text-sm font-medium text-slate-700"
                      >
                        Position
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                          id="position"
                          value={investorData.position}
                          onChange={(e) =>
                            handleInvestorChange("position", e.target.value)
                          }
                          className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Senior Partner"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label
                        htmlFor="website"
                        className="text-sm font-medium text-slate-700"
                      >
                        Website URL
                      </Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                          id="website"
                          type="url"
                          value={investorData.organizationWebsite}
                          onChange={(e) =>
                            handleInvestorChange(
                              "organizationWebsite",
                              e.target.value
                            )
                          }
                          className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="https://abcventures.com"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* LinkedIn Profile */}
                <div className="space-y-1">
                  <Label
                    htmlFor="linkedinProfile"
                    className="text-sm font-medium text-slate-700"
                  >
                    LinkedIn Profile
                  </Label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      id="linkedinProfile"
                      type="url"
                      value={investorData.investorLinkedin}
                      onChange={(e) =>
                        handleInvestorChange("investorLinkedin", e.target.value)
                      }
                      className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="https://linkedin.com/in/johnsmith"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="firstName"
                      className="text-sm font-medium text-slate-700"
                    >
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        id="firstName"
                        value={startupData.firstName}
                        onChange={(e) =>
                          handleStartupChange("firstName", e.target.value)
                        }
                        className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="John"
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="lastName"
                      className="text-sm font-medium text-slate-700"
                    >
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        id="lastName"
                        value={startupData.lastName}
                        onChange={(e) =>
                          handleStartupChange("lastName", e.target.value)
                        }
                        className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Smith"
                      />
                    </div>
                  </div>
                </div>

                {/* Position */}
                <div className="space-y-1">
                  <Label
                    htmlFor="position"
                    className="text-sm font-medium text-slate-700"
                  >
                    Position <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      id="position"
                      value={startupData.position}
                      onChange={(e) =>
                        handleStartupChange("position", e.target.value)
                      }
                      className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="CEO, CTO, Founder"
                    />
                  </div>
                </div>

                {/* Contact Number and LinkedIn in one row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label
                      htmlFor="contactNumber"
                      className="text-sm font-medium text-slate-700"
                    >
                      Contact Number <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        id="contactNumber"
                        type="tel"
                        value={startupData.contactNumber}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (
                            value.startsWith("+63") ||
                            value === "+6" ||
                            value === "+"
                          ) {
                            handleStartupChange("contactNumber", value);
                          } else if (value === "") {
                            handleStartupChange("contactNumber", "+63");
                          }
                        }}
                        className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="+639123456789"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label
                      htmlFor="linkedinProfile"
                      className="text-sm font-medium text-slate-700"
                    >
                      LinkedIn Profile
                    </Label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        id="linkedinProfile"
                        type="url"
                        value={startupData.linkedinLink}
                        onChange={(e) =>
                          handleStartupChange("linkedinLink", e.target.value)
                        }
                        className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
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
                className="px-6 border-slate-300 hover:bg-slate-50 transition-colors bg-transparent"
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!isFormValid()}
                className="px-6 bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg"
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
