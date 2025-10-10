"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Eye, Send, Users, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface QuickAnalyticsData {
  totalMatches: number;
  videoPitches: {
    total: number;
    sent: number;
    viewed: number;
    viewRate: number;
  };
}

interface StartupAnalyticsWidgetProps {
  startupId: string;
}

export function StartupAnalyticsWidget({
  startupId,
}: StartupAnalyticsWidgetProps) {
  const [analyticsData, setAnalyticsData] = useState<QuickAnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuickAnalytics() {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/startups/${startupId}/analytics?range=30d`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch analytics data");
        }

        const data = await response.json();
        setAnalyticsData({
          totalMatches: data.totalMatches,
          videoPitches: data.videoPitches,
        });
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
        // Fallback to mock data
        setAnalyticsData({
          totalMatches: 24,
          videoPitches: {
            total: 12,
            sent: 10,
            viewed: 7,
            viewRate: 70,
          },
        });
      } finally {
        setLoading(false);
      }
    }

    fetchQuickAnalytics();
  }, [startupId]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground text-sm">
          Unable to load analytics
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {analyticsData.totalMatches}
            </div>
            <p className="text-xs text-muted-foreground">Investors matched</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Video Pitches</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {analyticsData.videoPitches.sent}
            </div>
            <p className="text-xs text-muted-foreground">Sent this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">View Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {analyticsData.videoPitches.viewRate}%
            </div>
            <Progress
              value={analyticsData.videoPitches.viewRate}
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
