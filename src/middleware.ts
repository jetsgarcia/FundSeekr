import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isExcludedRoute, checkOnboardingStatus } from "@/lib/middleware-utils";

// Main middleware function
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public routes
  if (isExcludedRoute(pathname, "public")) {
    return NextResponse.next();
  }

  // Check onboarding status
  const { redirect } = await checkOnboardingStatus(request);
  if (redirect) {
    return redirect;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
