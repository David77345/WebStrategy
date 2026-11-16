import type { ReactNode } from "react";
import s from "./site.module.css";
export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <article className={`${s.container} ${s.section} ${s.legal}`}>
      <p className={s.eyebrow}>Información y transparencia</p>
      <h1 className={s.title}>{title}</h1>
      {process.env.LEGAL_APPROVED !== "true" && (
        <aside className={s.notice}>
          <strong>Documento en revisión.</strong> Esta versión debe ser
          completada y aprobada por el responsable de DAY Strategy antes de
          habilitar la recepción pública de solicitudes.
        </aside>
      )}
      {children}
    </article>
  );
}
