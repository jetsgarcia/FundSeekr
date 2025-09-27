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
    checkSizeMatch: number;
    involvementMatch: number;
    valuePropositionMatch: number;
    penalty: number;
  };
}

/**
 * Calculate matching score between an investor and startup
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
    checkSizeMatch: 0,
    involvementMatch: 0,
    valuePropositionMatch: 0,
    penalty: 0,
  };

  // 1. Industry matching (Weight: 25%)
  const industryWeight = 25;
  if (startup.industry) {
    if (investor.preferred_industries?.includes(startup.industry)) {
      matchFactors.industryMatch = industryWeight;
      totalScore += industryWeight;
    }

    // Penalty for excluded industries
    if (investor.excluded_industries?.includes(startup.industry)) {
      const penalty = industryWeight * 0.8; // Heavy penalty
      matchFactors.penalty += penalty;
      totalScore -= penalty;
    }
  }
  maxPossibleScore += industryWeight;

  // 2. Development stage matching (Weight: 20%)
  const stageWeight = 20;
  if (startup.development_stage) {
    const stageMapping: Record<development_stage_enum, string[]> = {
      [development_stage_enum.Idea]: ["Idea", "Seed"],
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

  // 3. Geographic matching (Weight: 15%)
  const geoWeight = 15;
  if (startup.city && investor.geographic_focus?.length) {
    const cityMatch = investor.geographic_focus.some(
      (focus) =>
        focus.toLowerCase().includes(startup.city!.toLowerCase()) ||
        startup.city!.toLowerCase().includes(focus.toLowerCase())
    );

    if (cityMatch) {
      matchFactors.geographicMatch = geoWeight;
      totalScore += geoWeight;
    }
  }
  maxPossibleScore += geoWeight;

  // 4. Check size matching (Weight: 15%)
  // Note: This requires adding estimated_funding_needed to startup schema
  const checkSizeWeight = 15;
  // For now, we'll skip this until the field is added
  // if (startup.estimatedFundingNeeded && investor.typical_check_size_in_php) {
  //   const fundingNeeded = BigInt(startup.estimatedFundingNeeded);
  //   const checkSize = investor.typical_check_size_in_php;
  //
  //   // Check if investor's typical check size is within reasonable range
  //   if (checkSize >= fundingNeeded * BigInt(50) / BigInt(100) &&
  //       checkSize <= fundingNeeded * BigInt(200) / BigInt(100)) {
  //     matchFactors.checkSizeMatch = checkSizeWeight;
  //     totalScore += checkSizeWeight;
  //   }
  // }
  maxPossibleScore += checkSizeWeight;

  // 5. Involvement level matching (Weight: 10%)
  const involvementWeight = 10;
  // This would need startup's preferred involvement level
  // For now, we'll assume any involvement is acceptable
  if (investor.involvement_level) {
    matchFactors.involvementMatch = involvementWeight * 0.5; // Partial score
    totalScore += involvementWeight * 0.5;
  }
  maxPossibleScore += involvementWeight;

  // 6. Value proposition matching (Weight: 15%)
  const valueWeight = 15;
  if (investor.value_proposition?.length && startup.keywords?.length) {
    const commonKeywords = investor.value_proposition.filter((prop: string) =>
      startup.keywords.some(
        (keyword: string) =>
          keyword.toLowerCase().includes(prop.toLowerCase()) ||
          prop.toLowerCase().includes(keyword.toLowerCase())
      )
    );

    if (commonKeywords.length > 0) {
      const scoreRatio = Math.min(
        commonKeywords.length / investor.value_proposition.length,
        1
      );
      matchFactors.valuePropositionMatch = valueWeight * scoreRatio;
      totalScore += valueWeight * scoreRatio;
    }
  }
  maxPossibleScore += valueWeight;

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

    // Get all investor profiles
    const investors = await prisma.investors.findMany({
      where: {
        // Only include investors with at least some matching criteria filled
        OR: [
          { preferred_industries: { isEmpty: false } },
          { preferred_funding_stages: { isEmpty: false } },
          { geographic_focus: { isEmpty: false } },
        ],
      },
    });

    // Calculate matches
    const matches: MatchResult[] = [];
    for (const investor of investors) {
      const matchResult = calculateMatchScore(investor, startup);

      // Only store matches above a certain threshold (e.g., 20%)
      if (matchResult.matchPercentage >= 20) {
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

    // Get all startup profiles
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

      // Only store matches above a certain threshold (e.g., 20%)
      if (matchResult.matchPercentage >= 20) {
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
    return !!(
      investor.preferred_industries?.length ||
      investor.preferred_funding_stages?.length ||
      investor.geographic_focus?.length
    );
  } else {
    const startup = profile as StartupProfileType;
    return !!(startup.industry && startup.development_stage && startup.city);
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
