import Image from 'next/image'
import Link from 'next/link'

const FeaturedProject = ({ project, index }) => {
  const { slug, name, kind, accent, tagline, highlights, stack, links, cover, coverMobile } = project
  const reversed = index % 2 === 1

  return (
    <article
      style={{ '--accent': accent }}
      className='relative overflow-hidden rounded-2xl border border-line bg-surface'
    >
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 opacity-[0.14]'
        style={{ background: `radial-gradient(60rem 30rem at ${reversed ? '0%' : '100%'} 0%, ${accent}, transparent 70%)` }}
      />
      <div className='relative grid gap-10 p-6 sm:p-10 lg:grid-cols-12 lg:items-center lg:gap-12'>
        <div className={`lg:col-span-5 ${reversed ? 'lg:order-2' : ''}`}>
          <p className='label'>
            <span className='text-accent'>0{index + 1}</span> · {kind}
          </p>
          <h3 className='mt-4 text-3xl font-semibold tracking-tight sm:text-4xl'>{name}</h3>
          <p className='mt-3 text-lg text-muted'>{tagline}</p>

          <ul className='mt-6 space-y-2.5 text-sm text-ink/90'>
            {highlights.map((item) => (
              <li key={item} className='flex gap-3'>
                <span aria-hidden='true' className='mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent' />
                {item}
              </li>
            ))}
          </ul>

          <ul className='mt-6 flex flex-wrap gap-2'>
            {stack.slice(0, 6).map((tech) => (
              <li key={tech} className='chip'>{tech}</li>
            ))}
          </ul>

          <div className='mt-8 flex flex-wrap items-center gap-3'>
            <Link href={`/projects/${slug}`} className='btn-primary'>
              Ver proyecto <span aria-hidden='true'>→</span>
            </Link>
            <a href={links[0].href} target='_blank' rel='noreferrer' className='btn-ghost'>
              {links[0].label} <span aria-hidden='true'>↗</span>
            </a>
          </div>
        </div>

        <Link
          href={`/projects/${slug}`}
          aria-label={`Ver proyecto ${name}`}
          className={`group relative block lg:col-span-7 ${reversed ? 'lg:order-1' : ''}`}
        >
          <div className={`shot transition-transform duration-500 group-hover:-translate-y-1 ${coverMobile ? 'mr-8 sm:mr-14' : ''}`}>
            <Image
              src={cover.src}
              width={cover.width}
              height={cover.height}
              alt={cover.alt}
              sizes='(min-width: 1024px) 640px, 90vw'
              className='h-auto w-full'
            />
          </div>
          {coverMobile && (
            <div className='absolute -bottom-3 right-0 w-[24%] overflow-hidden rounded-xl border border-line bg-surface shadow-2xl shadow-black/60 transition-transform duration-500 group-hover:-translate-y-2 sm:rounded-2xl'>
              <Image
                src={coverMobile.src}
                width={coverMobile.width}
                height={coverMobile.height}
                alt={coverMobile.alt}
                sizes='(min-width: 1024px) 160px, 22vw'
                className='h-auto w-full'
              />
            </div>
          )}
        </Link>
      </div>
    </article>
  )
}

export default FeaturedProject
