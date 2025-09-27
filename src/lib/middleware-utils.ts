import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { stackServerApp } from "@/stack";

type StackUser = {
  id: string;
  serverMetadata?: {
    userType?: string;
    onboarded?: boolean;
    legalVerified?: boolean;
  };
} | null;

export const EXCLUDED_ROUTES = {
  onboarding: ["/onboarding"],
  auth: ["/sign-in", "/sign-up", "/login"],
  publicAccess: [
    "/",
    "/handler",
    "/sign-up",
    "/sign-in",
    "/terms",
    "/api",
    "/_next",
    "/debug-auth",
  ],
  verification: ["/home", "/profile"],
} as const;
export type ExcludeType = keyof typeof EXCLUDED_ROUTES;
export const isExcludedRoute = (pathname: string, excludeType: ExcludeType) =>
  EXCLUDED_ROUTES[excludeType].some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

export async function checkOnboardingStatus(
  request: NextRequest,
  user: StackUser
) {
  if (!user) return { redirect: null, user: null };
  const onboarded = user.serverMetadata?.onboarded;
  const pathname = request.nextUrl.pathname;
  if (onboarded && isExcludedRoute(pathname, "onboarding"))
    return {
      redirect: NextResponse.redirect(new URL("/home", request.url)),
      user,
    };
  if (!onboarded && !isExcludedRoute(pathname, "onboarding"))
    return {
      redirect: NextResponse.redirect(new URL("/onboarding", request.url)),
      user,
    };
  return { redirect: null, user };
}

export async function checkAuthStatus(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Always get user to check authentication status
  const user = await stackServerApp.getUser();

  // If accessing public routes, allow access regardless of auth status
  if (isExcludedRoute(pathname, "publicAccess")) {
    return { redirect: null, user };
  }

  // If user is not authenticated and trying to access protected route, redirect to sign-in
  if (!user) {
    return {
      redirect: NextResponse.redirect(new URL("/sign-in", request.url)),
      user: null,
    };
  }

  return { redirect: null, user };
}

export async function checkAdminAccess(request: NextRequest, user: StackUser) {
  const pathname = request.nextUrl.pathname;
  if (!pathname.startsWith("/admin")) return { redirect: null };
  if (!user) return { redirect: null };
  if (user.serverMetadata?.userType !== "Admin")
    return { redirect: NextResponse.redirect(new URL("/home", request.url)) };
  return { redirect: null };
}

export async function checkRoleAccess(request: NextRequest) {
  void request;
  return { redirect: null };
}

export async function checkVerificationStatus(
  request: NextRequest,
  user: StackUser
) {
  const pathname = request.nextUrl.pathname;

  if (!user) return { redirect: null };

  // Admin users are exempt from verification requirements
  if (user.serverMetadata?.userType === "Admin") {
    return { redirect: null };
  }

  const legalVerified = user.serverMetadata?.legalVerified;

  // If user is not verified and trying to access protected routes
  if (!legalVerified && !isExcludedRoute(pathname, "verification")) {
    return {
      redirect: NextResponse.redirect(new URL("/home", request.url)),
    };
  }

  return { redirect: null };
}
