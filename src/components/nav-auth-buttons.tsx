import Link from "next/link";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export function NavAuthButton() {
  const isMobile = useIsMobile();

  return (
    <div>
      <Button asChild variant="ghost" size={isMobile ? "default" : "lg"}>
        <Link href="/sign-in">Log in</Link>
      </Button>
      <Button asChild size={isMobile ? "default" : "lg"}>
        <Link href="/sign-up" className="font-semibold">
          Sign up
        </Link>
      </Button>
    </div>
  );
}
