"use server";

import prisma from "@/lib/prisma";
import { stackServerApp } from "@/stack";

export interface UserOverviewData {
  totalInvestors: number;
  totalStartups: number;
  newSignups30d: number;
}

export async function getUserOverview(): Promise<UserOverviewData> {
  // Only Admins can view platform-wide overview
  const user = await stackServerApp.getUser();
  if (!user || user.serverMetadata?.userType !== "Admin") {
    throw new Error("Unauthorized");
  }

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [totalInvestors, totalStartups, newSignups30d] = await Promise.all([
    prisma.investors.count(),
    prisma.startups.count(),
    prisma.users_sync.count({
      where: {
        deleted_at: null,
        created_at: { gte: since },
      },
    }),
  ]);

  return { totalInvestors, totalStartups, newSignups30d };
}
