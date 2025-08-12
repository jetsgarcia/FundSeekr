import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { PencilIcon } from "lucide-react";

interface InvestorProfileProps {
  user: {
    id: number;
    name: string;
    type: string;
    website_url: string;
    linkedin_url: string;
    location: string;
    decision_making_timeline: number;
    preferred_industries: string[];
    industries_to_avoid: string[];
    preferred_business_models: string;
    preferred_funding_stages: string;
    typical_check_size: number;
    geographic_focus: string;
    current_portfolio_companies: string[];
    notable_exits: {
      company: string;
      exit_type: string;
      value_php: number;
      year: number;
    }[];
    areas_of_value_add: string[];
    desired_level_involvement: string;
  };
}

export function InvestorProfile({ user }: InvestorProfileProps) {
  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Investor Profile</h1>
        <Button variant="outline" size="sm">
          <PencilIcon className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main info card */}
        <div className="md:col-span-3 bg-card rounded-lg p-6 shadow-sm border">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-muted-foreground">{user.type}</p>
              <div className="mt-2 flex items-center">
                <span className="inline-flex items-center text-sm text-muted-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {user.location}
                </span>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex flex-col md:items-end gap-2">
                <a
                  href={user.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    <path d="M2 12h20" />
                  </svg>
                  Website
                </a>
                <a
                  href={user.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Preferences */}
        <div className="md:col-span-2 bg-card rounded-lg p-6 shadow-sm border">
          <h3 className="text-xl font-semibold mb-4">Investment Preferences</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Check Size
              </h4>
              <p className="text-base">
                {formatCurrency(user.typical_check_size)}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Funding Stage
              </h4>
              <p className="text-base">{user.preferred_funding_stages}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Decision Timeline
              </h4>
              <p className="text-base">{user.decision_making_timeline} days</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Business Model
              </h4>
              <p className="text-base">{user.preferred_business_models}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Geographic Focus
              </h4>
              <p className="text-base">{user.geographic_focus}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Involvement Level
              </h4>
              <p className="text-base">{user.desired_level_involvement}</p>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Preferred Industries
            </h4>
            <div className="flex flex-wrap gap-2">
              {user.preferred_industries.map((industry, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs"
                >
                  {industry}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Industries to Avoid
            </h4>
            <div className="flex flex-wrap gap-2">
              {user.industries_to_avoid.map((industry, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-destructive/10 text-destructive rounded-md text-xs"
                >
                  {industry}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Value Add */}
        <div className="bg-card rounded-lg p-6 shadow-sm border">
          <h3 className="text-xl font-semibold mb-4">Value Add</h3>
          <ul className="space-y-2">
            {user.areas_of_value_add.map((area, index) => (
              <li key={index} className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-primary mr-2 mt-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Portfolio */}
        <div className="md:col-span-2 bg-card rounded-lg p-6 shadow-sm border">
          <h3 className="text-xl font-semibold mb-4">Current Portfolio</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {user.current_portfolio_companies.map((company, index) => (
              <div key={index} className="p-3 bg-accent rounded-md">
                {company}
              </div>
            ))}
          </div>
        </div>

        {/* Notable Exits */}
        <div className="bg-card rounded-lg p-6 shadow-sm border">
          <h3 className="text-xl font-semibold mb-4">Notable Exits</h3>
          <div className="space-y-4">
            {user.notable_exits.map((exit, index) => (
              <div key={index} className="border-b pb-3 last:border-0">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">{exit.company}</h4>
                  <span className="text-sm text-muted-foreground">
                    {exit.year}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs px-2 py-0.5 rounded bg-accent">
                    {exit.exit_type}
                  </span>
                  <span className="font-medium text-sm">
                    {formatCurrency(exit.value_php)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
