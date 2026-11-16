import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { leadSchema, POLICY_VERSION } from "../packages/contracts/src/leads";
import { createLeadRepository } from "../apps/web/server/leads-repository";
import {
  acceptLead,
  LeadError,
  secureHash,
} from "../apps/web/server/leads-service";
import { readLimitedJson, authorizedJob } from "../apps/web/server/http";
import { verifyTurnstile } from "../apps/web/server/turnstile";
import { deliverOutbox } from "../apps/web/server/outbox";

const input = leadSchema.parse({
  fullName: "Persona de prueba",
  companyName: "Marca de prueba",
  phone: "+12025550123",
  challenge: "unsure",
  contactAuthorization: true,
  policyVersion: POLICY_VERSION,
  sourcePage: "/contacto",
  turnstileToken: "test-token",
  honeypot: "",
});
const secret = "test-only-secret-never-a-production-credential";

test("validation rejects extra data, absent consent, invalid phone, insecure URLs and honeypots", () => {
  for (const change of [
    { unexpected: true },
    { contactAuthorization: false },
    { phone: "1234" },
    { brandUrl: "http://example.com" },
    { honeypot: "robot" },
    { context: "x".repeat(1001) },
    { policyVersion: "old" },
  ]) {
    assert.equal(leadSchema.safeParse({ ...input, ...change }).success, false);
  }
  assert.equal(
    leadSchema.parse({ ...input, fullName: "  Persona de prueba  " }).fullName,
    input.fullName,
  );
});

test("body reader enforces bytes without trusting Content-Length and rejects unsupported JSON", async () => {
  assert.deepEqual(
    await readLimitedJson(
      new Request("https://example.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: '{"ok":true}',
      }),
    ),
    { ok: true },
  );
  for (const [body, type, status] of [
    ["x".repeat(16385), "application/json", 413],
    ["not-json", "application/json", 400],
    ["{}", "text/plain", 415],
    ["{}", "application/json-invalid", 415],
  ] as const) {
    await assert.rejects(
      readLimitedJson(
        new Request("https://example.com", {
          method: "POST",
          headers: { "Content-Type": type, "Content-Length": "1" },
          body,
        }),
      ),
      (error: unknown) => (error as { status: number }).status === status,
    );
  }
});

