import type { Metadata } from "next";
import { ServicesList, ContactBanner } from "@/components/sections";
import s from "@/components/site.module.css";
export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Estrategia y posicionamiento, branding y comunicación, presencia digital y crecimiento.",
  alternates: { canonical: "/servicios" },
};
export default function Services() {
  return (
    <>
      <section className={`${s.section} ${s.container}`}>
        <p className={s.eyebrow}>Servicios</p>
        <h1 className={s.title}>
          Una marca coherente,
          <br />
          <em>en cada punto de contacto.</em>
        </h1>
        <p className={s.lede}>
          Conectamos investigación, identidad y presencia digital. El punto de
          partida es entender qué necesita tu negocio.
        </p>
        <ServicesList />
      </section>
      <section className={`${s.section} ${s.cloud}`}>
        <div className={`${s.container} ${s.twoColumns}`}>
          <h2 className={s.title}>
            Cada proyecto
            <br />
            tiene su contexto.
          </h2>
          <div>
            <p>
              No partimos de una lista de piezas. Primero entendemos la marca y
              después definimos juntos el alcance, los entregables y la forma de
              trabajar.
            </p>
            <p>
              La estrategia orienta la creación. La implementación pone las
              ideas en práctica. La medición nos ayuda a decidir qué mejorar.
            </p>
          </div>
        </div>
      </section>
      <ContactBanner />
    </>
  );
}
