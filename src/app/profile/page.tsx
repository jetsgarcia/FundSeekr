"use client";

import { InvestorProfile } from "@/components/investor-profile";

export default function ProfilePage() {
  const user = {
    id: 1,
    name: "Horizon Ventures Capital",
    type: "Venture Capital Fund",
    website_url: "https://www.horizonventures.vc",
    linkedin_url: "https://linkedin.com/company/horizonventures",
    location: "Singapore",
    decision_making_timeline: 42,
    preferred_industries: [
      "SaaS",
      "AI & Machine Learning",
      "Fintech",
      "HealthTech",
    ],
    industries_to_avoid: ["Gambling", "Crypto Tokens", "Tobacco"],
    preferred_business_models: "SaaS",
    preferred_funding_stages: "Series A",
    typical_check_size: 5000,
    geographic_focus: "Southeast Asia",
    current_portfolio_companies: [
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
    areas_of_value_add: [
      "Enterprise client introductions",
      "Leadership hiring",
      "Go-to-market strategy",
      "Regulatory compliance guidance",
    ],
    desired_level_involvement: "Board Seat",
  };

  return <InvestorProfile user={user} />;
}
