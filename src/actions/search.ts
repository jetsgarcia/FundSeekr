"use server";

import prisma from "@/lib/prisma";
import { stackServerApp } from "@/stack";

export interface SearchFilters {
  industry?: string;
  stage?: string;
  location?: string;
  checkSize?: string;
  businessModel?: string;
  fundingStage?: string;
}

export interface SearchParams {
  query: string;
  type: "startups" | "investors";
  filters: SearchFilters;
  page: number;
  limit: number;
}

export interface StartupSearchResult {
  id: string;
  name: string | null;
  description: string | null;
  industry: string | null;
  city: string | null;
  website_url: string | null;
  development_stage: string | null;
  target_market: string[];
  keywords: string[];
  date_founded: Date | null;
  users_sync: {
    name: string | null;
    email: string | null;
  } | null;
}

export interface InvestorSearchResult {
  id: string;
  organization: string | null;
  position: string | null;
  city: string | null;
  organization_website: string | null;
  preferred_industries: string[];
  preferred_business_models: string[];
  preferred_funding_stages: string[];
  geographic_focus: string[];
  typical_check_size_in_php: bigint | null;
  involvement_level: string | null;
  users_sync: {
    name: string | null;
    email: string | null;
  } | null;
}

export interface SearchResult {
  results: (StartupSearchResult | InvestorSearchResult)[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}

export async function searchProfiles(params: SearchParams): Promise<SearchResult> {
  const user = await stackServerApp.getUser();
  
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { query, type, filters, page, limit } = params;
  const offset = (page - 1) * limit;

  try {
    if (type === "startups") {
      return await searchStartups(query, filters, offset, limit);
    } else {
      return await searchInvestors(query, filters, offset, limit);
    }
  } catch (error) {
    console.error("Search error:", error);
    return {
      results: [],
      totalCount: 0,
      currentPage: page,
      totalPages: 0,
      hasMore: false,
    };
  }
}

async function searchStartups(
  query: string,
  filters: SearchFilters,
  offset: number,
  limit: number
): Promise<SearchResult> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const whereClause: any = {
    // Only include verified startups
    users_sync: {
      raw_json: {
        path: ["server_metadata", "legalVerified"],
        equals: true,
      },
    },
  };

  // Text search conditions
  if (query.trim()) {
    whereClause.OR = [
      {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: query,
          mode: "insensitive",
        },
      },
      {
        keywords: {
          hasSome: [query],
        },
      },
      {
        industry: {
          contains: query,
          mode: "insensitive",
        },
      },
    ];
  }

  // Apply filters
  if (filters.industry) {
    whereClause.industry = {
      contains: filters.industry,
      mode: "insensitive",
    };
  }

  if (filters.stage) {
    whereClause.development_stage = filters.stage;
  }

  if (filters.location) {
    whereClause.city = {
      contains: filters.location,
      mode: "insensitive",
    };
  }

  // Get total count
  const totalCount = await prisma.startups.count({
    where: whereClause,
  });

  // Get paginated results
  const startups = await prisma.startups.findMany({
    where: whereClause,
    include: {
      users_sync: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    skip: offset,
    take: limit,
    orderBy: [
      { name: "asc" },
      { date_founded: "desc" },
    ],
  });

  const totalPages = Math.ceil(totalCount / limit);

  return {
    results: startups.map(startup => ({
      id: startup.id,
      name: startup.name,
      description: startup.description,
      industry: startup.industry,
      city: startup.city,
      website_url: startup.website_url,
      development_stage: startup.development_stage,
      target_market: startup.target_market,
      keywords: startup.keywords,
      date_founded: startup.date_founded,
      users_sync: startup.users_sync || null,
    })) as StartupSearchResult[],
    totalCount,
    currentPage: Math.floor(offset / limit) + 1,
    totalPages,
    hasMore: offset + limit < totalCount,
  };
}

