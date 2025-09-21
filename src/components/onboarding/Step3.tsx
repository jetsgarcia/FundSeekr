"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, Check, Loader2 } from "lucide-react";
import { uploadFile } from "@/actions/onboarding";
import {
  DocumentFiles,
  UserType,
  BusinessStructure,
} from "@/app/onboarding/page";

interface Step3Props {
  userType: UserType;
  businessStructure?: BusinessStructure | null;
  files: DocumentFiles;
  setFiles: (files: DocumentFiles) => void;
  tin: string;
  setTin: (tin: string) => void;
  businessName: string;
  setBusinessName: (businessName: string) => void;
  onSubmit?: () => void;
  onCancel?: () => void;
  onFileUpload?: (fileType: string, url: string) => void;
}

// Add new interface for file upload states
interface FileUploadState {
  isUploading: boolean;
  isUploaded: boolean;
  url: string | null;
  error: string | null;
}

export function Step3({
  userType,
  businessStructure,
  files,
  setFiles,
  tin,
  setTin,
  businessName,
  setBusinessName,
  onSubmit,
  onCancel,
  onFileUpload,
}: Step3Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track upload states for each file
  const [uploadStates, setUploadStates] = useState<
    Record<string, FileUploadState>
  >({
    validId: { isUploading: false, isUploaded: false, url: null, error: null },
    proofOfBank: {
      isUploading: false,
      isUploaded: false,
      url: null,
      error: null,
    },
    selfie: { isUploading: false, isUploaded: false, url: null, error: null },
    birCor: { isUploading: false, isUploaded: false, url: null, error: null },
  });

  const validateFile = (file: File | null, field: string): string => {
    if (!file) return `${field} is required`;

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

  const validateTin = (value: string): string => {
    if (!value) return "TIN is required";
    if (!/^\d{9}$/.test(value)) return "TIN must be exactly 9 digits";
    return "";
  };

  const validateBusinessName = (value: string): string => {
    if (!value.trim()) return "Business name is required";
    if (value.trim().length < 2)
      return "Business name must be at least 2 characters";
    return "";
  };

  const handleFileChange =
    (field: keyof DocumentFiles) =>
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      if (!file) return;

      // Client-side validation
      const error = validateFile(
        file,
        field.replace(/([A-Z])/g, " $1").toLowerCase()
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

          // Notify parent component about the uploaded file URL
          onFileUpload?.(field, result.url);
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

  const handleTinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 9);
    setTin(value);
    const error = validateTin(value);
    setErrors((prev) => ({ ...prev, tin: error }));
  };

  const handleBusinessNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBusinessName(value);
    const error = validateBusinessName(value);
    setErrors((prev) => ({ ...prev, businessName: error }));
  };

  const isValid = () => {
    // Check that required files are uploaded successfully
    const requiredFiles: string[] = ["validId", "proofOfBank"];

    if (userType === "investor") {
      requiredFiles.push("selfie");
      // Also validate TIN for investors
      const tinError = validateTin(tin);
      if (tinError) return false;
    }

    if (userType === "startup") {
      requiredFiles.push("birCor");
      // Also validate business name for startups
      const businessNameError = validateBusinessName(businessName);
      if (businessNameError) return false;
    }

    // Check if all required files are uploaded
    return requiredFiles.every((field) => uploadStates[field]?.isUploaded);
  };

  const handleSubmit = async () => {
    if (!isValid()) return;

    setIsSubmitting(true);
    try {
      // Call the parent submit function
      await onSubmit?.();
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-5xl mx-auto space-y-8">
        <Card className="w-full shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="space-y-6 pt-8 pb-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                Verification Documents
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-lg">
                {userType === "startup"
                  ? `Please upload the required documents for ${businessStructure?.toLowerCase()} verification`
                  : "Please upload the required documents for verification"}
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Business Name - Only for startups */}
            {userType === "startup" && (
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="businessName"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  {businessStructure === "Sole"
                    ? "DTI Registered Business Name"
                    : "SEC Registered Business Name"}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="businessName"
                  type="text"
                  value={businessName}
                  onChange={handleBusinessNameChange}
                  className={`border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100 ${
                    errors.businessName
                      ? "border-red-500"
                      : businessName && !errors.businessName
                      ? "border-green-500"
                      : ""
                  }`}
                  placeholder={
                    businessStructure === "Sole"
                      ? "Enter your DTI registered business name"
                      : "Enter your SEC registered business name"
                  }
                />
                {errors.businessName && (
                  <p className="text-red-500 text-sm">{errors.businessName}</p>
                )}
              </div>
            )}

            {/* Valid ID */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Non-expired Government-issued ID with Specimen Signature{" "}
                <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
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
                      : "border-slate-300 dark:border-slate-600 hover:border-blue-500"
                  } ${
                    uploadStates.validId.isUploading ? "cursor-not-allowed" : ""
                  }`}
                >
                  <div className="text-center">
                    {uploadStates.validId.isUploading ? (
                      <>
                        <Loader2 className="w-8 h-8 text-blue-600 mx-auto mb-2 animate-spin" />
                        <span className="text-blue-700 dark:text-blue-300 text-sm">
                          Uploading...
                        </span>
                      </>
                    ) : uploadStates.validId.isUploaded ? (
                      <>
                        <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <span className="text-green-700 dark:text-green-300 text-sm">
                          Valid ID uploaded successfully
                        </span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <span className="text-slate-600 dark:text-slate-400">
                          Click to upload Valid ID
                        </span>
                      </>
                    )}
                  </div>
                </label>
                {errors.validId && (
                  <p className="text-red-500 text-sm">{errors.validId}</p>
                )}
                {uploadStates.validId.error && (
                  <p className="text-red-500 text-sm">
                    {uploadStates.validId.error}
                  </p>
                )}
              </div>
            </div>

            {/* Proof of Bank */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Proof of Bank <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="proofOfBank"
                  onChange={handleFileChange("proofOfBank")}
                />
                <label
                  htmlFor="proofOfBank"
                  className={`flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    files.proofOfBank
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-slate-300 dark:border-slate-600 hover:border-blue-500"
                  }`}
                >
                  <div className="text-center">
                    {files.proofOfBank ? (
                      <>
                        <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <span className="text-green-700 dark:text-green-300 text-sm">
                          {files.proofOfBank.name}
                        </span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <span className="text-slate-600 dark:text-slate-400">
                          Click to upload Proof of Bank
                        </span>
                      </>
                    )}
                  </div>
                </label>
                {errors.proofOfBank && (
                  <p className="text-red-500 text-sm">{errors.proofOfBank}</p>
                )}
              </div>
            </div>

            {/* TIN - Only for investors */}
            {userType === "investor" && (
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="tin"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  TIN <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tin"
                  type="text"
                  value={tin}
                  onChange={handleTinChange}
                  className={`border-slate-200 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-700 dark:text-slate-100 ${
                    errors.tin
                      ? "border-red-500"
                      : tin && !errors.tin
                      ? "border-green-500"
                      : ""
                  }`}
                  placeholder="123456789"
                  maxLength={9}
                />
                {errors.tin && (
                  <p className="text-red-500 text-sm">{errors.tin}</p>
                )}
              </div>
            )}

            {/* Selfie - Only for investors */}
            {userType === "investor" && (
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Selfie <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="selfie"
                    onChange={handleFileChange("selfie")}
                  />
                  <label
                    htmlFor="selfie"
                    className={`flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      files.selfie
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : "border-slate-300 dark:border-slate-600 hover:border-blue-500"
                    }`}
                  >
                    <div className="text-center">
                      {files.selfie ? (
                        <>
                          <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
                          <span className="text-green-700 dark:text-green-300 text-sm">
                            {files.selfie.name}
                          </span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                          <span className="text-slate-600 dark:text-slate-400">
                            Click to upload Selfie
                          </span>
                        </>
                      )}
                    </div>
                  </label>
                  {errors.selfie && (
                    <p className="text-red-500 text-sm">{errors.selfie}</p>
                  )}
                </div>
              </div>
            )}

            {/* Startup-specific documents */}
            {userType === "startup" && (
              <>
                {/* BIR COR (Form 2303) - Required for all startups */}
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    BIR COR (Form 2303) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      id="birCor"
                      onChange={handleFileChange("birCor")}
                    />
                    <label
                      htmlFor="birCor"
                      className={`flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                        files.birCor
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                          : "border-slate-300 dark:border-slate-600 hover:border-blue-500"
                      }`}
                    >
                      <div className="text-center">
                        {files.birCor ? (
                          <>
                            <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
                            <span className="text-green-700 dark:text-green-300 text-sm">
                              {files.birCor.name}
                            </span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                            <span className="text-slate-600 dark:text-slate-400">
                              Click to upload BIR COR (Form 2303)
                            </span>
                          </>
                        )}
                      </div>
                    </label>
                    {errors.birCor && (
                      <p className="text-red-500 text-sm">{errors.birCor}</p>
                    )}
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end gap-3 pt-6">
              <Button
                variant="outline"
                className="px-6"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Back
              </Button>
              <Button
                className="px-6"
                onClick={handleSubmit}
                disabled={!isValid() || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
