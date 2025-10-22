import { ModeToggle } from "@/components/mode-toggle";
import { NavLogo } from "@/components/nav-logo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding | FundSeekr",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {/* Top Navigation */}
      <header className="w-full sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Logo and navigation links */}
          <div className="flex items-center gap-10">
            <NavLogo />
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            <ModeToggle />
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
