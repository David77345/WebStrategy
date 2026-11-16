# Aceptación y evidencia

Registrar commit, fecha, entorno, resultado y responsable. Código o prueba presente no equivale a ejecución contra servicios reales.

| Área | Evidencia requerida |
| --- | --- |
| Rutas | Páginas y fichas directas, slug desconocido404, sin enlaces vacíos. |
| Marca | SVG header/portada/footer, fotos correctas, sin teléfono personal ni Habitia. |
| Móvil | 320/390/768/1280px, sin scroll horizontal/cortes/justificación irregular. |
| Accesibilidad | Teclado, foco, skip link, labels, errores anunciados, zoom200%, contraste y reduced motion; WCAG2.2AA es objetivo. |
| Validación | Unicode, teléfono internacional, consentimiento vacío, campos desconocidos, tamaño y JSON inválido. |
| Antispam | Honeypot, token inválido/expirado, hostname/action, rate limit persistente429 y proxy confiable. |
| Atomicidad | Fallo insertando consentimiento/outbox revierte lead, sin201 antes de commit. |
| Idempotencia | Doble clic/concurrencia/reintento produce un lead; distinto payload409; timeout conserva clave. |
| Dependencias | DB caída sin éxito; aviso caído conserva lead; config ausente falla seguro. |
| WhatsApp | Número dedicado, texto sin PII, referencia no autentica, clic no es mensaje enviado. |
| Jobs | Autenticación, lease, reintentos, recuperación; timeout externo no duplica aviso. |
| Datos | TLS, roles mínimos, no PII en logs/URLs/analítica, consentimiento versionado, staging separado. |
| Workers | Build/preview OpenNext, secretos, rutas dinámicas, headers e imágenes. |
| Recuperación | Cifrado, checksum, restore aislado, esquema/recuentos, supresión/outbox conciliados. |
| Operación | Alertas, suplentes, costo observado y proceso comercial/privacidad efectivo. |

Campo p75 objetivo: LCP≤2.5s, INP≤200ms, CLS≤0.1 cuando haya muestra. Lighthouse móvil90 es laboratorio, no garantía ni sustituto. Documentar dispositivo/red, no inventar puntajes.

CI valida instalación reproducible, tipos, pruebas y build sin secretos productivos. E2E y DB/Workers reales se requieren antes de lanzamiento. Informe de entrega indica qué se ejecutó. Aceptación pública requiere además textos legales, permisos de activos, cuentas, recuperación y atención humana.
