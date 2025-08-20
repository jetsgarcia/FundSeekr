"use client";

import { InvestorProfile } from "@/components/investor-profile";
import { StartupProfile } from "@/components/startup-profile";

type UserType = "investor" | "startup";

export default function ProfilePage() {
  const usertype = "startup" as UserType;

  const startupData = {
    id: 1,
    name: "EcoByte Solutions Inc.",
    description:
      "AI-powered recycling kiosks that identify and process e-waste, rewarding users and recovering valuable materials.",
    valuation: 8000000,
    target_market: [
      "Urban municipalities",
      "Electronics retailers",
      "Eco-conscious consumers",
    ],
    city: "Manila",
    date_founded: new Date("2024-05-15"),
    industry: "CleanTech",
    website: "https://www.ecobyte.io",
    keywords: ["AI", "Sustainability", "Recycling", "Circular Economy", "IoT"],
    intellectual_property: [
      { type: "Algorithm", description: "Proprietary AI sorting algorithm" },
      { type: "Trademark", description: "EcoByte brand" },
    ],
    product_demo_url: "https://youtu.be/ecobyte-demo",
    key_metrics: [
      { metric: "Active kiosks", value: 42 },
      { metric: "Monthly processed e-waste (kg)", value: 12000 },
      { metric: "MRR ", value: 45000 },
    ],
    team_members: [
      {
        name: "Maria Santos",
        role: "CEO & Co-Founder",
        linkedin: "https://linkedin.com/in/mariasantos",
      },
      {
        name: "David Lim",
        role: "CTO & Co-Founder",
        linkedin: "https://linkedin.com/in/davidlim",
      },
    ],
    advisors: [
      {
        name: "Dr. Elena Cruz",
        expertise: "Sustainable manufacturing",
        linkedin: "https://linkedin.com/in/elenacruz",
      },
    ],
    development_stage: "Early_traction" as const,
    user_id: "user_001",
  };

  const investorData = {
    id: 1,
    organization: "Horizon Ventures Capital",
    position: "Managing Partner",
    city: "Manila",
    organization_website: "https://www.horizonventures.vc",
    investor_linkedin: "https://linkedin.com/company/horizonventures",
    decision_period_in_weeks: 6,
    typical_check_size_in_php: 250000000,
    investor_type: "Venture_capital" as const,
    preferred_industries: [
      "SaaS",
      "AI & Machine Learning",
      "Fintech",
      "HealthTech",
    ],
    excluded_industries: ["Gambling", "Crypto Tokens", "Tobacco"],
    preferred_business_models: ["SaaS", "B2B"],
    preferred_funding_stages: ["Series_A", "Series_B"],
    geographic_focus: ["Philippines"],
    value_proposition: [
      "Enterprise client introductions",
      "Leadership hiring",
      "Go-to-market strategy",
      "Regulatory compliance guidance",
    ],
    involvement_level: "Active" as const,
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
        value_php: 3000000000,
        year: 2022,
      },
      {
        company: "LoanFlow",
        exit_type: "IPO",
        value_php: 6000000000,
        year: 2021,
      },
    ],
    key_contact_person_name: "Alexandra Rodriguez",
    key_contact_linkedin: "https://linkedin.com/in/alexandra-rodriguez-vc",
    key_contact_number: "+63 917 123 4567",
    user_id: "user_456",
  };

  return (
    <>
      {usertype === "investor" && <InvestorProfile user={investorData} />}
      {usertype === "startup" && <StartupProfile startup={startupData} />}
    </>
  );
}
