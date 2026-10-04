import Link from 'next/link'
import ExperienceList from '../components/ExperienceList'
import { contact } from '../data/projects'
import { profile, education, courses, skills, languages } from '../data/profile'

export const metadata = {
  title: 'Sobre mí',
  description: profile.summary
}

export default function AboutPage () {
  return (
    <main>
      <section className='container-page pb-20 pt-12 sm:pt-20'>
        <p className='label rise'>Sobre mí</p>
        <h1 className='rise rise-2 mt-5 max-w-4xl text-5xl font-semibold leading-[1.03] tracking-tight sm:text-7xl'>
          {profile.title},{' '}
          <span className='font-serif font-normal italic text-muted'>de la interfaz a la infraestructura.</span>
        </h1>

        <div className='mt-14 grid gap-12 lg:grid-cols-12'>
          <div className='rise rise-3 space-y-5 lg:col-span-7'>
            <p className='text-xl leading-relaxed sm:text-2xl'>{profile.summary}</p>
            {profile.about.map((paragraph) => (
              <p key={paragraph} className='prose-lead'>{paragraph}</p>
            ))}
          </div>
          <dl className='rise rise-4 content-start space-y-6 border-t border-line pt-6 lg:col-span-4 lg:col-start-9 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0'>
            <div>
              <dt className='label'>Ubicación</dt>
              <dd className='mt-2'>{profile.location}</dd>
            </div>
            <div>
              <dt className='label'>Actualmente</dt>
              <dd className='mt-2'>Butler Scientifics y Askesis</dd>
            </div>
            <div>
              <dt className='label'>Idiomas</dt>
              <dd className='mt-2 space-y-1'>
                {languages.map((language) => (
                  <p key={language.name}>
                    {language.name} <span className='text-muted'>· {language.level}</span>
                  </p>
                ))}
              </dd>
            </div>
            <div>
              <dt className='label'>Contacto</dt>
              <dd className='mt-2 space-y-1'>
                <p><a href={`mailto:${contact.email}`} className='link'>{contact.email}</a></p>
                <p>
                  <a href={contact.linkedin} target='_blank' rel='noreferrer' className='link'>LinkedIn</a>
                  <span className='text-muted'> · </span>
                  <a href={contact.github} target='_blank' rel='noreferrer' className='link'>GitHub</a>
                </p>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className='container-page pb-24'>
        <div data-reveal>
          <p className='label'>Experiencia</p>
          <h2 className='section-title mt-3'>Experiencia laboral</h2>
        </div>
        <div className='mt-10'>
          <ExperienceList />
        </div>
      </section>

      <section className='container-page pb-24'>
        <div data-reveal>
          <p className='label'>Formación</p>
          <h2 className='section-title mt-3'>Formación académica</h2>
        </div>
        <ol className='mt-10 divide-y divide-line border-y border-line'>
          {education.map((item) => (
            <li key={item.title} data-reveal className='grid gap-3 py-8 lg:grid-cols-12 lg:gap-8'>
              <p className='label lg:col-span-4 lg:pt-1.5'>{item.period}</p>
              <div className='lg:col-span-8'>
                <h3 className='text-xl font-semibold tracking-tight'>{item.title}</h3>
                <p className='mt-1 text-muted'>{item.school}</p>
                <p className='mt-3 leading-relaxed text-ink/90'>{item.note}</p>
              </div>
            </li>
          ))}
        </ol>

        <h3 data-reveal className='label mt-14'>Formación adicional</h3>
        <ul data-reveal className='mt-5 divide-y divide-line border-y border-line'>
          {courses.map((course) => (
            <li key={course.title} className='grid gap-1 py-4 sm:grid-cols-12 sm:items-baseline sm:gap-6'>
              <p className='font-medium sm:col-span-5'>{course.title}</p>
              <p className='text-sm text-muted sm:col-span-5'>{course.detail}</p>
              <p className='font-mono text-xs text-muted sm:col-span-2 sm:text-right'>{course.year}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className='container-page pb-24'>
        <div data-reveal>
          <p className='label'>Habilidades</p>
          <h2 className='section-title mt-3'>Con qué trabajo</h2>
        </div>
        <dl data-reveal className='mt-10 grid gap-x-10 gap-y-8 border-t border-line pt-8 sm:grid-cols-2'>
          {skills.map((group) => (
            <div key={group.title}>
              <dt className='label'>{group.title}</dt>
              <dd className='mt-3 flex flex-wrap gap-2'>
                {group.items.map((item) => (
                  <span key={item} className='chip'>{item}</span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
        <p data-reveal className='mt-10 max-w-3xl leading-relaxed text-muted'>
          Además del código: liderazgo técnico, gestión de proyectos y comunicación directa con clientes.
        </p>
      </section>

      <section className='container-page pb-28'>
        <div data-reveal className='flex flex-col gap-6 rounded-3xl border border-line bg-surface p-8 sm:flex-row sm:items-center sm:justify-between sm:p-12'>
          <h2 className='text-3xl font-semibold tracking-tight sm:text-4xl'>
            Lo que construyo, <span className='font-serif font-normal italic text-muted'>en detalle.</span>
          </h2>
          <div className='flex flex-wrap gap-3'>
            <Link href='/#proyectos' className='btn-primary'>Ver proyectos</Link>
            <Link href='/contact' className='btn-ghost'>Contacto</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
