'use client'
import { useEffect, useRef, useState } from 'react'
import { SCREEN, SLIDES } from './world'
import { makeSlideTexture } from './textures'

// Pantalla de la sala: muestra la diapositiva actual y deja preparada la siguiente
export default function CinemaScreen ({ slide }) {
  const cache = useRef(new Map())
  const [texture, setTexture] = useState(null)

  useEffect(() => {
    let cancelled = false
    const textures = cache.current

    const load = (index) => {
      if (!textures.has(index)) textures.set(index, makeSlideTexture(SLIDES[index]))
      return textures.get(index)
    }

    load(slide).then((result) => {
      if (!cancelled) setTexture(result)
    })
    load((slide + 1) % SLIDES.length)

    return () => {
      cancelled = true
    }
  }, [slide])

  useEffect(() => {
    const textures = cache.current
    return () => {
      textures.forEach((pending) => pending.then((result) => result.dispose()))
      textures.clear()
    }
  }, [])

  return (
    <group position={[SCREEN.x, SCREEN.y, SCREEN.z]} rotation={[0, -Math.PI / 2, 0]}>
      <mesh position={[0, 0, -0.03]}>
        <planeGeometry args={[SCREEN.width + 0.5, SCREEN.height + 0.5]} />
        <meshBasicMaterial color='#000000' />
      </mesh>
      <mesh>
        <planeGeometry args={[SCREEN.width, SCREEN.height]} />
        {/* La clave recrea el material al cambiar de textura; si no, three no recompila el sombreador */}
        <meshBasicMaterial key={texture?.uuid ?? 'vacío'} map={texture} color={texture ? '#ffffff' : '#0b0b0d'} toneMapped={false} />
      </mesh>
    </group>
  )
}
