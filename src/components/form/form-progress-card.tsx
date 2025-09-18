import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormData } from "@/types/form";

interface FormProgressCardProps {
  formData: FormData;
  isSubmitting: boolean;
  isFormValid: () => boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const FormProgressCard = ({
  formData,
  isSubmitting,
  isFormValid,
  onSubmit,
}: FormProgressCardProps) => (
  <Card>
    <CardContent className="pt-6">
      <div className="space-y-4">
        <div className="bg-muted rounded-lg p-4">
          <h3 className="font-medium mb-2">Form Completion Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
            <div
              className={`flex items-center space-x-2 ${
                formData.businessName
                  ? "text-green-600"
                  : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  formData.businessName ? "bg-green-600" : "bg-gray-300"
                }`}
              />
              <span>Startup Info</span>
            </div>
            <div
              className={`flex items-center space-x-2 ${
                formData.businessNameRegistration
                  ? "text-green-600"
                  : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  formData.businessNameRegistration
                    ? "bg-green-600"
                    : "bg-gray-300"
                }`}
              />
              <span>Name Registration</span>
            </div>
            <div
              className={`flex items-center space-x-2 ${
                formData.proofOfBank
                  ? "text-green-600"
                  : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  formData.proofOfBank ? "bg-green-600" : "bg-gray-300"
                }`}
              />
              <span>Financial Proof</span>
            </div>
            <div
              className={`flex items-center space-x-2 ${
                formData.birCertificate
                  ? "text-green-600"
                  : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  formData.birCertificate ? "bg-green-600" : "bg-gray-300"
                }`}
              />
              <span>Registration Certificate</span>
            </div>
            <div
              className={`flex items-center space-x-2 ${
                formData.governmentId
                  ? "text-green-600"
                  : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  formData.governmentId ? "bg-green-600" : "bg-gray-300"
                }`}
              />
              <span>Founder ID</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            type="submit"
            disabled={!isFormValid() || isSubmitting}
            className="flex-1"
            onClick={onSubmit}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Submitting...
              </>
            ) : (
              "Submit Startup Verification Form"
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
          >
            Back
          </Button>
        </div>

        {!isFormValid() && (
          <p className="text-sm text-muted-foreground text-center">
            Please complete all required fields and upload all documents to
            submit the form.
          </p>
        )}
      </div>
    </CardContent>
  </Card>
);
