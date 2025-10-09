"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  MapPin,
  Calendar,
  Users,
  Globe,
  ExternalLink,
  DollarSign,
  Target,
  TrendingUp,
  Briefcase,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatCurrencyAbbreviation } from "@/lib/format-number";
import type {
  SearchResult,
  StartupSearchResult,
  InvestorSearchResult,
} from "@/actions/search";

interface SearchResultsProps {
  searchType: "startups" | "investors";
  results: SearchResult;
  isLoading: boolean;
}

export function SearchResults({
  searchType,
  results,
  isLoading,
}: SearchResultsProps) {
  const router = useRouter();
  const [loadingMore, setLoadingMore] = useState(false);

  function handleLoadMore() {
    if (results.hasMore && !loadingMore) {
      setLoadingMore(true);
      const nextPage = results.currentPage + 1;
      const currentParams = new URLSearchParams(window.location.search);
      currentParams.set("page", nextPage.toString());
      router.push(`/search?${currentParams.toString()}`);
    }
  }

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (results.totalCount === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
            {searchType === "startups" ? (
              <Building2 className="h-6 w-6 text-muted-foreground" />
            ) : (
              <Users className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <h3 className="text-lg font-semibold mb-2">No results found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or filters to find more{" "}
            {searchType === "startups" ? "startups" : "investors"}.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {results.totalCount}{" "}
            {searchType === "startups" ? "Startups" : "Investors"} Found
          </h2>
          <p className="text-muted-foreground">
            Page {results.currentPage} of {results.totalPages}
          </p>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {results.results.map((result) => {
          if (searchType === "startups") {
            return (
              <StartupCard
                key={result.id}
                startup={result as StartupSearchResult}
              />
            );
          } else {
            return (
              <InvestorCard
                key={result.id}
                investor={result as InvestorSearchResult}
              />
            );
          }
        })}
      </div>

      {/* Load More Button */}
      {results.hasMore && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="min-w-[120px]"
          >
            {loadingMore ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}

function StartupCard({ startup }: { startup: StartupSearchResult }) {
  const initials = startup.name?.substring(0, 2).toUpperCase() || "ST";

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg line-clamp-1">
              {startup.name || "Unnamed Startup"}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {startup.users_sync?.name && (
                <span className="line-clamp-1">{startup.users_sync.name}</span>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        {startup.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {startup.description}
          </p>
        )}

        {/* Key Info */}
        <div className="space-y-2">
          {startup.industry && (
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="line-clamp-1">{startup.industry}</span>
            </div>
          )}

          {startup.city && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="line-clamp-1">{startup.city}</span>
            </div>
          )}

          {startup.development_stage && (
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="line-clamp-1">{startup.development_stage}</span>
            </div>
          )}

          {startup.date_founded && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span>
                Founded {new Date(startup.date_founded).getFullYear()}
              </span>
            </div>
          )}
        </div>

        {/* Keywords/Tags */}
        {startup.keywords && startup.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {startup.keywords.slice(0, 3).map((keyword) => (
              <Badge key={keyword} variant="secondary" className="text-xs">
                {keyword}
              </Badge>
            ))}
            {startup.keywords.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{startup.keywords.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button asChild size="sm" className="flex-1">
            <Link href={`/profile/startup/${startup.id}`}>View Profile</Link>
          </Button>
          {startup.website_url && (
            <Button asChild variant="outline" size="sm">
              <Link
                href={startup.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                <Globe className="h-3 w-3" />
                <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function InvestorCard({ investor }: { investor: InvestorSearchResult }) {
  const initials =
    investor.organization?.substring(0, 2).toUpperCase() ||
    investor.users_sync?.name?.substring(0, 2).toUpperCase() ||
    "IN";

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg line-clamp-1">
              {investor.organization ||
                investor.users_sync?.name ||
                "Anonymous Investor"}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {investor.position && (
                <span className="line-clamp-1">{investor.position}</span>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Info */}
        <div className="space-y-2">
          {investor.city && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="line-clamp-1">{investor.city}</span>
            </div>
          )}

          {investor.typical_check_size_in_php && (
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span>
                Typical Check:{" "}
                {formatCurrencyAbbreviation(
                  Number(investor.typical_check_size_in_php)
                )}
              </span>
            </div>
          )}

          {investor.involvement_level && (
            <div className="flex items-center gap-2 text-sm">
              <Briefcase className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="line-clamp-1">{investor.involvement_level}</span>
            </div>
          )}
        </div>

        {/* Preferred Industries */}
        {investor.preferred_industries &&
          investor.preferred_industries.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-sm font-medium mb-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                Focus Areas
              </div>
              <div className="flex flex-wrap gap-1">
                {investor.preferred_industries.slice(0, 3).map((industry) => (
                  <Badge key={industry} variant="secondary" className="text-xs">
                    {industry}
                  </Badge>
                ))}
                {investor.preferred_industries.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{investor.preferred_industries.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}

        {/* Funding Stages */}
        {investor.preferred_funding_stages &&
          investor.preferred_funding_stages.length > 0 && (
            <div>
              <div className="text-sm font-medium mb-1">Funding Stages</div>
              <div className="flex flex-wrap gap-1">
                {investor.preferred_funding_stages.slice(0, 2).map((stage) => (
                  <Badge key={stage} variant="outline" className="text-xs">
                    {stage}
                  </Badge>
                ))}
                {investor.preferred_funding_stages.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{investor.preferred_funding_stages.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button asChild size="sm" className="flex-1">
            <Link href={`/profile/investor/${investor.id}`}>View Profile</Link>
          </Button>
          {investor.organization_website && (
            <Button asChild variant="outline" size="sm">
              <Link
                href={investor.organization_website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                <Globe className="h-3 w-3" />
                <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
