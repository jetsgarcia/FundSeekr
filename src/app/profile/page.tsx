"use client";

import { InvestorProfile } from "@/components/investor-profile";

type UserType = "investor" | "startup";

export default function ProfilePage() {
  const usertype = "investor" as UserType;
  const user = {
    id: 1,
    organization: "Horizon Ventures Capital",
    position: "Managing Partner",
    city: "Makati City",
    organization_website: "https://www.horizonventures.vc",
    investor_linkedin: "https://linkedin.com/company/horizonventures",
    decision_period_in_weeks: 6,
    typical_check_size_in_php: 5000000,
    investor_type: "Venture capital",
    preferred_industries: [
      "SaaS",
      "AI & Machine Learning",
      "Fintech",
      "HealthTech",
    ],
    excluded_industries: ["Gambling", "Crypto Tokens", "Tobacco"],
    preferred_business_models: ["SaaS", "B2B"],
    preferred_funding_stages: ["Series A", "Series B"],
    geographic_focus: ["Southeast Asia", "Philippines"],
    value_proposition: [
      "Enterprise client introductions",
      "Leadership hiring",
      "Go-to-market strategy",
      "Regulatory compliance guidance",
    ],
    involvement_level: "Active",
    portfolio_companies: [
      "PayLink Asia",
      "Mediscan Diagnostics",
      "AgriChain",
      "CloudServe Pro",
    ],
    notable_exits: [
      {
        company: "ShopHero",
        exit_type: "Acquisition",
        value_php: 60000000,
        year: 2022,
      },
      {
        company: "LoanFlow",
        exit_type: "IPO",
        value_php: 120000000,
        year: 2021,
      },
    ],
    key_contact_person_name: "Maria Santos",
    key_contact_linkedin: "https://linkedin.com/in/mariasantos",
    key_contact_number: "+63 917 123 4567",
    user_id: "user_123",
  };

  return (
    <>
      {usertype === "investor" && <InvestorProfile user={user} />}
      {usertype === "startup" && <div>Startup</div>}
    </>
  );
}
