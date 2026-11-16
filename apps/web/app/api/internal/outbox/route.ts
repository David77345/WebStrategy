import { authorizedJob, json } from "@/server/http";
import { openDatabase } from "@/server/database";
import { deliverOutbox } from "@/server/outbox";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  if (!authorizedJob(request)) return json({ code: "UNAUTHORIZED" }, 401);
  let database: ReturnType<typeof openDatabase> | undefined;
  try {
    database = openDatabase();
    return json(await deliverOutbox(database.db));
  } catch {
    return json({ code: "JOB_UNAVAILABLE" }, 503);
  } finally {
    await database?.close().catch(() => undefined);
  }
}
