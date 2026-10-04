import Link from 'next/link'
import FeaturedProject from './components/FeaturedProject'
import ExperienceList from './components/ExperienceList'
import { featuredProjects, contact } from './data/projects'
import { profile, stats, skills } from './data/profile'

export default function Home () {
  return (
    <main>
      <section className='relative overflow-hidden'>
        <div aria-hidden='true' className='glow pointer-events-none absolute inset-0' />
        <div className='container-page relative pb-20 pt-20 sm:pb-28 sm:pt-32'>
          <p className='label rise flex items-center gap-3'>
            <span className='h-px w-8 bg-muted' aria-hidden='true' />
            {profile.title} · {profile.location}
          </p>
          <h1 className='rise rise-2 mt-7 max-w-5xl text-[2.9rem] font-semibold leading-[1.02] tracking-tight sm:text-7xl lg:text-[5.2rem]'>
            Construyo productos web completos,{' '}
            <span className='font-serif font-normal italic text-muted'>de la idea a producción.</span>
          </h1>
          <p className='rise rise-3 mt-8 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl'>
            Soy Eneko Fernández. Trabajo como desarrollador full stack en Butler Scientifics y soy
            co-fundador de Askesis, una plataforma SaaS con más de 600 usuarios activos.
          </p>
          <div className='rise rise-3 mt-10 flex flex-wrap gap-3'>
            <Link href='/#proyectos' className='btn-primary'>
              Ver proyectos <span aria-hidden='true'>↓</span>
            </Link>
            <Link href='/about' className='btn-ghost'>Sobre mí</Link>
            <Link href='/cine' className='btn-ghost'>
              Entrar al cine 3D <span aria-hidden='true'>→</span>
            </Link>
          </div>

          <dl className='rise rise-4 mt-20 grid gap-8 border-t border-line pt-8 sm:grid-cols-3'>
            {stats.map((stat) => (
              <div key={stat.label}>
                <dd className='text-4xl font-semibold tracking-tight sm:text-5xl'>{stat.value}</dd>
                <dt className='mt-2 max-w-[16rem] text-sm leading-relaxed text-muted'>{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id='proyectos' className='container-page -mt-20 pb-28 pt-20'>
        <div data-reveal className='flex items-end justify-between gap-6 border-t border-line pt-10'>
          <div>
            <p className='label'>Proyectos</p>
            <h2 className='section-title mt-3'>Tres productos, de principio a fin</h2>
          </div>
          <p className='hidden max-w-xs text-sm leading-relaxed text-muted md:block'>
            Cada uno tiene su caso completo: qué resuelve, cuál es mi papel y cómo está construido.
          </p>
        </div>
        <div className='mt-12 space-y-8'>
          {featuredProjects.map((project, index) => (
            <FeaturedProject key={project.slug} project={project} index={index} />
          ))}
        </div>
      </section>

      <section className='container-page pb-28'>
        <div data-reveal>
          <p className='label'>Experiencia</p>
          <h2 className='section-title mt-3'>Dónde trabajo</h2>
        </div>
        <div className='mt-10'>
          <ExperienceList />
        </div>
      </section>

      <section className='container-page pb-28'>
        <div className='grid gap-12 lg:grid-cols-12'>
          <div data-reveal className='lg:col-span-6'>
            <p className='label'>Sobre mí</p>
            <h2 className='section-title mt-3'>Del modelo de datos al despliegue</h2>
            <div className='mt-6 space-y-4'>
              {profile.about.slice(0, 2).map((paragraph) => (
                <p key={paragraph} className='prose-lead'>{paragraph}</p>
              ))}
            </div>
            <Link href='/about' className='btn-ghost mt-8'>
              Experiencia y formación <span aria-hidden='true'>→</span>
            </Link>
          </div>
          <dl data-reveal className='grid content-start gap-8 sm:grid-cols-2 lg:col-span-5 lg:col-start-8'>
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
        </div>
      </section>

      <section className='container-page pb-28'>
        <div data-reveal className='relative overflow-hidden rounded-3xl border border-line bg-surface p-8 sm:p-16'>
          <div aria-hidden='true' className='glow pointer-events-none absolute inset-0 opacity-70' />
          <div className='relative'>
            <p className='label'>Contacto</p>
            <h2 className='mt-4 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl'>
              ¿Tienes un proyecto o una oportunidad?{' '}
              <span className='font-serif font-normal italic text-muted'>Hablemos.</span>
            </h2>
            <div className='mt-10 flex flex-wrap items-center gap-5'>
              <Link href='/contact' className='btn-primary'>Escribirme</Link>
              <a href={`mailto:${contact.email}`} className='link text-muted'>{contact.email}</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
