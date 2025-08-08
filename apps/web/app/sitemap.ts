import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const routes = ["/", "/mli-select", "/calculators/payment", "/calculators/affordability", "/calculators/renewal",
    "/calculators/construction-pro", "/calculators/investment", "/calculators/self-employed",
    "/provinces/bc", "/provinces/ab", "/provinces/on" ].map((p)=> ({ url: base + p, changeFrequency: "weekly" as const, priority: p === "/" ? 1 : 0.7 }));
  return routes;
}
