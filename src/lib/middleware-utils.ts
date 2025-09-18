import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { stackServerApp } from "@/stack";

export const EXCLUDED_ROUTES = {
  onboarding: ["/onboarding"],
  auth: ["/sign-in", "/sign-up", "/login"],
  publicAccess: ["/", "/handler", "/sign-up", "/sign-in", "/terms"],
} as const;
export type ExcludeType = keyof typeof EXCLUDED_ROUTES;
export const isExcludedRoute = (pathname: string, excludeType: ExcludeType) =>
  EXCLUDED_ROUTES[excludeType].some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

export async function checkOnboardingStatus(request: NextRequest) {
  const user = await stackServerApp.getUser();
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
  if (isExcludedRoute(pathname, "publicAccess"))
    return { redirect: null, user: null };
  const user = await stackServerApp.getUser();
  if (!user)
    return {
      redirect: NextResponse.redirect(new URL("/sign-in", request.url)),
      user: null,
    };
  return { redirect: null, user };
}

export async function checkAdminAccess(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (!pathname.startsWith("/admin")) return { redirect: null };
  const user = await stackServerApp.getUser();
  if (!user) return { redirect: null };
  if (user.serverMetadata?.userType !== "Admin")
    return { redirect: NextResponse.redirect(new URL("/home", request.url)) };
  return { redirect: null };
}

export async function checkRoleAccess(request: NextRequest) {
  void request;
  return { redirect: null };
}
