import { useState } from "react";
import type { FormData } from "@/types/form";

const initialFormData: FormData = {
  businessName: "",
  businessTerritory: "",
  ownerName: "",
  certificateNo: "",
  transactionDate: "",
  businessScope: "",
  businessNameRegistration: null,
  proofOfBank: null,
  birCertificate: null,
  governmentId: null,
};

export const useFormState = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const isFormValid = (): boolean => {
    return !!(
      formData.businessName &&
      formData.businessTerritory &&
      formData.ownerName &&
      formData.certificateNo &&
      formData.transactionDate &&
      formData.businessScope &&
      formData.businessNameRegistration &&
      formData.proofOfBank &&
      formData.birCertificate &&
      formData.governmentId
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      alert("Please complete all required fields and upload all documents before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate form submission with FormData for file uploads
      const submitFormData = new FormData();
      
      // Add text fields
      submitFormData.append("businessName", formData.businessName);
      submitFormData.append("businessTerritory", formData.businessTerritory);
      submitFormData.append("ownerName", formData.ownerName);
      submitFormData.append("certificateNo", formData.certificateNo);
      submitFormData.append("transactionDate", formData.transactionDate);
      submitFormData.append("businessScope", formData.businessScope);
      
      // Add file fields
      if (formData.businessNameRegistration) {
        submitFormData.append("businessNameRegistration", formData.businessNameRegistration);
      }
      if (formData.proofOfBank) {
        submitFormData.append("proofOfBank", formData.proofOfBank);
      }
      if (formData.birCertificate) {
        submitFormData.append("birCertificate", formData.birCertificate);
      }
      if (formData.governmentId) {
        submitFormData.append("governmentId", formData.governmentId);
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Form submitted successfully:", formData);
      alert("✅ Startup verification form submitted successfully! You will receive a confirmation email shortly.");
      
      // Reset form after successful submission
      setFormData(initialFormData);
      
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("❌ There was an error submitting your form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    handleInputChange,
    handleFileChange,
    isFormValid,
    handleSubmit,
  };
};