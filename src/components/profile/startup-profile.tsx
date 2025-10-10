"use client";

import type { startups as StartupProfile } from "@prisma/client";
import { useState } from "react";
import { CompanyInfo } from "./startup/company-info";
import { KeyMetrics } from "./startup/key-metrics";
import { TeamMembers } from "./startup/team-members";
import { Advisors } from "./startup/advisors";
import { Documents } from "./startup/documents";
import { MarketAndKeywords } from "./startup/market-and-keywords";
import { DescriptionAndDemo } from "./startup/description-and-demo";
import { VerificationDocuments } from "./startup/verification-documents";
import { VideoDisplay } from "./startup/video-display";
import { StartupEngagementAnalytics } from "../startup/engagement-analytics";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, User, BarChart3 } from "lucide-react";
import Link from "next/link";
import { changeCurrentStartupClient } from "@/actions/client-profile";
import { toast } from "sonner";

interface TeamMember {
  name?: string | null;
  position?: string | null;
  linkedin?: string | null;
}

interface Advisor {
  name?: string | null;
  expertise?: string | null;
  company?: string | null;
  linkedin?: string | null;
}

interface KeyMetric {
  name?: string | null;
  value?: string | null;
  description?: string | null;
  [key: string]: unknown; // Allow for flexible key-value structure
}

interface Document {
  link?: string | null;
  type?: string | null;
  title?: string | null;
}

export interface ExtendedStartupProfile {
  id: string;
  name: string | null;
  description: string | null;
  target_market: string[];
  city: string | null;
  date_founded: Date | null;
  industry: string | null;
  website_url: string | null;
  keywords: string[];
  product_demo_url: string | null;
  development_stage: string | null;
  user_id: string | null;
  govt_id_image_url: string;
  bir_cor_image_url: string;
  proof_of_bank_image_url: string | null;
  business_structure: string | null;
  documents: Document[];
  team_members: TeamMember[];
  advisors: Advisor[];
  key_metrics: KeyMetric[];
}

export function StartupProfile({
  startup,
  startups,
  initialStartupId,
}: {
  startup?: ExtendedStartupProfile;
  startups?: ExtendedStartupProfile[];
  initialStartupId?: string;
}) {
  // Handle backward compatibility - if startup is provided, convert to array
  const startupsArray = startups || (startup ? [startup] : []);

  const [selectedStartupId, setSelectedStartupId] = useState<string>(
    initialStartupId || startupsArray[0]?.id || ""
  );

  const selectedStartup =
    startupsArray.find((s) => s.id === selectedStartupId) || startupsArray[0];

  // Handler for when startup selection changes
  async function handleStartupChange(newStartupId: string) {
    try {
      // Update local state immediately for UI responsiveness
      setSelectedStartupId(newStartupId);

      // Update server metadata to persist the selection
      const result = await changeCurrentStartupClient(newStartupId);

      if (!result.ok) {
        // If server update fails, show error but keep the UI updated
        toast.error("Failed to save profile selection. Please try again.");
        console.error("Failed to update current startup:", result.error);
      } else {
        toast.success("Startup profile updated successfully!");
      }
    } catch (error) {
      console.error("Error changing startup profile:", error);
      toast.error("Failed to save profile selection. Please try again.");
    }
  }

  if (!selectedStartup) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-muted-foreground">
          No startup profiles found.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Startup Profile Selector and Add Button */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {startupsArray.length > 1 && (
              <>
                <label htmlFor="startup-select" className="text-sm font-medium">
                  Select Startup Profile:
                </label>
                <Select
                  value={selectedStartupId}
                  onValueChange={handleStartupChange}
                >
                  <SelectTrigger className="w-[300px]" id="startup-select">
                    <SelectValue placeholder="Select a startup profile" />
                  </SelectTrigger>
                  <SelectContent>
                    {startupsArray.map((startup) => (
                      <SelectItem key={startup.id} value={startup.id}>
                        {startup.name || `Startup ${startup.id.slice(0, 8)}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
            {startupsArray.length === 1 && (
              <h2 className="text-lg font-semibold">
                {selectedStartup.name || "Startup Profile"}
              </h2>
            )}
          </div>

          {/* Add New Startup Profile Button */}
          <Link href="/profile/startup/new">
            <Button variant="outline" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Startup
            </Button>
          </Link>
        </div>
      </div>

      {/* Highlighted Verification Documents Section */}
      <div className="mb-8 p-6 border-2 border-primary/20 rounded-lg bg-primary/5 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <h2 className="text-xl font-semibold text-primary">
            Verification Documents
          </h2>
        </div>
        <VerificationDocuments
          govt_id_image_url={selectedStartup.govt_id_image_url}
          bir_cor_image_url={selectedStartup.bir_cor_image_url}
          proof_of_bank_image_url={selectedStartup.proof_of_bank_image_url}
        />
      </div>

      {/* Main Content with Tabs */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile Information
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Engagement Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-1 space-y-6">
              <CompanyInfo
                name={selectedStartup.name}
                industry={selectedStartup.industry}
                city={selectedStartup.city}
                development_stage={selectedStartup.development_stage}
                business_structure={selectedStartup.business_structure}
                date_founded={selectedStartup.date_founded}
                website_url={selectedStartup.website_url}
              />

              <TeamMembers members={selectedStartup.team_members} />
            </div>

            {/* Middle Column */}
            <div className="lg:col-span-1 space-y-6">
              <DescriptionAndDemo
                description={selectedStartup.description}
                product_demo_url={selectedStartup.product_demo_url}
              />

              <Advisors advisors={selectedStartup.advisors} />

              <KeyMetrics metrics={selectedStartup.key_metrics} />
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1 space-y-6">
              <MarketAndKeywords
                target_market={selectedStartup.target_market}
                keywords={selectedStartup.keywords}
              />

              <Documents documents={selectedStartup.documents} />

              <VideoDisplay startupId={selectedStartup.id} isOwner={true} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <StartupEngagementAnalytics startupId={selectedStartup.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
