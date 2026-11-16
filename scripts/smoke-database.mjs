import { loadEnvFile } from "node:process";
import { resolve } from "node:path";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
loadEnvFile(resolve(import.meta.dirname, "../apps/web/.env.local"));
neonConfig.webSocketConstructor = ws;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000,
});
try {
  const { rows } = await pool.query(
    "SELECT count(*)::int AS tables FROM information_schema.tables WHERE table_schema='public' AND table_name IN ('leads','consent_records','outbox_jobs','idempotency_records','lead_events','rate_buckets','privacy_requests')",
  );
  if (rows[0].tables !== 7) throw new Error("Missing schema");
  console.log(
    "Neon TLS connection and all seven MVP tables verified. No lead data read or written.",
  );
} catch {
  console.error(
    "Database smoke check failed; inspect configuration privately.",
  );
  process.exitCode = 1;
} finally {
  await pool.end();
}
