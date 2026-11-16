import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/settings";
export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  const enabled = process.env.INDEXING_ENABLED === "true";
  return {
    rules: enabled
      ? { userAgent: "*", allow: "/", disallow: ["/api/"] }
      : { userAgent: "*", disallow: "/" },
    ...(base && enabled ? { sitemap: new URL("/sitemap.xml", base).href } : {}),
  };
}
