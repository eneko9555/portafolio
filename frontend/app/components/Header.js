'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useState } from 'react'

const Header = () => {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)

  function handleDropbox() {
    setVisible(!visible)
  }

  return (
    <header
      className='w-full m-auto md:w-10/12  justify-center  items-center p-4  pt-10 sm:px-16 z-50'
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2 }}
      >
        <nav
          id='nav'
          className=' flex justify-between mb-10 lg:mb-0  md:flex md:justify-between  relative gap-6 sm:gap-10 items-center  '
        >
          <div className='text-center md:text-auto items-center duration-300'>
            <Link
              href='/'
              className='font-semibold font-serif rounded-lg  text-white text-5xl p-1  duration-300 hover:text-gray-400 '
            >
              EF.
            </Link>
          </div>

          <div
            className='block lg:hidden  hover:cursor-pointer '
            onClick={handleDropbox}
          >
            {!visible
              ? (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='white'
                  className='w-14 h-14 '
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
                  />
                </svg>
              )
              : (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='white'
                  className='w-14 h-14 '
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              )}
          </div>

          <div className=' hidden lg:flex   lg:flex-row justify-center mt-8 lg:mt-0 items-center gap-4 lg:gap-12 border-b-2 pb-4 lg:pb-0 lg:border-none'>
            <Link
              className={`${pathname === '/'
                ? '  text-white font-black'
                : 'text-gray-200 hover:text-gray-600'
                }  p-2 text-lg tracking-wide  duration-300`}
              href='/'
            >
              Inicio
            </Link>
            <Link
              className={`${pathname === '/projects'
                ? 'text-white font-black'
                : 'text-gray-200 hover:text-gray-600'
                }  p-2 text-lg tracking-wide  duration-300 order-1  `}
              href='/projects'
            >
              Proyectos
            </Link>
            <Link
              className={`${pathname === '/about'
                ? 'text-white font-black '
                : 'text-gray-200 hover:text-gray-600'
                }  p-2 text-lg tracking-wide duration-300`}
              href='/about'
            >
              Sobre mí
            </Link>
            <Link
              className={`${pathname === '/contact'
                ? 'text-white font-black '
                : 'text-gray-200 hover:text-gray-600'
                }    p-2 text-lg tracking-wide duration-300 order-2 `}
              href='/contact'
            >
              Contacto
            </Link>
          </div>
        </nav>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: '-120%' }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, type: 'spring' }}
          >
            <div className='flex flex-col   w-full rounded-lg  -mt-10 mb-5 lg:-mb-28  lg:hidden justify-center  items-center  lg:gap-12 border-b-2 pb-4 lg:pb-0 lg:border-none'>
              <Link
                className={`${pathname === '/'
                  ? 'text-white font-black'
                  : 'text-gray-200  hover:text-gray-600'
                  }  p-2 text-lg tracking-wide  duration-300`}
                href='/'
              >
                Inicio
              </Link>
              <Link
                className={`${pathname === '/projects'
                  ? 'text-white font-black'
                  : 'text-gray-200  hover:text-gray-600'
                  }  p-2 text-lg tracking-wide  duration-300 order-1  `}
                href='/projects'
              >
                Proyectos
              </Link>
              <Link
                className={`${pathname === '/about'
                  ? 'text-white font-black'
                  : 'text-gray-200  hover:text-gray-600'
                  }  p-2 text-lg tracking-wide  duration-300`}
                href='/about'
              >
                Sobre mí
              </Link>
              <Link
                className={`${pathname === '/contact'
                  ? 'text-white font-black'
                  : 'text-gray-200 hover:text-gray-600'
                  }    p-2 text-lg tracking-wide  duration-300 order-2 `}
                href='/contact'
              >
                Contacto
              </Link>
            </div>
          </motion.div>
        )}
      </motion.div>
    </header>
  )
}

export default Header
