import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  isExcludedRoute,
  checkOnboardingStatus,
  checkAuthStatus,
  checkAdminAccess,
} from "@/lib/middleware-utils";

// Main middleware function
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth checks for public routes
  if (isExcludedRoute(pathname, "publicAccess")) {
    return NextResponse.next();
  }

  // Check authentication status first
  const { redirect: authRedirect, user } = await checkAuthStatus(request);
  if (authRedirect) {
    return authRedirect;
  }

  // Check admin access for admin routes
  const { redirect: adminRedirect } = await checkAdminAccess(request);
  if (adminRedirect) {
    return adminRedirect;
  }

  // Check onboarding status (only if user is authenticated)
  if (user && user.serverMetadata?.userType !== "Admin") {
    const { redirect } = await checkOnboardingStatus(request);
    if (redirect) {
      return redirect;
    }
  } else if (user && user.serverMetadata?.userType === "Admin") {
    // If an admin ends up on generic post-auth pages (/home or onboarding), send to their dashboard
    const postAuthGenericPaths = ["/home", "/onboarding"]; // safeguard if config changes
    if (postAuthGenericPaths.includes(pathname)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)",
  ],
};
