
export const translations = {
  en: {
    navItems: [
      { href: '#services', label: 'Services' },
      { href: '#projects', label: 'Projects' },
      { href: '#approach', label: 'Approach' },
      { href: '#contact', label: 'Contact' },
    ],
    hero: {
      badge: 'Early-stage founders & product teams · Seed—Series B',
      title: 'Building software for people. Fast.',
      subtitle:
        'I design and ship web & mobile apps, internal tools, and automations that real users adopt.',
      supporting: 'Hands-on across product strategy, design, and engineering.',
      chips: ['Web & mobile apps', 'Internal tools', 'Automations', 'Scalable APIs'],
      highlights: [
        { label: 'Who', value: 'Early-stage founders & product teams' },
        { label: 'Speed', value: 'Launch-ready in weeks' },
        { label: 'How', value: 'Direct, transparent, outcome-first' },
      ],
      note: 'Prefer to talk? Call or WhatsApp me at',
    },
    services: {
      heading: 'Services tuned for outcomes',
      subheading: 'Pick the lane that unlocks traction fastest.',
      items: [
        {
          title: 'People-first delivery',
          outcome: 'Design flows users adopt, not abandon.',
          bullets: ['Prototype with users from day one', 'UI polish and microcopy baked in'],
        },
        {
          title: 'Full-stack execution',
          outcome: 'Ship reliable web & mobile apps end-to-end.',
          bullets: ['React, Next.js, and native builds', 'APIs, infra, and automation'],
        },
        {
          title: 'SaaS acceleration',
          outcome: 'Launch with billing, analytics, and growth loops ready.',
          bullets: ['Payments, auth, and onboarding', 'Usage insights and lifecycle messaging'],
        },
      ],
    },
    projects: {
      heading: 'Live product previews',
      subheading: 'A quick look at recently shipped experiences.',
      note: 'If a live preview fails to load (some sites block embeds), use the “Open site” button for the full experience.',
    },
    approach: {
      heading: 'Approach',
      intro: 'Lean loops keep scope tight and momentum high.',
      steps: [
        {
          label: 'Discover',
          detail: 'Frame the goal, metrics, and constraints in week one.',
        },
        {
          label: 'Build',
          detail: 'Iterate in public with weekly demos and always shippable code.',
        },
        {
          label: 'Launch',
          detail: 'Instrument usage, handle handoff, and queue the next release.',
        },
      ],
    },
    engagement: 'Engagement includes weekly collaborations, fixed-scope sprints, and regular demos for tracking development.',
    contact: {
      heading: 'Ready to move fast, thoughtfully?',
      subheading: 'Reach out directly.',
      description:
        'Email, call, or drop a WhatsApp message. Expect a thoughtful reply within one business day.',
    },
    ctas: {
      email: 'Email',
      whatsapp: 'Chat on WhatsApp',
      phone: 'Call',
    },
    previews: {
      heading: 'Social sharing previews',
      subheading: 'See how the site appears when it is shared.',
      assets: [
        { label: 'Open Graph image', context: 'LinkedIn, Slack, iMessage' },
        { label: 'Twitter / X image', context: 'Twitter · WhatsApp' },
      ],
    },
    localeSwitch: {
      label: 'Language',
    },
    a11y: {
      skipToContent: 'Skip to main content',
    },
  },
  es: {
    navItems: [
      { href: '#services', label: 'Servicios' },
      { href: '#projects', label: 'Proyectos' },
      { href: '#approach', label: 'Método' },
      { href: '#contact', label: 'Contacto' },
    ],
    hero: {
      badge: 'Fundadores y equipos Seed–Serie B',
      title: 'Construye software centrado en las personas, rápido.',
      subtitle:
        'Diseño y lanzo apps web y móviles, herramientas internas y automatizaciones que la gente realmente adopta.',
      supporting: 'Acompañamiento práctico en estrategia de producto, diseño e ingeniería.',
      chips: ['Apps web y móviles', 'Herramientas internas', 'Automatizaciones', 'APIs escalables'],
      highlights: [
        { label: 'Quiénes', value: 'Fundadores y equipos Seed–Serie B' },
        { label: 'Velocidad', value: 'Listo para lanzar en semanas' },
        { label: 'Cómo', value: 'Directo, transparente y enfocado en resultados' },
      ],
      note: '¿Prefieres hablar? Llámame o envía un WhatsApp al',
    },
    proof: {
      heading: 'Pruebas, no promesas',
      caption: 'Resultados recientes',
      metrics: [
        {
          stat: '38% menos tiempo de onboarding',
          detail: 'Activación SaaS renovada — Next.js · Segment',
        },
        {
          stat: 'Lanzamiento v1 en 5 semanas',
          detail: 'MVP fintech de idea a ingresos — React · Supabase',
        },
        {
          stat: '52% menos tickets de soporte',
          detail: 'Nueva herramienta interna — Node.js · Retool',
        },
      ],
      clients: 'Equipos de fintech, salud y marketplaces confían en el proceso.',
    },
    services: {
      heading: 'Servicios enfocados en resultados',
      subheading: 'Elige la vía que desbloquea tracción más rápido.',
      items: [
        {
          title: 'Entrega centrada en personas',
          outcome: 'Diseña flujos que los usuarios adoptan, no abandonan.',
          bullets: ['Prototipos y pruebas de la primera día', 'UI y microcopy integrados'],
        },
        {
          title: 'Ejecución full-stack',
          outcome: 'Lanza apps web y móviles confiables de punta a punta.',
          bullets: ['React, Next.js y native builds', 'APIs, infraestructura y automatización'],
        },
        {
          title: 'Aceleración SaaS',
          outcome: 'Lanza con pagos, analítica y loops de crecimiento listos.',
          bullets: ['Pagos, auth y onboarding', 'Insights de uso y mensajes lifecycle'],
        },
      ],
    },
    work: {
      heading: 'Casos destacados',
      subheading: 'Historias recientes (datos anonimizados).',
      cases: [
        {
          problem: 'El onboarding se detenía en el paso cuatro.',
          result: 'Reducimos el time-to-value 38%.',
          stack: 'Next.js · Stripe · Segment',
        },
        {
          problem: 'Idea fintech sin validación.',
          result: 'Lanzamos v1 en 5 semanas.',
          stack: 'React · Supabase · Plaid',
        },
        {
          problem: 'Soporte saturado y sin visibilidad.',
          result: 'Disminuimos tickets 52%.',
          stack: 'Node.js · Retool · Postgres',
        },
      ],
    },
    projects: {
      heading: 'Productos en vivo',
      subheading: 'Una mirada rápida a experiencias lanzadas recientemente.',
      note: 'Si la vista previa no carga (algunos sitios bloquean iframes), usa el botón “Abrir sitio” para verlo completo.',
    },
    approach: {
      heading: 'Método',
      intro: 'Ciclos cortos mantienen el alcance bajo control y la velocidad alta.',
      steps: [
        {
          label: 'Descubrir',
          detail: 'Definimos objetivos, métricas y restricciones en la semana inicial.',
        },
        {
          label: 'Construir',
          detail: 'Iteramos con demos semanales y código siempre desplegable.',
        },
        {
          label: 'Lanzar',
          detail: 'Medimos uso, facilitamos handoff y planificamos el siguiente release.',
        },
      ],
    },
    engagement:
      'La modalidad de trabajo incluye colaboración semanal, sprints de alcance definido y demostraciones periódicas para el seguimiento del desarrollo.',
    contact: {
      heading: '¿Listo para avanzar con foco?',
      subheading: 'Contáctame directamente.',
      description:
        'Escribe, llama o envía un WhatsApp. Respondo dentro de un día hábil.',
    },
    ctas: {
      email: 'Enviar correo',
      whatsapp: 'Chatear en WhatsApp',
      phone: 'Llamar',
    },
    previews: {
      heading: 'Vistas previas para redes',
      subheading: 'Así se comparte el sitio en redes sociales.',
      assets: [
        { label: 'Imagen Open Graph', context: 'LinkedIn, Slack, iMessage' },
        { label: 'Imagen para Twitter/X', context: 'Twitter · WhatsApp' },
      ],
    },
    localeSwitch: {
      label: 'Idioma',
    },
    a11y: {
      skipToContent: 'Ir al contenido principal',
    },
  },
} as const

