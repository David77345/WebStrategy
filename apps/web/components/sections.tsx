import Link from "next/link";
import { companyContent } from "@/content/company";
import { projects } from "@/content/portfolio";
import s from "./site.module.css";
export function ServicesList() {
  return (
    <div className={s.rows}>
      {companyContent.services.map((item, i) => (
        <article className={s.service} key={item.id}>
          <span className={s.number}>0{i + 1}</span>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </article>
      ))}
    </div>
  );
}
export function MethodList() {
  return (
    <ol className={s.method}>
      {companyContent.method.map((step, i) => (
        <li key={step.id}>
          <span className={s.number}>0{i + 1}</span>
          <h3>{step.title}</h3>
          <p>{step.description}</p>
        </li>
      ))}
    </ol>
  );
}
export function ProjectList({ limit = 4 }: { limit?: number }) {
  return (
    <div className={s.grid}>
      {projects.slice(0, limit).map((p) => (
        <Link href={`/portafolio/${p.slug}`} className={s.project} key={p.slug}>
          <div className={s.projectTop}>
            <span>Trabajo seleccionado</span>
            <span>{p.number}</span>
          </div>
          <h3>{p.name}</h3>
          <p>{p.introduction}</p>
          <div className={s.projectCategory}>
            <span>{p.category}</span>
            <span aria-hidden="true">↗</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
export function ContactBanner() {
  return (
    <section className={`${s.section} ${s.dark}`}>
      <div className={`${s.container} ${s.twoColumns}`}>
        <div>
          <p className={s.eyebrow}>El siguiente paso</p>
          <h2 className={s.title}>
            Hablemos de
            <br />
            <em>tu marca.</em>
          </h2>
        </div>
        <div>
          <p className={s.lede}>
            Cuéntanos qué estás construyendo y qué quieres mejorar. Empezamos
            por escucharte.
          </p>
          <Link className={`${s.button} ${s.lightButton}`} href="/contacto">
            Comunícate con nosotros <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
