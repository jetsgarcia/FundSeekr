"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Send,
  Users,
  TrendingUp,
  Target,
  Play,
  Clock,
  BarChart3,
} from "lucide-react";
import { useState, useEffect } from "react";

interface EngagementData {
  totalMatches: number;
  videoPitches: {
    total: number;
    sent: number;
    viewed: number;
    viewRate: number;
  };
  recentActivity: {
    date: string;
    type: "match" | "video_sent" | "video_viewed";
    investor: string;
    description: string;
  }[];
  monthlyTrends: {
    month: string;
    matches: number;
    videosSent: number;
    videosViewed: number;
  }[];
  topPerformingVideos: {
    id: number;
    title: string;
    viewCount: number;
    sentDate: string;
    duration: number;
  }[];
}

interface StartupEngagementAnalyticsProps {
  startupId: string;
}

export function StartupEngagementAnalytics({
  startupId,
}: StartupEngagementAnalyticsProps) {
  const [engagementData, setEngagementData] = useState<EngagementData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  useEffect(() => {
    async function fetchEngagementData() {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/startups/${startupId}/analytics?range=${timeRange}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch analytics data");
        }

        const data = await response.json();
        setEngagementData(data);
      } catch (error) {
        console.error("Failed to fetch engagement data:", error);
        // Fallback to mock data for development
        const mockData: EngagementData = {
          totalMatches: 24,
          videoPitches: {
            total: 12,
            sent: 10,
            viewed: 7,
            viewRate: 70,
          },
          recentActivity: [
            {
              date: "2025-10-09",
              type: "video_viewed",
              investor: "TechVentures Capital",
              description: "Viewed your product demo video",
            },
            {
              date: "2025-10-08",
              type: "match",
              investor: "Innovation Partners",
              description: "New match based on AI/ML focus",
            },
            {
              date: "2025-10-07",
              type: "video_sent",
              investor: "Growth Equity Fund",
              description: "Sent pitch video: Series A Funding Deck",
            },
            {
              date: "2025-10-06",
              type: "video_viewed",
              investor: "Startup Accelerator",
              description: "Viewed your team introduction video",
            },
          ],
          monthlyTrends: [
            { month: "Aug", matches: 8, videosSent: 4, videosViewed: 2 },
            { month: "Sep", matches: 12, videosSent: 6, videosViewed: 4 },
            { month: "Oct", matches: 24, videosSent: 10, videosViewed: 7 },
          ],
          topPerformingVideos: [
            {
              id: 1,
              title: "Product Demo - AI Analytics Platform",
              viewCount: 5,
              sentDate: "2025-09-15",
              duration: 180,
            },
            {
              id: 2,
              title: "Team Introduction & Vision",
              viewCount: 4,
              sentDate: "2025-09-20",
              duration: 120,
            },
            {
              id: 3,
              title: "Market Opportunity Presentation",
              viewCount: 3,
              sentDate: "2025-10-01",
              duration: 240,
            },
          ],
        };
        setEngagementData(mockData);
      } finally {
        setLoading(false);
      }
    }

    fetchEngagementData();
  }, [startupId, timeRange]);

  function formatDuration(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  function getActivityIcon(type: string) {
    switch (type) {
      case "match":
        return <Target className="h-4 w-4 text-blue-500" />;
      case "video_sent":
        return <Send className="h-4 w-4 text-green-500" />;
      case "video_viewed":
        return <Eye className="h-4 w-4 text-purple-500" />;
      default:
        return <BarChart3 className="h-4 w-4 text-gray-500" />;
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!engagementData) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Unable to load engagement analytics
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Engagement Analytics
          </h2>
          <p className="text-muted-foreground">
            Track your investor interactions and pitch performance
          </p>
        </div>
        <div className="flex gap-2">
          {(["7d", "30d", "90d"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                timeRange === range
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {range === "7d"
                ? "7 Days"
                : range === "30d"
                ? "30 Days"
                : "90 Days"}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {engagementData.totalMatches}
            </div>
            <p className="text-xs text-muted-foreground">
              Investors matched to your profile
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Video Pitches</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {engagementData.videoPitches.sent}
            </div>
            <p className="text-xs text-muted-foreground">
              Sent to {engagementData.videoPitches.sent} investors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">View Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {engagementData.videoPitches.viewRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              {engagementData.videoPitches.viewed} of{" "}
              {engagementData.videoPitches.sent} videos viewed
            </p>
            <Progress
              value={engagementData.videoPitches.viewRate}
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {engagementData.recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
              >
                {getActivityIcon(activity.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm">{activity.investor}</p>
                    <Badge variant="outline" className="text-xs">
                      {activity.type.replace("_", " ")}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Videos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top Performing Videos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {engagementData.topPerformingVideos.map((video, index) => (
              <div
                key={video.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{video.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Duration: {formatDuration(video.duration)} • Sent:{" "}
                      {new Date(video.sentDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    {video.viewCount}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Monthly Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {engagementData.monthlyTrends.map((trend, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{trend.month} 2025</span>
                  <div className="flex gap-4 text-sm">
                    <span className="text-blue-600">
                      {trend.matches} matches
                    </span>
                    <span className="text-green-600">
                      {trend.videosSent} sent
                    </span>
                    <span className="text-purple-600">
                      {trend.videosViewed} viewed
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Progress
                    value={(trend.matches / 30) * 100}
                    className="h-2"
                  />
                  <Progress
                    value={(trend.videosSent / 15) * 100}
                    className="h-2"
                  />
                  <Progress
                    value={(trend.videosViewed / 15) * 100}
                    className="h-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
