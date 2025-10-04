"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getFilterOptions } from "@/actions/search";
import type { SearchFilters as SearchFiltersType } from "@/actions/search";

interface SearchFiltersProps {
  searchType: "startups" | "investors";
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
  onClearFilters: () => void;
}

interface FilterOptions {
  industries: string[];
  developmentStages: string[];
  businessModels: string[];
  fundingStages: string[];
  locations: string[];
}

export function SearchFilters({
  searchType,
  filters,
  onFiltersChange,
  onClearFilters,
}: SearchFiltersProps) {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    industries: [],
    developmentStages: [],
    businessModels: [],
    fundingStages: [],
    locations: [],
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFilterOptions() {
      try {
        const options = await getFilterOptions();
        setFilterOptions(options);
      } catch (error) {
        console.error("Failed to load filter options:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadFilterOptions();
  }, []);

  function handleFilterChange(
    key: keyof SearchFiltersType,
    value: string | undefined
  ) {
    const newFilters = { ...filters };
    if (value && value !== "all") {
      newFilters[key] = value;
    } else {
      delete newFilters[key];
    }
    onFiltersChange(newFilters);
  }

  if (isLoading) {
    return <div className="text-center py-4">Loading filters...</div>;
  }

  const checkSizeOptions = [
    { value: "under-1m", label: "Under ₱1M" },
    { value: "1m-5m", label: "₱1M - ₱5M" },
    { value: "5m-10m", label: "₱5M - ₱10M" },
    { value: "10m-50m", label: "₱10M - ₱50M" },
    { value: "50m-plus", label: "₱50M+" },
  ];

  return (
    <div className="space-y-6">
      {/* Industry Filter */}
      <div className="space-y-2">
        <Label htmlFor="industry">Industry</Label>
        <Select
          value={filters.industry || "all"}
          onValueChange={(value) => handleFilterChange("industry", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            {filterOptions.industries.map((industry) => (
              <SelectItem key={industry} value={industry}>
                {industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Location Filter */}
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Select
          value={filters.location || "all"}
          onValueChange={(value) => handleFilterChange("location", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {filterOptions.locations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Startup-specific filters */}
      {searchType === "startups" && (
        <div className="space-y-2">
          <Label htmlFor="stage">Development Stage</Label>
          <Select
            value={filters.stage || "all"}
            onValueChange={(value) => handleFilterChange("stage", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              {filterOptions.developmentStages.map((stage) => (
                <SelectItem key={stage} value={stage}>
                  {stage}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Investor-specific filters */}
      {searchType === "investors" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="checkSize">Check Size</Label>
            <Select
              value={filters.checkSize || "all"}
              onValueChange={(value) => handleFilterChange("checkSize", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select check size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sizes</SelectItem>
                {checkSizeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessModel">Business Model</Label>
            <Select
              value={filters.businessModel || "all"}
              onValueChange={(value) =>
                handleFilterChange("businessModel", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select business model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Models</SelectItem>
                {filterOptions.businessModels.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fundingStage">Funding Stage</Label>
            <Select
              value={filters.fundingStage || "all"}
              onValueChange={(value) =>
                handleFilterChange("fundingStage", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select funding stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {filterOptions.fundingStages.map((stage) => (
                  <SelectItem key={stage} value={stage}>
                    {stage}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {/* Clear Filters Button */}
      <Button
        variant="outline"
        onClick={onClearFilters}
        className="w-full"
        disabled={Object.values(filters).every((value) => !value)}
      >
        Clear All Filters
      </Button>
    </div>
  );
}
