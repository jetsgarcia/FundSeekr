import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  DollarSignIcon,
  TrendingUpIcon,
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

interface FundingRequest {
  amount: number;
  purpose: string;
  equity_offered?: number;
  timeline?: string;
  milestones?: string[];
}

interface StartupProfileProps {
  startup: startups;
}

export function StartupProfile({ startup }: StartupProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedStartup, setEditedStartup] = useState<startups>(startup);
  const [newKeyword, setNewKeyword] = useState("");
  const [newTargetMarket, setNewTargetMarket] = useState("");
  const [newMilestone, setNewMilestone] = useState("");

  // Mock funding request data (you would get this from your database)
  const [fundingRequest, setFundingRequest] = useState<FundingRequest>({
    amount: 500000,
    purpose:
      "Expand our team and scale our technology platform to serve more customers",
    equity_offered: 15,
    timeline: "6 months",
    milestones: [
      "Hire 5 additional developers",
      "Launch mobile application",
      "Acquire 1,000 new customers",
      "Establish partnerships with 3 major clients",
    ],
  });

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
    // Here you would typically call an API to save the changes
    console.log("Saving changes:", editedStartup);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedStartup(startup);
    setIsEditing(false);
  };

  const addKeyword = () => {
    if (
      newKeyword.trim() &&
      !editedStartup.keywords.includes(newKeyword.trim())
    ) {
      setEditedStartup({
        ...editedStartup,
        keywords: [...editedStartup.keywords, newKeyword.trim()],
      });
      setNewKeyword("");
    }
  };

  const removeKeyword = (index: number) => {
    setEditedStartup({
      ...editedStartup,
      keywords: editedStartup.keywords.filter((_, i) => i !== index),
    });
  };

  const addTargetMarket = () => {
    if (
      newTargetMarket.trim() &&
      !editedStartup.target_market.includes(newTargetMarket.trim())
    ) {
      setEditedStartup({
        ...editedStartup,
        target_market: [...editedStartup.target_market, newTargetMarket.trim()],
      });
      setNewTargetMarket("");
    }
  };

  const removeTargetMarket = (index: number) => {
    setEditedStartup({
      ...editedStartup,
      target_market: editedStartup.target_market.filter((_, i) => i !== index),
    });
  };

  const updateTeamMember = (index: number, field: string, value: string) => {
    const updatedTeam = [...editedStartup.team_members];
    updatedTeam[index] = { ...(updatedTeam[index] as any), [field]: value };
    setEditedStartup({
      ...editedStartup,
      team_members: updatedTeam,
    });
  };

  const addTeamMember = () => {
    setEditedStartup({
      ...editedStartup,
      team_members: [
        ...editedStartup.team_members,
        { name: "", role: "", linkedin: "" },
      ],
    });
  };

  const removeTeamMember = (index: number) => {
    setEditedStartup({
      ...editedStartup,
      team_members: editedStartup.team_members.filter((_, i) => i !== index),
    });
  };

  const updateKeyMetric = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updatedMetrics = [...editedStartup.key_metrics];
    updatedMetrics[index] = {
      ...(updatedMetrics[index] as any),
      [field]: value,
    };
    setEditedStartup({
      ...editedStartup,
      key_metrics: updatedMetrics,
    });
  };

  const addKeyMetric = () => {
    setEditedStartup({
      ...editedStartup,
      key_metrics: [...editedStartup.key_metrics, { metric: "", value: 0 }],
    });
  };

  const removeKeyMetric = (index: number) => {
    setEditedStartup({
      ...editedStartup,
      key_metrics: editedStartup.key_metrics.filter((_, i) => i !== index),
    });
  };

  const updateAdvisor = (index: number, field: string, value: string) => {
    const updatedAdvisors = [...editedStartup.advisors];
    updatedAdvisors[index] = {
      ...(updatedAdvisors[index] as any),
      [field]: value,
    };
    setEditedStartup({
      ...editedStartup,
      advisors: updatedAdvisors,
    });
  };

  const addAdvisor = () => {
    setEditedStartup({
      ...editedStartup,
      advisors: [
        ...editedStartup.advisors,
        { name: "", expertise: "", linkedin: "" },
      ],
    });
  };

  const removeAdvisor = (index: number) => {
    setEditedStartup({
      ...editedStartup,
      advisors: editedStartup.advisors.filter((_, i) => i !== index),
    });
  };

  const addMilestone = () => {
    if (
      newMilestone.trim() &&
      !fundingRequest.milestones?.includes(newMilestone.trim())
    ) {
      setFundingRequest({
        ...fundingRequest,
        milestones: [...(fundingRequest.milestones || []), newMilestone.trim()],
      });
      setNewMilestone("");
    }
  };

  const removeMilestone = (index: number) => {
    setFundingRequest({
      ...fundingRequest,
      milestones:
        fundingRequest.milestones?.filter((_, i) => i !== index) || [],
    });
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
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Company Name</Label>
                    <Input
                      id="name"
                      value={editedStartup.name || ""}
                      onChange={(e) =>
                        setEditedStartup({
                          ...editedStartup,
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
                      value={editedStartup.industry || ""}
                      onChange={(e) =>
                        setEditedStartup({
                          ...editedStartup,
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
                      value={editedStartup.city || ""}
                      onChange={(e) =>
                        setEditedStartup({
                          ...editedStartup,
                          city: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="development_stage">Development Stage</Label>
                    <Select
                      value={editedStartup.development_stage || ""}
                      onValueChange={(value) =>
                        setEditedStartup({
                          ...editedStartup,
                          development_stage: value as development_stage_enum,
                        })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select development stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Idea">Idea</SelectItem>
                        <SelectItem value="Prototype">Prototype</SelectItem>
                        <SelectItem value="MVP">MVP</SelectItem>
                        <SelectItem value="Early_traction">
                          Early Traction
                        </SelectItem>
                        <SelectItem value="Growth">Growth</SelectItem>
                        <SelectItem value="Expansion">Expansion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold">
                    {editedStartup.name || "Startup Name"}
                  </h2>
                  <p className="text-muted-foreground">
                    {editedStartup.industry || "Industry"}
                  </p>
                  <div className="mt-2 flex items-center space-x-4">
                    <span className="inline-flex items-center text-sm text-muted-foreground">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {editedStartup.city || "Location"}
                    </span>
                    {editedStartup.date_founded && (
                      <span className="inline-flex items-center text-sm text-muted-foreground">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        Founded {formatDate(editedStartup.date_founded)}
                        {` (${getYearsInBusiness(
                          editedStartup.date_founded
                        )} years)`}
                      </span>
                    )}
                  </div>
                  <div className="mt-3">
                    <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                      {formatDevelopmentStage(editedStartup.development_stage)}
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
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        type="url"
                        value={editedStartup.website || ""}
                        onChange={(e) =>
                          setEditedStartup({
                            ...editedStartup,
                            website: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="product_demo_url">Product Demo URL</Label>
                      <Input
                        id="product_demo_url"
                        type="url"
                        value={editedStartup.product_demo_url || ""}
                        onChange={(e) =>
                          setEditedStartup({
                            ...editedStartup,
                            product_demo_url: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    {editedStartup.website && (
                      <a
                        href={editedStartup.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center"
                      >
                        <GlobeIcon className="h-4 w-4 mr-1" />
                        Website
                      </a>
                    )}
                    {editedStartup.product_demo_url && (
                      <a
                        href={editedStartup.product_demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center"
                      >
                        <PlayIcon className="h-4 w-4 mr-1" />
                        Product Demo
                      </a>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
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
                  value={editedStartup.description || ""}
                  onChange={(e) =>
                    setEditedStartup({
                      ...editedStartup,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  className="mt-1"
                />
              </div>
            </div>
          ) : (
            <p className="text-base leading-relaxed mb-4">
              {editedStartup.description || "Company description not provided."}
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
                    {editedStartup.target_market.map((market, index) => (
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
                      value={newTargetMarket}
                      onChange={(e) => setNewTargetMarket(e.target.value)}
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
                  {editedStartup.target_market.map((market, index) => (
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
                {editedStartup.intellectual_property.map((ip, index) => {
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
                  value={editedStartup.valuation || ""}
                  onChange={(e) =>
                    setEditedStartup({
                      ...editedStartup,
                      valuation: Number(e.target.value),
                    })
                  }
                  placeholder="Enter valuation"
                  className="mt-1"
                />
              ) : (
                <p className="text-lg font-semibold">
                  {editedStartup.valuation
                    ? formatCurrency(editedStartup.valuation)
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
                  {editedStartup.key_metrics.map((metric, index) => {
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
                          onChange={(e) =>
                            updateKeyMetric(
                              index,
                              "value",
                              Number(e.target.value)
                            )
                          }
                          placeholder="Value"
                          className="w-24"
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
                  {editedStartup.key_metrics.map((metric, index) => {
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
                {editedStartup.keywords.map((keyword, index) => (
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
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
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
              {editedStartup.keywords.map((keyword, index) => (
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
              {editedStartup.team_members.map((member, index) => {
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
                      onChange={(e) =>
                        updateTeamMember(index, "linkedin", e.target.value)
                      }
                      placeholder="LinkedIn URL"
                      type="url"
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
              {editedStartup.team_members.map((member, index) => {
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
              {editedStartup.advisors.map((advisor, index) => {
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
                      onChange={(e) =>
                        updateAdvisor(index, "linkedin", e.target.value)
                      }
                      placeholder="LinkedIn URL"
                      type="url"
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
              {editedStartup.advisors.map((advisor, index) => {
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

        {/* Funding Request */}
        <div className="md:col-span-3 bg-card rounded-lg p-6 shadow-sm border">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <DollarSignIcon className="h-5 w-5 mr-2" />
            Funding Request
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Funding Overview */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Funding Amount
                </h4>
                {isEditing ? (
                  <Input
                    type="number"
                    value={fundingRequest.amount || ""}
                    onChange={(e) =>
                      setFundingRequest({
                        ...fundingRequest,
                        amount: Number(e.target.value),
                      })
                    }
                    placeholder="Enter funding amount"
                    className="mt-1"
                  />
                ) : (
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(fundingRequest.amount)}
                  </p>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Equity Offered
                </h4>
                {isEditing ? (
                  <Input
                    type="number"
                    value={fundingRequest.equity_offered || ""}
                    onChange={(e) =>
                      setFundingRequest({
                        ...fundingRequest,
                        equity_offered: Number(e.target.value),
                      })
                    }
                    placeholder="Enter equity percentage"
                    className="mt-1"
                  />
                ) : (
                  <p className="text-lg font-semibold">
                    {fundingRequest.equity_offered
                      ? `${fundingRequest.equity_offered}%`
                      : "To be negotiated"}
                  </p>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Timeline
                </h4>
                {isEditing ? (
                  <Input
                    value={fundingRequest.timeline || ""}
                    onChange={(e) =>
                      setFundingRequest({
                        ...fundingRequest,
                        timeline: e.target.value,
                      })
                    }
                    placeholder="Enter timeline"
                    className="mt-1"
                  />
                ) : (
                  <p className="text-base">
                    {fundingRequest.timeline || "Flexible"}
                  </p>
                )}
              </div>
            </div>

            {/* Purpose and Use of Funds */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Purpose & Use of Funds
                </h4>
                {isEditing ? (
                  <Textarea
                    value={fundingRequest.purpose || ""}
                    onChange={(e) =>
                      setFundingRequest({
                        ...fundingRequest,
                        purpose: e.target.value,
                      })
                    }
                    placeholder="Describe how you will use the funding"
                    rows={4}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-base leading-relaxed">
                    {fundingRequest.purpose || "Purpose not specified"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
              <TrendingUpIcon className="h-4 w-4 mr-1" />
              Key Milestones
            </h4>
            {isEditing ? (
              <div className="space-y-3">
                <div className="space-y-2">
                  {fundingRequest.milestones?.map((milestone, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-accent rounded-md"
                    >
                      <span className="flex-1 text-sm">{milestone}</span>
                      <Button
                        onClick={() => removeMilestone(index)}
                        size="sm"
                        variant="ghost"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newMilestone}
                    onChange={(e) => setNewMilestone(e.target.value)}
                    placeholder="Add milestone"
                    className="flex-1"
                    onKeyPress={(e) => e.key === "Enter" && addMilestone()}
                  />
                  <Button onClick={addMilestone} size="sm" variant="outline">
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {fundingRequest.milestones?.map((milestone, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-accent rounded-md"
                  >
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">{milestone}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
