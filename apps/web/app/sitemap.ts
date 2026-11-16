import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/settings";
import { projects } from "@/content/portfolio";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  if (!base || process.env.INDEXING_ENABLED !== "true") return [];
  return [
    "/",
    "/servicios",
    "/metodo",
    "/nosotros",
    "/portafolio",
    "/contacto",
    ...projects.map((p) => `/portafolio/${p.slug}`),
  ].map((path) => ({ url: new URL(path, base).href }));
}