test("transactional repository with real PostgreSQL engine", async (t) => {
  const pg = new PGlite();
  await pg.exec(
    await readFile(
      new URL("../apps/web/drizzle/0000_solid_mojo.sql", import.meta.url),
      "utf8",
    ),
  );
  const db = drizzle(pg);
  const repository = createLeadRepository(
    db as unknown as Parameters<typeof createLeadRepository>[0],
  );
  const dependencies = {
    repository,
    secret,
    network: "test-network",
    consentText: "Autorización de prueba.",
    verify: async () => true,
  };
  const count = async (table: string) =>
    (
      await pg.query<{ count: number }>(
        `SELECT count(*)::integer AS count FROM ${table}`,
      )
    ).rows[0].count;
  const reset = () =>
    pg.exec(
      "TRUNCATE leads, consent_records, idempotency_records, outbox_jobs, lead_events, rate_buckets, privacy_requests CASCADE",
    );
  try {
    await t.test(
      "acceptance atomically records lead, consent, outbox and receipt; lost-response retry returns same reference",
      async () => {
        const key = randomUUID();
        const first = await acceptLead(input, key, dependencies);
        const repeated = await acceptLead(
          { ...input, turnstileToken: "fresh-token" },
          key,
          {
            ...dependencies,
            verify: async () => {
              throw new Error("should not verify again");
            },
          },
        );
        assert.equal(first.publicReference, repeated.publicReference);
        for (const table of [
          "leads",
          "consent_records",
          "outbox_jobs",
          "idempotency_records",
          "lead_events",
        ])
          assert.equal(await count(table), 1, table);
        const record = (
          await pg.query<{ text: string; text_hash: string }>(
            "SELECT text, text_hash FROM consent_records",
          )
        ).rows[0];
        assert.equal(record.text, dependencies.consentText);
        assert.equal(record.text_hash.length, 64);
        await assert.rejects(
          acceptLead(
            { ...input, companyName: "Different company" },
            key,
            dependencies,
          ),
          (error: unknown) =>
            error instanceof LeadError && error.status === 409,
        );
        assert.equal(await count("leads"), 1);
      },
    );
    await t.test(
      "concurrent logical retries create one acceptance",
      async () => {
        await reset();
        const key = randomUUID();
        const responses = await Promise.all([
          acceptLead(input, key, dependencies),
          acceptLead(input, key, dependencies),
        ]);
        assert.equal(
          responses[0].publicReference,
          responses[1].publicReference,
        );
        assert.equal(await count("leads"), 1);
        assert.equal(await count("outbox_jobs"), 1);
      },
    );
    await t.test(
      "failure after lead insert rolls back all acceptance records",
      async () => {
        await reset();
        await pg.exec(
          "ALTER TABLE consent_records ADD CONSTRAINT test_failure CHECK (purpose <> 'contact_request')",
        );
        await assert.rejects(acceptLead(input, randomUUID(), dependencies));
        for (const table of [
          "leads",
          "consent_records",
          "outbox_jobs",
          "idempotency_records",
          "lead_events",
        ])
          assert.equal(await count(table), 0, table);
        await pg.exec(
          "ALTER TABLE consent_records DROP CONSTRAINT test_failure",
        );
      },
    );
    await t.test(
      "failed Turnstile does not persist a lead or consent",
      async () => {
        await reset();
        await assert.rejects(
          acceptLead(input, randomUUID(), {
            ...dependencies,
            verify: async () => false,
          }),
          (error: unknown) =>
            error instanceof LeadError && error.code === "VERIFICATION_FAILED",
        );
        assert.equal(await count("leads"), 0);
        assert.equal(await count("consent_records"), 0);
      },
    );
    await t.test(
      "persistent network/contact limit rejects attempt six and stores only keyed hashes",
      async () => {
        await reset();
        for (let i = 0; i < 5; i++)
          await acceptLead(input, randomUUID(), dependencies);
        await assert.rejects(
          acceptLead(input, randomUUID(), dependencies),
          (error: unknown) =>
            error instanceof LeadError && error.status === 429,
        );
        assert.equal(await count("leads"), 5);
        const keys = (
          await pg.query<{ key: string }>("SELECT key FROM rate_buckets")
        ).rows.map((row) => row.key);
        assert.ok(
          keys.every(
            (key) => /^[0-9a-f]{64}$/.test(key) && !key.includes(input.phone),
          ),
        );
      },
    );
    await t.test(
      "expired receipt can accept a later legitimate request without overwriting the original",
      async () => {
        await reset();
        const key = randomUUID();
        const first = await acceptLead(input, key, dependencies);
        await pg.query(
          "UPDATE idempotency_records SET expires_at=now()-interval '1 minute' WHERE key=$1",
          [secureHash(`idempotency:${key}`, secret)],
        );
        const second = await acceptLead(input, key, dependencies);
        assert.notEqual(first.publicReference, second.publicReference);
        assert.equal(await count("leads"), 2);
      },
    );
  } finally {
    await pg.close();
  }
});

test("Turnstile requires success plus the configured hostname and action", async () => {
  const priorFetch = globalThis.fetch;
  const priorSecret = process.env.TURNSTILE_SECRET_KEY;
  const priorSite = process.env.SITE_URL;
  process.env.TURNSTILE_SECRET_KEY = "test-secret";
  process.env.SITE_URL = "https://day.example";
  try {
    for (const [payload, accepted] of [
      [{ success: true, hostname: "day.example", action: "lead_submit" }, true],
      [
        { success: true, hostname: "evil.example", action: "lead_submit" },
        false,
      ],
      [{ success: true, hostname: "day.example", action: "other" }, false],
      [{ success: false }, false],
    ] as const) {
      globalThis.fetch = async () => Response.json(payload);
      assert.equal(await verifyTurnstile("token"), accepted);
    }
  } finally {
    globalThis.fetch = priorFetch;
    if (priorSecret === undefined) delete process.env.TURNSTILE_SECRET_KEY;
    else process.env.TURNSTILE_SECRET_KEY = priorSecret;
    if (priorSite === undefined) delete process.env.SITE_URL;
    else process.env.SITE_URL = priorSite;
  }
});

test("internal job requires configured strong secret and exact bearer match", () => {
  const prior = process.env.JOBS_SECRET;
  try {
    delete process.env.JOBS_SECRET;
    assert.equal(authorizedJob(new Request("https://example.com")), false);
    process.env.JOBS_SECRET = secret;
    assert.equal(
      authorizedJob(
        new Request("https://example.com", {
          headers: { Authorization: `Bearer ${secret}` },
        }),
      ),
      true,
    );
    assert.equal(
      authorizedJob(
        new Request("https://example.com", {
          headers: { Authorization: "Bearer wrong" },
        }),
      ),
      false,
    );
  } finally {
    if (prior === undefined) delete process.env.JOBS_SECRET;
    else process.env.JOBS_SECRET = prior;
  }
});

