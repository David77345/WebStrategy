# Arquitectura del MVP

Decisiones vigentes: [brújula v1.5](BRUJULA-MVP-v1.5.md). La exportación estática y Prisma propuestos por la base anterior quedan sustituidos por Next.js con servidor, OpenNext y Drizzle sobre Neon.

```text
Visitante → Next.js → POST /api/leads → validación/antispam
  → transacción PostgreSQL: lead + consentimiento + outbox
  → confirmación → enlace WhatsApp → atención humana de CEO
Outbox → procesador autenticado → destino interno configurado
PostgreSQL → pg_dump + age en runner Linux → R2 privado
```

`apps/web/app` contiene rutas y adaptadores HTTP, `components` la interfaz, `content` textos/activos y `server` casos de uso/adaptadores. `packages/contracts` comparte esquemas públicos sin credenciales. El navegador no importa SQL. `apps/api` permanece reservado; no se despliega NestJS.

Las páginas editoriales no requieren DB; la API es dinámica y responde `Cache-Control: no-store`. No simular transacciones con llamadas SQL independientes. Un fallo de DB nunca es éxito; un aviso pendiente no invalida un commit confirmado. La referencia correlaciona, no autentica ni permite consultar un lead. La web no sabe si llegó un mensaje a WhatsApp.

Next local no equivale a Workers. Verificar build/preview OpenNext, conexiones, secrets, headers, imágenes y endpoints antes de desplegar. Migraciones y entorno se documentan en README y `.env.example`; staging usa datos sintéticos.

La implementación usa Next.js 16.4.6 y OpenNext 1.20.17, según instalación verificada del equipo; el adaptador requiere la línea corregida de Next >=16.4.5. Versiones efectivas y dependencias transitivas quedan en lockfile, no en una instalación `latest` al desplegar.

No se incorpora ISR ni binding R2 de caché: R2 se reserva para copias. CSP base permite scripts inline necesarios para la salida estática de Next; no se declara CSP estricta con nonce. Endurecerla exige compatibilizar la estrategia de renderizado y probar en Workers. El formulario se bloquea si falta la configuración esencial.
