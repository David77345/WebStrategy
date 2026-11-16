# DAY Strategy — MVP

Repositorio de entrega: [David77345/WebStrategy](https://github.com/David77345/WebStrategy). Implementación basada en el monorepo original `Mystifyc/Web-DayStrategy`, copia revisada `f842d90`. Next.js App Router, PostgreSQL/Neon, Drizzle y OpenNext para Cloudflare. La publicación del código en GitHub es independiente del despliegue del sitio; la web aún no está publicada.

## Empezar

Usar Node 24 LTS (ver `.nvmrc`) y npm. Desde esta carpeta:

```sh
npm ci
```

Copiar `apps/web/.env.example` a `apps/web/.env.local`, completar únicamente variables disponibles y ejecutar:

```sh
npm run dev
```

Abrir `http://localhost:3000`. La navegación funciona sin secretos. La recepción de solicitudes permanece desactivada hasta completar y aprobar la configuración; no hay éxito simulado ni DB en memoria en producción. No pegar credenciales en chats ni Git.

## Estructura

- `apps/web/app`: páginas, metadata, estados y API del MVP.
- `apps/web/components`: UI accesible, CSS Modules, formulario y Turnstile.
- `apps/web/content`: servicios, método, equipo y portafolio recibido.
- `apps/web/server`: configuración, transacción, antispam, outbox y conexión.
- `apps/web/drizzle`: SQL versionado; revisar antes de aplicar.
- `packages/contracts`: validación compartida y tipos.
- `tests`: contratos, lógica y persistencia aislada con PostgreSQL/PGlite.
- `scripts`: copias cifradas y restauración aislada.
- `docs`: brújula consolidada, decisiones, puesta en marcha y aceptación.

`apps/api` se conserva como reserva documental; no es un segundo servidor ni un portal V2.

## Comprobar

```sh
npm run typecheck
npm test
npm run build
npm run build:worker
```

El último comando construye el Worker; no lo publica. Probar el runtime con `npm run preview:worker --workspace @day-strategy/web`. Preferir Linux/WSL para el empaquetado OpenNext y los scripts de operaciones. Revisar `docs/validation.md` para los resultados realmente ejecutados y sus límites.

## Documentación vigente

Empezar por [docs/README.md](docs/README.md) y [Brújula v1.5](docs/BRUJULA-MVP-v1.5.md). Las v1.2–v1.4 del directorio padre se conservan como historial, no como instrucciones contradictorias de implementación.

## Activación pendiente

Pendientes: correo de privacidad, política definitiva, claves Turnstile, roles/DB y migraciones revisadas, receptor interno y programación de avisos, R2/llaves/custodios/ensayo de restauración, dominio y permisos editoriales. WhatsApp oficial confirmado: **+57 323 761 1554**, configurado como `573237611554` para el enlace a chat. Instagram confirmado: `@daystrategy`. Responsable legal confirmado: Daylin Alessandra Posada Contreras. Wilmar es responsable técnico y la CEO coordina la atención posterior.

El portafolio usa únicamente los trabajos entregados y enlaza al material original de Canva; no inventa resultados ni incluye Habitia. Las páginas legales se marcan como revisión hasta aprobarlas. LinkedIn aún pendiente. WhatsApp es canal de conversación, sin Cloud API. V2 permanece fuera.
