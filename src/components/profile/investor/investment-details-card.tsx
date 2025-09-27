import { Calendar, TrendingUp, Banknote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { formatCurrencyAbbreviation } from "@/lib/format-number";
import type { investors as InvestorProfile } from "@prisma/client";

interface InvestmentDetailsCardProps {
  investor: InvestorProfile;
}

export function InvestmentDetailsCard({
  investor,
}: InvestmentDetailsCardProps) {
  const getInvolvementLevelColor = (level: string | null) => {
    if (!level) return "bg-muted text-muted-foreground";
    return "bg-primary/10 text-primary border-primary/20";
  };

  const formatInvolvementLevel = (level: string | null) => {
    if (!level) return "Not specified";
    return level.replace("_", " ");
  };

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-secondary/50 rounded-t-lg border-b border-border/50">
        <CardTitle className="flex items-center space-x-2 text-primary">
          <Banknote className="h-5 w-5" />
          <span>Investment Details</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="bg-secondary/50 p-4 rounded-xl border border-border/30">
          <p className="text-sm font-medium text-muted-foreground mb-1">
            Typical Check Size
          </p>
          <p className="text-3xl font-bold text-primary">
            {investor.typical_check_size_in_php
              ? `${formatCurrencyAbbreviation(
                  Number(investor.typical_check_size_in_php)
                )}`
              : "Not specified"}
          </p>
        </div>

        <div className="flex items-start space-x-3 group">
          <Calendar className="h-4 w-4 mt-1 text-muted-foreground group-hover:text-primary transition-colors" />
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Decision Period
            </p>
            <p className="font-semibold text-foreground">
              {investor.decision_period_in_weeks
                ? `${investor.decision_period_in_weeks} weeks`
                : "Not specified"}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 group">
          <TrendingUp className="h-4 w-4 mt-1 text-muted-foreground group-hover:text-primary transition-colors" />
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Involvement Level
            </p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getInvolvementLevelColor(
                investor.involvement_level
              )}`}
            >
              {formatInvolvementLevel(investor.involvement_level)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
