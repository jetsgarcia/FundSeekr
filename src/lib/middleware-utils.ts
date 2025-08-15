import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { stackServerApp } from "@/stack";

// Routes that should be excluded from certain checks
export const EXCLUDED_ROUTES = {
  onboarding: ["/onboarding"],
  auth: ["/sign-in", "/sign-up", "/login"],
  public: ["/api", "/_next", "/favicon.ico"],
} as const;

export type ExcludeType = keyof typeof EXCLUDED_ROUTES;

/**
 * Check if a path matches any excluded routes for a given type
 * @param pathname - The pathname to check
 * @param excludeType - The type of exclusion to check against
 * @returns boolean indicating if the route is excluded
 */
export function isExcludedRoute(
  pathname: string,
  excludeType: ExcludeType
): boolean {
  return EXCLUDED_ROUTES[excludeType].some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

/**
 * Check if user needs onboarding and return appropriate redirect
 * @param request - The Next.js request object
 * @returns Object with redirect response and user data
 */
export async function checkOnboardingStatus(request: NextRequest) {
  const user = await stackServerApp.getUser();

  if (!user) {
    return { redirect: null, user: null };
  }

  const isUserOnboarded = user?.serverMetadata?.onboarded;

  if (
    !isUserOnboarded &&
    !isExcludedRoute(request.nextUrl.pathname, "onboarding")
  ) {
    return {
      redirect: NextResponse.redirect(new URL("/onboarding", request.url)),
      user,
    };
  }

  return { redirect: null, user };
}

/**
 * Example function for future auth checks
 * @param request - The Next.js request object
 * @returns Object with redirect response if needed
 */
export async function checkAuthStatus(request: NextRequest) {
  // Placeholder for future auth checks
  // const user = await stackServerApp.getUser();
  // Add your auth logic here

  // Prevent unused parameter warning
  void request;

  return { redirect: null };
}

/**
 * Example function for future role-based access checks
 * @param request - The Next.js request object
 * @returns Object with redirect response if needed
 */
export async function checkRoleAccess(request: NextRequest) {
  // Placeholder for future role-based access checks
  // const user = await stackServerApp.getUser();
  // Add your role checking logic here

  // Prevent unused parameter warning
  void request;

  return { redirect: null };
}
