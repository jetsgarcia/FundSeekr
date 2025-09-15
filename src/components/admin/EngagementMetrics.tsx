import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Users } from "lucide-react";

export function EngagementMetrics() {
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
            <div className="text-2xl font-bold text-primary">206</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">1,089</div>
            <p className="text-xs text-muted-foreground">Daily active</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
