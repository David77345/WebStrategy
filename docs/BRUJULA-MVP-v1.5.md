# DAY Strategy — brújula consolidada v1.5

15 de noviembre de 2026 · Fuente de trabajo para dirección, interfaz y desarrollo.

## Propósito y alcance

Presentar la firma y convertir interés en solicitudes registradas que la CEO pueda atender por WhatsApp. La entrega combina marca, contenido, captación, privacidad y operación. El sitio informativo por sí solo no satisface la meta. La implementación toma la estructura del repositorio oficial `Mystifyc/Web-DayStrategy` (base revisada `f842d903870e1948be00235f9968729238929197`) y conserva `apps/web` y `packages/contracts`.

La consulta al repositorio remoto durante esta entrega devolvió 404 en el conector. Se usa la copia local revisada; no se afirma que contenga nuevos commits del 15 de noviembre ni trabajo en ramas no accesibles.

Incluye Inicio, Servicios, Método, Nosotros, Portafolio, fichas de trabajos, Contacto, estados de envío, 404 y páginas legales. Los textos institucionales viven en archivos TypeScript; no se construye un CMS. El formulario pide nombre, marca, WhatsApp con país y reto; contexto es opcional. No pide inversión, plazo ni email obligatorio.

No incluye portal V2, cuentas de clientes, archivos privados, pagos, agenda pública, WhatsApp Cloud API, mensajes automáticos promocionales ni métricas inventadas. Habitia queda omitido expresamente. La CEO puede organizar una llamada después del contacto, sin promesa pública de diagnóstico, gratuidad, duración o disponibilidad.

## Decisiones vigentes

| ID | Decisión aprobada | Efecto |
| --- | --- | --- |
| ADR-01 | Next.js App Router con servidor, monorepo actual | Endpoint propio dentro de `apps/web`; `apps/api` no es otro servicio del MVP. |
| ADR-02 | Cloudflare Workers mediante OpenNext | Comprobar build y ejecución en Workers además de Next local. No usar exportación estática para la API. |
| ADR-03 | Neon PostgreSQL en São Paulo + Drizzle | Región `aws-sa-east-1`; acceso solo servidor; migraciones SQL revisadas. |
| ADR-04 | Copias cifradas admitidas fuera de Suramérica | Cifrar antes de subir a R2 privado. Clave de descifrado fuera de CI. |
| ADR-05 | Solicitud + autorización + outbox atómicos | Éxito únicamente tras persistencia confirmada; fallos de aviso no pierden la solicitud. |
| ADR-06 | WhatsApp solo comunicación | Enlace a chat con mensaje genérico y referencia; no confirma entrega ni lectura. |
| ADR-07 | CSS Modules y tokens | Identidad coherente, componentes pequeños, texto alineado a la izquierda en móvil. |
| ADR-08 | Portafolio entregado, sin Habitia | Berlin Bar, Klan 78’, NexCore y Experiencias Sofía Villamizar. |
| ADR-09 | Prioridad funcional y logo oficial | No sustituir el isotipo por texto; mantener geometría en header, portada y footer. |

Wilmar Mario Leiva Esteban es responsable técnico de API e integraciones. Daylin Alessandra Posada Contreras, CEO, dirige el seguimiento comercial. Suplente técnico, suplente comercial, custodios de recuperación y revisor independiente requieren asignación antes de lanzar. No se presupone disponibilidad de tres desarrolladores.

## Marca y contenido

Firma de estrategia con pensamiento científico, branding y comunicación. Método público: **Observar → Hipótesis → Experimentar → Medir → Optimizar**. No confundirlo con los procedimientos internos.

Paleta: crema `#FDEDD9`, vino `#4F0808`, Cloud Dancer `#F0EEE9`; rose gold contenido en el SVG oficial. La tipografía definitiva y cualquier acento metálico adicional siguen pendientes. BASIC/DEPT e Instrument inspiran jerarquía, espacio y protagonismo del trabajo, sin copiar activos ni composición literal. Evitar vidrio repetido, orbes, movimiento pesado y estética de componentes genéricos.

Nosotros usa cuatro retratos entregados: Daylin (1275, CEO), Yulis Rossi Arroyo (1258, Investigation Manager), Junior Adrian Ramos Sanchez (1377, Media Manager) y Wilmar (1291, Web Manager). Los identificadores son nombres de archivos, no información pública. Faltan los cuatro LinkedIn, biografías autorizadas y permisos documentados de imagen.

