import { Building2, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { formatCurrencyAbbreviation } from "@/lib/format-number";
import type { investors as InvestorProfile } from "@prisma/client";
import { Prisma } from "@prisma/client";

type NotableExit = Prisma.JsonObject & {
  company?: string;
  exit_amount?: number | string;
  year?: number | string;
};

interface PortfolioCardsProps {
  investor: InvestorProfile;
}

export function PortfolioCards({ investor }: PortfolioCardsProps) {
  const hasPortfolioCompanies =
    investor.portfolio_companies && investor.portfolio_companies.length > 0;
  const hasNotableExits =
    investor.notable_exits && investor.notable_exits.length > 0;

  return (
    <>
      {/* Portfolio Companies */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-secondary/50 rounded-t-lg border-b border-border/50">
          <CardTitle className="flex items-center space-x-2 text-primary">
            <Building2 className="h-5 w-5" />
            <span>Portfolio Companies</span>
            {hasPortfolioCompanies && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                {investor.portfolio_companies!.length}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {hasPortfolioCompanies ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {investor.portfolio_companies!.map(
                (company: string, index: number) => (
                  <div
                    key={index}
                    className="bg-secondary/50 px-4 py-3 rounded-lg text-sm font-medium border border-border flex items-center space-x-2 hover:shadow-md transition-all"
                  >
                    <Building2 className="h-4 w-4 text-primary" />
                    <span className="text-foreground">{company}</span>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium italic">
                No portfolio companies listed
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notable Exits */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-secondary/50 rounded-t-lg border-b border-border/50">
          <CardTitle className="flex items-center space-x-2 text-primary">
            <TrendingUp className="h-5 w-5" />
            <span>Notable Exits</span>
            {hasNotableExits && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                {investor.notable_exits!.length}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {hasNotableExits ? (
            <div className="space-y-3">
              {investor.notable_exits!.map((exitValue, index: number) => {
                const exit = exitValue as NotableExit;
                return (
                  <div
                    key={index}
                    className="bg-secondary/50 p-4 rounded-lg border border-border hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <div className="text-sm font-semibold text-foreground">
                          {String(exit.company || "Company")}
                        </div>
                      </div>
                      {exit.year !== undefined && exit.year !== null && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {String(exit.year)}
                        </span>
                      )}
                    </div>
                    {exit.exit_amount !== undefined &&
                      exit.exit_amount !== null && (
                        <div className="mt-2 text-lg font-bold text-primary">
                          {formatCurrencyAbbreviation(Number(exit.exit_amount))}
                        </div>
                      )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium italic">
                No notable exits reported
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
