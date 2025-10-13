"use server";

import prisma from "@/lib/prisma";
import { stackServerApp } from "@/stack";

export interface EngagementMetricsData {
  matchesMade: number;
  verifiedUsersTotal: number;
}

/**
 * Fetches high-level engagement metrics for the admin dashboard.
 * - matchesMade: total count of matches across the platform (all time)
 * - activeUsersDaily: count of users updated in the last 24 hours
 *
 * Note: profile_matches currently has no timestamp, so matches are reported as all-time totals.
 */
export async function getEngagementMetrics(): Promise<EngagementMetricsData> {
  try {
    // Authorization: only admins should access
    const user = await stackServerApp.getUser();
    if (!user || user.serverMetadata?.userType !== "Admin") {
      throw new Error("Unauthorized");
    }

    const [matchesMade, verifiedUsersTotal] = await Promise.all([
      // All-time matches (no timestamp available on profile_matches)
      prisma.profile_matches.count(),

      // Total verified users: legalVerified = true and not deleted
      prisma.users_sync.count({
        where: {
          deleted_at: null,
          raw_json: {
            path: ["server_metadata", "legalVerified"],
            equals: true,
          },
        },
      }),
    ]);

    return { matchesMade, verifiedUsersTotal };
  } catch (error) {
    console.error("Error fetching engagement metrics:", error);
    // Rethrow so client can show a small error state
    throw error;
  }
}
