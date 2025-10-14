"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Building2, Users, Shield } from "lucide-react";
import {
  getUserOverview,
  type UserOverviewData,
} from "@/actions/admin-overview";

export function UserOverview() {
  const [data, setData] = useState<UserOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await getUserOverview();
        if (isMounted) setData(res);
      } catch (e) {
        console.error(e);
        if (isMounted) setError("Failed to load user overview");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-balance">User Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Angel Investors
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {loading ? "…" : (data?.totalInvestors ?? 0).toLocaleString()}
            </div>
            {error ? (
              <p className="text-xs text-destructive">{error}</p>
            ) : (
              <p className="text-xs text-muted-foreground">From database</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Startups
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {loading ? "…" : (data?.totalStartups ?? 0).toLocaleString()}
            </div>
            {!error && (
              <p className="text-xs text-muted-foreground">From database</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {loading ? "…" : (data?.totalAdmins ?? 0).toLocaleString()}
            </div>
            {!error && (
              <p className="text-xs text-muted-foreground">From database</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              New Signups (30d)
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {loading ? "…" : (data?.newSignups30d ?? 0).toLocaleString()}
            </div>
            {!error && (
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
