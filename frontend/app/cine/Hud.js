import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { roomName } from './world'
import { SLIDES, CONTACT } from './slides'

// dark es para las teclas dibujadas sobre un botón claro
const Key = ({ children, dark = false }) => (
  <kbd className={`rounded-md border px-1.5 py-0.5 font-mono text-[0.7rem] ${dark ? 'border-bg/30 bg-bg/10 text-bg' : 'border-line bg-white/[0.06] text-ink'}`}>
    {children}
  </kbd>
)

const panel = 'rounded-2xl border border-line bg-bg/80 backdrop-blur-md'

// Palanca táctil: solo aparece en pantallas sin ratón
function Joystick ({ game }) {
  const base = useRef()
  const [knob, setKnob] = useState({ x: 0, y: 0 })

  const update = (e) => {
    const box = base.current.getBoundingClientRect()
    const radius = box.width / 2
    let x = (e.clientX - box.left - radius) / radius
    let y = (e.clientY - box.top - radius) / radius
    const length = Math.hypot(x, y)
    if (length > 1) {
      x /= length
      y /= length
    }
    game.current.stick = { x, y: -y }
    setKnob({ x, y })
  }
  const release = () => {
    game.current.stick = { x: 0, y: 0 }
    setKnob({ x: 0, y: 0 })
  }

  return (
    <div
      ref={base}
      className='pointer-events-auto relative h-28 w-28 touch-none rounded-full border border-line bg-bg/60 backdrop-blur-md'
      onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); update(e) }}
      onPointerMove={(e) => e.currentTarget.hasPointerCapture(e.pointerId) && update(e)}
      onPointerUp={release}
      onPointerCancel={release}
    >
      <div
        className='absolute left-1/2 top-1/2 h-11 w-11 rounded-full bg-ink/80'
        style={{ transform: `translate(calc(-50% + ${knob.x * 34}px), calc(-50% + ${knob.y * 34}px))` }}
      />
    </div>
  )
}

