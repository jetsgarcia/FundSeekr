"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import philippineCities from "@/data/philippine_cities.json";

interface InvestorFormData {
  // Basic Info
  name: string;
  phone_number: string;
  city: string;

  // Organization Info
  organization: string;
  position: string;
  organization_website: string;
  investor_linkedin: string;

  // Key Contact Info
  key_contact_person_name: string;
  key_contact_linkedin: string;
  key_contact_number: string;

  // Legal / Financial
  tin: string;
}

interface FormErrors {
  [key: string]: string;
}

interface InvestorStep2Props {
  setStep: (step: number) => void;
}

export default function InvestorStep2({ setStep }: InvestorStep2Props) {
  const [formData, setFormData] = useState<InvestorFormData>({
    name: "",
    phone_number: "",
    city: "",
    organization: "",
    position: "",
    organization_website: "",
    investor_linkedin: "",
    key_contact_person_name: "",
    key_contact_linkedin: "",
    key_contact_number: "",
    tin: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [debouncedCitySearch, setDebouncedCitySearch] = useState("");

  // Debounce city search for better performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCitySearch(citySearch);
    }, 150);

    return () => clearTimeout(timer);
  }, [citySearch]);

  function validateURL(url: string): boolean {
    try {
      new URL(url.startsWith("http") ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  }

  function validateLinkedIn(url: string): boolean {
    return url.includes("linkedin.com") && validateURL(url);
  }

  function validatePhone(phone: string): boolean {
    const phoneRegex = /^9[0-9]{9}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ""));
  }

  function validateTIN(tin: string): boolean {
    const tinRegex = /^([0-9]{9}|[0-9]{12})$/;
    return tinRegex.test(tin.replace(/[-\s]/g, ""));
  }

  function validateName(name: string): boolean {
    const trimmedName = name.trim();

    if (!trimmedName) return false;

    if (trimmedName.length < 2) return false;

    if (/^\d+$/.test(trimmedName)) return false;

    if (!/^[a-zA-Z\s\-'.]+$/.test(trimmedName)) return false;

    if (!/^[a-zA-Z].*[a-zA-Z]$/.test(trimmedName) && trimmedName.length > 1)
      return false;

    if (trimmedName.length === 1 && !/^[a-zA-Z]$/.test(trimmedName))
      return false;

    if (/\s{2,}|--|\.\.|''/.test(trimmedName)) return false;

    return true;
  }

  function validateCity(city: string): boolean {
    // Check if the city is in the Philippine cities list
    return philippineCities.includes(city.trim());
  }

  function validateForm(): boolean {
    const newErrors: FormErrors = {};

    // Basic Info validation
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (!validateName(formData.name)) {
      newErrors.name = "Please enter a valid name";
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required";
    } else if (!validatePhone(formData.phone_number)) {
      newErrors.phone_number =
        "Phone number must start with 9 and be exactly 10 digits (e.g., 9234567890)";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    } else if (!validateCity(formData.city)) {
      newErrors.city = "Please select a valid Philippine city from the list";
    }

    if (
      formData.organization_website &&
      !validateURL(formData.organization_website)
    ) {
      newErrors.organization_website = "Please enter a valid website URL";
    }

    if (
      formData.investor_linkedin &&
      !validateLinkedIn(formData.investor_linkedin)
    ) {
      newErrors.investor_linkedin = "Please enter a valid LinkedIn URL";
    }

    if (!formData.key_contact_person_name.trim()) {
      newErrors.key_contact_person_name = "Key contact person name is required";
    } else if (!validateName(formData.key_contact_person_name)) {
      newErrors.key_contact_person_name = "Please enter a valid name";
    }

    if (
      formData.key_contact_linkedin &&
      !validateLinkedIn(formData.key_contact_linkedin)
    ) {
      newErrors.key_contact_linkedin = "Please enter a valid LinkedIn URL";
    }

    if (!formData.key_contact_number.trim()) {
      newErrors.key_contact_number = "Contact number is required";
    } else if (!validatePhone(formData.key_contact_number)) {
      newErrors.key_contact_number =
        "Contact number must start with 9 and be exactly 10 digits (e.g., 9234567890)";
    }

    if (!formData.tin.trim()) {
      newErrors.tin = "TIN is required";
    } else if (!validateTIN(formData.tin)) {
      newErrors.tin = "Please enter a valid TIN";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleInputChange(field: keyof InvestorFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  }

  function areRequiredFieldsFilled(): boolean {
    return !!(
      formData.name.trim() &&
      formData.phone_number.trim() &&
      formData.city.trim() &&
      formData.tin.trim() &&
      formData.key_contact_person_name.trim() &&
      formData.key_contact_number.trim()
    );
  }

  // Filter and limit cities for performance using useMemo
  const filteredCities = useMemo(() => {
    if (!debouncedCitySearch.trim()) {
      // Show first 5 cities when no search
      return philippineCities.slice(0, 5);
    }

    // Filter cities based on search and limit to 5 results
    const filtered = philippineCities.filter((city) =>
      city.toLowerCase().includes(debouncedCitySearch.toLowerCase())
    );

    return filtered.slice(0, 5);
  }, [debouncedCitySearch]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Replace with actual saving of data
      console.log("Form data:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStep(3);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Basic Info Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-[1.4rem]">
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="grid w-full items-center gap-2">
              <Label htmlFor="phone_number">Phone Number *</Label>
              <div className="flex">
                <div className="flex items-center px-3 border border-r-0 border-input bg-muted rounded-l-md">
                  <span className="text-sm text-muted-foreground">+63</span>
                </div>
                <Input
                  id="phone_number"
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) =>
                    handleInputChange("phone_number", e.target.value)
                  }
                  className="rounded-l-none"
                  maxLength={10}
                  aria-invalid={!!errors.phone_number}
                />
              </div>
              {errors.phone_number && (
                <p className="text-sm text-destructive">
                  {errors.phone_number}
                </p>
              )}
            </div>

            <div className="grid w-full items-center gap-2">
              <Label htmlFor="city">City *</Label>
              <Popover
                open={cityOpen}
                onOpenChange={(open) => {
                  setCityOpen(open);
                  if (!open) {
                    setCitySearch("");
                  }
                }}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={cityOpen}
                    className={cn(
                      "w-full justify-between",
                      !formData.city && "text-muted-foreground"
                    )}
                    aria-invalid={!!errors.city}
                  >
                    {formData.city || "Select city..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[var(--radix-popover-trigger-width)] min-w-full p-0"
                  side="bottom"
                  align="start"
                >
                  <Command className="w-full">
                    <CommandInput
                      placeholder="Search city..."
                      value={citySearch}
                      onValueChange={setCitySearch}
                      className="w-full"
                    />
                    <CommandList>
                      <CommandEmpty>
                        {debouncedCitySearch.trim()
                          ? "No city found."
                          : "Start typing to search cities..."}
                      </CommandEmpty>
                      <CommandGroup>
                        {filteredCities.map((city) => (
                          <CommandItem
                            key={city}
                            value={city}
                            onSelect={(currentValue) => {
                              handleInputChange(
                                "city",
                                currentValue === formData.city
                                  ? ""
                                  : currentValue
                              );
                              setCityOpen(false);
                              setCitySearch("");
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.city === city
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {city}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                      {!debouncedCitySearch.trim() && (
                        <div className="px-2 py-1 text-xs text-muted-foreground text-center border-t">
                          Showing first 5 cities. Type to search more.
                        </div>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors.city && (
                <p className="text-sm text-destructive">{errors.city}</p>
              )}
            </div>

            <div className="grid w-full items-center gap-2">
              <Label htmlFor="investor_linkedin">LinkedIn URL</Label>
              <Input
                id="investor_linkedin"
                value={formData.investor_linkedin}
                onChange={(e) =>
                  handleInputChange("investor_linkedin", e.target.value)
                }
                aria-invalid={!!errors.investor_linkedin}
              />
              {errors.investor_linkedin && (
                <p className="text-sm text-destructive">
                  {errors.investor_linkedin}
                </p>
              )}
            </div>

            <div className="grid w-full items-center gap-2">
              <Label htmlFor="tin">Tax Identification Number (TIN) *</Label>
              <Input
                id="tin"
                value={formData.tin}
                onChange={(e) => handleInputChange("tin", e.target.value)}
                maxLength={12}
                aria-invalid={!!errors.tin}
              />
              {errors.tin && (
                <p className="text-sm text-destructive">{errors.tin}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {/* Key Contact Info Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Key Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="key_contact_person_name">
                  Key Contact Person Name *
                </Label>
                <Input
                  id="key_contact_person_name"
                  value={formData.key_contact_person_name}
                  onChange={(e) =>
                    handleInputChange("key_contact_person_name", e.target.value)
                  }
                  aria-invalid={!!errors.key_contact_person_name}
                />
                {errors.key_contact_person_name && (
                  <p className="text-sm text-destructive">
                    {errors.key_contact_person_name}
                  </p>
                )}
              </div>

              <div className="grid w-full items-center gap-2">
                <Label htmlFor="key_contact_number">
                  Key Contact Phone Number *
                </Label>
                <div className="flex">
                  <div className="flex items-center px-3 border border-r-0 border-input bg-muted rounded-l-md">
                    <span className="text-sm text-muted-foreground">+63</span>
                  </div>
                  <Input
                    id="key_contact_number"
                    type="tel"
                    value={formData.key_contact_number}
                    onChange={(e) =>
                      handleInputChange("key_contact_number", e.target.value)
                    }
                    className="rounded-l-none"
                    maxLength={10}
                    aria-invalid={!!errors.key_contact_number}
                  />
                </div>
                {errors.key_contact_number && (
                  <p className="text-sm text-destructive">
                    {errors.key_contact_number}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Organization Info Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Organization Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    value={formData.organization}
                    onChange={(e) =>
                      handleInputChange("organization", e.target.value)
                    }
                    aria-invalid={!!errors.organization}
                  />
                  {errors.organization && (
                    <p className="text-sm text-destructive">
                      {errors.organization}
                    </p>
                  )}
                </div>

                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) =>
                      handleInputChange("position", e.target.value)
                    }
                    aria-invalid={!!errors.position}
                  />
                  {errors.position && (
                    <p className="text-sm text-destructive">
                      {errors.position}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid w-full items-center gap-2">
                <Label htmlFor="organization_website">Organization URL</Label>
                <Input
                  id="organization_website"
                  value={formData.organization_website}
                  onChange={(e) =>
                    handleInputChange("organization_website", e.target.value)
                  }
                  aria-invalid={!!errors.organization_website}
                />
                {errors.organization_website && (
                  <p className="text-sm text-destructive">
                    {errors.organization_website}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end">
        <div className="space-x-4">
          <Button type="button" variant="outline" onClick={() => setStep(1)}>
            Back
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting || !areRequiredFieldsFilled()}
          >
            {isSubmitting ? "Saving..." : "Continue"}
          </Button>
        </div>
      </div>
    </form>
  );
}