export type Locale = keyof typeof translations
export type Translation = (typeof translations)[Locale]

type LocalizedText = {
  en: string
  es: string
}

type ProjectPreview = {
  name: LocalizedText
  description: LocalizedText
  type: LocalizedText
  role: LocalizedText
  url: string
  preview: string
}

export const projectPreviews: ProjectPreview[] = [
  {
    name: {
      en: 'Victorian Clinical Genetics Services (VCGS)',
      es: 'Victorian Clinical Genetics Services (VCGS)',
    },
    description: {
      en: 'Embedded with partner teams to ship compliant, accessible patient tools for a major Australian government body.',
      es: 'Trabajé con equipos asociados para lanzar herramientas accesibles y seguras para pacientes del gobierno australiano.',
    },
    type: {
      en: 'Web platform',
      es: 'Plataforma web',
    },
    role: {
      en: 'Senior engineer (partner team)',
      es: 'Ingeniero senior (equipo aliado)',
    },
    url: 'https://www.vcgs.org.au/',
    preview: '/vcgs.png',
  },
  {
    name: {
      en: 'Embassy Alerts',
      es: 'Embassy Alerts',
    },
    description: {
      en: 'Automation core that monitors embassy calendars and pings teams the moment new visa appointments drop.',
      es: 'Núcleo de automatización que vigila calendarios de embajadas y avisa al equipo apenas aparecen nuevas citas.',
    },
    type: {
      en: 'Automation platform',
      es: 'Plataforma de automatización',
    },
    role: {
      en: 'Lead product engineer',
      es: 'Ingeniero principal de producto',
    },
    url: 'https://www.embassyalerts.com/',
    preview: '/embassy.png',
  },
  {
    name: {
      en: 'SpanishOffers',
      es: 'SpanishOffers',
    },
    description: {
      en: 'Full-stack marketplace with CMS merchandising, payments, and daily offers for the Spanish-speaking community.',
      es: 'Marketplace full-stack con CMS, pagos y ofertas diarias para la comunidad hispanohablante.',
    },
    type: {
      en: 'Web marketplace',
      es: 'Marketplace web',
    },
    role: {
      en: 'Lead product engineer',
      es: 'Ingeniero principal de producto',
    },
    url: 'https://spanishoffers.com/',
    preview: '/offers.png',
  },
  {
    name: {
      en: 'Granite Hill Capital',
      es: 'Granite Hill Capital',
    },
    description: {
      en: 'Responsive corporate site with tailored storytelling and secure LP resources for an Australian real-estate partnership.',
      es: 'Sitio corporativo responsivo con narrativa a medida y recursos seguros para socios inmobiliarios en Australia.',
    },
    type: {
      en: 'Corporate website',
      es: 'Sitio corporativo',
    },
    role: {
      en: 'Consultant & engineer',
      es: 'Consultor e ingeniero',
    },
    url: 'https://www.granitehillcapital.com.au/',
    preview: '/granite.png',
  },
  {
    name: {
      en: 'Mova — Made to Move',
      es: 'Mova — Made to Move',
    },
    description: {
      en: 'Mobile app integrating workouts, subscriptions, and content delivery; I led the cross-platform engineering effort.',
      es: 'App móvil con entrenamientos, suscripciones y contenido; lideré la ingeniería multiplataforma.',
    },
    type: {
      en: 'Mobile app',
      es: 'Aplicación móvil',
    },
    role: {
      en: 'Tech lead',
      es: 'Tech lead',
    },
    url: 'https://mova.madetomove.co.za/',
      preview: '/mova.png',
  }
]