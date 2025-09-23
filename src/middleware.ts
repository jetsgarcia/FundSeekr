import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  isExcludedRoute,
  checkOnboardingStatus,
  checkAuthStatus,
  checkAdminAccess,
  checkVerificationStatus,
} from "@/lib/middleware-utils";
import { stackServerApp } from "@/stack";

export async function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;
  const { redirect: authRedirect, user } = await checkAuthStatus(request);
  if (authRedirect) return authRedirect;
  // Resolve user even on public routes to enforce onboarding gating when userType is missing
  const effectiveUser = user ?? (await stackServerApp.getUser());
  // If the user is authenticated but does not have a userType yet, force them to onboarding everywhere except the onboarding flow itself
  if (effectiveUser && !effectiveUser.serverMetadata?.userType) {
    const isOnboarding = isExcludedRoute(currentPath, "onboarding");
    const isHandler =
      currentPath === "/handler" || currentPath.startsWith("/handler/");
    if (!isOnboarding && !isHandler) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
  }
  const { redirect: adminRedirect } = await checkAdminAccess(request);
  if (adminRedirect) return adminRedirect;

  // Check verification status for non-admin users
  const { redirect: verificationRedirect } = await checkVerificationStatus(
    request
  );
  if (verificationRedirect) return verificationRedirect;

  if (effectiveUser) {
    const isAdmin = effectiveUser.serverMetadata?.userType === "Admin";
    if (!isAdmin) {
      const { redirect: onboardingRedirect } = await checkOnboardingStatus(
        request
      );
      if (onboardingRedirect) return onboardingRedirect;
    } else if (["/home", "/onboarding"].includes(currentPath))
      return NextResponse.redirect(new URL("/admin", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)",
  ],
};
