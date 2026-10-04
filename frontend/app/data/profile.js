export const profile = {
  name: 'Eneko Fernández García',
  title: 'Desarrollador full stack',
  location: 'Barakaldo, Bizkaia',
  summary:
    'Desarrollador full stack con experiencia en el ciclo completo de desarrollo de software, desde la conceptualización y el diseño UI/UX hasta la implementación y el despliegue en producción.',
  about: [
    'Trabajo como desarrollador full stack en Butler Scientifics, donde llevo soluciones de software a medida desde la toma de requisitos con el cliente hasta el despliegue. En paralelo soy co-fundador de Askesis, una plataforma SaaS para entrenadores personales que desarrollo desde 2023.',
    'Me muevo con comodidad en todo el recorrido de un producto: el modelo de datos, la API, la interfaz y la infraestructura. Vengo de una formación en sistemas y redes, y eso se nota en cómo pienso el despliegue y la seguridad.',
    'Sigo formándome: curso el Grado Superior en Desarrollo de Aplicaciones Web y un programa avanzado de IA aplicada a la programación.'
  ]
}

export const stats = [
  { value: '600+', label: 'usuarios activos en Askesis' },
  { value: '3', label: 'productos propios en producción' },
  { value: '−40 %', label: 'de tiempo de diseño técnico con un plugin de AutoCAD' }
]

export const experience = [
  {
    company: 'Butler Scientifics',
    role: 'Desarrollador full stack',
    period: 'Jun 2024 — actualidad',
    summary:
      'Lidero el ciclo completo de desarrollo de soluciones de software a medida, desde la toma de requisitos técnicos del cliente hasta el despliegue final.',
    points: [
      'Sistemas de automatización inteligente de células de fabricación, con algoritmos de optimización que mejoran el flujo productivo en planta.',
      'Extensiones de Outlook con inteligencia artificial que extraen la información crítica de los correos y la sincronizan de forma organizada en SharePoint.',
      'Plugin de automatización para AutoCAD en C# que reduce en un 40 % el tiempo de diseño técnico de sistemas contraincendios.',
      'Aplicaciones web basadas en visión por computador e IA para digitalizar, procesar y convertir automáticamente planos industriales.'
    ]
  },
  {
    company: 'Askesis',
    href: 'https://askesis.app/',
    role: 'Co-fundador y desarrollador full stack',
    period: 'Jun 2023 — actualidad',
    summary:
      'Co-fundador y responsable del desarrollo de una plataforma SaaS de entrenamiento (PWA) con más de 600 usuarios activos en el mercado internacional.',
    points: [
      'Diseño y mantenimiento de la arquitectura sobre Next.js, MongoDB y Node.js, con pagos mediante Stripe y comunicación bidireccional con Socket.IO.',
      'Gestión de la infraestructura en la nube con AWS y Cloudflare: seguridad, alta disponibilidad y tiempos de latencia globales.'
    ]
  }
]

export const education = [
  {
    title: 'Programa Avanzado en IA para Programar',
    school: 'UNIR',
    period: 'Feb 2026 — en curso',
    note: 'IA aplicada a la programación, orientada a la productividad y a soluciones reales.'
  },
  {
    title: 'Grado Superior en Desarrollo de Aplicaciones Web (DAW)',
    school: 'Linkia FP',
    period: 'Feb 2025 — en curso',
    note: 'Calificación media del primer año: 9,7 sobre 10.'
  },
  {
    title: 'Bootcamp en Desarrollo Web Full Stack (600 h)',
    school: 'ISDI Coders',
    period: 'Sep 2023 — Abr 2024',
    note: 'MERN stack, TypeScript y testing. Mejor proyecto de la promoción.'
  },
  {
    title: 'Grado Medio en Sistemas Microinformáticos y Redes',
    school: 'CIFP Juan de Colonia',
    period: 'Sep 2022 — Dic 2024',
    note: 'Calificación final: 8,9 sobre 10, con mención especial en Sistemas Operativos en Red y Servicios en Red.'
  }
]

export const courses = [
  { title: 'ASP.NET Core MVC 9', detail: 'C#, .NET Core, MVC y Entity Framework · 40 h', year: '2025' },
  { title: 'React y TypeScript: guía completa', detail: 'Hooks, estado global, testing y patrones · 45 h', year: '2023 — 2024' },
  { title: 'JavaScript moderno', detail: 'ES6+, DOM, async/await y Fetch API · 52,5 h', year: '2023 — 2024' },
  { title: 'Máster en JavaScript, HTML, CSS y Node.js', detail: 'Full stack con Node.js, Express y bases de datos · 55 h', year: '2023 — 2024' },
  { title: 'Máster en CSS', detail: 'Flexbox, Grid, Bootstrap y Tailwind CSS · 45 h', year: '2022 — 2023' }
]

export const skills = [
  { title: 'Frontend', items: ['Next.js', 'React', 'TypeScript', 'JavaScript (ES6+)', 'Tailwind CSS', 'HTML5 / CSS3', 'Vite', 'Framer Motion', 'PWA'] },
  { title: 'Backend', items: ['Node.js', 'Express', 'C# (.NET Core)', 'MongoDB', 'SQL (MySQL / PostgreSQL)', 'Java', 'Python', 'REST APIs', 'Socket.IO'] },
  { title: 'Servicios e integraciones', items: ['Stripe', 'Supabase', 'Firebase', 'Mapbox GL', 'Agora', 'MCP', 'OAuth 2.1'] },
  { title: 'DevOps y herramientas', items: ['Git / GitHub', 'Docker', 'AWS (S3, EC2)', 'Cloudflare', 'Vercel', 'Railway', 'CI/CD'] },
  { title: 'Desarrollo con IA', items: ['Claude Code', 'Cursor', 'Antigravity', 'Agent Skills'] }
]

export const languages = [
  { name: 'Español', level: 'Nativo' },
  { name: 'Inglés', level: 'B1-B2 técnico' },
  { name: 'Euskera', level: 'A2' }
]
