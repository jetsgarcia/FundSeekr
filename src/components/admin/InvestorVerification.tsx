"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import {
  getInvestorVerificationStats,
  type VerificationStats,
} from "@/actions/admin-verification";

export function InvestorVerification() {
  const [stats, setStats] = useState<VerificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getInvestorVerificationStats();
        if (mounted) setStats(data);
      } catch (e) {
        console.error(e);
        if (mounted) setError("Failed to load investor verification stats");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-balance">Investor Verification</h2>
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Verified Investors
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {loading ? "…" : (stats?.verified ?? 0).toLocaleString()}
            </div>
            <Progress value={stats?.verifiedPct ?? 0} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {loading ? "" : `${stats?.verifiedPct ?? 0}% of total investors`}
            </p>
            {error && <p className="text-xs text-destructive mt-1">{error}</p>}
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {loading ? "…" : (stats?.rejected ?? 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">
                {loading ? "…" : (stats?.pending ?? 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
