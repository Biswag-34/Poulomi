import { amenityHighlights, faqItems, locationClusters, micrositeDisclaimer, projectFacts } from "@/data/poulomi-florique";
import { absoluteUrl, siteDescription, siteName } from "@/lib/site";

export function getHomePageSchemaGraph() {
  const websiteId = absoluteUrl("/#website");
  const webpageId = absoluteUrl("/#webpage");
  const organizationId = absoluteUrl("/#organization");
  const projectId = absoluteUrl("/#project");
  const primaryImageId = absoluteUrl("/#primaryimage");
  const faqId = absoluteUrl("/#faq");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: siteName,
        url: absoluteUrl("/"),
        description: micrositeDisclaimer,
        publisher: {
          "@id": organizationId,
        },
      },
      {
        "@type": "WebPage",
        "@id": webpageId,
        url: absoluteUrl("/"),
        name: "Poulomi Florique Thanisandra | 3 BHK Apartments Bengaluru",
        description: siteDescription,
        isPartOf: {
          "@id": websiteId,
        },
        about: {
          "@id": projectId,
        },
        primaryImageOfPage: {
          "@id": primaryImageId,
        },
      },
      {
        "@type": "Organization",
        "@id": organizationId,
        name: projectFacts.developer,
        brand: {
          "@type": "Brand",
          name: projectFacts.name,
        },
      },
      {
        "@type": "ImageObject",
        "@id": primaryImageId,
        url: absoluteUrl(projectFacts.images.heroDesktopWebp),
        width: 1672,
        height: 941,
        caption: "Poulomi Florique premium residences in North Bengaluru",
      },
      {
        "@type": "ApartmentComplex",
        "@id": projectId,
        name: projectFacts.publicTitle,
        url: absoluteUrl("/"),
        description: siteDescription,
        image: [
          absoluteUrl(projectFacts.images.heroDesktopWebp),
          absoluteUrl(projectFacts.images.elevation),
          absoluteUrl(projectFacts.images.masterPlanWebp),
        ],
        address: {
          "@type": "PostalAddress",
          streetAddress: projectFacts.locationShort,
          addressLocality: "Bengaluru",
          addressRegion: "Karnataka",
          addressCountry: "IN",
        },
        brand: {
          "@id": organizationId,
        },
        identifier: {
          "@type": "PropertyValue",
          propertyID: "Karnataka RERA",
          value: projectFacts.rera.registration,
          url: projectFacts.rera.url,
        },
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
      },
      {
        "@type": "FAQPage",
        "@id": faqId,
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };
}

export function serializeJsonLd(schema: unknown) {
  return JSON.stringify(schema).replace(/</g, "\\u003c");
}
