import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileUploadSection } from "@/components/form/file-upload-section";
import { FormData } from "@/types/form";

interface DocumentUploadCardProps {
  formData: FormData;
  onFileChange: (field: string, file: File | null) => void;
}

export const DocumentUploadCard = ({
  formData,
  onFileChange,
}: DocumentUploadCardProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Required Documents</CardTitle>
      <CardDescription>
        Upload the following documents for verification. All files must be in
        PDF, JPG, JPEG, or PNG format.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <FileUploadSection
        title="Business Name Registration"
        field="businessNameRegistration"
        description="Upload your official business name registration document or certificate"
        formData={formData}
        onFileChange={onFileChange}
      />

      <FileUploadSection
        title="Proof of Bank/Financial Statement"
        field="proofOfBank"
        description="Upload a recent bank statement, certificate of deposit, or financial statement showing your startup's financial capacity"
        formData={formData}
        onFileChange={onFileChange}
      />

      <FileUploadSection
        title="Certificate of Registration"
        field="birCertificate"
        description="Upload your startup's tax registration certificate or incorporation certificate"
        formData={formData}
        onFileChange={onFileChange}
      />

      <FileUploadSection
        title="Valid Government-Issued ID"
        field="governmentId"
        description="Upload a clear copy of the founder's valid government-issued ID"
        formData={formData}
        onFileChange={onFileChange}
      />
    </CardContent>
  </Card>
);
