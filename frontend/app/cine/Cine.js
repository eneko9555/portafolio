'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import Scene from './Scene'
import People from './People'
import Player from './Player'
import CinemaScreen from './CinemaScreen'
import Hud from './Hud'
import { SPAWN, SALAS, salaById, salaPoint } from './world'
import { SLIDES } from './slides'
import { buildDialog } from './dialogs'
import { setSound, setAmbientLevel, sounds } from './audio'

const MOVE_KEYS = ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'shift']
const AMBIENT = { lobby: 0.16, corridor: 0.08 }

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
    frozen: true,
    motion: null
  })
  const [started, setStarted] = useState(false)
  const [view, setView] = useState({ room: 'lobby', target: null, seated: false, lightSala: 'askesis' })
  const [slides, setSlides] = useState(() => Object.fromEntries(SALAS.map((sala) => [sala.id, 0])))
  const [items, setItems] = useState({ popcorn: 0, drink: 0, ticket: false })
  const [dialog, setDialog] = useState(null)
  const [toast, setToast] = useState(null)
  const [sound, setSoundOn] = useState(false)

  const itemsRef = useRef(items)
  itemsRef.current = items
  const dialogRef = useRef(dialog)
  dialogRef.current = dialog

  const notify = useCallback((text) => setToast({ text, id: Date.now() }), [])
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 2800)
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
    setAmbientLevel(AMBIENT[g.room] ?? 0.03)
  }, [])

  // Diálogos
  const showPage = useCallback((pages, index, npc) => {
    const page = pages[index]
    if (page.changes) setItems((current) => ({ ...current, ...page.changes }))
    if (page.changes?.ticket) sounds.buy()
    sounds.talk()
    setDialog({ npc, pages, index })
  }, [])

  const closeDialog = useCallback(() => {
    game.current.frozen = false
    setDialog(null)
  }, [])

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
    } else if (g.target?.type === 'npc') {
      g.frozen = true
      g.keys.clear()
      showPage(buildDialog(g.target.npc, itemsRef.current), 0, g.target.npc)
      return
    } else {
      return
    }
    sync()
  }, [advance, showPage, sync])

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

  const start = useCallback((withSound) => {
    if (withSound) setSoundOn(setSound(true))
    game.current.frozen = false
    setStarted(true)
    sync()
  }, [sync])

  const toggleSound = useCallback(() => {
    setSoundOn((current) => {
      const next = setSound(!current)
      if (next) setAmbientLevel(AMBIENT[game.current.room] ?? 0.03)
      return next
    })
  }, [])

  useEffect(() => () => { setSound(false) }, [])

  useEffect(() => {
    const down = (e) => {
      if (e.target instanceof HTMLElement && ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return
      const key = e.key.toLowerCase()
      const g = game.current

      if (!started) {
        if (key === 'enter') start(false)
        return
      }
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
  }, [started, start, interact, advance, choose, closeDialog, consume, step])

  // Estado accesible desde la consola con ?debug, para pruebas
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has('debug')) return
    window.__cine = {
      game: game.current,
      get state () {
        const { x, z, room, seated, target } = game.current
        return { x, z, room, seated, target: target?.id ?? null, slides, items, dialog: dialog ? dialog.pages[dialog.index].text : null }
      }
    }
    return () => {
      delete window.__cine
    }
  }, [slides, items, dialog])

  const seatedSala = view.seated ? game.current.seat?.salaId : null

  return (
    <div className='fixed inset-0 z-50 select-none bg-bg'>
      <Canvas dpr={[1, 1.75]} camera={{ fov: 55, near: 0.1, far: 90, position: [SPAWN.x, 2.8, SPAWN.z + 3] }}>
        <Scene wallsRef={wallsRef} lightSala={view.lightSala} />
        {SALAS.map((sala) => (
          <CinemaScreen key={sala.id} sala={sala} slide={slides[sala.id]} active={view.room === sala.id} />
        ))}
        <People game={game} />
        <Player game={game} wallsRef={wallsRef} onChange={sync} popcorn={items.popcorn > 0} drink={items.drink > 0} />
      </Canvas>
      <Hud
        started={started}
        onStart={start}
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