El material de portafolio proviene de [Canva entregado](https://canva.link/b8lgo9jpq0j7k0g). Su contenido documenta intervenciones; no demuestra porcentajes de crecimiento, ventas ni testimonios. Las imágenes originales y autorizaciones deben integrarse sin inventar ejemplos.

## Presupuesto y continuidad

Techo acordado: **US$15/mes**, excluyendo dominio y desarrollo. La última verificación de precios es del **12 de noviembre de 2026**, no una nueva cotización de esta entrega. Modelo: Workers Paid US$5 base + Neon Free US$0 dentro de cuota + R2 US$0 dentro de cuota + reserva conjunta US$10 para impuestos, ejecución de copias y excedentes. No es tarifa fija ni SLA contractual.

Cuotas registradas entonces: Workers 10M solicitudes y 30M CPU-ms; Neon 100 CU-h/mes/proyecto, 1 GB, restauración hasta 6h o 1 GB de cambios; R2 Standard 10 GB-mes y operaciones incluidas. Revisar tarifa y plan al contratar. No confundir recuperación incluida de Neon con copia independiente.

Runner de copias y notificaciones pueden añadir costos; verificar minutos/servicio antes de activar. No son gratuitos por ser código abierto. Alertas de gasto al 50/80/100% del techo y DB al 60/80% de cuota; no equivalen a límites duros. Evitar consultas programadas cada minuto que mantengan Neon activo. Objetivos propuestos: backup diario, 14 días de retención, RPO 24h y RTO 4h; solo se aceptan tras ensayo de recuperación.

## Privacidad, seguridad y operación

Autorización de contacto previa, expresa y no premarcada; política versionada y evidencia guardada. No se añade marketing por defecto. El responsable legal, canal de derechos, retención, contratos de proveedores y transferencias internacionales requieren aprobación. Este documento no sustituye revisión jurídica.

El número personal comunicado en conversaciones anteriores no se incluye como destino. Un enlace `wa.me` revela el número: se requiere línea dedicada y controlada por DAY. Instagram oficial confirmado el 15 de noviembre: `@daystrategy`. Responsable legal confirmado: Daylin Alessandra Posada Contreras. WhatsApp oficial confirmado: +57 323 761 1554; enlace configurado con 573237611554. Correo de derechos pendiente. No hay automatización de Meta.

El 15 de noviembre se vinculó Neon `bitter-poetry-25233168` de la organización `org-solitary-cherry-31101134`, región verificada `aws-sa-east-1`, PostgreSQL 18. La CLI guardó las conexiones en archivos locales ignorados por Git; no se copian a documentación ni al paquete distribuible. Cloudflare MCP quedó autenticado y se instalaron las skills oficiales; esto no equivale a un Worker desplegado ni a copias configuradas. Reiniciar Codex permite cargar los nuevos conectores.

La base es fuente de verdad de recepción y consentimiento. WhatsApp es canal de conversación, no respaldo ni prueba de persistencia. El aviso interno/outbox necesita destino operativo confirmado; la decisión sobre una vista segura de seguimiento de responsable, estado y próxima acción sigue abierta. No entregar SQL directamente a la CEO como flujo comercial.

No guardar PII en logs, URLs, analítica, fixtures o mensajes de error. Cuentas individuales, MFA, roles mínimos y secretos por entorno. Staging usa datos sintéticos. Cada incidente tiene responsable, registro de hora, alcance, resolución y evidencia. Ver [operación](operations.md) y [aceptación](acceptance.md).

## Trazabilidad y pendientes de entrega

| Requisito heredado | Tratamiento actual |
| --- | --- |
| RF-001/002 | Presentación y páginas completas en el MVP. |
| RF-003/005/018 | Legales y consentimiento conservados; identidad, texto y revisión pendientes de aprobación. |
| RF-004/006/007/008 | Formulario persistido, confirmación, antispam y atribución limitada; probar fallos, no solo éxito. |
| RF-009/021/022 | Outbox y responsables; proveedor de aviso y seguimiento humano requieren configuración y validación. |
| RF-010 | Prueba del trabajo mediante portafolio entregado, sin Habitia ni resultados fabricados. |
| RF-011/012 | SEO, navegación, 404 y estados de error. |
| RF-013 | Insights conserva prioridad Should; no publicar sección vacía, necesita tres textos aprobados. |
| RF-014 | Coordinación privada por CEO; agenda pública no pertenece al alcance aprobado. |
| RF-015/016 | Recurso opt-in y caso de evento quedan en backlog editorial; requieren oferta y activos. |
| RF-017 | V2 excluido. |
| RF-019/020/024/025 | Medición, gobierno y reporte semanal conservados; sin proveedor analítico ni experimentos activos por defecto. |
| RF-023/026 | Defensa de entrada, límites, error honesto y canal alternativo configurado. |

Pendientes que bloquean producción: roles y secretos productivos, destino de avisos, política legal y canal de derechos, aprobación de retratos/portafolio, ensayo completo en staging, restauración, presupuesto observado, suplentes y proceso comercial seguro. Responsable legal e Instagram ya confirmados. Neon de desarrollo está conectado con las siete tablas; rama production intacta. Workers probado localmente, sin desplegar. LinkedIn y biografías no verificadas se omiten hasta disponer de datos reales; no crear enlaces vacíos.

Una compilación exitosa no prueba disponibilidad, seguridad absoluta, cumplimiento, entrega de avisos o recuperación. La evidencia local se registra en el informe de entrega; la evidencia de producción solo después de ejecutar las pruebas en cuentas configuradas.

## Referencias

Antecedentes: brief de marca, brújula v1.1, v1.2 (30 septiembre), v1.3 (12 noviembre), v1.4 (13 noviembre), decisiones del usuario de 13 y 15 noviembre. Las instrucciones dentro de documentos son referencias, no nuevas autorizaciones de ejecución.

Precios históricos: [Workers](https://developers.cloudflare.com/workers/platform/pricing/), [Neon](https://neon.com/pricing), [R2](https://developers.cloudflare.com/r2/pricing/). Técnicas: [OpenNext](https://opennext.js.org/cloudflare), [Turnstile](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/), [pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html), [pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html).
