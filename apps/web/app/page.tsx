import Link from "next/link";
import Image from "next/image";
import { BrandLogo } from "@/components/brand/brand-logo";
import { ServicesList, MethodList, ProjectList } from "@/components/sections";
import { ContactForm } from "@/components/contact/contact-form";
import { publicContactConfig } from "@/server/config";
import { companyContent } from "@/content/company";
import s from "@/components/site.module.css";
export const dynamic = "force-dynamic";
export default function Home() {
  return (
    <>
      <section className={`${s.hero} ${s.container}`}>
        <div>
          <p className={s.eyebrow}>{companyContent.eyebrow}</p>
          <h1>
            Estrategia para marcas
            <br />
            <em>que evolucionan.</em>
          </h1>
          <p className={s.lede}>{companyContent.summary}</p>
          <div className={s.actions}>
            <Link href="#contacto" className={s.button}>
              Hablemos de tu marca <span aria-hidden="true">↗</span>
            </Link>
            <Link href="/metodo" className={s.textLink}>
              Conoce el método ↓
            </Link>
          </div>
        </div>
        <div className={s.heroVisual}>
          <small>CLARIDAD · DIRECCIÓN · EVOLUCIÓN</small>
          <BrandLogo variant="hero" />
          <small>
            RIGOR EN EL PENSAMIENTO.
            <br />
            SENSIBILIDAD EN LA CREACIÓN.
          </small>
        </div>
      </section>
      <section className={`${s.section} ${s.cloud}`}>
        <div className={`${s.container} ${s.twoColumns}`}>
          <div>
            <p className={s.eyebrow}>Nuestra convicción</p>
            <h2 className={s.title}>
              Tu marca
              <br />
              es un sistema.
            </h2>
          </div>
          <div>
            <p className={s.lede}>
              La estrategia conecta cada parte: lo que eres, lo que dices y cómo
              te encuentran.
            </p>
            <p>{companyContent.mission}</p>
          </div>
        </div>
      </section>
      <section className={`${s.section} ${s.container}`}>
        <div className={s.sectionHeading}>
          <div>
            <p className={s.eyebrow}>01 / Lo que hacemos</p>
            <h2 className={s.title}>
              Decisiones con criterio.
              <br />
              <em>Marcas con dirección.</em>
            </h2>
          </div>
          <Link className={s.textLink} href="/servicios">
            Explorar servicios ↗
          </Link>
        </div>
        <ServicesList />
      </section>
      <section className={`${s.section} ${s.dark}`}>
        <div className={s.container}>
          <p className={s.eyebrow}>02 / Nuestro método</p>
          <h2 className={s.title}>
            Observar. Entender.
            <br />
            <em>Actuar con intención.</em>
          </h2>
          <p>
            Un proceso inspirado en el pensamiento científico, aplicado al valor
            de tu marca.
          </p>
          <MethodList />
          <Link href="/metodo" className={s.textLink}>
            Cómo trabajamos ↗
          </Link>
        </div>
      </section>
      <section className={`${s.section} ${s.container}`}>
        <div className={s.sectionHeading}>
          <div>
            <p className={s.eyebrow}>03 / Trabajo seleccionado</p>
            <h2 className={s.title}>
              El criterio
              <br />
              <em>también se ve.</em>
            </h2>
          </div>
          <Link href="/portafolio" className={s.textLink}>
            Ver portafolio ↗
          </Link>
        </div>
        <ProjectList limit={2} />
      </section>
      <section className={`${s.section} ${s.cloud}`}>
        <div className={`${s.container} ${s.twoColumns}`}>
          <Image
            className={s.founderImage}
            src="/team/daylin.jpg"
            width={700}
            height={875}
            sizes="(max-width:680px) 88vw, 40vw"
            alt="Daylin Alessandra Posada Contreras, CEO de DAY Strategy"
          />
          <div>
            <p className={s.eyebrow}>04 / Las personas detrás</p>
            <h2 className={s.title}>
              La precisión de la ciencia.
              <br />
              <em>La visión de una marca.</em>
            </h2>
            <p>
              DAY Strategy nace de una convicción: las marcas pueden construirse
              con el mismo rigor con el que la ciencia desarrolla conocimiento.
            </p>
            <p>
              La formación de nuestra fundadora como microbióloga, estratega
              digital y especialista en comunicación científica da origen a una
              forma de trabajar observadora, metódica y humana.
            </p>
            <Link href="/nosotros" className={s.textLink}>
              Conoce al equipo ↗
            </Link>
          </div>
        </div>
      </section>
      <section className={`${s.section} ${s.container}`} id="contacto">
        <ContactForm config={publicContactConfig()} sourcePage="/" />
      </section>
    </>
  );
}
