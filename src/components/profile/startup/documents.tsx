import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  ExternalLink,
  FileImage,
  FileVideo,
  FileSpreadsheet,
  File,
} from "lucide-react";

interface Document {
  link?: string | null;
  type?: string | null;
  title?: string | null;
}

interface DocumentsProps {
  documents: Document[];
}

const getDocumentIcon = (type: string | null | undefined) => {
  switch (type?.toLowerCase()) {
    case "presentation":
      return <FileImage className="h-4 w-4" />;
    case "video":
      return <FileVideo className="h-4 w-4" />;
    case "spreadsheet":
      return <FileSpreadsheet className="h-4 w-4" />;
    case "document":
    case "report":
      return <FileText className="h-4 w-4" />;
    default:
      return <File className="h-4 w-4" />;
  }
};

const getTypeColor = (type: string | null | undefined) => {
  switch (type?.toLowerCase()) {
    case "presentation":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "video":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    case "spreadsheet":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "document":
    case "report":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

export function Documents({ documents }: DocumentsProps) {
  if (!documents || documents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground italic">No documents available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Documents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {documents.map((document, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="text-muted-foreground">
                  {getDocumentIcon(document.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground truncate">
                    {document.title || `Document ${index + 1}`}
                  </h4>
                  {document.type && (
                    <Badge
                      variant="secondary"
                      className={`text-xs mt-1 ${getTypeColor(document.type)}`}
                    >
                      {document.type}
                    </Badge>
                  )}
                </div>
              </div>
              {document.link && (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-8 w-8 p-0"
                >
                  <a
                    href={document.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">Open document</span>
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
