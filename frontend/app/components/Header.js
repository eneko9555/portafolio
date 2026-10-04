import Link from 'next/link'

const links = [
  { href: '/#proyectos', label: 'Proyectos' },
  { href: '/#sobre-mi', label: 'Sobre mí' },
  { href: '/contact', label: 'Contacto' }
]

const Header = () => {
  return (
    <header className='sticky top-0 z-50 border-b border-line/70 bg-bg/80 backdrop-blur-md'>
      <nav className='container-page flex h-16 items-center justify-between gap-4'>
        <Link href='/' className='text-base font-semibold tracking-tight'>
          Eneko Fernández
        </Link>
        <ul className='flex items-center gap-4 text-sm text-muted sm:gap-8'>
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
