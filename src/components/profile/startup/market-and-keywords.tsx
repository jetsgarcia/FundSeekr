import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Tag } from "lucide-react";

interface MarketAndKeywordsProps {
  target_market: string[];
  keywords: string[];
}

export function MarketAndKeywords({
  target_market,
  keywords,
}: MarketAndKeywordsProps) {
  const hasTargetMarket = target_market && target_market.length > 0;
  const hasKeywords = keywords && keywords.length > 0;

  if (!hasTargetMarket && !hasKeywords) {
    return null;
  }

  return (
    <div className="space-y-6">
      {hasTargetMarket && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Target Market
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {target_market.map((market, index) => (
                <Badge key={index} variant="default" className="px-3 py-1">
                  {market}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {hasKeywords && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Keywords
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <Badge key={index} variant="outline" className="px-3 py-1">
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
