import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield,
  CreditCard,
  FileText,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";

interface VerificationDocumentsProps {
  govt_id_image_url: string;
  bir_cor_image_url: string;
  proof_of_bank_image_url: string | null;
}

export function VerificationDocuments({
  govt_id_image_url,
  bir_cor_image_url,
  proof_of_bank_image_url,
}: VerificationDocumentsProps) {
  const documents = [
    {
      title: "Government ID",
      url: govt_id_image_url,
      icon: <CreditCard className="h-4 w-4" />,
      required: true,
    },
    {
      title: "BIR Certificate of Registration",
      url: bir_cor_image_url,
      icon: <FileText className="h-4 w-4" />,
      required: true,
    },
    {
      title: "Bank Verification",
      url: proof_of_bank_image_url,
      icon: <CreditCard className="h-4 w-4" />,
      required: false,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Verification Documents
        </CardTitle>
      </CardHeader>
      <CardContent>
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
                    <span className="font-medium text-sm">
                      {document.title}
                    </span>
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
                        className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      >
                        Uploaded
                      </Badge>
                    ) : document.required ? (
                      <Badge variant="destructive" className="text-xs">
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
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-8 w-8 p-0"
                >
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
      </CardContent>
    </Card>
  );
}
