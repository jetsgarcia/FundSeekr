"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinksProps {
  userType?: string;
  legalVerified?: boolean;
}

export function NavLinks({ userType, legalVerified }: NavLinksProps) {
  const pathname = usePathname();

  const linkStyles =
    "transition-colors duration-200 hover:text-blue-500 font-light";
  const activeLinkStyles =
    "text-blue-500 dark:text-blue-400 font-medium font-semibold";

  const getLinkClassName = (href: string) => {
    const isActive = pathname === href;
    return cn(linkStyles, isActive && activeLinkStyles);
  };

  return (
    <div className="flex gap-6">
      {userType === "Investor" && legalVerified && (
        <>
          <Link href="/home" className={getLinkClassName("/home")}>
            Home
          </Link>
          <Link href="/search" className={getLinkClassName("/search")}>
            Search Startups
          </Link>
          <Link href="/chat" className={getLinkClassName("/chat")}>
            Chat
          </Link>
        </>
      )}
      {userType === "Startup" && legalVerified && (
        <>
          <Link href="/home" className={getLinkClassName("/home")}>
            Home
          </Link>
          <Link href="/search" className={getLinkClassName("/search")}>
            Search Investors
          </Link>
          <Link href="/chat" className={getLinkClassName("/chat")}>
            Chat
          </Link>
        </>
      )}
      {userType === "Admin" && (
        <>
          <Link href="/admin" className={getLinkClassName("/admin")}>
            Home
          </Link>
          <Link
            href="/admin/verification"
            className={getLinkClassName("/admin/verification")}
          >
            Verification
          </Link>
          <Link
            href="/admin/admin-registration"
            className={getLinkClassName("/admin/admin-registration")}
          >
            Admin Registration
          </Link>
        </>
      )}
    </div>
  );
}
