"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLogo() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const logoContent = (
    <div className="flex items-center gap-2 font-semibold text-lg">
      <Image
        src="/fundseekr_logo.png"
        alt="FundSeekr Logo"
        width={30}
        height={30}
        className="rounded"
        priority
      />
      <span className="hidden sm:inline-block sm:text-[1.6rem]">FundSeekr</span>
    </div>
  );

  if (isHomePage) {
    return (
      <div className="flex items-center gap-2 font-semibold text-lg">
        {logoContent}
      </div>
    );
  }

  return (
    <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
      {logoContent}
    </Link>
  );
}
