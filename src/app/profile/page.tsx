"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Building2,
  MapPin,
  Globe,
  Phone,
  Linkedin,
  Edit3,
  DollarSign,
  Calendar,
  Target,
  TrendingUp,
  Briefcase,
  Users,
  Mail,
} from "lucide-react";
import { formatCurrencyAbbreviation } from "@/lib/format-number";

interface UserSync {
  id: string;
  name?: string;
  email?: string;
  created_at?: string;
}

interface FundingRequest {
  funding_request_id: number;
  funding_stage?: string;
  amount_sought?: number;
  use_of_funds?: string;
  decision_timeline?: number;
  is_open: boolean;
}

interface InvestorProfile {
  id: number;
  organization?: string;
  position?: string;
  city?: string;
  organization_website?: string;
  investor_linkedin?: string;
  decision_period_in_weeks?: number;
  typical_check_size_in_php?: number;
  investor_type?: string;
  preferred_industries: string[];
  excluded_industries: string[];
  preferred_business_models: string[];
  preferred_funding_stages: string[];
  geographic_focus: string[];
  value_proposition: string[];
  involvement_level?: string;
  portfolio_companies: string[];
  notable_exits: Record<string, unknown>[];
  key_contact_person_name?: string;
  key_contact_linkedin?: string;
  key_contact_number?: string;
  user_id?: string;
  users_sync?: UserSync;
}

interface StartupProfile {
  id: number;
  name?: string;
  description?: string;
  valuation?: number;
  target_market: string[];
  city?: string;
  date_founded?: string;
  industry?: string;
  website?: string;
  keywords: string[];
  intellectual_property: Record<string, unknown>[];
  product_demo_url?: string;
  key_metrics: Record<string, unknown>[];
  team_members: Record<string, unknown>[];
  advisors: Record<string, unknown>[];
  development_stage?: string;
  user_id?: string;
  funding_requests?: FundingRequest[];
  users_sync?: UserSync;
}

interface UserProfile {
  userType: "investor" | "startup";
  profile: InvestorProfile | StartupProfile;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile/read");

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
              <div className="text-lg font-medium">Loading profile...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
        <div className="container mx-auto p-6">
          <Card className="max-w-md mx-auto border-destructive/20 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-destructive flex items-center justify-center space-x-2">
                <span>⚠️</span>
                <span>Error</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="mt-4"
                variant="outline"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
        <div className="container mx-auto p-6">
          <Card className="max-w-md mx-auto shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <User className="h-6 w-6 text-muted-foreground" />
                <span>No Profile Found</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Please complete your onboarding to view your profile.
              </p>
              <Button asChild>
                <a href="/onboarding">Complete Onboarding</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto p-6 space-y-8">
        {/* Hero Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl"></div>
          <Card className="relative border-0 shadow-xl bg-card/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                      <User className="h-10 w-10 text-primary-foreground" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      {profile.userType === "investor"
                        ? (profile.profile as InvestorProfile).users_sync
                            ?.name || "Investor"
                        : (profile.profile as StartupProfile).users_sync
                            ?.name ||
                          (profile.profile as StartupProfile).name ||
                          "Startup"}
                    </h1>
                    <div className="flex items-center space-x-2 mt-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          profile.userType === "investor"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                            : "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                        }`}
                      >
                        {profile.userType === "investor"
                          ? "👔 Investor"
                          : "🚀 Startup"}
                      </span>
                      {profile.userType === "investor"
                        ? (profile.profile as InvestorProfile).city && (
                            <div className="flex items-center text-muted-foreground">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span className="text-sm">
                                {(profile.profile as InvestorProfile).city}
                              </span>
                            </div>
                          )
                        : (profile.profile as StartupProfile).city && (
                            <div className="flex items-center text-muted-foreground">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span className="text-sm">
                                {(profile.profile as StartupProfile).city}
                              </span>
                            </div>
                          )}
                    </div>
                    {profile.userType === "investor"
                      ? (profile.profile as InvestorProfile).users_sync
                          ?.email && (
                          <div className="flex items-center text-muted-foreground mt-1">
                            <Mail className="h-4 w-4 mr-2" />
                            <span className="text-sm">
                              {
                                (profile.profile as InvestorProfile).users_sync
                                  ?.email
                              }
                            </span>
                          </div>
                        )
                      : (profile.profile as StartupProfile).users_sync
                          ?.email && (
                          <div className="flex items-center text-muted-foreground mt-1">
                            <Mail className="h-4 w-4 mr-2" />
                            <span className="text-sm">
                              {
                                (profile.profile as StartupProfile).users_sync
                                  ?.email
                              }
                            </span>
                          </div>
                        )}
                  </div>
                </div>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Content */}
        {profile.userType === "investor" ? (
          <InvestorProfile investor={profile.profile as InvestorProfile} />
        ) : (
          <StartupProfile startup={profile.profile as StartupProfile} />
        )}
      </div>
    </div>
  );
}

function InvestorProfile({ investor }: { investor: InvestorProfile }) {
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
                ? formatCurrencyAbbreviation(investor.typical_check_size_in_php)
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
              {investor.notable_exits.map(
                (exit: Record<string, unknown>, index: number) => (
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
                )
              )}
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

function StartupProfile({ startup }: { startup: StartupProfile }) {
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

      {/* Funding Requests */}
      {startup.funding_requests && startup.funding_requests.length > 0 && (
        <Card className="lg:col-span-3 shadow-lg border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-50/50 dark:from-emerald-950/20 dark:to-emerald-950/10 rounded-t-lg">
            <CardTitle className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-300">
              <DollarSign className="h-5 w-5" />
              <span>Funding Requests</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {startup.funding_requests?.map(
                (request: FundingRequest, index: number) => (
                  <div
                    key={index}
                    className="border border-border/50 p-6 rounded-xl bg-gradient-to-r from-muted/30 to-muted/10 shadow-sm"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-start space-x-3">
                        <TrendingUp className="h-4 w-4 mt-1 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Stage</p>
                          <p className="font-medium">
                            {request.funding_stage || "Not specified"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <DollarSign className="h-4 w-4 mt-1 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Amount
                          </p>
                          <p className="font-medium text-green-600 dark:text-green-400">
                            {request.amount_sought
                              ? formatCurrencyAbbreviation(
                                  request.amount_sought
                                )
                              : "Not specified"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Timeline
                          </p>
                          <p className="font-medium">
                            {request.decision_timeline || "Not specified"} weeks
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <span className="h-4 w-4 mt-1">🎯</span>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Status
                          </p>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              request.is_open
                                ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                                : "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300"
                            }`}
                          >
                            {request.is_open ? "🟢 Open" : "🔴 Closed"}
                          </span>
                        </div>
                      </div>
                    </div>
                    {request.use_of_funds && (
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <p className="text-sm text-muted-foreground mb-2">
                          Use of Funds
                        </p>
                        <p className="text-sm leading-relaxed">
                          {request.use_of_funds}
                        </p>
                      </div>
                    )}
                  </div>
                )
              )}
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
              {startup.team_members.map(
                (member: Record<string, unknown>, index: number) => (
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
                )
              )}
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
              {startup.advisors.map(
                (advisor: Record<string, unknown>, index: number) => (
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
                )
              )}
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
              {startup.key_metrics.map(
                (metric: Record<string, unknown>, index: number) => (
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
                )
              )}
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
                (ip: Record<string, unknown>, index: number) => (
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
