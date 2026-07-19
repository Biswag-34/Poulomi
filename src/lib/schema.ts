import { amenityHighlights, faqItems, locationClusters, micrositeDisclaimer, projectFacts } from "@/data/poulomi-florique";
import { absoluteUrl, siteDescription, siteName, siteUrl } from "@/lib/site";

export function getBreadcrumbSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: projectFacts.publicTitle,
        item: absoluteUrl("/#hero"),
      },
    ],
  };
}

export function getProjectSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: projectFacts.publicTitle,
    description: siteDescription,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bengaluru",
      addressRegion: "Karnataka",
      addressCountry: "IN",
      streetAddress: projectFacts.locationShort,
    },
    brand: {
      "@type": "Organization",
      name: projectFacts.developer,
    },
    image: [
      absoluteUrl(projectFacts.images.heroDesktop),
      absoluteUrl(projectFacts.images.elevation),
      absoluteUrl(projectFacts.images.masterPlan),
    ],
    amenityFeature: amenityHighlights.map((item) => ({
      "@type": "LocationFeatureSpecification",
      name: item.label,
      value: true,
      description: item.text,
    })),
    containsPlace: locationClusters.flatMap((cluster) =>
      cluster.items.slice(0, 4).map((item) => ({
        "@type": "Place",
        name: item.name,
        description: `${cluster.label} destination near ${projectFacts.name}; verify current routes and travel times on live maps.`,
      })),
    ),
    url: siteUrl,
  };
}

export function getDisclosureSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    description: micrositeDisclaimer,
  };
}

export function getWebPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Poulomi Florique Thanisandra Residences, Brochure and Site Visit",
    url: siteUrl,
    description: siteDescription,
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: absoluteUrl(projectFacts.images.heroDesktop),
      width: 1672,
      height: 941,
    },
    about: {
      "@type": "Residence",
      name: projectFacts.publicTitle,
    },
  };
}

export function getFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
