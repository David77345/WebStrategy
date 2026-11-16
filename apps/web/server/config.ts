import { POLICY_VERSION } from "@day-strategy/contracts";

export function publicContactConfig() {
  const controller = process.env.PRIVACY_CONTROLLER?.trim() ?? "";
  const privacyEmail = process.env.PRIVACY_EMAIL?.trim() ?? "";
  // Passed explicitly to the client; runtime configuration works on Workers too.
  const siteKey =
    process.env.TURNSTILE_SITE_KEY ??
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ??
    "";
  const enabled =
    process.env.CONTACT_ENABLED === "true" &&
    process.env.LEGAL_APPROVED === "true" &&
    Boolean(
      controller &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(privacyEmail) &&
      whatsappUrl() &&
      siteKey &&
      process.env.DATABASE_URL &&
      process.env.SITE_URL &&
      process.env.TURNSTILE_SECRET_KEY &&
      (process.env.SECURITY_HMAC_KEY?.length ?? 0) >= 32,
    );
  return {
    enabled,
    controller,
    privacyEmail,
    siteKey,
    policyVersion: POLICY_VERSION,
    consentText: `Autorizo a ${controller || "DAY Strategy"} a tratar la información que envío para atender esta solicitud y contactarme por WhatsApp, según la Política de Tratamiento de Datos.`,
    whatsappUrl: whatsappUrl(),
  };
}
export function whatsappUrl(reference?: string): string | null {
  const number = process.env.WHATSAPP_NUMBER;
  if (!number || !/^[1-9]\d{7,14}$/.test(number)) return null;
  const message = reference
    ? `Hola, quiero conversar con DAY Strategy. Mi referencia es ${reference}.`
    : "Hola, quiero conversar con DAY Strategy.";
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
