import type {
  startups as StartupProfile,
  funding_requests as FundingRequest,
} from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { formatCurrencyAbbreviation } from "@/lib/format-number";
import {
  Building2,
  Briefcase,
  Target,
  MapPin,
  TrendingUp,
  Calendar,
  Globe,
  DollarSign,
  Users,
  User,
  Linkedin,
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

interface IntellectualProperty {
  type?: string | null;
  title?: string | null;
  description?: string | null;
  status?: string | null;
  application_number?: string | null;
  [key: string]: unknown;
}

export interface ExtendedStartupProfile {
  id: number;
  name: string | null;
  description: string | null;
  valuation: number | null;
  target_market: string[];
  city: string | null;
  date_founded: Date | null;
  industry: string | null;
  website: string | null;
  keywords: string[];
  product_demo_url: string | null;
  development_stage: string | null;
  user_id: string | null;

  // The complex JSON fields with our custom types
  team_members: TeamMember[];
  advisors: Advisor[];
  key_metrics: KeyMetric[];
  intellectual_property: IntellectualProperty[];

  // Related data
  funding_requests?: FundingRequest[];
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
        <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-50/50 dark:from-orange-950/20 dark:to-orange-950/10 rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-orange-700 dark:text-orange-300">
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
          {startup.website && (
            <div className="flex items-start space-x-3">
              <Globe className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Website</p>
                <a
                  href={startup.website}
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

      {/* Valuation */}
      <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-50/50 dark:from-green-950/20 dark:to-green-950/10 rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-green-700 dark:text-green-300">
            <DollarSign className="h-5 w-5" />
            <span>Valuation</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              {startup.valuation
                ? formatCurrencyAbbreviation(startup.valuation)
                : "Not disclosed"}
            </div>
            <p className="text-sm text-muted-foreground">Current Valuation</p>
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      {startup.description && (
        <Card className="lg:col-span-1 shadow-lg border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-50/50 dark:from-purple-950/20 dark:to-purple-950/10 rounded-t-lg">
            <CardTitle className="flex items-center space-x-2 text-purple-700 dark:text-purple-300">
              <span>📝</span>
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
          <CardHeader className="bg-gradient-to-r from-cyan-50 to-cyan-50/50 dark:from-cyan-950/20 dark:to-cyan-950/10 rounded-t-lg">
            <CardTitle className="flex items-center space-x-2 text-cyan-700 dark:text-cyan-300">
              <span>🎥</span>
              <span>Product Demo</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center">
            <Button
              asChild
              className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700"
            >
              <a
                href={startup.product_demo_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>🎬</span>
                View Demo
              </a>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Target Market */}
      {startup.target_market && startup.target_market.length > 0 && (
        <Card className="lg:col-span-2 shadow-lg border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-pink-50 to-pink-50/50 dark:from-pink-950/20 dark:to-pink-950/10 rounded-t-lg">
            <CardTitle className="flex items-center space-x-2 text-pink-700 dark:text-pink-300">
              <Target className="h-5 w-5" />
              <span>Target Market</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              {startup.target_market.map((market: string, index: number) => (
                <span
                  key={index}
                  className="bg-gradient-to-r from-pink-100 to-pink-50 text-pink-700 dark:from-pink-900/20 dark:to-pink-900/10 dark:text-pink-300 px-3 py-2 rounded-full text-sm font-medium shadow-sm border border-pink-200 dark:border-pink-800"
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
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-50/50 dark:from-slate-950/20 dark:to-slate-950/10 rounded-t-lg">
            <CardTitle className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
              <span>🏷️</span>
              <span>Keywords</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              {startup.keywords.map((keyword: string, index: number) => (
                <span
                  key={index}
                  className="bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 dark:from-slate-900/20 dark:to-slate-900/10 dark:text-slate-300 px-3 py-2 rounded-full text-sm font-medium shadow-sm border border-slate-200 dark:border-slate-800"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Members */}
      <Card className="lg:col-span-2 shadow-lg border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-sky-50 to-sky-50/50 dark:from-sky-950/20 dark:to-sky-950/10 rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-sky-700 dark:text-sky-300">
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
                  className="border border-border/50 p-4 rounded-lg bg-gradient-to-r from-sky-50/50 to-sky-50/20 dark:from-sky-950/10 dark:to-sky-950/5"
                >
                  <div className="flex items-start space-x-3">
                    <User className="h-5 w-5 mt-1 text-sky-600 dark:text-sky-400" />
                    <div className="flex-1">
                      <h4 className="font-medium text-sky-700 dark:text-sky-300">
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
        <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-50/50 dark:from-amber-950/20 dark:to-amber-950/10 rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-amber-700 dark:text-amber-300">
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
                  className="bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 dark:from-amber-900/20 dark:to-amber-900/10 dark:text-amber-300 p-3 rounded-lg shadow-sm border border-amber-200 dark:border-amber-800"
                >
                  <div className="font-medium text-sm">
                    {String(advisor.name || "Advisor")}
                  </div>
                  {advisor.expertise !== undefined &&
                    advisor.expertise !== null && (
                      <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                        {String(advisor.expertise)}
                      </div>
                    )}
                  {advisor.company !== undefined &&
                    advisor.company !== null && (
                      <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
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
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-50/50 dark:from-emerald-950/20 dark:to-emerald-950/10 rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-300">
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
                  className="bg-gradient-to-r from-emerald-100 to-emerald-50 dark:from-emerald-900/20 dark:to-emerald-900/10 p-4 rounded-lg shadow-sm border border-emerald-200 dark:border-emerald-800"
                >
                  <div className="text-sm text-emerald-700 dark:text-emerald-300 font-medium mb-1">
                    {String(metric.name || "Metric")}
                  </div>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {String(metric.value || "N/A")}
                  </div>
                  {metric.description !== undefined &&
                    metric.description !== null && (
                      <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
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

      {/* Intellectual Property */}
      <Card className="lg:col-span-3 shadow-lg border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-violet-50 to-violet-50/50 dark:from-violet-950/20 dark:to-violet-950/10 rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-violet-700 dark:text-violet-300">
            <span>🛡️</span>
            <span>Intellectual Property</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {startup.intellectual_property &&
          startup.intellectual_property.length > 0 ? (
            <div className="space-y-4">
              {startup.intellectual_property.map(
                (ip: IntellectualProperty, index: number) => (
                  <div
                    key={index}
                    className="border border-border/50 p-4 rounded-lg bg-gradient-to-r from-violet-50/50 to-violet-50/20 dark:from-violet-950/10 dark:to-violet-950/5"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-violet-700 dark:text-violet-300">
                          {String(ip.type || "IP Asset")}
                        </h4>
                        {ip.title !== undefined && ip.title !== null && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {String(ip.title)}
                          </p>
                        )}
                        {ip.description !== undefined &&
                          ip.description !== null && (
                            <p className="text-sm text-muted-foreground mt-2">
                              {String(ip.description)}
                            </p>
                          )}
                      </div>
                      {ip.status !== undefined && ip.status !== null && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-violet-100 text-violet-700 dark:bg-violet-900/20 dark:text-violet-300">
                          {String(ip.status)}
                        </span>
                      )}
                    </div>
                    {ip.application_number !== undefined &&
                      ip.application_number !== null && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Application: {String(ip.application_number)}
                        </p>
                      )}
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="text-muted-foreground italic">
              No intellectual property registered
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
