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
import { formatCurrency } from "@/lib/utils";
import {
  PencilIcon,
  SaveIcon,
  XIcon,
  PlusIcon,
  ClockIcon,
  MapPinIcon,
  BuildingIcon,
} from "lucide-react";
import { investors } from "@prisma/client";
import { useState } from "react";

// Interface for notable exits JSON structure
interface NotableExit {
  company?: string;
  year?: number;
  exit_type?: string;
  value_php?: number;
}

// Interface for new notable exit
interface NewNotableExit {
  company: string;
  year: string;
  exit_type: string;
  value_php: string;
}

// Interface for key contact person
interface KeyContact {
  name: string;
  linkedin?: string;
  phone?: string;
}

// Interface for new key contact
interface NewKeyContact {
  name: string;
  linkedin: string;
  phone: string;
}

// Interface for the complete investor profile state
interface InvestorProfileState {
  profile: investors;
  ui: {
    newIndustry: string;
    newExcludedIndustry: string;
    newValueProp: string;
    newPortfolioCompany: string;
    newFundingStage: string;
    newBusinessModel: string;
    newGeographicFocus: string;
    newNotableExit: NewNotableExit;
    keyContacts: KeyContact[];
    newKeyContact: NewKeyContact;
    keyContactErrors: {
      name: string;
      linkedin: string;
      phone: string;
    };
    notableExitErrors: {
      company: string;
      year: string;
      exit_type: string;
      value_php: string;
    };
  };
}

// Use Prisma generated types
interface InvestorProfileProps {
  user: investors;
}

