export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://poulomi-florique-thanisandra.com"
).replace(/\/$/, "");

export const siteName = "Poulomi Florique Thanisandra";

export const siteDescription =
  "Explore Poulomi Florique in Thanisandra, North Bengaluru: premium 3 BHK-led residences, botanical landscapes, curated amenities, official brochure access and private site visits.";

export const siteKeywords = [
  "Poulomi Florique",
  "Poulomi Florique Thanisandra",
  "Poulomi Florique Bangalore",
  "Poulomi Florique price",
  "Poulomi Florique brochure",
  "Poulomi Florique floor plans",
  "Poulomi Estates Bangalore",
  "3 BHK apartments Thanisandra",
  "3 BHK study maid apartments Thanisandra",
  "apartments near Manyata Tech Park",
  "flats near Bhartiya City Bengaluru",
  "Kannur Bengaluru apartments",
  "North Bengaluru apartments",
];

export function absoluteUrl(path = "/") {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
