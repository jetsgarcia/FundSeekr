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
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-50/50 dark:from-blue-950/20 dark:to-blue-950/10 rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
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
            <div>
              <p className="text-sm text-muted-foreground">Investor Type</p>
              <p className="font-medium">
                {investor.investor_type?.replace(/_/g, " ") || "Not specified"}
              </p>
            </div>
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
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-50/50 dark:from-green-950/20 dark:to-green-950/10 rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-green-700 dark:text-green-300">
            <DollarSign className="h-5 w-5" />
            <span>Investment Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-green-50/50 dark:from-green-950/10 dark:to-green-950/5 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Typical Check Size</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
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
        <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-50/50 dark:from-purple-950/20 dark:to-purple-950/10 rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-purple-700 dark:text-purple-300">
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
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-50/50 dark:from-emerald-950/20 dark:to-emerald-950/10 rounded-t-lg">
              <CardTitle className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-300">
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
                      className="bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 dark:from-emerald-900/20 dark:to-emerald-900/10 dark:text-emerald-300 px-3 py-2 rounded-full text-sm font-medium shadow-sm border border-emerald-200 dark:border-emerald-800"
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
            <CardHeader className="bg-gradient-to-r from-red-50 to-red-50/50 dark:from-red-950/20 dark:to-red-950/10 rounded-t-lg">
              <CardTitle className="flex items-center space-x-2 text-red-700 dark:text-red-300">
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
                      className="bg-gradient-to-r from-red-100 to-red-50 text-red-700 dark:from-red-900/20 dark:to-red-900/10 dark:text-red-300 px-3 py-2 rounded-full text-sm font-medium shadow-sm border border-red-200 dark:border-red-800"
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
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-50/50 dark:from-blue-950/20 dark:to-blue-950/10 rounded-t-lg">
              <CardTitle className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
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
                      className="bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 dark:from-blue-900/20 dark:to-blue-900/10 dark:text-blue-300 px-3 py-2 rounded-full text-sm font-medium shadow-sm border border-blue-200 dark:border-blue-800"
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
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-50/50 dark:from-indigo-950/20 dark:to-indigo-950/10 rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-indigo-700 dark:text-indigo-300">
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
                    className="bg-gradient-to-r from-indigo-100 to-indigo-50 text-indigo-700 dark:from-indigo-900/20 dark:to-indigo-900/10 dark:text-indigo-300 px-3 py-2 rounded-full text-sm font-medium shadow-sm border border-indigo-200 dark:border-indigo-800"
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
        <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-50/50 dark:from-amber-950/20 dark:to-amber-950/10 rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-amber-700 dark:text-amber-300">
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
                    className="bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 dark:from-amber-900/20 dark:to-amber-900/10 dark:text-amber-300 px-3 py-2 rounded-full text-sm font-medium shadow-sm border border-amber-200 dark:border-amber-800"
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
        <CardHeader className="bg-gradient-to-r from-teal-50 to-teal-50/50 dark:from-teal-950/20 dark:to-teal-950/10 rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-teal-700 dark:text-teal-300">
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
                    className="bg-gradient-to-r from-teal-100 to-teal-50 text-teal-700 dark:from-teal-900/20 dark:to-teal-900/10 dark:text-teal-300 px-3 py-2 rounded-full text-sm font-medium shadow-sm border border-teal-200 dark:border-teal-800"
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
        <CardHeader className="bg-gradient-to-r from-rose-50 to-rose-50/50 dark:from-rose-950/20 dark:to-rose-950/10 rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-rose-700 dark:text-rose-300">
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
                    className="bg-gradient-to-r from-rose-100 to-rose-50 text-rose-700 dark:from-rose-900/20 dark:to-rose-900/10 dark:text-rose-300 px-4 py-3 rounded-lg text-sm font-medium shadow-sm border border-rose-200 dark:border-rose-800 flex items-center space-x-2"
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
        <CardHeader className="bg-gradient-to-r from-violet-50 to-violet-50/50 dark:from-violet-950/20 dark:to-violet-950/10 rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-violet-700 dark:text-violet-300">
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
                    className="bg-gradient-to-r from-violet-100 to-violet-50 text-violet-700 dark:from-violet-900/20 dark:to-violet-900/10 dark:text-violet-300 p-4 rounded-lg shadow-sm border border-violet-200 dark:border-violet-800"
                  >
                    <div className="text-sm font-medium">
                      {String(exit.company || "Company")}
                    </div>
                    {exit.exit_amount !== undefined &&
                      exit.exit_amount !== null && (
                        <div className="text-xs text-violet-600 dark:text-violet-400 mt-1">
                          Exit:{" "}
                          {formatCurrencyAbbreviation(Number(exit.exit_amount))}
                        </div>
                      )}
                    {exit.year !== undefined && exit.year !== null && (
                      <div className="text-xs text-violet-600 dark:text-violet-400 mt-1">
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
