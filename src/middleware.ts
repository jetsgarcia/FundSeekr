import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  isExcludedRoute,
  checkOnboardingStatus,
  checkAuthStatus,
  checkAdminAccess,
} from "@/lib/middleware-utils";

export async function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;
  if (isExcludedRoute(currentPath, "publicAccess")) return NextResponse.next();
  const { redirect: authRedirect, user } = await checkAuthStatus(request);
  if (authRedirect) return authRedirect;
  const { redirect: adminRedirect } = await checkAdminAccess(request);
  if (adminRedirect) return adminRedirect;
  if (user) {
    const isAdmin = user.serverMetadata?.userType === "Admin";
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
