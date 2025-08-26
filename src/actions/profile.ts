import { stackServerApp } from "@/stack";
import prisma from "@/lib/prisma";
import type {
  investors as InvestorProfile,
  startups as StartupProfile,
} from "@prisma/client";

type readProfileType =
  | { ok: true; profile: InvestorProfile | StartupProfile }
  | { ok: false; error: string };

export async function readProfile(): Promise<readProfileType> {
  const user = await stackServerApp.getUser();

  if (!user) {
    return { ok: false, error: "No user found" };
  }

  if (user.serverMetadata.userType === "Investor") {
    const investorProfile = await prisma.investors.findFirst({
      where: { user_id: user.id },
      include: {
        users_sync: true,
      },
    });

    if (!investorProfile) {
      return { ok: false, error: "Investor profile not found" };
    }

    return { ok: true, profile: investorProfile };
  }

  if (user.serverMetadata.userType === "Startup") {
    const startupProfile = await prisma.startups.findFirst({
      where: { user_id: user.id },
      include: {
        users_sync: true,
      },
    });

    if (!startupProfile) {
      return { ok: false, error: "Startup profile not found" };
    }

    return { ok: true, profile: startupProfile };
  }

  return { ok: false, error: "An unexpected error occurred" };
}
