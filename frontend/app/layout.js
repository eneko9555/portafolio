'use client'
import './globals.css'
import Header from './components/Header'

import { useRef, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function RootLayout ({ children }) {
  const circleRef = useRef(null)
  const [title, setTitle] = useState()

  useEffect(() => {
    const handleMouseMove = (e) => {
      const circle = circleRef.current
      circle.style.setProperty('--top', `${e.pageY}px`)
      circle.style.setProperty('--left', `${e.pageX}px`)
    }
    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const path = usePathname()

  useEffect(() => {
    switch (path) {
      case '/':
        setTitle('Inicio | Eneko Fernández')
        break
      case '/projects':
        setTitle('Proyectos | Eneko Fernández')
        break
      case '/about':
        setTitle('Sobre mí | Eneko Fernández')
        break
      case '/contact':
        setTitle('Contacto | Eneko Fernández')
        break
    }
  })

  return (
    <html lang='es'>
      <head>
        <link rel='icon' href='/iconImages/fav.png' sizes='200x200' />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='true'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Alegreya+Sans&display=swap'
          rel='stylesheet'
        />

        <title>{title}</title>
      </head>

      {/* <body className="w-full m-auto bg-gradient-to-b min-h-screen from-cyan-950 to-zinc-600 ">   */}
      <body className='w-full m-auto bg-gradient-to-b min-h-screen bg-black/90 '>
        <div
          ref={circleRef}
          className='light top-[var(--top)] left-[var(--left)] '
        />
        <Header />
        {children}
      </body>
    </html>
  )
}
