import Link from 'next/link'

const links = [
  { href: '/#proyectos', label: 'Proyectos' },
  { href: '/about', label: 'Sobre mí' },
  { href: '/contact', label: 'Contacto' }
]

const Header = () => {
  return (
    <header className='sticky top-0 z-40 border-b border-line/60 bg-bg/75 backdrop-blur-xl'>
      <a
        href='#contenido'
        className='sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-bg'
      >
        Saltar al contenido
      </a>
      <nav aria-label='Principal' className='container-page flex h-16 items-center justify-between gap-4'>
        <Link href='/' className='flex items-center gap-2.5 text-[0.95rem] font-semibold tracking-tight'>
          <span aria-hidden='true' className='grid h-8 w-8 place-items-center rounded-lg border border-line bg-surface pb-0.5 font-serif text-[1.35rem] font-normal italic leading-none tracking-normal'>
            ef
          </span>
          <span className='hidden sm:inline'>Eneko Fernández</span>
        </Link>
        <ul className='flex items-center gap-5 text-sm text-muted sm:gap-8'>
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className='transition-colors duration-200 hover:text-ink'>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export default Header
