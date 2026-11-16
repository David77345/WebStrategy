/** Only validated, intentionally public configuration may reach a page. */
export function instagramUrl(): string | null {
  try {
    const url = new URL(process.env.INSTAGRAM_URL ?? "");
    return url.protocol === "https:" &&
      ["instagram.com", "www.instagram.com"].includes(url.hostname) &&
      !url.username &&
      !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}
export function siteUrl(): URL | undefined {
  try {
    const url = new URL(process.env.SITE_URL ?? "");
    return ["https:", "http:"].includes(url.protocol) ? url : undefined;
  } catch {
    return undefined;
  }
}
