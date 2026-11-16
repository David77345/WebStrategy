# Documentación vigente de DAY Strategy

Fecha de consolidación: **15 de noviembre de 2026**. Este directorio acompaña la implementación del MVP. Neon de desarrollo está conectado; no hay lanzamiento público. La evidencia está en [validación](validation.md).

Para abrirlo: [Revisión local](revision-local.md).

1. [Brújula consolidada v1.5](BRUJULA-MVP-v1.5.md): decisiones, alcance, responsables, presupuesto, trazabilidad y pendientes.
2. [Arquitectura](architecture.md): límites del código y datos.
3. [Contrato](contracts.md): API de captación y errores.
4. [Operación y recuperación](operations.md): copias, restauración, despliegue y contingencias.
5. [Aceptación](acceptance.md): pruebas y evidencia requerida.
6. [Identidad visual](visual-identity.md), [activos](assets.md) y [portafolio](portfolio-handoff.md).

Las brújulas v1.2–v1.4 de la carpeta anterior `output/documentacion` son antecedentes. Ante discrepancias prevalecen las decisiones expresas del usuario y esta consolidación. No se copian al repositorio público los números personales ni los documentos privados originales.

Regla de mantenimiento: cada PR actualiza el contrato afectado, pruebas, decisiones y pendientes. Distinguir **código implementado**, **verificación local**, **integración configurada** y **producción aceptada**; no intercambiar esos estados.
