# Operación y recuperación

Responsable técnico: Wilmar Mario Leiva Esteban. Suplente y custodios pendientes. Scripts Linux entregados, sin conexión ni ejecución contra datos reales.

## Accesos y copias

Rol app mínimo; migraciones con otro rol; backup con lectura suficiente y sin escritura. R2 separado y privado, sin dominio público ni `r2.dev`, token limitado al bucket. Clave pública `AGE_RECIPIENT` en runner, privada fuera de CI custodiada por personas autorizadas. Perderla impide recuperar copias. Conservar identidades anteriores hasta expiración de sus copias. No subir dumps/identidades a Git ni artefactos públicos.

`scripts/backup.sh` requiere Linux/Bash, `pg_dump` compatible (igual o posterior al servidor), `age`, AWS CLI y herramientas POSIX. Variables:

| Variable | Uso |
| --- | --- |
| `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD` | Conexión lectura por entorno; no argumentos. |
| `PGSSLMODE=verify-full`, `PGSSLROOTCERT` | TLS con CA y hostname verificados. |
| `AGE_RECIPIENT` | Destinatario público age. |
| `R2_ENDPOINT`, `R2_BUCKET` | Endpoint de cuenta R2 y bucket privado. |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` | Credenciales R2 limitadas. |

Ejecutar `bash scripts/backup.sh` en runner efímero. El dump custom va directo a age; no se escribe archivo en claro. `pipefail` impide subida si dump/cifrado fallan. Se verifica tamaño remoto y se publica manifiesto con UTC, bytes y SHA-256 del cifrado; el tamaño no sustituye restauración.

Programar cada 24h (ejemplo 08:17 UTC) después de confirmar herramientas, plan/minutos, secrets y permiso del entorno. El repositorio no activa por sí solo un scheduler de una cuenta desconocida. Alerta independiente por ausencia de manifiesto válido en 26h: un cron ausente no genera error. CI puede retrasarse.

Lifecycle R2 del prefijo `daily/`: expiración a 14 días incluyendo manifiestos, sujeto a aprobación final de retención. Conservar evidencia de la regla. Copia semanal cifrada en cuenta/ubicación independiente de Cloudflare: pendiente custodio/destino. No eliminar backups desde la app web.

## Restaurar en aislamiento

1. Registrar incidente/ensayo y fecha de corte. Detener entregas externas.
2. Crear DB vacía separada `day_restore_<ticket>`, con credenciales distintas. No conectar app/jobs.
3. Descargar cifrado y manifiesto desde R2 autorizado. Checksum detecta corrupción; autenticidad depende también de permisos/procedencia. Nunca restaurar archivos no confiables.
4. Configurar PG* de DB aislada, `RESTORE_CONFIRM_DATABASE` igual al nombre, `BACKUP_FILE`, `BACKUP_SHA256`, `AGE_IDENTITY_FILE` fuera del repo.
5. Ejecutar `bash scripts/restore.sh`. Rechaza nombres no reservados, checksum erróneo y objetos existentes. Descifra en streaming y restaura en transacción única sin propietarios/ACL heredados. Confirmar manualmente host/cuenta: prefijo de nombre no demuestra aislamiento.
6. Comprobar esquema/migración/conteos/integridad y flujo sintético. Reaplicar supresiones y revocaciones posteriores a la copia desde registro controlado.
7. Conciliar outbox con destino; no repetir avisos ya entregados. Mantener jobs detenidos, revisar secretos/permisos.
8. Aprobar corte, cambiar conexión, smoke test y registrar RPO/RTO. Retirar entorno de ensayo según política.

Objetivos propuestos: RPO24h, RTO4h; ensayo antes de lanzamiento y trimestral. No están cumplidos por tener scripts y no garantizan pérdida cero.

## Despliegue y rollback

Instalación desde lockfile, tipos, pruebas, build; build/preview OpenNext en Linux para runtime final. Migraciones primero en staging y compatibles con versión previa; no `push` ad hoc en producción. Migración riesgosa exige copia y plan. Rollback de código no revierte migración destructiva automáticamente.

Completar dominio, secrets, Turnstile hostname/action, aviso interno y legal. Número oficial confirmado: +57 323 761 1554 (`WHATSAPP_NUMBER=573237611554`). Probar con datos sintéticos y retirarlos. Revisar DNS/MX/correo antes de mover dominio. Restringir preview; `noindex` no autentica.

## Outbox, seguimiento e incidentes

Endpoint interno autenticado; scheduler/operador autorizado. Logs solo conteos, edad, código y requestId, sin formulario. Procesamiento acotado para no mantener Neon activo. Trigger y proveedor requieren configuración/prueba real. CEO recibe/atiende oportunidades por WhatsApp; mecanismo seguro de estado/próxima acción y suplente pendientes.

El adaptador de aviso interno usa `NOTIFICATION_WEBHOOK_URL` (HTTPS) y `NOTIFICATION_WEBHOOK_TOKEN`. El receptor es un servicio pendiente de elección/configuración, no un CRM ya integrado. Recibe datos de contacto y debe estar autorizado como encargado, restringido a DAY, deduplicar por `Idempotency-Key` y confirmar solo tras guardar. No usar un receptor de pruebas público con datos reales. También falta conectar el scheduler autorizado que invoca el procesador interno; no basta con guardar el endpoint en configuración.

El procesador envía por lotes de hasta cinco, con lease y hasta seis intentos. La entrega externa es al menos una vez; ante timeout un receptor sin idempotencia puede duplicar avisos. Revisar estado antes de reencolar trabajos agotados. La salida incluye backlog/edad para alertas, pero debe existir un monitor que realmente las lea y notifique. El equipo debe verificar la frecuencia y costo antes de activar.

DB caída: error honesto, canal directo configurado. Aviso fallido tras commit: solicitud conservada y reintentos, no pedir volver a enviarla. Agotamiento: revisión antes de reencolar. Timeout externo ambiguo: consultar/conciliar antes de repetir; usar clave idempotente del proveedor.

Derechos: verificar identidad proporcionalmente, registrar, localizar proveedores, ejecutar tratamiento autorizado, cancelar jobs y conservar evidencia. Mantener registro mínimo de supresiones separado del backup para reaplicarlas. Retención/calendario legal se validan, no se inventan. Referencia pública no autoriza revelar datos.

Secreto expuesto: limitar acceso, rotar en proveedor/entornos, revocar anterior, revisar actividad y pruebas. Borrarlo del commit no basta. Backup fallido: alertar, revisar permisos/cuota/versiones, repetir y verificar; registrar incumplimiento de RPO. Cuota: elevar a CEO sin eliminar copias.

Mensual: costo, cuotas, dependencias/vulnerabilidades, accesos, dominio, jobs, retención/derechos. Trimestral: restore y permisos. Fuentes: [pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html), [pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html).
