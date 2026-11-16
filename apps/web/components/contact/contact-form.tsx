"use client";
import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { leadSchema } from "@day-strategy/contracts";
import { Turnstile } from "./turnstile";
import s from "@/components/site.module.css";
import f from "./contact-form.module.css";
type Config = {
  enabled: boolean;
  siteKey: string;
  policyVersion: string;
  consentText: string;
  controller: string;
  privacyEmail: string;
  whatsappUrl: string | null;
};
type Success = { publicReference: string; whatsappUrl: string | null };
const messages: Record<string, string> = {
  VALIDATION_FAILED: "Revisa los campos señalados.",
  RATE_LIMITED:
    "Has realizado varios intentos. Espera unos minutos antes de volver a enviar.",
  VERIFICATION_FAILED:
    "No pudimos verificar el envío. Completa de nuevo la verificación.",
  CONTACT_UNAVAILABLE:
    "El formulario no está disponible en este momento. Vuelve a intentarlo más tarde.",
  IDEMPOTENCY_CONFLICT:
    "La solicitud cambió durante el envío. Revisa la información antes de volver a intentarlo.",
};
export function ContactForm({
  config,
  sourcePage,
}: {
  config: Config;
  sourcePage: "/" | "/contacto";
}) {
  const [token, setToken] = useState("");
  const [generation, setGeneration] = useState(0);
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState<Success | null>(null);
  const key = useRef<string | null>(null);
  const locked = useRef(false);
  const statusRef = useRef<HTMLDivElement>(null);
  const resetVerification = () => {
    setToken("");
    setGeneration((g) => g + 1);
  };
  function changed() {
    key.current = null;
    setMessage("");
    setErrors({});
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (locked.current || !config.enabled) return;
    const data = new FormData(event.currentTarget);
    const payload = {
      fullName: data.get("fullName"),
      companyName: data.get("companyName"),
      phone: data.get("phone"),
      challenge: data.get("challenge"),
      context: data.get("context") || undefined,
      contactAuthorization: data.get("contactAuthorization") === "on",
      policyVersion: config.policyVersion,
      sourcePage,
      turnstileToken: token,
      honeypot: data.get("website") || "",
    };
    const checked = leadSchema.safeParse(payload);
    if (!checked.success) {
      const fields: Record<string, string> = {};
      for (const issue of checked.error.issues) {
        const name = String(issue.path[0] ?? "form");
        fields[name] =
          (
            {
              fullName: "Escribe tu nombre (entre 2 y 120 caracteres).",
              companyName:
                "Escribe el nombre de tu marca (entre 2 y 160 caracteres).",
              phone: "Incluye un teléfono válido con código de país.",
              challenge: "Selecciona el tema que quieres mejorar.",
              contactAuthorization:
                "Necesitamos tu autorización para atender la solicitud.",
              context: "Usa como máximo 1000 caracteres.",
              turnstileToken: "Completa la verificación de seguridad.",
            } as Record<string, string>
          )[name] ?? "Revisa este campo.";
      }
      setErrors(fields);
      setMessage("Revisa la información antes de continuar.");
      const first = event.currentTarget.elements.namedItem(
        Object.keys(fields)[0],
      );
      if (first instanceof HTMLElement) first.focus();
      return;
    }
    locked.current = true;
    setPending(true);
    setErrors({});
    setMessage("");
    key.current ??= crypto.randomUUID();
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": key.current,
        },
        body: JSON.stringify(checked.data),
        signal: AbortSignal.timeout(20000),
      });
      const result = await response.json();
      if (!response.ok) {
        const fieldErrors: Record<string, string> = {};
        for (const [field, value] of Object.entries(result.fieldErrors ?? {})) {
          fieldErrors[field] = Array.isArray(value)
            ? String(value[0])
            : String(value);
        }
        setErrors(fieldErrors);
        if (response.status === 409) key.current = null;
        setMessage(
          messages[result.code] ??
            (response.status === 429
              ? "Espera unos minutos antes de volver a intentar."
              : "No pudimos confirmar el registro. Tus datos siguen aquí; puedes volver a intentarlo."),
        );
        resetVerification();
        return;
      }
      if (
        result.status !== "accepted" ||
        typeof result.publicReference !== "string"
      )
        throw new Error("Invalid response");
      setSuccess({
        publicReference: result.publicReference,
        whatsappUrl: result.whatsappUrl,
      });
      requestAnimationFrame(() => statusRef.current?.focus());
    } catch {
      setMessage(
        "No pudimos confirmar el registro. Revisa tu conexión y vuelve a intentarlo; conservaremos el mismo intento para evitar duplicados.",
      );
      resetVerification();
    } finally {
      locked.current = false;
      setPending(false);
    }
  }
  if (success)
    return (
      <div className={f.success} role="status" tabIndex={-1} ref={statusRef}>
        <p className={s.eyebrow}>Solicitud recibida</p>
        <h2>
          Gracias por contarnos
          <br />
          sobre tu marca.
        </h2>
        <p>
          Tu solicitud quedó registrada. Nuestro equipo continuará la
          conversación contigo.
        </p>
        <p className={f.reference}>
          Referencia: <strong>{success.publicReference}</strong>
        </p>
        {success.whatsappUrl && (
          <a
            className={s.button}
            href={success.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Continuar por WhatsApp ↗
          </a>
        )}
        <p className={f.privacy}>
          Abrir WhatsApp no envía un mensaje automáticamente. Puedes volver aquí
          si necesitas consultar tu referencia.
        </p>
        <Link className={s.textLink} href="/portafolio">
          Explorar nuestro trabajo ↗
        </Link>
      </div>
    );
  const fieldError = (name: string) =>
    errors[name] ? (
      <span id={`${name}-error`} className={f.fieldError}>
        {errors[name]}
      </span>
    ) : null;
  const state = (name: string) => ({
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });
  return (
    <div className={f.layout}>
      <div>
        <p className={s.eyebrow}>Contacto</p>
        <h2 className={s.title}>
          El siguiente paso
          <br />
          <em>empieza contigo.</em>
        </h2>
        <p className={s.lede}>
          Cuéntanos qué quieres mejorar. Nos comunicaremos contigo para conocer
          tu marca.
        </p>
        <p>
          No necesitas tener todas las respuestas. Una primera idea es
          suficiente para comenzar.
        </p>
        {!config.enabled && (
          <div className={f.message} role="status">
            <p>
              El formulario todavía no está disponible para recibir solicitudes.
            </p>
            <p>No se enviará ni guardará la información que escribas.</p>
            {config.whatsappUrl && (
              <a
                href={config.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Comunícate por WhatsApp ↗
              </a>
            )}
          </div>
        )}
      </div>
      <form
        className={f.form}
        onSubmit={submit}
        onChange={changed}
        noValidate
        aria-label="Solicitud de contacto"
      >
        <fieldset className={f.fields} disabled={pending || !config.enabled}>
          <label className={f.label}>
            Tu nombre
            <input
              name="fullName"
              autoComplete="name"
              required
              minLength={2}
              maxLength={120}
              {...state("fullName")}
            />
            {fieldError("fullName")}
          </label>
          <label className={f.label}>
            Empresa o marca
            <input
              name="companyName"
              autoComplete="organization"
              required
              minLength={2}
              maxLength={160}
              {...state("companyName")}
            />
            {fieldError("companyName")}
          </label>
          <label className={f.label}>
            Tu WhatsApp
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="+57 300 000 0000"
              required
              maxLength={30}
              {...state("phone")}
            />
            <span className={f.hint}>
              Incluye el código de país, por ejemplo +57 para Colombia.
            </span>
            {fieldError("phone")}
          </label>
          <label className={f.label}>
            ¿Qué quieres mejorar?
            <select
              name="challenge"
              defaultValue=""
              required
              {...state("challenge")}
            >
              <option value="" disabled>
                Selecciona una opción
              </option>
              <option value="positioning">Posicionamiento de marca</option>
              <option value="communication">Identidad y comunicación</option>
              <option value="digital_presence">Presencia digital</option>
              <option value="integrated">Una estrategia integral</option>
              <option value="unsure">Quiero orientación</option>
            </select>
            {fieldError("challenge")}
          </label>
          <label className={f.label}>
            Algo más que quieras contarnos · opcional
            <textarea
              name="context"
              rows={4}
              maxLength={1000}
              {...state("context")}
            />
            {fieldError("context")}
          </label>
          <div className={f.botField} aria-hidden="true">
            <label>
              Deja este campo vacío
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <label className={f.check}>
            <input
              type="checkbox"
              name="contactAuthorization"
              required
              {...state("contactAuthorization")}
            />
            <span>
              {config.consentText ||
                "Autorizo el tratamiento de mis datos para atender esta solicitud y contactarme por WhatsApp."}{" "}
              <Link href="/privacidad" target="_blank">
                Consultar política de tratamiento de datos
              </Link>
              .{fieldError("contactAuthorization")}
            </span>
          </label>
          {config.enabled && (
            <div className={f.verification}>
              <Turnstile
                key={generation}
                siteKey={config.siteKey}
                onToken={setToken}
              />
              {fieldError("turnstileToken")}
              <button
                className={f.retry}
                type="button"
                onClick={resetVerification}
              >
                Reiniciar verificación
              </button>
            </div>
          )}
          <div className={f.submit}>
            <button
              className={s.button}
              type="submit"
              disabled={pending || !config.enabled}
            >
              {pending ? "Enviando…" : "Comunícate con nosotros ↗"}
            </button>
          </div>
        </fieldset>
        {message && (
          <div className={f.message} role="alert">
            {message}
          </div>
        )}
        <p className={f.privacy}>
          Usaremos estos datos para atender tu solicitud. Este formulario no te
          suscribe a campañas publicitarias.
        </p>
        <noscript>
          <p>Activa JavaScript para verificar y enviar el formulario.</p>
        </noscript>
      </form>
    </div>
  );
}
