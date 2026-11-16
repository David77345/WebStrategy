import { and, eq, gt, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { openDatabase } from "./database";
import {
  leads,
  consentRecords,
  idempotencyRecords,
  outboxJobs,
  rateBuckets,
  leadEvents,
} from "./schema";
import type { LeadRepository } from "./leads-service";

export function createLeadRepository(
  db: ReturnType<typeof openDatabase>["db"],
): LeadRepository {
  return {
    async find(key) {
      return (
        await db
          .select({
            payloadHash: idempotencyRecords.payloadHash,
            publicReference: idempotencyRecords.publicReference,
          })
          .from(idempotencyRecords)
          .where(
            and(
              eq(idempotencyRecords.key, key),
              gt(idempotencyRecords.expiresAt, new Date()),
            ),
          )
          .limit(1)
      )[0];
    },
    async allow(keys, expiresAt) {
      const counts = await db.transaction(async (tx) => {
        const result: number[] = [];
        // Deterministic order prevents lock-order deadlocks between concurrent requests.
        for (const key of [...keys].sort()) {
          const [bucket] = await tx
            .insert(rateBuckets)
            .values({ key, count: 1, expiresAt })
            .onConflictDoUpdate({
              target: rateBuckets.key,
              set: { count: sql`${rateBuckets.count} + 1` },
            })
            .returning({ count: rateBuckets.count });
          result.push(bucket.count);
        }
        return result;
      });
      return counts.every((count) => count <= 5);
    },
    async create(data) {
      return db.transaction(async (tx) => {
        await tx.execute(
          sql`select pg_advisory_xact_lock(hashtextextended(${data.key}, 0))`,
        );
        const [prior] = await tx
          .select()
          .from(idempotencyRecords)
          .where(eq(idempotencyRecords.key, data.key));
        if (prior && prior.expiresAt > new Date())
          return {
            payloadHash: prior.payloadHash,
            publicReference: prior.publicReference,
          };
        if (prior)
          await tx
            .delete(idempotencyRecords)
            .where(eq(idempotencyRecords.key, data.key));
        await tx.insert(leads).values({
          id: data.id,
          publicReference: data.reference,
          fullName: data.input.fullName,
          companyName: data.input.companyName,
          phone: data.input.phone,
          challenge: data.input.challenge,
          context: data.input.context,
          brandUrl: data.input.brandUrl,
          sourcePage: data.input.sourcePage,
          attribution: data.input.attribution,
        });
        await tx.insert(consentRecords).values({
          id: randomUUID(),
          leadId: data.id,
          policyVersion: data.input.policyVersion,
          text: data.consentText,
          textHash: data.consentHash,
        });
        await tx
          .insert(outboxJobs)
          .values({ id: randomUUID(), leadId: data.id });
        await tx
          .insert(leadEvents)
          .values({ id: randomUUID(), leadId: data.id, type: "received" });
        await tx.insert(idempotencyRecords).values({
          key: data.key,
          payloadHash: data.hash,
          leadId: data.id,
          publicReference: data.reference,
          expiresAt: new Date(Date.now() + 86400000),
        });
        return { payloadHash: data.hash, publicReference: data.reference };
      });
    },
  };
}
