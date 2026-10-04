import ContactForm from '../components/ContactForm'
import { contact } from '../data/projects'

export const metadata = {
  title: 'Contacto',
  description: 'Escríbeme para hablar de un proyecto o de una oportunidad.'
}

export default function ContactPage () {
  return (
    <main className='container-page grid gap-12 pb-24 pt-12 sm:pt-20 lg:grid-cols-12'>
      <div className='lg:col-span-5'>
        <p className='label rise'>Contacto</p>
        <h1 className='rise rise-2 mt-4 text-5xl font-semibold tracking-tight sm:text-6xl'>
          Hablemos<span className='font-serif font-normal italic text-muted'>.</span>
        </h1>
        <p className='rise rise-3 mt-6 text-lg text-muted'>
          Envíame un mensaje con este formulario o escríbeme directamente a{' '}
          <a href={`mailto:${contact.email}`} className='link text-ink'>{contact.email}</a>.
        </p>
        <ul className='mt-8 flex gap-6 text-sm'>
          <li>
            <a href={contact.github} target='_blank' rel='noreferrer' className='link'>
              GitHub <span aria-hidden='true'>↗</span>
            </a>
          </li>
          <li>
            <a href={contact.linkedin} target='_blank' rel='noreferrer' className='link'>
              LinkedIn <span aria-hidden='true'>↗</span>
            </a>
          </li>
        </ul>
      </div>
      <div className='lg:col-span-6 lg:col-start-7'>
        <ContactForm />
      </div>
    </main>
  )
}
