'use client'
import Link from 'next/link'
import { useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Home() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [])

  return (
    <>
      <main className='main max-h-screen mt-2  p-4 w-full sm:mt-12   lg:mt-[7rem] sm:w-3/4 md:w-8/12 lg:w-4/6 m-auto '>
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h1 className='font-black  text-gray-100 bg-transparent text-4xl md:text-5xl lg:text-6xl  '>
            <p className='text-xl sm:text-2xl mb-2 tracking-wider'>
              {' '}
              Hola, mi nombre es
            </p>
            <span className='text-4xl sm:text-5xl tracking-widest'>
              Eneko Fernández
            </span>
          </h1>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: .4 }}
        >
          <p className=' flex items-center gap-1 mb-2 text-gray-100 mt-5 sm:mt-8 leading-8 text-md sm:text-lg '>
            Bienvenido a mi portafolio.
          </p>
          <p className='text-gray-100  leading-8 text-md sm:text-lg '>
            {' '}
            Soy desarrollador web full stack en continuo aprendizaje,
            actualmente centrado en el MERN stack.
          </p>
          <p className='text-gray-100  leading-8 text-md sm:text-lg mb-5'>
            Mi objetivo es aplicar soluciones sencillas y escalables durante el
            desarrollo de mis{' '}
            <Link
              href='/projects'
              className='font-black uppercase hover:text-gray-400 duration-300'
            >
              proyectos.
            </Link>
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: .8 }}
        >
          <div className='flex items-center mt-8 sm:mt-8 gap-3 text-gray-100'>
            <Link
              href='/about'
              className='text-gray-100 text-lg font-semibold hover:text-gray-400 duration-300'
            >
              Sobre mí
            </Link>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='w-10 h-10 animate-bounce animate-infinite animate-duration-1000 animate-ease-linear'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3'
              />
            </svg>
          </div>

          <div className='sm:flex justify-between items-center mt-10 mb-10 gap-2 pt-5 border-t-2'>
            <div className='flex gap-3'>
              <div className='bg-white p-1 rounded-lg shadow-sm border-b-4 border-gray-400 hover:border-none duration-100'>
                <Link target='_blank' href='https://github.com/eneko9555' rel='noreferrer'>
                  {' '}
                  <img
                    src='/images/github-white.png'
                    className='w-6'
                    alt='logo'
                  />
                </Link>
              </div>
              <div className='bg-white p-1 rounded-lg shadow-sm border-b-4 border-gray-400 hover:border-none duration-100 '>
                <Link
                  target='_blank'
                  href='/'
                  className='pointer-events-none' rel='noreferrer'
                >
                  {' '}
                  <img
                    src='/images/linkedin.png'
                    className='w-6 rounded-md '
                    alt='logo'
                  />
                </Link>
              </div>
              <div className='bg-white p-1 rounded-lg shadow-sm border-b-4 border-gray-400 hover:border-none duration-100 '>
                <Link
                  target='_blank'
                  href='mailto:eneko.fdez.garcia@gmail.com'
                  className='' rel='noreferrer'
                >
                  {' '}
                  <img
                    src='/images/gmail.png'
                    className='w-6 rounded-md '
                    alt='logo'
                  />
                </Link>
              </div>
            </div>

            <div className='block mt-5 sm:mt-0 items-center '>
              <p className=' text-sm text-white'>
                Desarrollado con Next, Node y Tailwind
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </>
  )
}
