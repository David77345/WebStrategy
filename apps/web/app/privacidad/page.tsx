import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { publicContactConfig } from "@/server/config";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Tratamiento de datos personales",
  robots: { index: false, follow: true },
};
export default function Privacy() {
  const config = publicContactConfig();
  return (
    <LegalPage title="Tratamiento de datos personales">
      <p>
        Esta página explica el uso previsto de la información que compartes en
        el formulario de contacto de DAY Strategy.
      </p>
      <h2>Responsable y canal de atención</h2>
      <p>
        {config.controller ||
          "Identidad legal del responsable: pendiente de completar antes de activar el formulario."}
      </p>
      {config.privacyEmail ? (
        <p>
          Para consultas sobre tus datos:{" "}
          <a href={`mailto:${config.privacyEmail}`}>{config.privacyEmail}</a>.
        </p>
      ) : (
        <p>El canal de atención de derechos está pendiente de confirmación.</p>
      )}
      <h2>Qué información solicitamos</h2>
      <p>
        Nombre, empresa o marca, número de WhatsApp con código de país, el tema
        de interés y, si decides incluirlo, un breve contexto. No envíes
        documentos de identidad, datos sensibles ni información de terceros.
      </p>
      <h2>Para qué la utilizamos</h2>
      <p>
        Para registrar y atender tu solicitud, comunicarnos contigo por WhatsApp
        y conservar evidencia de la autorización que otorgas. Enviar una
        solicitud no supone suscribirte a publicidad.
      </p>
      <h2>Autorización</h2>
      <p>
        {config.consentText ||
          "Antes de enviar el formulario podrás consultar la autorización aplicable y aceptarla expresamente. La casilla no estará premarcada."}
      </p>
      <p>
        Conservamos la versión del aviso, la respuesta y la fecha de la
        autorización. Versión de contacto: {config.policyVersion}.
      </p>
      <h2>Proveedores y ubicación</h2>
      <p>
        La infraestructura prevista utiliza Cloudflare y PostgreSQL de Neon en
        São Paulo. Las copias de seguridad pueden almacenarse fuera de
        Suramérica y se cifran antes de su envío. Si continúas la conversación
        en WhatsApp, también se aplican las condiciones de ese servicio.
      </p>
      <h2>Conservación y tus derechos</h2>
      <p>
        Puedes solicitar información sobre tus datos, su actualización,
        corrección, supresión o la revocación de tu autorización por el canal
        del responsable. Se verificará tu identidad de forma proporcional para
        evitar entregar información a terceros.
      </p>
      <p>
        Los plazos concretos de conservación, atención y las condiciones
        aplicables a proveedores deben quedar aprobados en la política
        definitiva. No se habilitará esta versión como política final mientras
        esos datos estén pendientes.
      </p>
    </LegalPage>
  );
}
