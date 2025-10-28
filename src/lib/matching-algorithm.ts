import prisma from "@/lib/prisma";
import type {
  investors as InvestorProfile,
  startups as StartupProfileType,
} from "@prisma/client";
import { development_stage_enum } from "@prisma/client";

interface MatchResult {
  startupId: string;
  investorId: string;
  matchPercentage: number;
  matchFactors: {
    industryMatch: number;
    stageMatch: number;
    geographicMatch: number;
    businessModelMatch: number;
    penalty: number;
  };
}

/**
 * Calculate matching score between an investor and startup
 *
 * This algorithm focuses on realistic matching criteria based on available data:
 * - Industry alignment (40%) - Most critical factor
 * - Development stage compatibility (30%) - Very important for investment timing
 * - Geographic proximity (20%) - Important for local connections and support
 * - Business model alignment (10%) - Secondary consideration
 *
 * The algorithm applies penalties for excluded industries to prevent bad matches.
 */
export function calculateMatchScore(
  investor: InvestorProfile,
  startup: StartupProfileType
): MatchResult {
  let totalScore = 0;
  let maxPossibleScore = 0;
  const matchFactors = {
    industryMatch: 0,
    stageMatch: 0,
    geographicMatch: 0,
    businessModelMatch: 0,
    penalty: 0,
  };

  // 1. Industry matching (Weight: 40%) - Most important factor
  const industryWeight = 40;
  if (startup.industry) {
    // Immediate disqualification for excluded industries
    if (investor.excluded_industries?.includes(startup.industry)) {
      return {
        startupId: startup.id,
        investorId: investor.id,
        matchPercentage: 0,
        matchFactors: {
          industryMatch: 0,
          stageMatch: 0,
          geographicMatch: 0,
          businessModelMatch: 0,
          penalty: industryWeight * 1.2, // Track the exclusion reason
        },
      };
    }

    if (investor.preferred_industries?.includes(startup.industry)) {
      matchFactors.industryMatch = industryWeight;
      totalScore += industryWeight;
    }
  }
  maxPossibleScore += industryWeight;

  // 2. Development stage matching (Weight: 30%) - Very important
  const stageWeight = 30;
  if (startup.development_stage) {
    const stageMapping: Record<development_stage_enum, string[]> = {
      [development_stage_enum.Idea]: ["Idea", "Pre-seed", "Seed"],
      [development_stage_enum.MVP]: ["MVP", "Pre-seed", "Seed"],
      [development_stage_enum.Early_traction]: [
        "Early traction",
        "Seed",
        "Series A",
      ],
      [development_stage_enum.Growth]: ["Growth", "Series A", "Series B"],
      [development_stage_enum.Expansion]: [
        "Expansion",
        "Series B",
        "Series C+",
        "Late stage",
      ],
    };

    const startupStageKeywords = stageMapping[startup.development_stage] || [];
    const matchingStages =
      investor.preferred_funding_stages?.filter((stage: string) =>
        startupStageKeywords.some((keyword: string) =>
          stage.toLowerCase().includes(keyword.toLowerCase())
        )
      ) || [];

    if (matchingStages.length > 0) {
      matchFactors.stageMatch = stageWeight;
      totalScore += stageWeight;
    }
  }
  maxPossibleScore += stageWeight;

  // 3. Geographic matching (Weight: 20%) - Important for local connections
  const geoWeight = 20;
  if (startup.city && investor.geographic_focus?.length) {
    const cityMatch = investor.geographic_focus.some(
      (focus) =>
        focus.toLowerCase().includes(startup.city!.toLowerCase()) ||
        startup.city!.toLowerCase().includes(focus.toLowerCase()) ||
        focus.toLowerCase() === "global" ||
        focus.toLowerCase() === "worldwide"
    );

    if (cityMatch) {
      matchFactors.geographicMatch = geoWeight;
      totalScore += geoWeight;
    }
  }
  maxPossibleScore += geoWeight;

  // 4. Business model matching (Weight: 10%)
  const businessModelWeight = 10;
  if (
    startup.business_structure &&
    investor.preferred_business_models?.length
  ) {
    // Check if startup's business structure matches investor's preferred business models
    const modelMatch = investor.preferred_business_models.some(
      (model: string) =>
        model.toLowerCase() === startup.business_structure!.toLowerCase()
    );

    if (modelMatch) {
      matchFactors.businessModelMatch = businessModelWeight;
      totalScore += businessModelWeight;
    }
  }
  maxPossibleScore += businessModelWeight;

  // Calculate final percentage
  const matchPercentage =
    maxPossibleScore > 0
      ? Math.max(
          0,
          Math.min(100, Math.round((totalScore / maxPossibleScore) * 100))
        )
      : 0;

  return {
    startupId: startup.id,
    investorId: investor.id,
    matchPercentage,
    matchFactors,
  };
}

