"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Save,
  Plus,
  Trash2,
  Building2,
  Banknote,
  Target,
  Loader2,
  TrendingUp,
  Phone,
  Briefcase,
} from "lucide-react";
import type { investors as InvestorProfileType, Prisma } from "@prisma/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

// server action-import shim via inline "use server" function wrappers in the component scope
import { replaceInvestorDocument } from "@/actions/profile";

interface NotableExit {
  company: string;
  exit_amount: string;
  year: string;
}

interface NotableExitJson {
  company?: string;
  exit_amount?: string;
  year?: string;
}

interface InvestorFormData {
  organization: string;
  position: string;
  city: string;
  organization_website: string;
  investor_linkedin: string;
  typical_check_size_in_php: bigint | null;
  decision_period_in_weeks: number | null;
  involvement_level: string | null;
  key_contact_person_name: string;
  key_contact_linkedin: string;
  key_contact_number: string;
  preferred_industries: string[];
  excluded_industries: string[];
  preferred_business_models: string[];
  preferred_funding_stages: string[];
  geographic_focus: string[];
  value_proposition: string[];
  portfolio_companies: string[];
  notable_exits: NotableExit[];
}

interface EditInvestorProfileProps {
  investor: InvestorProfileType;
  onSave?: (data: Record<string, unknown>) => Promise<{
    ok: boolean;
    profile?: Record<string, unknown>;
    error?: string;
  }>;
  onCancel?: () => void;
}

