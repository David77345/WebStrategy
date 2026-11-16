import type { Metadata } from "next";
import { ProjectList, ContactBanner } from "@/components/sections";
import { portfolioUrl } from "@/content/portfolio";
import s from "@/components/site.module.css";
export const metadata: Metadata = {
  title: "Portafolio",
  description:
    "Una selección del trabajo de DAY Strategy en identidad, comunicación y presencia digital.",
  alternates: { canonical: "/portafolio" },
};
export default function Portfolio() {
  return (
    <>
      <section className={`${s.section} ${s.container}`}>
        <p className={s.eyebrow}>Portafolio</p>
        <h1 className={s.title}>
          De la intención
          <br />
          <em>a la expresión.</em>
        </h1>
        <p className={s.lede}>
          Una primera mirada a nuestro trabajo en identidad, comunicación y
          presencia digital.
        </p>
        <a
          className={s.textLink}
          href={portfolioUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver las piezas en el portafolio original ↗
        </a>
        <ProjectList />
      </section>
      <ContactBanner />
    </>
  );
}
