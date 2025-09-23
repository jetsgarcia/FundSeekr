import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Linkedin } from "lucide-react";

interface Advisor {
  name?: string | null;
  linkedin?: string | null;
  expertise?: string | null;
  company?: string | null;
}

interface AdvisorsProps {
  advisors: Advisor[];
}

export function Advisors({ advisors }: AdvisorsProps) {
  if (!advisors || advisors.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Advisors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground italic">No advisors listed</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Advisors
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {advisors.map((advisor, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">
                    {advisor.name || "Advisor"}
                  </h4>
                  {advisor.expertise && (
                    <Badge variant="outline" className="mb-2">
                      {advisor.expertise}
                    </Badge>
                  )}
                  {advisor.company && (
                    <p className="text-xs text-muted-foreground">
                      {advisor.company}
                    </p>
                  )}
                </div>
                {advisor.linkedin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="h-8 w-8 p-0"
                  >
                    <a
                      href={advisor.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center"
                    >
                      <Linkedin className="h-4 w-4" />
                      <span className="sr-only">LinkedIn Profile</span>
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
