'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import Scene from './Scene'
import Player from './Player'
import CinemaScreen from './CinemaScreen'
import Hud from './Hud'
import { SPAWN, SLIDES, ROOMS } from './world'

const MOVE_KEYS = ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'shift']

export default function Cine () {
  const wallsRef = useRef()
  const game = useRef({
    x: SPAWN.x,
    z: SPAWN.z,
    yaw: 0,
    pitch: 0.28,
    facing: Math.PI,
    keys: new Set(),
    room: 'lobby',
    nearSeat: null,
    seated: false,
    seat: null
  })
  const [view, setView] = useState({ room: 'lobby', canSit: false, seated: false })
  const [slide, setSlide] = useState(0)

  const sync = useCallback(() => {
    const g = game.current
    setView({ room: g.room, canSit: Boolean(g.nearSeat), seated: g.seated })
  }, [])

  const toggleSeat = useCallback(() => {
    const g = game.current
    if (g.seated) {
      g.seated = false
      g.seat = null
    } else if (g.nearSeat) {
      g.seated = true
      g.seat = g.nearSeat
      g.keys.clear()
    } else {
      return
    }
    sync()
  }, [sync])

  const step = useCallback((delta) => setSlide((current) => (current + delta + SLIDES.length) % SLIDES.length), [])

  useEffect(() => {
    const down = (e) => {
      const key = e.key.toLowerCase()
      const g = game.current
      if (key === 'e' && !e.repeat) return toggleSeat()
      if (key === 'escape' && g.seated) return toggleSeat()
      if (g.seated) {
        if (key === 'arrowright') step(1)
        if (key === 'arrowleft') step(-1)
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
  }, [toggleSeat, step])

  // Estado accesible desde la consola con ?debug, para pruebas
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has('debug')) return
    window.__cine = {
      game: game.current,
      get state () {
        const { x, z, room, seated } = game.current
        return { x, z, room, seated, slide }
      }
    }
    return () => {
      delete window.__cine
    }
  }, [slide])

  return (
    <div className='fixed inset-0 z-50 bg-bg'>
      <Canvas dpr={[1, 1.75]} camera={{ fov: 55, near: 0.1, far: 80, position: [SPAWN.x, 2.7, SPAWN.z + 4.2] }}>
        <Scene wallsRef={wallsRef} />
        <CinemaScreen slide={slide} />
        <Player game={game} wallsRef={wallsRef} onChange={sync} />
      </Canvas>
      <Hud
        roomName={ROOMS[view.room].name}
        canSit={view.canSit}
        seated={view.seated}
        slide={slide}
        onStep={step}
        onToggleSeat={toggleSeat}
      />
    </div>
  )
}
