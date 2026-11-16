import { loadEnvFile } from "node:process";
import { resolve } from "node:path";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { migrate } from "drizzle-orm/neon-serverless/migrator";
import ws from "ws";
const root = resolve(import.meta.dirname, "..");
loadEnvFile(resolve(root, "apps/web/.env.local"));
if (
  !process.env.NEON_BRANCH_ID ||
  process.env.MIGRATION_BRANCH_CONFIRM !== process.env.NEON_BRANCH_ID
)
  throw new Error(
    "Set MIGRATION_BRANCH_CONFIRM to the verified target branch ID before applying migrations.",
  );
if (!process.env.DATABASE_MIGRATION_URL)
  throw new Error("Missing dedicated migration connection.");
neonConfig.webSocketConstructor = ws;
const pool = new Pool({
  connectionString: process.env.DATABASE_MIGRATION_URL,
  connectionTimeoutMillis: 10000,
});
try {
  await migrate(drizzle(pool), {
    migrationsFolder: resolve(root, "apps/web/drizzle"),
  });
  console.log(
    "Reviewed migrations applied to the explicitly confirmed branch.",
  );
} catch {
  console.error(
    "Migration failed; inspect privately. No credentials or SQL error details printed.",
  );
  process.exitCode = 1;
} finally {
  await pool.end();
}
