"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, Settings, LogOut, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useUser } from "@stackframe/stack";
import packageJson from "../../package.json";

interface UserButtonProps {
  userType?: string;
}

export function UserButton({ userType }: UserButtonProps) {
  const user = useUser();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleProfileView = () => {
    router.push("/profile");
    setIsOpen(false);
  };

  const handleAccountSettings = () => {
    router.push("/handler/account-settings");
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await user?.signOut();
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout error:", error);
    }
    setIsOpen(false);
  };

  // Show loading state if user is not loaded yet
  if (!user) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <User className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-9 w-9 rounded-full p-0 hover:bg-accent"
        >
          {user.profileImageUrl ? (
            <Image
              src={user.profileImageUrl}
              alt="Profile"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <User className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.displayName || "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.primaryEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {userType !== "Admin" && (
          <DropdownMenuItem
            onClick={handleProfileView}
            className="cursor-pointer"
          >
            <Eye className="mr-2 h-4 w-4" />
            <span>View Profile</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={handleAccountSettings}
          className="cursor-pointer"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Account Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5">
          <p className="text-xs text-muted-foreground font-mono text-center">
            v{packageJson.version}
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
