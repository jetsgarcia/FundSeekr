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
  User,
  Loader2,
  Building,
  Target,
  TrendingUp,
  Shield,
  Tags,
} from "lucide-react";
import type { ExtendedStartupProfile } from "@/components/profile/startup-profile";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface TeamMember {
  name: string;
  position: string;
  linkedin: string;
}

interface Advisor {
  name: string;
  expertise: string;
  company: string;
  linkedin: string;
}

interface KeyMetric {
  name: string;
  value: string;
  description: string;
}

interface IntellectualProperty {
  type: string;
  title: string;
  description: string;
  status: string;
  application_number: string;
}

interface EditStartupProfileProps {
  startup: ExtendedStartupProfile;
  onSave?: (data: Record<string, unknown>) => Promise<{
    ok: boolean;
    profile?: Record<string, unknown>;
    error?: string;
  }>;
}

export function EditStartupProfile({
  startup,
  onSave,
}: EditStartupProfileProps) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [name, setName] = useState(startup.name || "");
  const [description, setDescription] = useState(startup.description || "");
  const [industry, setIndustry] = useState(startup.industry || "");
  const [city, setCity] = useState(startup.city || "");
  const [website, setWebsite] = useState(startup.website || "");
  const [valuation, setValuation] = useState(
    startup.valuation?.toString() || ""
  );
  const [dateFounded, setDateFounded] = useState(
    startup.date_founded
      ? new Date(startup.date_founded).toISOString().split("T")[0]
      : ""
  );
  const [productDemoUrl, setProductDemoUrl] = useState(
    startup.product_demo_url || ""
  );
  const [developmentStage, setDevelopmentStage] = useState(
    startup.development_stage || ""
  );

  // Array fields
  const [targetMarket, setTargetMarket] = useState<string>(
    startup.target_market?.join(", ") || ""
  );
  const [keywords, setKeywords] = useState<string>(
    startup.keywords?.join(", ") || ""
  );

  // Complex JSON fields
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(
    startup.team_members?.map((member) => ({
      name: String(member.name || ""),
      position: String(member.position || ""),
      linkedin: String(member.linkedin || ""),
    })) || []
  );

  const [advisors, setAdvisors] = useState<Advisor[]>(
    startup.advisors?.map((advisor) => ({
      name: String(advisor.name || ""),
      expertise: String(advisor.expertise || ""),
      company: String(advisor.company || ""),
      linkedin: String(advisor.linkedin || ""),
    })) || []
  );

  const [keyMetrics, setKeyMetrics] = useState<KeyMetric[]>(
    startup.key_metrics?.map((metric) => ({
      name: String(metric.name || ""),
      value: String(metric.value || ""),
      description: String(metric.description || ""),
    })) || []
  );

  const [intellectualProperty, setIntellectualProperty] = useState<
    IntellectualProperty[]
  >(
    startup.intellectual_property?.map((ip) => ({
      type: String(ip.type || ""),
      title: String(ip.title || ""),
      description: String(ip.description || ""),
      status: String(ip.status || ""),
      application_number: String(ip.application_number || ""),
    })) || []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSave) {
      toast.error("No save function provided");
      return;
    }

    startTransition(async () => {
      try {
        const formData = {
          name,
          description,
          industry,
          city,
          website,
          valuation: valuation ? parseInt(valuation) : null,
          date_founded: dateFounded ? new Date(dateFounded) : null,
          product_demo_url: productDemoUrl,
          development_stage: developmentStage || null,
          target_market: targetMarket
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          keywords: keywords
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          team_members: teamMembers.filter((member) => member.name.trim()),
          advisors: advisors.filter((advisor) => advisor.name.trim()),
          key_metrics: keyMetrics.filter((metric) => metric.name.trim()),
          intellectual_property: intellectualProperty.filter((ip) =>
            ip.type.trim()
          ),
        };

        const result = await onSave(formData);

        if (result.ok) {
          toast.success("Profile updated successfully!");
          router.push("/profile");
        } else {
          toast.error(
            result.error || "Failed to update profile. Please try again."
          );
        }
      } catch (error: unknown) {
        console.error("Error saving startup profile:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to update profile. Please try again.";
        toast.error(errorMessage);
      }
    });
  };

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, { name: "", position: "", linkedin: "" }]);
  };

  const removeTeamMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const updateTeamMember = (
    index: number,
    field: keyof TeamMember,
    value: string
  ) => {
    const updated = [...teamMembers];
    updated[index] = { ...updated[index], [field]: value };
    setTeamMembers(updated);
  };

  const addAdvisor = () => {
    setAdvisors([
      ...advisors,
      { name: "", expertise: "", company: "", linkedin: "" },
    ]);
  };

  const removeAdvisor = (index: number) => {
    setAdvisors(advisors.filter((_, i) => i !== index));
  };

  const updateAdvisor = (
    index: number,
    field: keyof Advisor,
    value: string
  ) => {
    const updated = [...advisors];
    updated[index] = { ...updated[index], [field]: value };
    setAdvisors(updated);
  };

  const addKeyMetric = () => {
    setKeyMetrics([...keyMetrics, { name: "", value: "", description: "" }]);
  };

  const removeKeyMetric = (index: number) => {
    setKeyMetrics(keyMetrics.filter((_, i) => i !== index));
  };

  const updateKeyMetric = (
    index: number,
    field: keyof KeyMetric,
    value: string
  ) => {
    const updated = [...keyMetrics];
    if (field === "value") {
      const numericValue = value.replace(/[^0-9.]/g, "");
      const parts = numericValue.split(".");
      const processedValue =
        parts.length > 2
          ? parts[0] + "." + parts.slice(1).join("")
          : numericValue;
      updated[index] = { ...updated[index], [field]: processedValue };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setKeyMetrics(updated);
  };

  const addIntellectualProperty = () => {
    setIntellectualProperty([
      ...intellectualProperty,
      {
        type: "",
        title: "",
        description: "",
        status: "",
        application_number: "",
      },
    ]);
  };

  const removeIntellectualProperty = (index: number) => {
    setIntellectualProperty(intellectualProperty.filter((_, i) => i !== index));
  };

  const updateIntellectualProperty = (
    index: number,
    field: keyof IntellectualProperty,
    value: string
  ) => {
    const updated = [...intellectualProperty];
    updated[index] = { ...updated[index], [field]: value };
    setIntellectualProperty(updated);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5" />
              <span>Basic Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Startup Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your startup name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="Enter your industry"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter your startup description"
              />
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
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="valuation">Valuation (PHP)</Label>
                <Input
                  id="valuation"
                  type="number"
                  value={valuation}
                  onChange={(e) => setValuation(e.target.value)}
                  placeholder="Enter valuation amount"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateFounded">Date Founded</Label>
                <Input
                  id="dateFounded"
                  type="date"
                  value={dateFounded}
                  onChange={(e) => setDateFounded(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="developmentStage">Development Stage</Label>
                <Select
                  value={developmentStage}
                  onValueChange={setDevelopmentStage}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="productDemoUrl">Product Demo URL</Label>
              <Input
                id="productDemoUrl"
                value={productDemoUrl}
                onChange={(e) => setProductDemoUrl(e.target.value)}
                placeholder="https://demo.yourproduct.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Target Market */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Target Market</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="targetMarket">Target Market</Label>
              <Input
                id="targetMarket"
                value={targetMarket}
                onChange={(e) => setTargetMarket(e.target.value)}
                placeholder="Enter target markets separated by commas"
              />
              <p className="text-sm text-muted-foreground">
                Separate multiple markets with commas (e.g., &quot;SMBs,
                Enterprise, Healthcare&quot;)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Keywords */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Tags className="h-5 w-5" />
              <span>Keywords</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords</Label>
              <Input
                id="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Enter keywords separated by commas"
              />
              <p className="text-sm text-muted-foreground">
                Separate multiple keywords with commas (e.g., &quot;AI, SaaS,
                Fintech&quot;)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Team Members</span>
              </div>
              <Button
                type="button"
                onClick={addTeamMember}
                size="sm"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {teamMembers.map((member, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Team Member {index + 1}</h4>
                  <Button
                    type="button"
                    onClick={() => removeTeamMember(index)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input
                    placeholder="Name"
                    value={member.name}
                    onChange={(e) =>
                      updateTeamMember(index, "name", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Position"
                    value={member.position}
                    onChange={(e) =>
                      updateTeamMember(index, "position", e.target.value)
                    }
                  />
                  <Input
                    placeholder="LinkedIn URL"
                    value={member.linkedin}
                    onChange={(e) =>
                      updateTeamMember(index, "linkedin", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Advisors */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Advisors</span>
              </div>
              <Button
                type="button"
                onClick={addAdvisor}
                size="sm"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Advisor
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {advisors.map((advisor, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Advisor {index + 1}</h4>
                  <Button
                    type="button"
                    onClick={() => removeAdvisor(index)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    placeholder="Name"
                    value={advisor.name}
                    onChange={(e) =>
                      updateAdvisor(index, "name", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Expertise"
                    value={advisor.expertise}
                    onChange={(e) =>
                      updateAdvisor(index, "expertise", e.target.value)
                    }
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    placeholder="Company"
                    value={advisor.company}
                    onChange={(e) =>
                      updateAdvisor(index, "company", e.target.value)
                    }
                  />
                  <Input
                    placeholder="LinkedIn URL"
                    value={advisor.linkedin}
                    onChange={(e) =>
                      updateAdvisor(index, "linkedin", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Key Metrics</span>
              </div>
              <Button
                type="button"
                onClick={addKeyMetric}
                size="sm"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Metric
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {keyMetrics.map((metric, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Metric {index + 1}</h4>
                  <Button
                    type="button"
                    onClick={() => removeKeyMetric(index)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    placeholder="Metric Name"
                    value={metric.name}
                    onChange={(e) =>
                      updateKeyMetric(index, "name", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Value"
                    type="number"
                    value={metric.value}
                    onChange={(a) =>
                      updateKeyMetric(index, "value", a.target.value)
                    }
                  />
                </div>
                <Input
                  placeholder="Description"
                  value={metric.description}
                  onChange={(e) =>
                    updateKeyMetric(index, "description", e.target.value)
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Intellectual Property</span>
              </div>
              <Button
                type="button"
                onClick={addIntellectualProperty}
                size="sm"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add IP
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {intellectualProperty.map((ip, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">IP Asset {index + 1}</h4>
                  <Button
                    type="button"
                    onClick={() => removeIntellectualProperty(index)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input
                    placeholder="Type (e.g., Patent, Trademark)"
                    value={ip.type}
                    onChange={(e) =>
                      updateIntellectualProperty(index, "type", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Title"
                    value={ip.title}
                    onChange={(e) =>
                      updateIntellectualProperty(index, "title", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Status"
                    value={ip.status}
                    onChange={(e) =>
                      updateIntellectualProperty(
                        index,
                        "status",
                        e.target.value
                      )
                    }
                  />
                </div>
                <Input
                  placeholder="Application Number"
                  value={ip.application_number}
                  onChange={(e) =>
                    updateIntellectualProperty(
                      index,
                      "application_number",
                      e.target.value
                    )
                  }
                />
                <textarea
                  className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Description"
                  value={ip.description}
                  onChange={(e) =>
                    updateIntellectualProperty(
                      index,
                      "description",
                      e.target.value
                    )
                  }
                />
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
