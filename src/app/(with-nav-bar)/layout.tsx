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
          {/* Left: Logo and navigation links */}
          <div className="flex items-center gap-10">
            <NavLogo />
            {userType && (
              <NavLinks userType={userType} legalVerified={legalVerified} />
            )}
          </div>

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
