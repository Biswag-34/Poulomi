import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read how the Poulomi Florique enquiry microsite handles lead details, attribution data, cookies and communication preferences.",
  alternates: {
    canonical: "/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy | Poulomi Florique",
    description:
      "Privacy information for Poulomi Florique enquiries, site visits, floor-plan requests and project communication.",
    url: "/privacy-policy",
    siteName: "Poulomi Florique",
    type: "website",
  },
};

const sections = [
  {
    title: "Information We Collect",
    body:
      "When you enquire about Poulomi Florique, request a floor plan or schedule a site visit, we may collect your name, Indian mobile number, email address, preferred configuration, budget range and message details. We may also collect non-sensitive attribution data such as UTM source, campaign, device type, landing page and referrer to understand which channels generate project enquiries.",
  },
  {
    title: "How We Use Enquiry Data",
    body:
      "Your details are used to respond to your request, coordinate a project discussion or site visit, share floor-plan and availability information, improve lead quality and measure campaign performance. We do not use your name, phone number or email address as public website content, and these details should not be sent to analytics platforms as event parameters.",
  },
  {
    title: "Cookies and Analytics",
    body:
      "The microsite may use analytics and advertising tags to measure page views, form starts, successful lead submissions and section interactions. These tools help improve the website experience and marketing relevance. Browser settings may allow you to restrict cookies or reset advertising identifiers.",
  },
  {
    title: "Sharing and Storage",
    body:
      "Lead details may be shared with authorised project sales or customer-response teams for follow-up. Information may be stored in connected CRM, spreadsheet or webhook systems configured for the microsite. Access should be limited to teams who need the details to answer project enquiries.",
  },
  {
    title: "Your Choices",
    body:
      "You may ask the project response team to update your contact preferences or stop further promotional communication. Before booking or purchase decisions, verify current pricing, approvals, specifications, availability, possession timelines and RERA details through authorised sources.",
  },
] as const;

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Privacy and enquiry handling"
      title="Privacy Policy"
      intro="How Poulomi Florique enquiry information is collected, used and protected across project forms, floor-plan requests and site-visit communication."
      sections={[...sections]}
    />
  );
}
