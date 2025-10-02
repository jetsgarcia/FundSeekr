"use client";

import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { UserOverview } from "@/components/admin/UserOverview";
import { StartupVerification } from "@/components/admin/StartupVerification";
import { InvestorVerification } from "@/components/admin/InvestorVerification";
import { EngagementMetrics } from "@/components/admin/EngagementMetrics";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      <main className="px-20 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="overview" className="space-y-6">
            <UserOverview />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StartupVerification />
              <InvestorVerification />
            </div>

            <EngagementMetrics />
          </TabsContent>

          <TabsContent value="verification" className="space-y-6">
            {/* Verification tab content - currently blank */}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
