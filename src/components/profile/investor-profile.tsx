import {
  Briefcase,
  Building2,
  Calendar,
  DollarSign,
  Globe,
  Linkedin,
  MapPin,
  Phone,
  Target,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { formatCurrencyAbbreviation } from "@/lib/format-number";
import type { investors as InvestorProfile } from "@prisma/client";
import { Prisma } from "@prisma/client";

type NotableExit = Prisma.JsonObject & {
  company?: string;
  exit_amount?: number | string;
  year?: number | string;
};

export function InvestorProfile({ investor }: { investor: InvestorProfile }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2">
      {/* Basic Information */}
      <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader className="bg-secondary/50 rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-primary">
            <Building2 className="h-5 w-5" />
            <span>Organization</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start space-x-3">
            <Briefcase className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Organization</p>
              <p className="font-medium">
                {investor.organization || "Not specified"}
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Users className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Position</p>
              <p className="font-medium">
                {investor.position || "Not specified"}
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">{investor.city || "Not specified"}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Target className="h-4 w-4 mt-1 text-muted-foreground" />
          </div>
          {investor.organization_website && (
            <div className="flex items-start space-x-3">
              <Globe className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Website</p>
                <a
                  href={investor.organization_website}
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

      {/* Investment Details */}
      <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader className="bg-secondary/50 rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-primary">
            <DollarSign className="h-5 w-5" />
            <span>Investment Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="bg-secondary/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Typical Check Size</p>
            <p className="text-2xl font-bold text-primary">
              {investor.typical_check_size_in_php
                ? formatCurrencyAbbreviation(
                    Number(investor.typical_check_size_in_php)
                  )
                : "Not specified"}
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Decision Period</p>
              <p className="font-medium">
                {investor.decision_period_in_weeks || "Not specified"} weeks
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <TrendingUp className="h-4 w-4 mt-1 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Involvement Level</p>
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  investor.involvement_level
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {investor.involvement_level || "Not specified"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader className="bg-secondary/50 rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-primary">
            <Phone className="h-5 w-5" />
            <span>Contact Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {investor.key_contact_person_name && (
            <div className="flex items-start space-x-3">
              <User className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Key Contact</p>
                <p className="font-medium">
                  {investor.key_contact_person_name}
                </p>
              </div>
            </div>
          )}
          {investor.key_contact_number && (
            <div className="flex items-start space-x-3">
              <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{investor.key_contact_number}</p>
              </div>
            </div>
          )}
          {investor.investor_linkedin && (
            <div className="flex items-start space-x-3">
              <Linkedin className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">LinkedIn</p>
                <a
                  href={investor.investor_linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  View Profile
                </a>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preferred Industries */}
      {investor.preferred_industries &&
        investor.preferred_industries.length > 0 && (
          <Card className="lg:col-span-2 shadow-lg border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="bg-secondary/50 rounded-t-lg">
              <CardTitle className="flex items-center space-x-2 text-primary">
                <Target className="h-5 w-5" />
                <span>Preferred Industries</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2">
                {investor.preferred_industries.map(
                  (industry: string, index: number) => (
                    <span
                      key={index}
                      className="bg-secondary px-3 py-2 rounded-full text-sm font-medium shadow-sm border border-border"
                    >
                      {industry}
                    </span>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        )}

      {/* Excluded Industries */}
      {investor.excluded_industries &&
        investor.excluded_industries.length > 0 && (
          <Card className="lg:col-span-1 shadow-lg border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="bg-secondary/50 rounded-t-lg">
              <CardTitle className="flex items-center space-x-2 text-destructive">
                <span>❌</span>
                <span>Excluded Industries</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2">
                {investor.excluded_industries.map(
                  (industry: string, index: number) => (
                    <span
                      key={index}
                      className="bg-secondary px-3 py-2 rounded-full text-sm font-medium shadow-sm border border-border text-destructive/80"
                    >
                      {industry}
                    </span>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        )}

      {/* Funding Stages */}
      {investor.preferred_funding_stages &&
        investor.preferred_funding_stages.length > 0 && (
          <Card className="lg:col-span-3 shadow-lg border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="bg-secondary/50 rounded-t-lg">
              <CardTitle className="flex items-center space-x-2 text-primary">
                <TrendingUp className="h-5 w-5" />
                <span>Preferred Funding Stages</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2">
                {investor.preferred_funding_stages.map(
                  (stage: string, index: number) => (
                    <span
                      key={index}
                      className="bg-secondary px-3 py-2 rounded-full text-sm font-medium shadow-sm border border-border"
                    >
                      {stage}
                    </span>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        )}

      {/* Business Models */}
      <Card className="lg:col-span-2 shadow-lg border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader className="bg-secondary/50 rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-primary">
            <Briefcase className="h-5 w-5" />
            <span>Preferred Business Models</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {investor.preferred_business_models &&
          investor.preferred_business_models.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {investor.preferred_business_models.map(
                (model: string, index: number) => (
                  <span
                    key={index}
                    className="bg-secondary px-3 py-2 rounded-full text-sm font-medium shadow-sm border border-border"
                  >
                    {model}
                  </span>
                )
              )}
            </div>
          ) : (
            <p className="text-muted-foreground italic">
              No specific preferences specified
            </p>
          )}
        </CardContent>
      </Card>

      {/* Geographic Focus */}
      <Card className="lg:col-span-1 shadow-lg border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader className="bg-secondary/50 rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-primary">
            <Globe className="h-5 w-5" />
            <span>Geographic Focus</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {investor.geographic_focus && investor.geographic_focus.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {investor.geographic_focus.map(
                (location: string, index: number) => (
                  <span
                    key={index}
                    className="bg-secondary px-3 py-2 rounded-full text-sm font-medium shadow-sm border border-border"
                  >
                    {location}
                  </span>
                )
              )}
            </div>
          ) : (
            <p className="text-muted-foreground italic">
              No geographic restrictions
            </p>
          )}
        </CardContent>
      </Card>

      {/* Value Proposition */}
      <Card className="lg:col-span-3 shadow-lg border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader className="bg-secondary/50 rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-primary">
            <Target className="h-5 w-5" />
            <span>Value Proposition</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {investor.value_proposition &&
          investor.value_proposition.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {investor.value_proposition.map(
                (value: string, index: number) => (
                  <span
                    key={index}
                    className="bg-secondary px-3 py-2 rounded-full text-sm font-medium shadow-sm border border-border"
                  >
                    {value}
                  </span>
                )
              )}
            </div>
          ) : (
            <p className="text-muted-foreground italic">
              No specific value propositions listed
            </p>
          )}
        </CardContent>
      </Card>

      {/* Portfolio Companies */}
      <Card className="lg:col-span-2 shadow-lg border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader className="bg-secondary/50 rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-primary">
            <Building2 className="h-5 w-5" />
            <span>Portfolio Companies</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {investor.portfolio_companies &&
          investor.portfolio_companies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {investor.portfolio_companies.map(
                (company: string, index: number) => (
                  <div
                    key={index}
                    className="bg-secondary px-4 py-3 rounded-lg text-sm font-medium shadow-sm border border-border flex items-center space-x-2"
                  >
                    <Building2 className="h-4 w-4" />
                    <span>{company}</span>
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="text-muted-foreground italic">
              No portfolio companies listed
            </p>
          )}
        </CardContent>
      </Card>

      {/* Notable Exits */}
      <Card className="lg:col-span-1 shadow-lg border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader className="bg-secondary/50 rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-primary">
            <TrendingUp className="h-5 w-5" />
            <span>Notable Exits</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {investor.notable_exits && investor.notable_exits.length > 0 ? (
            <div className="space-y-3">
              {investor.notable_exits.map((exitValue, index: number) => {
                const exit = exitValue as NotableExit;
                return (
                  <div
                    key={index}
                    className="bg-secondary p-4 rounded-lg shadow-sm border border-border"
                  >
                    <div className="text-sm font-medium">
                      {String(exit.company || "Company")}
                    </div>
                    {exit.exit_amount !== undefined &&
                      exit.exit_amount !== null && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Exit:{" "}
                          {formatCurrencyAbbreviation(Number(exit.exit_amount))}
                        </div>
                      )}
                    {exit.year !== undefined && exit.year !== null && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Year: {String(exit.year)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground italic">
              No notable exits reported
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
