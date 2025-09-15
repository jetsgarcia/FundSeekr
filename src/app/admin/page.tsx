"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Moon, Sun } from "lucide-react";
import { UserOverview } from "@/components/admin/UserOverview";
import { StartupVerification } from "@/components/admin/StartupVerification";
import { InvestorVerification } from "@/components/admin/InvestorVerification";
import { EngagementMetrics } from "@/components/admin/EngagementMetrics";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isDark, setIsDark] = useState(false);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="flex h-16 items-center justify-between px-20">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <Image
              src="/fundseekr_logo.png"
              alt="FundSeekr Logo"
              width={30}
              height={30}
              className="rounded"
              priority
            />
            <h1 className="text-xl font-semibold text-balance">
              FundSeekr Admin
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-fit grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="verification">Verification</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={toggleDarkMode}>
                {isDark ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
              <div className="h-8 w-8 rounded-full bg-primary" />
            </div>
          </div>
        </div>
      </header>

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
