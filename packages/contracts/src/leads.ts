import { z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js/min";

export const POLICY_VERSION = "2026-11-15.v1";
export const challenges = [
  "positioning",
  "communication",
  "digital_presence",
  "integrated",
  "unsure",
] as const;
const text = (max: number) =>
  z
    .string()
    .trim()
    .min(2)
    .max(max)
    .refine(
      (value) => !/[\u0000-\u001f\u007f]/.test(value),
      "Usa texto sin caracteres de control.",
    );
export const leadSchema = z
  .object({
    fullName: text(120),
    companyName: text(160),
    phone: z
      .string()
      .trim()
      .max(30)
      .refine(
        (value) =>
          value.startsWith("+") &&
          Boolean(parsePhoneNumberFromString(value)?.isValid()),
        "Incluye un teléfono válido con código de país.",
      )
      .transform((value) => parsePhoneNumberFromString(value)!.number),
    challenge: z.enum(challenges),
    context: z.string().trim().max(1000).optional(),
    brandUrl: z
      .union([
        z.literal(""),
        z
          .url()
          .max(500)
          .refine(
            (value) => new URL(value).protocol === "https:",
            "Usa HTTPS.",
          ),
      ])
      .optional(),
    contactAuthorization: z.literal(true),
    policyVersion: z.literal(POLICY_VERSION),
    marketingConsent: z.literal(false).optional(),
    sourcePage: z.enum(["/", "/contacto"]),
    attribution: z
      .object({
        source: z
          .string()
          .max(80)
          .regex(/^[a-zA-Z0-9_-]*$/)
          .optional(),
        medium: z
          .string()
          .max(80)
          .regex(/^[a-zA-Z0-9_-]*$/)
          .optional(),
        campaign: z
          .string()
          .max(80)
          .regex(/^[a-zA-Z0-9_-]*$/)
          .optional(),
      })
      .strict()
      .optional(),
    turnstileToken: z.string().min(1).max(2048),
    honeypot: z.literal("").default(""),
  })
  .strict();
export type LeadInput = z.infer<typeof leadSchema>;
export type LeadAccepted = {
  status: "accepted";
  publicReference: string;
  whatsappUrl: string | null;
};
