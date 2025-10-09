"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, Building2, Upload, Check, Loader2 } from "lucide-react";
import { createStartupProfile } from "@/actions/create-startup-profile";
import { uploadFile } from "@/actions/onboarding";
import { toast } from "sonner";

// File upload state interface
interface FileUploadState {
  isUploading: boolean;
  isUploaded: boolean;
  url: string | null;
  error: string | null;
}

export default function NewStartupProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    business_structure: "" as "Sole" | "Partnership" | "Corporation" | "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Track upload states for each file
  const [uploadStates, setUploadStates] = useState<
    Record<string, FileUploadState>
  >({
    govt_id: { isUploading: false, isUploaded: false, url: null, error: null },
    bir_cor: { isUploading: false, isUploaded: false, url: null, error: null },
    proof_of_bank: {
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
    (field: string) => async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      if (!file) return;

      // Client-side validation
      const isOptional = field === "proof_of_bank";
      const error = validateFile(file, field.replace(/_/g, " "), isOptional);
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
          // Update upload state
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Startup name is required";
    }

    if (!formData.business_structure) {
      newErrors.business_structure = "Business structure is required";
    }

    if (!uploadStates.govt_id.isUploaded) {
      newErrors.govt_id = "Government ID is required";
    }

    if (!uploadStates.bir_cor.isUploaded) {
      newErrors.bir_cor = "BIR/COR document is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await createStartupProfile({
        name: formData.name,
        business_structure: formData.business_structure as
          | "Sole"
          | "Partnership"
          | "Corporation",
        govt_id_image_url: uploadStates.govt_id.url!,
        bir_cor_image_url: uploadStates.bir_cor.url!,
        proof_of_bank_image_url: uploadStates.proof_of_bank.url || undefined,
      });

      if (result.ok) {
        toast.success("Startup profile created successfully!");
        router.push("/profile");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Error creating startup profile:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Create New Startup Profile
              </CardTitle>
              <p className="text-center text-muted-foreground">
                Add another startup to your portfolio
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Startup Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Startup Name <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="pl-10"
                      placeholder="Enter your startup name"
                    />
                  </div>
                  {errors.name && (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      {errors.name}
                    </div>
                  )}
                </div>

                {/* Business Structure */}
                <div className="space-y-3">
                  <Label>
                    Business Structure <span className="text-red-500">*</span>
                  </Label>
                  <div className="grid grid-cols-1 gap-3">
                    {["Corporation", "Partnership", "Sole"].map((structure) => (
                      <button
                        key={structure}
                        type="button"
                        onClick={() =>
                          handleInputChange("business_structure", structure)
                        }
                        className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                          formData.business_structure === structure
                            ? "border-primary bg-primary/5"
                            : "border-muted hover:border-primary/50 hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium">
                              {structure === "Sole"
                                ? "Sole Proprietorship"
                                : structure}
                            </span>
                            <p className="text-xs text-muted-foreground mt-1">
                              {structure === "Corporation" &&
                                "Separate legal entity, limited liability"}
                              {structure === "Partnership" &&
                                "Shared ownership and responsibilities"}
                              {structure === "Sole" &&
                                "Single owner, simplest business structure"}
                            </p>
                          </div>
                          {formData.business_structure === structure && (
                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  {errors.business_structure && (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      {errors.business_structure}
                    </div>
                  )}
                </div>

                {/* Document Upload Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Verification Documents
                  </h3>

                  {/* Government ID */}
                  <div className="space-y-2">
                    <Label>
                      Government ID <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="govt_id"
                        onChange={handleFileChange("govt_id")}
                        disabled={uploadStates.govt_id.isUploading}
                      />
                      <label
                        htmlFor="govt_id"
                        className={`flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                          uploadStates.govt_id.isUploaded
                            ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                            : uploadStates.govt_id.isUploading
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-muted hover:border-primary/50"
                        } ${
                          uploadStates.govt_id.isUploading
                            ? "cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <div className="text-center">
                          {uploadStates.govt_id.isUploading ? (
                            <>
                              <Loader2 className="w-8 h-8 text-blue-600 mx-auto mb-2 animate-spin" />
                              <span className="text-blue-700 dark:text-blue-300 text-sm">
                                Uploading...
                              </span>
                            </>
                          ) : uploadStates.govt_id.isUploaded ? (
                            <>
                              <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
                              <span className="text-green-700 dark:text-green-300 text-sm">
                                Government ID uploaded successfully
                              </span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                              <span className="text-muted-foreground">
                                Click to upload Government ID
                              </span>
                            </>
                          )}
                        </div>
                      </label>
                      {errors.govt_id && (
                        <div className="flex items-center gap-2 text-sm text-red-600 mt-2">
                          <AlertCircle className="h-4 w-4" />
                          {errors.govt_id}
                        </div>
                      )}
                      {uploadStates.govt_id.error && (
                        <div className="flex items-center gap-2 text-sm text-red-600 mt-2">
                          <AlertCircle className="h-4 w-4" />
                          {uploadStates.govt_id.error}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* BIR/COR Document */}
                  <div className="space-y-2">
                    <Label>
                      BIR/COR Document <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        id="bir_cor"
                        onChange={handleFileChange("bir_cor")}
                        disabled={uploadStates.bir_cor.isUploading}
                      />
                      <label
                        htmlFor="bir_cor"
                        className={`flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                          uploadStates.bir_cor.isUploaded
                            ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                            : uploadStates.bir_cor.isUploading
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-muted hover:border-primary/50"
                        } ${
                          uploadStates.bir_cor.isUploading
                            ? "cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <div className="text-center">
                          {uploadStates.bir_cor.isUploading ? (
                            <>
                              <Loader2 className="w-8 h-8 text-blue-600 mx-auto mb-2 animate-spin" />
                              <span className="text-blue-700 dark:text-blue-300 text-sm">
                                Uploading...
                              </span>
                            </>
                          ) : uploadStates.bir_cor.isUploaded ? (
                            <>
                              <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
                              <span className="text-green-700 dark:text-green-300 text-sm">
                                BIR/COR document uploaded successfully
                              </span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                              <span className="text-muted-foreground">
                                Click to upload BIR/COR document
                              </span>
                            </>
                          )}
                        </div>
                      </label>
                      {errors.bir_cor && (
                        <div className="flex items-center gap-2 text-sm text-red-600 mt-2">
                          <AlertCircle className="h-4 w-4" />
                          {errors.bir_cor}
                        </div>
                      )}
                      {uploadStates.bir_cor.error && (
                        <div className="flex items-center gap-2 text-sm text-red-600 mt-2">
                          <AlertCircle className="h-4 w-4" />
                          {uploadStates.bir_cor.error}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Proof of Bank (Optional) */}
                  <div className="space-y-2">
                    <Label>Proof of Bank (Optional)</Label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="proof_of_bank"
                        onChange={handleFileChange("proof_of_bank")}
                        disabled={uploadStates.proof_of_bank.isUploading}
                      />
                      <label
                        htmlFor="proof_of_bank"
                        className={`flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                          uploadStates.proof_of_bank.isUploaded
                            ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                            : uploadStates.proof_of_bank.isUploading
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-muted hover:border-primary/50"
                        } ${
                          uploadStates.proof_of_bank.isUploading
                            ? "cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <div className="text-center">
                          {uploadStates.proof_of_bank.isUploading ? (
                            <>
                              <Loader2 className="w-8 h-8 text-blue-600 mx-auto mb-2 animate-spin" />
                              <span className="text-blue-700 dark:text-blue-300 text-sm">
                                Uploading...
                              </span>
                            </>
                          ) : uploadStates.proof_of_bank.isUploaded ? (
                            <>
                              <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
                              <span className="text-green-700 dark:text-green-300 text-sm">
                                Proof of bank uploaded successfully
                              </span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                              <span className="text-muted-foreground">
                                Click to upload proof of bank
                              </span>
                            </>
                          )}
                        </div>
                      </label>
                      {uploadStates.proof_of_bank.error && (
                        <div className="flex items-center gap-2 text-sm text-red-600 mt-2">
                          <AlertCircle className="h-4 w-4" />
                          {uploadStates.proof_of_bank.error}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? "Creating..." : "Create Startup Profile"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
