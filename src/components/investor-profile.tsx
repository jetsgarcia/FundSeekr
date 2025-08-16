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
  MinusIcon,
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

// Use Prisma generated types
interface InvestorProfileProps {
  user: investors;
}

export function InvestorProfile({ user }: InvestorProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<investors>(user);
  const [newIndustry, setNewIndustry] = useState("");
  const [newExcludedIndustry, setNewExcludedIndustry] = useState("");
  const [newValueProp, setNewValueProp] = useState("");
  const [newPortfolioCompany, setNewPortfolioCompany] = useState("");
  const [newFundingStage, setNewFundingStage] = useState("");
  const [newBusinessModel, setNewBusinessModel] = useState("");
  const [newGeographicFocus, setNewGeographicFocus] = useState("");
  const [newNotableExit, setNewNotableExit] = useState<NewNotableExit>({
    company: "",
    year: "",
    exit_type: "",
    value_php: "",
  });

  // State for multiple key contacts
  const [keyContacts, setKeyContacts] = useState<KeyContact[]>(() => {
    const contacts: KeyContact[] = [];
    if (
      user.key_contact_person_name ||
      user.key_contact_linkedin ||
      user.key_contact_number
    ) {
      contacts.push({
        name: user.key_contact_person_name || "",
        linkedin: user.key_contact_linkedin || undefined,
        phone: user.key_contact_number || undefined,
      });
    }
    return contacts;
  });

  const [newKeyContact, setNewKeyContact] = useState<NewKeyContact>({
    name: "",
    linkedin: "",
    phone: "+63 ",
  });

  // Validation states
  const [keyContactErrors, setKeyContactErrors] = useState({
    name: "",
    linkedin: "",
    phone: "",
  });

  const [notableExitErrors, setNotableExitErrors] = useState({
    company: "",
    year: "",
    exit_type: "",
    value_php: "",
  });

  // Helper function to format enum values for display
  const formatEnumValue = (value: string | null) => {
    if (!value) return null;
    // Enum values in schema already have proper spacing and formatting
    return value;
  };

  const handleSave = () => {
    // Here you would typically call an API to save the changes
    console.log("Saving changes:", editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const addIndustry = () => {
    if (
      newIndustry.trim() &&
      !editedUser.preferred_industries.includes(newIndustry.trim())
    ) {
      setEditedUser({
        ...editedUser,
        preferred_industries: [
          ...editedUser.preferred_industries,
          newIndustry.trim(),
        ],
      });
      setNewIndustry("");
    }
  };

  const removeIndustry = (index: number) => {
    setEditedUser({
      ...editedUser,
      preferred_industries: editedUser.preferred_industries.filter(
        (_, i) => i !== index
      ),
    });
  };

  const addExcludedIndustry = () => {
    if (
      newExcludedIndustry.trim() &&
      !editedUser.excluded_industries.includes(newExcludedIndustry.trim())
    ) {
      setEditedUser({
        ...editedUser,
        excluded_industries: [
          ...editedUser.excluded_industries,
          newExcludedIndustry.trim(),
        ],
      });
      setNewExcludedIndustry("");
    }
  };

  const removeExcludedIndustry = (index: number) => {
    setEditedUser({
      ...editedUser,
      excluded_industries: editedUser.excluded_industries.filter(
        (_, i) => i !== index
      ),
    });
  };

  const addValueProp = () => {
    if (
      newValueProp.trim() &&
      !editedUser.value_proposition.includes(newValueProp.trim())
    ) {
      setEditedUser({
        ...editedUser,
        value_proposition: [
          ...editedUser.value_proposition,
          newValueProp.trim(),
        ],
      });
      setNewValueProp("");
    }
  };

  const removeValueProp = (index: number) => {
    setEditedUser({
      ...editedUser,
      value_proposition: editedUser.value_proposition.filter(
        (_, i) => i !== index
      ),
    });
  };

  const addPortfolioCompany = () => {
    if (
      newPortfolioCompany.trim() &&
      !editedUser.portfolio_companies.includes(newPortfolioCompany.trim())
    ) {
      setEditedUser({
        ...editedUser,
        portfolio_companies: [
          ...editedUser.portfolio_companies,
          newPortfolioCompany.trim(),
        ],
      });
      setNewPortfolioCompany("");
    }
  };

  const removePortfolioCompany = (index: number) => {
    setEditedUser({
      ...editedUser,
      portfolio_companies: editedUser.portfolio_companies.filter(
        (_, i) => i !== index
      ),
    });
  };

  const addFundingStage = () => {
    if (
      newFundingStage.trim() &&
      !editedUser.preferred_funding_stages.includes(newFundingStage.trim())
    ) {
      setEditedUser({
        ...editedUser,
        preferred_funding_stages: [
          ...editedUser.preferred_funding_stages,
          newFundingStage.trim(),
        ],
      });
      setNewFundingStage("");
    }
  };

  const removeFundingStage = (index: number) => {
    setEditedUser({
      ...editedUser,
      preferred_funding_stages: editedUser.preferred_funding_stages.filter(
        (_, i) => i !== index
      ),
    });
  };

  const addBusinessModel = () => {
    if (
      newBusinessModel.trim() &&
      !editedUser.preferred_business_models.includes(newBusinessModel.trim())
    ) {
      setEditedUser({
        ...editedUser,
        preferred_business_models: [
          ...editedUser.preferred_business_models,
          newBusinessModel.trim(),
        ],
      });
      setNewBusinessModel("");
    }
  };

  const removeBusinessModel = (index: number) => {
    setEditedUser({
      ...editedUser,
      preferred_business_models: editedUser.preferred_business_models.filter(
        (_, i) => i !== index
      ),
    });
  };

  const addGeographicFocus = () => {
    if (
      newGeographicFocus.trim() &&
      !editedUser.geographic_focus.includes(newGeographicFocus.trim())
    ) {
      setEditedUser({
        ...editedUser,
        geographic_focus: [
          ...editedUser.geographic_focus,
          newGeographicFocus.trim(),
        ],
      });
      setNewGeographicFocus("");
    }
  };

  const removeGeographicFocus = (index: number) => {
    setEditedUser({
      ...editedUser,
      geographic_focus: editedUser.geographic_focus.filter(
        (_, i) => i !== index
      ),
    });
  };

  const addNotableExit = () => {
    if (!validateNotableExit()) {
      return; // Don't add if validation fails
    }

    const exitToAdd = {
      company: newNotableExit.company.trim(),
      year: newNotableExit.year ? parseInt(newNotableExit.year) : undefined,
      exit_type: newNotableExit.exit_type || undefined,
      value_php: newNotableExit.value_php
        ? parseFloat(newNotableExit.value_php)
        : undefined,
    };

    setEditedUser({
      ...editedUser,
      notable_exits: [...editedUser.notable_exits, exitToAdd as any],
    });

    setNewNotableExit({
      company: "",
      year: "",
      exit_type: "",
      value_php: "",
    });

    // Clear errors after successful addition
    setNotableExitErrors({
      company: "",
      year: "",
      exit_type: "",
      value_php: "",
    });
  };

  const removeNotableExit = (index: number) => {
    setEditedUser({
      ...editedUser,
      notable_exits: editedUser.notable_exits.filter((_, i) => i !== index),
    });
  };

  const addKeyContact = () => {
    if (!validateKeyContact()) {
      return; // Don't add if validation fails
    }

    const contactToAdd: KeyContact = {
      name: newKeyContact.name.trim(),
      linkedin: newKeyContact.linkedin.trim() || undefined,
      phone: newKeyContact.phone.trim() || undefined,
    };

    setKeyContacts([...keyContacts, contactToAdd]);
    setNewKeyContact({
      name: "",
      linkedin: "",
      phone: "+63 ",
    });

    // Clear errors after successful addition
    setKeyContactErrors({
      name: "",
      linkedin: "",
      phone: "",
    });
  };

  const removeKeyContact = (index: number) => {
    setKeyContacts(keyContacts.filter((_, i) => i !== index));
  };

  const updateKeyContact = (
    index: number,
    field: keyof KeyContact,
    value: string
  ) => {
    const updatedContacts = keyContacts.map((contact, i) => {
      if (i === index) {
        if (field === "phone") {
          return { ...contact, [field]: formatPhoneNumber(value) || undefined };
        }
        return { ...contact, [field]: value || undefined };
      }
      return contact;
    });
    setKeyContacts(updatedContacts);
  };

  // Phone number formatting helper
  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters except +
    const numbers = value.replace(/[^\d+]/g, "").replace(/\+(?!\d)/g, "");

    // Extract only the digits
    const digits = numbers.replace(/\D/g, "");

    // If it starts with 63, format with +
    if (digits.startsWith("63")) {
      const withoutCountryCode = digits.substring(2);
      if (withoutCountryCode.length >= 10) {
        // Format: +63 XXX XXX XXXX
        const formatted = withoutCountryCode.replace(
          /(\d{3})(\d{3})(\d{4})/,
          "$1 $2 $3"
        );
        return `+63 ${formatted}`;
      } else if (withoutCountryCode.length > 0) {
        // Progressive formatting
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

    // If it doesn't start with 63, prepend +63
    if (digits.length > 0) {
      if (digits.length >= 10) {
        // Format: +63 XXX XXX XXXX
        const formatted = digits
          .substring(0, 10)
          .replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
        return `+63 ${formatted}`;
      } else {
        // Progressive formatting
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

    // If empty, return +63
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

    setKeyContactErrors(errors);
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

    setNotableExitErrors(errors);
    return !hasErrors;
  };

  // Handle phone number input change
  const handlePhoneChange = (value: string, isNewContact: boolean = false) => {
    const formatted = formatPhoneNumber(value);

    if (isNewContact) {
      setNewKeyContact({
        ...newKeyContact,
        phone: formatted,
      });
      // Clear phone error when user starts typing
      if (keyContactErrors.phone) {
        setKeyContactErrors({
          ...keyContactErrors,
          phone: "",
        });
      }
    }

    return formatted;
  };

  // Clear specific key contact error
  const clearKeyContactError = (field: keyof typeof keyContactErrors) => {
    if (keyContactErrors[field]) {
      setKeyContactErrors({
        ...keyContactErrors,
        [field]: "",
      });
    }
  };

  // Clear specific notable exit error
  const clearNotableExitError = (field: keyof typeof notableExitErrors) => {
    if (notableExitErrors[field]) {
      setNotableExitErrors({
        ...notableExitErrors,
        [field]: "",
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
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="organization">Organization</Label>
                    <Input
                      id="organization"
                      value={editedUser.organization || ""}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          organization: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="investor_type">Investor Type</Label>
                    <Select
                      value={editedUser.investor_type || ""}
                      onValueChange={(value) =>
                        setEditedUser({
                          ...editedUser,
                          investor_type: value as any,
                        })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select investor type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Angel investor">
                          Angel investor
                        </SelectItem>
                        <SelectItem value="Venture capital">
                          Venture capital
                        </SelectItem>
                        <SelectItem value="Private equity">
                          Private equity
                        </SelectItem>
                        <SelectItem value="Corporate VC">
                          Corporate VC
                        </SelectItem>
                        <SelectItem value="Family office">
                          Family office
                        </SelectItem>
                        <SelectItem value="Government fund">
                          Government fund
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={editedUser.position || ""}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
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
                      value={editedUser.city || ""}
                      onChange={(e) =>
                        setEditedUser({ ...editedUser, city: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold">
                    {editedUser.organization || "Organization Name"}
                  </h2>
                  <p className="text-muted-foreground">
                    {formatEnumValue(editedUser.investor_type) ||
                      "Investor Type"}
                  </p>
                  {editedUser.position && (
                    <p className="text-sm text-muted-foreground">
                      {editedUser.position}
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
                      {editedUser.city || "Location"}
                    </span>
                  </div>
                </>
              )}
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex flex-col md:items-end gap-2">
                {isEditing ? (
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="organization_website">Website</Label>
                      <Input
                        id="organization_website"
                        type="url"
                        value={editedUser.organization_website || ""}
                        onChange={(e) =>
                          setEditedUser({
                            ...editedUser,
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
                        value={editedUser.investor_linkedin || ""}
                        onChange={(e) =>
                          setEditedUser({
                            ...editedUser,
                            investor_linkedin: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    {editedUser.organization_website && (
                      <a
                        href={editedUser.organization_website}
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
                    {editedUser.investor_linkedin && (
                      <a
                        href={editedUser.investor_linkedin}
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
                  </>
                )}
              </div>
            </div>
          </div>
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
                    value={editedUser.typical_check_size_in_php || ""}
                    onChange={(e) =>
                      setEditedUser({
                        ...editedUser,
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
                  {editedUser.typical_check_size_in_php
                    ? formatCurrency(editedUser.typical_check_size_in_php)
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
                    value={editedUser.decision_period_in_weeks || ""}
                    onChange={(e) =>
                      setEditedUser({
                        ...editedUser,
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
                  {editedUser.decision_period_in_weeks
                    ? `${editedUser.decision_period_in_weeks} weeks`
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
                  value={editedUser.involvement_level || ""}
                  onValueChange={(value) =>
                    setEditedUser({
                      ...editedUser,
                      involvement_level: value as any,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select involvement level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hands-off">Hands-off</SelectItem>
                    <SelectItem value="Light touch">Light touch</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Very active">Very active</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-base flex items-center">
                  <BuildingIcon className="h-4 w-4 mr-1" />
                  {formatEnumValue(editedUser.involvement_level) ||
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
                  {editedUser.preferred_funding_stages.map(
                    (stage: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs flex items-center gap-1"
                      >
                        {stage}
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
                    value={newFundingStage}
                    onValueChange={setNewFundingStage}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Add funding stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pre-seed">Pre-seed</SelectItem>
                      <SelectItem value="Seed">Seed</SelectItem>
                      <SelectItem value="Series A">Series A</SelectItem>
                      <SelectItem value="Series B">Series B</SelectItem>
                      <SelectItem value="Series C">Series C</SelectItem>
                      <SelectItem value="Growth">Growth</SelectItem>
                      <SelectItem value="Later stage">Later stage</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={addFundingStage} size="sm">
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-1 mt-1">
                {editedUser.preferred_funding_stages.map(
                  (stage: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs"
                    >
                      {stage}
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
                  {editedUser.preferred_business_models.map(
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
                    value={newBusinessModel}
                    onChange={(e) => setNewBusinessModel(e.target.value)}
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
                {editedUser.preferred_business_models.map(
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
                  {editedUser.geographic_focus.map(
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
                    value={newGeographicFocus}
                    onChange={(e) => setNewGeographicFocus(e.target.value)}
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
                {editedUser.geographic_focus.map(
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
                  {editedUser.preferred_industries.map((industry, index) => (
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
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newIndustry}
                    onChange={(e) => setNewIndustry(e.target.value)}
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
                {editedUser.preferred_industries.map((industry, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs"
                  >
                    {industry}
                  </span>
                ))}
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
                  {editedUser.excluded_industries.map(
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
                    value={newExcludedIndustry}
                    onChange={(e) => setNewExcludedIndustry(e.target.value)}
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
                {editedUser.excluded_industries.map(
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
                {editedUser.value_proposition.map(
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
                  value={newValueProp}
                  onChange={(e) => setNewValueProp(e.target.value)}
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
              {editedUser.value_proposition.map(
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
                {editedUser.portfolio_companies.map(
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
                  value={newPortfolioCompany}
                  onChange={(e) => setNewPortfolioCompany(e.target.value)}
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
              {editedUser.portfolio_companies.map(
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
        {(keyContacts.length > 0 || isEditing) && (
          <div className="bg-card rounded-lg p-6 shadow-sm border">
            <div className="mb-4">
              <h3 className="text-xl font-semibold">Key Contacts</h3>
            </div>
            {isEditing ? (
              <div className="space-y-4">
                {/* Existing Contacts */}
                <div className="space-y-3">
                  {keyContacts.map((contact, index) => (
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
                  ))}
                </div>

                {/* Add New Contact */}
                <div className="border-t pt-4 space-y-3">
                  <h4 className="font-medium text-sm">Add New Contact</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="new_contact_name">Contact Name</Label>
                      <Input
                        id="new_contact_name"
                        value={newKeyContact.name}
                        onChange={(e) => {
                          setNewKeyContact({
                            ...newKeyContact,
                            name: e.target.value,
                          });
                          clearKeyContactError("name");
                        }}
                        placeholder="Enter contact name"
                        className={`mt-1 ${
                          keyContactErrors.name ? "border-red-500" : ""
                        }`}
                      />
                      {keyContactErrors.name && (
                        <p className="text-red-500 text-xs mt-1">
                          {keyContactErrors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="new_contact_linkedin">LinkedIn URL</Label>
                      <Input
                        id="new_contact_linkedin"
                        type="url"
                        value={newKeyContact.linkedin}
                        onChange={(e) => {
                          setNewKeyContact({
                            ...newKeyContact,
                            linkedin: e.target.value,
                          });
                          clearKeyContactError("linkedin");
                        }}
                        placeholder="https://linkedin.com/in/username"
                        className={`mt-1 ${
                          keyContactErrors.linkedin ? "border-red-500" : ""
                        }`}
                      />
                      {keyContactErrors.linkedin && (
                        <p className="text-red-500 text-xs mt-1">
                          {keyContactErrors.linkedin}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="new_contact_phone">Phone Number</Label>
                      <Input
                        id="new_contact_phone"
                        type="tel"
                        value={newKeyContact.phone || "+63 "}
                        onChange={(e) =>
                          handlePhoneChange(e.target.value, true)
                        }
                        placeholder="+63 XXX XXX XXXX"
                        className={`mt-1 ${
                          keyContactErrors.phone ? "border-red-500" : ""
                        }`}
                      />
                      {keyContactErrors.phone && (
                        <p className="text-red-500 text-xs mt-1">
                          {keyContactErrors.phone}
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
                {keyContacts.map((contact, index) => (
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
                ))}
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
                {editedUser.notable_exits.length > 0 ? (
                  editedUser.notable_exits.map(
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

              <div className="border-t pt-4 space-y-3">
                <h4 className="font-medium text-sm">Add New Exit</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="exit_company">Company</Label>
                    <Input
                      id="exit_company"
                      value={newNotableExit.company}
                      onChange={(e) => {
                        setNewNotableExit({
                          ...newNotableExit,
                          company: e.target.value,
                        });
                        clearNotableExitError("company");
                      }}
                      placeholder="Company name"
                      className={`mt-1 ${
                        notableExitErrors.company ? "border-red-500" : ""
                      }`}
                    />
                    {notableExitErrors.company && (
                      <p className="text-red-500 text-xs mt-1">
                        {notableExitErrors.company}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="exit_year">Year</Label>
                    <Input
                      id="exit_year"
                      type="number"
                      value={newNotableExit.year}
                      onChange={(e) => {
                        setNewNotableExit({
                          ...newNotableExit,
                          year: e.target.value,
                        });
                        clearNotableExitError("year");
                      }}
                      placeholder="2024"
                      className={`mt-1 ${
                        notableExitErrors.year ? "border-red-500" : ""
                      }`}
                    />
                    {notableExitErrors.year && (
                      <p className="text-red-500 text-xs mt-1">
                        {notableExitErrors.year}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="exit_type">Exit Type</Label>
                    <Select
                      value={newNotableExit.exit_type}
                      onValueChange={(value) => {
                        setNewNotableExit({
                          ...newNotableExit,
                          exit_type: value,
                        });
                        clearNotableExitError("exit_type");
                      }}
                    >
                      <SelectTrigger
                        className={`mt-1 ${
                          notableExitErrors.exit_type ? "border-red-500" : ""
                        }`}
                      >
                        <SelectValue placeholder="Select exit type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IPO">IPO</SelectItem>
                        <SelectItem value="Acquisition">Acquisition</SelectItem>
                        <SelectItem value="Merger">Merger</SelectItem>
                        <SelectItem value="Buyout">Buyout</SelectItem>
                      </SelectContent>
                    </Select>
                    {notableExitErrors.exit_type && (
                      <p className="text-red-500 text-xs mt-1">
                        {notableExitErrors.exit_type}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="exit_value">Value (PHP)</Label>
                    <Input
                      id="exit_value"
                      type="number"
                      value={newNotableExit.value_php}
                      onChange={(e) => {
                        setNewNotableExit({
                          ...newNotableExit,
                          value_php: e.target.value,
                        });
                        clearNotableExitError("value_php");
                      }}
                      placeholder="Enter amount"
                      className={`mt-1 ${
                        notableExitErrors.value_php ? "border-red-500" : ""
                      }`}
                    />
                    {notableExitErrors.value_php && (
                      <p className="text-red-500 text-xs mt-1">
                        {notableExitErrors.value_php}
                      </p>
                    )}
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
              {editedUser.notable_exits.length > 0 ? (
                editedUser.notable_exits.map((exit: unknown, index: number) => {
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
                })
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
