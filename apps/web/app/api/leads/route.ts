import { leadSchema } from "@day-strategy/contracts";
import { publicContactConfig, whatsappUrl } from "@/server/config";
import { openDatabase } from "@/server/database";
import { createLeadRepository } from "@/server/leads-repository";
import { acceptLead, LeadError } from "@/server/leads-service";
import { verifyTurnstile } from "@/server/turnstile";
import { json, readLimitedJson } from "@/server/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  let database: ReturnType<typeof openDatabase> | undefined;
  try {
    const settings = publicContactConfig();
    if (!settings.enabled)
      return json({ code: "CONTACT_UNAVAILABLE", requestId }, 503);
    const expectedOrigin = new URL(process.env.SITE_URL!).origin;
    if (request.headers.get("origin") !== expectedOrigin)
      return json({ code: "ORIGIN_REJECTED", requestId }, 403);
    const key = request.headers.get("idempotency-key");
    if (
      !key ||
      !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(
        key,
      )
    )
      return json({ code: "INVALID_IDEMPOTENCY_KEY", requestId }, 400);
    const parsed = leadSchema.safeParse(await readLimitedJson(request));
    if (!parsed.success) {
      const fieldErrors = Object.fromEntries(
        parsed.error.issues.map((issue) => [
          String(issue.path[0] ?? "form"),
          "Revisa este campo.",
        ]),
      );
      return json({ code: "VALIDATION_FAILED", fieldErrors, requestId }, 400);
    }
    database = openDatabase();
    const accepted = await acceptLead(parsed.data, key, {
      repository: createLeadRepository(database.db),
      secret: process.env.SECURITY_HMAC_KEY!,
      consentText: settings.consentText,
      // Enable only behind Cloudflare's trusted proxy. Local development shares one network bucket.
      network:
        process.env.TRUST_CF_CONNECTING_IP === "true"
          ? (request.headers.get("cf-connecting-ip") ?? "unknown")
          : "local",
      verify: verifyTurnstile,
    });
    return json(
      {
        status: "accepted",
        publicReference: accepted.publicReference,
        whatsappUrl: whatsappUrl(accepted.publicReference),
      },
      201,
    );
  } catch (error) {
    if (error instanceof LeadError)
      return json(
        { code: error.code, requestId },
        error.status,
        error.status === 429 ? { "Retry-After": "600" } : {},
      );
    if (error instanceof Error && "status" in error)
      return json({ code: error.message, requestId }, Number(error.status));
    // Deliberately never log the submitted body, contact details, SQL or provider error.
    console.error(JSON.stringify({ event: "lead_request_failed", requestId }));
    return json({ code: "SERVICE_UNAVAILABLE", requestId }, 503);
  } finally {
    await database?.close().catch(() => undefined);
  }
}
