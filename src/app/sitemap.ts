import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-08-10");
  const pages = [
    { path: "/", changeFrequency: "weekly" as const, priority: 1 },
    { path: "/privacy-policy", changeFrequency: "yearly" as const, priority: 0.35 },
    { path: "/terms-and-conditions", changeFrequency: "yearly" as const, priority: 0.35 },
  ];

  return pages.map((page) => ({
    url: absoluteUrl(page.path),
    lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
