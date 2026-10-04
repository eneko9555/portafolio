import Link from 'next/link'
import { SLIDES, PROJECT_LINK } from './world'

const Key = ({ children }) => (
  <kbd className='rounded-md border border-line bg-white/[0.06] px-1.5 py-0.5 font-mono text-[0.7rem] text-ink'>{children}</kbd>
)

// Interfaz sobre la escena: dónde estás, qué puedes hacer y, sentado, la diapositiva actual
export default function Hud ({ roomName, canSit, seated, slide, onStep, onToggleSeat }) {
  const current = SLIDES[slide]

  return (
    <div className='pointer-events-none absolute inset-0 flex flex-col justify-between p-4 sm:p-6'>
      <div className='flex items-start justify-between gap-4'>
        <Link href='/' className='btn-ghost pointer-events-auto bg-bg/70 backdrop-blur-md'>
          <span aria-hidden='true'>←</span> Volver al portfolio
        </Link>
        <p className='label rounded-full border border-line bg-bg/70 px-4 py-2.5 backdrop-blur-md' aria-live='polite'>
          {roomName}
        </p>
      </div>

      {seated
        ? (
          <div className='pointer-events-auto mx-auto w-full max-w-3xl rounded-2xl border border-line bg-bg/80 p-5 backdrop-blur-md'>
            <div className='flex items-start justify-between gap-6'>
              <div className='min-w-0'>
                <p className='label'>
                  {String(slide + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
                </p>
                <h2 className='mt-2 text-xl font-semibold tracking-tight'>{current.title}</h2>
                <p className='mt-1 text-sm leading-relaxed text-muted'>{current.text}</p>
              </div>
              <div className='flex shrink-0 gap-2'>
                <button type='button' onClick={() => onStep(-1)} aria-label='Diapositiva anterior' className='btn-ghost h-10 w-10 justify-center p-0'>
                  ←
                </button>
                <button type='button' onClick={() => onStep(1)} aria-label='Diapositiva siguiente' className='btn-ghost h-10 w-10 justify-center p-0'>
                  →
                </button>
              </div>
            </div>
            <div className='mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 text-sm text-muted'>
              <p>
                <Key>←</Key> <Key>→</Key> pasar · <Key>E</Key> levantarse
              </p>
              <div className='flex gap-2'>
                <Link href={PROJECT_LINK} className='btn-ghost'>Ver caso completo</Link>
                <button type='button' onClick={onToggleSeat} className='btn-primary'>Levantarse</button>
              </div>
            </div>
          </div>
          )
        : (
          <div className='flex items-end justify-between gap-4'>
            <p className='hidden rounded-xl border border-line bg-bg/70 px-4 py-3 text-sm text-muted backdrop-blur-md sm:block'>
              <Key>W</Key> <Key>A</Key> <Key>S</Key> <Key>D</Key> moverse · <Key>←</Key> <Key>→</Key> o arrastrar para girar · <Key>Mayús</Key> correr
            </p>
            {canSit && (
              <button type='button' onClick={onToggleSeat} className='btn-primary pointer-events-auto mx-auto sm:mx-0'>
                <Key>E</Key> Sentarse
              </button>
            )}
          </div>
          )}
    </div>
  )
}
