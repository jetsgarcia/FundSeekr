import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold text-primary">
              FundSeekr Terms of Use and Privacy Policy
            </CardTitle>
            <p className="text-muted-foreground mt-2 leading-6">
              Effective Date: October 2025
              <br />
              Applicable Jurisdictions: Republic of the Philippines
              (GDPR-aligned)
            </p>
          </CardHeader>
          <CardContent className="max-w-none leading-6">
            <section className="mb-6">
              <h2 className="font-bold text-foreground mb-3">Introduction</h2>
              <p className="mb-4">
                Welcome to FundSeekr, a web-based platform connecting startups
                with investors. By creating an account or using this platform,
                you agree to these Terms of Use and Privacy Policy
                (&quot;Terms&quot;). These Terms outline how FundSeekr operates,
                the responsibilities of users, and how personal data is
                collected, processed, and protected in compliance with:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  The Data Privacy Act of 2012 (Republic Act No. 10173) of the
                  Philippines; and
                </li>
                <li>
                  The General Data Protection Regulation (EU Regulation
                  2016/679) (&quot;GDPR&quot;).
                </li>
              </ul>
              <p>
                Please read these Terms carefully before using the platform.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="font-bold text-foreground mb-3">
                About FundSeekr
              </h2>
              <p className="mb-4">
                FundSeekr is a two-sided platform that facilitates investment
                discovery and connection between startups and angel investors.
                It is operated and managed in the Philippines, with data
                protection measures that meet both Philippine and EU standards.
              </p>
              <p className="mb-3">Core Features:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>User registration and authentication</li>
                <li>Startup and investor profile management</li>
                <li>Admin-verified user vetting</li>
                <li>Video pitch uploads</li>
                <li>Search and matching</li>
                <li>Secure peer-to-peer messaging</li>
                <li>Data-driven analytics for engagement insights</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="font-bold text-foreground mb-3">
                Acceptance of Terms
              </h2>
              <p className="mb-3">By using FundSeekr, you confirm that you:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Are at least 18 years old;</li>
                <li>
                  Have the legal capacity to enter into binding agreements; and
                </li>
                <li>
                  Consent to these Terms and the processing of your personal
                  data as described herein.
                </li>
              </ul>
              <p>
                If you do not agree, you must refrain from using FundSeekr.
                FundSeekr reserves the right to amend or update these Terms.
                Users will be notified of material changes via email or platform
                notice.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="font-bold text-foreground mb-3">
                User Roles and Responsibilities
              </h2>
              <p className="mb-3">
                FundSeekr operates with three user categories:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  Startup Representatives – Create profiles, upload content, and
                  communicate with investors.
                </li>
                <li>
                  Angel Investors – Explore opportunities and interact with
                  startups.
                </li>
                <li>
                  Administrators – Oversee user verification, compliance, and
                  system security.
                </li>
              </ul>
              <p>
                Users must provide accurate and truthful information. Misuse,
                impersonation, or fraudulent activity may result in account
                suspension or termination.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="font-bold text-foreground mb-3">
                Account Registration and Verification
              </h2>
              <p className="mb-4">
                Users must register using a valid email or third-party
                authentication (e.g., Google). All accounts undergo verification
                by administrators to confirm authenticity.
              </p>
              <p>
                FundSeekr reserves the right to approve, restrict, or remove
                accounts that violate policies or present inaccurate data.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="font-bold text-foreground mb-3">
                Lawful Use of the Platform
              </h2>
              <p className="mb-3">
                Users agree to use FundSeekr only for legitimate, ethical, and
                lawful purposes. You may not:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  Upload or distribute false, misleading, or illegal content;
                </li>
                <li>
                  Infringe upon another&apos;s intellectual property rights;
                </li>
                <li>Engage in scraping, hacking, or data mining;</li>
                <li>Interfere with system integrity or network operations.</li>
              </ul>
              <p>
                FundSeekr may suspend accounts engaged in prohibited conduct.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="font-bold text-foreground mb-3">
                Privacy and Data Protection
              </h2>
              <p className="mb-4">
                FundSeekr is committed to protecting your privacy in accordance
                with the Philippine DPA and GDPR.
              </p>
              <p className="mb-3">Personal Data Collected:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Basic information (name, email, contact details)</li>
                <li>
                  Profile and business information (startup details, funding
                  preferences)
                </li>
                <li>Uploaded content (video pitches, photos, descriptions)</li>
                <li>Communication data (chat messages, interactions)</li>
                <li>Technical data (device, usage analytics, IP address)</li>
              </ul>
              <p className="mb-3">Lawful Basis for Processing:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  Consent – When users create an account or upload content.
                </li>
                <li>
                  Contract performance – To enable matchmaking and
                  communication.
                </li>
                <li>
                  Legitimate interest – To enhance system functionality and user
                  experience.
                </li>
                <li>
                  Legal obligation – When required by law or competent
                  authority.
                </li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="font-bold text-foreground mb-3">
                How We Use Your Information
              </h2>
              <p className="mb-3">Your data is processed to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Verify identity and manage accounts;</li>
                <li>Match startups and investors;</li>
                <li>Facilitate secure communication;</li>
                <li>Generate analytics and insights;</li>
                <li>Maintain system integrity and security;</li>
                <li>Comply with legal or regulatory requirements.</li>
              </ul>
              <p>
                FundSeekr does not sell, rent, or trade personal data. Data is
                shared only with trusted service providers under confidentiality
                and data processing agreements.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="font-bold text-foreground mb-3">
                Cookies and Analytics
              </h2>
              <p className="mb-4">
                FundSeekr uses cookies and analytics tools to improve
                functionality and performance.
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Users may disable cookies through browser settings.</li>
                <li>
                  Analytics data is anonymized and aggregated; no personal
                  identifiers are shared for advertising.
                </li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="font-bold text-foreground mb-3">Data Security</h2>
              <p className="mb-3">
                FundSeekr employs technical and organizational measures
                consistent with GDPR Article 32 and NPC Circular No. 16-01,
                including:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Encrypted data transmission (SSL/TLS)</li>
                <li>Secure password hashing</li>
                <li>Role-based access control</li>
                <li>Regular system audits and backups</li>
                <li>Limited administrative access</li>
              </ul>
              <p>
                Users must safeguard their credentials and immediately report
                unauthorized access.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="font-bold text-foreground mb-3">
                Data Retention and Deletion
              </h2>
              <p className="mb-4">
                Personal data is retained only as long as necessary for platform
                operation, legal compliance, or dispute resolution.
              </p>
              <p>
                Users may request account deletion or data removal at any time
                by contacting support@fundseekr.ph. FundSeekr will erase or
                anonymize data unless retention is required by law.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="font-bold text-foreground mb-3">
                User Rights under DPA and GDPR
              </h2>
              <p className="mb-3">Users have the right to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  Access – Request a copy of personal data held about you.
                </li>
                <li>Rectify – Correct inaccurate or incomplete data.</li>
                <li>
                  Erase – Request deletion of personal data (&quot;Right to be
                  Forgotten&quot;).
                </li>
                <li>Restrict Processing – Limit data use in specific cases.</li>
                <li>
                  Data Portability – Obtain your data in a structured format.
                </li>
                <li>Withdraw Consent – Revoke consent at any time.</li>
              </ul>
              <p>
                Requests may be made by emailing privacy@fundseekr.ph. FundSeekr
                will respond within 30 days (or as required by law).
              </p>
            </section>

            <section className="mb-6">
              <h2 className="font-bold text-foreground mb-3">
                User-Generated Content
              </h2>
              <p className="mb-4">
                Users retain ownership of their uploaded content. By posting on
                FundSeekr, you grant FundSeekr a limited, non-exclusive,
                royalty-free license to store, display, and transmit your
                content within the platform&apos;s ecosystem.
              </p>
              <p>
                Users warrant that uploaded content does not violate
                intellectual property or privacy rights.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="font-bold text-foreground mb-3">
                Limitation of Liability
              </h2>
              <p className="mb-4">
                FundSeekr serves as a networking tool and does not guarantee
                investment outcomes.
              </p>
              <p className="mb-3">FundSeekr is not liable for:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Any loss or damage arising from user interactions;</li>
                <li>Downtime or service interruptions;</li>
                <li>Unauthorized access due to user negligence.</li>
              </ul>
              <p>Use of the platform is at your own risk.</p>
            </section>

            <section className="mb-6">
              <h2 className="font-bold text-foreground mb-3">
                Updates to These Terms
              </h2>
              <p>
                FundSeekr may amend these Terms and Privacy Policy to reflect
                legal, operational, or security changes. Material updates will
                be communicated through email or website notice. Continued use
                constitutes acceptance.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="font-bold text-foreground mb-3">
                Governing Law and Jurisdiction
              </h2>
              <p className="mb-4">
                These Terms are governed by the laws of the Republic of the
                Philippines, consistent with the Data Privacy Act of 2012 and
                the GDPR.
              </p>
              <p>
                Disputes shall be filed exclusively before the proper courts of
                Makati City, Metro Manila.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="font-bold text-foreground mb-3">
                Contact Information
              </h2>
              <p className="mb-3">
                For data privacy concerns, access requests, or feedback, please
                contact:
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <p className="mb-2">📧 privacy@fundseekr.ph</p>
                <p>📍 FundSeekr Team – Makati City, Philippines</p>
              </div>
            </section>

            <div className="mt-8 p-6 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-center text-primary">
                ✅ By using FundSeekr, you acknowledge that you have read,
                understood, and agreed to these Terms of Use and Privacy Policy.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
