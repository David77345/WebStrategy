import { sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import type { openDatabase } from "./database";
type Database = ReturnType<typeof openDatabase>["db"];

/** Internal notification only. No message is sent to a visitor or WhatsApp. */
export async function deliverOutbox(db: Database) {
  // Maintenance also runs before a receiver is configured, so temporary setup cannot retain stale buckets indefinitely.
  await db.execute(sql`DELETE FROM rate_buckets WHERE expires_at<now()`);
  await db.execute(sql`DELETE FROM idempotency_records WHERE expires_at<now()`);
  await db.execute(
    sql`UPDATE outbox_jobs SET state='failed', last_error='LEASE_EXHAUSTED' WHERE state='processing' AND attempts>=6 AND lease_until<now()`,
  );
  const backlog = async () =>
    (
      await db.execute(
        sql`SELECT count(*)::integer AS pending, EXTRACT(EPOCH FROM (now()-min(created_at)))::integer AS oldest_age_seconds FROM outbox_jobs WHERE state IN ('pending','processing','failed')`,
      )
    ).rows[0];
  const endpoint = process.env.NOTIFICATION_WEBHOOK_URL;
  const token = process.env.NOTIFICATION_WEBHOOK_TOKEN;
  if (!endpoint || new URL(endpoint).protocol !== "https:" || !token)
    return {
      configured: false,
      delivered: 0,
      failed: 0,
      backlog: await backlog(),
    };
  const lease = randomUUID();
  const claim = await db.execute(sql`
    UPDATE outbox_jobs SET state='processing', attempts=attempts+1, lease_until=now()+interval '5 minutes', lease_token=${lease}::uuid
    WHERE id IN (SELECT id FROM outbox_jobs WHERE attempts < 6 AND ((state='pending' AND next_attempt_at<=now()) OR (state='processing' AND lease_until<now())) ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT 5)
    RETURNING id, lead_id, attempts`);
  let delivered = 0;
  let failed = 0;
  for (const raw of claim.rows) {
    const job = raw as { id: string; lead_id: string; attempts: number };
    try {
      const result = await db.execute(
        sql`SELECT public_reference, full_name, company_name, phone, challenge, context FROM leads WHERE id=${job.lead_id}::uuid`,
      );
      if (!result.rows[0]) throw new Error("LEAD_REMOVED");
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "Idempotency-Key": job.id,
        },
        body: JSON.stringify({ event: "lead.received", lead: result.rows[0] }),
        signal: AbortSignal.timeout(8000),
        redirect: "error",
      });
      if (!response.ok) throw new Error("DELIVERY_FAILED");
      await db.execute(
        sql`UPDATE outbox_jobs SET state='delivered', lease_until=NULL, lease_token=NULL, last_error=NULL WHERE id=${job.id}::uuid AND lease_token=${lease}::uuid`,
      );
      delivered++;
    } catch {
      const delay =
        Math.min(21600, 60 * 2 ** job.attempts) +
        Math.floor(Math.random() * 30);
      await db.execute(
        sql`UPDATE outbox_jobs SET state=${job.attempts >= 6 ? "failed" : "pending"}, next_attempt_at=now()+${delay}*interval '1 second', lease_until=NULL, lease_token=NULL, last_error='DELIVERY_FAILED' WHERE id=${job.id}::uuid AND lease_token=${lease}::uuid`,
      );
      failed++;
    }
  }
  return { configured: true, delivered, failed, backlog: await backlog() };
}
