import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Review the Poulomi Florique microsite terms for project enquiries, floor-plan downloads, site visits, RERA verification and information accuracy.",
  alternates: {
    canonical: "/terms-and-conditions",
  },
  openGraph: {
    title: "Terms & Conditions | Poulomi Florique",
    description:
      "Terms for using the Poulomi Florique enquiry microsite and verifying project information before booking decisions.",
    url: "/terms-and-conditions",
    siteName: "Poulomi Florique",
    type: "website",
  },
};

const sections = [
  {
    title: "Purpose of This Microsite",
    body:
      "This website is intended to help visitors explore Poulomi Florique in Thanisandra, North Bengaluru, review available project information, request floor plans and submit site-visit or enquiry details. It is a promotional enquiry microsite and should not be treated as a final sale document.",
  },
  {
    title: "Project Information",
    body:
      "Floor plans, area statements, amenities, master-plan visuals, location references, availability and pricing-related communication are subject to verification. Visitors should confirm current and legally binding details with authorised project representatives, the developer and the Karnataka RERA portal before making a booking or purchase decision.",
  },
  {
    title: "RERA and Approvals",
    body:
      "The displayed RERA registration number is provided for project identification and trust. Buyers should independently verify the latest registration status, approvals, possession schedule, specifications and promoter details from the official Karnataka RERA portal and authorised project documents.",
  },
  {
    title: "Website Use",
    body:
      "Visitors should submit accurate contact details and use the enquiry forms only for genuine project-related communication. Automated submissions, misleading enquiries, copying website assets without permission or attempting to interfere with the website operation are not permitted.",
  },
  {
    title: "Limitation of Reliance",
    body:
      "The website aims to present helpful information, but visual renders, maps, travel times, landscaping, amenity descriptions and availability indicators may change or require source verification. Formal terms of purchase are governed only by authorised agreements, disclosures and statutory documents.",
  },
] as const;

export default function TermsAndConditionsPage() {
  return (
    <LegalPage
      eyebrow="Website terms and project disclaimer"
      title="Terms & Conditions"
      intro="Important terms for using this Poulomi Florique microsite, submitting enquiries, downloading floor plans and verifying project details before decisions."
      sections={[...sections]}
    />
  );
}
