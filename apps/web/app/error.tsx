"use client";
import Link from "next/link";
import s from "@/components/site.module.css";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className={`${s.container} ${s.error}`} role="alert">
      <h1 className={s.title}>
        No pudimos cargar
        <br />
        esta página.
      </h1>
      <p>Puedes volver a intentarlo o regresar al inicio.</p>
      <div className={s.actions}>
        <button type="button" className={s.button} onClick={reset}>
          Volver a intentar
        </button>
        <Link href="/">Ir al inicio</Link>
      </div>
    </section>
  );
}
