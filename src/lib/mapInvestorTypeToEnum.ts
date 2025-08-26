import { investor_type_enum } from "@prisma/client";

export function mapInvestorTypeToEnum(
  displayValue: string
): investor_type_enum | null {
  const mapping: { [key: string]: investor_type_enum } = {
    "Angel investor": investor_type_enum.Angel_investor,
    "Crowdfunding investor": investor_type_enum.Crowdfunding_investor,
    "Venture capital": investor_type_enum.Venture_capital,
    "Corporate investor": investor_type_enum.Corporate_investor,
    "Private equity": investor_type_enum.Private_equity,
    "Impact investor": investor_type_enum.Impact_investor,
  };

  return mapping[displayValue] || null;
}
