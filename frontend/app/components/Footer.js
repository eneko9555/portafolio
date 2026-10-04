import { contact } from '../data/projects'

const Footer = () => {
  return (
    <footer className='border-t border-line'>
      <div className='container-page flex flex-col gap-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between'>
        <p>© {new Date().getFullYear()} Eneko Fernández</p>
        <ul className='flex gap-6'>
          <li>
            <a href={contact.github} target='_blank' rel='noreferrer' className='transition-colors duration-200 hover:text-ink'>
              GitHub
            </a>
          </li>
          <li>
            <a href={contact.linkedin} target='_blank' rel='noreferrer' className='transition-colors duration-200 hover:text-ink'>
              LinkedIn
            </a>
          </li>
          <li>
            <a href={`mailto:${contact.email}`} className='transition-colors duration-200 hover:text-ink'>
              Email
            </a>
          </li>
        </ul>
      </div>
    </footer>
  )
}

export default Footer
