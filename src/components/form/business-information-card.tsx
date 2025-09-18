import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormData, BUSINESS_TERRITORIES } from "@/types/form";

interface BusinessInformationCardProps {
  formData: FormData;
  onInputChange: (field: string, value: string) => void;
}

export const BusinessInformationCard = ({
  formData,
  onInputChange,
}: BusinessInformationCardProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Business Information</CardTitle>
      <CardDescription>
        Provide details about your startup registration
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="businessName">Startup Name <span className="text-red-500">*</span></Label>
          <Input
            id="businessName"
            placeholder="Enter your registered startup/business name"
            value={formData.businessName}
            onChange={(e) => onInputChange("businessName", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessTerritory">Region <span className="text-red-500">*</span></Label>
          <Select
            onValueChange={(value) => onInputChange("businessTerritory", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              {BUSINESS_TERRITORIES.map((territory) => (
                <SelectItem key={territory.value} value={territory.value}>
                  {territory.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ownerName">Founder/Owner&apos;s Name <span className="text-red-500">*</span></Label>
          <Input
            id="ownerName"
            placeholder="Enter the startup founder or owner's full name"
            value={formData.ownerName}
            onChange={(e) => onInputChange("ownerName", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="certificateNo">Registration Certificate No. <span className="text-red-500">*</span></Label>
          <Input
            id="certificateNo"
            placeholder="Enter registration certificate number"
            value={formData.certificateNo}
            onChange={(e) => onInputChange("certificateNo", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="transactionDate">Registration Date <span className="text-red-500">*</span></Label>
          <Input
            id="transactionDate"
            type="date"
            value={formData.transactionDate}
            onChange={(e) => onInputChange("transactionDate", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessScope">Business Scope/Industry <span className="text-red-500">*</span></Label>
        <textarea
          id="businessScope"
          placeholder="Describe your startup's business scope, industry, and activities (e.g., FinTech, E-commerce, HealthTech, etc.)"
          value={formData.businessScope}
          onChange={(e) => onInputChange("businessScope", e.target.value)}
          className="w-full min-h-20 px-3 py-2 border border-input rounded-md bg-transparent text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-ring/50 focus:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
          required
        />
      </div>
    </CardContent>
  </Card>
);
