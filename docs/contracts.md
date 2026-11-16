# Contrato de captación

Fuente ejecutable: `packages/contracts`. Cambiar campos o códigos exige actualizar frontend, backend y pruebas en el mismo PR.

`POST /api/leads`, JSON, máximo 16 KiB, `Idempotency-Key` aleatoria por intento lógico. Nombre, marca, teléfono internacional, reto, versión de política y autorización; contexto opcional. Servidor autoritativo y rechazo de claves desconocidas. Consentimiento no premarcado ni autorización de campañas. Turnstile/honeypot son operativos, no datos comerciales.

201 después de persistencia confirmada, referencia y siguiente acción; respuesta sin PII. Reintento idéntico recupera resultado, sin duplicar. Misma clave/contenido diferente: 409. Tras timeout incierto conservar clave; no sustituirla sin cambiar contenido o iniciar otra solicitud.

Errores seguros: 400 validación, 403 origen/verificación, 409 conflicto, 413 tamaño, 415 formato, 429 límite con Retry-After y 503 servicio/configuración/persistencia no disponible. Nunca SQL, stack, tokens o valores del formulario. Un 503 no permite mostrar «recibido».

La fuente de verdad es el código del contrato, no ejemplos históricos. `BookingEvent` heredado no es integración activa. No existe GET público de leads por referencia ni destino WhatsApp arbitrario enviado por visitante.
