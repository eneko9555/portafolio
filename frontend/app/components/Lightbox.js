'use client'
import Image from 'next/image'
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

const LightboxContext = createContext(null)

export function LightboxProvider ({ images, children }) {
  const dialogRef = useRef(null)
  const [index, setIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(
    (src) => {
      const found = images.findIndex((image) => image.src === src)
      setIndex(found === -1 ? 0 : found)
      setIsOpen(true)
      dialogRef.current?.showModal()
    },
    [images]
  )

  const step = useCallback(
    (delta) => setIndex((current) => (current + delta + images.length) % images.length),
    [images.length]
  )

  useEffect(() => {
    document.documentElement.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [isOpen])

  function handleKeyDown (e) {
    if (e.key === 'ArrowRight') step(1)
    if (e.key === 'ArrowLeft') step(-1)
  }

  const image = images[index]

  return (
    <LightboxContext.Provider value={open}>
      {children}
      <dialog
        ref={dialogRef}
        className='lightbox m-0 h-full max-h-none w-full max-w-none p-0'
        aria-label='Visor de capturas'
        onClose={() => setIsOpen(false)}
        onKeyDown={handleKeyDown}
      >
        {isOpen && image && (
          <div
            className='flex h-full w-full flex-col items-center justify-center gap-4 p-4 sm:p-10'
            onClick={(e) => e.target === e.currentTarget && dialogRef.current?.close()}
          >
            <Image
              key={image.src}
              src={image.src}
              width={image.width}
              height={image.height}
              alt={image.alt}
              sizes='(min-width: 1400px) 1400px, 100vw'
              loading='eager'
              style={{ width: `min(100%, calc(78vh * ${image.width / image.height}))`, aspectRatio: `${image.width} / ${image.height}` }}
              className='h-auto rounded-lg border border-line bg-surface'
            />
            <div className='flex w-full max-w-4xl items-center justify-between gap-4 text-sm'>
              <p className='text-muted'>
                <span className='font-mono text-xs text-ink'>
                  {String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
                </span>
                <span className='ml-3'>{image.alt}</span>
              </p>
              <div className='flex shrink-0 gap-2'>
                <button type='button' onClick={() => step(-1)} aria-label='Captura anterior' className='btn-ghost h-10 w-10 justify-center p-0'>
                  ←
                </button>
                <button type='button' onClick={() => step(1)} aria-label='Captura siguiente' className='btn-ghost h-10 w-10 justify-center p-0'>
                  →
                </button>
                <button type='button' onClick={() => dialogRef.current?.close()} aria-label='Cerrar visor' className='btn-primary h-10 justify-center px-4 py-0'>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </LightboxContext.Provider>
  )
}

// Captura que se amplía en el visor al pulsarla
export function Shot ({ image, sizes, priority = false, className = '' }) {
  const open = useContext(LightboxContext)

  return (
    <button
      type='button'
      onClick={() => open?.(image.src)}
      aria-label={`Ampliar captura: ${image.alt}`}
      className={`group relative block w-full cursor-zoom-in ${className}`}
    >
      <Image
        src={image.src}
        width={image.width}
        height={image.height}
        alt={image.alt}
        sizes={sizes}
        priority={priority}
        className='h-auto w-full transition duration-500 group-hover:brightness-110'
      />
    </button>
  )
}
