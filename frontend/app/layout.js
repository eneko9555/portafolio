import './globals.css'
import { Inter_Tight, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import Header from './components/Header'
import Footer from './components/Footer'
import Reveal from './components/Reveal'

const sans = Inter_Tight({ subsets: ['latin'], variable: '--font-sans' })
const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-serif', adjustFontFallback: false })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata = {
  metadataBase: new URL('https://enekof.dev'),
  title: {
    default: 'Eneko Fernández | Desarrollador full stack',
    template: '%s | Eneko Fernández'
  },
  description:
    'Eneko Fernández, desarrollador full stack en Butler Scientifics y cofundador de Askesis. Productos web construidos de principio a fin: Askesis, Chronia Timeline y OurMap.',
  openGraph: {
    title: 'Eneko Fernández | Desarrollador full stack',
    description: 'Desarrollador full stack y cofundador de Askesis. Productos web construidos de principio a fin.',
    type: 'website',
    locale: 'es_ES',
    images: [{ url: '/og/home.jpg', width: 1200, height: 630 }]
  }
}

export default function RootLayout ({ children }) {
  return (
    <html lang='es' className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <body className='min-h-screen font-sans antialiased'>
        <Header />
        <div id='contenido'>{children}</div>
        <Footer />
        <Reveal />
      </body>
    </html>
  )
}