/**
 * Find and store matches for a specific startup
 */
export async function findMatchesForStartup(
  startupId: string
): Promise<MatchResult[]> {
  try {
    // Get the startup profile
    const startup = await prisma.startups.findUnique({
      where: { id: startupId },
    });

    if (!startup) {
      throw new Error("Startup not found");
    }

    // Get all investor profiles with meaningful data for matching
    const investors = await prisma.investors.findMany({
      where: {
        // Only include investors with at least industry or funding stage preferences
        OR: [
          {
            preferred_industries: {
              isEmpty: false,
            },
          },
          {
            preferred_funding_stages: {
              isEmpty: false,
            },
          },
        ],
      },
    });

    // Calculate matches
    const matches: MatchResult[] = [];
    for (const investor of investors) {
      const matchResult = calculateMatchScore(investor, startup);

      // Only store matches above a meaningful threshold (30%)
      if (matchResult.matchPercentage >= 30) {
        matches.push(matchResult);
      }
    }

    // Sort by match percentage (highest first)
    matches.sort((a, b) => b.matchPercentage - a.matchPercentage);

    // Store matches in database
    await storeMatches(matches);

    return matches;
  } catch (error) {
    console.error("Error finding matches for startup:", error);
    throw error;
  }
}

/**
 * Find and store matches for a specific investor
 */
export async function findMatchesForInvestor(
  investorId: string
): Promise<MatchResult[]> {
  try {
    // Get the investor profile
    const investor = await prisma.investors.findUnique({
      where: { id: investorId },
    });

    if (!investor) {
      throw new Error("Investor not found");
    }

    // Get all startup profiles with essential information for matching
    const startups = await prisma.startups.findMany({
      where: {
        // Only include startups with basic information filled
        AND: [
          { industry: { not: null } },
          { development_stage: { not: null } },
        ],
      },
    });

    // Calculate matches
    const matches: MatchResult[] = [];
    for (const startup of startups) {
      const matchResult = calculateMatchScore(investor, startup);

      // Only store matches above a meaningful threshold (30%)
      if (matchResult.matchPercentage >= 30) {
        matches.push(matchResult);
      }
    }

    // Sort by match percentage (highest first)
    matches.sort((a, b) => b.matchPercentage - a.matchPercentage);

    // Store matches in database
    await storeMatches(matches);

    return matches;
  } catch (error) {
    console.error("Error finding matches for investor:", error);
    throw error;
  }
}

/**
 * Store match results in the database
 */
async function storeMatches(matches: MatchResult[]): Promise<void> {
  try {
    // Clear existing matches for these investor-startup pairs
    for (const match of matches) {
      await prisma.profile_matches.deleteMany({
        where: {
          investor_id: match.investorId,
          startup_id: match.startupId,
        },
      });
    }

    // Insert new matches
    await prisma.profile_matches.createMany({
      data: matches.map((match) => ({
        investor_id: match.investorId,
        startup_id: match.startupId,
        match_percentage: match.matchPercentage,
      })),
    });
  } catch (error) {
    console.error("Error storing matches:", error);
    throw error;
  }
}

/**
 * Check if a profile is complete enough for matching
 */
export function isProfileCompleteForMatching(
  profile: InvestorProfile | StartupProfileType,
  userType: "Investor" | "Startup"
): boolean {
  if (userType === "Investor") {
    const investor = profile as InvestorProfile;
    // Investor needs at least industry preferences OR funding stage preferences
    return !!(
      (investor.preferred_industries?.length &&
        investor.preferred_industries.length > 0) ||
      (investor.preferred_funding_stages?.length &&
        investor.preferred_funding_stages.length > 0)
    );
  } else {
    const startup = profile as StartupProfileType;
    // Startup needs at least industry AND development stage for meaningful matching
    return !!(startup.industry && startup.development_stage);
  }
}

/**
 * Trigger matching algorithm for a profile
 */
export async function triggerMatching(
  profileId: string,
  userType: "Investor" | "Startup"
): Promise<MatchResult[]> {
  if (userType === "Investor") {
    return await findMatchesForInvestor(profileId);
  } else {
    return await findMatchesForStartup(profileId);
  }
}
