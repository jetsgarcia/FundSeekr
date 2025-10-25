"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Check, Loader2 } from "lucide-react";
import { uploadFile, finalizeStartupOnboarding } from "@/actions/onboarding";

interface StartupStep4Props {
  setStep: (step: number) => void;
}

interface DocumentFiles {
  validId: File | null;
  birCor: File | null;
  proofOfBank: File | null;
}

interface FileUploadState {
  isUploading: boolean;
  isUploaded: boolean;
  url: string | null;
  error: string | null;
}

export default function StartupStep4({ setStep }: StartupStep4Props) {
  const router = useRouter();

  const [files, setFiles] = useState<DocumentFiles>({
    validId: null,
    birCor: null,
    proofOfBank: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track upload states for each file
  const [uploadStates, setUploadStates] = useState<
    Record<string, FileUploadState>
  >({
    validId: { isUploading: false, isUploaded: false, url: null, error: null },
    birCor: {
      isUploading: false,
      isUploaded: false,
      url: null,
      error: null,
    },
    proofOfBank: {
      isUploading: false,
      isUploaded: false,
      url: null,
      error: null,
    },
  });

  const validateFile = (
    file: File | null,
    field: string,
    isOptional = false
  ): string => {
    if (!file) {
      if (isOptional) return "";
      return `${field} is required`;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      return "Must be an image (JPEG, PNG) or PDF file";
    }

    if (file.size > 4 * 1024 * 1024) return "File size must be less than 4MB";
    return "";
  };

  const handleFileChange =
    (field: keyof DocumentFiles) =>
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      if (!file) return;

      // Client-side validation (proof of bank is optional)
      const isOptional = field === "proofOfBank";
      const error = validateFile(
        file,
        field.replace(/([A-Z])/g, " $1").toLowerCase(),
        isOptional
      );
      if (error) {
        setErrors((prev) => ({ ...prev, [field]: error }));
        return;
      }

      // Clear any previous errors
      setErrors((prev) => ({ ...prev, [field]: "" }));

      // Set uploading state
      setUploadStates((prev) => ({
        ...prev,
        [field]: {
          isUploading: true,
          isUploaded: false,
          url: null,
          error: null,
        },
      }));

      try {
        // Create FormData for individual file upload
        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileType", field);

        // Upload file
        const result = await uploadFile(formData);

        if (result.success && result.url) {
          // Update file state and upload state
          setFiles({ ...files, [field]: file });
          setUploadStates((prev) => ({
            ...prev,
            [field]: {
              isUploading: false,
              isUploaded: true,
              url: result.url,
              error: null,
            },
          }));
        } else {
          // Handle upload error
          setUploadStates((prev) => ({
            ...prev,
            [field]: {
              isUploading: false,
              isUploaded: false,
              url: null,
              error: result.error || "Upload failed",
            },
          }));
        }
      } catch {
        setUploadStates((prev) => ({
          ...prev,
          [field]: {
            isUploading: false,
            isUploaded: false,
            url: null,
            error: "Upload failed",
          },
        }));
      }
    };

  const isValid = () => {
    // Check that required files are uploaded successfully
    const requiredFiles: (keyof DocumentFiles)[] = ["validId", "birCor"];

    return requiredFiles.every((field) => uploadStates[field]?.isUploaded);
  };

  const handleFinish = async () => {
    if (!isValid()) return;

    setIsSubmitting(true);
    try {
      // Get uploaded file URLs
      const documentUrls = {
        validIdUrl: uploadStates.validId.url!,
        birCorUrl: uploadStates.birCor.url!,
        proofOfBankUrl: uploadStates.proofOfBank.url || null,
      };

      // Submit to finalize onboarding
      await finalizeStartupOnboarding(documentUrls);

      // Navigate to home/dashboard
      router.push("/home");
    } catch (error) {
      console.error("Submission error:", error);
      setErrors({
        submit: error instanceof Error ? error.message : "Submission failed",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setStep(3);
  };

  return (
    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
      {/* Document Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Verification Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-6">
            Please upload the required documents for startup verification. All
            documents must be clear, readable, and in PDF or image format (max
            4MB each).
          </p>
          <div className="space-y-6">
            {/* Valid ID */}
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="validId">
                Valid Government-issued ID with Specimen Signature{" "}
                <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  id="validId"
                  onChange={handleFileChange("validId")}
                  disabled={uploadStates.validId.isUploading}
                />
                <label
                  htmlFor="validId"
                  className={`flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    uploadStates.validId.isUploaded
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : uploadStates.validId.isUploading
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-input hover:border-primary"
                  } ${
                    uploadStates.validId.isUploading ? "cursor-not-allowed" : ""
                  }`}
                >
                  <div className="text-center">
                    {uploadStates.validId.isUploading ? (
                      <>
                        <Loader2 className="w-8 h-8 text-primary mx-auto mb-2 animate-spin" />
                        <span className="text-primary text-sm">
                          Uploading...
                        </span>
                      </>
                    ) : uploadStates.validId.isUploaded ? (
                      <>
                        <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <span className="text-green-600 text-sm">
                          Valid ID uploaded successfully
                        </span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <span className="text-muted-foreground text-sm">
                          Click to upload Valid ID
                        </span>
                      </>
                    )}
                  </div>
                </label>
                {errors.validId && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.validId}
                  </p>
                )}
                {uploadStates.validId.error && (
                  <p className="text-sm text-destructive mt-1">
                    {uploadStates.validId.error}
                  </p>
                )}
              </div>
            </div>

            {/* BIR COR */}
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="birCor">
                BIR Certificate of Registration (COR){" "}
                <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  id="birCor"
                  onChange={handleFileChange("birCor")}
                  disabled={uploadStates.birCor.isUploading}
                />
                <label
                  htmlFor="birCor"
                  className={`flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    uploadStates.birCor.isUploaded
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : uploadStates.birCor.isUploading
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-input hover:border-primary"
                  } ${
                    uploadStates.birCor.isUploading ? "cursor-not-allowed" : ""
                  }`}
                >
                  <div className="text-center">
                    {uploadStates.birCor.isUploading ? (
                      <>
                        <Loader2 className="w-8 h-8 text-primary mx-auto mb-2 animate-spin" />
                        <span className="text-primary text-sm">
                          Uploading...
                        </span>
                      </>
                    ) : uploadStates.birCor.isUploaded ? (
                      <>
                        <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <span className="text-green-600 text-sm">
                          BIR/DTI document uploaded successfully
                        </span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <span className="text-muted-foreground text-sm">
                          Click to upload BIR COR or DTI Registration
                        </span>
                      </>
                    )}
                  </div>
                </label>
                {errors.birCor && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.birCor}
                  </p>
                )}
                {uploadStates.birCor.error && (
                  <p className="text-sm text-destructive mt-1">
                    {uploadStates.birCor.error}
                  </p>
                )}
              </div>
            </div>

            {/* Proof of Bank */}
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="proofOfBank">Proof of Bank</Label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  id="proofOfBank"
                  onChange={handleFileChange("proofOfBank")}
                  disabled={uploadStates.proofOfBank.isUploading}
                />
                <label
                  htmlFor="proofOfBank"
                  className={`flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    uploadStates.proofOfBank.isUploaded
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : uploadStates.proofOfBank.isUploading
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-input hover:border-primary"
                  } ${
                    uploadStates.proofOfBank.isUploading
                      ? "cursor-not-allowed"
                      : ""
                  }`}
                >
                  <div className="text-center">
                    {uploadStates.proofOfBank.isUploading ? (
                      <>
                        <Loader2 className="w-8 h-8 text-primary mx-auto mb-2 animate-spin" />
                        <span className="text-primary text-sm">
                          Uploading...
                        </span>
                      </>
                    ) : uploadStates.proofOfBank.isUploaded ? (
                      <>
                        <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <span className="text-green-600 text-sm">
                          Proof of Bank uploaded successfully
                        </span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <span className="text-muted-foreground text-sm">
                          Click to upload Proof of Bank (Optional)
                        </span>
                      </>
                    )}
                  </div>
                </label>
                {errors.proofOfBank && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.proofOfBank}
                  </p>
                )}
                {uploadStates.proofOfBank.error && (
                  <p className="text-sm text-destructive mt-1">
                    {uploadStates.proofOfBank.error}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{errors.submit}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end">
        <div className="space-x-4">
          <Button type="button" variant="outline" onClick={handleBack}>
            Back
          </Button>

          <Button
            type="button"
            onClick={handleFinish}
            disabled={!isValid() || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Finishing...
              </>
            ) : (
              "Finish"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
