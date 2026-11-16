import type { Metadata } from "next";
import { MethodList, ContactBanner } from "@/components/sections";
import s from "@/components/site.module.css";
export const metadata: Metadata = {
  title: "Nuestro método",
  description:
    "Observar, formular hipótesis, experimentar, medir y optimizar. Así trabajamos en DAY Strategy.",
  alternates: { canonical: "/metodo" },
};
export default function Method() {
  return (
    <>
      <section className={`${s.section} ${s.container}`}>
        <p className={s.eyebrow}>El método DAY</p>
        <h1 className={s.title}>
          Buenas preguntas.
          <br />
          <em>Mejores decisiones.</em>
        </h1>
        <p className={s.lede}>
          El pensamiento científico nos ayuda a comprender antes de proponer,
          poner a prueba las ideas y aprender de lo que sucede.
        </p>
      </section>
      <section className={`${s.section} ${s.dark}`}>
        <div className={s.container}>
          <h2 className={s.title}>
            Cinco momentos.
            <br />
            Un proceso que evoluciona.
          </h2>
          <MethodList />
        </div>
      </section>
      <section className={`${s.section} ${s.container} ${s.twoColumns}`}>
        <h2 className={s.title}>
          Aprender también
          <br />
          es avanzar.
        </h2>
        <div>
          <p>
            No tratamos la estrategia como un documento que se entrega y se
            olvida. Es una dirección que se contrasta con el contexto y la
            experiencia.
          </p>
          <p>
            Definimos qué observar, revisamos lo que funciona y ajustamos con
            criterio. La evidencia guía el siguiente paso.
          </p>
        </div>
      </section>
      <ContactBanner />
    </>
  );
}
