import s from "@/components/site.module.css";
export default function Loading() {
  return (
    <div className={`${s.container} ${s.section}`} role="status">
      Cargando…
    </div>
  );
}
