import { ModeToggle } from "@/components/mode-toggle";
import { NavAuthButton } from "@/components/nav-auth-buttons";
import { NavLinks } from "@/components/nav-links";
import { NavLogo } from "@/components/nav-logo";
import { UserButton } from "@/components/user-button";
import { stackServerApp } from "@/stack";
import prisma from "@/lib/prisma";

export default async function WithNavLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await stackServerApp.getUser();
  const userType = user?.serverMetadata?.userType;

  let legalVerified = user?.serverMetadata?.legalVerified;

  // For startups, check verification status from the startups table
  if (user && userType === "Startup") {
    const startupProfile = await prisma.startups.findFirst({
      where: { user_id: user.id },
      select: { legal_verified: true },
    });
    legalVerified = startupProfile?.legal_verified;
  }

  return (
    <div>
      {/* Top Navigation */}
      <header className="w-full sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center">
            <NavLogo />
          </div>

          {/* Center: Navigation links */}
          {!userType && (
            <nav className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
              <a
                href="#features"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                How It Works
              </a>
              <a
                href="#about"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                About
              </a>
            </nav>
          )}

          {/* Left (when logged in): Logo and navigation links */}
          {userType && (
            <div className="flex items-center gap-10 absolute left-4 sm:left-6 lg:left-8">
              <NavLinks userType={userType} legalVerified={legalVerified} />
            </div>
          )}

          {/* Right: Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            <ModeToggle />
            {user ? <UserButton userType={userType} /> : <NavAuthButton />}
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
