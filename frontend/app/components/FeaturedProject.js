import Image from 'next/image'
import Link from 'next/link'
import { BrowserFrame, PhoneFrame } from './Frame'

const FeaturedProject = ({ project, index }) => {
  const { slug, name, kind, accent, period, role, tagline, highlights, highlight, stack, links, cover, coverMobile } = project
  const reversed = index % 2 === 1

  return (
    <article
      data-reveal
      style={{ '--accent': accent }}
      className='group/card relative overflow-hidden rounded-3xl border border-line bg-surface transition-colors duration-500 hover:border-[#3a3a42]'
    >
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 opacity-[0.16] transition-opacity duration-700 group-hover/card:opacity-[0.26]'
        style={{ background: `radial-gradient(60rem 32rem at ${reversed ? '0%' : '100%'} 0%, ${accent}, transparent 70%)` }}
      />
      <div className='relative grid gap-10 p-6 sm:p-10 lg:grid-cols-12 lg:items-center lg:gap-12 lg:p-14'>
        <div className={`lg:col-span-5 ${reversed ? 'lg:order-2' : ''}`}>
          <p className='label'>
            <span className='text-accent'>0{index + 1}</span> · {kind} · {period}
          </p>
          <h3 className='mt-5 text-4xl font-semibold tracking-tight sm:text-5xl'>{name}</h3>
          <p className='mt-4 text-lg leading-relaxed text-muted'>{tagline}</p>

          <ul className='mt-7 space-y-3 text-[0.95rem] text-ink/90'>
            {highlights.map((item) => (
              <li key={item} className='flex gap-3 leading-relaxed'>
                <span aria-hidden='true' className='mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent' />
                {item}
              </li>
            ))}
          </ul>

          <dl className='mt-8 flex gap-10 border-t border-line pt-6'>
            <div>
              <dt className='label'>{highlight.label}</dt>
              <dd className='mt-1 text-3xl font-semibold tracking-tight'>{highlight.value}</dd>
            </div>
            <div>
              <dt className='label'>Rol</dt>
              <dd className='mt-2 text-sm text-ink/90'>{role}</dd>
            </div>
          </dl>

          <ul className='mt-6 flex flex-wrap gap-2'>
            {stack.slice(0, 5).map((tech) => (
              <li key={tech} className='chip'>{tech}</li>
            ))}
          </ul>

          <div className='mt-8 flex flex-wrap items-center gap-3'>
            <Link href={`/projects/${slug}`} className='btn-primary'>
              Ver caso completo <span aria-hidden='true'>→</span>
            </Link>
            <a href={links[0].href} target='_blank' rel='noreferrer' className='btn-ghost'>
              {links[0].label} <span aria-hidden='true'>↗</span>
            </a>
          </div>
        </div>

        <Link
          href={`/projects/${slug}`}
          aria-label={`Ver el caso completo de ${name}`}
          tabIndex={-1}
          className={`group relative block lg:col-span-7 ${reversed ? 'lg:order-1' : ''}`}
        >
          <BrowserFrame
            url={links[0].label}
            className={`transition-transform duration-700 ease-out group-hover:-translate-y-1.5 ${coverMobile ? 'mr-8 sm:mr-14' : ''}`}
          >
            <Image
              src={cover.src}
              width={cover.width}
              height={cover.height}
              alt={cover.alt}
              sizes='(min-width: 1024px) 640px, 90vw'
              className='h-auto w-full'
            />
          </BrowserFrame>
          {coverMobile && (
            <PhoneFrame className='absolute -bottom-4 right-0 w-[23%] transition-transform duration-700 ease-out group-hover:-translate-y-3'>
              <Image
                src={coverMobile.src}
                width={coverMobile.width}
                height={coverMobile.height}
                alt={coverMobile.alt}
                sizes='(min-width: 1024px) 160px, 22vw'
                className='h-auto w-full'
              />
            </PhoneFrame>
          )}
        </Link>
      </div>
    </article>
  )
}

export default FeaturedProject
