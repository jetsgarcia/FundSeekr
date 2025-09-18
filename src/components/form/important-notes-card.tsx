import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ImportantNotesCard = () => (
  <Card className="mt-6">
    <CardHeader>
      <CardTitle className="text-lg">Important Notes</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2 text-sm text-muted-foreground">
        <li>
          • All startup information provided must be accurate and up-to-date
        </li>
        <li>• Documents should be clear and legible</li>
        <li>
          • You will receive an email confirmation once your startup application
          is reviewed
        </li>
        <li>
          • For questions, contact our startup support team at
          paul.igop@fundseekr.com
        </li>
      </ul>
    </CardContent>
  </Card>
);
