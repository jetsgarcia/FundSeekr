import prisma from "@/lib/prisma";
import { VerifyUsers } from "@/components/admin/verify-users";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, UserCheck } from "lucide-react";

async function getPendingUsers() {
  try {
    // Fetch startups with their user information
    const startups = await prisma.startups.findMany({
      include: {
        users_sync: true,
      },
    });

    // Fetch investors with their user information
    const investors = await prisma.investors.findMany({
      include: {
        users_sync: true,
      },
    });

    return { startups, investors };
  } catch (error) {
    console.error("Error fetching pending users:", error);
    return { startups: [], investors: [] };
  }
}

export default async function AdminVerificationPage() {
  const { startups, investors } = await getPendingUsers();

  const totalPending = startups.length + investors.length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">User Verification</h1>
          <p className="text-muted-foreground">
            Review and verify user profiles for startups and investors
          </p>
        </div>
      </div>

      {/* User Verification Component */}
      <VerifyUsers startups={startups} investors={investors} />
    </div>
  );
}
