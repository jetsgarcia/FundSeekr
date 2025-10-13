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
  Tags,
  Video,
} from "lucide-react";
import type { ExtendedStartupProfile } from "@/components/profile/startup-profile";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { VideoManagement } from "@/components/profile/startup/video-management";
import Image from "next/image";
import { replaceStartupDocument } from "@/actions/profile";

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

  const [name, setName] = useState<string>(startup.name || "");
  const [description, setDescription] = useState<string>(
    startup.description || ""
  );
  const [industry, setIndustry] = useState<string>(startup.industry || "");
  const [city, setCity] = useState<string>(startup.city || "");
  const [website, setWebsite] = useState<string>(startup.website_url || "");
  const [dateFounded, setDateFounded] = useState<string>(
    startup.date_founded
      ? new Date(startup.date_founded).toISOString().slice(0, 10)
      : ""
  );
  const [developmentStage, setDevelopmentStage] = useState<string>(
    startup.development_stage || ""
  );
  const [productDemoUrl, setProductDemoUrl] = useState<string>(
    startup.product_demo_url || ""
  );
  const [targetMarket, setTargetMarket] = useState<string>(
    (startup.target_market || []).join(", ")
  );
  const [keywords, setKeywords] = useState<string>(
    (startup.keywords || []).join(", ")
  );

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(
    (startup.team_members || []).map((m) => ({
      name: String(m?.name || ""),
      position: String(m?.position || ""),
      linkedin: String(m?.linkedin || ""),
    }))
  );

  const [advisors, setAdvisors] = useState<Advisor[]>(
    (startup.advisors || []).map((a) => ({
      name: String(a?.name || ""),
      expertise: String(a?.expertise || ""),
      company: String(a?.company || ""),
      linkedin: String(a?.linkedin || ""),
    }))
  );

  const [keyMetrics, setKeyMetrics] = useState<KeyMetric[]>(
    (startup.key_metrics || []).map((k) => ({
      name: String(k?.name || k?.metric_name || ""),
      value: String(k?.value ?? ""),
      description: String(k?.description || ""),
    }))
  );

  function addTeamMember() {
    setTeamMembers([...teamMembers, { name: "", position: "", linkedin: "" }]);
  }

  function removeTeamMember(index: number) {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  }

  function updateTeamMember(
    index: number,
    field: keyof TeamMember,
    value: string
  ) {
    const updated = [...teamMembers];
    updated[index] = { ...updated[index], [field]: value } as TeamMember;
    setTeamMembers(updated);
  }

  function addAdvisor() {
    setAdvisors([
      ...advisors,
      { name: "", expertise: "", company: "", linkedin: "" },
    ]);
  }

  function removeAdvisor(index: number) {
    setAdvisors(advisors.filter((_, i) => i !== index));
  }

  function updateAdvisor(index: number, field: keyof Advisor, value: string) {
    const updated = [...advisors];
    updated[index] = { ...updated[index], [field]: value } as Advisor;
    setAdvisors(updated);
  }

  function addKeyMetric() {
    setKeyMetrics([...keyMetrics, { name: "", value: "", description: "" }]);
  }

  function removeKeyMetric(index: number) {
    setKeyMetrics(keyMetrics.filter((_, i) => i !== index));
  }

  function updateKeyMetric(
    index: number,
    field: keyof KeyMetric,
    value: string
  ) {
    const updated = [...keyMetrics];
    if (field === "value") {
      const numericValue = value.replace(/[^0-9.]/g, "");
      const parts = numericValue.split(".");
      const processed =
        parts.length > 2
          ? parts[0] + "." + parts.slice(1).join("")
          : numericValue;
      updated[index] = { ...updated[index], [field]: processed } as KeyMetric;
    } else {
      updated[index] = { ...updated[index], [field]: value } as KeyMetric;
    }
    setKeyMetrics(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!onSave) {
      toast.error("No save function provided");
      return;
    }

    startTransition(async () => {
      try {
        const payload = {
          name,
          description,
          industry,
          city,
          website,
          date_founded: dateFounded ? new Date(dateFounded) : null,
          product_demo_url: productDemoUrl,
          development_stage: developmentStage || null,
          target_market: targetMarket
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          keywords: keywords
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          team_members: teamMembers,
          advisors,
          key_metrics: keyMetrics.map((k) => ({
            metric_name: k.name,
            value: k.value,
            description: k.description,
          })),
        } as Record<string, unknown>;

        const result = await onSave(payload);
        if (result.ok) {
          toast.success("Profile updated successfully!");
          router.push("/profile");
        } else {
          toast.error(
            result.error || "Failed to update profile. Please try again."
          );
        }
      } catch (err) {
        console.error("Error saving startup profile:", err);
        toast.error("Failed to update profile. Please try again.");
      }
    });
  }

  function VerificationUploads() {
    async function handleReplace(
      docType: "validId" | "birCor" | "proofOfBank",
      fd: FormData
    ) {
      const file = fd.get("file") as File | null;
      if (!file) {
        toast.error("Please choose a file");
        return;
      }
      fd.set("docType", docType);
      const res = await replaceStartupDocument(fd);
      if (res.ok) {
        toast.success("Document updated");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update document");
      }
    }

    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span>Verification Documents</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="aspect-video relative overflow-hidden rounded-md border bg-muted">
                {startup.govt_id_image_url ? (
                  <Image
                    src={startup.govt_id_image_url}
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
                action={async (fd: FormData) => handleReplace("validId", fd)}
                className="space-y-2"
              >
                <Input
                  id="startup-id-file"
                  name="file"
                  type="file"
                  accept="image/*"
                />
                <Button type="submit" size="sm" variant="outline">
                  Replace ID
                </Button>
              </form>
            </div>

            <div className="space-y-3">
              <div className="aspect-video relative overflow-hidden rounded-md border bg-muted">
                {startup.bir_cor_image_url ? (
                  <Image
                    src={startup.bir_cor_image_url}
                    alt="BIR/COR"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                    No BIR/COR uploaded
                  </div>
                )}
              </div>
              <form
                action={async (fd: FormData) => handleReplace("birCor", fd)}
                className="space-y-2"
              >
                <Input
                  id="startup-bir-file"
                  name="file"
                  type="file"
                  accept="image/*"
                />
                <Button type="submit" size="sm" variant="outline">
                  Replace BIR/COR
                </Button>
              </form>
            </div>

            <div className="space-y-3">
              <div className="aspect-video relative overflow-hidden rounded-md border bg-muted">
                {startup.proof_of_bank_image_url ? (
                  <Image
                    src={startup.proof_of_bank_image_url}
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
                action={async (fd: FormData) =>
                  handleReplace("proofOfBank", fd)
                }
                className="space-y-2"
              >
                <Input
                  id="startup-bank-file"
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
    );
  }

  return (
    <div className="space-y-6">
      <VerificationUploads />

      <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    onChange={(e) =>
                      updateKeyMetric(index, "value", e.target.value)
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

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Video className="h-5 w-5" />
              <span>Video Pitches</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <VideoManagement startupId={startup.id} />
          </CardContent>
        </Card>

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
