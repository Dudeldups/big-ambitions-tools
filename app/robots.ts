import { BASE_URL } from "@/lib/siteConstants";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/tools/*", "/*/tools/*"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
