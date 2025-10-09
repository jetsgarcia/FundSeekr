"use server";

import { stackServerApp } from "@/stack";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { startups as StartupProfile } from "@prisma/client";

export async function createStartupProfile(data: {
  name: string;
  business_structure: "Sole" | "Partnership" | "Corporation";
  govt_id_image_url: string;
  bir_cor_image_url: string;
  proof_of_bank_image_url?: string;
}): Promise<
  { ok: true; profile: StartupProfile } | { ok: false; error: string }
> {
  const user = await stackServerApp.getUser();

  if (!user) {
    return { ok: false, error: "No user found" };
  }

  if (user.serverMetadata.userType !== "Startup") {
    return { ok: false, error: "User is not a startup" };
  }

  try {
    const newProfile = await prisma.startups.create({
      data: {
        id: crypto.randomUUID(),
        name: data.name,
        business_structure: data.business_structure,
        govt_id_image_url: data.govt_id_image_url,
        bir_cor_image_url: data.bir_cor_image_url,
        proof_of_bank_image_url: data.proof_of_bank_image_url,
        user_id: user.id,
        // Initialize arrays as empty
        target_market: [],
        keywords: [],
        team_members: [],
        advisors: [],
        key_metrics: [],
        documents: [],
      },
    });

    // Revalidate the profile page
    revalidatePath("/profile");

    return { ok: true, profile: newProfile };
  } catch (error) {
    console.error("Error creating startup profile:", error);
    return { ok: false, error: "Failed to create startup profile" };
  }
}
