"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, ChevronsUpDown, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import philippineCities from "@/data/philippine_cities.json";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface StartupFormData {
  // Basic Info
  name: string;
  phone_number: string;
  linkedin_url: string;

  // Business Details
  business_name: string;
  business_description: string;
  web_url: string;
  city: string;
  date_founded: Date | undefined;
  business_structure: string;
}

interface FormErrors {
  [key: string]: string;
}

interface StartupStep2Props {
  setStep: (step: number) => void;
  formData?: StartupFormData;
  setFormData?: (data: StartupFormData) => void;
}

export default function StartupStep2({
  setStep,
  formData: externalFormData,
  setFormData: setExternalFormData,
}: StartupStep2Props) {
  // Use external state if provided, otherwise use internal state
  const [internalFormData, setInternalFormData] = useState<StartupFormData>({
    name: "",
    phone_number: "",
    linkedin_url: "",
    business_name: "",
    business_description: "",
    web_url: "",
    city: "",
    date_founded: undefined,
    business_structure: "",
  });

  const formData = externalFormData || internalFormData;
  const setFormData = setExternalFormData || setInternalFormData;

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [debouncedCitySearch, setDebouncedCitySearch] = useState("");
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const businessStructures = [
    "Sole Proprietorship",
    "Partnership",
    "Corporation",
  ];

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
    return philippineCities.includes(city.trim());
  }

  function validateDate(date: Date | undefined): boolean {
    if (!date) return false;
    const today = new Date();
    return date <= today && date.getFullYear() > 1900;
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

    if (formData.linkedin_url && !validateLinkedIn(formData.linkedin_url)) {
      newErrors.linkedin_url = "Please enter a valid LinkedIn URL";
    }

    // Business Details validation
    if (!formData.business_name.trim()) {
      newErrors.business_name = "Business name is required";
    }

    if (!formData.business_description.trim()) {
      newErrors.business_description = "Business description is required";
    } else if (formData.business_description.trim().length < 50) {
      newErrors.business_description =
        "Business description must be at least 50 characters";
    }

    if (formData.web_url && !validateURL(formData.web_url)) {
      newErrors.web_url = "Please enter a valid website URL";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    } else if (!validateCity(formData.city)) {
      newErrors.city = "Please select a valid Philippine city from the list";
    }

    if (!formData.date_founded) {
      newErrors.date_founded = "Date founded is required";
    } else if (!validateDate(formData.date_founded)) {
      newErrors.date_founded =
        "Please enter a valid date (cannot be in the future)";
    }

    if (!formData.business_structure.trim()) {
      newErrors.business_structure = "Business structure is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleInputChange(
    field: keyof StartupFormData,
    value: string | Date | undefined
  ) {
    const newData = { ...formData, [field]: value };
    setFormData(newData);

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  }

  function areRequiredFieldsFilled(): boolean {
    return !!(
      formData.name.trim() &&
      formData.phone_number.trim() &&
      formData.business_name.trim() &&
      formData.business_description.trim() &&
      formData.city.trim() &&
      formData.date_founded &&
      formData.business_structure.trim()
    );
  }

  // Filter and limit cities for performance using useMemo
  const filteredCities = useMemo(() => {
    if (!debouncedCitySearch.trim()) {
      return philippineCities.slice(0, 5);
    }

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
      {/* Basic Info Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              <Input
                id="linkedin_url"
                value={formData.linkedin_url}
                onChange={(e) =>
                  handleInputChange("linkedin_url", e.target.value)
                }
                aria-invalid={!!errors.linkedin_url}
              />
              {errors.linkedin_url && (
                <p className="text-sm text-destructive">
                  {errors.linkedin_url}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Details Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Business Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* First row: Business name and website */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="business_name">Business Name *</Label>
                <Input
                  id="business_name"
                  value={formData.business_name}
                  onChange={(e) =>
                    handleInputChange("business_name", e.target.value)
                  }
                  aria-invalid={!!errors.business_name}
                />
                {errors.business_name && (
                  <p className="text-sm text-destructive">
                    {errors.business_name}
                  </p>
                )}
              </div>

              <div className="grid w-full items-center gap-2">
                <Label htmlFor="web_url">Website URL</Label>
                <Input
                  id="web_url"
                  value={formData.web_url}
                  onChange={(e) => handleInputChange("web_url", e.target.value)}
                  aria-invalid={!!errors.web_url}
                />
                {errors.web_url && (
                  <p className="text-sm text-destructive">{errors.web_url}</p>
                )}
              </div>
            </div>

            {/* Business description */}
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="business_description">
                Business Description *
              </Label>
              <Textarea
                id="business_description"
                value={formData.business_description}
                onChange={(e) =>
                  handleInputChange("business_description", e.target.value)
                }
                className="min-h-[100px]"
                aria-invalid={!!errors.business_description}
              />
              <div className="flex justify-between">
                {errors.business_description && (
                  <p className="text-sm text-destructive">
                    {errors.business_description}
                  </p>
                )}
              </div>
            </div>

            {/* Third row: City, Date founded, Business structure */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <Label>Date Founded *</Label>
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.date_founded && "text-muted-foreground"
                      )}
                      aria-invalid={!!errors.date_founded}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date_founded ? (
                        format(formData.date_founded, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.date_founded}
                      onSelect={(date) => {
                        handleInputChange("date_founded", date);
                        setDatePickerOpen(false);
                      }}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.date_founded && (
                  <p className="text-sm text-destructive">
                    {errors.date_founded}
                  </p>
                )}
              </div>

              <div className="grid w-full items-center gap-2">
                <Label htmlFor="business_structure">Business Structure *</Label>
                <Select
                  value={formData.business_structure}
                  onValueChange={(value) =>
                    handleInputChange("business_structure", value)
                  }
                >
                  <SelectTrigger
                    className={cn(
                      !formData.business_structure && "text-muted-foreground"
                    )}
                    aria-invalid={!!errors.business_structure}
                  >
                    <SelectValue placeholder="Select business structure..." />
                  </SelectTrigger>
                  <SelectContent>
                    {businessStructures.map((structure) => (
                      <SelectItem key={structure} value={structure}>
                        {structure}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.business_structure && (
                  <p className="text-sm text-destructive">
                    {errors.business_structure}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
