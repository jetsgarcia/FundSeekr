import { Suspense } from "react";
import { stackServerApp } from "@/stack";
import { SearchInterface } from "@/components/search/search-interface";
import { searchProfiles } from "@/actions/search";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    type?: "startups" | "investors";
    industry?: string;
    stage?: string;
    location?: string;
    checkSize?: string;
    businessModel?: string;
    fundingStage?: string;
    page?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const user = await stackServerApp.getUser();

  if (!user) {
    return <div>Not authenticated</div>;
  }

  const userType = user.serverMetadata?.userType as "Startup" | "Investor";
  const defaultSearchType = userType === "Startup" ? "investors" : "startups";

  // Await the searchParams
  const params = await searchParams;

  // Get search parameters
  const searchQuery = params.q || "";
  const searchType = params.type || defaultSearchType;
  const currentPage = parseInt(params.page || "1");

  // Build filters object
  const filters = {
    industry: params.industry,
    stage: params.stage,
    location: params.location,
    checkSize: params.checkSize,
    businessModel: params.businessModel,
    fundingStage: params.fundingStage,
  };

  // Perform search
  const searchResults = await searchProfiles({
    query: searchQuery,
    type: searchType,
    filters,
    page: currentPage,
    limit: 12,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {searchType === "startups" ? "Find Startups" : "Find Investors"}
          </h1>
          <p className="text-muted-foreground">
            {searchType === "startups"
              ? "Discover innovative startups looking for funding"
              : "Connect with investors who match your criteria"}
          </p>
        </div>

        <Suspense fallback={<div>Loading search interface...</div>}>
          <SearchInterface
            userType={userType}
            initialSearchType={searchType}
            initialQuery={searchQuery}
            initialFilters={filters}
            searchResults={searchResults}
          />
        </Suspense>
      </div>
    </div>
  );
}
