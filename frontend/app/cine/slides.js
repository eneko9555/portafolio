// Contenido que se proyecta en cada sala. Todo sale de los mismos datos que el portfolio.
import { featuredProjects, contact } from '../data/projects'
import { profile, experience, education, courses, skills, languages } from '../data/profile'

const number = (n) => String(n).padStart(2, '0')

function projectSlides (project) {
  return [
    { type: 'title', title: project.name, text: project.tagline, stat: `${project.highlight.value} ${project.highlight.label}`, note: `${project.kind} · ${project.period}` },    { type: 'text', eyebrow: 'Contexto', title: 'Qué problema resuelve', paragraphs: project.context },
    { type: 'list', eyebrow: 'Mi rol', title: project.role, items: project.roleDetail.map((text) => ({ text })) },
    ...project.features.map((feature, i) => ({
      type: 'feature',
      eyebrow: `${number(i + 1)} / ${number(project.features.length)}`,
      title: feature.title,
      text: feature.text,
      points: feature.points,
      image: feature.image
    })),
    ...(project.extras.length
      ? [{ type: 'list', eyebrow: 'Y además', title: 'Lo que también incluye', items: project.extras.map((text) => ({ text })) }]
      : []),
    { type: 'list', eyebrow: 'Arquitectura', title: 'Cómo está construido', items: project.architecture.map((item) => ({ title: item.area, text: item.text })) },
    { type: 'end', title: 'Fin de la sesión', text: `Puedes verlo en ${project.links[0].label}`, note: project.stack.join(' · ') }
  ]
}

const aboutSlides = [
  { type: 'title', title: profile.name, text: profile.summary, stat: profile.location, note: profile.title },
  { type: 'text', eyebrow: 'Sobre mí', title: 'Del modelo de datos al despliegue', paragraphs: profile.about },
  ...experience.map((job) => ({
    type: 'list',
    eyebrow: `Experiencia · ${job.period}`,
    title: `${job.company} · ${job.role}`,
    lead: job.summary,
    items: job.points.map((text) => ({ text }))
  })),
  {
    type: 'list',
    eyebrow: 'Formación',
    title: 'Formación académica',
    items: education.map((item) => ({ title: `${item.title} · ${item.school}`, text: `${item.period}. ${item.note}` }))
  },
  {
    type: 'list',
    eyebrow: 'Formación adicional',
    title: 'Cursos',
    items: courses.map((course) => ({ title: course.title, text: `${course.detail} · ${course.year}` }))
  },
  {
    type: 'list',
    eyebrow: 'Habilidades',
    title: 'Con qué trabajo',
    items: skills.map((group) => ({ title: group.title, text: group.items.join(' · ') }))
  },
  {
    type: 'list',
    eyebrow: 'Idiomas',
    title: 'Idiomas y forma de trabajar',
    items: [
      ...languages.map((language) => ({ title: language.name, text: language.level })),
      { title: 'Además del código', text: 'Liderazgo técnico, gestión de proyectos y comunicación directa con clientes.' }
    ]
  },
  { type: 'end', title: 'Fin de la sesión', text: 'La sala 5 es la de contacto', note: 'Está en este mismo lado del pasillo' }
]

const contactSlides = [
  { type: 'title', title: 'Hablemos', text: '¿Tienes un proyecto o una oportunidad? Escríbeme y te respondo lo antes posible.', stat: contact.email, note: 'Contacto' },
  {
    type: 'list',
    eyebrow: 'Contacto',
    title: 'Dónde encontrarme',
    items: [
      { title: 'Email', text: contact.email },
      { title: 'LinkedIn', text: 'linkedin.com/in/eneko-fernández-garcía-790b4b265' },
      { title: 'GitHub', text: 'github.com/eneko9555' },
      { title: 'Ubicación', text: profile.location }
    ]
  },
  { type: 'end', title: 'Gracias por venir', text: 'Abajo puedes escribirme sin levantarte, copiar el email o abrir mis perfiles', note: contact.email }
]

export const SLIDES = {
  askesis: projectSlides(featuredProjects[0]),
  chronia: projectSlides(featuredProjects[1]),
  ourmap: projectSlides(featuredProjects[2]),
  'sobre-mi': aboutSlides,
  contacto: contactSlides
}

export const CONTACT = contact
