import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
export const metadata: Metadata = {
  title: "Términos de uso",
  robots: { index: false, follow: true },
};
export default function Terms() {
  return (
    <LegalPage title="Términos de uso">
      <h2>Objeto del sitio</h2>
      <p>
        Este sitio presenta los servicios, el método, el equipo y una selección
        del trabajo de DAY Strategy. Permite iniciar una conversación comercial
        mediante una solicitud de contacto.
      </p>
      <h2>Solicitudes y servicios</h2>
      <p>
        Enviar una solicitud no formaliza un contrato ni implica una compra. El
        alcance, los entregables, las condiciones y cualquier contraprestación
        se acuerdan posteriormente con el equipo.
      </p>
      <h2>Contenido y portafolio</h2>
      <p>
        Las marcas y piezas de terceros se presentan como referencia del trabajo
        descrito. No se atribuyen resultados cuantitativos que no cuenten con
        evidencia. Los derechos de uso y publicación deben estar autorizados por
        sus titulares.
      </p>
      <h2>Uso adecuado</h2>
      <p>
        Comparte información propia y pertinente. No utilices el formulario para
        enviar datos sensibles, suplantar a otra persona, distribuir contenido
        malicioso o interrumpir el servicio.
      </p>
      <h2>Disponibilidad y contacto</h2>
      <p>
        Si no puede confirmarse el registro de una solicitud, la página lo
        indicará y permitirá volver a intentar. La apertura de WhatsApp no
        confirma por sí sola que un mensaje haya sido enviado o leído.
      </p>
      <p>
        La identificación legal, las condiciones específicas y los canales
        formales de DAY Strategy deben completarse antes de la publicación
        definitiva.
      </p>
    </LegalPage>
  );
}
