export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://poulomi-florique-thanisandra.com"
).replace(/\/$/, "");

export const siteName = "Poulomi Florique Thanisandra";

export const siteDescription =
  "Poulomi Florique by Poulomi Estates in Thanisandra, Bengaluru offers premium 3 BHK and 3.5 BHK residences from 1,585 to 2,740 sq ft with 8.66 acres, 85% open spaces, a 37,800 sq ft clubhouse, 27,500 sq ft sports zone and strong North Bengaluru connectivity.";

export const siteKeywords = [
  "Poulomi Florique",
  "Poulomi Florique Thanisandra",
  "Poulomi Florique Bangalore",
  "Poulomi Florique price",
  "Poulomi Florique brochure",
  "Poulomi Florique floor plans",
  "Poulomi Estates Bangalore",
  "3 BHK apartments Thanisandra",
  "3.5 BHK apartments Thanisandra",
  "apartments near Manyata Tech Park",
  "flats near Bhartiya City Bengaluru",
  "Kannur Bengaluru apartments",
  "North Bengaluru apartments",
];

export function absoluteUrl(path = "/") {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
