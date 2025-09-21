import type { startups as StartupProfile } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Building2,
  Briefcase,
  Target,
  MapPin,
  TrendingUp,
  Calendar,
  Globe,
  Users,
  User,
  Linkedin,
  FileText,
  Video,
  Tag,
  Play,
} from "lucide-react";
import { Button } from "../ui/button";

interface TeamMember {
  name?: string | null;
  position?: string | null;
  bio?: string | null;
  linkedin?: string | null;
  [key: string]: unknown;
}

interface Advisor {
  name?: string | null;
  expertise?: string | null;
  company?: string | null;
  [key: string]: unknown;
}

interface KeyMetric {
  name?: string | null;
  value?: string | null;
  description?: string | null;
  [key: string]: unknown;
}

export interface ExtendedStartupProfile {
  id: string;
  name: string | null;
  description: string | null;
  target_market: string[];
  city: string | null;
  date_founded: Date | null;
  industry: string | null;
  website_url: string | null;
  keywords: string[];
  product_demo_url: string | null;
  development_stage: string | null;
  user_id: string | null;

  // The complex JSON fields with our custom types
  team_members: TeamMember[];
  advisors: Advisor[];
  key_metrics: KeyMetric[];
}

export function StartupProfile({
  startup,
}: {
  startup: ExtendedStartupProfile;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2">
      {/* Company Information */}
      <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader className="bg-secondary/50 rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-primary">
            <Building2 className="h-5 w-5" />
            <span>Company Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start space-x-3">
            <Briefcase className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Company Name</p>
              <p className="font-medium">{startup.name || "Not specified"}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Target className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Industry</p>
              <p className="font-medium">
                {startup.industry || "Not specified"}
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">{startup.city || "Not specified"}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <TrendingUp className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Development Stage</p>
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  startup.development_stage
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {startup.development_stage || "Not specified"}
              </span>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Founded</p>
              <p className="font-medium">
                {startup.date_founded
                  ? new Date(startup.date_founded).toLocaleDateString()
                  : "Not specified"}
              </p>
            </div>
          </div>
          {startup.website_url && (
            <div className="flex items-start space-x-3">
              <Globe className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Website</p>
                <a
                  href={startup.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Visit Website
                </a>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Description */}
      {startup.description && (
        <Card className="lg:col-span-1 shadow-lg border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="bg-secondary/50 rounded-t-lg">
            <CardTitle className="flex items-center space-x-2 text-primary">
              <FileText className="h-5 w-5" />
              <span>Description</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-muted-foreground leading-relaxed">
              {startup.description}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Product Demo */}
      {startup.product_demo_url && (
        <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="bg-secondary/50 rounded-t-lg">
            <CardTitle className="flex items-center space-x-2 text-primary">
              <Video className="h-5 w-5" />
              <span>Product Demo</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center">
            <Button asChild>
              <a
                href={startup.product_demo_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Play className="h-4 w-4 mr-2" />
                View Demo
              </a>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Target Market */}
      {startup.target_market && startup.target_market.length > 0 && (
        <Card className="lg:col-span-2 shadow-lg border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="bg-secondary/50 rounded-t-lg">
            <CardTitle className="flex items-center space-x-2 text-primary">
              <Target className="h-5 w-5" />
              <span>Target Market</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              {startup.target_market.map((market: string, index: number) => (
                <span
                  key={index}
                  className="bg-secondary px-3 py-2 rounded-full text-sm font-medium shadow-sm border border-border"
                >
                  {market}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Keywords */}
      {startup.keywords && startup.keywords.length > 0 && (
        <Card className="lg:col-span-1 shadow-lg border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="bg-secondary/50 rounded-t-lg">
            <CardTitle className="flex items-center space-x-2 text-primary">
              <Tag className="h-5 w-5" />
              <span>Keywords</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              {startup.keywords.map((keyword: string, index: number) => (
                <span
                  key={index}
                  className="bg-secondary px-3 py-2 rounded-full text-sm font-medium shadow-sm border border-border"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Members */}
      <Card className="lg:col-span-1 shadow-lg border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader className="bg-secondary/50 rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-primary">
            <Users className="h-5 w-5" />
            <span>Team Members</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {startup.team_members && startup.team_members.length > 0 ? (
            <div className="space-y-4">
              {startup.team_members.map((member: TeamMember, index: number) => (
                <div
                  key={index}
                  className="border border-border p-4 rounded-lg bg-secondary/50"
                >
                  <div className="flex items-start space-x-3">
                    <User className="h-5 w-5 mt-1 text-muted-foreground" />
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {String(member.name || "Team Member")}
                      </h4>
                      {member.position !== undefined &&
                        member.position !== null && (
                          <p className="text-sm text-muted-foreground">
                            {String(member.position)}
                          </p>
                        )}
                      {member.bio !== undefined && member.bio !== null && (
                        <p className="text-sm mt-2 text-muted-foreground">
                          {String(member.bio)}
                        </p>
                      )}
                      {member.linkedin !== undefined &&
                        member.linkedin !== null && (
                          <a
                            href={String(member.linkedin)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-xs text-primary hover:text-primary/80 mt-2"
                          >
                            <Linkedin className="h-3 w-3" />
                            <span>LinkedIn</span>
                          </a>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground italic">
              No team members listed
            </p>
          )}
        </CardContent>
      </Card>

      {/* Advisors */}
      <Card className="lg:col-span-1 shadow-lg border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader className="bg-secondary/50 rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-primary">
            <Target className="h-5 w-5" />
            <span>Advisors</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {startup.advisors && startup.advisors.length > 0 ? (
            <div className="space-y-3">
              {startup.advisors.map((advisor: Advisor, index: number) => (
                <div
                  key={index}
                  className="bg-secondary p-3 rounded-lg shadow-sm border border-border"
                >
                  <div className="font-medium text-sm">
                    {String(advisor.name || "Advisor")}
                  </div>
                  {advisor.expertise !== undefined &&
                    advisor.expertise !== null && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {String(advisor.expertise)}
                      </div>
                    )}
                  {advisor.company !== undefined &&
                    advisor.company !== null && (
                      <div className="text-xs text-muted-foreground mt-1">
                        @ {String(advisor.company)}
                      </div>
                    )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground italic">No advisors listed</p>
          )}
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Card className="lg:col-span-3 shadow-lg border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader className="bg-secondary/50 rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-primary">
            <TrendingUp className="h-5 w-5" />
            <span>Key Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {startup.key_metrics && startup.key_metrics.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {startup.key_metrics.map((metric: KeyMetric, index: number) => (
                <div
                  key={index}
                  className="bg-secondary p-4 rounded-lg shadow-sm border border-border"
                >
                  <div className="text-sm font-medium mb-1">
                    {String(metric.name || "Metric")}
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {String(metric.value || "N/A")}
                  </div>
                  {metric.description !== undefined &&
                    metric.description !== null && (
                      <div className="text-xs text-muted-foreground mt-2">
                        {String(metric.description)}
                      </div>
                    )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground italic">
              No key metrics reported
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