function CopyEmail () {
  const [copied, setCopied] = useState(false)
  async function copy () {
    try {
      await navigator.clipboard.writeText(CONTACT.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }
  return (
    <button type='button' onClick={copy} className='btn-ghost'>
      {copied ? 'Email copiado' : 'Copiar email'}
    </button>
  )
}

// Interfaz sobre la escena: dónde estás, qué puedes hacer, con quién hablas y qué llevas encima
export default function Hud ({ room, target, seatedSala, slide, items, dialog, toast, sound, game, onInteract, onStep, onAdvance, onChoose, onConsume, onToggleSound }) {
  const [touch, setTouch] = useState(false)
  useEffect(() => {
    setTouch(window.matchMedia('(pointer: coarse)').matches)
  }, [])

  const page = dialog?.pages[dialog.index]
  const total = seatedSala ? SLIDES[seatedSala].length : 0

  return (
    <div className='pointer-events-none absolute inset-0 flex flex-col justify-between p-4 sm:p-6'>
      <div className='flex items-start justify-between gap-4'>
        <div className='pointer-events-auto flex flex-wrap gap-2'>
          <Link href='/' className='btn-ghost bg-bg/70 backdrop-blur-md'>
            <span aria-hidden='true'>←</span> Volver al portfolio
          </Link>
          <button type='button' onClick={onToggleSound} aria-pressed={sound} className='btn-ghost bg-bg/70 backdrop-blur-md'>
            Efectos: {sound ? 'sí' : 'no'}
          </button>
        </div>
        <p className='label rounded-full border border-line bg-bg/70 px-4 py-2.5 backdrop-blur-md' aria-live='polite'>
          {roomName(room)}
        </p>
      </div>

      <div className='flex flex-col items-center gap-3'>
        {toast && (
          <p key={toast.id} role='status' className={`${panel} rise px-5 py-3 text-sm`}>
            {toast.text}
          </p>
        )}

        {dialog && (
          <div className={`${panel} pointer-events-auto w-full max-w-2xl p-5`}>
            <p className='label'>
              <span className='text-ink'>{dialog.npc.name}</span> · {dialog.npc.role}
            </p>
            <p className='mt-3 text-lg leading-relaxed' aria-live='polite'>{page.text}</p>
            {page.choices
              ? (
                <div className='mt-4 flex flex-wrap gap-2'>
                  {page.choices.map((choice, i) => (
                    <button key={choice.label} type='button' onClick={() => onChoose(i)} className='btn-ghost'>
                      <Key>{i + 1}</Key> {choice.label}
                    </button>
                  ))}
                </div>
                )
              : (
                <div className='mt-4 flex items-center justify-between text-sm text-muted'>
                  <span>{dialog.index + 1} / {dialog.pages.length}</span>
                  <button type='button' onClick={onAdvance} className='btn-primary'>
                    <Key dark>E</Key> {dialog.index + 1 >= dialog.pages.length ? 'Cerrar' : 'Seguir'}
                  </button>
                </div>
                )}
          </div>
        )}

        {!dialog && seatedSala && (
          <div className={`${panel} pointer-events-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-3`}>
            <div className='flex items-center gap-2'>
              <button type='button' onClick={() => onStep(-1)} aria-label='Diapositiva anterior' className='btn-ghost h-10 w-10 justify-center p-0'>←</button>
              <span className='w-16 text-center font-mono text-xs text-muted'>
                {String(slide + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </span>
              <button type='button' onClick={() => onStep(1)} aria-label='Diapositiva siguiente' className='btn-ghost h-10 w-10 justify-center p-0'>→</button>
            </div>
            {seatedSala === 'contacto' && (
              <div className='flex flex-wrap gap-2'>
                <CopyEmail />
                <a href={CONTACT.linkedin} target='_blank' rel='noreferrer' className='btn-ghost'>LinkedIn ↗</a>
                <a href={CONTACT.github} target='_blank' rel='noreferrer' className='btn-ghost'>GitHub ↗</a>
              </div>
            )}
            <button type='button' onClick={onInteract} className='btn-primary'>
              <Key dark>E</Key> Levantarse
            </button>
          </div>
        )}

        {!dialog && !seatedSala && (
          <div className='flex w-full items-end justify-between gap-4'>
            {touch
              ? <Joystick game={game} />
              : (
                <ul className='hidden space-y-1.5 rounded-xl border border-line bg-bg/70 px-4 py-3 text-sm text-muted backdrop-blur-md md:block'>
                  <li><Key>W</Key> <Key>A</Key> <Key>S</Key> <Key>D</Key> moverse · <Key>Mayús</Key> correr</li>
                  <li>Girar la cámara: arrastra con el ratón o <Key>←</Key> <Key>→</Key></li>
                  <li><Key>E</Key> hablar y sentarse · <Key>1</Key> comer · <Key>2</Key> beber</li>
                </ul>
                )}
            {target && (
              <button type='button' onClick={onInteract} className='btn-primary pointer-events-auto mx-auto'>
                <Key dark>E</Key> {target.label}
              </button>
            )}
            <span className='hidden md:block' />
          </div>
        )}

        {/* Lo que llevas encima */}
        {(items.ticket || items.popcorn > 0 || items.drink > 0) && !dialog && (
          <div className='pointer-events-auto flex flex-wrap justify-center gap-2 text-sm'>
            {items.ticket && <span className='chip bg-bg/70 backdrop-blur-md'>Entrada</span>}
            {items.popcorn > 0 && (
              <button type='button' onClick={() => onConsume('popcorn')} className='chip bg-bg/70 text-ink backdrop-blur-md'>
                <Key>1</Key> Palomitas × {items.popcorn}
              </button>
            )}
            {items.drink > 0 && (
              <button type='button' onClick={() => onConsume('drink')} className='chip bg-bg/70 text-ink backdrop-blur-md'>
                <Key>2</Key> Refresco × {items.drink}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
