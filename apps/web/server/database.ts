import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";

// Neon uses a request-scoped WebSocket pool: no persistent connection crosses Worker requests.
export function openDatabase() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_UNAVAILABLE");
  neonConfig.webSocketConstructor = globalThis.WebSocket ?? ws;
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 2,
    connectionTimeoutMillis: 8000,
  });
  return { db: drizzle(pool), close: () => pool.end() };
}
