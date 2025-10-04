"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  X,
  MapPin,
  Building2,
  Users,
  DollarSign,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SearchResults } from "./search-results";
import { SearchFilters } from "./search-filters";
import type {
  SearchResult,
  SearchFilters as SearchFiltersType,
} from "@/actions/search";

interface SearchInterfaceProps {
  userType: "Startup" | "Investor";
  initialSearchType: "startups" | "investors";
  initialQuery: string;
  initialFilters: SearchFiltersType;
  searchResults: SearchResult;
}

export function SearchInterface({
  initialSearchType,
  initialQuery,
  initialFilters,
  searchResults,
}: SearchInterfaceProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  // Fixed search type based on user role - no switching allowed
  const searchType = initialSearchType;
  const [filters, setFilters] = useState<SearchFiltersType>(initialFilters);
  const [showFilters, setShowFilters] = useState(false);

  // Get active filter count
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  // Handle search
  function handleSearch() {
    startTransition(() => {
      const params = new URLSearchParams();

      if (searchQuery.trim()) {
        params.set("q", searchQuery.trim());
      }

      params.set("type", searchType);

      // Add filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        }
      });

      router.push(`/search?${params.toString()}`);
    });
  }

  // Handle filter change
  function handleFilterChange(newFilters: SearchFiltersType) {
    setFilters(newFilters);

    startTransition(() => {
      const params = new URLSearchParams();

      if (searchQuery.trim()) {
        params.set("q", searchQuery.trim());
      }

      params.set("type", searchType);

      // Add filters
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        }
      });

      router.push(`/search?${params.toString()}`);
    });
  }

  // Clear filters
  function clearFilters() {
    const newFilters: SearchFiltersType = {};
    setFilters(newFilters);
    handleFilterChange(newFilters);
  }

  return (
    <div className="space-y-6">
      {/* Search Controls */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            {searchType === "startups" ? (
              <>
                <Building2 className="h-5 w-5" />
                Find Startups
              </>
            ) : (
              <>
                <Users className="h-5 w-5" />
                Find Investors
              </>
            )}
          </CardTitle>
          <p className="text-muted-foreground">
            {searchType === "startups"
              ? "Discover innovative startups looking for funding"
              : "Connect with investors who match your criteria"}
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Search Input */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={
                  searchType === "startups"
                    ? "Search startups by name, industry, or keywords..."
                    : "Search investors by organization, focus, or expertise..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                className="pl-10"
              />
            </div>

            <Sheet open={showFilters} onOpenChange={setShowFilters}>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 h-5 w-5 rounded-full p-0 text-xs"
                    >
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[30vw] min-w-[320px] max-w-[400px]">
                <SheetHeader>
                  <SheetTitle>Search Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <SearchFilters
                    searchType={searchType}
                    filters={filters}
                    onFiltersChange={handleFilterChange}
                    onClearFilters={clearFilters}
                  />
                </div>
              </SheetContent>
            </Sheet>

            <Button onClick={handleSearch} disabled={isPending}>
              {isPending ? "Searching..." : "Search"}
            </Button>
          </div>

          {/* Active Filters */}
          {activeFilterCount > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => {
                if (!value) return null;

                return (
                  <Badge
                    key={key}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {key === "location" && <MapPin className="h-3 w-3" />}
                    {key === "checkSize" && <DollarSign className="h-3 w-3" />}
                    {key === "industry" && <Building2 className="h-3 w-3" />}
                    <span className="capitalize">{key}:</span>
                    <span>{value}</span>
                    <button
                      onClick={() => {
                        const newFilters = { ...filters };
                        delete newFilters[key as keyof SearchFiltersType];
                        handleFilterChange(newFilters);
                      }}
                      className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}

              {activeFilterCount > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-6 px-2 text-xs"
                >
                  Clear all
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      <SearchResults
        searchType={searchType}
        results={searchResults}
        isLoading={isPending}
      />
    </div>
  );
}
