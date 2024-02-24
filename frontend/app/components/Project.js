import { motion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import Modal from '../components/Modal'

const Project = ({ project, setVisible }) => {
  const { _id, name, description, images } = project
  const [hover, setHover] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const modalRef = useRef(null)

  useEffect(() => {
    isOpen ? setVisible(false) : ''
  }, [isOpen])

  const handleMouseEnter = () => {
    setHover(true)
  }

  const handleMouseLeave = () => {
    setHover(false)
  }

  return (
    <>
      <motion.div
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        initial={{ opacity: 0, y: 25, scale: 0.5 }}
        transition={{ duration: 1 }}
      >
        <div
          className='image w-full rounded-lg m-auto mt-5 relative overflow-hidden 
           border-white border-2 '
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <img
            className='p-img  w-full'
            src={`/images/${images[0]}.png`}
            alt={`Imagen del proyecto ${name}`}
          />
          <div
            className={`${hover
              ? 'block -mt-24 pb-4 sm:pb-5 sm:-mt-26 sm:-translate-y-2 2xl:-mt-32 '
              : 'opacity-0'
              } absolute p-3 w-full rounded-md duration-500
             bg-gradient-to-bl from-gray-800 to-black text-white`}
          >
            <div className='opacity-100 description'>
              <p className='font-bold text-md sm:text-2xl'>{name}</p>
              <p className='font-semibold text-sm hidden 2xl:block mt-2 '>
                {description}
              </p>
              <button
                className='font-semibold  text-white w-full mt-2 bg-gradient-to-bl from-cyan-950 to-zinc-600 p-2 text-sm sm:text-md rounded hover:text-gray-400 duration-300'
                onClick={() => {
                  setIsOpen(true)
                }}
              >
                Más información
              </button>
            </div>
          </div>
        </div>
        <Modal isOpen={isOpen} project={project} setIsOpen={setIsOpen} />
      </motion.div>
    </>
  )
}

export default Project
