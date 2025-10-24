"use client";

import React, { useState, useMemo, useEffect } from "react";
import { saveInvestorStep3Data } from "@/actions/onboarding";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import philippineCities from "@/data/philippine_cities.json";

interface InvestorStep3FormData {
  typical_check_size_in_php: string;
  preferred_industries: string[];
  excluded_industries: string[];
  preferred_business_models: string[];
  preferred_funding_stages: string[];
  geographic_focus: string[];
  value_proposition: string[];
  involvement_level: string;
  portfolio_companies: string[];
}

interface FormErrors {
  [key: string]: string;
}

interface InvestorStep3Props {
  setStep: (step: number) => void;
  formData?: InvestorStep3FormData;
  setFormData?: (data: InvestorStep3FormData) => void;
}

export default function InvestorStep3({
  setStep,
  formData: externalFormData,
  setFormData: setExternalFormData,
}: InvestorStep3Props) {
  // Use external state if provided, otherwise use internal state
  const [internalFormData, setInternalFormData] =
    useState<InvestorStep3FormData>({
      typical_check_size_in_php: "",
      preferred_industries: [],
      excluded_industries: [],
      preferred_business_models: [],
      preferred_funding_stages: [],
      geographic_focus: [],
      value_proposition: [],
      involvement_level: "",
      portfolio_companies: [],
    });

  const formData = externalFormData || internalFormData;
  const setFormData = setExternalFormData || setInternalFormData;

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for dynamic inputs
  const [newIndustry, setNewIndustry] = useState("");
  const [newExcludedIndustry, setNewExcludedIndustry] = useState("");
  const [newValueProp, setNewValueProp] = useState("");
  const [newPortfolioCompany, setNewPortfolioCompany] = useState("");

  // State for city selection
  const [cityOpen, setCityOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [debouncedCitySearch, setDebouncedCitySearch] = useState("");

  const businessModels = [
    { value: "Sole", label: "Sole Proprietorship" },
    { value: "Partnership", label: "Partnership" },
    { value: "Corporation", label: "Corporation" },
  ];

  const fundingStages = [
    { value: "Idea", label: "Idea" },
    { value: "MVP", label: "MVP" },
    { value: "Early_traction", label: "Early Traction" },
    { value: "Growth", label: "Growth" },
    { value: "Expansion", label: "Expansion" },
  ];

  const involvementLevels = [
    { value: "Hands_off", label: "Hands Off" },
    { value: "Advisor", label: "Advisor" },
    { value: "Active", label: "Active" },
    { value: "Controlling", label: "Controlling" },
  ];

  // Debounce city search for better performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCitySearch(citySearch);
    }, 150);

    return () => clearTimeout(timer);
  }, [citySearch]);

  function validateForm(): boolean {
    const newErrors: FormErrors = {};

    // Typical check size validation
    if (!formData.typical_check_size_in_php.trim()) {
      newErrors.typical_check_size_in_php = "Typical check size is required";
    } else if (
      isNaN(Number(formData.typical_check_size_in_php)) ||
      Number(formData.typical_check_size_in_php) <= 0
    ) {
      newErrors.typical_check_size_in_php =
        "Please enter a valid positive number";
    }

    // Preferred industries validation
    if (formData.preferred_industries.length === 0) {
      newErrors.preferred_industries =
        "At least one preferred industry is required";
    }

    // Business models validation
    if (formData.preferred_business_models.length === 0) {
      newErrors.preferred_business_models =
        "At least one preferred business model is required";
    }

    // Funding stages validation
    if (formData.preferred_funding_stages.length === 0) {
      newErrors.preferred_funding_stages =
        "At least one preferred funding stage is required";
    }

    // Geographic focus validation
    if (formData.geographic_focus.length === 0) {
      newErrors.geographic_focus = "At least one geographic focus is required";
    }

    // Value proposition validation
    if (formData.value_proposition.length === 0) {
      newErrors.value_proposition =
        "At least one value proposition is required";
    }

    // Involvement level validation
    if (!formData.involvement_level.trim()) {
      newErrors.involvement_level = "Involvement level is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleInputChange(
    field: keyof InvestorStep3FormData,
    value: string | string[]
  ) {
    const newData = { ...formData, [field]: value };
    setFormData(newData);

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  }

  // Helper functions for array management
  function addToArray(
    field: keyof InvestorStep3FormData,
    value: string,
    newValue: string,
    setNewValue: (value: string) => void
  ) {
    if (
      newValue.trim() &&
      !((formData[field] as string[]) || []).includes(newValue.trim())
    ) {
      const currentArray = (formData[field] as string[]) || [];
      handleInputChange(field, [...currentArray, newValue.trim()]);
      setNewValue("");
    }
  }

  function removeFromArray(field: keyof InvestorStep3FormData, value: string) {
    const currentArray = (formData[field] as string[]) || [];
    handleInputChange(
      field,
      currentArray.filter((item) => item !== value)
    );
  }

  // Specific handlers
  function addPreferredIndustry() {
    addToArray(
      "preferred_industries",
      newIndustry,
      newIndustry,
      setNewIndustry
    );
  }

  function addExcludedIndustry() {
    addToArray(
      "excluded_industries",
      newExcludedIndustry,
      newExcludedIndustry,
      setNewExcludedIndustry
    );
  }

  function addValueProposition() {
    addToArray(
      "value_proposition",
      newValueProp,
      newValueProp,
      setNewValueProp
    );
  }

  function addPortfolioCompany() {
    addToArray(
      "portfolio_companies",
      newPortfolioCompany,
      newPortfolioCompany,
      setNewPortfolioCompany
    );
  }

  function areRequiredFieldsFilled(): boolean {
    return !!(
      formData.typical_check_size_in_php.trim() &&
      formData.preferred_industries.length > 0 &&
      formData.preferred_business_models.length > 0 &&
      formData.preferred_funding_stages.length > 0 &&
      formData.geographic_focus.length > 0 &&
      formData.value_proposition.length > 0 &&
      formData.involvement_level.trim()
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
      // Save data using server action
      await saveInvestorStep3Data({
        typical_check_size_in_php: formData.typical_check_size_in_php.trim(),
        preferred_industries: formData.preferred_industries,
        excluded_industries: formData.excluded_industries,
        preferred_business_models: formData.preferred_business_models,
        preferred_funding_stages: formData.preferred_funding_stages,
        geographic_focus: formData.geographic_focus,
        value_proposition: formData.value_proposition,
        involvement_level: formData.involvement_level.trim(),
        portfolio_companies: formData.portfolio_companies,
      });

      // TODO: Navigate to next step or completion (file upload step)
      console.log("Investment preferences saved successfully!");
      setStep(4);
    } catch (error) {
      console.error("Error submitting form:", error);
      // You could show a toast or error message here
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Investment Criteria Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Investment Criteria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="typical_check_size">
                  Typical Check Size (PHP) *
                </Label>
                <Input
                  id="typical_check_size"
                  type="number"
                  min="1"
                  value={formData.typical_check_size_in_php}
                  onChange={(e) =>
                    handleInputChange(
                      "typical_check_size_in_php",
                      e.target.value
                    )
                  }
                  aria-invalid={!!errors.typical_check_size_in_php}
                />
                {errors.typical_check_size_in_php && (
                  <p className="text-sm text-destructive">
                    {errors.typical_check_size_in_php}
                  </p>
                )}
              </div>

              <div className="grid w-full items-center gap-2">
                <Label htmlFor="involvement_level">Involvement Level *</Label>
                <Select
                  value={formData.involvement_level}
                  onValueChange={(value) =>
                    handleInputChange("involvement_level", value)
                  }
                >
                  <SelectTrigger
                    className={cn(
                      !formData.involvement_level && "text-muted-foreground"
                    )}
                  >
                    <SelectValue placeholder="Select involvement level" />
                  </SelectTrigger>
                  <SelectContent>
                    {involvementLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.involvement_level && (
                  <p className="text-sm text-destructive">
                    {errors.involvement_level}
                  </p>
                )}
              </div>
            </div>

            {/* Business Structure & Stage Preferences */}
            <div className="space-y-4">
              {/* Preferred Business Models */}
              <div className="grid w-full items-center gap-2">
                <Label>Preferred Business Models *</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {businessModels.map((model) => (
                    <label
                      key={model.value}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.preferred_business_models.includes(
                          model.value
                        )}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleInputChange("preferred_business_models", [
                              ...formData.preferred_business_models,
                              model.value,
                            ]);
                          } else {
                            removeFromArray(
                              "preferred_business_models",
                              model.value
                            );
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{model.label}</span>
                    </label>
                  ))}
                </div>
                {errors.preferred_business_models && (
                  <p className="text-sm text-destructive">
                    {errors.preferred_business_models}
                  </p>
                )}
              </div>

              {/* Preferred Funding Stages */}
              <div className="grid w-full items-center gap-2">
                <Label>Preferred Funding Stages *</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {fundingStages.map((stage) => (
                    <label
                      key={stage.value}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.preferred_funding_stages.includes(
                          stage.value
                        )}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleInputChange("preferred_funding_stages", [
                              ...formData.preferred_funding_stages,
                              stage.value,
                            ]);
                          } else {
                            removeFromArray(
                              "preferred_funding_stages",
                              stage.value
                            );
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{stage.label}</span>
                    </label>
                  ))}
                </div>
                {errors.preferred_funding_stages && (
                  <p className="text-sm text-destructive">
                    {errors.preferred_funding_stages}
                  </p>
                )}
              </div>
            </div>

            {/* Geographic Focus */}
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="geographic_focus">
                Geographic Focus (Philippine Cities) *
              </Label>
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
                      "text-muted-foreground"
                    )}
                    aria-invalid={!!errors.geographic_focus}
                  >
                    Select city to add...
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
                            onSelect={() => {
                              if (
                                city.trim() &&
                                philippineCities.includes(city.trim()) &&
                                !formData.geographic_focus.includes(city.trim())
                              ) {
                                handleInputChange("geographic_focus", [
                                  ...formData.geographic_focus,
                                  city.trim(),
                                ]);
                              }
                              setCitySearch("");
                              setCityOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.geographic_focus.includes(city)
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
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.geographic_focus.map((city) => (
                  <div
                    key={city}
                    className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                  >
                    <span>{city}</span>
                    <button
                      type="button"
                      onClick={() => removeFromArray("geographic_focus", city)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              {errors.geographic_focus && (
                <p className="text-sm text-destructive">
                  {errors.geographic_focus}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Industry Preferences Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Industry Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Preferred Industries */}
            <div className="grid w-full items-center gap-2">
              <Label>Preferred Industries *</Label>
              <div className="flex gap-2">
                <Input
                  value={newIndustry}
                  onChange={(e) => setNewIndustry(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addPreferredIndustry();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={addPreferredIndustry}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.preferred_industries.map((industry) => (
                  <div
                    key={industry}
                    className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                  >
                    <span>{industry}</span>
                    <button
                      type="button"
                      onClick={() =>
                        removeFromArray("preferred_industries", industry)
                      }
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              {errors.preferred_industries && (
                <p className="text-sm text-destructive">
                  {errors.preferred_industries}
                </p>
              )}
            </div>

            {/* Excluded Industries */}
            <div className="grid w-full items-center gap-2">
              <Label>Excluded Industries</Label>
              <div className="flex gap-2">
                <Input
                  value={newExcludedIndustry}
                  onChange={(e) => setNewExcludedIndustry(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addExcludedIndustry();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={addExcludedIndustry}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.excluded_industries.map((industry) => (
                  <div
                    key={industry}
                    className="flex items-center gap-1 bg-destructive/10 text-destructive px-2 py-1 rounded-md text-sm"
                  >
                    <span>{industry}</span>
                    <button
                      type="button"
                      onClick={() =>
                        removeFromArray("excluded_industries", industry)
                      }
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Value Proposition & Portfolio Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Value Proposition & Portfolio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Value Proposition */}
            <div className="grid w-full items-center gap-2">
              <Label>Value Proposition *</Label>
              <div className="flex gap-2">
                <Input
                  value={newValueProp}
                  onChange={(e) => setNewValueProp(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addValueProposition();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={addValueProposition}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.value_proposition.map((prop) => (
                  <div
                    key={prop}
                    className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-sm"
                  >
                    <span>{prop}</span>
                    <button
                      type="button"
                      onClick={() => removeFromArray("value_proposition", prop)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              {errors.value_proposition && (
                <p className="text-sm text-destructive">
                  {errors.value_proposition}
                </p>
              )}
            </div>

            {/* Portfolio Companies */}
            <div className="grid w-full items-center gap-2">
              <Label>Portfolio Companies</Label>
              <div className="flex gap-2">
                <Input
                  value={newPortfolioCompany}
                  onChange={(e) => setNewPortfolioCompany(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addPortfolioCompany();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={addPortfolioCompany}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.portfolio_companies.map((company) => (
                  <div
                    key={company}
                    className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                  >
                    <span>{company}</span>
                    <button
                      type="button"
                      onClick={() =>
                        removeFromArray("portfolio_companies", company)
                      }
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end">
        <div className="space-x-4">
          <Button type="button" variant="outline" onClick={() => setStep(2)}>
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
