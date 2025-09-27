import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  isExcludedRoute,
  checkOnboardingStatus,
  checkAuthStatus,
  checkAdminAccess,
  checkVerificationStatus,
} from "@/lib/middleware-utils";

export async function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;

  // First check auth status
  const { redirect: authRedirect, user } = await checkAuthStatus(request);
  if (authRedirect) return authRedirect;

  // If no user, continue (public routes)
  if (!user) {
    return NextResponse.next();
  }

  // If user is authenticated but does not have a userType yet, force them to onboarding
  if (!user.serverMetadata?.userType) {
    const isOnboarding = isExcludedRoute(currentPath, "onboarding");
    const isHandler =
      currentPath === "/handler" || currentPath.startsWith("/handler/");
    const isAuth = isExcludedRoute(currentPath, "auth");
    if (!isOnboarding && !isHandler && !isAuth) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
    return NextResponse.next();
  }

  // Check admin access
  const { redirect: adminRedirect } = await checkAdminAccess(request, user);
  if (adminRedirect) return adminRedirect;

  // Check verification status for non-admin users
  const { redirect: verificationRedirect } = await checkVerificationStatus(
    request,
    user
  );
  if (verificationRedirect) return verificationRedirect;

  // Handle admin vs non-admin routing
  const isAdmin = user.serverMetadata?.userType === "Admin";
  if (isAdmin && ["/home", "/onboarding"].includes(currentPath)) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (!isAdmin) {
    const { redirect: onboardingRedirect } = await checkOnboardingStatus(
      request,
      user
    );
    if (onboardingRedirect) return onboardingRedirect;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)",
  ],
};
