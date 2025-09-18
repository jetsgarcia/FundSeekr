import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormData, FormDataKey } from "@/types/form";

interface FileUploadSectionProps {
  title: string;
  field: FormDataKey;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  formData: FormData;
  onFileChange: (field: string, file: File | null) => void;
}

export const FileUploadSection = ({
  title,
  field,
  description,
  icon: Icon,
  formData,
  onFileChange,
}: FileUploadSectionProps) => (
  <div className="space-y-2">
    <div className="flex items-center space-x-2">
      {Icon && <Icon className="h-4 w-4 text-blue-600" />}
      <Label htmlFor={field} className="text-sm font-medium">
        {title} <span className="text-red-500">*</span>
      </Label>
    </div>
    <p className="text-xs text-muted-foreground">{description}</p>
    <div className="relative">
      <Input
        id={field}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) => onFileChange(field, e.target.files?.[0] || null)}
        className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
    </div>
    {formData[field] && (
      <p className="text-xs text-green-600">
        ✓ {(formData[field] as File).name} uploaded
      </p>
    )}
  </div>
);
