"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BrandLogo } from "@/components/brand/brand-logo";
import s from "@/components/site.module.css";
const links = [
  ["/servicios", "Servicios"],
  ["/metodo", "Método"],
  ["/nosotros", "Nosotros"],
  ["/portafolio", "Portafolio"],
  ["/contacto", "Hablemos ↗"],
] as const;
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <div className={s.container}>
      <header className={s.header}>
        <Link
          href="/"
          aria-label="DAY Strategy — Inicio"
          onClick={() => setOpen(false)}
        >
          <BrandLogo />
        </Link>
        <button
          className={s.menuButton}
          type="button"
          aria-controls="site-navigation"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? "Cerrar" : "Menú"}
        </button>
        <nav
          id="site-navigation"
          aria-label="Navegación principal"
          className={`${s.nav} ${open ? s.open : ""}`}
        >
          {links.map(([url, label]) => (
            <Link
              key={url}
              href={url}
              aria-current={
                pathname === url || pathname.startsWith(url + "/")
                  ? "page"
                  : undefined
              }
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
      </header>
    </div>
  );
}
