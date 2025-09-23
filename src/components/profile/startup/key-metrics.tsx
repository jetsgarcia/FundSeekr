import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface KeyMetric {
  name?: string | null;
  value?: string | null;
  description?: string | null;
  [key: string]: unknown; // Allow for flexible key-value structure
}

interface KeyMetricsProps {
  metrics: KeyMetric[];
}

export function KeyMetrics({ metrics }: KeyMetricsProps) {
  if (!metrics || metrics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Key Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground italic">
            No key metrics reported
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Key Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric, index) => {
            // Check if it's the structured format (name, value, description)
            if (metric.name || metric.value) {
              return (
                <div
                  key={index}
                  className="p-4 rounded-lg border bg-muted/50 hover:bg-muted/80 transition-colors"
                >
                  <div className="text-sm font-medium text-muted-foreground capitalize mb-1">
                    {metric.name || "Metric"}
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {metric.value ?? "N/A"}
                  </div>
                  {metric.description && (
                    <div className="text-xs text-muted-foreground mt-2">
                      {metric.description}
                    </div>
                  )}
                </div>
              );
            }

            // Otherwise, assume it's key-value pairs format
            const entries = Object.entries(metric).filter(
              ([key]) => !["name", "value", "description"].includes(key)
            );

            if (entries.length === 0) return null;

            const [key, value] = entries[0];

            return (
              <div
                key={index}
                className="p-4 rounded-lg border bg-muted/50 hover:bg-muted/80 transition-colors"
              >
                <div className="text-sm font-medium text-muted-foreground capitalize mb-1">
                  {key.replace(/_/g, " ")}
                </div>
                <div className="text-2xl font-bold text-primary">
                  {String(value ?? "N/A")}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
