import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Video, Play } from "lucide-react";

interface DescriptionAndDemoProps {
  description: string | null;
  product_demo_url: string | null;
}

export function DescriptionAndDemo({
  description,
  product_demo_url,
}: DescriptionAndDemoProps) {
  return (
    <div className="space-y-6">
      {description && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Company Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {description}
            </p>
          </CardContent>
        </Card>
      )}

      {product_demo_url && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Product Demo
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-4">
              <div className="p-6 bg-muted/30 rounded-lg border-2 border-dashed">
                <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Watch our product demonstration
                </p>
                <Button asChild size="lg">
                  <a
                    href={product_demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    Watch Demo
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
