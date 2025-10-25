import { notFound } from "next/navigation";
import { getProfileData } from "@/actions/profile-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VideoDisplay } from "@/components/profile/startup/video-display";
import {
  MapPin,
  Building2,
  Calendar,
  Globe,
  Users,
  TrendingUp,
  Target,
  Phone,
  Linkedin,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

interface ProfilePageProps {
  params: Promise<{
    type: "startup" | "investor";
    id: string;
  }>;
}

function getStageColor(stage: string) {
  switch (stage) {
    case "Idea":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    case "MVP":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
    case "Early traction":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    case "Growth":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "Expansion":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    case "Pre-seed":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
    case "Seed":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    case "Series A":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "Series B":
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
  }
}

function getInvolvementColor(level: string) {
  switch (level) {
    case "Hands off":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    case "Advisor":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    case "Active":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "Controlling":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { type, id } = await params;

  if (type !== "startup" && type !== "investor") {
    notFound();
  }

  const result = await getProfileData(id, type);

  if (!result.ok) {
    notFound();
  }

  const profile = result.data;

  if (type === "startup") {
    const startup = profile as {
      id: string;
      user_id: string | null;
      name: string | null;
      description: string | null;
      target_market: string[];
      city: string | null;
      date_founded: Date | null;
      industry: string | null;
      website_url: string | null;
      keywords: string[];
      product_demo_url: string | null;
      key_metrics: Array<{
        name?: string;
        metric?: string;
        value: string;
        description?: string;
      }>;
      team_members: Array<{
        name: string;
        position?: string;
        role?: string;
        linkedin?: string;
      }>;
      advisors: Array<{
        name: string;
        position?: string;
        role?: string;
        company?: string;
      }>;
      development_stage: string | null;
      business_structure: string | null;
      documents: Array<{ name?: string; title?: string; url: string }>;
      govt_id_image_url: string;
      bir_cor_image_url: string;
      proof_of_bank_image_url: string | null;
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Back Button */}
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/home" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Recommendations
              </Link>
            </Button>
          </div>

          {/* Header Section */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {startup.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                    {startup.city && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{startup.city}</span>
                      </div>
                    )}
                    {startup.industry && (
                      <div className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        <span>{startup.industry}</span>
                      </div>
                    )}
                    {startup.date_founded && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Founded {new Date(startup.date_founded).getFullYear()}
                        </span>
                      </div>
                    )}
                    {startup.website_url && (
                      <div className="flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        <a
                          href={startup.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors"
                        >
                          Website
                        </a>
                      </div>
                    )}
                  </div>

                  {startup.development_stage && (
                    <div className="mb-4">
                      <Badge
                        className={getStageColor(startup.development_stage)}
                      >
                        {startup.development_stage}
                      </Badge>
                    </div>
                  )}

                  {startup.description && (
                    <p className="text-foreground leading-relaxed">
                      {startup.description}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  <Button size="lg" className="w-full lg:w-auto" asChild>
                    <Link href={`/chat/${startup.user_id}`}>Send Message</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Target Market */}
              {startup.target_market && startup.target_market.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Target Market
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {startup.target_market.map(
                        (market: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {market}
                          </Badge>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Keywords */}
              {startup.keywords && startup.keywords.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Keywords</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {startup.keywords.map(
                        (keyword: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {keyword}
                          </Badge>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Key Metrics */}
              {startup.key_metrics && startup.key_metrics.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Key Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {startup.key_metrics.map(
                        (
                          metric: {
                            name?: string;
                            metric?: string;
                            value: string;
                            description?: string;
                          },
                          index: number
                        ) => (
                          <div key={index} className="border rounded-lg p-3">
                            <div className="font-medium text-foreground">
                              {metric.name || metric.metric}
                            </div>
                            <div className="text-muted-foreground text-sm">
                              {metric.value}
                            </div>
                            {metric.description && (
                              <div className="text-muted-foreground text-xs mt-1">
                                {metric.description}
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
              {startup.team_members && startup.team_members.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Team Members
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {startup.team_members.map(
                        (
                          member: {
                            name: string;
                            position?: string;
                            role?: string;
                            linkedin?: string;
                          },
                          index: number
                        ) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="font-medium text-foreground">
                              {member.name}
                            </div>
                            <div className="text-muted-foreground text-sm">
                              {member.position || member.role}
                            </div>
                            {member.linkedin && (
                              <a
                                href={member.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm mt-2"
                              >
                                <Linkedin className="h-3 w-3" />
                                LinkedIn
                              </a>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Advisors */}
              {startup.advisors && startup.advisors.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Advisors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {startup.advisors.map(
                        (
                          advisor: {
                            name: string;
                            position?: string;
                            role?: string;
                            company?: string;
                          },
                          index: number
                        ) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="font-medium text-foreground">
                              {advisor.name}
                            </div>
                            <div className="text-muted-foreground text-sm">
                              {advisor.position || advisor.role}
                            </div>
                            {advisor.company && (
                              <div className="text-muted-foreground text-xs">
                                {advisor.company}
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Business Structure */}
              {startup.business_structure && (
                <Card>
                  <CardHeader>
                    <CardTitle>Business Structure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge
                      className={getStageColor(startup.business_structure)}
                    >
                      {startup.business_structure}
                    </Badge>
                  </CardContent>
                </Card>
              )}

              {/* Product Demo */}
              {startup.product_demo_url && (
                <Card>
                  <CardHeader>
                    <CardTitle>Product Demo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full">
                      <a
                        href={startup.product_demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Demo
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Documents */}
              {startup.documents && startup.documents.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {startup.documents.map(
                        (
                          doc: { name?: string; title?: string; url: string },
                          index: number
                        ) => (
                          <div key={index} className="text-sm">
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {doc.name || doc.title || `Document ${index + 1}`}
                            </a>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Video Pitches */}
              <VideoDisplay startupId={startup.id} />
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    // Investor profile
    const investor = profile as {
      id: string;
      user_id: string | null;
      organization: string | null;
      position: string | null;
      city: string | null;
      organization_website: string | null;
      investor_linkedin: string | null;
      decision_period_in_weeks: number | null;
      typical_check_size_in_php: bigint | null;
      preferred_industries: string[];
      excluded_industries: string[];
      preferred_business_models: string[];
      preferred_funding_stages: string[];
      geographic_focus: string[];
      value_proposition: string[];
      involvement_level: string | null;
      portfolio_companies: string[];
      notable_exits: Array<{
        company?: string;
        name?: string;
        exit_value?: string;
        year?: string;
      }>;
      key_contact_person_name: string | null;
      key_contact_linkedin: string | null;
      key_contact_number: string | null;
      govt_id_image_url: string;
      selfie_image_url: string;
      proof_of_bank_image_url: string;
      tin: string;
      users_sync: { name: string | null; email: string | null } | null;
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Back Button */}
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/home" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Recommendations
              </Link>
            </Button>
          </div>

          {/* Header Section */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {investor.users_sync?.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                    {investor.position && investor.organization && (
                      <div className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        <span>
                          {investor.position} at {investor.organization}
                        </span>
                      </div>
                    )}
                    {investor.city && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{investor.city}</span>
                      </div>
                    )}
                    {investor.organization_website && (
                      <div className="flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        <a
                          href={investor.organization_website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors"
                        >
                          Website
                        </a>
                      </div>
                    )}
                  </div>

                  {investor.involvement_level && (
                    <div className="mb-4">
                      <Badge
                        className={getInvolvementColor(
                          investor.involvement_level
                        )}
                      >
                        {investor.involvement_level}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  <Button size="lg" className="w-full lg:w-auto" asChild>
                    <Link href={`/chat/${investor.user_id}`}>Send Message</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Investment Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Investment Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {investor.typical_check_size_in_php && (
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Typical Check Size
                        </div>
                        <div className="font-medium">
                          {investor.typical_check_size_in_php.toLocaleString()}
                        </div>
                      </div>
                    )}
                    {investor.decision_period_in_weeks && (
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Decision Period
                        </div>
                        <div className="font-medium">
                          {investor.decision_period_in_weeks} weeks
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Preferred Industries */}
              {investor.preferred_industries &&
                investor.preferred_industries.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Preferred Industries</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {investor.preferred_industries.map(
                          (industry: string, index: number) => (
                            <Badge key={index} variant="secondary">
                              {industry}
                            </Badge>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

              {/* Excluded Industries */}
              {investor.excluded_industries &&
                investor.excluded_industries.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Excluded Industries</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {investor.excluded_industries.map(
                          (industry: string, index: number) => (
                            <Badge key={index} variant="destructive">
                              {industry}
                            </Badge>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

              {/* Preferred Funding Stages */}
              {investor.preferred_funding_stages &&
                investor.preferred_funding_stages.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Preferred Funding Stages</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {investor.preferred_funding_stages.map(
                          (stage: string, index: number) => (
                            <Badge key={index} className={getStageColor(stage)}>
                              {stage}
                            </Badge>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

              {/* Preferred Business Models */}
              {investor.preferred_business_models &&
                investor.preferred_business_models.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Preferred Business Models</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {investor.preferred_business_models.map(
                          (model: string, index: number) => (
                            <Badge key={index} variant="outline">
                              {model}
                            </Badge>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

              {/* Geographic Focus */}
              {investor.geographic_focus &&
                investor.geographic_focus.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Geographic Focus
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {investor.geographic_focus.map(
                          (location: string, index: number) => (
                            <Badge key={index} variant="secondary">
                              {location}
                            </Badge>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

              {/* Value Proposition */}
              {investor.value_proposition &&
                investor.value_proposition.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Value Proposition</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {investor.value_proposition.map(
                          (prop: string, index: number) => (
                            <Badge key={index} variant="outline">
                              {prop}
                            </Badge>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

              {/* Portfolio Companies */}
              {investor.portfolio_companies &&
                investor.portfolio_companies.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Portfolio Companies</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {investor.portfolio_companies.map(
                          (company: string, index: number) => (
                            <Badge key={index} variant="secondary">
                              {company}
                            </Badge>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

              {/* Notable Exits */}
              {investor.notable_exits && investor.notable_exits.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notable Exits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {investor.notable_exits.map(
                        (
                          exit: {
                            company?: string;
                            name?: string;
                            exit_value?: string;
                            year?: string;
                          },
                          index: number
                        ) => (
                          <div key={index} className="border rounded-lg p-3">
                            <div className="font-medium text-foreground">
                              {exit.company || exit.name}
                            </div>
                            {exit.exit_value && (
                              <div className="text-muted-foreground text-sm">
                                Exit Value: {exit.exit_value}
                              </div>
                            )}
                            {exit.year && (
                              <div className="text-muted-foreground text-xs">
                                {exit.year}
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Key Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {investor.key_contact_person_name && (
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Contact Person
                      </div>
                      <div className="font-medium">
                        {investor.key_contact_person_name}
                      </div>
                    </div>
                  )}
                  {investor.key_contact_number && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {investor.key_contact_number}
                      </span>
                    </div>
                  )}
                  {investor.key_contact_linkedin && (
                    <div className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={investor.key_contact_linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                  {investor.investor_linkedin && (
                    <div className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={investor.investor_linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Organization LinkedIn
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
