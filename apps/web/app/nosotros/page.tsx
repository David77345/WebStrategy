import type { Metadata } from "next";
import Image from "next/image";
import { team } from "@/content/team";
import { ContactBanner } from "@/components/sections";
import s from "@/components/site.module.css";
export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Conoce a las personas detrás de DAY Strategy. Pensamiento científico, estrategia, comunicación y desarrollo web.",
  alternates: { canonical: "/nosotros" },
};
export default function About() {
  return (
    <>
      <section className={`${s.section} ${s.container}`}>
        <p className={s.eyebrow}>Nosotros</p>
        <h1 className={s.title}>
          Personas curiosas.
          <br />
          <em>Pensamiento riguroso.</em>
        </h1>
        <div className={s.twoColumns}>
          <p className={s.lede}>
            Somos una firma que conecta estrategia, identidad y comunicación
            para construir marcas con dirección.
          </p>
          <p>
            DAY nace de la visión de Daylin Alessandra Posada Contreras. Su
            formación como microbióloga, estratega digital y especialista en
            comunicación científica inspira nuestra manera de observar,
            comprender y crear.
          </p>
        </div>
      </section>
      <section className={`${s.section} ${s.cloud}`}>
        <div className={s.container}>
          <p className={s.eyebrow}>El equipo</p>
          <h2 className={s.title}>
            Perspectivas que
            <br />
            <em>se complementan.</em>
          </h2>
          <div className={s.team}>
            {team.map((person) => (
              <article key={person.name}>
                <Image
                  src={person.image}
                  alt={person.name}
                  width={500}
                  height={695}
                  sizes="(max-width:900px) 42vw, 21vw"
                />
                <h3>{person.name}</h3>
                <p>{person.role}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <ContactBanner />
    </>
  );
}
