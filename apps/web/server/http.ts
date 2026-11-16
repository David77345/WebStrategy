import { timingSafeEqual } from "node:crypto";
export function json(
  body: unknown,
  status = 200,
  extra: Record<string, string> = {},
) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...extra,
    },
  });
}
export async function readLimitedJson(
  request: Request,
  limit = 16384,
): Promise<unknown> {
  if (
    request.headers
      .get("content-type")
      ?.split(";", 1)[0]
      .trim()
      .toLowerCase() !== "application/json"
  )
    throw Object.assign(new Error("UNSUPPORTED_MEDIA_TYPE"), { status: 415 });
  const stream = request.body?.getReader();
  if (!stream) throw Object.assign(new Error("INVALID_JSON"), { status: 400 });
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  try {
    while (true) {
      const { value, done } = await stream.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > limit) {
        await stream.cancel();
        throw Object.assign(new Error("BODY_TOO_LARGE"), { status: 413 });
      }
      chunks.push(value);
    }
    const buffer = new Uint8Array(bytes);
    let offset = 0;
    for (const chunk of chunks) {
      buffer.set(chunk, offset);
      offset += chunk.byteLength;
    }
    try {
      return JSON.parse(
        new TextDecoder("utf-8", { fatal: true }).decode(buffer),
      );
    } catch {
      throw Object.assign(new Error("INVALID_JSON"), { status: 400 });
    }
  } finally {
    stream.releaseLock();
  }
}
export function authorizedJob(request: Request): boolean {
  const secret = process.env.JOBS_SECRET;
  if (!secret || secret.length < 32) return false;
  const expected = Buffer.from(`Bearer ${secret}`);
  const actual = Buffer.from(request.headers.get("authorization") ?? "");
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
