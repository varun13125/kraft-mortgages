import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.kraftmortgages.ca";
  // Safety: never allow localhost in production
  const sitemapUrl = base.includes("localhost") ? "https://www.kraftmortgages.ca" : base;
  return { rules: [{ userAgent: "*", allow: "/" }], sitemap: `${sitemapUrl}/sitemap.xml` };
}
