export interface FormData {
  businessName: string;
  businessTerritory: string;
  ownerName: string;
  certificateNo: string;
  transactionDate: string;
  businessScope: string;
  businessNameRegistration: File | null;
  proofOfBank: File | null;
  birCertificate: File | null;
  governmentId: File | null;
}

export type FormDataKey = keyof FormData;

export const BUSINESS_TERRITORIES = [
  { value: "north-america", label: "North America" },
  { value: "south-america", label: "South America" },
  { value: "europe", label: "Europe" },
  { value: "asia-pacific", label: "Asia Pacific" },
  { value: "middle-east", label: "Middle East" },
  { value: "africa", label: "Africa" },
  { value: "global", label: "Global" },
] as const;

