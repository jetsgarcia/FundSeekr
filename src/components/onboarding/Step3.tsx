"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  MapPin,
  Phone,
  Linkedin,
  Clock,
  Building,
  Globe,
  Calendar,
  Tag,
} from "lucide-react";
import { format } from "date-fns";

interface InvestorProfileData {
  investorType: string;
  typicalCheckSizeInPhp: string;
  city: string;
  keyContactPersonName: string;
  keyContactNumber: string;
  keyContactLinkedin: string;
  decisionPeriodInWeeks: string;
}

interface StartupProfileData {
  name: string;
  website: string;
  industry: string;
  description: string;
  city: string;
  dateFounded: string;
  keywords: string;
}

interface Step3Props {
  userType: "investor" | "startup";
  investorProfileData: InvestorProfileData;
  startupProfileData: StartupProfileData;
  handleInvestorProfileChange: (
    field: keyof InvestorProfileData,
    value: string
  ) => void;
  handleStartupProfileChange: (
    field: keyof StartupProfileData,
    value: string
  ) => void;
  setStep: (step: number) => void;
  isFormValid: () => boolean;
  handleSubmit: () => void;
}

export function Step3({
  userType,
  investorProfileData,
  startupProfileData,
  handleInvestorProfileChange,
  handleStartupProfileChange,
  setStep,
  isFormValid,
  handleSubmit,
}: Step3Props) {
  // State for calendar date
  const [calendarDate, setCalendarDate] = React.useState<Date | undefined>(
    startupProfileData.dateFounded
      ? new Date(startupProfileData.dateFounded)
      : undefined
  );

  // Handle calendar date selection
  const handleDateSelect = (date: Date | undefined) => {
    setCalendarDate(date);
    if (date) {
      // Format date as YYYY-MM-DD for form submission
      const formattedDate = date.toISOString().split("T")[0];
      handleStartupProfileChange("dateFounded", formattedDate);
    } else {
      handleStartupProfileChange("dateFounded", "");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-5xl mx-auto space-y-8">
        <Card className="w-full shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-6 pt-8 pb-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-slate-900">
                {userType === "investor"
                  ? "Investor Profile"
                  : "Startup Profile"}
              </h1>
              <p className="text-slate-600 text-lg">
                {userType === "investor"
                  ? "Tell us more about your investment profile"
                  : "Tell us more about your startup"}
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {userType === "investor" ? (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Investor Type */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="investorType"
                      className="text-sm font-medium text-slate-700"
                    >
                      Investor Type <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 z-10" />
                      <Select
                        value={investorProfileData.investorType}
                        onValueChange={(value) =>
                          handleInvestorProfileChange("investorType", value)
                        }
                      >
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Select investor type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Angel investor">
                            Angel Investor
                          </SelectItem>
                          <SelectItem value="Crowdfunding investor">
                            Crowdfunding Investor
                          </SelectItem>
                          <SelectItem value="Venture capital">
                            Venture Capital
                          </SelectItem>
                          <SelectItem value="Corporate investor">
                            Corporate Investor
                          </SelectItem>
                          <SelectItem value="Private equity">
                            Private Equity
                          </SelectItem>
                          <SelectItem value="Impact investor">
                            Impact Investor
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Typical Check Size */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="checkSize"
                      className="text-sm font-medium text-slate-700"
                    >
                      Typical Check Size (PHP)
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs font-medium text-slate-400">
                        PHP
                      </span>
                      <Input
                        id="checkSize"
                        type="number"
                        value={investorProfileData.typicalCheckSizeInPhp}
                        onChange={(e) =>
                          handleInvestorProfileChange(
                            "typicalCheckSizeInPhp",
                            e.target.value
                          )
                        }
                        className="pl-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="1000000"
                      />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-1">
                  <Label
                    htmlFor="location"
                    className="text-sm font-medium text-slate-700"
                  >
                    Location (City) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      id="location"
                      value={investorProfileData.city}
                      onChange={(e) =>
                        handleInvestorProfileChange("city", e.target.value)
                      }
                      className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Manila"
                    />
                  </div>
                </div>

                {/* Key Contact Person */}
                <div className="space-y-1">
                  <Label
                    htmlFor="keyContact"
                    className="text-sm font-medium text-slate-700"
                  >
                    Key Contact Person <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      id="keyContact"
                      value={investorProfileData.keyContactPersonName}
                      onChange={(e) =>
                        handleInvestorProfileChange(
                          "keyContactPersonName",
                          e.target.value
                        )
                      }
                      className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="John Smith"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Contact Number */}
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
                        value={investorProfileData.keyContactNumber}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Accept empty input (reset to +63) or valid Philippine phone pattern
                          if (value === "") {
                            handleInvestorProfileChange(
                              "keyContactNumber",
                              "+63"
                            );
                          } else if (
                            value.startsWith("+63") &&
                            /^\+63[0-9]{0,10}$/.test(value)
                          ) {
                            // Only allow +63 followed by up to 10 digits
                            handleInvestorProfileChange(
                              "keyContactNumber",
                              value
                            );
                          }
                          // Ignore all other inputs (incomplete prefixes like "+" or "+6")
                        }}
                        className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="+639123456789"
                        maxLength={13}
                      />
                    </div>
                  </div>

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
                        value={investorProfileData.keyContactLinkedin}
                        onChange={(e) =>
                          handleInvestorProfileChange(
                            "keyContactLinkedin",
                            e.target.value
                          )
                        }
                        className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="https://linkedin.com/in/johnsmith"
                      />
                    </div>
                  </div>
                </div>

                {/* Decision Timeline */}
                <div className="space-y-1">
                  <Label
                    htmlFor="decisionTimeline"
                    className="text-sm font-medium text-slate-700"
                  >
                    Typical Decision-Making Timeline (in weeks){" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      id="decisionTimeline"
                      type="number"
                      value={investorProfileData.decisionPeriodInWeeks}
                      onChange={(e) =>
                        handleInvestorProfileChange(
                          "decisionPeriodInWeeks",
                          e.target.value
                        )
                      }
                      className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="2"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Startup Name */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="startupName"
                      className="text-sm font-medium text-slate-700"
                    >
                      Startup Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        id="startupName"
                        value={startupProfileData.name}
                        onChange={(e) =>
                          handleStartupProfileChange("name", e.target.value)
                        }
                        className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="FundSeekr"
                      />
                    </div>
                  </div>

                  {/* Website URL */}
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
                        value={startupProfileData.website}
                        onChange={(e) =>
                          handleStartupProfileChange("website", e.target.value)
                        }
                        className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="https://fundseekr.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Industry */}
                <div className="space-y-1">
                  <Label
                    htmlFor="industry"
                    className="text-sm font-medium text-slate-700"
                  >
                    Industry <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      id="industry"
                      value={startupProfileData.industry}
                      onChange={(e) =>
                        handleStartupProfileChange("industry", e.target.value)
                      }
                      className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Fintech"
                    />
                  </div>
                </div>

                {/* Company Description */}
                <div className="space-y-1">
                  <Label
                    htmlFor="description"
                    className="text-sm font-medium text-slate-700"
                  >
                    Detailed Company Description{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <textarea
                      id="description"
                      placeholder="Accelerate fundraising with AI-powered pitch generation and smart matchmaking that connects the right startups with the right investors."
                      value={startupProfileData.description}
                      onChange={(e) =>
                        handleStartupProfileChange(
                          "description",
                          e.target.value
                        )
                      }
                      className="w-full min-h-[100px] px-3 py-3 border border-slate-200 rounded-md text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Location */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="startupLocation"
                      className="text-sm font-medium text-slate-700"
                    >
                      Location (City) <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        id="startupLocation"
                        value={startupProfileData.city}
                        onChange={(e) =>
                          handleStartupProfileChange("city", e.target.value)
                        }
                        className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Manila"
                      />
                    </div>
                  </div>

                  {/* Date Founded */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="dateFounded"
                      className="text-sm font-medium text-slate-700"
                    >
                      Date Founded <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 z-10" />
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal border-slate-200 focus:border-blue-500 focus:ring-blue-500 h-9 pl-10"
                          >
                            {calendarDate ? (
                              format(calendarDate, "PPP")
                            ) : (
                              <span className="text-slate-400">
                                Pick a date
                              </span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <div className="p-3 border-b">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDateSelect(new Date())}
                              className="w-full"
                            >
                              Today
                            </Button>
                          </div>
                          <CalendarComponent
                            mode="single"
                            selected={calendarDate}
                            onSelect={handleDateSelect}
                            initialFocus
                            captionLayout="dropdown"
                            fromYear={1900}
                            toYear={new Date().getFullYear()}
                            className="rounded-lg"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                {/* Keywords/Tags */}
                <div className="space-y-1">
                  <Label
                    htmlFor="keywords"
                    className="text-sm font-medium text-slate-700"
                  >
                    Keywords/Tags
                  </Label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      id="keywords"
                      value={startupProfileData.keywords}
                      onChange={(e) =>
                        handleStartupProfileChange("keywords", e.target.value)
                      }
                      className="pl-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="AI, SaaS, Healthcare, Fintech"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="px-6 border-slate-300 hover:bg-slate-50 transition-colors bg-transparent"
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!isFormValid()}
                className="px-6 bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg"
              >
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
