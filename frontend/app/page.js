import Link from 'next/link'
import FeaturedProject from './components/FeaturedProject'
import { featuredProjects, otherProjects, stack, contact } from './data/projects'

export default function Home () {
  return (
    <main>
      <section className='container-page pb-20 pt-20 sm:pb-28 sm:pt-32'>
        <p className='label rise'>Desarrollador full stack</p>
        <h1 className='rise rise-2 mt-6 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl'>
          Construyo productos web completos,{' '}
          <span className='font-serif font-normal italic text-muted'>de la idea a producción.</span>
        </h1>
        <p className='rise rise-3 mt-8 max-w-2xl text-lg text-muted sm:text-xl'>
          Soy Eneko Fernández. Diseño y desarrollo aplicaciones con React, Next.js y Node. Aquí están
          los tres productos en los que más he trabajado: Askesis, Chronia Timeline y OurMap.
        </p>
        <div className='rise rise-3 mt-10 flex flex-wrap gap-3'>
          <Link href='/#proyectos' className='btn-primary'>
            Ver proyectos <span aria-hidden='true'>↓</span>
          </Link>
          <Link href='/contact' className='btn-ghost'>Contacto</Link>
        </div>
      </section>

      <section id='proyectos' className='container-page -mt-20 pb-24 pt-20'>
        <div className='flex items-end justify-between border-t border-line pt-8'>
          <h2 className='text-2xl font-semibold tracking-tight sm:text-3xl'>Proyectos principales</h2>
          <p className='label hidden sm:block'>03 productos</p>
        </div>
        <div className='mt-10 space-y-8'>
          {featuredProjects.map((project, index) => (
            <FeaturedProject key={project.slug} project={project} index={index} />
          ))}
        </div>
      </section>

      <section className='container-page pb-24'>
        <div className='border-t border-line pt-8'>
          <h2 className='text-2xl font-semibold tracking-tight sm:text-3xl'>Otros proyectos</h2>
          <p className='mt-3 max-w-2xl text-muted'>
            Proyectos más pequeños y ejercicios de formación con los que aprendí el stack.
          </p>
        </div>
        <ul className='mt-8 divide-y divide-line border-y border-line'>
          {otherProjects.map((project) => (
            <li key={project.name} className='grid gap-2 py-5 sm:grid-cols-12 sm:items-baseline sm:gap-6'>
              <h3 className='font-medium sm:col-span-3'>{project.name}</h3>
              <p className='text-sm text-muted sm:col-span-5'>{project.description}</p>
              <p className='font-mono text-xs text-muted sm:col-span-2'>{project.technologies.slice(0, 3).join(' · ')}</p>
              <p className='flex gap-4 text-sm sm:col-span-2 sm:justify-end'>
                <a href={project.website} target='_blank' rel='noreferrer' className='link'>
                  Web <span aria-hidden='true'>↗</span>
                </a>
                {project.github && (
                  <a href={project.github} target='_blank' rel='noreferrer' className='link'>
                    Código <span aria-hidden='true'>↗</span>
                  </a>
                )}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section id='sobre-mi' className='container-page -mt-20 pb-24 pt-20'>
        <div className='grid gap-12 border-t border-line pt-8 lg:grid-cols-12'>
          <div className='lg:col-span-6'>
            <h2 className='text-2xl font-semibold tracking-tight sm:text-3xl'>Sobre mí</h2>
            <div className='mt-6 space-y-4 text-lg text-muted'>
              <p>
                Soy desarrollador web full stack con conocimientos en sistemas y redes. Me formé de
                manera autodidacta y amplié esa base con el bootcamp de Desarrollo Web Full Stack de
                ISDI Coders.
              </p>
              <p>
                Me gusta trabajar el producto entero: el modelo de datos, la API, la interfaz y el
                despliegue. Busco soluciones sencillas y que escalen, y prefiero enseñar lo que hago
                con aplicaciones que se pueden abrir y usar.
              </p>
            </div>
          </div>
          <dl className='grid gap-8 sm:grid-cols-2 lg:col-span-6'>
            {stack.map((group) => (
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

      <section className='container-page pb-24'>
        <div className='rounded-2xl border border-line bg-surface p-8 sm:p-14'>
          <p className='label'>Contacto</p>
          <h2 className='mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl'>
            ¿Tienes un proyecto o una oportunidad?{' '}
            <span className='font-serif font-normal italic text-muted'>Hablemos.</span>
          </h2>
          <div className='mt-8 flex flex-wrap items-center gap-4'>
            <Link href='/contact' className='btn-primary'>Escribirme</Link>
            <a href={`mailto:${contact.email}`} className='link text-muted'>{contact.email}</a>
          </div>
        </div>
      </section>
    </main>
  )
}
