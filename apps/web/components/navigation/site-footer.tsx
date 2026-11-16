import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { instagramUrl } from "@/content/settings";
import s from "@/components/site.module.css";
export function SiteFooter() {
  const instagram = instagramUrl();
  return (
    <footer className={`${s.footer} ${s.container}`}>
      <div className={s.footerTop}>
        <Link href="/" aria-label="DAY Strategy — Inicio">
          <BrandLogo variant="footer" />
        </Link>
        <div>
          <p>
            Una dirección clara.
            <br />
            Una marca con sentido.
          </p>
          <div className={s.footerLinks}>
            <Link href="/contacto">Comunícate con nosotros ↗</Link>
            {instagram && (
              <a href={instagram} target="_blank" rel="noopener noreferrer">
                Instagram ↗
              </a>
            )}
          </div>
        </div>
      </div>
      <div className={s.footerBottom}>
        <span>© {new Date().getFullYear()} DAY Strategy · Colombia</span>
        <div className={s.footerLinks}>
          <Link href="/privacidad">Privacidad</Link>
          <Link href="/cookies">Cookies</Link>
          <Link href="/terminos">Términos</Link>
        </div>
      </div>
    </footer>
  );
}
