"use server";

import prisma from "@/lib/prisma";
import { stackServerApp } from "@/stack";

export interface VerificationStats {
  total: number;
  verified: number;
  rejected: number;
  pending: number;
  verifiedPct: number; // 0-100
}

async function ensureAdmin() {
  const user = await stackServerApp.getUser();
  if (!user || user.serverMetadata?.userType !== "Admin") {
    throw new Error("Unauthorized");
  }
}

export async function getStartupVerificationStats(): Promise<VerificationStats> {
  await ensureAdmin();

  const [total, verified, rejected, pending] = await Promise.all([
    prisma.startups.count(),
    prisma.startups.count({ where: { legal_verified: true } }),
    prisma.startups.count({ where: { legal_verified: false } }),
    prisma.startups.count({ where: { legal_verified: null } }),
  ]);

  const verifiedPct = total > 0 ? Math.round((verified / total) * 100) : 0;
  return { total, verified, rejected, pending, verifiedPct };
}

export async function getInvestorVerificationStats(): Promise<VerificationStats> {
  await ensureAdmin();

  const total = await prisma.investors.count();

  // Verified and rejected based on users_sync.raw_json.server_metadata.legalVerified
  const verified = await prisma.investors.count({
    where: {
      users_sync: {
        raw_json: {
          path: ["server_metadata", "legalVerified"],
          equals: true,
        },
      },
    },
  });

  const rejected = await prisma.investors.count({
    where: {
      users_sync: {
        raw_json: {
          path: ["server_metadata", "legalVerified"],
          equals: false,
        },
      },
    },
  });

  // Pending = not verified and not rejected (legalVerified missing)
  const pending = await prisma.investors.count({
    where: {
      AND: [
        {
          NOT: {
            users_sync: {
              raw_json: {
                path: ["server_metadata", "legalVerified"],
                equals: true,
              },
            },
          },
        },
        {
          NOT: {
            users_sync: {
              raw_json: {
                path: ["server_metadata", "legalVerified"],
                equals: false,
              },
            },
          },
        },
      ],
    },
  });

  const verifiedPct = total > 0 ? Math.round((verified / total) * 100) : 0;
  return { total, verified, rejected, pending, verifiedPct };
}
