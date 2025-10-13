"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Users } from "lucide-react";
import {
  getEngagementMetrics,
  type EngagementMetricsData,
} from "@/actions/admin-analytics";

export function EngagementMetrics() {
  const [data, setData] = useState<EngagementMetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await getEngagementMetrics();
        if (isMounted) setData(res);
      } catch (err) {
        console.error(err);
        if (isMounted) setError("Failed to load metrics");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const matches = data?.matchesMade ?? 0;
  const verifiedUsers = data?.verifiedUsersTotal ?? 0;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-balance">Engagement Metrics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Matches Made</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {loading ? "…" : matches.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Verified Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {loading ? "…" : verifiedUsers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total verified</p>
            {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