async function searchInvestors(
  query: string,
  filters: SearchFilters,
  offset: number,
  limit: number
): Promise<SearchResult> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const whereClause: any = {
    // Only include verified investors
    users_sync: {
      raw_json: {
        path: ["server_metadata", "legalVerified"],
        equals: true,
      },
    },
  };

  // Text search conditions
  if (query.trim()) {
    whereClause.OR = [
      {
        organization: {
          contains: query,
          mode: "insensitive",
        },
      },
      {
        position: {
          contains: query,
          mode: "insensitive",
        },
      },
      {
        preferred_industries: {
          hasSome: [query],
        },
      },
    ];
  }

  // Apply filters
  if (filters.industry) {
    whereClause.preferred_industries = {
      hasSome: [filters.industry],
    };
  }

  if (filters.location) {
    whereClause.OR = [
      ...(whereClause.OR || []),
      {
        city: {
          contains: filters.location,
          mode: "insensitive",
        },
      },
      {
        geographic_focus: {
          hasSome: [filters.location],
        },
      },
    ];
  }

  if (filters.businessModel) {
    whereClause.preferred_business_models = {
      hasSome: [filters.businessModel],
    };
  }

  if (filters.fundingStage) {
    whereClause.preferred_funding_stages = {
      hasSome: [filters.fundingStage],
    };
  }

  if (filters.checkSize) {
    const checkSizeRanges = {
      "under-1m": { gte: 0, lt: 1000000 },
      "1m-5m": { gte: 1000000, lt: 5000000 },
      "5m-10m": { gte: 5000000, lt: 10000000 },
      "10m-50m": { gte: 10000000, lt: 50000000 },
      "50m-plus": { gte: 50000000 },
    };

    const range = checkSizeRanges[filters.checkSize as keyof typeof checkSizeRanges];
    if (range) {
      whereClause.typical_check_size_in_php = range;
    }
  }

  // Get total count
  const totalCount = await prisma.investors.count({
    where: whereClause,
  });

  // Get paginated results
  const investors = await prisma.investors.findMany({
    where: whereClause,
    include: {
      users_sync: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    skip: offset,
    take: limit,
    orderBy: [
      { organization: "asc" },
      { position: "asc" },
    ],
  });

  const totalPages = Math.ceil(totalCount / limit);

  return {
    results: investors.map(investor => ({
      id: investor.id,
      organization: investor.organization,
      position: investor.position,
      city: investor.city,
      organization_website: investor.organization_website,
      preferred_industries: investor.preferred_industries,
      preferred_business_models: investor.preferred_business_models,
      preferred_funding_stages: investor.preferred_funding_stages,
      geographic_focus: investor.geographic_focus,
      typical_check_size_in_php: investor.typical_check_size_in_php,
      involvement_level: investor.involvement_level,
      users_sync: investor.users_sync || null,
    })) as InvestorSearchResult[],
    totalCount,
    currentPage: Math.floor(offset / limit) + 1,
    totalPages,
    hasMore: offset + limit < totalCount,
  };
}

// Get available filter options
export async function getFilterOptions(): Promise<{
  industries: string[];
  developmentStages: string[];
  businessModels: string[];
  fundingStages: string[];
  locations: string[];
}> {
  try {
    const [startups, investors] = await Promise.all([
      prisma.startups.findMany({
        select: {
          industry: true,
          development_stage: true,
          city: true,
          target_market: true,
        },
        where: {
          users_sync: {
            raw_json: {
              path: ["server_metadata", "legalVerified"],
              equals: true,
            },
          },
        },
      }),
      prisma.investors.findMany({
        select: {
          preferred_industries: true,
          preferred_business_models: true,
          preferred_funding_stages: true,
          city: true,
          geographic_focus: true,
        },
        where: {
          users_sync: {
            raw_json: {
              path: ["server_metadata", "legalVerified"],
              equals: true,
            },
          },
        },
      }),
    ]);

    const industries = new Set<string>();
    const developmentStages = new Set<string>();
    const businessModels = new Set<string>();
    const fundingStages = new Set<string>();
    const locations = new Set<string>();

    // Collect from startups
    startups.forEach((startup) => {
      if (startup.industry) industries.add(startup.industry);
      if (startup.development_stage) developmentStages.add(startup.development_stage);
      if (startup.city) locations.add(startup.city);
      startup.target_market?.forEach((market) => industries.add(market));
    });

    // Collect from investors
    investors.forEach((investor) => {
      investor.preferred_industries?.forEach((industry) => industries.add(industry));
      investor.preferred_business_models?.forEach((model) => businessModels.add(model));
      investor.preferred_funding_stages?.forEach((stage) => fundingStages.add(stage));
      if (investor.city) locations.add(investor.city);
      investor.geographic_focus?.forEach((location) => locations.add(location));
    });

    return {
      industries: Array.from(industries).filter(Boolean).sort(),
      developmentStages: Array.from(developmentStages).filter(Boolean).sort(),
      businessModels: Array.from(businessModels).filter(Boolean).sort(),
      fundingStages: Array.from(fundingStages).filter(Boolean).sort(),
      locations: Array.from(locations).filter(Boolean).sort(),
    };
  } catch (error) {
    console.error("Error getting filter options:", error);
    return {
      industries: [],
      developmentStages: [],
      businessModels: [],
      fundingStages: [],
      locations: [],
    };
  }
}