const img = (src, width, height, alt) => ({ src: `/projects/${src}.webp`, width, height, alt })

export const featuredProjects = [
  {
    slug: 'askesis',
    name: 'Askesis',
    kind: 'Plataforma SaaS',
    accent: '#e0457f',
    period: '2023 — actualidad',
    role: 'Co-fundador y desarrollador full stack',
    highlight: { value: '600+', label: 'usuarios activos' },
    tagline: 'La plataforma con la que los entrenadores personales llevan a sus clientes y su negocio.',
    summary:
      'Programación, nutrición, seguimiento, comunicación y cobros en una sola aplicación. El entrenador trabaja desde el panel web y sus clientes desde una app con la marca del entrenador.',
    highlights: [
      'Más de 600 usuarios activos en el mercado internacional',
      'Programas por fases, nutrición, progreso, chat y videollamadas',
      'Cobros y suscripciones con Stripe, app y web con la marca del entrenador'
    ],
    stack: ['Next.js', 'React', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB', 'Socket.IO', 'Stripe', 'AWS', 'Cloudflare', 'PWA'],
    links: [
      { label: 'askesis.app', href: 'https://askesis.app/' },
      { label: 'Instagram', href: 'https://www.instagram.com/askesis.app/' }
    ],
    facts: [
      { value: '600+', label: 'Usuarios activos' },
      { value: '2023', label: 'En producción desde' },
      { value: '300+', label: 'Ejercicios en la librería base' },
      { value: 'PWA', label: 'App instalable con marca propia' }
    ],
    cover: img('askesis/gestion-coach', 2400, 1260, 'Panel de clientes del entrenador en Askesis'),
    coverMobile: img('askesis/progreso-cliente', 780, 1688, 'Progreso de tonelaje en la app del cliente'),
    context: [
      'Un entrenador personal online suele repartir su servicio entre herramientas que no se hablan: la programación por un lado, las dietas por otro, el seguimiento por mensajería y los cobros aparte.',
      'Askesis reúne todo ese trabajo en una sola aplicación pensada para entrenamiento de fuerza. El entrenador programa, revisa y cobra desde un panel web, y cada cliente lo recibe en una app instalable que lleva el nombre, el logo y los colores de su entrenador.'
    ],
    roleDetail: [
      'Soy co-fundador de Askesis y el responsable de su desarrollo desde su inicio en 2023.',
      'Diseño y mantengo la arquitectura sobre Next.js, Node.js y MongoDB, la integración de pagos con Stripe y la comunicación en tiempo real con Socket.IO.',
      'También llevo la infraestructura en la nube con AWS y Cloudflare: seguridad, disponibilidad del servicio y tiempos de respuesta.'
    ],
    features: [
      {
        title: 'Programación por fases',
        text: 'El entrenador construye programas por días que combinan bloques de rutina, cardio, nutrición y formularios, y los asigna a un cliente o a un equipo entero. Todo queda en el calendario de cada cliente.',
        points: ['Programas por fases y plantillas reutilizables', 'Ejercicios alternativos y cardio por modalidad e intensidad', 'Calendario con lo programado y lo completado'],
        image: img('askesis/calendario-cliente-coach', 1360, 714, 'Calendario de programación de un cliente'),
        imageMobile: img('askesis/programaciones-cliente', 780, 1688, 'Programación del día en la app del cliente')
      },
      {
        title: 'Librería de ejercicios y rutinas',
        text: 'Cada entrenador parte de una librería prediseñada de más de 300 ejercicios y la adapta con sus propios vídeos, imágenes e indicaciones técnicas. Las rutinas se montan a partir de esa librería.',
        points: ['Ejercicios con vídeo, categorías y grupo muscular', 'Rutinas con series, rangos y tipos de serie', 'Métricas y mapa muscular de cada rutina'],
        image: img('askesis/rutina-ejercicios-coach', 1360, 714, 'Rutina con sus ejercicios en el panel del entrenador'),
        imageMobile: img('askesis/libreria-cliente', 780, 1688, 'Librería en la app del cliente')
      },
      {
        title: 'Nutrición',
        text: 'Una base de alimentos y recetas con la que se montan dietas con calorías y macronutrientes calculados. El cliente consulta su dieta y lleva su diario de comidas desde la app.',
        points: ['Alimentos, recetas y dietas reutilizables', 'Calorías, macros, fibra y sal por dieta', 'Dietas distintas para días de entreno y de descanso'],
        image: img('askesis/nutricion-coach', 2400, 1260, 'Librería de dietas con sus macronutrientes'),
        imageMobile: img('askesis/nutricion-cliente', 780, 1688, 'Dieta en la app del cliente')
      },
      {
        title: 'Progreso y métricas',
        text: 'Cada sesión registrada alimenta las gráficas del cliente: tonelaje, marcas, índice de compromiso y datos físicos. El entrenador genera un informe en PDF con la evolución, listo para compartir.',
        points: ['Tonelaje semanal, mensual y anual', 'Peso, medidas y fotos de progreso', 'Informes exportables en PDF'],
        image: img('askesis/progreso-coach', 2400, 1260, 'Tonelaje de un cliente con gráfico semanal y ranking'),
        imageMobile: img('askesis/progreso-cliente', 780, 1688, 'Tonelaje en la app del cliente')
      },
      {
        title: 'Comunidad, chat y agenda',
        text: 'El entrenador y sus clientes hablan por chat en tiempo real. La comunidad muestra las sesiones completadas y las mejoras de cada uno, y la agenda permite proponer citas y hacer la videollamada dentro de la aplicación.',
        points: ['Chat en tiempo real con Socket.IO', 'Comunidad con sesiones y marcas personales', 'Agenda con videollamadas integradas'],
        image: img('askesis/comunidad-coach', 2400, 1260, 'Comunidad con las sesiones completadas por los clientes'),
        imageMobile: img('askesis/comunidad-cliente', 780, 1688, 'Comunidad en la app del cliente')
      },
      {
        title: 'Negocio y marca propia',
        text: 'El entrenador crea sus planes, cobra con Stripe y ve sus ingresos y clientes activos en un resumen. Además personaliza la app que instalan sus clientes y dispone de una página pública con tienda y academia.',
        points: ['Planes, suscripciones y cobros con Stripe', 'Logo, colores y nombre de la app del cliente', 'Página pública con tienda y cursos'],
        image: img('askesis/pagos-coach', 2400, 1260, 'Resumen de negocio con ingresos por mes y clientes activos')
      }
    ],
    extras: [
      'Askesis AI: corrección de técnica en vídeo y dietas a partir del objetivo',
      'Formularios de onboarding, check-ins y registro de peso o fotos',
      'Equipos y entrenadores asociados',
      'Notificaciones push',
      'Conector MCP para consultar y preparar cambios desde Claude'
    ],
    architecture: [
      { area: 'Frontend', text: 'Next.js 14 con App Router, React y Tailwind CSS. Es una PWA instalable, con modo oscuro y tema por entrenador.' },
      { area: 'Backend', text: 'API REST en Node.js y Express con autenticación JWT y tareas programadas. Socket.IO da servicio al chat y a la señalización de las videollamadas.' },
      { area: 'Datos', text: 'MongoDB Atlas con Mongoose: usuarios, equipos, ejercicios, rutinas, programación, nutrición, chat y pagos.' },
      { area: 'Servicios', text: 'Stripe para pagos y webhooks, Agora para videollamadas, AWS S3 y Cloudinary para documentos y media, y correo transaccional.' },
      { area: 'Infraestructura', text: 'Frontend en Vercel, backend en Railway y Cloudflare por delante para seguridad y latencia.' }
    ],
    gallery: [
      img('askesis/programaciones-coach', 2400, 1260, 'Editor de programas'),
      img('askesis/libreria-coach', 2400, 1260, 'Librería de ejercicios'),
      img('askesis/informe-coach', 2400, 1260, 'Informe de un cliente'),
      img('askesis/datos-fisicos-coach', 1360, 714, 'Datos físicos de un cliente'),
      img('askesis/agenda-coach', 1360, 714, 'Agenda del entrenador'),
      img('askesis/formularios-coach', 2400, 1260, 'Editor de formularios'),
      img('askesis/personalizar-coach', 2400, 1260, 'Personalización de la app del cliente')
    ]
  },
  {
    slug: 'chronia',
    name: 'Chronia Timeline',
    kind: 'Aplicación web',
    accent: '#5b86ff',
    period: '2026 — actualidad',
    role: 'Diseño y desarrollo full stack',
    highlight: { value: '4', label: 'niveles de jerarquía' },
    tagline: 'Líneas de tiempo estructuradas para entender la historia viendo qué pasaba a la vez.',
    summary:
      'Chronia convierte los acontecimientos en una base de datos estructurada que se dibuja como un timeline. Épocas, etapas, sucesos e hitos dependen unos de otros, y varias cronologías pueden superponerse.',
    highlights: [
      'Cuatro niveles con dependencias: época, etapa, suceso e hito',
      'Asistente de IA que propone cambios y los previsualiza antes de aplicarlos',
      'Conector MCP con OAuth 2.1 para Claude y ChatGPT'
    ],
    stack: ['React 19', 'Vite', 'React Router', 'Node.js', 'Express', 'MongoDB', 'Firebase Auth', 'AWS S3', 'MCP', 'OAuth 2.1'],
    links: [{ label: 'chronos-timeline.vercel.app', href: 'https://chronos-timeline.vercel.app/' }],
    facts: [
      { value: '4', label: 'Niveles: época, etapa, suceso e hito' },
      { value: 'IA', label: 'Asistente que propone y previsualiza cambios' },
      { value: 'MCP', label: 'Conector para Claude y ChatGPT' },
      { value: 'PDF · Excel', label: 'Importación y exportación' }
    ],
    cover: img('chronia/editor', 1920, 953, 'Editor de Chronia con la historia del cine de terror'),
    context: [
      'Una cronología siempre es incompleta: cuenta una parte de la historia con el criterio de su autor. La literatura, el arte, la ciencia o la política no se entienden aisladas, y para dar sentido a los acontecimientos hace falta una visión de conjunto.',
      'Chronia no es un lienzo donde se colocan elementos sueltos. Cada acontecimiento vive en una estructura de cuatro niveles, y esa estructura es la que permite superponer cronologías de distintos autores y ver qué ocurría a la vez en cada área.'
    ],
    roleDetail: [
      'Chronia es un producto que diseño y desarrollo por completo: el editor, el modelo de datos, la API, la integración con IA y el despliegue.',
      'La parte más exigente es el editor, que coloca cientos de eventos según sus fechas y su nivel sin que se solapen, con zoom y arrastre fluidos.',
      'También he construido el servidor MCP y su servidor de autorización OAuth 2.1, para que un asistente pueda leer y modificar los timelines de un usuario con su permiso.'
    ],
    features: [
      {
        title: 'Una estructura de cuatro niveles',
        text: 'Las épocas contienen etapas, las etapas contienen sucesos y los hitos marcan momentos concretos. Cada nivel se dibuja en su propia franja y hereda el color de su época, de modo que la jerarquía se lee de un vistazo.',
        points: ['Fechas antes y después de Cristo, exactas o aproximadas', 'Colores, etiquetas e importancia por evento', 'Descripciones, imágenes, documentos y ubicación'],
        image: img('chronia/jerarquia', 1920, 760, 'Historia de la filosofía con épocas, etapas y sucesos')
      },
      {
        title: 'Un editor que aguanta cronologías grandes',
        text: 'El lienzo se recorre con zoom y arrastre, y cada evento se coloca solo según sus fechas. Cuando la información crece, el árbol de eventos permite buscar, plegar ramas y mostrar u ocultar cada elemento, y los filtros dejan solo lo importante.',
        points: ['Zoom y arrastre, con autoguardado mientras se edita', 'Árbol con toda la jerarquía y buscador', 'Filtros por importancia, etiquetas y ubicación'],
        image: img('chronia/arbol', 1920, 953, 'Árbol de eventos abierto junto al timeline')
      },
      {
        title: 'Asistente de IA con vista previa',
        text: 'El asistente genera las etapas de una época, rellena descripciones o convierte un PDF de apuntes en un timeline. Nada se aplica directamente: los cambios se previsualizan sobre el timeline y el usuario decide si los acepta.',
        points: ['Conversación guardada por timeline', 'Importación de PDF con instrucciones', 'Coste de uso visible para el usuario'],
        image: img('chronia/asistente-ia', 1920, 953, 'Asistente de IA abierto en el editor')
      },
      {
        title: 'Publicar, compartir y exportar',
        text: 'Una cronología se publica con un enlace y cualquiera la explora sin cuenta o la duplica en su espacio para completarla. Todos los datos se exportan a Excel, se editan allí y se vuelven a cargar; el timeline sale en PDF listo para imprimir.',
        points: ['Galería de timelines públicos', 'Excel de ida y vuelta', 'PDF multipágina para montar como mural'],
        image: img('chronia/landing', 2400, 1500, 'Página de inicio de Chronia con un timeline de demostración')
      }
    ],
    extras: [
      'Comparación de varias cronologías en el mismo eje',
      'Reproducción automática del timeline',
      'Mapa con la ubicación de los eventos',
      'Cinco temas visuales'
    ],
    architecture: [
      { area: 'Frontend', text: 'React 19 con Vite y React Router. El estado vive en hooks propios para el layout, la interacción y la exportación del timeline.' },
      { area: 'Backend', text: 'Express con arquitectura hexagonal: dominio, casos de uso, controladores e infraestructura separados.' },
      { area: 'Datos', text: 'MongoDB con los eventos embebidos en el documento de cada timeline y control de versiones optimista: una versión antigua recibe un conflicto y el editor recarga.' },
      { area: 'Autenticación', text: 'Firebase Auth con Google. El token viaja como Bearer en cada petición a la API.' },
      { area: 'Conector MCP', text: 'Servidor MCP remoto con su propio servidor OAuth 2.1 (PKCE, registro dinámico de clientes y rotación de tokens). Las propuestas de un asistente no cambian nada hasta que el usuario las confirma.' }
    ],
    gallery: []
  },
  {
    slug: 'ourmap',
    name: 'OurMap',
    kind: 'Aplicación web',
    accent: '#8f8ff8',
    period: '2026',
    role: 'Diseño y desarrollo full stack',
    highlight: { value: '3D', label: 'globo interactivo' },
    tagline: 'Un mapa de recuerdos de viaje para parejas, amigos y familia.',
    summary:
      'OurMap guarda los lugares visitados sobre un globo interactivo. Cada lugar tiene su diario con fechas, fotos y notas, y el mapa se comparte para construirlo entre varios.',
    highlights: [
      'Globo y mapa interactivos con rutas entre lugares y filtro por año',
      'Cada lugar con su diario por días: fotos y notas',
      'Mapas compartidos por invitación, presentación y álbum en PDF'
    ],
    stack: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS', 'Supabase', 'Mapbox GL', 'Framer Motion'],
    links: [
      { label: 'ourmap.app', href: 'https://ourmap.app/' },
      { label: 'Ver demo', href: 'https://ourmap.app/demo' }
    ],
    facts: [
      { value: '3D', label: 'Globo interactivo con Mapbox GL' },
      { value: '3', label: 'Estilos: calles, satélite y oscuro' },
      { value: 'PDF', label: 'Álbum exportable de cada mapa' },
      { value: 'Demo', label: 'Abierta, sin registro' }
    ],
    cover: img('ourmap/demo-lugar', 2400, 1500, 'Diario de Barcelona en OurMap junto al mapa'),
    coverMobile: img('ourmap/demo-movil', 1170, 2532, 'Mapa de OurMap en el móvil'),
    context: [
      'Las fotos de un viaje acaban repartidas entre el carrete del móvil y las conversaciones, y con el tiempo cuesta recordar dónde se estuvo y cuándo.',
      'OurMap propone guardarlas donde ocurrieron. Cada mapa es un globo con los lugares visitados, unidos por la ruta del viaje, y cada lugar abre un diario por días con sus fotos y notas. El mapa se comparte con la pareja, los amigos o la familia para completarlo entre todos.'
    ],
    roleDetail: [
      'OurMap es un producto que diseño y desarrollo por completo, de la interfaz a la base de datos.',
      'El trabajo principal está en la experiencia del mapa: el globo, las animaciones al viajar de un lugar a otro y un diario que se lee igual de bien en móvil que en escritorio.',
      'El backend se apoya en Supabase para la autenticación, los datos y el almacenamiento de las fotos.'
    ],
    features: [
      {
        title: 'Un globo con la ruta del viaje',
        text: 'Los lugares aparecen como marcadores con su emoji y su orden, unidos por la ruta entre ellos. El filtro inferior deja ver todos los viajes o solo los de un año.',
        points: ['Marcadores numerados con emoji', 'Ruta entre lugares en orden cronológico', 'Filtro por año'],
        image: img('ourmap/ruta', 2400, 1500, 'Ruta de un viaje por España con sus ocho lugares'),
        imageMobile: img('ourmap/demo-movil', 1170, 2532, 'El mismo mapa en el móvil')
      },
      {
        title: 'El diario de cada lugar',
        text: 'Al abrir un lugar el mapa viaja hasta él y muestra su diario: una línea por días con título, texto y fotos, y una galería con todas las imágenes.',
        points: ['Momentos por día con fotos y notas', 'Galería a pantalla completa', 'Fotos reordenables arrastrando'],
        image: img('ourmap/demo-lugar', 2400, 1500, 'Diario de Barcelona con sus momentos por día'),
        imageMobile: img('ourmap/demo-lugar-movil', 1170, 2532, 'Diario de un lugar en el móvil')
      },
      {
        title: 'Todos los lugares de un vistazo',
        text: 'El panel lateral lista los lugares agrupados por año, con su miniatura y sus fechas, y lleva a cualquiera de ellos con un clic.',
        points: ['Agrupación por año', 'Miniatura y fechas de cada lugar', 'Acceso directo al diario'],
        image: img('ourmap/lugares', 2400, 1500, 'Lista de lugares agrupados por año')
      },
      {
        title: 'Tres estilos de mapa',
        text: 'El mismo mapa se ve en calles, satélite o modo oscuro, y la interfaz se adapta al tema elegido.',
        points: ['Calles, satélite y oscuro', 'Tema claro u oscuro en toda la aplicación'],
        image: img('ourmap/satelite', 2400, 1500, 'Vista satélite con la ruta del viaje'),
        imageSecondary: img('ourmap/oscuro', 2400, 1500, 'El mismo mapa en modo oscuro')
      },
      {
        title: 'Compartir y revivir',
        text: 'Un mapa se comparte por invitación para que otras personas añadan sus lugares. La presentación recorre el viaje de forma automática y el mapa completo se descarga como álbum en PDF.',
        points: ['Invitaciones por enlace', 'Presentación automática del viaje', 'Exportación a PDF'],
        image: img('ourmap/landing', 2400, 1500, 'Página de inicio de OurMap'),
        imageMobile: img('ourmap/landing-movil', 1170, 2532, 'Página de inicio en el móvil')
      }
    ],
    extras: [],
    architecture: [
      { area: 'Frontend', text: 'React 19 con TypeScript, Vite y Tailwind CSS. Las transiciones están hechas con Framer Motion.' },
      { area: 'Mapa', text: 'Mapbox GL con proyección de globo, marcadores propios y rutas dibujadas entre lugares.' },
      { area: 'Backend', text: 'Supabase: autenticación, base de datos PostgreSQL y almacenamiento de las fotos.' },
      { area: 'Exportación', text: 'El álbum en PDF se genera en el navegador a partir de la propia interfaz.' },
      { area: 'Despliegue', text: 'Vercel, con una demo pública que funciona sin registro.' }
    ],
    gallery: [img('ourmap/demo', 2400, 1500, 'Globo de OurMap con los lugares visitados')]
  }
]

export const contact = {
  email: 'eneko.fdez.garcia@gmail.com',
  github: 'https://github.com/eneko9555',
  linkedin: 'https://www.linkedin.com/in/eneko-fernández-garcía-790b4b265'
}
