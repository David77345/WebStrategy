import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, portfolioUrl } from "@/content/portfolio";
import { ContactBanner } from "@/components/sections";
import s from "@/components/site.module.css";
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((p) => p.slug === slug);
  return {
    title: p?.name ?? "Trabajo no encontrado",
    description: p?.introduction,
    alternates: { canonical: `/portafolio/${slug}` },
  };
}
export default async function Project({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = projects.find((p) => p.slug === slug);
  if (!p) notFound();
  return (
    <>
      <section className={`${s.section} ${s.container}`}>
        <Link className={s.back} href="/portafolio">
          ← Todos los trabajos
        </Link>
        <p className={s.eyebrow}>{p.category}</p>
        <h1 className={s.title}>{p.name}</h1>
        <p className={s.lede}>{p.introduction}</p>
        <div className={`${s.twoColumns} ${s.section}`}>
          <div>
            <h2 className={s.title}>El trabajo</h2>
            <p>
              Una selección de los entregables incluidos en el portafolio de DAY
              Strategy.
            </p>
            <a
              href={portfolioUrl}
              className={s.button}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver piezas originales ↗
            </a>
          </div>
          <ul className={s.scope}>
            {p.scope.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
      <ContactBanner />
    </>
  );
}
