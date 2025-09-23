import {
  CreditCard,
  Camera,
  FileText,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import type { investors as InvestorProfile } from "@prisma/client";

interface VerificationDocumentsCardProps {
  investor: InvestorProfile;
}

export function VerificationDocumentsCard({
  investor,
}: VerificationDocumentsCardProps) {
  const documents = [
    {
      title: "Government ID",
      url: investor.govt_id_image_url,
      icon: <CreditCard className="h-4 w-4" />,
      required: true,
    },
    {
      title: "Selfie Verification",
      url: investor.selfie_image_url,
      icon: <Camera className="h-4 w-4" />,
      required: true,
    },
    {
      title: "Bank Verification",
      url: investor.proof_of_bank_image_url,
      icon: <FileText className="h-4 w-4" />,
      required: true,
    },
  ];

  return (
    <div className="space-y-4">
      {documents.map((document, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
        >
          <div className="flex items-center gap-3">
            <div className="text-muted-foreground">{document.icon}</div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{document.title}</span>
                {document.required && (
                  <Badge variant="secondary" className="text-xs">
                    Required
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 mt-1">
                {document.url ? (
                  <Badge
                    variant="default"
                    className="text-xs bg-primary/10 text-primary"
                  >
                    Uploaded
                  </Badge>
                ) : document.required ? (
                  <Badge
                    variant="outline"
                    className="text-xs text-muted-foreground"
                  >
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Missing
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    Optional
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {document.url && (
            <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
              <a
                href={document.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">View document</span>
              </a>
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
