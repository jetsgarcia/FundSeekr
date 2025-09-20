"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, Check } from "lucide-react";

interface Step3Props {
  onSubmit?: () => void;
  onCancel?: () => void;
}

export function Step3({ onSubmit, onCancel }: Step3Props) {
  const [files, setFiles] = useState({
    validId: null as File | null,
    proofOfBank: null as File | null,
    selfie: null as File | null,
  });
  const [tin, setTin] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateFile = (file: File | null, field: string): string => {
    if (!file) return `${field} is required`;
    if (!file.type.startsWith("image/")) return "Must be an image file";
    if (file.size > 5 * 1024 * 1024) return "File size must be less than 5MB";
    return "";
  };

  const validateTin = (value: string): string => {
    if (!value) return "TIN is required";
    if (!/^\d{9}$/.test(value)) return "TIN must be exactly 9 digits";
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

  const isValid = () => {
    const fileErrors = Object.keys(files).map((key) =>
      validateFile(files[key as keyof typeof files], key)
    );
    const tinError = validateTin(tin);
    return !fileErrors.some((e) => e) && !tinError;
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
                Please upload the required documents for verification
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Valid ID */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Valid ID <span className="text-red-500">*</span>
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

            {/* TIN */}
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

            {/* Selfie */}
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

            <div className="flex justify-end gap-3 pt-6">
              <Button variant="outline" className="px-6" onClick={onCancel}>
                Cancel
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
