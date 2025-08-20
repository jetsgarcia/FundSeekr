import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { formatCurrency } from "@/lib/utils";
import {
  PencilIcon,
  UsersIcon,
  BrainCircuitIcon,
  CalendarIcon,
  MapPinIcon,
  GlobeIcon,
  LinkedinIcon,
  PlayIcon,
  PlusIcon,
  MinusIcon,
  SaveIcon,
  XIcon,
} from "lucide-react";
import { startups, development_stage_enum } from "@prisma/client";
import { useState } from "react";

interface TeamMember {
  name: string;
  role: string;
  linkedin?: string;
}

interface Advisor {
  name: string;
  expertise: string;
  linkedin?: string;
}

interface KeyMetric {
  metric: string;
  value: number;
}

interface IntellectualProperty {
  type?: string;
  description: string;
}

// Interface for the complete startup profile state
interface StartupProfileState {
  profile: startups;
  ui: {
    newKeyword: string;
    newTargetMarket: string;
  };
}

interface StartupProfileProps {
  startup: startups;
}

export function StartupProfile({ startup }: StartupProfileProps) {
  const [isEditing, setIsEditing] = useState(false);

  // Single state object containing all startup profile data and UI state
  const [startupState, setStartupState] = useState<StartupProfileState>(() => ({
    profile: startup,
    ui: {
      newKeyword: "",
      newTargetMarket: "",
    },
  }));

  // Helper function to update profile data
  const updateProfile = (updates: Partial<startups>) => {
    setStartupState((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...updates },
    }));
  };

  // Helper function to update UI state
  const updateUI = (updates: Partial<StartupProfileState["ui"]>) => {
    setStartupState((prev) => ({
      ...prev,
      ui: { ...prev.ui, ...updates },
    }));
  };

  const formatDevelopmentStage = (stage: development_stage_enum | null) => {
    if (!stage) return "Not specified";
    return stage.replace(/_/g, " ");
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Not specified";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getYearsInBusiness = (date: Date | null) => {
    if (!date) return 0;
    const now = new Date();
    const years = now.getFullYear() - date.getFullYear();
    return years;
  };

  const formatMetricValue = (metricName: string, value: number) => {
    if (
      metricName.toLowerCase().includes("revenue") ||
      metricName.toLowerCase().includes("php")
    ) {
      return formatCurrency(value);
    }
    if (
      metricName.toLowerCase().includes("percent") ||
      metricName.toLowerCase().includes("rate")
    ) {
      return `${value}%`;
    }
    if (metricName.toLowerCase().includes("kg")) {
      return `${Number(value).toLocaleString()} kg`;
    }
    return Number(value).toLocaleString();
  };

  const handleSave = () => {
    // Validate LinkedIn URLs before saving
    const invalidTeamLinkedIns = startupState.profile.team_members.some(
      (member: any) => member.linkedin && !validateLinkedInUrl(member.linkedin)
    );
    const invalidAdvisorLinkedIns = startupState.profile.advisors.some(
      (advisor: any) =>
        advisor.linkedin && !validateLinkedInUrl(advisor.linkedin)
    );

    if (invalidTeamLinkedIns || invalidAdvisorLinkedIns) {
      alert(
        "Please fix invalid LinkedIn URLs before saving. LinkedIn URLs should be in the format: https://linkedin.com/in/username"
      );
      return;
    }

    console.log("Saving changes:", startupState.profile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setStartupState((prev) => ({
      ...prev,
      profile: startup,
    }));
    setIsEditing(false);
  };

  const addKeyword = () => {
    const { newKeyword } = startupState.ui;
    if (
      newKeyword.trim() &&
      !startupState.profile.keywords.includes(newKeyword.trim())
    ) {
      updateProfile({
        keywords: [...startupState.profile.keywords, newKeyword.trim()],
      });
      updateUI({ newKeyword: "" });
    }
  };

  const removeKeyword = (index: number) => {
    updateProfile({
      keywords: startupState.profile.keywords.filter((_, i) => i !== index),
    });
  };

  const addTargetMarket = () => {
    const { newTargetMarket } = startupState.ui;
    if (
      newTargetMarket.trim() &&
      !startupState.profile.target_market.includes(newTargetMarket.trim())
    ) {
      updateProfile({
        target_market: [
          ...startupState.profile.target_market,
          newTargetMarket.trim(),
        ],
      });
      updateUI({ newTargetMarket: "" });
    }
  };

  const removeTargetMarket = (index: number) => {
    updateProfile({
      target_market: startupState.profile.target_market.filter(
        (_, i) => i !== index
      ),
    });
  };

  const updateTeamMember = (index: number, field: string, value: string) => {
    const updatedTeam = [...startupState.profile.team_members];
    updatedTeam[index] = { ...(updatedTeam[index] as any), [field]: value };
    updateProfile({
      team_members: updatedTeam,
    });
  };

  const addTeamMember = () => {
    updateProfile({
      team_members: [
        ...startupState.profile.team_members,
        { name: "", role: "", linkedin: "" },
      ],
    });
  };

  const removeTeamMember = (index: number) => {
    updateProfile({
      team_members: startupState.profile.team_members.filter(
        (_, i) => i !== index
      ),
    });
  };

  const updateKeyMetric = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updatedMetrics = [...startupState.profile.key_metrics];
    updatedMetrics[index] = {
      ...(updatedMetrics[index] as any),
      [field]: value,
    };
    updateProfile({
      key_metrics: updatedMetrics,
    });
  };

  const addKeyMetric = () => {
    updateProfile({
      key_metrics: [
        ...startupState.profile.key_metrics,
        { metric: "", value: 0 },
      ],
    });
  };

  const removeKeyMetric = (index: number) => {
    updateProfile({
      key_metrics: startupState.profile.key_metrics.filter(
        (_, i) => i !== index
      ),
    });
  };

  const updateAdvisor = (index: number, field: string, value: string) => {
    const updatedAdvisors = [...startupState.profile.advisors];
    updatedAdvisors[index] = {
      ...(updatedAdvisors[index] as any),
      [field]: value,
    };
    updateProfile({
      advisors: updatedAdvisors,
    });
  };

  const addAdvisor = () => {
    updateProfile({
      advisors: [
        ...startupState.profile.advisors,
        { name: "", expertise: "", linkedin: "" },
      ],
    });
  };

  const removeAdvisor = (index: number) => {
    updateProfile({
      advisors: startupState.profile.advisors.filter((_, i) => i !== index),
    });
  };

  const validateLinkedInUrl = (url: string): boolean => {
    if (!url) return true; // Empty URL is valid
    const linkedinPattern =
      /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-_.]+\/?$/;
    return linkedinPattern.test(url);
  };

  const validateNumber = (value: string): boolean => {
    return !isNaN(Number(value)) && Number(value) >= 0;
  };

  const handleNumberInput = (value: string): string => {
    // Remove any non-numeric characters except decimal point
    return value.replace(/[^0-9.]/g, "");
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Startup Profile</h1>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column - Basic info */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Company Name</Label>
                  <Input
                    id="name"
                    value={startupState.profile.name || ""}
                    onChange={(e) =>
                      updateProfile({
                        name: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    value={startupState.profile.industry || ""}
                    onChange={(e) =>
                      updateProfile({
                        industry: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={startupState.profile.city || ""}
                    onChange={(e) =>
                      updateProfile({
                        city: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="development_stage">Development Stage</Label>
                  <Select
                    value={startupState.profile.development_stage || ""}
                    onValueChange={(value) =>
                      updateProfile({
                        development_stage: value as development_stage_enum,
                      })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select development stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Idea">Idea</SelectItem>
                      <SelectItem value="MVP">MVP</SelectItem>
                      <SelectItem value="Early_traction">
                        Early Traction
                      </SelectItem>
                      <SelectItem value="Growth">Growth</SelectItem>
                      <SelectItem value="Expansion">Expansion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date_founded">Date Founded</Label>
                  <DatePicker
                    date={startupState.profile.date_founded}
                    onDateChange={(date) =>
                      updateProfile({
                        date_founded: date,
                      })
                    }
                    placeholder="Select founding date"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Right column - URLs */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={startupState.profile.website || ""}
                    onChange={(e) => updateProfile({ website: e.target.value })}
                    className="mt-1"
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="product_demo_url">Product Demo URL</Label>
                  <Input
                    id="product_demo_url"
                    type="url"
                    value={startupState.profile.product_demo_url || ""}
                    onChange={(e) =>
                      updateProfile({ product_demo_url: e.target.value })
                    }
                    className="mt-1"
                    placeholder="https://demo.example.com"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold">
                  {startupState.profile.name || "Startup Name"}
                </h2>
                <p className="text-muted-foreground">
                  {startupState.profile.industry || "Industry"}
                </p>
                <div className="mt-2 flex items-center space-x-4">
                  <span className="inline-flex items-center text-sm text-muted-foreground">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {startupState.profile.city || "Location"}
                  </span>
                  {startupState.profile.date_founded && (
                    <span className="inline-flex items-center text-sm text-muted-foreground">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      Founded {formatDate(startupState.profile.date_founded)}
                      {` (${getYearsInBusiness(
                        startupState.profile.date_founded
                      )} years)`}
                    </span>
                  )}
                </div>
                <div className="mt-3">
                  <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                    {formatDevelopmentStage(
                      startupState.profile.development_stage
                    )}
                  </span>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="flex flex-col md:items-end gap-2">
                  {startupState.profile.website && (
                    <a
                      href={startupState.profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center"
                    >
                      <GlobeIcon className="h-4 w-4 mr-1" />
                      Website
                    </a>
                  )}
                  {startupState.profile.product_demo_url && (
                    <a
                      href={startupState.profile.product_demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center"
                    >
                      <PlayIcon className="h-4 w-4 mr-1" />
                      Product Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Company Description */}
        <div className="md:col-span-2 bg-card rounded-lg p-6 shadow-sm border">
          <h3 className="text-xl font-semibold mb-4">About the Company</h3>
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="description">Company Description</Label>
                <Textarea
                  id="description"
                  value={startupState.profile.description || ""}
                  onChange={(e) =>
                    updateProfile({ description: e.target.value })
                  }
                  rows={4}
                  className="mt-1"
                />
              </div>
            </div>
          ) : (
            <p className="text-base leading-relaxed mb-4">
              {startupState.profile.description ||
                "Company description not provided."}
            </p>
          )}

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                Target Market
              </h4>
              {isEditing ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {startupState.profile.target_market.map((market, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs flex items-center gap-1"
                      >
                        {market}
                        <button
                          onClick={() => removeTargetMarket(index)}
                          className="text-primary hover:text-primary/70"
                        >
                          <MinusIcon className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={startupState.ui.newTargetMarket}
                      onChange={(e) =>
                        updateUI({ newTargetMarket: e.target.value })
                      }
                      placeholder="Add target market"
                      className="flex-1"
                      onKeyPress={(e) => e.key === "Enter" && addTargetMarket()}
                    />
                    <Button
                      onClick={addTargetMarket}
                      size="sm"
                      variant="outline"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {startupState.profile.target_market.map((market, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs"
                    >
                      {market}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                Intellectual Property
              </h4>
              <div className="space-y-2">
                {startupState.profile.intellectual_property.map((ip, index) => {
                  const ipData = ip as unknown as IntellectualProperty;
                  return (
                    <div key={index} className="text-sm">
                      {ipData?.type && (
                        <span className="font-medium text-primary">
                          {ipData.type}:
                        </span>
                      )}{" "}
                      {ipData?.description || "No description provided"}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Valuation & Metrics */}
        <div className="bg-card rounded-lg p-6 shadow-sm border">
          <h3 className="text-xl font-semibold mb-4">Valuation & Metrics</h3>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Valuation
              </h4>
              {isEditing ? (
                <Input
                  type="number"
                  value={startupState.profile.valuation || ""}
                  onChange={(e) => {
                    const value = handleNumberInput(e.target.value);
                    if (validateNumber(value) || value === "") {
                      updateProfile({
                        valuation: value === "" ? null : Number(value),
                      });
                    }
                  }}
                  onKeyPress={(e) => {
                    // Prevent non-numeric characters
                    if (
                      !/[0-9.]/.test(e.key) &&
                      !["Backspace", "Delete", "Tab", "Enter"].includes(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                  placeholder="Enter valuation (numbers only)"
                  className="mt-1"
                  min="0"
                  step="1"
                />
              ) : (
                <p className="text-lg font-semibold">
                  {startupState.profile.valuation
                    ? formatCurrency(startupState.profile.valuation)
                    : "Not disclosed"}
                </p>
              )}
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                Key Metrics
              </h4>
              {isEditing ? (
                <div className="space-y-2">
                  {startupState.profile.key_metrics.map((metric, index) => {
                    const metricData = metric as unknown as KeyMetric;
                    return (
                      <div key={index} className="flex gap-2 items-center">
                        <Input
                          value={metricData?.metric || ""}
                          onChange={(e) =>
                            updateKeyMetric(index, "metric", e.target.value)
                          }
                          placeholder="Metric name"
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          value={metricData?.value || ""}
                          onChange={(e) => {
                            const value = handleNumberInput(e.target.value);
                            if (validateNumber(value) || value === "") {
                              updateKeyMetric(
                                index,
                                "value",
                                value === "" ? 0 : Number(value)
                              );
                            }
                          }}
                          onKeyPress={(e) => {
                            // Prevent non-numeric characters
                            if (
                              !/[0-9.]/.test(e.key) &&
                              !["Backspace", "Delete", "Tab", "Enter"].includes(
                                e.key
                              )
                            ) {
                              e.preventDefault();
                            }
                          }}
                          placeholder="Value"
                          className="w-24"
                          min="0"
                          step="1"
                        />
                        <Button
                          onClick={() => removeKeyMetric(index)}
                          size="sm"
                          variant="outline"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                  <Button onClick={addKeyMetric} size="sm" variant="outline">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Metric
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {startupState.profile.key_metrics.map((metric, index) => {
                    const metricData = metric as unknown as KeyMetric;
                    return (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <span className="text-xs text-muted-foreground">
                          {metricData?.metric || "Metric"}
                        </span>
                        <span className="text-sm font-medium">
                          {metricData?.metric && metricData?.value
                            ? formatMetricValue(
                                metricData.metric,
                                metricData.value
                              )
                            : "N/A"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Keywords/Tags */}
        <div className="md:col-span-3 bg-card rounded-lg p-6 shadow-sm border">
          <h3 className="text-xl font-semibold mb-4">
            Keywords & Technologies
          </h3>
          {isEditing ? (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {startupState.profile.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-1"
                  >
                    {keyword}
                    <button
                      onClick={() => removeKeyword(index)}
                      className="text-primary hover:text-primary/70"
                    >
                      <MinusIcon className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={startupState.ui.newKeyword}
                  onChange={(e) => updateUI({ newKeyword: e.target.value })}
                  placeholder="Add keyword or technology"
                  className="flex-1"
                  onKeyPress={(e) => e.key === "Enter" && addKeyword()}
                />
                <Button onClick={addKeyword} size="sm" variant="outline">
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {startupState.profile.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Team Members */}
        <div className="md:col-span-2 bg-card rounded-lg p-6 shadow-sm border">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <UsersIcon className="h-5 w-5 mr-2" />
            Team
          </h3>
          {isEditing ? (
            <div className="space-y-4">
              {startupState.profile.team_members.map((member, index) => {
                const memberData = member as unknown as TeamMember;
                return (
                  <div
                    key={index}
                    className="p-3 bg-accent rounded-md space-y-2"
                  >
                    <div className="flex gap-2">
                      <Input
                        value={memberData?.name || ""}
                        onChange={(e) =>
                          updateTeamMember(index, "name", e.target.value)
                        }
                        placeholder="Name"
                        className="flex-1"
                      />
                      <Button
                        onClick={() => removeTeamMember(index)}
                        size="sm"
                        variant="outline"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input
                      value={memberData?.role || ""}
                      onChange={(e) =>
                        updateTeamMember(index, "role", e.target.value)
                      }
                      placeholder="Role"
                    />
                    <Input
                      value={memberData?.linkedin || ""}
                      onChange={(e) => {
                        const url = e.target.value;
                        updateTeamMember(index, "linkedin", url);
                      }}
                      placeholder="LinkedIn URL (e.g., https://linkedin.com/in/username)"
                      type="url"
                      className={
                        memberData?.linkedin &&
                        !validateLinkedInUrl(memberData.linkedin)
                          ? "border-red-500"
                          : ""
                      }
                    />
                  </div>
                );
              })}
              <Button onClick={addTeamMember} size="sm" variant="outline">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Team Member
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {startupState.profile.team_members.map((member, index) => {
                const memberData = member as unknown as TeamMember;
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-accent rounded-md"
                  >
                    <div>
                      <h4 className="font-medium">
                        {memberData?.name || "Team Member"}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {memberData?.role || "Role"}
                      </p>
                    </div>
                    {memberData?.linkedin && (
                      <a
                        href={memberData.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80"
                      >
                        <LinkedinIcon className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Advisors */}
        <div className="bg-card rounded-lg p-6 shadow-sm border">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <BrainCircuitIcon className="h-5 w-5 mr-2" />
            Advisors
          </h3>
          {isEditing ? (
            <div className="space-y-4">
              {startupState.profile.advisors.map((advisor, index) => {
                const advisorData = advisor as unknown as Advisor;
                return (
                  <div
                    key={index}
                    className="p-3 bg-accent rounded-md space-y-2"
                  >
                    <div className="flex gap-2">
                      <Input
                        value={advisorData?.name || ""}
                        onChange={(e) =>
                          updateAdvisor(index, "name", e.target.value)
                        }
                        placeholder="Name"
                        className="flex-1"
                      />
                      <Button
                        onClick={() => removeAdvisor(index)}
                        size="sm"
                        variant="outline"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input
                      value={advisorData?.expertise || ""}
                      onChange={(e) =>
                        updateAdvisor(index, "expertise", e.target.value)
                      }
                      placeholder="Expertise"
                    />
                    <Input
                      value={advisorData?.linkedin || ""}
                      onChange={(e) => {
                        const url = e.target.value;
                        updateAdvisor(index, "linkedin", url);
                      }}
                      placeholder="LinkedIn URL (e.g., https://linkedin.com/in/username)"
                      type="url"
                      className={
                        advisorData?.linkedin &&
                        !validateLinkedInUrl(advisorData.linkedin)
                          ? "border-red-500"
                          : ""
                      }
                    />
                  </div>
                );
              })}
              <Button onClick={addAdvisor} size="sm" variant="outline">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Advisor
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {startupState.profile.advisors.map((advisor, index) => {
                const advisorData = advisor as unknown as Advisor;
                return (
                  <div key={index} className="p-3 bg-accent rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-sm">
                          {advisorData?.name || "Advisor"}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {advisorData?.expertise || "Expertise"}
                        </p>
                      </div>
                      {advisorData?.linkedin && (
                        <a
                          href={advisorData.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80"
                        >
                          <LinkedinIcon className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
