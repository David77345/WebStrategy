import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
export const metadata: Metadata = {
  title: "Cookies y tecnologías",
  robots: { index: false, follow: true },
};
export default function Cookies() {
  return (
    <LegalPage title="Cookies y tecnologías">
      <h2>Cómo funciona esta versión</h2>
      <p>
        La aplicación no incorpora publicidad, píxeles de redes sociales,
        grabación de sesiones ni analítica de terceros. El formulario conserva
        su estado únicamente en la memoria de la página; no guarda tus datos en
        el almacenamiento local del navegador.
      </p>
      <h2>Verificación de seguridad</h2>
      <p>
        Cuando el formulario está habilitado, Cloudflare Turnstile verifica el
        envío para reducir el abuso automatizado. Este servicio recibe
        información técnica de la conexión. Su configuración y el inventario de
        tecnologías deben revisarse antes de publicar.
      </p>
      <h2>Enlaces externos</h2>
      <p>
        Instagram, WhatsApp y Canva se abren solo cuando sigues sus enlaces. No
        se insertan sus contenidos ni rastreadores automáticamente en esta
        página. Cada servicio aplica sus propias condiciones.
      </p>
      <h2>Cambios futuros</h2>
      <p>
        Antes de añadir medición o publicidad se actualizará este inventario y,
        cuando corresponda, se solicitará una elección independiente. No se
        activarán campañas publicitarias por aceptar el formulario de contacto.
      </p>
    </LegalPage>
  );
}
