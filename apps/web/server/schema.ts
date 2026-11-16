import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
export const leads = pgTable(
  "leads",
  {
    id: uuid().primaryKey(),
    publicReference: text("public_reference").notNull().unique(),
    fullName: text("full_name").notNull(),
    companyName: text("company_name").notNull(),
    phone: text().notNull(),
    challenge: text().notNull(),
    context: text(),
    brandUrl: text("brand_url"),
    sourcePage: text("source_page").notNull(),
    attribution: jsonb(),
    status: text().notNull().default("new"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("leads_created_idx").on(table.createdAt),
    index("leads_status_idx").on(table.status),
  ],
);
export const consentRecords = pgTable("consent_records", {
  id: uuid().primaryKey(),
  leadId: uuid("lead_id")
    .notNull()
    .references(() => leads.id, { onDelete: "cascade" }),
  policyVersion: text("policy_version").notNull(),
  text: text().notNull(),
  textHash: text("text_hash").notNull(),
  purpose: text().notNull().default("contact_request"),
  channel: text().notNull().default("whatsapp"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
export const idempotencyRecords = pgTable("idempotency_records", {
  key: text().primaryKey(),
  payloadHash: text("payload_hash").notNull(),
  leadId: uuid("lead_id")
    .notNull()
    .references(() => leads.id, { onDelete: "cascade" }),
  publicReference: text("public_reference").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});
export const outboxJobs = pgTable(
  "outbox_jobs",
  {
    id: uuid().primaryKey(),
    leadId: uuid("lead_id")
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" })
      .unique(),
    state: text().notNull().default("pending"),
    attempts: integer().notNull().default(0),
    nextAttemptAt: timestamp("next_attempt_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    leaseUntil: timestamp("lease_until", { withTimezone: true }),
    leaseToken: uuid("lease_token"),
    lastError: text("last_error"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("outbox_pending_idx").on(table.state, table.nextAttemptAt)],
);
export const rateBuckets = pgTable("rate_buckets", {
  key: text().primaryKey(),
  count: integer().notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});
export const leadEvents = pgTable("lead_events", {
  id: uuid().primaryKey(),
  leadId: uuid("lead_id")
    .notNull()
    .references(() => leads.id, { onDelete: "cascade" }),
  type: text().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
export const privacyRequests = pgTable("privacy_requests", {
  id: uuid().primaryKey(),
  leadId: uuid("lead_id").references(() => leads.id, { onDelete: "set null" }),
  type: text().notNull(),
  status: text().notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
