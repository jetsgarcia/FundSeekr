"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Users,
  CheckCircle,
  Calendar,
  Mail,
  Filter,
} from "lucide-react";
import type {
  startups,
  investors,
  users_sync,
  funding_requests,
} from "@prisma/client";

type StartupWithUser = startups & {
  users_sync: users_sync | null;
  funding_requests: funding_requests[];
};

type InvestorWithUser = investors & {
  users_sync: users_sync | null;
};

interface VerifyUsersProps {
  startups: StartupWithUser[];
  investors: InvestorWithUser[];
}

export function VerifyUsers({ startups, investors }: VerifyUsersProps) {
  const [filter, setFilter] = useState<"startups" | "investors">("startups");
  const router = useRouter();

  const handleCardClick = (userId: string, type: "startup" | "investor") => {
    router.push(`/admin/verification/${userId}`);
  };

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex items-center space-x-4">
        <Filter className="h-5 w-5 text-muted-foreground" />
        <Select
          value={filter}
          onValueChange={(value: "startups" | "investors") => setFilter(value)}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="startups">Startups</SelectItem>
            <SelectItem value="investors">Investors</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Startups Section */}
      {filter === "startups" && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center space-x-2">
            <Building2 className="h-6 w-6" />
            <span>Startups Pending Verification</span>
            <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
              {startups.length}
            </span>
          </h2>

          {startups.length === 0 ? (
            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
                <p className="text-muted-foreground">
                  No startups are currently pending verification.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {startups.map((startup) => (
                <Card
                  key={startup.id}
                  className="shadow-lg border-0 bg-card/80 backdrop-blur-sm cursor-pointer hover:shadow-xl transition-shadow"
                  onClick={() => handleCardClick(startup.user_id!, "startup")}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-3">
                          <Building2 className="h-5 w-5 text-primary" />
                          <h3 className="text-lg font-semibold">
                            {startup.name || "Unnamed Startup"}
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4" />
                            <span>
                              {startup.users_sync?.email || "No email"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              Registered:{" "}
                              {startup.users_sync?.created_at
                                ? new Date(
                                    startup.users_sync.created_at
                                  ).toLocaleDateString()
                                : "Unknown"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Building2 className="h-4 w-4" />
                            <span>{startup.industry || "No industry"}</span>
                          </div>
                        </div>

                        {startup.description && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {startup.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Investors Section */}
      {filter === "investors" && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center space-x-2">
            <Users className="h-6 w-6" />
            <span>Investors Pending Verification</span>
            <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
              {investors.length}
            </span>
          </h2>

          {investors.length === 0 ? (
            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
                <p className="text-muted-foreground">
                  No investors are currently pending verification.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {investors.map((investor) => (
                <Card
                  key={investor.id}
                  className="shadow-lg border-0 bg-card/80 backdrop-blur-sm cursor-pointer hover:shadow-xl transition-shadow"
                  onClick={() => handleCardClick(investor.user_id!, "investor")}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-3">
                          <Users className="h-5 w-5 text-primary" />
                          <h3 className="text-lg font-semibold">
                            {investor.organization || "Unnamed Investor"}
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4" />
                            <span>
                              {investor.users_sync?.email || "No email"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              Registered:{" "}
                              {investor.users_sync?.created_at
                                ? new Date(
                                    investor.users_sync.created_at
                                  ).toLocaleDateString()
                                : "Unknown"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4" />
                            <span>
                              {investor.investor_type?.replace(/_/g, " ") ||
                                "No type"}
                            </span>
                          </div>
                        </div>

                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">Position:</span>{" "}
                          {investor.position || "Not specified"} •{" "}
                          <span className="font-medium">Location:</span>{" "}
                          {investor.city || "Not specified"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
