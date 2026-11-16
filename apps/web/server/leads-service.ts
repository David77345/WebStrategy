import { createHmac, randomUUID, createHash } from "node:crypto";
import type { LeadInput } from "@day-strategy/contracts";

export class LeadError extends Error {
  constructor(
    public code: string,
    public status: number,
  ) {
    super(code);
  }
}
export type StoredAcceptance = { publicReference: string; payloadHash: string };
export interface LeadRepository {
  find(key: string): Promise<StoredAcceptance | undefined>;
  allow(keys: string[], expiresAt: Date): Promise<boolean>;
  create(data: {
    id: string;
    reference: string;
    key: string;
    hash: string;
    input: LeadInput;
    consentText: string;
    consentHash: string;
  }): Promise<StoredAcceptance>;
}
export function secureHash(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}
export async function acceptLead(
  input: LeadInput,
  key: string,
  deps: {
    repository: LeadRepository;
    secret: string;
    network: string;
    consentText: string;
    verify: (token: string) => Promise<boolean>;
    now?: number;
  },
) {
  // Challenge token is single-use and changes on retries; it is not business content.
  const { turnstileToken, honeypot: _honeypot, ...content } = input;
  const hash = secureHash(JSON.stringify(content), deps.secret);
  const keyHash = secureHash(`idempotency:${key}`, deps.secret);
  function check(record: StoredAcceptance) {
    if (record.payloadHash !== hash)
      throw new LeadError("IDEMPOTENCY_CONFLICT", 409);
    return record;
  }
  const existing = await deps.repository.find(keyHash);
  if (existing) return check(existing);
  const bucket = Math.floor((deps.now ?? Date.now()) / 600000);
  const keys = [`network:${deps.network}`, `phone:${input.phone}`].map(
    (value) => secureHash(`${bucket}:${value}`, deps.secret),
  );
  if (!(await deps.repository.allow(keys, new Date((bucket + 2) * 600000))))
    throw new LeadError("RATE_LIMITED", 429);
  if (!(await deps.verify(turnstileToken))) {
    const raced = await deps.repository.find(keyHash);
    if (raced) return check(raced);
    throw new LeadError("VERIFICATION_FAILED", 400);
  }
  const result = await deps.repository.create({
    id: randomUUID(),
    reference: randomUUID(),
    key: keyHash,
    hash,
    input,
    consentText: deps.consentText,
    consentHash: createHash("sha256").update(deps.consentText).digest("hex"),
  });
  return check(result);
}