test("outbox preserves pending work, retries and reclaims only expired leases", async (t) => {
  const pg = new PGlite();
  await pg.exec(
    await readFile(
      new URL("../apps/web/drizzle/0000_solid_mojo.sql", import.meta.url),
      "utf8",
    ),
  );
  const db = drizzle(pg) as unknown as Parameters<
    typeof createLeadRepository
  >[0];
  const repository = createLeadRepository(db);
  const deps = {
    repository,
    secret,
    network: "outbox-test",
    consentText: "Autorización de prueba",
    verify: async () => true,
  };
  const priorFetch = globalThis.fetch;
  const priorEndpoint = process.env.NOTIFICATION_WEBHOOK_URL;
  const priorToken = process.env.NOTIFICATION_WEBHOOK_TOKEN;
  let calls = 0;
  const state = async () =>
    (
      await pg.query<{
        state: string;
        attempts: number;
        last_error: string | null;
      }>(
        "SELECT state, attempts, last_error FROM outbox_jobs ORDER BY created_at",
      )
    ).rows;
  try {
    await acceptLead(input, randomUUID(), deps);
    await t.test(
      "unconfigured receiver retains work, reports backlog and cleans expired rate buckets",
      async () => {
        delete process.env.NOTIFICATION_WEBHOOK_URL;
        delete process.env.NOTIFICATION_WEBHOOK_TOKEN;
        await pg.exec(
          "UPDATE rate_buckets SET expires_at=now()-interval '1 minute'",
        );
        globalThis.fetch = async () => {
          throw new Error("must not call a provider");
        };
        const result = await deliverOutbox(db);
        assert.equal(result.configured, false);
        assert.equal((result.backlog as { pending: number }).pending, 1);
        assert.equal((await state())[0].state, "pending");
        assert.equal(
          (
            await pg.query<{ count: number }>(
              "SELECT count(*)::integer AS count FROM rate_buckets",
            )
          ).rows[0].count,
          0,
        );
      },
    );
    process.env.NOTIFICATION_WEBHOOK_URL = "https://internal.example/notify";
    process.env.NOTIFICATION_WEBHOOK_TOKEN = "receiver-test-token";
    await t.test(
      "provider failure schedules retry and retry success uses a stable idempotency key",
      async () => {
        const keys: string[] = [];
        globalThis.fetch = async (_url, options) => {
          calls++;
          keys.push(new Headers(options?.headers).get("Idempotency-Key")!);
          return new Response("", { status: calls === 1 ? 503 : 200 });
        };
        const failed = await deliverOutbox(db);
        assert.equal(failed.failed, 1);
        assert.deepEqual((await state())[0], {
          state: "pending",
          attempts: 1,
          last_error: "DELIVERY_FAILED",
        });
        const early = await deliverOutbox(db);
        assert.equal(early.delivered, 0);
        assert.equal(calls, 1);
        await pg.exec(
          "UPDATE outbox_jobs SET next_attempt_at=now()-interval '1 minute'",
        );
        const completed = await deliverOutbox(db);
        assert.equal(completed.delivered, 1);
        assert.deepEqual((await state())[0], {
          state: "delivered",
          attempts: 2,
          last_error: null,
        });
        assert.equal(keys[0], keys[1]);
        assert.equal(calls, 2);
      },
    );
    await t.test(
      "active lease is not stolen; expired lease is retried",
      async () => {
        await pg.exec(
          "UPDATE outbox_jobs SET state='processing', attempts=2, lease_until=now()+interval '5 minutes'",
        );
        const active = await deliverOutbox(db);
        assert.equal(active.delivered, 0);
        assert.equal(calls, 2);
        await pg.exec(
          "UPDATE outbox_jobs SET lease_until=now()-interval '1 minute'",
        );
        const recovered = await deliverOutbox(db);
        assert.equal(recovered.delivered, 1);
        assert.equal(calls, 3);
        assert.equal((await state())[0].attempts, 3);
      },
    );
    await t.test(
      "exhausted expired leases become explicit failure without sending again",
      async () => {
        await pg.exec(
          "UPDATE outbox_jobs SET state='processing', attempts=6, lease_until=now()-interval '1 minute'",
        );
        const result = await deliverOutbox(db);
        assert.equal(result.delivered, 0);
        assert.equal(calls, 3);
        assert.deepEqual((await state())[0], {
          state: "failed",
          attempts: 6,
          last_error: "LEASE_EXHAUSTED",
        });
        assert.equal((result.backlog as { pending: number }).pending, 1);
      },
    );
  } finally {
    globalThis.fetch = priorFetch;
    if (priorEndpoint === undefined)
      delete process.env.NOTIFICATION_WEBHOOK_URL;
    else process.env.NOTIFICATION_WEBHOOK_URL = priorEndpoint;
    if (priorToken === undefined) delete process.env.NOTIFICATION_WEBHOOK_TOKEN;
    else process.env.NOTIFICATION_WEBHOOK_TOKEN = priorToken;
    await pg.close();
  }
});
