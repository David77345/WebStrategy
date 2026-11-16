# Evidencia de validación — 15 noviembre 2026

## Comprobado

| Comprobación | Resultado |
| --- | --- |
| TypeScript, ambos workspaces | Aprobado |
| Next.js 16.4.6, build de producción | Aprobado; páginas + endpoints dinámicos |
| OpenNext 1.20.17, build Worker | Aprobado en Windows; también ejecutar CI Linux antes de publicar |
| Runtime local workerd | Inicio HTTP 200; captación desactivada HTTP 503 |
| Backend, `npm test` | 16 pruebas aprobadas, 0 fallos |
| UI, `npm run test:browser` | 13 rutas × 4 anchos (320, 390, 768, 1440); sin desbordamiento horizontal ni errores JS |
| Menú móvil y estados | Navegación/cierre, 404, contacto desactivado, job sin autorización 401 aprobados |
| Formulario aislado, `npm run test:form` | Validación, fallo de red, conservación de datos, misma clave de reintento y confirmación aprobados |
| Neon | São Paulo, PostgreSQL 18; siete tablas migradas/verificadas en rama de desarrollo |
| Dependencias | `npm audit`: 0 avisos conocidos tras actualización/overrides; no es certificación de seguridad |
| Scripts operativos | Sintaxis Bash verificada; backup/restauración reales aún no ejecutados |

La prueba del backend usa PGlite (motor PostgreSQL aislado), Drizzle y la migración real. Comprueba rollback tras inserción parcial, consentimiento/outbox atómicos, idempotencia, concurrencia lógica, expiración, rate limiting, Turnstile y autorización de jobs. La prueba del outbox simula el receptor externo y comprueba leases, reintentos y agotamiento.

La prueba del formulario intercepta la red solo dentro de Playwright. El servidor de prueba se inició en loopback con conexión deliberadamente inválida y valores sintéticos; no envió contactos ni llamadas a WhatsApp. Esa prueba valida UI y contratos, no la integración real de Turnstile/avisos. No hay modo de éxito simulado en la aplicación.

La prueba Neon leyó únicamente catálogo de esquema. Se aplicó SQL a `day-mvp-development`, rama `br-rapid-bird-b6w7yewz`, compute 0.25 CU con suspensión predeterminada del plan Free. La rama production no recibió migraciones ni datos de prueba. Las conexiones locales provienen de la CLI oficial; falta crear roles mínimos para producción.

## Repetir

- `npm test`, `npm run typecheck`, `npm run build:worker`.
- Para páginas: iniciar `next start` en puerto 3010 después del build y ejecutar `npm run test:browser`; `TEST_URL` permite otra URL. Playwright usa Edge instalado en Windows; en Linux instalar su Chromium.
- Para `test:form`: iniciar otro servidor solo de prueba en 3011 con `CONTACT_ENABLED=true`, `LEGAL_APPROVED=true`, `PRIVACY_EMAIL=test@example.test`, `WHATSAPP_NUMBER=12025550123`, `TURNSTILE_SITE_KEY=test-key`, `TURNSTILE_SECRET_KEY=test-secret`, `SECURITY_HMAC_KEY` sintética de al menos 32 caracteres y `DATABASE_URL` deliberadamente inválida. No guardar estos ajustes en el entorno habitual. La prueba intercepta proveedor y endpoint; cerrar servidor al terminar.
- `npm run db:check` verifica catálogo sin leer contactos; necesita conexión local. `db:migrate` requiere confirmación explícita de rama y conexión separada.

## Límites que permanecen

Falta prueba integral en staging con Turnstile real, rol mínimo de Neon, aviso interno/alerta y restauración cifrada. No se ha desplegado Worker ni vinculado dominio, activado backups o scheduler. No hay auditoría WCAG completa, prueba de carga ni medición de Core Web Vitals de campo. El portafolio visual necesita piezas y permisos; política legal y correo deben completarse. No afirmar disponibilidad contractual ni cumplimiento legal por pasar estas pruebas.

`glob`, `minimatch` y `esbuild` se fijan con overrides para corregir avisos transitivos. Build Next/OpenNext y generación Drizzle pasaron con esas versiones; revisar overrides al actualizar herramientas.

CSP restringe orígenes y frames, pero permite scripts inline por la salida de Next. No es CSP estricta por nonce. Esta decisión y el despliegue en Cloudflare se deben revisar en staging. No hay analítica ni publicidad externa activas.
