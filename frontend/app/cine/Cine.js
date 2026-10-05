'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import Scene from './Scene'
import People from './People'
import Player from './Player'
import CinemaScreen from './CinemaScreen'
import Hud from './Hud'
import { SPAWN, SALAS, STAFF, salaById, salaPoint } from './world'
import { SLIDES } from './slides'
import { buildDialog } from './dialogs'
import { setSound, sounds } from './audio'

const MOVE_KEYS = ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'shift']

// Sala cuya iluminación se enciende: la tuya o, desde el pasillo, la de la puerta más cercana
function salaToLight (room, x, z, previous) {
  if (salaById(room)) return room
  if (room !== 'corridor') return previous
  let best = previous
  let bestDistance = Infinity
  for (const sala of SALAS) {
    const door = salaPoint(sala, 0, 0)
    const distance = Math.hypot(door.x - x, door.z - z)
    if (distance < bestDistance) {
      best = sala.id
      bestDistance = distance
    }
  }
  return best
}

export default function Cine () {
  const wallsRef = useRef()
  const game = useRef({
    x: SPAWN.x,
    z: SPAWN.z,
    yaw: 0,
    pitch: 0.26,
    facing: Math.PI,
    keys: new Set(),
    stick: { x: 0, y: 0 },
    room: 'lobby',
    target: null,
    seated: false,
    seat: null,
    frozen: false,
    motion: null,
    ticket: false,
    talkingTo: null,
    halted: false,
    light: 1
  })
  const [view, setView] = useState({ room: 'lobby', target: null, seated: false, lightSala: 'askesis' })
  const [slides, setSlides] = useState(() => Object.fromEntries(SALAS.map((sala) => [sala.id, 0])))
  // seen son las salas ya selladas en la entrada; pass es el premio por completarla
  const [items, setItems] = useState({ popcorn: 0, drink: 0, ticket: false, pass: false, seen: [] })
  const [dialog, setDialog] = useState(null)
  const [toast, setToast] = useState(null)
  const [sound, setSoundOn] = useState(true)

  const itemsRef = useRef(items)
  itemsRef.current = items
  const dialogRef = useRef(dialog)
  dialogRef.current = dialog
  const slidesRef = useRef(slides)
  slidesRef.current = slides
  game.current.ticket = items.ticket
  const gateQuietUntil = useRef(0)

  const notify = useCallback((text) => setToast({ text, id: Date.now() }), [])
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), Math.max(2800, toast.text.length * 60))
    return () => clearTimeout(timer)
  }, [toast])

  const sync = useCallback(() => {
    const g = game.current
    setView((previous) => ({
      room: g.room,
      target: g.target ? { type: g.target.type, label: g.target.type === 'seat' ? 'Sentarse' : `Hablar con ${g.target.npc.name}` } : null,
      seated: g.seated,
      lightSala: salaToLight(g.room, g.x, g.z, previous.lightSala)
    }))
  }, [])

  // Diálogos
  const showPage = useCallback((pages, index, npc) => {
    const page = pages[index]
    if (page.changes) setItems((current) => ({ ...current, ...page.changes }))
    if (page.changes?.ticket) sounds.buy()
    if (page.changes?.pass) sounds.fanfare()
    sounds.talk()
    setDialog({ npc, pages, index })
  }, [])

  const closeDialog = useCallback(() => {
    game.current.frozen = false
    game.current.talkingTo = null
    gateQuietUntil.current = performance.now() + 2500
    setDialog(null)
  }, [])

  const talkTo = useCallback((npc) => {
    const g = game.current
    g.frozen = true
    g.keys.clear()
    // Con quién hablas, para que se gire hacia ti; halted es el alto del vigilante a quien no lleva entrada
    g.talkingTo = npc.id
    g.halted = npc.guard && !itemsRef.current.ticket
    showPage(buildDialog(npc, itemsRef.current), 0, npc)
  }, [showPage])

  // El vigilante te para si intentas entrar al pasillo sin entrada
  const stopAtGate = useCallback(() => {
    if (dialogRef.current || performance.now() < gateQuietUntil.current) return
    sounds.deny()
    talkTo(STAFF.find((npc) => npc.id === 'acomodador'))
  }, [talkTo])

  const advance = useCallback(() => {
    const current = dialogRef.current
    if (!current || current.pages[current.index].choices) return
    if (current.index + 1 >= current.pages.length) return closeDialog()
    showPage(current.pages, current.index + 1, current.npc)
  }, [closeDialog, showPage])

  const choose = useCallback((choiceIndex) => {
    const current = dialogRef.current
    const choice = current?.pages[current.index].choices?.[choiceIndex]
    if (!choice) return
    const result = choice.select(itemsRef.current)
    if (Object.keys(result.changes).length) {
      setItems((previous) => ({ ...previous, ...result.changes }))
      sounds.buy()
    }
    const pages = [...current.pages.slice(0, current.index), ...result.pages, ...current.pages.slice(current.index + 1)]
    showPage(pages, current.index, current.npc)
  }, [showPage])

  // Sentarse, levantarse o hablar, según lo que haya delante
  const interact = useCallback(() => {
    const g = game.current
    if (dialogRef.current) return advance()
    if (g.seated) {
      g.seated = false
      g.seat = null
      sounds.sit()
    } else if (g.target?.type === 'seat') {
      g.seated = true
      g.seat = g.target.seat
      g.keys.clear()
      sounds.sit()
      sounds.lights()
      // Sentarse en una sala sella la entrada
      const sala = salaById(g.seat.salaId)
      if (!itemsRef.current.seen.includes(sala.id)) {
        const seen = [...itemsRef.current.seen, sala.id]
        setItems((current) => ({ ...current, ticket: true, seen }))
        sounds.stamp()
        notify(seen.length === SALAS.length
          ? 'Entrada completa: has visto las cinco salas. Habla con Mikel, el vigilante, y recoge tu premio.'
          : `Sala ${sala.number} sellada · ${seen.length} de ${SALAS.length}`)
      }
    } else if (g.target?.type === 'npc') {
      return talkTo(g.target.npc)
    } else {
      return
    }
    sync()
  }, [advance, talkTo, notify, sync])

  const step = useCallback((delta) => {
    const g = game.current
    if (!g.seat) return
    const salaId = g.seat.salaId
    sounds.slide()
    setSlides((current) => ({ ...current, [salaId]: (current[salaId] + delta + SLIDES[salaId].length) % SLIDES[salaId].length }))
  }, [])

  const consume = useCallback((kind) => {
    const left = itemsRef.current[kind]
    const isPopcorn = kind === 'popcorn'
    if (!left) return notify(isPopcorn ? 'No tienes palomitas. Las dan en la barra del vestíbulo.' : 'No tienes refresco. Lo sirven en la barra del vestíbulo.')
    setItems((current) => ({ ...current, [kind]: current[kind] - 1 }))
    if (game.current.motion) game.current.motion[isPopcorn ? 'eating' : 'drinking'] = performance.now() + 1100
    isPopcorn ? sounds.crunch() : sounds.sip()
    if (left === 1) notify(isPopcorn ? 'Te has acabado las palomitas.' : 'Te has terminado el refresco.')
  }, [notify])

  const toggleSound = useCallback(() => {
    setSoundOn((current) => {
      setSound(!current)
      return !current
    })
  }, [])

  // Los efectos van activados de entrada, pero el navegador solo deja sonar tras la primera pulsación
  const soundRef = useRef(sound)
  soundRef.current = sound
  useEffect(() => {
    const unlock = () => {
      if (soundRef.current) setSound(true)
    }
    window.addEventListener('pointerdown', unlock, { once: true })
    window.addEventListener('keydown', unlock, { once: true })
    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
      setSound(false)
    }
  }, [])

  useEffect(() => {
    const down = (e) => {
      if (e.target instanceof HTMLElement && ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return
      const key = e.key.toLowerCase()
      const g = game.current

      if (dialogRef.current) {
        if (key === 'escape') closeDialog()
        else if (['e', 'enter', ' '].includes(key) && !e.repeat) advance()
        else if (/^[1-9]$/.test(key)) choose(Number(key) - 1)
        e.preventDefault()
        return
      }
      if (key === 'e' && !e.repeat) return interact()
      if (key === '1' && !e.repeat) return consume('popcorn')
      if (key === '2' && !e.repeat) return consume('drink')
      if (g.seated) {
        if (key === 'escape') interact()
        if (key === 'arrowright') step(1)
        if (key === 'arrowleft') step(-1)
        if (key.startsWith('arrow')) e.preventDefault()
        return
      }
      if (MOVE_KEYS.includes(key)) {
        g.keys.add(key)
        if (key.startsWith('arrow')) e.preventDefault()
      }
    }
    const up = (e) => game.current.keys.delete(e.key.toLowerCase())
    const blur = () => game.current.keys.clear()

    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', blur)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', blur)
    }
  }, [interact, advance, choose, closeDialog, consume, step])

  // Estado accesible desde la consola con ?debug, para pruebas
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has('debug')) return
    window.__cine = {
      game: game.current,
      get state () {
        const { x, z, room, seated, target, light } = game.current
        const current = dialogRef.current
        return { x, z, room, seated, light, target: target?.id ?? null, slides: slidesRef.current, items: itemsRef.current, dialog: current ? current.pages[current.index].text : null }
      }
    }
    return () => {
      delete window.__cine
    }
  }, [])

  const seatedSala = view.seated ? game.current.seat?.salaId : null

  return (
    <div className='fixed inset-0 z-50 select-none bg-bg' onContextMenu={(e) => e.preventDefault()}>
      {/* touch-none: sin esto el navegador se queda el gesto para desplazar la página y corta el giro de cámara */}
      <Canvas className='touch-none' dpr={[1, 1.75]} camera={{ fov: 55, near: 0.1, far: 90, position: [SPAWN.x, 2.8, SPAWN.z + 3] }}>
        <Scene wallsRef={wallsRef} lightSala={view.lightSala} dim={view.seated} gateOpen={items.ticket} game={game} />
        {SALAS.map((sala) => (
          <CinemaScreen key={sala.id} sala={sala} slide={slides[sala.id]} active={view.room === sala.id} />
        ))}
        <People game={game} />
        <Player game={game} wallsRef={wallsRef} onChange={sync} onGate={stopAtGate} popcorn={items.popcorn > 0} drink={items.drink > 0} />
      </Canvas>
      <Hud
        room={view.room}
        target={view.target}
        seatedSala={seatedSala}
        slide={seatedSala ? slides[seatedSala] : 0}
        items={items}
        dialog={dialog}
        toast={toast}
        sound={sound}
        game={game}
        onInteract={interact}
        onStep={step}
        onAdvance={advance}
        onChoose={choose}
        onConsume={consume}
        onToggleSound={toggleSound}
      />
    </div>
  )
}
