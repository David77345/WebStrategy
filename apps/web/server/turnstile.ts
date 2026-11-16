export async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  const site = process.env.SITE_URL;
  if (!secret || !site) return false;
  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token }),
      signal: AbortSignal.timeout(8000),
    },
  );
  if (!response.ok) return false;
  const data = (await response.json()) as {
    success?: boolean;
    hostname?: string;
    action?: string;
  };
  return (
    data.success === true &&
    data.hostname === new URL(site).hostname &&
    data.action === "lead_submit"
  );
}