export function InvestorProfile({ user }: InvestorProfileProps) {
  const [isEditing, setIsEditing] = useState(false);

  // Single state object containing all investor profile data and UI state
  const [investorState, setInvestorState] = useState<InvestorProfileState>(
    () => {
      const initialKeyContacts: KeyContact[] = [];
      if (
        user.key_contact_person_name ||
        user.key_contact_linkedin ||
        user.key_contact_number
      ) {
        initialKeyContacts.push({
          name: user.key_contact_person_name || "",
          linkedin: user.key_contact_linkedin || undefined,
          phone: user.key_contact_number || undefined,
        });
      }

      return {
        profile: user,
        ui: {
          newIndustry: "",
          newExcludedIndustry: "",
          newValueProp: "",
          newPortfolioCompany: "",
          newFundingStage: "",
          newBusinessModel: "",
          newGeographicFocus: "",
          newNotableExit: {
            company: "",
            year: "",
            exit_type: "",
            value_php: "",
          },
          keyContacts: initialKeyContacts,
          newKeyContact: {
            name: "",
            linkedin: "",
            phone: "+63 ",
          },
          keyContactErrors: {
            name: "",
            linkedin: "",
            phone: "",
          },
          notableExitErrors: {
            company: "",
            year: "",
            exit_type: "",
            value_php: "",
          },
        },
      };
    }
  );

  // Helper function to update profile data
  const updateProfile = (updates: Partial<investors>) => {
    setInvestorState((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...updates },
    }));
  };

  // Helper function to update UI state
  const updateUI = (updates: Partial<InvestorProfileState["ui"]>) => {
    setInvestorState((prev) => ({
      ...prev,
      ui: { ...prev.ui, ...updates },
    }));
  };

  const formatEnumValue = (value: string | null) => {
    if (!value) return null;
    // Convert enum values to display format
    return value.replace(/_/g, " ");
  };

  const handleSave = () => {
    console.log("Saving changes:", investorState.profile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setInvestorState((prev) => ({
      ...prev,
      profile: user,
    }));
    setIsEditing(false);
  };

  const addIndustry = () => {
    const { newIndustry } = investorState.ui;
    if (
      newIndustry.trim() &&
      !investorState.profile.preferred_industries.includes(newIndustry.trim())
    ) {
      updateProfile({
        preferred_industries: [
          ...investorState.profile.preferred_industries,
          newIndustry.trim(),
        ],
      });
      updateUI({ newIndustry: "" });
    }
  };

  const removeIndustry = (index: number) => {
    updateProfile({
      preferred_industries: investorState.profile.preferred_industries.filter(
        (_, i) => i !== index
      ),
    });
  };

  const addExcludedIndustry = () => {
    const { newExcludedIndustry } = investorState.ui;
    if (
      newExcludedIndustry.trim() &&
      !investorState.profile.excluded_industries.includes(
        newExcludedIndustry.trim()
      )
    ) {
      updateProfile({
        excluded_industries: [
          ...investorState.profile.excluded_industries,
          newExcludedIndustry.trim(),
        ],
      });
      updateUI({ newExcludedIndustry: "" });
    }
  };

  const removeExcludedIndustry = (index: number) => {
    updateProfile({
      excluded_industries: investorState.profile.excluded_industries.filter(
        (_, i) => i !== index
      ),
    });
  };

  const addValueProp = () => {
    const { newValueProp } = investorState.ui;
    if (
      newValueProp.trim() &&
      !investorState.profile.value_proposition.includes(newValueProp.trim())
    ) {
      updateProfile({
        value_proposition: [
          ...investorState.profile.value_proposition,
          newValueProp.trim(),
        ],
      });
      updateUI({ newValueProp: "" });
    }
  };

  const removeValueProp = (index: number) => {
    updateProfile({
      value_proposition: investorState.profile.value_proposition.filter(
        (_, i) => i !== index
      ),
    });
  };

  const addPortfolioCompany = () => {
    const { newPortfolioCompany } = investorState.ui;
    if (
      newPortfolioCompany.trim() &&
      !investorState.profile.portfolio_companies.includes(
        newPortfolioCompany.trim()
      )
    ) {
      updateProfile({
        portfolio_companies: [
          ...investorState.profile.portfolio_companies,
          newPortfolioCompany.trim(),
        ],
      });
      updateUI({ newPortfolioCompany: "" });
    }
  };

  const removePortfolioCompany = (index: number) => {
    updateProfile({
      portfolio_companies: investorState.profile.portfolio_companies.filter(
        (_, i) => i !== index
      ),
    });
  };

  const addFundingStage = () => {
    const { newFundingStage } = investorState.ui;
    if (
      newFundingStage.trim() &&
      !investorState.profile.preferred_funding_stages.includes(
        newFundingStage.trim()
      )
    ) {
      updateProfile({
        preferred_funding_stages: [
          ...investorState.profile.preferred_funding_stages,
          newFundingStage.trim(),
        ],
      });
      updateUI({ newFundingStage: "" });
    }
  };

  const removeFundingStage = (index: number) => {
    updateProfile({
      preferred_funding_stages:
        investorState.profile.preferred_funding_stages.filter(
          (_, i) => i !== index
        ),
    });
  };

  const addBusinessModel = () => {
    const { newBusinessModel } = investorState.ui;
    if (
      newBusinessModel.trim() &&
      !investorState.profile.preferred_business_models.includes(
        newBusinessModel.trim()
      )
    ) {
      updateProfile({
        preferred_business_models: [
          ...investorState.profile.preferred_business_models,
          newBusinessModel.trim(),
        ],
      });
      updateUI({ newBusinessModel: "" });
    }
  };

  const removeBusinessModel = (index: number) => {
    updateProfile({
      preferred_business_models:
        investorState.profile.preferred_business_models.filter(
          (_, i) => i !== index
        ),
    });
  };

  const addGeographicFocus = () => {
    const { newGeographicFocus } = investorState.ui;
    if (
      newGeographicFocus.trim() &&
      !investorState.profile.geographic_focus.includes(
        newGeographicFocus.trim()
      )
    ) {
      updateProfile({
        geographic_focus: [
          ...investorState.profile.geographic_focus,
          newGeographicFocus.trim(),
        ],
      });
      updateUI({ newGeographicFocus: "" });
    }
  };

  const removeGeographicFocus = (index: number) => {
    updateProfile({
      geographic_focus: investorState.profile.geographic_focus.filter(
        (_, i) => i !== index
      ),
    });
  };

  const addNotableExit = () => {
    if (!validateNotableExit()) {
      return;
    }

    const { newNotableExit } = investorState.ui;
    const exitToAdd = {
      company: newNotableExit.company.trim(),
      year: newNotableExit.year ? parseInt(newNotableExit.year) : undefined,
      exit_type: newNotableExit.exit_type || undefined,
      value_php: newNotableExit.value_php
        ? parseFloat(newNotableExit.value_php)
        : undefined,
    };

    updateProfile({
      notable_exits: [...investorState.profile.notable_exits, exitToAdd as any],
    });

    updateUI({
      newNotableExit: {
        company: "",
        year: "",
        exit_type: "",
        value_php: "",
      },
      notableExitErrors: {
        company: "",
        year: "",
        exit_type: "",
        value_php: "",
      },
    });
  };

  const removeNotableExit = (index: number) => {
    updateProfile({
      notable_exits: investorState.profile.notable_exits.filter(
        (_, i) => i !== index
      ),
    });
  };

  const addKeyContact = () => {
    if (!validateKeyContact()) {
      return;
    }

    const { newKeyContact, keyContacts } = investorState.ui;
    const contactToAdd: KeyContact = {
      name: newKeyContact.name.trim(),
      linkedin: newKeyContact.linkedin.trim() || undefined,
      phone: newKeyContact.phone.trim() || undefined,
    };

    updateUI({
      keyContacts: [...keyContacts, contactToAdd],
      newKeyContact: {
        name: "",
        linkedin: "",
        phone: "+63 ",
      },
      keyContactErrors: {
        name: "",
        linkedin: "",
        phone: "",
      },
    });
  };

  const removeKeyContact = (index: number) => {
    updateUI({
      keyContacts: investorState.ui.keyContacts.filter((_, i) => i !== index),
    });
  };

  const updateKeyContact = (
    index: number,
    field: keyof KeyContact,
    value: string
  ) => {
    const updatedContacts = investorState.ui.keyContacts.map((contact, i) => {
      if (i === index) {
        if (field === "phone") {
          return { ...contact, [field]: formatPhoneNumber(value) || undefined };
        }
        return { ...contact, [field]: value || undefined };
      }
      return contact;
    });
    updateUI({ keyContacts: updatedContacts });
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d+]/g, "").replace(/\+(?!\d)/g, "");

    const digits = numbers.replace(/\D/g, "");

    if (digits.startsWith("63")) {
      const withoutCountryCode = digits.substring(2);
      if (withoutCountryCode.length >= 10) {
        const formatted = withoutCountryCode.replace(
          /(\d{3})(\d{3})(\d{4})/,
          "$1 $2 $3"
        );
        return `+63 ${formatted}`;
      } else if (withoutCountryCode.length > 0) {
        if (withoutCountryCode.length <= 3) {
          return `+63 ${withoutCountryCode}`;
        } else if (withoutCountryCode.length <= 6) {
          return `+63 ${withoutCountryCode.substring(
            0,
            3
          )} ${withoutCountryCode.substring(3)}`;
        } else {
          return `+63 ${withoutCountryCode.substring(
            0,
            3
          )} ${withoutCountryCode.substring(
            3,
            6
          )} ${withoutCountryCode.substring(6)}`;
        }
      }
      return "+63 ";
    }

    if (digits.length > 0) {
      if (digits.length >= 10) {
        const formatted = digits
          .substring(0, 10)
          .replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
        return `+63 ${formatted}`;
      } else {
        if (digits.length <= 3) {
          return `+63 ${digits}`;
        } else if (digits.length <= 6) {
          return `+63 ${digits.substring(0, 3)} ${digits.substring(3)}`;
        } else {
          return `+63 ${digits.substring(0, 3)} ${digits.substring(
            3,
            6
          )} ${digits.substring(6)}`;
        }
      }
    }

    return "+63 ";
  };

  // Validate Philippine phone number
  const validatePhoneNumber = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    if (!digits.startsWith("63")) return false;
    const withoutCountryCode = digits.substring(2);
    return withoutCountryCode.length === 10; // Philippine mobile numbers are 10 digits after +63
  };

  // Validate key contact
  const validateKeyContact = () => {
    const errors = {
      name: "",
      linkedin: "",
      phone: "",
    };

    let hasErrors = false;
    const { newKeyContact } = investorState.ui;

    // Validate name
    if (!newKeyContact.name.trim()) {
      errors.name = "Contact name is required";
      hasErrors = true;
    }

    // Validate LinkedIn URL
    if (!newKeyContact.linkedin.trim()) {
      errors.linkedin = "LinkedIn URL is required";
      hasErrors = true;
    } else if (
      !newKeyContact.linkedin.includes("linkedin.com") &&
      !newKeyContact.linkedin.includes("linkedin.com")
    ) {
      errors.linkedin = "Please enter a valid LinkedIn URL";
      hasErrors = true;
    }

    // Validate phone number
    if (!newKeyContact.phone || newKeyContact.phone === "+63 ") {
      errors.phone = "Phone number is required";
      hasErrors = true;
    } else if (!validatePhoneNumber(newKeyContact.phone)) {
      errors.phone = "Phone number must be exactly 10 digits after +63";
      hasErrors = true;
    }

    updateUI({ keyContactErrors: errors });
    return !hasErrors;
  };

  // Validate notable exit
  const validateNotableExit = () => {
    const errors = {
      company: "",
      year: "",
      exit_type: "",
      value_php: "",
    };

    let hasErrors = false;
    const { newNotableExit } = investorState.ui;

    // Validate company name
    if (!newNotableExit.company.trim()) {
      errors.company = "Company name is required";
      hasErrors = true;
    }

    // Validate year
    if (!newNotableExit.year.trim()) {
      errors.year = "Exit year is required";
      hasErrors = true;
    } else {
      const year = parseInt(newNotableExit.year);
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < 1990 || year > currentYear) {
        errors.year = `Year must be between 1990 and ${currentYear}`;
        hasErrors = true;
      }
    }

    // Validate exit type
    if (!newNotableExit.exit_type.trim()) {
      errors.exit_type = "Exit type is required";
      hasErrors = true;
    }

    // Validate value
    if (!newNotableExit.value_php.trim()) {
      errors.value_php = "Exit value is required";
      hasErrors = true;
    } else {
      const value = parseFloat(newNotableExit.value_php);
      if (isNaN(value) || value <= 0) {
        errors.value_php = "Value must be a positive number";
        hasErrors = true;
      }
    }

    updateUI({ notableExitErrors: errors });
    return !hasErrors;
  };

  // Handle phone number input change
  const handlePhoneChange = (value: string, isNewContact: boolean = false) => {
    const formatted = formatPhoneNumber(value);

    if (isNewContact) {
      updateUI({
        newKeyContact: {
          ...investorState.ui.newKeyContact,
          phone: formatted,
        },
      });
      // Clear phone error when user starts typing
      if (investorState.ui.keyContactErrors.phone) {
        updateUI({
          keyContactErrors: {
            ...investorState.ui.keyContactErrors,
            phone: "",
          },
        });
      }
    }

    return formatted;
  };

  // Clear specific key contact error
  const clearKeyContactError = (
    field: keyof typeof investorState.ui.keyContactErrors
  ) => {
    if (investorState.ui.keyContactErrors[field]) {
      updateUI({
        keyContactErrors: {
          ...investorState.ui.keyContactErrors,
          [field]: "",
        },
      });
    }
  };

  // Clear specific notable exit error
  const clearNotableExitError = (
    field: keyof typeof investorState.ui.notableExitErrors
  ) => {
    if (investorState.ui.notableExitErrors[field]) {
      updateUI({
        notableExitErrors: {
          ...investorState.ui.notableExitErrors,
          [field]: "",
        },
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Investor Profile</h1>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} size="sm">
                <SaveIcon className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                <XIcon className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
            >
              <PencilIcon className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main info card */}
        <div className="md:col-span-3 bg-card rounded-lg p-6 shadow-sm border">
          {isEditing ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    value={investorState.profile.organization || ""}
                    onChange={(e) =>
                      updateProfile({
                        organization: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="investor_type">Investor Type</Label>
                  <Select
                    value={investorState.profile.investor_type || ""}
                    onValueChange={(value) =>
                      updateProfile({
                        investor_type: value as any,
                      })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select investor type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Angel_investor">
                        Angel investor
                      </SelectItem>
                      <SelectItem value="Crowdfunding_investor">
                        Crowdfunding investor
                      </SelectItem>
                      <SelectItem value="Venture_capital">
                        Venture capital
                      </SelectItem>
                      <SelectItem value="Corporate_investor">
                        Corporate investor
                      </SelectItem>
                      <SelectItem value="Private_equity">
                        Private equity
                      </SelectItem>
                      <SelectItem value="Impact_investor">
                        Impact investor
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={investorState.profile.position || ""}
                    onChange={(e) =>
                      updateProfile({
                        position: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={investorState.profile.city || ""}
                    onChange={(e) => updateProfile({ city: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="organization_website">Website</Label>
                  <Input
                    id="organization_website"
                    type="url"
                    value={investorState.profile.organization_website || ""}
                    onChange={(e) =>
                      updateProfile({
                        organization_website: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="investor_linkedin">LinkedIn</Label>
                  <Input
                    id="investor_linkedin"
                    type="url"
                    value={investorState.profile.investor_linkedin || ""}
                    onChange={(e) =>
                      updateProfile({
                        investor_linkedin: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold">
                  {investorState.profile.organization || "Organization Name"}
                </h2>
                <p className="text-muted-foreground">
                  {formatEnumValue(investorState.profile.investor_type) ||
                    "Investor Type"}
                </p>
                {investorState.profile.position && (
                  <p className="text-sm text-muted-foreground">
                    {investorState.profile.position}
                  </p>
                )}
                <div className="mt-2 flex items-center">
                  <span className="inline-flex items-center text-sm text-muted-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {investorState.profile.city || "Location"}
                  </span>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="flex flex-col md:items-end gap-2">
                  {investorState.profile.organization_website && (
                    <a
                      href={investorState.profile.organization_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        <path d="M2 12h20" />
                      </svg>
                      Website
                    </a>
                  )}
                  {investorState.profile.investor_linkedin && (
                    <a
                      href={investorState.profile.investor_linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect width="4" height="12" x="2" y="9" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Investment Preferences */}
        <div className="md:col-span-2 bg-card rounded-lg p-6 shadow-sm border">
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Investment Preferences</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                Check Size
              </h4>
              {isEditing ? (
                <div>
                  <Label htmlFor="typical_check_size">Amount (PHP)</Label>
                  <Input
                    id="typical_check_size"
                    type="number"
                    value={
                      investorState.profile.typical_check_size_in_php || ""
                    }
                    onChange={(e) =>
                      updateProfile({
                        typical_check_size_in_php: e.target.value
                          ? parseInt(e.target.value)
                          : null,
                      })
                    }
                    className="mt-1"
                    placeholder="Enter amount in PHP"
                  />
                </div>
              ) : (
                <p className="text-base">
                  {investorState.profile.typical_check_size_in_php
                    ? formatCurrency(
                        investorState.profile.typical_check_size_in_php
                      )
                    : "Not specified"}
                </p>
              )}
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                Decision Timeline
              </h4>
              {isEditing ? (
                <div>
                  <Label htmlFor="decision_period">Weeks</Label>
                  <Input
                    id="decision_period"
                    type="number"
                    value={investorState.profile.decision_period_in_weeks || ""}
                    onChange={(e) =>
                      updateProfile({
                        decision_period_in_weeks: e.target.value
                          ? parseInt(e.target.value)
                          : null,
                      })
                    }
                    className="mt-1"
                    placeholder="Enter weeks"
                  />
                </div>
              ) : (
                <p className="text-base flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  {investorState.profile.decision_period_in_weeks
                    ? `${investorState.profile.decision_period_in_weeks} weeks`
                    : "Not specified"}
                </p>
              )}
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                Involvement Level
              </h4>
              {isEditing ? (
                <Select
                  value={investorState.profile.involvement_level || ""}
                  onValueChange={(value) =>
                    updateProfile({
                      involvement_level: value as any,
                    })
                  }
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
              ) : (
                <p className="text-base flex items-center">
                  <BuildingIcon className="h-4 w-4 mr-1" />
                  {formatEnumValue(investorState.profile.involvement_level) ||
                    "Not specified"}
                </p>
              )}
            </div>
          </div>

          {/* Funding Stages */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Funding Stages
            </h4>
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {investorState.profile.preferred_funding_stages.map(
                    (stage: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs flex items-center gap-1"
                      >
                        {formatEnumValue(stage)}
                        <button
                          onClick={() => removeFundingStage(index)}
                          className="hover:bg-primary/20 rounded-full p-0.5"
                        >
                          <XIcon className="h-3 w-3" />
                        </button>
                      </span>
                    )
                  )}
                </div>
                <div className="flex gap-2">
                  <Select
                    value={investorState.ui.newFundingStage}
                    onValueChange={(value) =>
                      updateUI({ newFundingStage: value })
                    }
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Add funding stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pre_Seed">Pre-Seed</SelectItem>
                      <SelectItem value="Seed">Seed</SelectItem>
                      <SelectItem value="Series_A">Series A</SelectItem>
                      <SelectItem value="Series_B">Series B</SelectItem>
                      <SelectItem value="Series_C_">Series C+</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={addFundingStage} size="sm">
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-1 mt-1">
                {investorState.profile.preferred_funding_stages.map(
                  (stage: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs"
                    >
                      {formatEnumValue(stage)}
                    </span>
                  )
                )}
              </div>
            )}
          </div>

          {/* Business Models */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Business Models
            </h4>
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {investorState.profile.preferred_business_models.map(
                    (model: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs flex items-center gap-1"
                      >
                        {model}
                        <button
                          onClick={() => removeBusinessModel(index)}
                          className="hover:bg-primary/20 rounded-full p-0.5"
                        >
                          <XIcon className="h-3 w-3" />
                        </button>
                      </span>
                    )
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={investorState.ui.newBusinessModel}
                    onChange={(e) =>
                      updateUI({ newBusinessModel: e.target.value })
                    }
                    placeholder="Add business model"
                    className="flex-1"
                    onKeyPress={(e) => e.key === "Enter" && addBusinessModel()}
                  />
                  <Button onClick={addBusinessModel} size="sm">
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-1 mt-1">
                {investorState.profile.preferred_business_models.map(
                  (model: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs"
                    >
                      {model}
                    </span>
                  )
                )}
              </div>
            )}
          </div>

          {/* Geographic Focus */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Geographic Focus
            </h4>
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {investorState.profile.geographic_focus.map(
                    (location: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs flex items-center gap-1"
                      >
                        <MapPinIcon className="h-3 w-3" />
                        {location}
                        <button
                          onClick={() => removeGeographicFocus(index)}
                          className="hover:bg-primary/20 rounded-full p-0.5"
                        >
                          <XIcon className="h-3 w-3" />
                        </button>
                      </span>
                    )
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={investorState.ui.newGeographicFocus}
                    onChange={(e) =>
                      updateUI({ newGeographicFocus: e.target.value })
                    }
                    placeholder="Add geographic location"
                    className="flex-1"
                    onKeyPress={(e) =>
                      e.key === "Enter" && addGeographicFocus()
                    }
                  />
                  <Button onClick={addGeographicFocus} size="sm">
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-1 mt-1">
                {investorState.profile.geographic_focus.map(
                  (location: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs flex items-center gap-1"
                    >
                      <MapPinIcon className="h-3 w-3" />
                      {location}
                    </span>
                  )
                )}
              </div>
            )}
          </div>

          {/* Preferred Industries */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Preferred Industries
            </h4>
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {investorState.profile.preferred_industries.map(
                    (industry, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs flex items-center gap-1"
                      >
                        {industry}
                        <button
                          onClick={() => removeIndustry(index)}
                          className="hover:bg-primary/20 rounded-full p-0.5"
                        >
                          <XIcon className="h-3 w-3" />
                        </button>
                      </span>
                    )
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={investorState.ui.newIndustry}
                    onChange={(e) => updateUI({ newIndustry: e.target.value })}
                    placeholder="Add preferred industry"
                    className="flex-1"
                    onKeyPress={(e) => e.key === "Enter" && addIndustry()}
                  />
                  <Button onClick={addIndustry} size="sm">
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {investorState.profile.preferred_industries.map(
                  (industry, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs"
                    >
                      {industry}
                    </span>
                  )
                )}
              </div>
            )}
          </div>

          {/* Industries to Avoid */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Industries to Avoid
            </h4>
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {investorState.profile.excluded_industries.map(
                    (industry: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-destructive/10 text-destructive rounded-md text-xs flex items-center gap-1"
                      >
                        {industry}
                        <button
                          onClick={() => removeExcludedIndustry(index)}
                          className="hover:bg-destructive/20 rounded-full p-0.5"
                        >
                          <XIcon className="h-3 w-3" />
                        </button>
                      </span>
                    )
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={investorState.ui.newExcludedIndustry}
                    onChange={(e) =>
                      updateUI({ newExcludedIndustry: e.target.value })
                    }
                    placeholder="Add excluded industry"
                    className="flex-1"
                    onKeyPress={(e) =>
                      e.key === "Enter" && addExcludedIndustry()
                    }
                  />
                  <Button onClick={addExcludedIndustry} size="sm">
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {investorState.profile.excluded_industries.map(
                  (industry: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-destructive/10 text-destructive rounded-md text-xs"
                    >
                      {industry}
                    </span>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {/* Value Add */}
        <div className="bg-card rounded-lg p-6 shadow-sm border">
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Value Add</h3>
          </div>
          {isEditing ? (
            <div className="space-y-3">
              <div className="space-y-2">
                {investorState.profile.value_proposition.map(
                  (area: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-accent rounded"
                    >
                      <span className="flex items-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-primary mr-2 mt-0.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                        {area}
                      </span>
                      <button
                        onClick={() => removeValueProp(index)}
                        className="text-destructive hover:bg-destructive/20 rounded-full p-1"
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </div>
                  )
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  value={investorState.ui.newValueProp}
                  onChange={(e) => updateUI({ newValueProp: e.target.value })}
                  placeholder="Add value proposition"
                  className="flex-1"
                  onKeyPress={(e) => e.key === "Enter" && addValueProp()}
                />
                <Button onClick={addValueProp} size="sm">
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <ul className="space-y-2">
              {investorState.profile.value_proposition.map(
                (area: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-primary mr-2 mt-0.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span>{area}</span>
                  </li>
                )
              )}
            </ul>
          )}
        </div>

        {/* Portfolio */}
        <div className="md:col-span-2 bg-card rounded-lg p-6 shadow-sm border">
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Current Portfolio</h3>
          </div>
          {isEditing ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {investorState.profile.portfolio_companies.map(
                  (company: string, index: number) => (
                    <div
                      key={index}
                      className="p-3 bg-accent rounded-md flex justify-between items-center"
                    >
                      <span>{company}</span>
                      <button
                        onClick={() => removePortfolioCompany(index)}
                        className="text-destructive hover:bg-destructive/20 rounded-full p-1"
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </div>
                  )
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  value={investorState.ui.newPortfolioCompany}
                  onChange={(e) =>
                    updateUI({ newPortfolioCompany: e.target.value })
                  }
                  placeholder="Add portfolio company"
                  className="flex-1"
                  onKeyPress={(e) => e.key === "Enter" && addPortfolioCompany()}
                />
                <Button onClick={addPortfolioCompany} size="sm">
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {investorState.profile.portfolio_companies.map(
                (company: string, index: number) => (
                  <div key={index} className="p-3 bg-accent rounded-md">
                    {company}
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Key Contact Information */}
        {(investorState.ui.keyContacts.length > 0 || isEditing) && (
          <div className="bg-card rounded-lg p-6 shadow-sm border">
            <div className="mb-4">
              <h3 className="text-xl font-semibold">Key Contacts</h3>
            </div>
            {isEditing ? (
              <div className="space-y-4">
                {/* Existing Contacts */}
                <div className="space-y-3">
                  {investorState.ui.keyContacts.map(
                    (contact: KeyContact, index: number) => (
                      <div
                        key={index}
                        className="border rounded-md p-3 bg-accent"
                      >
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor={`contact_name_${index}`}>
                              Contact Name
                            </Label>
                            <Input
                              id={`contact_name_${index}`}
                              value={contact.name}
                              onChange={(e) =>
                                updateKeyContact(index, "name", e.target.value)
                              }
                              className="mt-1"
                              placeholder="Enter contact name"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`contact_linkedin_${index}`}>
                              LinkedIn URL
                            </Label>
                            <Input
                              id={`contact_linkedin_${index}`}
                              type="url"
                              value={contact.linkedin || ""}
                              onChange={(e) =>
                                updateKeyContact(
                                  index,
                                  "linkedin",
                                  e.target.value
                                )
                              }
                              className="mt-1"
                              placeholder="Enter LinkedIn URL"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`contact_phone_${index}`}>
                              Phone Number
                            </Label>
                            <Input
                              id={`contact_phone_${index}`}
                              type="tel"
                              value={contact.phone || "+63 "}
                              onChange={(e) =>
                                updateKeyContact(index, "phone", e.target.value)
                              }
                              className="mt-1"
                              placeholder="+63 XXX XXX XXXX"
                              maxLength={16}
                            />
                          </div>
                          <div className="flex justify-end">
                            <button
                              onClick={() => removeKeyContact(index)}
                              className="text-destructive hover:bg-destructive/20 rounded-full p-2 flex items-center gap-1"
                            >
                              <XIcon className="h-3 w-3" />
                              <span className="text-xs">Remove Contact</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* Add New Contact */}
                <div className="border-t pt-4 space-y-3">
                  <h4 className="font-medium text-sm">Add New Contact</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="new_contact_name">Contact Name</Label>
                      <Input
                        id="new_contact_name"
                        value={investorState.ui.newKeyContact.name}
                        onChange={(e) => {
                          updateUI({
                            newKeyContact: {
                              ...investorState.ui.newKeyContact,
                              name: e.target.value,
                            },
                          });
                          clearKeyContactError("name");
                        }}
                        placeholder="Enter contact name"
                        className={`mt-1 ${
                          investorState.ui.keyContactErrors.name
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      {investorState.ui.keyContactErrors.name && (
                        <p className="text-red-500 text-xs mt-1">
                          {investorState.ui.keyContactErrors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="new_contact_linkedin">LinkedIn URL</Label>
                      <Input
                        id="new_contact_linkedin"
                        type="url"
                        value={investorState.ui.newKeyContact.linkedin}
                        onChange={(e) => {
                          updateUI({
                            newKeyContact: {
                              ...investorState.ui.newKeyContact,
                              linkedin: e.target.value,
                            },
                          });
                          clearKeyContactError("linkedin");
                        }}
                        placeholder="https://linkedin.com/in/username"
                        className={`mt-1 ${
                          investorState.ui.keyContactErrors.linkedin
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      {investorState.ui.keyContactErrors.linkedin && (
                        <p className="text-red-500 text-xs mt-1">
                          {investorState.ui.keyContactErrors.linkedin}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="new_contact_phone">Phone Number</Label>
                      <Input
                        id="new_contact_phone"
                        type="tel"
                        value={investorState.ui.newKeyContact.phone || "+63 "}
                        onChange={(e) =>
                          handlePhoneChange(e.target.value, true)
                        }
                        placeholder="+63 XXX XXX XXXX"
                        className={`mt-1 ${
                          investorState.ui.keyContactErrors.phone
                            ? "border-red-500"
                            : ""
                        }`}
                        maxLength={16}
                      />
                      {investorState.ui.keyContactErrors.phone && (
                        <p className="text-red-500 text-xs mt-1">
                          {investorState.ui.keyContactErrors.phone}
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={addKeyContact}
                      size="sm"
                      className="w-full"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Add Key Contact
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {investorState.ui.keyContacts.map(
                  (contact: KeyContact, index: number) => (
                    <div key={index} className="border-b pb-3 last:border-0">
                      <div className="space-y-2">
                        <p className="text-base font-medium">{contact.name}</p>
                        {contact.linkedin && (
                          <a
                            href={contact.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                              <rect width="4" height="12" x="2" y="9" />
                              <circle cx="4" cy="4" r="2" />
                            </svg>
                            LinkedIn
                          </a>
                        )}
                        {contact.phone && (
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground">
                              Phone
                            </h4>
                            <p className="text-base">{contact.phone}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}

        {/* Notable Exits */}
        <div className="bg-card rounded-lg p-6 shadow-sm border">
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Notable Exits</h3>
          </div>
          {isEditing ? (
            <div className="space-y-4">
              <div className="space-y-3">
                {investorState.profile.notable_exits.length > 0 ? (
                  investorState.profile.notable_exits.map(
                    (exit: unknown, index: number) => {
                      const exitData = exit as NotableExit;
                      return (
                        <div
                          key={index}
                          className="border rounded-md p-3 bg-accent"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h4 className="font-medium">
                                {exitData.company || "Company Name"}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
                                  {exitData.exit_type || "Exit Type"}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {exitData.year || "Year"}
                                </span>
                              </div>
                              <span className="font-medium text-sm">
                                {exitData.value_php
                                  ? formatCurrency(exitData.value_php)
                                  : "Value"}
                              </span>
                            </div>
                            <button
                              onClick={() => removeNotableExit(index)}
                              className="text-destructive hover:bg-destructive/20 rounded-full p-1"
                            >
                              <XIcon className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      );
                    }
                  )
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No notable exits yet
                  </p>
                )}
              </div>

              <div className="border-t pt-4 space-y-4">
                <h4 className="font-medium text-sm">Add New Exit</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="w-full">
                      <Label htmlFor="exit_company">Company</Label>
                      <Input
                        id="exit_company"
                        value={investorState.ui.newNotableExit.company}
                        onChange={(e) => {
                          updateUI({
                            newNotableExit: {
                              ...investorState.ui.newNotableExit,
                              company: e.target.value,
                            },
                          });
                          clearNotableExitError("company");
                        }}
                        placeholder="Company name"
                        className={`mt-1 ${
                          investorState.ui.notableExitErrors.company
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      {investorState.ui.notableExitErrors.company && (
                        <p className="text-red-500 text-xs mt-1">
                          {investorState.ui.notableExitErrors.company}
                        </p>
                      )}
                    </div>
                    <div className="w-full">
                      <Label htmlFor="exit_year">Year</Label>
                      <Input
                        id="exit_year"
                        type="number"
                        value={investorState.ui.newNotableExit.year}
                        onChange={(e) => {
                          updateUI({
                            newNotableExit: {
                              ...investorState.ui.newNotableExit,
                              year: e.target.value,
                            },
                          });
                          clearNotableExitError("year");
                        }}
                        placeholder="2025"
                        className={`mt-1 ${
                          investorState.ui.notableExitErrors.year
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      {investorState.ui.notableExitErrors.year && (
                        <p className="text-red-500 text-xs mt-1">
                          {investorState.ui.notableExitErrors.year}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="w-full">
                      <Label htmlFor="exit_type">Exit Type</Label>
                      <Select
                        value={investorState.ui.newNotableExit.exit_type}
                        onValueChange={(value) => {
                          updateUI({
                            newNotableExit: {
                              ...investorState.ui.newNotableExit,
                              exit_type: value,
                            },
                          });
                          clearNotableExitError("exit_type");
                        }}
                      >
                        <SelectTrigger
                          className={`mt-1 ${
                            investorState.ui.notableExitErrors.exit_type
                              ? "border-red-500"
                              : ""
                          }`}
                        >
                          <SelectValue placeholder="Select Exit type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="IPO">IPO</SelectItem>
                          <SelectItem value="Acquisition">
                            Acquisition
                          </SelectItem>
                          <SelectItem value="Merger">Merger</SelectItem>
                          <SelectItem value="Buyout">Buyout</SelectItem>
                        </SelectContent>
                      </Select>
                      {investorState.ui.notableExitErrors.exit_type && (
                        <p className="text-red-500 text-xs mt-1">
                          {investorState.ui.notableExitErrors.exit_type}
                        </p>
                      )}
                    </div>
                    <div className="w-full">
                      <Label htmlFor="exit_value">Value (PHP)</Label>
                      <Input
                        id="exit_value"
                        type="number"
                        value={investorState.ui.newNotableExit.value_php}
                        onChange={(e) => {
                          updateUI({
                            newNotableExit: {
                              ...investorState.ui.newNotableExit,
                              value_php: e.target.value,
                            },
                          });
                          clearNotableExitError("value_php");
                        }}
                        placeholder="Enter amount"
                        className={`mt-1 ${
                          investorState.ui.notableExitErrors.value_php
                            ? "border-red-500"
                            : ""
                        }`}
                      />
                      {investorState.ui.notableExitErrors.value_php && (
                        <p className="text-red-500 text-xs mt-1">
                          {investorState.ui.notableExitErrors.value_php}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <Button onClick={addNotableExit} size="sm" className="w-full">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Notable Exit
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {investorState.profile.notable_exits.length > 0 ? (
                investorState.profile.notable_exits.map(
                  (exit: unknown, index: number) => {
                    const exitData = exit as NotableExit;
                    return (
                      <div key={index} className="border-b pb-3 last:border-0">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">
                            {exitData.company || "Company Name"}
                          </h4>
                          <span className="text-sm text-muted-foreground">
                            {exitData.year || "Year"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs px-2 py-0.5 rounded bg-accent">
                            {exitData.exit_type || "Exit Type"}
                          </span>
                          <span className="font-medium text-sm">
                            {exitData.value_php
                              ? formatCurrency(exitData.value_php)
                              : "Value"}
                          </span>
                        </div>
                      </div>
                    );
                  }
                )
              ) : (
                <p className="text-muted-foreground text-sm">
                  No notable exits yet
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
