import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  // Hardcoded production URL — do NOT use NEXTAUTH_URL (that's for auth, not the site)
  const base = "https://www.kraftmortgages.ca";
  return { rules: [{ userAgent: "*", allow: "/" }], sitemap: `${base}/sitemap.xml` };
}
