"use server";

import { stackServerApp } from "@/stack";

export async function checkEmailVerification() {
  const user = await stackServerApp.getUser();

  if (!user) {
    return { verified: false };
  }

  return {
    verified: user.primaryEmailVerified,
  };
}
