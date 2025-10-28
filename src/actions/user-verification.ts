"use server";

import prisma from "@/lib/prisma";
import {
  triggerMatching,
  isProfileCompleteForMatching,
} from "@/lib/matching-algorithm";

interface VerificationResult {
  success: boolean;
  message: string;
  error?: string;
}

export async function approveUser(userId: string): Promise<VerificationResult> {
  try {
    // First, determine if this is a startup by checking the startups table
    const startup = await prisma.startups.findFirst({
      where: { user_id: userId },
      select: { id: true },
    });

    // Check if this is an investor by checking the investors table
    const investor = await prisma.investors.findFirst({
      where: { user_id: userId },
      select: { id: true },
    });

    // Update the raw_json in the database using raw SQL to add legalVerified: true
    // First ensure server_metadata exists, then set the nested properties

    // Step 1: Create server_metadata object if it doesn't exist
    await prisma.$executeRaw`
      UPDATE neon_auth.users_sync 
      SET raw_json = jsonb_set(raw_json, '{server_metadata}', '{}')
      WHERE id = ${userId} AND (raw_json->'server_metadata' IS NULL OR raw_json->'server_metadata' = 'null'::jsonb)
    `;

    // Step 2: Set the verification fields
    await prisma.$executeRaw`
      UPDATE neon_auth.users_sync 
      SET raw_json = jsonb_set(
        jsonb_set(
          raw_json,
          '{server_metadata,legalVerified}', 
          'true'::jsonb
        ),
        '{server_metadata,verifiedAt}',
        to_jsonb(NOW()::text)
      )
      WHERE id = ${userId}
    `;

    // If it's a startup, also update the legal_verified field in the startups table
    if (startup) {
      await prisma.startups.updateMany({
        where: { user_id: userId },
        data: { legal_verified: true },
      });

      // Trigger matching algorithm for startup if profile is complete enough
      try {
        const startupProfile = await prisma.startups.findFirst({
          where: { user_id: userId },
        });

        if (
          startupProfile &&
          isProfileCompleteForMatching(startupProfile, "Startup")
        ) {
          await triggerMatching(startupProfile.id, "Startup");
        }
      } catch (matchingError) {
        console.error(
          "Error triggering matching algorithm for startup:",
          matchingError
        );
        // Don't fail the approval if matching fails
      }
    }

    // If it's an investor, trigger matching algorithm
    if (investor) {
      try {
        const investorProfile = await prisma.investors.findFirst({
          where: { user_id: userId },
        });

        if (
          investorProfile &&
          isProfileCompleteForMatching(investorProfile, "Investor")
        ) {
          await triggerMatching(investorProfile.id, "Investor");
        }
      } catch (matchingError) {
        console.error(
          "Error triggering matching algorithm for investor:",
          matchingError
        );
        // Don't fail the approval if matching fails
      }
    }

    // Note: For investors, we only use the users_sync metadata approach
    // as there's no legal_verified field in the investors table

    return {
      success: true,
      message: "User approved successfully",
    };
  } catch (error) {
    console.error("Database error:", error);
    return {
      success: false,
      message: "Failed to approve user",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function rejectUser(
  userId: string,
  rejectionReason?: string
): Promise<VerificationResult> {
  try {
    // First, determine if this is a startup by checking the startups table
    const startup = await prisma.startups.findFirst({
      where: { user_id: userId },
      select: { id: true },
    });

    // Update the raw_json in the database using raw SQL to add legalVerified: false
    // First ensure server_metadata exists, then set the nested properties

    // Step 1: Create server_metadata object if it doesn't exist
    await prisma.$executeRaw`
      UPDATE neon_auth.users_sync 
      SET raw_json = jsonb_set(raw_json, '{server_metadata}', '{}')
      WHERE id = ${userId} AND (raw_json->'server_metadata' IS NULL OR raw_json->'server_metadata' = 'null'::jsonb)
    `;

    // Step 2: Set the rejection fields
    await prisma.$executeRaw`
      UPDATE neon_auth.users_sync 
      SET raw_json = jsonb_set(
        jsonb_set(
          jsonb_set(
            raw_json,
            '{server_metadata,legalVerified}', 
            'false'::jsonb
          ),
          '{server_metadata,rejectedAt}',
          to_jsonb(NOW()::text)
        ),
        '{server_metadata,rejectionReason}',
        to_jsonb(${rejectionReason || null})
      )
      WHERE id = ${userId}
    `;

    // If it's a startup, also update the legal_verified field in the startups table
    if (startup) {
      await prisma.startups.updateMany({
        where: { user_id: userId },
        data: { legal_verified: false },
      });
    }

    // Note: For investors, we only use the users_sync metadata approach
    // as there's no legal_verified field in the investors table

    return {
      success: true,
      message: "User rejected successfully",
    };
  } catch (error) {
    console.error("Database error:", error);
    return {
      success: false,
      message: "Failed to reject user",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
