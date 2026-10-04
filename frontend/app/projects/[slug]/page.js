import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { featuredProjects } from '../../data/projects'

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

export default function ProjectPage ({ params }) {
  const index = featuredProjects.findIndex(({ slug }) => slug === params.slug)
  if (index === -1) notFound()

  const project = featuredProjects[index]
  const next = featuredProjects[(index + 1) % featuredProjects.length]
  const { name, kind, accent, tagline, description, stack, links, cover, features, gallery, galleryMobile } = project

  return (
    <main style={{ '--accent': accent }}>
      <section className='container-page pb-12 pt-12 sm:pt-20'>
        <Link href='/#proyectos' className='text-sm text-muted transition-colors duration-200 hover:text-ink'>
          <span aria-hidden='true'>←</span> Proyectos
        </Link>
        <p className='label rise mt-10'>
          <span className='text-accent'>0{index + 1}</span> · {kind}
        </p>
        <h1 className='rise rise-2 mt-4 text-5xl font-semibold tracking-tight sm:text-7xl'>{name}</h1>
        <p className='rise rise-3 mt-6 max-w-3xl text-xl text-muted sm:text-2xl'>{tagline}</p>
        <div className='rise rise-3 mt-8 flex flex-wrap gap-3'>
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
      </section>

      <section className='container-page pb-20'>
        <div className='shot'>
          <Image
            src={cover.src}
            width={cover.width}
            height={cover.height}
            alt={cover.alt}
            sizes='(min-width: 1152px) 1088px, 94vw'
            priority
            className='h-auto w-full'
          />
        </div>
      </section>

      <section className='container-page grid gap-10 pb-20 lg:grid-cols-12'>
        <div className='lg:col-span-7'>
          <h2 className='label'>Qué es</h2>
          <p className='mt-4 text-xl leading-relaxed sm:text-2xl'>{description}</p>
        </div>
        <div className='lg:col-span-4 lg:col-start-9'>
          <h2 className='label'>Stack</h2>
          <ul className='mt-4 flex flex-wrap gap-2'>
            {stack.map((tech) => (
              <li key={tech} className='chip'>{tech}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className='container-page pb-20'>
        <h2 className='label border-t border-line pt-8'>Qué incluye</h2>
        <ul className='mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3'>
          {features.map((feature) => (
            <li key={feature.title}>
              <h3 className='flex items-center gap-3 font-medium'>
                <span aria-hidden='true' className='h-1.5 w-1.5 rounded-full bg-accent' />
                {feature.title}
              </h3>
              <p className='mt-2 text-sm leading-relaxed text-muted'>{feature.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className='container-page pb-20'>
        <h2 className='label border-t border-line pt-8'>Capturas</h2>
        <div className='mt-8 grid gap-6 md:grid-cols-2'>
          {gallery.map((image) => (
            <figure key={image.src}>
              <div className='shot'>
                <Image
                  src={image.src}
                  width={image.width}
                  height={image.height}
                  alt={image.alt}
                  sizes='(min-width: 768px) 540px, 94vw'
                  className='h-auto w-full'
                />
              </div>
              <figcaption className='mt-3 text-sm text-muted'>{image.alt}</figcaption>
            </figure>
          ))}
        </div>

        {galleryMobile.length > 0 && (
          <div className='mt-10 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4'>
            {galleryMobile.map((image) => (
              <figure key={image.src}>
                <div className='shot rounded-2xl'>
                  <Image
                    src={image.src}
                    width={image.width}
                    height={image.height}
                    alt={image.alt}
                    sizes='(min-width: 640px) 260px, 45vw'
                    className='h-auto w-full'
                  />
                </div>
                <figcaption className='mt-3 text-sm text-muted'>{image.alt}</figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>

      <section className='container-page pb-24'>
        <Link
          href={`/projects/${next.slug}`}
          className='group flex items-center justify-between gap-6 rounded-2xl border border-line bg-surface p-8 transition-colors duration-200 hover:border-muted sm:p-10'
        >
          <div>
            <p className='label'>Siguiente proyecto</p>
            <p className='mt-3 text-3xl font-semibold tracking-tight sm:text-4xl'>{next.name}</p>
          </div>
          <span aria-hidden='true' className='text-3xl transition-transform duration-300 group-hover:translate-x-1'>→</span>
        </Link>
      </section>
    </main>
  )
}
