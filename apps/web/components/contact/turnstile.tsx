"use client";
import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
type Api = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: Api;
  }
}
export function Turnstile({
  siteKey,
  onToken,
}: {
  siteKey: string;
  onToken: (token: string) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const id = useRef<string | null>(null);
  const [error, setError] = useState(false);
  const render = useCallback(() => {
    if (!container.current || !window.turnstile || id.current) return;
    id.current = window.turnstile.render(container.current, {
      sitekey: siteKey,
      action: "lead_submit",
      theme: "light",
      size: "flexible",
      callback: (token: string) => {
        setError(false);
        onToken(token);
      },
      "expired-callback": () => onToken(""),
      "error-callback": () => {
        setError(true);
        onToken("");
      },
    });
  }, [siteKey, onToken]);
  useEffect(() => {
    render();
    return () => {
      if (id.current && window.turnstile) {
        window.turnstile.remove(id.current);
        id.current = null;
      }
    };
  }, [render]);
  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        onReady={render}
        onError={() => setError(true)}
        strategy="afterInteractive"
      />
      <div ref={container} />
      {error && (
        <p role="alert">
          La verificación no está disponible. Revisa tu conexión y reiníciala.
        </p>
      )}
    </>
  );
}
