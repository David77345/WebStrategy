import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
// Run after `neon checkout`. Copies credentials without printing them.
const root = resolve(import.meta.dirname, "..");
const target = resolve(root, "apps/web/.env.local");
let output = readFileSync(
  existsSync(target) ? target : resolve(root, "apps/web/.env.example"),
  "utf8",
);
const source = readFileSync(resolve(root, ".env.local"), "utf8");
for (const [from, to] of [
  ["DATABASE_URL", "DATABASE_URL"],
  ["DATABASE_URL_UNPOOLED", "DATABASE_MIGRATION_URL"],
  ["NEON_BRANCH_ID", "NEON_BRANCH_ID"],
]) {
  const match = source.match(new RegExp(`^${from}=(.*)$`, "m"));
  if (!match) throw new Error(`Missing variable: ${from}`);
  const line = `${to}=${match[1]}`;
  output = new RegExp(`^${to}=.*$`, "m").test(output)
    ? output.replace(new RegExp(`^${to}=.*$`, "m"), () => line)
    : `${output}\n${line}\n`;
}
writeFileSync(target, output, { mode: 0o600 });
console.log("Next.js local environment synchronized; no credentials printed.");
