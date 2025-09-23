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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  Users,
  CheckCircle,
  Calendar,
  Mail,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type { startups, investors, users_sync } from "@prisma/client";
// Type for the user metadata from Stack Auth
interface UserMetadata {
  server_metadata?: {
    userType?: string;
    onboarded?: boolean;
    legalVerified?: boolean;
    rejectedAt?: string;
    rejectionReason?: string;
    verifiedAt?: string;
  };
}

type StartupWithUser = startups & {
  users_sync: users_sync | null;
};

type InvestorWithUser = investors & {
  users_sync: users_sync | null;
};

interface VerifyUsersProps {
  pendingStartups: StartupWithUser[];
  approvedStartups: StartupWithUser[];
  rejectedStartups: StartupWithUser[];
  pendingInvestors: InvestorWithUser[];
  approvedInvestors: InvestorWithUser[];
  rejectedInvestors: InvestorWithUser[];
}

export function VerifyUsers({
  pendingStartups,
  approvedStartups,
  rejectedStartups,
  pendingInvestors,
  approvedInvestors,
  rejectedInvestors,
}: VerifyUsersProps) {
  const [filter, setFilter] = useState<"startups" | "investors">("startups");
  const [status, setStatus] = useState<"pending" | "approved" | "rejected">(
    "pending"
  );
  const router = useRouter();

  const handleCardClick = (userId: string) => {
    router.push(`/admin/verification/${userId}`);
  };

  // Get current data based on filters
  const getCurrentData = () => {
    if (filter === "startups") {
      if (status === "pending") return pendingStartups;
      if (status === "approved") return approvedStartups;
      return rejectedStartups;
    } else {
      if (status === "pending") return pendingInvestors;
      if (status === "approved") return approvedInvestors;
      return rejectedInvestors;
    }
  };

  const currentData = getCurrentData();

  return (
    <div className="space-y-6">
      {/* Filters */}
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

      {/* Status Tabs */}
      <Tabs
        value={status}
        onValueChange={(value) =>
          setStatus(value as "pending" | "approved" | "rejected")
        }
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Pending</span>
            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full ml-2">
              {filter === "startups"
                ? pendingStartups.length
                : pendingInvestors.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>Approved</span>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full ml-2">
              {filter === "startups"
                ? approvedStartups.length
                : approvedInvestors.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center space-x-2">
            <XCircle className="h-4 w-4" />
            <span>Rejected</span>
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full ml-2">
              {filter === "startups"
                ? rejectedStartups.length
                : rejectedInvestors.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {renderUsersList(currentData, filter, status, handleCardClick)}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {renderUsersList(currentData, filter, status, handleCardClick)}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {renderUsersList(currentData, filter, status, handleCardClick)}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function renderUsersList(
  data: StartupWithUser[] | InvestorWithUser[],
  filter: "startups" | "investors",
  status: "pending" | "approved" | "rejected",
  handleCardClick: (userId: string) => void
) {
  const isStartups = filter === "startups";
  const Icon = isStartups ? Building2 : Users;
  const title = isStartups
    ? `Startups ${
        status === "pending"
          ? "Pending Verification"
          : status === "approved"
          ? "Approved"
          : "Rejected"
      }`
    : `Investors ${
        status === "pending"
          ? "Pending Verification"
          : status === "approved"
          ? "Approved"
          : "Rejected"
      }`;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold flex items-center space-x-2">
        <Icon className="h-6 w-6" />
        <span>{title}</span>
        <span
          className={`text-sm px-2 py-1 rounded-full ${
            status === "pending"
              ? "bg-orange-100 text-orange-800"
              : status === "approved"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {data.length}
        </span>
      </h2>

      {data.length === 0 ? (
        <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
            <p className="text-muted-foreground">
              No {filter} are currently{" "}
              {status === "pending"
                ? "pending verification"
                : status === "approved"
                ? "in the approved list"
                : "in the rejected list"}
              .
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {data.map((item) => {
            const isStartup = "name" in item;

            // Get rejection info for rejected users
            const userMetadata = item.users_sync?.raw_json as UserMetadata;
            const rejectionReason =
              userMetadata?.server_metadata?.rejectionReason;
            const rejectedAt = userMetadata?.server_metadata?.rejectedAt;

            return (
              <Card
                key={item.id}
                className={`shadow-lg border-0 bg-card/80 backdrop-blur-sm cursor-pointer hover:shadow-xl transition-shadow ${
                  status === "pending"
                    ? "border-l-4 border-l-orange-500"
                    : status === "approved"
                    ? "border-l-4 border-l-green-500"
                    : "border-l-4 border-l-red-500"
                }`}
                onClick={() => handleCardClick(item.user_id!)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-3">
                        <Icon
                          className={`h-5 w-5 ${
                            status === "pending"
                              ? "text-primary"
                              : status === "approved"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        />
                        <h3 className="text-lg font-semibold">
                          {isStartup
                            ? (item as StartupWithUser).name ||
                              "Unnamed Startup"
                            : (item as InvestorWithUser).organization ||
                              "Unnamed Investor"}
                        </h3>
                        {status === "approved" && (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        )}
                        {status === "rejected" && (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4" />
                          <span>{item.users_sync?.email || "No email"}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Registered:{" "}
                            {item.users_sync?.created_at
                              ? new Date(
                                  item.users_sync.created_at
                                ).toLocaleDateString()
                              : "Unknown"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {isStartup ? (
                            <>
                              <Building2 className="h-4 w-4" />
                              <span>
                                {(item as StartupWithUser).industry ||
                                  "No industry"}
                              </span>
                            </>
                          ) : (
                            <>
                              <Users className="h-4 w-4" />
                              <span>
                                {(item as InvestorWithUser).position ||
                                  "No position"}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {isStartup && (item as StartupWithUser).description && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {(item as StartupWithUser).description}
                        </p>
                      )}

                      {!isStartup && (
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">Location:</span>{" "}
                          {(item as InvestorWithUser).city || "Not specified"}
                        </div>
                      )}

                      {/* Show rejection information for rejected users */}
                      {status === "rejected" && (
                        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                          <div className="flex items-center space-x-2 text-red-700 dark:text-red-400 mb-2">
                            <XCircle className="h-4 w-4" />
                            <span className="font-medium">
                              Rejection Details
                            </span>
                          </div>
                          {rejectionReason && (
                            <p className="text-sm text-red-600 dark:text-red-300 mb-1">
                              <span className="font-medium">Reason:</span>{" "}
                              {rejectionReason}
                            </p>
                          )}
                          {rejectedAt && (
                            <p className="text-sm text-red-600 dark:text-red-300">
                              <span className="font-medium">Rejected on:</span>{" "}
                              {new Date(rejectedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
