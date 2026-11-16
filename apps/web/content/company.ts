import type { CompanyContent } from "@day-strategy/contracts";

// Adaptación editorial del Brief de Marca MVP y del kickoff de DAY Strategy.
// No incorporar promesas, cifras o casos de clientes sin evidencia aprobada.
export const companyContent: CompanyContent = {
  eyebrow: "Firma de estrategia de marca",
  headline: "Estrategia para marcas",
  headlineAccent: "que evolucionan.",
  summary:
    "Integramos pensamiento científico, branding y comunicación para convertir el potencial de tu empresa en una marca de alto valor.",
  mission:
    "Entendemos tu negocio antes de proponer. Diseñamos un sistema de marca que conecta identidad, posicionamiento y comunicación, con una dirección clara y mejora continua.",
  services: [
    {
      id: "strategy",
      title: "Estrategia y posicionamiento",
      description:
        "Investigación del negocio y su mercado para definir una propuesta de valor, una audiencia y una dirección diferenciadora.",
    },
    {
      id: "content",
      title: "Branding y comunicación",
      description:
        "Identidad, mensajes y contenido que expresan el valor real de tu empresa con precisión, coherencia y personalidad.",
    },
    {
      id: "commercial",
      title: "Presencia digital y crecimiento",
      description:
        "Experiencias web, contenido y marketing conectados en un sistema que implementamos, medimos y optimizamos.",
    },
  ],
  method: [
    {
      id: "observe",
      title: "Observar",
      description: "Comprender tu negocio, escuchar y analizar el mercado.",
    },
    {
      id: "hypothesis",
      title: "Hipótesis",
      description:
        "Identificar oportunidades y formular una dirección estratégica.",
    },
    {
      id: "experiment",
      title: "Experimentar",
      description: "Crear, implementar y poner la estrategia en acción.",
    },
    {
      id: "measure",
      title: "Medir",
      description:
        "Analizar resultados y convertir la información en aprendizaje.",
    },
    {
      id: "optimize",
      title: "Optimizar",
      description: "Ajustar con criterio. La estrategia evoluciona contigo.",
    },
  ],
};
