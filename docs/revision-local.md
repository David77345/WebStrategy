# Abrir y revisar en tu computador

Esta entrega está en `day-strategy-mvp`, dentro de la carpeta original. No abras el `package.json` del directorio padre: corresponde a propuestas anteriores.

## Apertura sencilla en Windows

1. Abrir `Abrir-Day-Strategy.cmd` con doble clic.
2. Mantener abierta la terminal y entrar a la dirección **Local** que indique, normalmente `http://localhost:3000`.
3. Cerrar con Ctrl+C. No es un HTML que se abra directamente: Next.js necesita su servidor local.

Las dependencias ya están instaladas en este computador. Para otro computador, instalar Node 24 LTS y usar el mismo acceso; la primera ejecución requiere Internet para `npm ci`. El ZIP no contiene credenciales, dependencias ni compilados.

Alternativa desde terminal situada en la carpeta del proyecto: `npm ci` y `npm run dev`. En este computador ya existe `apps/web/.env.local` con conexión a la rama **day-mvp-development** de Neon; no enviarlo ni subirlo a Git. En un computador nuevo se copia `.env.example` y la navegación funciona sin DB, con captación desactivada.

## Qué revisar

- Logo oficial en cabecera, portada y pie; contraste, textos e identidad.
- Inicio, Servicios, Método, Nosotros y cuatro trabajos del Portafolio.
- Menú en celular, fotos y nombres; no hay enlaces LinkedIn inventados.
- Contacto: aparece desactivado mientras falten configuración y aprobación legal. Eso evita captar datos sin el proceso completo.
- Privacidad, cookies, términos y ruta inexistente para comprobar 404.
- Portafolio: las fichas explican el trabajo recibido y enlazan a Canva; las piezas visuales individuales aún deben exportarse y autorizarse.

## Qué falta para publicar

1. Correo de privacidad. WhatsApp oficial ya configurado: **+57 323 761 1554**. Instagram y responsable legal también confirmados.
2. Completar y aprobar política: identidad/contacto, derechos, retención, proveedores y transferencias. Luego `LEGAL_APPROVED=true`.
3. Turnstile real con dominio y acción `lead_submit`, secrets y clave de seguridad. No usar claves de prueba públicamente.
4. Revisar roles mínimos para la aplicación y aplicar migraciones revisadas a producción. La rama de producción no fue migrada en esta entrega.
5. Elegir/conectar receptor de avisos internos, programar el procesador y alertas; definir quién revisa cada solicitud. El endpoint está implementado, el servicio receptor todavía no.
6. Crear bucket R2 privado, identidad age/custodios, copias diarias y alerta de ausencia. Realizar un ensayo de restauración; los scripts no equivalen a copias ya activas.
7. Confirmar permisos de fotos y trabajos, montar piezas originales y completar enlaces LinkedIn cuando estén disponibles.
8. Configurar dominio, secrets de Workers, presupuesto/alertas y probar el flujo real en staging. Publicar después; activar indexación solo en el dominio final.

La preparación de Neon y Cloudflare siguió las guías oficiales solicitadas. Los conectores recién instalados pueden requerir reiniciar Codex para aparecer; no hace falta reiniciarlo para abrir la web local.

## Desarrollo y migraciones

`neon checkout <rama>` actualiza el entorno raíz. Después ejecutar `node scripts/sync-neon-env.mjs` para sincronizar Next.js sin mostrar secretos. Verificar proyecto/rama antes de operar. `scripts/migrate.mjs` requiere `MIGRATION_BRANCH_CONFIRM` igual al ID de rama guardado en el entorno; esa comparación evita errores casuales, no sustituye revisar host y permisos. Usa la conexión de migración separada. `node scripts/smoke-database.mjs` comprueba conexión/esquema sin leer contactos.

Esta carpeta está vinculada mediante `origin` a [David77345/WebStrategy](https://github.com/David77345/WebStrategy), conservando su historial inicial. Para cambios posteriores crear una rama, revisar el diff y abrir un PR. Las credenciales, `node_modules`, `.next`, `.open-next` y `.wrangler` están excluidos de Git. Hacer push del código no despliega la web ni configura secretos de GitHub o Cloudflare.
