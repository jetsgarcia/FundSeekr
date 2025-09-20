"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, Check } from "lucide-react";

interface Step3Props {
  userType: "investor" | "startup";
  businessStructure?: "Sole" | "Partnership" | "Corporation" | null;
  onSubmit?: () => void;
  onCancel?: () => void;
}

export function Step3({
  userType,
  businessStructure,
  onSubmit,
  onCancel,
}: Step3Props) {
  const [files, setFiles] = useState({
    validId: null as File | null,
    proofOfBank: null as File | null,
    selfie: null as File | null,
    // Startup-specific documents
    birCor: null as File | null,
  });
  const [tin, setTin] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

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

    if (file.size > 5 * 1024 * 1024) return "File size must be less than 5MB";
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
    (field: keyof typeof files) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      setFiles((prev) => ({ ...prev, [field]: file }));
      const error = validateFile(
        file,
        field.replace(/([A-Z])/g, " $1").toLowerCase()
      );
      setErrors((prev) => ({ ...prev, [field]: error }));
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
    // Common documents for both investors and startups
    const commonFiles = ["validId", "proofOfBank"];
    const commonErrors = commonFiles.map((key) =>
      validateFile(files[key as keyof typeof files], key)
    );

    // For investors, also validate TIN and selfie
    if (userType === "investor") {
      commonErrors.push(validateFile(files.selfie, "selfie"));
      const tinError = validateTin(tin);
      if (tinError) commonErrors.push(tinError);
    }

    // Additional validation for startups
    if (userType === "startup") {
      const startupErrors = [];

      // Business name is required for startups
      const businessNameError = validateBusinessName(businessName);
      if (businessNameError) startupErrors.push(businessNameError);

      // BIR COR is required for all startups
      startupErrors.push(validateFile(files.birCor, "BIR COR"));

      return !commonErrors.some((e) => e) && !startupErrors.some((e) => e);
    }

    // For investors, validate common files plus TIN and selfie
    return !commonErrors.some((e) => e);
  };

  const handleSubmit = () => {
    if (isValid()) {
      onSubmit?.();
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
                />
                <label
                  htmlFor="validId"
                  className={`flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    files.validId
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-slate-300 dark:border-slate-600 hover:border-blue-500"
                  }`}
                >
                  <div className="text-center">
                    {files.validId ? (
                      <>
                        <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <span className="text-green-700 dark:text-green-300 text-sm">
                          {files.validId.name}
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
              <Button variant="outline" className="px-6" onClick={onCancel}>
                Back
              </Button>
              <Button
                className="px-6"
                onClick={handleSubmit}
                disabled={!isValid()}
              >
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
