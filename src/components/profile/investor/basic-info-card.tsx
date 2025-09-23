import { Building2, Briefcase, Users, MapPin, Hash, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import type { investors as InvestorProfile } from "@prisma/client";

interface BasicInfoCardProps {
  investor: InvestorProfile;
}

export function BasicInfoCard({ investor }: BasicInfoCardProps) {
  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-secondary/50 rounded-t-lg border-b border-border/50">
        <CardTitle className="flex items-center space-x-2 text-primary">
          <Building2 className="h-5 w-5" />
          <span>Organization Details</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start space-x-3 group">
          <Briefcase className="h-4 w-4 mt-1 text-muted-foreground group-hover:text-primary transition-colors" />
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Organization
            </p>
            <p className="font-semibold text-foreground">
              {investor.organization || "Not specified"}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 group">
          <Users className="h-4 w-4 mt-1 text-muted-foreground group-hover:text-primary transition-colors" />
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Position
            </p>
            <p className="font-semibold text-foreground">
              {investor.position || "Not specified"}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 group">
          <MapPin className="h-4 w-4 mt-1 text-muted-foreground group-hover:text-primary transition-colors" />
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Location
            </p>
            <p className="font-semibold text-foreground">
              {investor.city || "Not specified"}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 group">
          <Hash className="h-4 w-4 mt-1 text-muted-foreground group-hover:text-primary transition-colors" />
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              TIN
            </p>
            <p className="font-semibold text-foreground">
              {investor.tin || "Not specified"}
            </p>
          </div>
        </div>

        {investor.organization_website && (
          <div className="flex items-start space-x-3 group">
            <Globe className="h-4 w-4 mt-1 text-muted-foreground group-hover:text-primary transition-colors" />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Website
              </p>
              <a
                href={investor.organization_website}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:text-primary/80 transition-colors inline-flex items-center space-x-1"
              >
                <span>Visit Website</span>
                <Globe className="h-3 w-3" />
              </a>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
