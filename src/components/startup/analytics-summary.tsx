"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Users,
  Target,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { useState, useEffect } from "react";

interface AnalyticsSummaryData {
  totalMatches: number;
  weeklyMatches: number;
  videosViewed: number;
  videosSent: number;
  viewRate: number;
  avgResponseTime: string;
  topIndustryInterest: string;
  trends: {
    matchesTrend: "up" | "down" | "stable";
    viewRateTrend: "up" | "down" | "stable";
    percentChange: number;
  };
}

interface StartupAnalyticsSummaryProps {
  startupId: string;
}

export function StartupAnalyticsSummary({
  startupId,
}: StartupAnalyticsSummaryProps) {
  const [summaryData, setSummaryData] = useState<AnalyticsSummaryData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSummaryData() {
      try {
        setLoading(true);
        // This would be replaced with an actual API call
        // For now, using mock data
        const mockData: AnalyticsSummaryData = {
          totalMatches: 24,
          weeklyMatches: 6,
          videosViewed: 7,
          videosSent: 10,
          viewRate: 70,
          avgResponseTime: "2.3 days",
          topIndustryInterest: "FinTech",
          trends: {
            matchesTrend: "up",
            viewRateTrend: "up",
            percentChange: 15,
          },
        };

        setSummaryData(mockData);
      } catch (error) {
        console.error("Failed to fetch summary data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSummaryData();
  }, [startupId]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!summaryData) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">
          Unable to load analytics summary
        </p>
      </div>
    );
  }

  function getTrendIcon(trend: "up" | "down" | "stable") {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case "down":
        return <TrendingDown className="h-3 w-3 text-red-500" />;
      default:
        return <ArrowRight className="h-3 w-3 text-gray-500" />;
    }
  }

  function getTrendColor(trend: "up" | "down" | "stable") {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Performance Overview</h3>
        <Badge variant="outline" className="flex items-center gap-1">
          {getTrendIcon(summaryData.trends.matchesTrend)}
          <span className={getTrendColor(summaryData.trends.matchesTrend)}>
            {summaryData.trends.percentChange > 0 ? "+" : ""}
            {summaryData.trends.percentChange}% this week
          </span>
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
          <Users className="h-6 w-6 text-primary mb-2" />
          <div className="text-2xl font-bold">{summaryData.totalMatches}</div>
          <div className="text-xs text-muted-foreground text-center">
            Total Matches
          </div>
        </div>

        <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
          <Calendar className="h-6 w-6 text-blue-500 mb-2" />
          <div className="text-2xl font-bold">{summaryData.weeklyMatches}</div>
          <div className="text-xs text-muted-foreground text-center">
            This Week
          </div>
        </div>

        <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
          <Eye className="h-6 w-6 text-green-500 mb-2" />
          <div className="text-2xl font-bold">{summaryData.viewRate}%</div>
          <div className="text-xs text-muted-foreground text-center">
            View Rate
          </div>
        </div>

        <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
          <Target className="h-6 w-6 text-purple-500 mb-2" />
          <div className="text-2xl font-bold">
            {summaryData.videosViewed}/{summaryData.videosSent}
          </div>
          <div className="text-xs text-muted-foreground text-center">
            Videos Viewed
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Avg. Response Time</p>
                <p className="text-lg font-bold text-primary">
                  {summaryData.avgResponseTime}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Industry Avg</p>
                <p className="text-sm text-muted-foreground">3.1 days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Top Interest</p>
                <p className="text-lg font-bold text-primary">
                  {summaryData.topIndustryInterest}
                </p>
              </div>
              <Badge variant="secondary">Most Active</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
