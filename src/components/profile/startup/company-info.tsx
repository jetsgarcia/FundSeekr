import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Briefcase,
  Target,
  MapPin,
  TrendingUp,
  Calendar,
  Globe,
} from "lucide-react";

interface CompanyInfoProps {
  name: string | null;
  industry: string | null;
  city: string | null;
  development_stage: string | null;
  business_structure: string | null;
  date_founded: Date | null;
  website_url: string | null;
}

export function CompanyInfo({
  name,
  industry,
  city,
  development_stage,
  business_structure,
  date_founded,
  website_url,
}: CompanyInfoProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return "Not specified";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Company Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Briefcase className="h-4 w-4" />
            Company Name
          </div>
          <p className="font-medium text-foreground">
            {name || "Not specified"}
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Target className="h-4 w-4" />
            Industry
          </div>
          <p className="font-medium text-foreground">
            {industry || "Not specified"}
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            Location
          </div>
          <p className="font-medium text-foreground">
            {city || "Not specified"}
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            Development Stage
          </div>
          <Badge variant={development_stage ? "default" : "secondary"}>
            {development_stage || "Not specified"}
          </Badge>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4" />
            Business Structure
          </div>
          <Badge variant={business_structure ? "outline" : "secondary"}>
            {business_structure || "Not specified"}
          </Badge>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Founded
          </div>
          <p className="font-medium text-foreground">
            {formatDate(date_founded)}
          </p>
        </div>

        {website_url && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe className="h-4 w-4" />
              Website
            </div>
            <a
              href={website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Visit Website
              <Globe className="h-3 w-3" />
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
