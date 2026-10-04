import Link from 'next/link'
import { notFound } from 'next/navigation'
import { featuredProjects } from '../../data/projects'
import { BrowserFrame, PhoneFrame } from '../../components/Frame'
import { LightboxProvider, Shot } from '../../components/Lightbox'

export const dynamicParams = false

export function generateStaticParams () {
  return featuredProjects.map(({ slug }) => ({ slug }))
}

export function generateMetadata ({ params }) {
  const project = featuredProjects.find(({ slug }) => slug === params.slug)
  if (!project) return {}
  return {
    title: project.name,
    description: project.tagline,
    openGraph: {
      title: `${project.name} | Eneko Fernández`,
      description: project.tagline,
      type: 'article',
      locale: 'es_ES',
      images: [{ url: `/og/${project.slug}.jpg`, width: 1200, height: 630 }]
    }
  }
}

const number = (n) => String(n).padStart(2, '0')

export default function ProjectPage ({ params }) {
  const index = featuredProjects.findIndex(({ slug }) => slug === params.slug)
  if (index === -1) notFound()

  const project = featuredProjects[index]
  const next = featuredProjects[(index + 1) % featuredProjects.length]
  const { name, kind, accent, period, role, tagline, stack, links, facts, cover, context, roleDetail, features, extras, architecture, gallery } = project
  const url = links[0].label

  // Todas las capturas de la página, en el orden en que aparecen, para el visor
  const images = [
    cover,
    ...features.flatMap((feature) => [feature.image, feature.imageSecondary, feature.imageMobile].filter(Boolean)),
    ...gallery
  ].filter((image, i, all) => all.findIndex((other) => other.src === image.src) === i)

  return (
    <LightboxProvider images={images}>
      <main style={{ '--accent': accent }}>
        <section className='relative overflow-hidden'>
          <div
            aria-hidden='true'
            className='pointer-events-none absolute inset-0 opacity-[0.18]'
            style={{ background: `radial-gradient(60rem 30rem at 80% -10%, ${accent}, transparent 70%)` }}
          />
          <div className='container-page relative pb-14 pt-12 sm:pt-16'>
            <Link href='/#proyectos' className='text-sm text-muted transition-colors duration-200 hover:text-ink'>
              <span aria-hidden='true'>←</span> Proyectos
            </Link>
            <p className='label rise mt-12'>
              <span className='text-accent'>{number(index + 1)}</span> · {kind} · {period}
            </p>
            <h1 className='rise rise-2 mt-5 text-6xl font-semibold leading-none tracking-tight sm:text-8xl'>{name}</h1>
            <p className='rise rise-3 mt-7 max-w-3xl text-xl leading-relaxed text-muted sm:text-2xl'>{tagline}</p>
            <div className='rise rise-3 mt-9 flex flex-wrap gap-3'>
              {links.map((link, i) => (
                <a
                  key={link.href}
                  href={link.href}
                  target='_blank'
                  rel='noreferrer'
                  className={i === 0 ? 'btn-primary' : 'btn-ghost'}
                >
                  {link.label} <span aria-hidden='true'>↗</span>
                </a>
              ))}
            </div>

            <dl className='rise rise-4 mt-16 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-line pt-8 lg:grid-cols-4'>
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dd className='text-3xl font-semibold tracking-tight sm:text-4xl'>{fact.value}</dd>
                  <dt className='mt-2 text-sm leading-relaxed text-muted'>{fact.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className='container-page pb-24'>
          <BrowserFrame url={url} className='rise rise-4'>
            <Shot image={cover} sizes='(min-width: 1152px) 1088px, 94vw' priority />
          </BrowserFrame>
        </section>

        <section className='container-page pb-24'>
          <div className='grid gap-12 lg:grid-cols-12'>
            <div data-reveal className='lg:col-span-7'>
              <h2 className='label'>Contexto</h2>
              <div className='mt-5 space-y-5'>
                <p className='text-xl leading-relaxed sm:text-2xl'>{context[0]}</p>
                {context.slice(1).map((paragraph) => (
                  <p key={paragraph} className='prose-lead'>{paragraph}</p>
                ))}
              </div>
            </div>
            <div data-reveal className='lg:col-span-4 lg:col-start-9'>
              <h2 className='label'>Mi rol</h2>
              <p className='mt-5 text-xl font-semibold tracking-tight'>{role}</p>
              <ul className='mt-5 space-y-4 text-muted'>
                {roleDetail.map((item) => (
                  <li key={item} className='flex gap-3 leading-relaxed'>
                    <span aria-hidden='true' className='mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent' />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className='container-page pb-12'>
          <div data-reveal className='border-t border-line pt-10'>
            <p className='label'>El producto</p>
            <h2 className='section-title mt-3'>Qué hace, parte por parte</h2>
          </div>
        </section>

        {features.map((feature, i) => {
          const reversed = i % 2 === 1
          return (
            <section key={feature.title} className='container-page pb-24 sm:pb-28'>
              <div className='grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12'>
                <div data-reveal className={`lg:col-span-4 ${reversed ? 'lg:order-2 lg:col-start-9' : ''}`}>
                  <p className='label'>
                    <span className='text-accent'>{number(i + 1)}</span> / {number(features.length)}
                  </p>
                  <h3 className='mt-4 text-3xl font-semibold tracking-tight'>{feature.title}</h3>
                  <p className='mt-4 leading-relaxed text-muted'>{feature.text}</p>
                  <ul className='mt-6 space-y-2.5 border-t border-line pt-6 text-sm text-ink/90'>
                    {feature.points.map((point) => (
                      <li key={point} className='flex gap-3'>
                        <span aria-hidden='true' className='mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent' />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                <div data-reveal className={`relative lg:col-span-8 ${reversed ? 'lg:order-1' : ''}`}>
                  <BrowserFrame url={url} className={feature.imageMobile ? 'mr-10 sm:mr-20' : feature.imageSecondary ? 'mr-10 sm:mr-24' : ''}>
                    <Shot image={feature.image} sizes='(min-width: 1024px) 720px, 92vw' />
                  </BrowserFrame>
                  {feature.imageMobile && (
                    <PhoneFrame className='absolute -bottom-6 right-0 w-[24%] sm:w-[22%]'>
                      <Shot image={feature.imageMobile} sizes='(min-width: 1024px) 170px, 24vw' />
                    </PhoneFrame>
                  )}
                  {feature.imageSecondary && (
                    <BrowserFrame className='absolute -bottom-8 right-0 w-[46%]'>
                      <Shot image={feature.imageSecondary} sizes='(min-width: 1024px) 340px, 45vw' />
                    </BrowserFrame>
                  )}
                </div>
              </div>
            </section>
          )
        })}

        {extras.length > 0 && (
          <section className='container-page pb-24'>
            <div data-reveal className='rounded-3xl border border-line bg-surface p-8 sm:p-12'>
              <h2 className='label'>Y además</h2>
              <ul className='mt-6 grid gap-x-10 gap-y-4 sm:grid-cols-2'>
                {extras.map((extra) => (
                  <li key={extra} className='flex gap-3 leading-relaxed'>
                    <span aria-hidden='true' className='mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent' />
                    {extra}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <section className='container-page pb-24'>
          <div data-reveal className='border-t border-line pt-10'>
            <p className='label'>Arquitectura</p>
            <h2 className='section-title mt-3'>Cómo está construido</h2>
          </div>
          <dl className='mt-10 divide-y divide-line border-y border-line'>
            {architecture.map((item) => (
              <div key={item.area} data-reveal className='grid gap-2 py-6 lg:grid-cols-12 lg:gap-8'>
                <dt className='font-semibold tracking-tight lg:col-span-3'>{item.area}</dt>
                <dd className='leading-relaxed text-muted lg:col-span-9'>{item.text}</dd>
              </div>
            ))}
          </dl>
          <ul data-reveal className='mt-8 flex flex-wrap gap-2'>
            {stack.map((tech) => (
              <li key={tech} className='chip'>{tech}</li>
            ))}
          </ul>
        </section>

        {gallery.length > 0 && (
          <section className='container-page pb-24'>
            <div data-reveal className='border-t border-line pt-10'>
              <p className='label'>Galería</p>
              <h2 className='section-title mt-3'>Más pantallas</h2>
            </div>
            <div className={`mt-10 grid gap-6 ${gallery.length > 1 ? 'md:grid-cols-2' : ''}`}>
              {gallery.map((image) => (
                <figure key={image.src} data-reveal>
                  <BrowserFrame url={url}>
                    <Shot image={image} sizes={gallery.length > 1 ? '(min-width: 768px) 540px, 94vw' : '(min-width: 1152px) 1088px, 94vw'} />
                  </BrowserFrame>
                  <figcaption className='mt-3 text-sm text-muted'>{image.alt}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        <section className='container-page pb-28'>
          <Link
            href={`/projects/${next.slug}`}
            data-reveal
            className='group flex items-center justify-between gap-6 rounded-3xl border border-line bg-surface p-8 transition-colors duration-300 hover:border-muted sm:p-12'
          >
            <div>
              <p className='label'>Siguiente proyecto</p>
              <p className='mt-3 text-4xl font-semibold tracking-tight sm:text-5xl'>{next.name}</p>
              <p className='mt-2 text-muted'>{next.tagline}</p>
            </div>
            <span aria-hidden='true' className='text-4xl transition-transform duration-300 group-hover:translate-x-2'>→</span>
          </Link>
        </section>
      </main>
    </LightboxProvider>
  )
}
