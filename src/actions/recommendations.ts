import { stackServerApp } from "@/stack";
import prisma from "@/lib/prisma";
import { formatCurrencyAbbreviation } from "@/lib/format-number";

// Types matching the component interfaces
export interface StartupRecommendation {
  id: string;
  name: string;
  industry: string;
  location: string;
  stage: string;
  description: string;
  keyMetrics: string[];
  matchScore: number;
}

export interface InvestorRecommendation {
  id: string;
  name: string;
  position: string;
  organization: string;
  location: string;
  typicalCheck: string;
  preferredIndustries: string[];
  fundingStages: string[];
  involvementLevel: string;
  matchScore: number;
}

type RecommendationsResult =
  | {
      ok: true;
      recommendations: StartupRecommendation[] | InvestorRecommendation[];
      userType: "Startup" | "Investor";
    }
  | { ok: false; error: string };

export async function getRecommendations(): Promise<RecommendationsResult> {
  const user = await stackServerApp.getUser();

  if (!user) {
    return { ok: false, error: "No user found" };
  }

  const userType = user.serverMetadata?.userType as "Startup" | "Investor";

  if (!userType) {
    return { ok: false, error: "User type not found" };
  }

  try {
    if (userType === "Startup") {
      // Fetch investor recommendations for startup
      const matches = await prisma.profile_matches.findMany({
        where: {
          startups: {
            user_id: user.id,
          },
        },
        include: {
          investors: {
            include: {
              users_sync: true,
            },
          },
        },
        orderBy: {
          match_percentage: "desc",
        },
        take: 20, // Limit to top 20 matches
      });

      const recommendations: InvestorRecommendation[] = matches.map((match) => {
        const investor = match.investors;
        const userData = investor.users_sync;

        // Format typical check size
        const typicalCheck = investor.typical_check_size_in_php
          ? formatCurrencyAbbreviation(
              Number(investor.typical_check_size_in_php)
            )
          : "Not specified";

        return {
          id: investor.id,
          name: userData?.name || "Unknown",
          position: investor.position || "Not specified",
          organization: investor.organization || "Not specified",
          location: investor.city || "Not specified",
          typicalCheck,
          preferredIndustries: investor.preferred_industries || [],
          fundingStages: investor.preferred_funding_stages || [],
          involvementLevel: investor.involvement_level || "Not specified",
          matchScore: match.match_percentage,
        };
      });

      return { ok: true, recommendations, userType };
    } else {
      // Fetch startup recommendations for investor
      const matches = await prisma.profile_matches.findMany({
        where: {
          investors: {
            user_id: user.id,
          },
        },
        include: {
          startups: {
            include: {
              users_sync: true,
            },
          },
        },
        orderBy: {
          match_percentage: "desc",
        },
        take: 20, // Limit to top 20 matches
      });

      const recommendations: StartupRecommendation[] = matches.map((match) => {
        const startup = match.startups;

        // Format key metrics from the JSON field
        const keyMetrics: string[] = [];
        if (startup.key_metrics && Array.isArray(startup.key_metrics)) {
          startup.key_metrics.forEach((metric: unknown) => {
            if (typeof metric === "object" && metric !== null) {
              // Handle different metric formats
              const metricObj = metric as Record<string, unknown>;
              if (metricObj.value && metricObj.label) {
                keyMetrics.push(`${metricObj.label}: ${metricObj.value}`);
              } else if (metricObj.metric) {
                keyMetrics.push(String(metricObj.metric));
              }
            } else if (typeof metric === "string") {
              keyMetrics.push(metric);
            }
          });
        }

        // Map development stage enum to display string
        const getStageDisplay = (stage: string | null) => {
          switch (stage) {
            case "Idea":
              return "Idea";
            case "MVP":
              return "MVP";
            case "Early_traction":
              return "Early Traction";
            case "Growth":
              return "Growth";
            case "Expansion":
              return "Expansion";
            default:
              return "Not specified";
          }
        };

        return {
          id: startup.id,
          name: startup.name || "Unknown Startup",
          industry: startup.industry || "Not specified",
          location: startup.city || "Not specified",
          stage: getStageDisplay(startup.development_stage),
          description: startup.description || "No description available",
          keyMetrics:
            keyMetrics.length > 0 ? keyMetrics : ["No metrics available"],
          matchScore: match.match_percentage,
        };
      });

      return { ok: true, recommendations, userType };
    }
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return { ok: false, error: "Failed to fetch recommendations" };
  }
}
