import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { stackServerApp } from "@/stack";

// Routes that should be excluded from certain checks
export const EXCLUDED_ROUTES = {
  onboarding: ["/onboarding"],
  auth: ["/sign-in", "/sign-up", "/login"],
  publicAccess: ["/", "/handler", "/sign-up", "/sign-in", "/terms"],
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
  const { pathname } = request.nextUrl;

  // If user is onboarded but trying to access onboarding page, redirect to /home
  if (isUserOnboarded && isExcludedRoute(pathname, "onboarding")) {
    return {
      redirect: NextResponse.redirect(new URL("/home", request.url)),
      user,
    };
  }

  // If user is not onboarded and trying to access non-onboarding pages, redirect to onboarding
  if (!isUserOnboarded && !isExcludedRoute(pathname, "onboarding")) {
    return {
      redirect: NextResponse.redirect(new URL("/onboarding", request.url)),
      user,
    };
  }

  return { redirect: null, user };
}

/**
 * Check authentication status and redirect to sign-in if not authenticated
 * @param request - The Next.js request object
 * @returns Object with redirect response if needed
 */
export async function checkAuthStatus(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth check for public routes
  if (isExcludedRoute(pathname, "publicAccess")) {
    return { redirect: null, user: null };
  }

  const user = await stackServerApp.getUser();

  // If user is not authenticated and trying to access protected routes
  if (!user) {
    return {
      redirect: NextResponse.redirect(new URL("/sign-in", request.url)),
      user: null,
    };
  }

  return { redirect: null, user };
}

/**
 * Check if user has admin access for admin routes
 * @param request - The Next.js request object
 * @returns Object with redirect response if user is not admin
 */
export async function checkAdminAccess(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is an admin route
  if (!pathname.startsWith("/admin")) {
    return { redirect: null };
  }

  const user = await stackServerApp.getUser();

  // If user is not authenticated, they should be redirected by checkAuthStatus first
  if (!user) {
    return { redirect: null };
  }

  // Check if user is an admin
  const isAdmin = user.serverMetadata?.userType === "Admin";

  if (!isAdmin) {
    // Redirect non-admin users to home page with an error message
    const homeUrl = new URL("/home", request.url);
    return {
      redirect: NextResponse.redirect(homeUrl),
    };
  }

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
