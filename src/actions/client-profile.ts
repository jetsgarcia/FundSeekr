"use server";

import { stackServerApp } from "@/stack";

export async function changeCurrentStartupClient(newStartupId: string) {
  const user = await stackServerApp.getUser();

  if (!user) {
    return { ok: false, error: "No user found" };
  }

  try {
    // Update the user's current startup profile
    await user.update({
      serverMetadata: {
        ...user.serverMetadata,
        currentProfileId: newStartupId,
      },
    });

    return { ok: true };
  } catch (error) {
    console.error("Error changing current startup:", error);
    return { ok: false, error: "Failed to change current startup" };
  }
}
