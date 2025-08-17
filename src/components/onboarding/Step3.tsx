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
import { format, parse, startOfDay } from "date-fns";

interface InvestorData {
  firstName: string;
  lastName: string;
  organization: string;
  position: string;
  organizationWebsite: string;
  investorLinkedin: string;
  investorType: string;
  city: string;
  keyContactPersonName: string;
  keyContactNumber: string;
  keyContactLinkedin: string;
  decisionPeriodInWeeks: number;
  typicalCheckSizeInPhp: number;
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

interface Step3Props {
  userType: "investor" | "startup";
  investorData: InvestorData;
  startupData: StartupData;
  handleInvestorChange: (field: keyof InvestorData, value: string) => void;
  handleStartupChange: (field: keyof StartupData, value: string) => void;
  setStep: (step: number) => void;
  isFormValid: () => boolean;
  handleSubmit: () => void;
}

export function Step3({
  userType,
  investorData,
  startupData,
  handleInvestorChange,
  handleStartupChange,
  setStep,
  isFormValid,
  handleSubmit,
}: Step3Props) {
  // State for calendar date
  const [calendarDate, setCalendarDate] = React.useState<Date | undefined>(
    startupData.dateFounded
      ? parse(startupData.dateFounded, "yyyy-MM-dd", new Date())
      : undefined
  );

  // Handle calendar date selection
  const handleDateSelect = (date: Date | undefined) => {
    setCalendarDate(date);
    if (date) {
      // Format date as YYYY-MM-DD for form submission using local date
      const normalizedDate = startOfDay(date);
      const formattedDate = format(normalizedDate, "yyyy-MM-dd");
      handleStartupChange("dateFounded", formattedDate);
    } else {
      handleStartupChange("dateFounded", "");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-5xl mx-auto space-y-8">
        <Card className="w-full shadow-xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <CardHeader className="space-y-6 pt-8 pb-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {userType === "investor"
                  ? "Investor Profile"
                  : "Startup Profile"}
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-lg">
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
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="investorType"
                      className="text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Investor Type <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500 z-10" />
                      <Select
                        value={investorData.investorType}
                        onValueChange={(value) =>
                          handleInvestorChange("investorType", value)
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
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="checkSize"
                      className="text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Typical Check Size (PHP){" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs font-medium text-slate-400 dark:text-slate-500">
                        PHP
                      </span>
                      <Input
                        id="checkSize"
                        type="number"
                        value={
                          investorData.typicalCheckSizeInPhp === 0
                            ? ""
                            : investorData.typicalCheckSizeInPhp.toString()
                        }
                        onChange={(e) =>
                          handleInvestorChange(
                            "typicalCheckSizeInPhp",
                            e.target.value
                          )
                        }
                        className="pl-12 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="1000000"
                      />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="location"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Location (City) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <Input
                      id="location"
                      value={investorData.city}
                      onChange={(e) =>
                        handleInvestorChange("city", e.target.value)
                      }
                      className="pl-10 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Manila"
                    />
                  </div>
                </div>

                {/* Key Contact Person */}
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="keyContact"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Key Contact Person <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <Input
                      id="keyContact"
                      value={investorData.keyContactPersonName}
                      onChange={(e) =>
                        handleInvestorChange(
                          "keyContactPersonName",
                          e.target.value
                        )
                      }
                      className="pl-10 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="John Smith"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Contact Number */}
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
                        value={investorData.keyContactNumber}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Accept empty input (reset to +63) or valid Philippine phone pattern
                          if (value === "") {
                            handleInvestorChange("keyContactNumber", "+63");
                          } else if (
                            value.startsWith("+63") &&
                            /^\+63[0-9]{0,10}$/.test(value)
                          ) {
                            // Only allow +63 followed by up to 10 digits
                            handleInvestorChange("keyContactNumber", value);
                          }
                          // Ignore all other inputs (incomplete prefixes like "+" or "+6")
                        }}
                        className="pl-10 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="+639123456789"
                        maxLength={13}
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
                        value={investorData.keyContactLinkedin}
                        onChange={(e) =>
                          handleInvestorChange(
                            "keyContactLinkedin",
                            e.target.value
                          )
                        }
                        className="pl-10 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="https://linkedin.com/in/johnsmith"
                      />
                    </div>
                  </div>
                </div>

                {/* Decision Timeline */}
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="decisionTimeline"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Typical Decision-Making Timeline (in weeks){" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <Input
                      id="decisionTimeline"
                      type="number"
                      value={
                        investorData.decisionPeriodInWeeks === 0
                          ? ""
                          : investorData.decisionPeriodInWeeks.toString()
                      }
                      onChange={(e) =>
                        handleInvestorChange(
                          "decisionPeriodInWeeks",
                          e.target.value
                        )
                      }
                      className="pl-10 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="2"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Startup Name */}
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="startupName"
                      className="text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Startup Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                      <Input
                        id="startupName"
                        value={startupData.name}
                        onChange={(e) =>
                          handleStartupChange("name", e.target.value)
                        }
                        className="pl-10 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="FundSeekr"
                      />
                    </div>
                  </div>

                  {/* Website URL */}
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="website"
                      className="text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Website URL
                    </Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                      <Input
                        id="website"
                        value={startupData.website}
                        onChange={(e) =>
                          handleStartupChange("website", e.target.value)
                        }
                        className="pl-10 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="https://fundseekr.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Industry */}
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="industry"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Industry <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <Input
                      id="industry"
                      value={startupData.industry}
                      onChange={(e) =>
                        handleStartupChange("industry", e.target.value)
                      }
                      className="pl-10 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Fintech"
                    />
                  </div>
                </div>

                {/* Company Description */}
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="description"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Detailed Company Description{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <textarea
                      id="description"
                      placeholder="Accelerate fundraising with AI-powered pitch generation and smart matchmaking that connects the right startups with the right investors."
                      value={startupData.description}
                      onChange={(e) =>
                        handleStartupChange("description", e.target.value)
                      }
                      className="w-full min-h-[100px] px-3 py-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-md text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Location */}
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="startupLocation"
                      className="text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Location (City) <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                      <Input
                        id="startupLocation"
                        value={startupData.city}
                        onChange={(e) =>
                          handleStartupChange("city", e.target.value)
                        }
                        className="pl-10 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Manila"
                      />
                    </div>
                  </div>

                  {/* Date Founded */}
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="dateFounded"
                      className="text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      Date Founded <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500 z-10" />
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500 h-9 pl-10"
                          >
                            {calendarDate ? (
                              format(calendarDate, "PPP")
                            ) : (
                              <span className="text-slate-400 dark:text-slate-500">
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
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="keywords"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Keywords/Tags
                  </Label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <Input
                      id="keywords"
                      value={startupData.keywords}
                      onChange={(e) =>
                        handleStartupChange("keywords", e.target.value)
                      }
                      className="pl-10 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500"
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
                className="px-6 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors bg-transparent"
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
