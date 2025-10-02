"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface Startup {
  id: string;
  name: string;
  industry: string;
  location: string;
  stage: string;
  description: string;
  keyMetrics: string[];
  matchScore: number;
}

interface Investor {
  id: string;
  name: string;
  position: string;
  organization: string;
  location: string;
  typicalCheck: string;
  preferredIndustries: string[];
  fundingStages: string[];
  involvementLevel: string;
  matchScore: number;
}

interface RecommendationsListProps {
  isStartup: boolean;
  startups: Startup[];
  investors: Investor[];
}

function getStageColor(stage: string) {
  switch (stage) {
    case "MVP":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
    case "Seed":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    case "Series A":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "Pre-Series A":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    case "Series B":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
  }
}

function getInvolvementLevelColor(level: string) {
  switch (level) {
    case "Active":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "Strategic":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    case "Passive":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
  }
}

function getMatchScoreColor(score: number) {
  if (score >= 90) return "text-green-600 dark:text-green-400";
  if (score >= 80) return "text-blue-600 dark:text-blue-400";
  if (score >= 70) return "text-yellow-600 dark:text-yellow-400";
  return "text-gray-600 dark:text-gray-400";
}

export default function RecommendationsList({
  isStartup,
  startups,
  investors,
}: RecommendationsListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const data = isStartup ? investors : startups;
  const sortedData = [...data].sort((a, b) => b.matchScore - a.matchScore);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="space-y-4">
      {/* Cards Grid */}
      <div className="space-y-3">
        {isStartup
          ? // Show investors for startups
            (currentData as Investor[]).map((investor) => (
              <Card
                key={investor.id}
                className="group hover:shadow-lg transition-all duration-200 border-border"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col">
                    {/* Header row with investor name and match score */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-1">
                          {investor.name}
                        </h3>
                        <div className="text-sm text-muted-foreground mb-3">
                          {investor.position} at {investor.organization}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground font-medium min-w-[60px]">
                              Location:
                            </span>
                            <span className="text-sm text-foreground">
                              {investor.location}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground font-medium min-w-[60px]">
                              Check:
                            </span>
                            <span className="text-sm text-foreground font-medium">
                              {investor.typicalCheck}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground font-medium min-w-[60px]">
                              Industries:
                            </span>
                            <span className="text-sm text-foreground">
                              {investor.preferredIndustries.join(", ")}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground font-medium min-w-[60px]">
                              Stages:
                            </span>
                            <span className="text-sm text-foreground">
                              {investor.fundingStages.join(", ")}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground font-medium min-w-[60px]">
                              Style:
                            </span>
                            <Badge
                              className={getInvolvementLevelColor(
                                investor.involvementLevel
                              )}
                            >
                              {investor.involvementLevel} Involvement
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0 ml-6">
                        <div className="text-xs text-muted-foreground">
                          Match Score
                        </div>
                        <div
                          className={`text-xl font-bold ${getMatchScoreColor(
                            investor.matchScore
                          )}`}
                        >
                          {investor.matchScore}%
                        </div>
                      </div>
                    </div>

                    {/* Buttons row */}
                    <div className="flex justify-end gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent"
                        asChild
                      >
                        <Link href={`/profile/investor/${investor.id}`}>
                          View Full Profile
                        </Link>
                      </Button>
                      <Button size="sm">Connect with Investor</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          : // Show startups for investors
            (currentData as Startup[]).map((startup) => (
              <Card
                key={startup.id}
                className="group hover:shadow-lg transition-all duration-200 border-border"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col">
                    {/* Header row with startup name and match score */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-3">
                          {startup.name}
                        </h3>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground font-medium min-w-[60px]">
                              Industry:
                            </span>
                            <span className="text-sm text-foreground">
                              {startup.industry}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground font-medium min-w-[60px]">
                              Location:
                            </span>
                            <span className="text-sm text-foreground">
                              {startup.location}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground font-medium min-w-[60px]">
                              Stage:
                            </span>
                            <Badge className={getStageColor(startup.stage)}>
                              {startup.stage}
                            </Badge>
                          </div>

                          <div className="flex items-start gap-2">
                            <span className="text-xs text-muted-foreground font-medium min-w-[60px] pt-0.5">
                              About:
                            </span>
                            <span className="text-sm text-foreground font-medium italic">
                              &quot;{startup.description}&quot;
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground font-medium min-w-[60px]">
                              Metrics:
                            </span>
                            <span className="text-sm text-foreground font-medium">
                              {startup.keyMetrics.join(" | ")}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0 ml-6">
                        <div className="text-xs text-muted-foreground">
                          Match Score
                        </div>
                        <div
                          className={`text-xl font-bold ${getMatchScoreColor(
                            startup.matchScore
                          )}`}
                        >
                          {startup.matchScore}%
                        </div>
                      </div>
                    </div>

                    {/* Buttons row */}
                    <div className="flex justify-end gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent"
                        asChild
                      >
                        <Link href={`/profile/startup/${startup.id}`}>
                          View Full Profile
                        </Link>
                      </Button>
                      <Button size="sm">Connect with Representative</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, sortedData.length)} of{" "}
            {sortedData.length} results
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
