import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import { publicContactConfig } from "@/server/config";
import { instagramUrl } from "@/content/settings";
import s from "@/components/site.module.css";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Cuéntanos sobre tu marca. Comunícate con el equipo de DAY Strategy.",
  alternates: { canonical: "/contacto" },
};
export default function Contact() {
  const instagram = instagramUrl();
  return (
    <section className={`${s.section} ${s.container}`}>
      <h1 className={s.title}>Hablemos de tu marca.</h1>
      <ContactForm config={publicContactConfig()} sourcePage="/contacto" />
      {instagram && (
        <p className={s.actions}>
          <a
            className={s.textLink}
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
          >
            También estamos en Instagram ↗
          </a>
        </p>
      )}
    </section>
  );
}
