export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.poulomiflorique.co.in"
).replace(/\/$/, "");

export const siteName = "Poulomi Florique";

export const siteDescription =
  "Explore Poulomi Florique, premium 3 BHK apartments in Thanisandra, North Bengaluru. View verified floor plans, amenities, location, RERA details and book a site visit.";

export function absoluteUrl(path = "/") {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
