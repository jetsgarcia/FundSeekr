import { Phone, User, Linkedin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import type { investors as InvestorProfile } from "@prisma/client";

interface ContactInfoCardProps {
  investor: InvestorProfile;
}

export function ContactInfoCard({ investor }: ContactInfoCardProps) {
  const hasContactInfo =
    investor.key_contact_person_name ||
    investor.key_contact_number ||
    investor.investor_linkedin ||
    investor.key_contact_linkedin;

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-secondary/50 rounded-t-lg border-b border-border/50">
        <CardTitle className="flex items-center space-x-2 text-primary">
          <Phone className="h-5 w-5" />
          <span>Contact Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {hasContactInfo ? (
          <div className="space-y-4">
            {investor.key_contact_person_name && (
              <div className="flex items-start space-x-3 group">
                <User className="h-4 w-4 mt-1 text-muted-foreground group-hover:text-primary transition-colors" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Key Contact
                  </p>
                  <p className="font-semibold text-foreground">
                    {investor.key_contact_person_name}
                  </p>
                </div>
              </div>
            )}

            {investor.key_contact_number && (
              <div className="flex items-start space-x-3 group">
                <Phone className="h-4 w-4 mt-1 text-muted-foreground group-hover:text-primary transition-colors" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Phone
                  </p>
                  <a
                    href={`tel:${investor.key_contact_number}`}
                    className="font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    {investor.key_contact_number}
                  </a>
                </div>
              </div>
            )}

            {investor.investor_linkedin && (
              <div className="flex items-start space-x-3 group">
                <Linkedin className="h-4 w-4 mt-1 text-muted-foreground group-hover:text-primary transition-colors" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    LinkedIn
                  </p>
                  <a
                    href={investor.investor_linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary hover:text-primary/80 transition-colors inline-flex items-center space-x-1"
                  >
                    <span>View Profile</span>
                    <Linkedin className="h-3 w-3" />
                  </a>
                </div>
              </div>
            )}

            {investor.key_contact_linkedin && (
              <div className="flex items-start space-x-3 group">
                <Linkedin className="h-4 w-4 mt-1 text-muted-foreground group-hover:text-primary transition-colors" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Key Contact LinkedIn
                  </p>
                  <a
                    href={investor.key_contact_linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary hover:text-primary/80 transition-colors inline-flex items-center space-x-1"
                  >
                    <span>View Profile</span>
                    <Linkedin className="h-3 w-3" />
                  </a>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Phone className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">
              No contact information provided
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
