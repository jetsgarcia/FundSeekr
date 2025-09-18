"use client";

import React from "react";
import { BusinessInformationCard } from "@/components/form/business-information-card";
import { DocumentUploadCard } from "@/components/form/document-upload-card";
import { FormProgressCard } from "@/components/form/form-progress-card";
import { ImportantNotesCard } from "@/components/form/important-notes-card";
import { useFormState } from "@/hooks/use-form-state";

export default function StartupVerificationForm() {
  const {
    formData,
    isSubmitting,
    handleInputChange,
    handleFileChange,
    isFormValid,
    handleSubmit,
  } = useFormState();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Startup Verification Form
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Submit your startup information and required documents for global
            verification. This process helps establish trust and credibility
            with potential investors and partners.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Information Section */}
          <BusinessInformationCard
            formData={formData}
            onInputChange={handleInputChange}
          />

          {/* Document Upload Section */}
          <DocumentUploadCard
            formData={formData}
            onFileChange={handleFileChange}
          />

          {/* Form Progress and Submit Section */}
          <FormProgressCard
            formData={formData}
            isSubmitting={isSubmitting}
            isFormValid={isFormValid}
            onSubmit={handleSubmit}
          />

          {/* Important Notes */}
          <ImportantNotesCard />
        </form>
      </div>
    </div>
  );
}
