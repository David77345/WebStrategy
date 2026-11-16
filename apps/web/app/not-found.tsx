import Link from "next/link";
import s from "@/components/site.module.css";
export default function NotFound() {
  return (
    <section className={`${s.container} ${s.error}`}>
      <p className={s.eyebrow}>404 / Página no encontrada</p>
      <h1 className={s.title}>
        Volvamos a<br />
        <em>una dirección clara.</em>
      </h1>
      <p>El enlace no corresponde a una página disponible.</p>
      <div className={s.actions}>
        <Link href="/" className={s.button}>
          Ir al inicio ↗
        </Link>
        <Link href="/contacto" className={s.textLink}>
          Comunícate con nosotros
        </Link>
      </div>
    </section>
  );
}
