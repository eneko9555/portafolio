'use client'
import { useEffect, useRef, useState } from 'react'
import { SCREEN, salaPoint } from './world'
import { SLIDES } from './slides'
import { makeSlideTexture } from './textures'

// Pantalla de una sala. Solo la sala en la que estás carga las diapositivas a resolución completa;
// las demás muestran su portada en pequeño.
export default function CinemaScreen ({ sala, slide, active }) {
  const slides = SLIDES[sala.id]
  const cache = useRef(new Map())
  const [texture, setTexture] = useState(null)

  useEffect(() => {
    let cancelled = false
    const textures = cache.current
    const context = (index) => ({ accent: sala.accent, header: `Sala ${sala.number} · ${sala.title}`, index, total: slides.length })

    const load = (index, size) => {
      const key = `${index}-${size}`
      if (!textures.has(key)) textures.set(key, makeSlideTexture(slides[index], context(index), size))
      return textures.get(key)
    }

    if (active) {
      load(slide, 1920).then((result) => {
        if (!cancelled) setTexture(result)
      })
      load((slide + 1) % slides.length, 1920)
    } else {
      load(0, 960).then((result) => {
        if (!cancelled) setTexture(result)
      })
      // Al salir de la sala se liberan las diapositivas grandes
      textures.forEach((pending, key) => {
        if (key.endsWith('-1920')) {
          pending.then((result) => result.dispose())
          textures.delete(key)
        }
      })
    }

    return () => {
      cancelled = true
    }
  }, [active, slide, sala, slides])

  useEffect(() => {
    const textures = cache.current
    return () => {
      textures.forEach((pending) => pending.then((result) => result.dispose()))
      textures.clear()
    }
  }, [])

  const point = salaPoint(sala, SCREEN.u, 0)

  return (
    <group position={[point.x, SCREEN.y, point.z]} rotation={[0, -sala.side * Math.PI / 2, 0]}>
      <mesh position={[0, 0, -0.03]}>
        <planeGeometry args={[SCREEN.width + 0.4, SCREEN.height + 0.4]} />
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
