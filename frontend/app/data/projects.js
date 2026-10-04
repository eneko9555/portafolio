const img = (src, width, height, alt) => ({ src: `/projects/${src}.webp`, width, height, alt })

export const featuredProjects = [
  {
    slug: 'askesis',
    name: 'Askesis',
    kind: 'Plataforma SaaS',
    accent: '#d6397e',
    tagline: 'La plataforma con la que los entrenadores personales gestionan a sus clientes y su negocio.',
    description:
      'Askesis reúne en una sola aplicación todo el trabajo de un entrenador: programar entrenamientos y dietas, seguir el progreso de cada cliente, hablar con ellos y cobrarles. El cliente lo recibe en una app con la marca de su entrenador.',
    highlights: [
      'Programas, rutinas, cardio y nutrición con librería propia de ejercicios, alimentos y recetas',
      'Seguimiento de cada cliente: tonelaje, marcas, compromiso, datos físicos e informes en PDF',
      'Negocio integrado: planes, suscripciones y cobros con Stripe',
      'Chat en tiempo real, comunidad, formularios, agenda y videollamadas'
    ],
    stack: ['Next.js', 'React', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB', 'Socket.IO', 'Stripe', 'AWS S3', 'PWA'],
    links: [
      { label: 'askesis.app', href: 'https://askesis.app/' },
      { label: 'Instagram', href: 'https://www.instagram.com/askesis.app/' }
    ],
    cover: img('askesis/nutricion-coach', 2400, 1260, 'Librería de dietas de Askesis en el panel del entrenador'),
    coverMobile: img('askesis/progreso-cliente', 780, 1688, 'Progreso de tonelaje en la app del cliente de Askesis'),
    features: [
      {
        title: 'Programación de entrenamientos',
        text: 'Programas por días que combinan rutinas, cardio, nutrición y formularios, asignables a un cliente o a un equipo entero.'
      },
      {
        title: 'Nutrición',
        text: 'Librería de alimentos y recetas con la que se montan dietas con calorías y macros calculados para cada cliente.'
      },
      {
        title: 'Progreso e informes',
        text: 'Tonelaje, marcas, índice de compromiso, datos físicos y fotos, con informes exportables en PDF.'
      },
      {
        title: 'Negocio y cobros',
        text: 'Planes y suscripciones con Stripe, resumen de ingresos, clientes activos y pagos pendientes.'
      },
      {
        title: 'Comunicación',
        text: 'Chat en tiempo real, comunidad con las sesiones de cada cliente, agenda y videollamadas.'
      },
      {
        title: 'App con la marca del entrenador',
        text: 'Cada entrenador personaliza logo, colores y nombre de la app que instalan sus clientes.'
      }
    ],
    gallery: [
      img('askesis/gestion-coach', 2400, 1260, 'Panel de clientes del entrenador'),
      img('askesis/programaciones-coach', 2400, 1260, 'Editor de programas de entrenamiento'),
      img('askesis/progreso-coach', 2400, 1260, 'Progreso de tonelaje de un cliente'),
      img('askesis/pagos-coach', 2400, 1260, 'Resumen de negocio con ingresos y clientes activos'),
      img('askesis/comunidad-coach', 2400, 1260, 'Comunidad con las sesiones completadas'),
      img('askesis/personalizar-coach', 2400, 1260, 'Personalización de la app del cliente')
    ],
    galleryMobile: [
      img('askesis/programaciones-cliente', 780, 1688, 'Programación del día en la app del cliente'),
      img('askesis/nutricion-cliente', 780, 1688, 'Dieta del cliente'),
      img('askesis/comunidad-cliente', 780, 1688, 'Comunidad en la app del cliente'),
      img('askesis/parametros-cliente', 780, 1688, 'Datos físicos del cliente')
    ]
  },
  {
    slug: 'chronia',
    name: 'Chronia Timeline',
    kind: 'Aplicación web',
    accent: '#5b86ff',
    tagline: 'Líneas de tiempo jerárquicas para entender la historia viéndola en el tiempo.',
    description:
      'Chronia convierte los acontecimientos en una base de datos estructurada que se ve como un timeline. Las épocas contienen etapas, sucesos e hitos, y varias cronologías pueden superponerse para ver qué pasaba a la vez.',
    highlights: [
      'Editor visual con zoom, arrastre y jerarquía época → etapa → suceso → hito',
      'Asistente de IA que propone cambios y los previsualiza antes de aplicarlos',
      'Importación desde PDF y Excel, exportación a PDF',
      'Conector MCP con OAuth 2.1 para usar los timelines desde Claude o ChatGPT'
    ],
    stack: ['React 19', 'Vite', 'React Router', 'Node.js', 'Express', 'MongoDB', 'Firebase Auth', 'AWS S3', 'MCP', 'OAuth 2.1'],
    links: [{ label: 'chronos-timeline.vercel.app', href: 'https://chronos-timeline.vercel.app/' }],
    cover: img('chronia/editor', 1920, 953, 'Editor de Chronia con la historia del cine de terror'),
    features: [
      {
        title: 'Editor de timelines',
        text: 'Lienzo con zoom y arrastre donde cada evento se coloca según sus fechas y su nivel en la jerarquía.'
      },
      {
        title: 'Árbol de eventos',
        text: 'Vista en árbol para buscar, mostrar u ocultar ramas enteras de un timeline con cientos de eventos.'
      },
      {
        title: 'Asistente de IA',
        text: 'Genera épocas, rellena descripciones o convierte un PDF en eventos. Los cambios se previsualizan y el usuario decide si los acepta.'
      },
      {
        title: 'Importar y exportar',
        text: 'Importación desde Excel y PDF, y exportación del timeline completo a PDF.'
      },
      {
        title: 'Timelines públicos',
        text: 'Galería para explorar, copiar y comentar cronologías de otros autores, y enlaces para compartir.'
      },
      {
        title: 'Conector MCP',
        text: 'Servidor MCP remoto con OAuth 2.1 para consultar y modificar timelines desde asistentes como Claude.'
      }
    ],
    gallery: [
      img('chronia/landing', 2400, 1500, 'Página de inicio de Chronia con un timeline de demostración'),
      img('chronia/arbol', 1920, 953, 'Árbol de eventos junto al editor'),
      img('chronia/asistente-ia', 1920, 953, 'Asistente de IA abierto en el editor')
    ],
    galleryMobile: []
  },
  {
    slug: 'ourmap',
    name: 'OurMap',
    kind: 'Aplicación web',
    accent: '#8f8ff8',
    tagline: 'Un mapa de recuerdos de viaje para parejas, amigos y familia.',
    description:
      'OurMap guarda los lugares visitados sobre un globo interactivo. Cada lugar tiene sus fechas, fotos y notas, y el mapa se comparte con quien se quiera para construirlo entre varios.',
    highlights: [
      'Globo y mapa interactivos con rutas entre lugares y filtro por año',
      'Cada lugar con su diario: fechas, fotos y notas',
      'Mapas compartidos por invitación para colaborar',
      'Presentación automática de los viajes y exportación a PDF'
    ],
    stack: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS', 'Supabase', 'Mapbox GL', 'Framer Motion'],
    links: [
      { label: 'ourmap.app', href: 'https://ourmap.app/' },
      { label: 'Demo', href: 'https://ourmap.app/demo' }
    ],
    cover: img('ourmap/demo-lugar', 2400, 1500, 'Detalle de Barcelona en OurMap con su diario de viaje'),
    coverMobile: img('ourmap/demo-movil', 1170, 2532, 'Mapa de OurMap en el móvil con los lugares visitados'),
    features: [
      {
        title: 'Lugares en el mapa',
        text: 'Cada sitio visitado se marca con sus coordenadas reales, un emoji y el orden del viaje.'
      },
      {
        title: 'Fotos y notas',
        text: 'Cada lugar guarda un diario por días con fotos, descripciones y fechas.'
      },
      {
        title: 'Compartir',
        text: 'Se invita a otras personas a colaborar en el mismo mapa mediante un enlace.'
      },
      {
        title: 'Presentación',
        text: 'Un slideshow automático recorre los viajes lugar a lugar.'
      },
      {
        title: 'Exportar a PDF',
        text: 'El mapa se descarga como un álbum en PDF.'
      },
      {
        title: 'Vistas del mapa',
        text: 'Mapa, satélite y modo oscuro sobre un globo terráqueo.'
      }
    ],
    gallery: [
      img('ourmap/demo', 2400, 1500, 'Globo de OurMap con los lugares visitados'),
      img('ourmap/landing', 2400, 1500, 'Página de inicio de OurMap')
    ],
    galleryMobile: [
      img('ourmap/demo-lugar-movil', 1170, 2532, 'Diario de un lugar en el móvil'),
      img('ourmap/landing-movil', 1170, 2532, 'Página de inicio de OurMap en el móvil')
    ]
  }
]

export const otherProjects = [
  {
    name: 'Tienda alimentación Amaia',
    description: 'Landing page para una tienda de alimentación, con promoción de la tienda y pedidos.',
    technologies: ['Next.js', 'Tailwind CSS'],
    website: 'https://tienda-alimentacion.vercel.app/'
  },
  {
    name: 'PManager',
    description: 'Gestión de proyectos en colaboración a tiempo real.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Socket.IO', 'Tailwind CSS'],
    website: 'https://lively-llama-a85a0d.netlify.app',
    github: 'https://github.com/eneko9555/frontend-pmanager'
  },
  {
    name: 'Files Send',
    description: 'Subida y descarga de archivos de manera privada y segura.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Multer', 'Tailwind CSS'],
    website: 'https://files-send-frontend.vercel.app/',
    github: 'https://github.com/eneko9555/Files-Send-Frontend'
  },
  {
    name: 'Quiosco de comida',
    description: 'Pedidos en un quiosco y gestión de los pedidos entrantes a tiempo real.',
    technologies: ['Next.js', 'Prisma', 'MySQL', 'SWR', 'Tailwind CSS'],
    website: 'https://quioscoapp.onrender.com/',
    github: 'https://github.com/eneko9555/quiosco-app'
  },
  {
    name: 'Tienda de guitarras',
    description: 'Catálogo de guitarras con carrito de compra.',
    technologies: ['Next.js', 'Strapi', 'PostgreSQL', 'CSS'],
    website: 'https://tienda-guitarras-next-hi3g.vercel.app/',
    github: 'https://github.com/eneko9555/tienda-guitarras-frontend'
  },
  {
    name: 'Administrador de pacientes',
    description: 'Registro y seguimiento de pacientes con cuentas de usuario y recuperación de contraseña.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
    website: 'https://resonant-zuccutto-53ab4a.netlify.app/',
    github: 'https://github.com/eneko9555/mern-ap-frontend'
  },
  {
    name: 'Administrador de presupuesto',
    description: 'Añade, filtra y edita gastos para controlar un presupuesto.',
    technologies: ['React', 'CSS', 'LocalStorage'],
    website: 'https://tourmaline-melomakarona-bccf40.netlify.app/',
    github: 'https://github.com/eneko9555/control-gastos'
  },
  {
    name: 'Cotizador',
    description: 'Cotización de pagos según la cantidad y el plazo elegidos.',
    technologies: ['React', 'Vite', 'Tailwind CSS'],
    website: 'https://moonlit-gingersnap-7d01c0.netlify.app/',
    github: 'https://github.com/eneko9555/cotizador'
  },
  {
    name: 'App Clima',
    description: 'Consulta del clima actual en distintas ciudades.',
    technologies: ['React', 'Vite', 'CSS'],
    website: 'https://bespoke-tanuki-9003a8.netlify.app/',
    github: 'https://github.com/eneko9555/clima-app'
  },
  {
    name: 'Criptomonedas',
    description: 'Valor actual de una criptomoneda y sus cambios en las últimas 24 horas.',
    technologies: ['React', 'Vite', 'Styled Components'],
    website: 'https://remarkable-sable-3efc6a.netlify.app/',
    github: 'https://github.com/eneko9555/crypto-React'
  },
  {
    name: 'Gasto semanal',
    description: 'Control de un presupuesto semanal añadiendo gastos.',
    technologies: ['JavaScript', 'CSS'],
    website: 'https://monumental-sprite-85144b.netlify.app/',
    github: 'https://github.com/eneko9555/gasto-semanal-js'
  },
  {
    name: 'Buscador de recetas',
    description: 'Búsqueda de recetas con favoritos y detalle de ingredientes e instrucciones.',
    technologies: ['JavaScript', 'CSS'],
    website: 'https://soft-faun-e4b21d.netlify.app/index.html',
    github: 'https://github.com/eneko9555/buscador-recetas-js'
  },
  {
    name: 'Buscador de imágenes',
    description: 'Búsqueda y descarga de imágenes con la API de Pixabay.',
    technologies: ['JavaScript', 'CSS'],
    website: 'https://bright-sherbet-972694.netlify.app/',
    github: 'https://github.com/eneko9555/buscador-pixabay'
  },
  {
    name: 'Mis películas',
    description: 'Lista personal de películas guardada en el navegador, con búsqueda por título.',
    technologies: ['JavaScript', 'CSS', 'LocalStorage'],
    website: 'https://preeminent-palmier-12979d.netlify.app/',
    github: 'https://github.com/eneko9555/peliculas-localstorage-js'
  }
]

export const stack = [
  {
    title: 'Frontend',
    items: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Vite', 'Framer Motion']
  },
  {
    title: 'Backend',
    items: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Supabase', 'Firebase', 'Socket.IO', 'Prisma']
  },
  {
    title: 'Servicios',
    items: ['Stripe', 'AWS S3', 'Mapbox', 'Vercel', 'MCP', 'OAuth 2.1']
  },
  {
    title: 'Herramientas',
    items: ['Git', 'GitHub', 'VS Code', 'Postman']
  }
]

export const contact = {
  email: 'eneko.fdez.garcia@gmail.com',
  github: 'https://github.com/eneko9555',
  linkedin: 'https://www.linkedin.com/in/eneko-fernández-garcía-790b4b265'
}
