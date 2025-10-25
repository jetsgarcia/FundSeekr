"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamMember {
  name: string;
  linkedin: string;
  position: string;
}

interface Advisor {
  name: string;
  company: string;
  linkedin: string;
  expertise: string;
}

interface KeyMetric {
  name: string;
  value: string;
}

interface StartupStep3FormData {
  industry: string;
  development_stage: string;
  target_market: string[];
  keywords: string[];
  product_demo_url: string;
  key_metrics: KeyMetric[];
  team_members: TeamMember[];
  advisors: Advisor[];
}

interface FormErrors {
  [key: string]: string;
}

interface StartupStep3Props {
  setStep: (step: number) => void;
  formData?: StartupStep3FormData;
  setFormData?: (data: StartupStep3FormData) => void;
}

export default function StartupStep3({
  setStep,
  formData: externalFormData,
  setFormData: setExternalFormData,
}: StartupStep3Props) {
  // Use external state if provided, otherwise use internal state
  const [internalFormData, setInternalFormData] =
    useState<StartupStep3FormData>({
      industry: "",
      development_stage: "",
      target_market: [],
      keywords: [],
      product_demo_url: "",
      key_metrics: [{ name: "", value: "" }],
      team_members: [{ name: "", linkedin: "", position: "" }],
      advisors: [{ name: "", company: "", linkedin: "", expertise: "" }],
    });

  const formData = externalFormData || internalFormData;
  const setFormData = setExternalFormData || setInternalFormData;

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTargetMarket, setNewTargetMarket] = useState("");
  const [newKeyword, setNewKeyword] = useState("");

  const developmentStages = [
    { value: "Idea", label: "Idea" },
    { value: "MVP", label: "MVP" },
    { value: "Early_traction", label: "Early Traction" },
    { value: "Growth", label: "Growth" },
    { value: "Expansion", label: "Expansion" },
  ];

  function validateURL(url: string): boolean {
    if (!url.trim()) return true; // Optional field
    try {
      new URL(url.startsWith("http") ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  }

  function validateLinkedIn(url: string): boolean {
    if (!url.trim()) return true; // Optional field
    return url.includes("linkedin.com") && validateURL(url);
  }

  function validateName(name: string): boolean {
    const trimmedName = name.trim();
    if (!trimmedName) return false;
    if (trimmedName.length < 2) return false;
    if (!/^[a-zA-Z\s\-'.]+$/.test(trimmedName)) return false;
    return true;
  }

  function validateForm(): boolean {
    const newErrors: FormErrors = {};

    // Industry validation
    if (!formData.industry.trim()) {
      newErrors.industry = "Industry is required";
    }

    // Development stage validation
    if (!formData.development_stage.trim()) {
      newErrors.development_stage = "Development stage is required";
    }

    // Target market validation
    if (formData.target_market.length === 0) {
      newErrors.target_market = "At least one target market is required";
    }

    // Keywords validation
    if (formData.keywords.length === 0) {
      newErrors.keywords = "At least one keyword is required";
    }

    // Product demo URL validation
    if (formData.product_demo_url && !validateURL(formData.product_demo_url)) {
      newErrors.product_demo_url = "Please enter a valid URL";
    }

    // Key metrics validation
    const validMetrics = formData.key_metrics.filter(
      (metric) => metric.name.trim() && metric.value.trim()
    );
    if (validMetrics.length === 0) {
      newErrors.key_metrics = "At least one key metric is required";
    }

    // Validate individual key metrics
    formData.key_metrics.forEach((metric, index) => {
      if (metric.name.trim() && !metric.value.trim()) {
        newErrors[`key_metrics_${index}_value`] = "Value is required";
      }
      if (metric.value.trim() && !metric.name.trim()) {
        newErrors[`key_metrics_${index}_name`] = "Metric name is required";
      }
    });

    // Team members validation
    const validTeamMembers = formData.team_members.filter(
      (member) => member.name.trim() && member.position.trim()
    );
    if (validTeamMembers.length === 0) {
      newErrors.team_members = "At least one team member is required";
    }

    // Validate individual team members
    formData.team_members.forEach((member, index) => {
      if (member.name.trim() && !validateName(member.name)) {
        newErrors[`team_members_${index}_name`] = "Please enter a valid name";
      }
      if (member.linkedin && !validateLinkedIn(member.linkedin)) {
        newErrors[`team_members_${index}_linkedin`] =
          "Please enter a valid LinkedIn URL";
      }
      if (
        (member.name.trim() || member.linkedin.trim()) &&
        !member.position.trim()
      ) {
        newErrors[`team_members_${index}_position`] = "Position is required";
      }
    });

    // Validate individual advisors
    formData.advisors.forEach((advisor, index) => {
      if (
        advisor.name.trim() ||
        advisor.company.trim() ||
        advisor.linkedin.trim() ||
        advisor.expertise.trim()
      ) {
        if (!advisor.name.trim()) {
          newErrors[`advisors_${index}_name`] = "Name is required";
        } else if (!validateName(advisor.name)) {
          newErrors[`advisors_${index}_name`] = "Please enter a valid name";
        }
        if (!advisor.company.trim()) {
          newErrors[`advisors_${index}_company`] = "Company is required";
        }
        if (!advisor.expertise.trim()) {
          newErrors[`advisors_${index}_expertise`] = "Expertise is required";
        }
        if (advisor.linkedin && !validateLinkedIn(advisor.linkedin)) {
          newErrors[`advisors_${index}_linkedin`] =
            "Please enter a valid LinkedIn URL";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleInputChange(
    field: keyof StartupStep3FormData,
    value: string | string[] | KeyMetric[] | TeamMember[] | Advisor[]
  ) {
    const newData = { ...formData, [field]: value };
    setFormData(newData);

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  }

  function addTargetMarket() {
    if (
      newTargetMarket.trim() &&
      !formData.target_market.includes(newTargetMarket.trim())
    ) {
      handleInputChange("target_market", [
        ...formData.target_market,
        newTargetMarket.trim(),
      ]);
      setNewTargetMarket("");
    }
  }

  function removeTargetMarket(market: string) {
    handleInputChange(
      "target_market",
      formData.target_market.filter((m) => m !== market)
    );
  }

  function addKeyword() {
    if (newKeyword.trim() && !formData.keywords.includes(newKeyword.trim())) {
      handleInputChange("keywords", [...formData.keywords, newKeyword.trim()]);
      setNewKeyword("");
    }
  }

  function removeKeyword(keyword: string) {
    handleInputChange(
      "keywords",
      formData.keywords.filter((k) => k !== keyword)
    );
  }

  function addKeyMetric() {
    handleInputChange("key_metrics", [
      ...formData.key_metrics,
      { name: "", value: "" },
    ]);
  }

  function removeKeyMetric(index: number) {
    if (formData.key_metrics.length > 1) {
      const newMetrics = formData.key_metrics.filter((_, i) => i !== index);
      handleInputChange("key_metrics", newMetrics);
    }
  }

  function updateKeyMetric(
    index: number,
    field: keyof KeyMetric,
    value: string
  ) {
    const newMetrics = [...formData.key_metrics];
    newMetrics[index] = { ...newMetrics[index], [field]: value };
    handleInputChange("key_metrics", newMetrics);

    // Clear specific error
    const errorKey = `key_metrics_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: "" }));
    }
  }

  function addTeamMember() {
    handleInputChange("team_members", [
      ...formData.team_members,
      { name: "", linkedin: "", position: "" },
    ]);
  }

  function removeTeamMember(index: number) {
    if (formData.team_members.length > 1) {
      const newMembers = formData.team_members.filter((_, i) => i !== index);
      handleInputChange("team_members", newMembers);
    }
  }

  function updateTeamMember(
    index: number,
    field: keyof TeamMember,
    value: string
  ) {
    const newMembers = [...formData.team_members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    handleInputChange("team_members", newMembers);

    // Clear specific error
    const errorKey = `team_members_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: "" }));
    }
  }

  function addAdvisor() {
    handleInputChange("advisors", [
      ...formData.advisors,
      { name: "", company: "", linkedin: "", expertise: "" },
    ]);
  }

  function removeAdvisor(index: number) {
    const newAdvisors = formData.advisors.filter((_, i) => i !== index);
    handleInputChange("advisors", newAdvisors);
  }

  function updateAdvisor(index: number, field: keyof Advisor, value: string) {
    const newAdvisors = [...formData.advisors];
    newAdvisors[index] = { ...newAdvisors[index], [field]: value };
    handleInputChange("advisors", newAdvisors);

    // Clear specific error
    const errorKey = `advisors_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: "" }));
    }
  }

  function areRequiredFieldsFilled(): boolean {
    const hasValidMetrics = formData.key_metrics.some(
      (metric) => metric.name.trim() && metric.value.trim()
    );
    const hasValidTeamMembers = formData.team_members.some(
      (member) => member.name.trim() && member.position.trim()
    );

    return !!(
      formData.industry.trim() &&
      formData.development_stage.trim() &&
      formData.target_market.length > 0 &&
      formData.keywords.length > 0 &&
      hasValidMetrics &&
      hasValidTeamMembers
    );
  }

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

      // TODO: Navigate to next step or completion
      console.log("Form submitted successfully!");
      setStep(4);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Business Information Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Business Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="industry">Industry *</Label>
              <Input
                id="industry"
                value={formData.industry}
                onChange={(e) => handleInputChange("industry", e.target.value)}
                aria-invalid={!!errors.industry}
              />
              {errors.industry && (
                <p className="text-sm text-destructive">{errors.industry}</p>
              )}
            </div>

            <div className="grid w-full items-center gap-2">
              <Label htmlFor="development_stage">Development Stage *</Label>
              <Select
                value={formData.development_stage}
                onValueChange={(value) =>
                  handleInputChange("development_stage", value)
                }
              >
                <SelectTrigger
                  className={cn(
                    !formData.development_stage && "text-muted-foreground"
                  )}
                  aria-invalid={!!errors.development_stage}
                >
                  <SelectValue placeholder="Select development stage..." />
                </SelectTrigger>
                <SelectContent>
                  {developmentStages.map((stage) => (
                    <SelectItem key={stage.value} value={stage.value}>
                      {stage.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.development_stage && (
                <p className="text-sm text-destructive">
                  {errors.development_stage}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="product_demo_url">Product Demo URL</Label>
              <Input
                id="product_demo_url"
                value={formData.product_demo_url}
                onChange={(e) =>
                  handleInputChange("product_demo_url", e.target.value)
                }
                aria-invalid={!!errors.product_demo_url}
              />
              {errors.product_demo_url && (
                <p className="text-sm text-destructive">
                  {errors.product_demo_url}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Target Market Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Target Market *</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newTargetMarket}
                onChange={(e) => setNewTargetMarket(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTargetMarket())
                }
              />
              <Button
                type="button"
                onClick={addTargetMarket}
                disabled={!newTargetMarket.trim()}
              >
                Add
              </Button>
            </div>

            {formData.target_market.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.target_market.map((market) => (
                  <Badge
                    key={market}
                    variant="secondary"
                    className="flex items-center gap-1 text-sm py-1 px-2"
                  >
                    {market}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => removeTargetMarket(market)}
                    />
                  </Badge>
                ))}
              </div>
            )}

            {errors.target_market && (
              <p className="text-sm text-destructive">{errors.target_market}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Keywords Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Keywords *</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addKeyword())
                }
              />
              <Button
                type="button"
                onClick={addKeyword}
                disabled={!newKeyword.trim()}
              >
                Add
              </Button>
            </div>

            {formData.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.keywords.map((keyword) => (
                  <Badge
                    key={keyword}
                    variant="secondary"
                    className="flex items-center gap-1 text-sm py-1 px-2"
                  >
                    {keyword}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => removeKeyword(keyword)}
                    />
                  </Badge>
                ))}
              </div>
            )}

            {errors.keywords && (
              <p className="text-sm text-destructive">{errors.keywords}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Key Metrics *</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {formData.key_metrics.map((metric, index) => (
              <div
                key={index}
                className="flex gap-3 items-center p-3 border rounded-lg"
              >
                <div className="flex-1">
                  <Input
                    value={metric.name}
                    onChange={(e) =>
                      updateKeyMetric(index, "name", e.target.value)
                    }
                    placeholder="Users"
                    aria-invalid={!!errors[`key_metrics_${index}_name`]}
                  />
                  {errors[`key_metrics_${index}_name`] && (
                    <p className="text-sm text-destructive mt-1">
                      {errors[`key_metrics_${index}_name`]}
                    </p>
                  )}
                </div>
                <div className="text-muted-foreground">:</div>
                <div className="flex-1">
                  <Input
                    value={metric.value}
                    onChange={(e) =>
                      updateKeyMetric(index, "value", e.target.value)
                    }
                    placeholder="1000"
                    aria-invalid={!!errors[`key_metrics_${index}_value`]}
                  />
                  {errors[`key_metrics_${index}_value`] && (
                    <p className="text-sm text-destructive mt-1">
                      {errors[`key_metrics_${index}_value`]}
                    </p>
                  )}
                </div>
                {formData.key_metrics.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeKeyMetric(index)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addKeyMetric}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Metric
            </Button>

            {errors.key_metrics && (
              <p className="text-sm text-destructive">{errors.key_metrics}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Team Members Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            Team Members *
            <Button type="button" onClick={addTeamMember} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {formData.team_members.map((member, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Team Member {index + 1}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeTeamMember(index)}
                    disabled={formData.team_members.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid w-full items-center gap-2">
                    <Label htmlFor={`team_member_name_${index}`}>Name *</Label>
                    <Input
                      id={`team_member_name_${index}`}
                      value={member.name}
                      onChange={(e) =>
                        updateTeamMember(index, "name", e.target.value)
                      }
                      aria-invalid={!!errors[`team_members_${index}_name`]}
                    />
                    {errors[`team_members_${index}_name`] && (
                      <p className="text-sm text-destructive">
                        {errors[`team_members_${index}_name`]}
                      </p>
                    )}
                  </div>

                  <div className="grid w-full items-center gap-2">
                    <Label htmlFor={`team_member_position_${index}`}>
                      Position *
                    </Label>
                    <Input
                      id={`team_member_position_${index}`}
                      value={member.position}
                      onChange={(e) =>
                        updateTeamMember(index, "position", e.target.value)
                      }
                      aria-invalid={!!errors[`team_members_${index}_position`]}
                    />
                    {errors[`team_members_${index}_position`] && (
                      <p className="text-sm text-destructive">
                        {errors[`team_members_${index}_position`]}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid w-full items-center gap-2">
                  <Label htmlFor={`team_member_linkedin_${index}`}>
                    LinkedIn URL
                  </Label>
                  <Input
                    id={`team_member_linkedin_${index}`}
                    value={member.linkedin}
                    onChange={(e) =>
                      updateTeamMember(index, "linkedin", e.target.value)
                    }
                    aria-invalid={!!errors[`team_members_${index}_linkedin`]}
                  />
                  {errors[`team_members_${index}_linkedin`] && (
                    <p className="text-sm text-destructive">
                      {errors[`team_members_${index}_linkedin`]}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {errors.team_members && (
              <p className="text-sm text-destructive">{errors.team_members}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Advisors Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            Advisors
            <Button type="button" onClick={addAdvisor} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {formData.advisors.map((advisor, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Advisor {index + 1}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeAdvisor(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid w-full items-center gap-2">
                    <Label htmlFor={`advisor_name_${index}`}>Name</Label>
                    <Input
                      id={`advisor_name_${index}`}
                      value={advisor.name}
                      onChange={(e) =>
                        updateAdvisor(index, "name", e.target.value)
                      }
                      aria-invalid={!!errors[`advisors_${index}_name`]}
                    />
                    {errors[`advisors_${index}_name`] && (
                      <p className="text-sm text-destructive">
                        {errors[`advisors_${index}_name`]}
                      </p>
                    )}
                  </div>

                  <div className="grid w-full items-center gap-2">
                    <Label htmlFor={`advisor_company_${index}`}>Company</Label>
                    <Input
                      id={`advisor_company_${index}`}
                      value={advisor.company}
                      onChange={(e) =>
                        updateAdvisor(index, "company", e.target.value)
                      }
                      aria-invalid={!!errors[`advisors_${index}_company`]}
                    />
                    {errors[`advisors_${index}_company`] && (
                      <p className="text-sm text-destructive">
                        {errors[`advisors_${index}_company`]}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid w-full items-center gap-2">
                    <Label htmlFor={`advisor_linkedin_${index}`}>
                      LinkedIn URL
                    </Label>
                    <Input
                      id={`advisor_linkedin_${index}`}
                      value={advisor.linkedin}
                      onChange={(e) =>
                        updateAdvisor(index, "linkedin", e.target.value)
                      }
                      aria-invalid={!!errors[`advisors_${index}_linkedin`]}
                    />
                    {errors[`advisors_${index}_linkedin`] && (
                      <p className="text-sm text-destructive">
                        {errors[`advisors_${index}_linkedin`]}
                      </p>
                    )}
                  </div>

                  <div className="grid w-full items-center gap-2">
                    <Label htmlFor={`advisor_expertise_${index}`}>
                      Expertise
                    </Label>
                    <Input
                      id={`advisor_expertise_${index}`}
                      value={advisor.expertise}
                      onChange={(e) =>
                        updateAdvisor(index, "expertise", e.target.value)
                      }
                      aria-invalid={!!errors[`advisors_${index}_expertise`]}
                    />
                    {errors[`advisors_${index}_expertise`] && (
                      <p className="text-sm text-destructive">
                        {errors[`advisors_${index}_expertise`]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
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
            {isSubmitting ? "Saving..." : "Next"}
          </Button>
        </div>
      </div>
    </form>
  );
}
