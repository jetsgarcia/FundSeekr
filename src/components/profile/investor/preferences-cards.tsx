import { Target, TrendingUp, Briefcase, Globe, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import type { investors as InvestorProfile } from "@prisma/client";

interface PreferencesCardsProps {
  investor: InvestorProfile;
}

export function PreferencesCards({ investor }: PreferencesCardsProps) {
  const preferenceCards = [
    {
      title: "Preferred Industries",
      items: investor.preferred_industries,
      icon: Target,
      color: "emerald",
      emptyMessage: "No preferred industries specified",
    },
    {
      title: "Excluded Industries",
      items: investor.excluded_industries,
      icon: X,
      color: "red",
      emptyMessage: "No excluded industries specified",
      isExcluded: true,
    },
    {
      title: "Funding Stages",
      items: investor.preferred_funding_stages,
      icon: TrendingUp,
      color: "blue",
      emptyMessage: "No preferred funding stages specified",
    },
    {
      title: "Business Models",
      items: investor.preferred_business_models,
      icon: Briefcase,
      color: "purple",
      emptyMessage: "No preferred business models specified",
    },
    {
      title: "Geographic Focus",
      items: investor.geographic_focus,
      icon: Globe,
      color: "orange",
      emptyMessage: "No geographic restrictions",
    },
    {
      title: "Value Proposition",
      items: investor.value_proposition,
      icon: Target,
      color: "indigo",
      emptyMessage: "No value propositions specified",
    },
  ];

  const getTagClasses = (isExcluded = false) => {
    if (isExcluded) {
      return "bg-muted text-muted-foreground border-border";
    }
    return "bg-primary/10 text-primary border-primary/20";
  };

  return (
    <>
      {preferenceCards.map((card, index) => {
        const IconComponent = card.icon;
        const hasItems = card.items && card.items.length > 0;

        return (
          <Card
            key={index}
            className="shadow-lg border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
          >
            <CardHeader
              className={`bg-secondary/50 rounded-t-lg border-b border-border/50`}
            >
              <CardTitle className="flex items-center space-x-2 text-primary">
                <IconComponent className="h-5 w-5" />
                <span>{card.title}</span>
                {hasItems && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {card.items!.length}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {hasItems ? (
                <div className="flex flex-wrap gap-2">
                  {card.items!.map((item: string, itemIndex: number) => (
                    <span
                      key={itemIndex}
                      className={`px-3 py-2 rounded-full text-sm font-medium border transition-all hover:scale-105 ${getTagClasses(
                        card.isExcluded
                      )}`}
                    >
                      {card.isExcluded && <X className="inline h-3 w-3 mr-1" />}
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <IconComponent className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-muted-foreground font-medium italic">
                    {card.emptyMessage}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </>
  );
}