export function EditInvestorProfile({
  investor,
  onSave,
}: EditInvestorProfileProps) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Basic fields
  const [organization, setOrganization] = useState(investor.organization || "");
  const [position, setPosition] = useState(investor.position || "");
  const [city, setCity] = useState(investor.city || "");
  const [organizationWebsite, setOrganizationWebsite] = useState(
    investor.organization_website || ""
  );
  const [investorLinkedin, setInvestorLinkedin] = useState(
    investor.investor_linkedin || ""
  );
  const [typicalCheckSize, setTypicalCheckSize] = useState(
    investor.typical_check_size_in_php?.toString() || ""
  );
  const [decisionPeriod, setDecisionPeriod] = useState(
    investor.decision_period_in_weeks?.toString() || ""
  );
  const [involvementLevel, setInvolvementLevel] = useState(
    investor.involvement_level || ""
  );
  const [keyContactName, setKeyContactName] = useState(
    investor.key_contact_person_name || ""
  );
  const [keyContactLinkedin, setKeyContactLinkedin] = useState(
    investor.key_contact_linkedin || ""
  );
  const [keyContactNumber, setKeyContactNumber] = useState(
    investor.key_contact_number || "+63"
  );

  // Array fields
  const [preferredIndustries, setPreferredIndustries] = useState<string>(
    investor.preferred_industries?.join(", ") || ""
  );
  const [excludedIndustries, setExcludedIndustries] = useState<string>(
    investor.excluded_industries?.join(", ") || ""
  );
  const [preferredBusinessModels, setPreferredBusinessModels] = useState<
    string[]
  >(investor.preferred_business_models || []);
  const [preferredFundingStages, setPreferredFundingStages] = useState<
    string[]
  >(investor.preferred_funding_stages || []);
  const [geographicFocus, setGeographicFocus] = useState<string>(
    investor.geographic_focus?.join(", ") || ""
  );
  const [valueProposition, setValueProposition] = useState<string>(
    investor.value_proposition?.join(", ") || ""
  );
  const [portfolioCompanies, setPortfolioCompanies] = useState<string>(
    investor.portfolio_companies?.join(", ") || ""
  );

  // Complex JSON fields
  const [notableExits, setNotableExits] = useState<NotableExit[]>(
    investor.notable_exits?.map((exit: Prisma.JsonValue) => {
      const exitObj = exit as NotableExitJson;
      return {
        company: String(exitObj?.company || ""),
        exit_amount: String(exitObj?.exit_amount || ""),
        year: String(exitObj?.year || ""),
      };
    }) || []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSave) {
      toast.error("No save function provided");
      return;
    }

    startTransition(async () => {
      try {
        const formData: InvestorFormData = {
          organization,
          position,
          city,
          organization_website: organizationWebsite,
          investor_linkedin: investorLinkedin,
          typical_check_size_in_php: typicalCheckSize
            ? BigInt(typicalCheckSize)
            : null,
          decision_period_in_weeks: decisionPeriod
            ? parseInt(decisionPeriod)
            : null,
          involvement_level: involvementLevel || null,
          key_contact_person_name: keyContactName,
          key_contact_linkedin: keyContactLinkedin,
          key_contact_number: keyContactNumber,
          preferred_industries: preferredIndustries
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          excluded_industries: excludedIndustries
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          preferred_business_models: preferredBusinessModels,
          preferred_funding_stages: preferredFundingStages,
          geographic_focus: geographicFocus
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          value_proposition: valueProposition
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          portfolio_companies: portfolioCompanies
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          notable_exits: notableExits.filter((exit) => exit.company.trim()),
        };

        // Convert to a plain object for the API call
        const plainFormData = { ...formData };
        const result = await onSave(plainFormData);

        if (result.ok) {
          toast.success("Profile updated successfully!");
          router.push("/profile");
        } else {
          toast.error(
            result.error || "Failed to update profile. Please try again."
          );
        }
      } catch (error: unknown) {
        console.error("Error saving investor profile:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to update profile. Please try again.";
        toast.error(errorMessage);
      }
    });
  };

  const addNotableExit = () => {
    setNotableExits([
      ...notableExits,
      { company: "", exit_amount: "", year: "" },
    ]);
  };

  const removeNotableExit = (index: number) => {
    setNotableExits(notableExits.filter((_, i) => i !== index));
  };

  const updateNotableExit = (
    index: number,
    field: keyof NotableExit,
    value: string
  ) => {
    const updated = [...notableExits];
    if (field === "exit_amount" || field === "year") {
      const numericValue = value.replace(/[^0-9]/g, "");
      updated[index] = { ...updated[index], [field]: numericValue };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setNotableExits(updated);
  };

  const handlePhoneNumberChange = (value: string) => {
    if (!value.startsWith("+63")) {
      value = "+63" + value.replace(/^\+63/, "");
    }

    const cleanValue = value.replace(/[^+0-9]/g, "");

    if (cleanValue.startsWith("+63")) {
      const limitedValue = cleanValue.substring(0, 13);
      setKeyContactNumber(limitedValue);
    }
  };

  return (
    <div className="space-y-6">
      {/* Verification Documents (separate from main form to avoid nested forms) */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Briefcase className="h-5 w-5" />
            <span>Verification Documents</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Govt ID */}
            <div className="space-y-3">
              <div className="aspect-video relative overflow-hidden rounded-md border bg-muted">
                {investor.govt_id_image_url ? (
                  <Image
                    src={investor.govt_id_image_url}
                    alt="Government ID"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                    No ID uploaded
                  </div>
                )}
              </div>
              <form
                action={async (fd: FormData) => {
                  const file = fd.get("file") as File | null;
                  if (!file) {
                    toast.error("Please choose a file");
                    return;
                  }
                  fd.set("docType", "validId");
                  const res = await replaceInvestorDocument(fd);
                  if (res.ok) {
                    toast.success("ID updated");
                    router.refresh();
                  } else {
                    toast.error(res.error || "Failed to update ID");
                  }
                }}
                className="space-y-2"
              >
                <Input
                  id="investor-id-file"
                  name="file"
                  type="file"
                  accept="image/*"
                />
                <Button type="submit" size="sm" variant="outline">
                  Replace ID
                </Button>
              </form>
            </div>

            {/* Selfie */}
            <div className="space-y-3">
              <div className="aspect-video relative overflow-hidden rounded-md border bg-muted">
                {investor.selfie_image_url ? (
                  <Image
                    src={investor.selfie_image_url}
                    alt="Selfie"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                    No selfie uploaded
                  </div>
                )}
              </div>
              <form
                action={async (fd: FormData) => {
                  const file = fd.get("file") as File | null;
                  if (!file) {
                    toast.error("Please choose a file");
                    return;
                  }
                  fd.set("docType", "selfie");
                  const res = await replaceInvestorDocument(fd);
                  if (res.ok) {
                    toast.success("Selfie updated");
                    router.refresh();
                  } else {
                    toast.error(res.error || "Failed to update selfie");
                  }
                }}
                className="space-y-2"
              >
                <Input
                  id="investor-selfie-file"
                  name="file"
                  type="file"
                  accept="image/*"
                />
                <Button type="submit" size="sm" variant="outline">
                  Replace Selfie
                </Button>
              </form>
            </div>

            {/* Proof of Bank */}
            <div className="space-y-3">
              <div className="aspect-video relative overflow-hidden rounded-md border bg-muted">
                {investor.proof_of_bank_image_url ? (
                  <Image
                    src={investor.proof_of_bank_image_url}
                    alt="Proof of Bank"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                    No proof of bank uploaded
                  </div>
                )}
              </div>
              <form
                action={async (fd: FormData) => {
                  const file = fd.get("file") as File | null;
                  if (!file) {
                    toast.error("Please choose a file");
                    return;
                  }
                  fd.set("docType", "proofOfBank");
                  const res = await replaceInvestorDocument(fd);
                  if (res.ok) {
                    toast.success("Proof of bank updated");
                    router.refresh();
                  } else {
                    toast.error(res.error || "Failed to update proof of bank");
                  }
                }}
                className="space-y-2"
              >
                <Input
                  id="investor-bank-file"
                  name="file"
                  type="file"
                  accept="image/*"
                />
                <Button type="submit" size="sm" variant="outline">
                  Replace Bank Doc
                </Button>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>Basic Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="Enter your organization"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Enter your position"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter your city"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organizationWebsite">
                  Organization Website
                </Label>
                <Input
                  id="organizationWebsite"
                  value={organizationWebsite}
                  onChange={(e) => setOrganizationWebsite(e.target.value)}
                  placeholder="https://yourorganization.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="involvementLevel">Involvement Level</Label>
                <Select
                  value={involvementLevel}
                  onValueChange={setInvolvementLevel}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select involvement level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hands_off">Hands off</SelectItem>
                    <SelectItem value="Advisor">Advisor</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Controlling">Controlling</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investment Details */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Banknote className="h-5 w-5" />
              <span>Investment Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="typicalCheckSize">
                  Typical Check Size (PHP)
                </Label>
                <Input
                  id="typicalCheckSize"
                  type="number"
                  value={typicalCheckSize}
                  onChange={(e) => setTypicalCheckSize(e.target.value)}
                  placeholder="Enter typical check size"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="decisionPeriod">Decision Period (Weeks)</Label>
                <Input
                  id="decisionPeriod"
                  type="number"
                  value={decisionPeriod}
                  onChange={(e) => setDecisionPeriod(e.target.value)}
                  placeholder="Enter decision period in weeks"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="h-5 w-5" />
              <span>Contact Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="investorLinkedin">LinkedIn Profile</Label>
                <Input
                  id="investorLinkedin"
                  value={investorLinkedin}
                  onChange={(e) => setInvestorLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="keyContactName">Key Contact Name</Label>
                <Input
                  id="keyContactName"
                  value={keyContactName}
                  onChange={(e) => setKeyContactName(e.target.value)}
                  placeholder="Enter key contact person name"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="keyContactLinkedin">Key Contact LinkedIn</Label>
                <Input
                  id="keyContactLinkedin"
                  value={keyContactLinkedin}
                  onChange={(e) => setKeyContactLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/keycontact"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="keyContactNumber">Key Contact Number</Label>
                <Input
                  id="keyContactNumber"
                  value={keyContactNumber}
                  onChange={(e) => handlePhoneNumberChange(e.target.value)}
                  placeholder="+63XXXXXXXXXX"
                  maxLength={13}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investment Preferences */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Investment Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="preferredIndustries">Preferred Industries</Label>
              <Input
                id="preferredIndustries"
                value={preferredIndustries}
                onChange={(e) => setPreferredIndustries(e.target.value)}
                placeholder="Enter preferred industries separated by commas"
              />
              <p className="text-sm text-muted-foreground">
                Separate multiple industries with commas (e.g., &quot;Fintech,
                Healthcare, AI&quot;)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excludedIndustries">Excluded Industries</Label>
              <Input
                id="excludedIndustries"
                value={excludedIndustries}
                onChange={(e) => setExcludedIndustries(e.target.value)}
                placeholder="Enter excluded industries separated by commas"
              />
              <p className="text-sm text-muted-foreground">
                Industries you prefer not to invest in
              </p>
            </div>

            <div className="space-y-2">
              <Label>Preferred Business Models</Label>
              <div className="flex flex-col gap-2">
                {(["Sole", "Partnership", "Corporation"] as const).map(
                  (model) => {
                    const checked = preferredBusinessModels.includes(model);
                    return (
                      <label
                        key={model}
                        className="inline-flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4"
                          checked={checked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setPreferredBusinessModels([
                                ...preferredBusinessModels,
                                model,
                              ]);
                            } else {
                              setPreferredBusinessModels(
                                preferredBusinessModels.filter(
                                  (m) => m !== model
                                )
                              );
                            }
                          }}
                        />
                        <span>{model}</span>
                      </label>
                    );
                  }
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Select one or more.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Preferred Funding Stages</Label>
              <div className="flex flex-col gap-2">
                {(
                  [
                    "Idea",
                    "MVP",
                    "Early Traction",
                    "Growth",
                    "Expansion",
                  ] as const
                ).map((stage) => {
                  const checked = preferredFundingStages.includes(stage);
                  return (
                    <label
                      key={stage}
                      className="inline-flex items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={checked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPreferredFundingStages([
                              ...preferredFundingStages,
                              stage,
                            ]);
                          } else {
                            setPreferredFundingStages(
                              preferredFundingStages.filter((s) => s !== stage)
                            );
                          }
                        }}
                      />
                      <span>{stage}</span>
                    </label>
                  );
                })}
              </div>
              <p className="text-sm text-muted-foreground">
                Select one or more.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="geographicFocus">Geographic Focus</Label>
              <Input
                id="geographicFocus"
                value={geographicFocus}
                onChange={(e) => setGeographicFocus(e.target.value)}
                placeholder="Enter geographic focus separated by commas"
              />
              <p className="text-sm text-muted-foreground">
                E.g., &quot;Makati, Cebu, Davao&quot;
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="valueProposition">Value Proposition</Label>
              <Input
                id="valueProposition"
                value={valueProposition}
                onChange={(e) => setValueProposition(e.target.value)}
                placeholder="Enter value propositions separated by commas"
              />
              <p className="text-sm text-muted-foreground">
                What value do you bring beyond capital?
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio & Track Record */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5" />
              <span>Portfolio & Track Record</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="portfolioCompanies">Portfolio Companies</Label>
              <Input
                id="portfolioCompanies"
                value={portfolioCompanies}
                onChange={(e) => setPortfolioCompanies(e.target.value)}
                placeholder="Enter portfolio companies separated by commas"
              />
              <p className="text-sm text-muted-foreground">
                List your current and past portfolio companies
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notable Exits */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Notable Exits</span>
              </div>
              <Button
                type="button"
                onClick={addNotableExit}
                size="sm"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Exit
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {notableExits.map((exit, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Notable Exit {index + 1}</h4>
                  <Button
                    type="button"
                    onClick={() => removeNotableExit(index)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input
                    placeholder="Company Name"
                    value={exit.company}
                    onChange={(e) =>
                      updateNotableExit(index, "company", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Exit Amount (PHP)"
                    type="number"
                    value={exit.exit_amount}
                    onChange={(e) =>
                      updateNotableExit(index, "exit_amount", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Year"
                    type="number"
                    value={exit.year}
                    onChange={(e) =>
                      updateNotableExit(index, "year", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsCancelling(true);
              router.push("/profile");
            }}
            disabled={isCancelling}
            className="px-6 font-medium"
          >
            {isCancelling ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Cancel"
            )}
          </Button>
          <Button
            type="submit"
            className="bg-gradient-to-r from-primary to-primary/80 hover:bg-primary/90 px-6 font-medium"
            disabled={isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
