import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/navigation/site-footer";
import { siteUrl } from "@/content/settings";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: {
    default: "DAY Strategy | Estrategia para marcas que evolucionan",
    template: "%s | DAY Strategy",
  },
  description:
    "Pensamiento científico, branding y comunicación. Una dirección clara para el valor de tu marca.",
  robots: {
    index: process.env.INDEXING_ENABLED === "true",
    follow: process.env.INDEXING_ENABLED === "true",
  },
  openGraph: {
    title: "DAY Strategy",
    description:
      "Estrategia, identidad y comunicación para marcas que evolucionan.",
    locale: "es_CO",
    type: "website",
  },
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <a className="skip-link" href="#contenido">
          Saltar al contenido
        </a>
        <SiteHeader />
        <main id="contenido">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
