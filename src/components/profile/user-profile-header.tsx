"use client";

import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import { Mail, User, Edit } from "lucide-react";

interface UserProfileHeaderProps {
  profileImageUrl?: string | null;
  displayName?: string;
  userType?: string;
  primaryEmail?: string;
}

export function UserProfileHeader({
  profileImageUrl,
  displayName,
  userType,
  primaryEmail,
}: UserProfileHeaderProps) {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl"></div>
      <Card className="relative border-0 shadow-xl bg-card/80 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                  {profileImageUrl ? (
                    <Image
                      className="h-20 w-20 rounded-full"
                      width={80}
                      height={80}
                      src={profileImageUrl}
                      alt="User image"
                    />
                  ) : (
                    <User className="h-10 w-10 text-primary-foreground" />
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-4">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    {displayName}
                  </h1>
                  <span className="px-3 py-1 mt-1 rounded-full text-sm font-medium bg-accent">
                    {userType}
                  </span>
                </div>

                <div className="flex items-center text-muted-foreground mt-1">
                  <Mail className="h-4 w-4 mr-2" />
                  <span className="text-sm">{primaryEmail}</span>
                </div>
              </div>
            </div>
            <Link href="/profile/edit">
              <Button variant="outline" size="lg" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
