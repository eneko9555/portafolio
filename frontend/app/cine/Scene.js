'use client'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { flat } from './Person'
import { featuredProjects } from '../data/projects'
import {
  LOBBY, CORRIDOR, SALA, SALAS, SCREEN, HALF, WALL, SEATS, GATE_Z,
  TICKET_DESK, POPCORN_BAR, COLUMNS, BENCHES, PLANTS, salaPoint, salaById
} from './world'
import { makePosterTexture, makeSignTexture, makeBoardTexture, makeCarpetTexture, makeStripesTexture, makeCurtainTexture } from './textures'

const wallX = (x, z0, z1, y0, y1) => ({ position: [x, (y0 + y1) / 2, (z0 + z1) / 2], size: [WALL, y1 - y0, Math.abs(z1 - z0)] })
const wallZ = (z, x0, x1, y0, y1) => ({ position: [(x0 + x1) / 2, (y0 + y1) / 2, z], size: [Math.abs(x1 - x0), y1 - y0, WALL] })

function corridorSide (side) {
  const doors = SALAS.filter((sala) => sala.side === side).sort((a, b) => b.zc - a.zc)
  const walls = []
  let from = 0
  for (const sala of doors) {
    walls.push(wallX(side * HALF, sala.zc + SALA.doorHalf, from, 0, SALA.height))
    walls.push(wallX(side * HALF, sala.zc - SALA.doorHalf, sala.zc + SALA.doorHalf, SALA.doorHeight, SALA.height))
    from = sala.zc - SALA.doorHalf
  }
  walls.push(wallX(side * HALF, CORRIDOR.z[0], from, 0, SALA.height))
  return walls
}

const WALLS = [
  wallZ(LOBBY.z[1], LOBBY.x[0], LOBBY.x[1], 0, LOBBY.height),
  wallX(LOBBY.x[0], LOBBY.z[0], LOBBY.z[1], 0, LOBBY.height),
  wallX(LOBBY.x[1], LOBBY.z[0], LOBBY.z[1], 0, LOBBY.height),
  wallZ(0, LOBBY.x[0], -HALF, 0, LOBBY.height),
  wallZ(0, HALF, LOBBY.x[1], 0, LOBBY.height),
  wallZ(0, -HALF, HALF, CORRIDOR.height, LOBBY.height),
  wallZ(CORRIDOR.z[0], -HALF, HALF, 0, CORRIDOR.height),
  ...corridorSide(1),
  ...corridorSide(-1),
  ...SALAS.flatMap((sala) => {
    const near = sala.side * HALF
    const far = sala.side * (HALF + SALA.length)
    return [
      wallX(far, sala.zc - SALA.half, sala.zc + SALA.half, 0, SALA.height),
      wallZ(sala.zc - SALA.half, near, far, 0, SALA.height),
      wallZ(sala.zc + SALA.half, near, far, 0, SALA.height)
    ]
  })
]

const rect = (x0, x1, z0, z1) => ({ center: [(x0 + x1) / 2, (z0 + z1) / 2], size: [Math.abs(x1 - x0), Math.abs(z1 - z0)] })
const LOBBY_RECT = rect(LOBBY.x[0], LOBBY.x[1], LOBBY.z[0], LOBBY.z[1])
const CORRIDOR_RECT = rect(-HALF, HALF, CORRIDOR.z[0], 0)
const salaRect = (sala) => rect(sala.side * HALF, sala.side * (HALF + SALA.length), sala.zc - SALA.half, sala.zc + SALA.half)

function useTexture (factory) {
  const [texture, setTexture] = useState(null)
  useEffect(() => {
    let cancelled = false
    Promise.resolve(factory()).then((result) => {
      if (cancelled) result.dispose()
      else setTexture(result)
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => () => texture?.dispose(), [texture])
  return texture
}

// Plano con una textura dibujada: carteles, rótulos y tablones
function Panel ({ factory, position, rotationY = 0, size, lit = true }) {
  const texture = useTexture(factory)
  return (
    <mesh position={position} rotation={[0, rotationY, 0]}>
      <planeGeometry args={size} />
      {lit
        ? <meshBasicMaterial key={texture?.uuid ?? 'vacío'} map={texture} color={texture ? '#ffffff' : '#15151a'} toneMapped={false} />
        : <meshLambertMaterial key={texture?.uuid ?? 'vacío'} map={texture} color={texture ? '#ffffff' : '#15151a'} />}
    </mesh>
  )
}

const Neon = ({ position, size, color }) => (
  <mesh position={position}>
    <boxGeometry args={size} />
    <meshBasicMaterial color={color} toneMapped={false} />
  </mesh>
)

const Box = ({ position, size, color, rotationY = 0 }) => (
  <mesh position={position} rotation={[0, rotationY, 0]} material={flat(color)}>
    <boxGeometry args={size} />
  </mesh>
)

function Floor ({ area, y = 0, color, texture, ceiling = false }) {
  return (
    <mesh rotation={[ceiling ? Math.PI / 2 : -Math.PI / 2, 0, 0]} position={[area.center[0], y, area.center[1]]}>
      <planeGeometry args={area.size} />
      <meshLambertMaterial key={texture?.uuid ?? 'liso'} color={texture ? '#ffffff' : color} map={texture ?? null} />
    </mesh>
  )
}

function Seats () {
  const base = useRef()
  const back = useRef()
  const arm = useRef()

  useLayoutEffect(() => {
    const matrix = new THREE.Matrix4()
    SEATS.forEach((seat, i) => {
      matrix.setPosition(seat.x, 0.23, seat.z)
      base.current.setMatrixAt(i, matrix)
      matrix.setPosition(seat.x - seat.side * 0.3, 0.6, seat.z)
      back.current.setMatrixAt(i, matrix)
      matrix.setPosition(seat.x, 0.5, seat.z + 0.345)
      arm.current.setMatrixAt(i, matrix)
    })
    for (const mesh of [base.current, back.current, arm.current]) mesh.instanceMatrix.needsUpdate = true
  }, [])

  return (
    <>
      <instancedMesh ref={base} args={[null, null, SEATS.length]} material={flat('#7a1f33')}>
        <boxGeometry args={[0.6, 0.46, 0.62]} />
      </instancedMesh>
      <instancedMesh ref={back} args={[null, null, SEATS.length]} material={flat('#8c2439')}>
        <boxGeometry args={[0.14, 1.2, 0.62]} />
      </instancedMesh>
      <instancedMesh ref={arm} args={[null, null, SEATS.length]} material={flat('#1c1c21')}>
        <boxGeometry args={[0.56, 0.1, 0.07]} />
      </instancedMesh>
    </>
  )
}

function PopcornMachine ({ z }) {
  const x = 9.7
  return (
    <group position={[x, 1.16, z]}>
      <Box position={[0, 0.08, 0]} size={[0.8, 0.16, 0.8]} color='#c0283a' />
      <mesh position={[0, 0.52, 0]}>
        <boxGeometry args={[0.74, 0.72, 0.74]} />
        <meshLambertMaterial color='#cfe6ff' transparent opacity={0.2} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.3, 0]} scale={[1, 0.55, 1]}>
        <sphereGeometry args={[0.33, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshBasicMaterial color='#f6dc7a' toneMapped={false} />
      </mesh>
      <Box position={[0, 0.95, 0]} size={[0.84, 0.16, 0.84]} color='#c0283a' />
      <Neon position={[-0.38, 0.95, 0]} size={[0.02, 0.08, 0.6]} color='#ffd98a' />
    </group>
  )
}

function Lobby () {
  const carpet = useMemo(() => makeCarpetTexture([13, 10]), [])
  const stripes = useMemo(() => makeStripesTexture([14, 1]), [])
  useEffect(() => () => { carpet.dispose(); stripes.dispose() }, [carpet, stripes])

  const posters = [
    ...SALAS.slice(0, 3).map((sala, i) => ({ x: -10.6 + i * 2.8, number: sala.number, title: sala.title, accent: sala.accent, image: featuredProjects[i].cover })),
    { x: 5, number: 4, title: 'Sobre mí', accent: salaById('sobre-mi').accent, glyph: 'ef' },
    { x: 7.8, number: 5, title: 'Contacto', accent: salaById('contacto').accent, glyph: '@' }
  ]
  const north = WALL / 2 + 0.03

  return (
    <>
      <Floor area={LOBBY_RECT} texture={carpet} />

      {/* Columnas con anillo de neón */}
      {COLUMNS.map(([x, z]) => (
        <group key={`${x}-${z}`}>
          <Box position={[x, LOBBY.height / 2, z]} size={[0.7, LOBBY.height, 0.7]} color='#26222a' />
          <Neon position={[x, 2.6, z]} size={[0.74, 0.05, 0.74]} color='#e0457f' />
          <Box position={[x, 0.2, z]} size={[0.84, 0.4, 0.84]} color='#16141a' />
        </group>
      ))}

      {/* Luces del techo */}
      {[-9, -3, 3, 9].flatMap((x) => [3.5, 10, 16.5].map((z) => (
        <mesh key={`${x}-${z}`} position={[x, LOBBY.height - 0.02, z]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.55, 24]} />
          <meshBasicMaterial color='#ffe6c4' toneMapped={false} />
        </mesh>
      )))}
      <Neon position={[0, LOBBY.height - 0.25, 0.14]} size={[25.8, 0.06, 0.06]} color='#e0457f' />
      <Neon position={[-12.86, LOBBY.height - 0.25, 10]} size={[0.06, 0.06, 19.8]} color='#5b86ff' />
      <Neon position={[12.86, LOBBY.height - 0.25, 10]} size={[0.06, 0.06, 19.8]} color='#5b86ff' />

      {/* Cartelera */}
      <Panel factory={() => makeSignTexture({ title: 'Cartelera', accent: '#ffd98a' })} position={[-7.8, 4.75, north]} size={[4, 1]} />
      <Panel factory={() => makeSignTexture({ title: 'Cartelera', accent: '#ffd98a' })} position={[7.8, 4.75, north]} size={[4, 1]} />
      {posters.map((poster) => (
        <group key={poster.number}>
          <Box position={[poster.x, 2.3, north - 0.01]} size={[2.06, 2.92, 0.06]} color='#0b0b0d' />
          <Panel factory={() => makePosterTexture(poster)} position={[poster.x, 2.3, north + 0.03]} size={[1.9, 2.74]} />
          <Neon position={[poster.x, 3.86, north + 0.05]} size={[1.9, 0.04, 0.04]} color={poster.accent} />
        </group>
      ))}
      <Panel factory={() => makeSignTexture({ title: 'Salas 1 — 5', accent: '#f2f2f0' })} position={[0, 4.8, north]} size={[4.4, 1.1]} />
      <Neon position={[0, CORRIDOR.height + 0.06, north]} size={[HALF * 2, 0.06, 0.06]} color='#e0457f' />

      {/* Taquilla */}
      <Box position={[-9.7, 0.55, 8]} size={[1, 1.1, 6]} color='#2a2026' />
      <Box position={[-9.7, 1.13, 8]} size={[1.12, 0.06, 6.1]} color='#3a2c33' />
      <Neon position={[TICKET_DESK.x[1] + 0.02, 0.2, 8]} size={[0.03, 0.05, 5.8]} color='#e0457f' />
      <Panel factory={() => makeSignTexture({ title: 'Taquilla', accent: '#e0457f' })} position={[-12.86, 4.7, 8]} rotationY={Math.PI / 2} size={[4, 1]} />
      <Panel
        factory={() => makeBoardTexture({ title: 'Sesiones de hoy', accent: '#e0457f', rows: SALAS.map((sala) => [sala.title, `Sala ${sala.number}`]) })}
        position={[-12.86, 2.6, 8]}
        rotationY={Math.PI / 2}
        size={[3.6, 2.4]}
      />

      {/* Barra de palomitas */}
      <Box position={[9.7, 0.55, 9]} size={[1, 1.1, 7]} color='#f4efe6' />
      <mesh position={[POPCORN_BAR.x[0] - 0.01, 0.55, 9]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[7, 1.1]} />
        <meshLambertMaterial map={stripes} />
      </mesh>
      <Box position={[9.7, 1.13, 9]} size={[1.14, 0.06, 7.1]} color='#2a2026' />
      <PopcornMachine z={6.4} />
      <PopcornMachine z={11.9} />
      <Box position={[9.75, 1.5, 10.6]} size={[0.5, 0.7, 0.9]} color='#22222a' />
      {['#d43a4c', '#f0a43a', '#3f6fd8'].map((color, i) => (
        <Neon key={color} position={[9.49, 1.62, 10.3 + i * 0.3]} size={[0.02, 0.22, 0.18]} color={color} />
      ))}
      <Box position={[12.5, 1, 9]} size={[0.7, 2, 7.4]} color='#1d1a20' />
      <Panel factory={() => makeSignTexture({ title: 'Palomitas', accent: '#ffd98a' })} position={[12.86, 4.85, 9]} rotationY={-Math.PI / 2} size={[4.4, 1.1]} />
      <Panel
        factory={() => makeBoardTexture({ title: 'Para picar', accent: '#ffd98a', rows: [['Palomitas', 'invita la casa'], ['Refresco', 'invita la casa'], ['Nachos', 'se han acabado'], ['Entrada', 'gratis']] })}
        position={[12.86, 3.2, 7.2]}
        rotationY={-Math.PI / 2}
        size={[3, 2]}
      />
      <Panel
        factory={() => makeBoardTexture({ title: 'Ingredientes', accent: '#ffd98a', rows: [['Frontend', 'React · Next.js'], ['Backend', 'Node.js · C#'], ['Datos', 'MongoDB · SQL'], ['Nube', 'AWS · Cloudflare']] })}
        position={[12.86, 3.2, 10.8]}
        rotationY={-Math.PI / 2}
        size={[3, 2]}
      />

      {/* Bancos y plantas */}
      {BENCHES.map(([x, z]) => (
        <group key={x}>
          <Box position={[x, 0.36, z]} size={[2.4, 0.2, 0.7]} color='#8c2439' />
          <Box position={[x, 0.13, z]} size={[2.2, 0.26, 0.5]} color='#1a181d' />
        </group>
      ))}
      {PLANTS.map(([x, z]) => (
        <group key={`${x}-${z}`} position={[x, 0, z]}>
          <mesh position={[0, 0.3, 0]} material={flat('#3a3036')}>
            <cylinderGeometry args={[0.3, 0.22, 0.6, 14]} />
          </mesh>
          <mesh position={[0, 1.05, 0]} scale={[1, 1.5, 1]} material={flat('#2f7d55')}>
            <sphereGeometry args={[0.42, 12, 10]} />
          </mesh>
          <mesh position={[0.18, 1.5, 0.1]} material={flat('#3a9367')}>
            <sphereGeometry args={[0.28, 10, 8]} />
          </mesh>
        </group>
      ))}

      {/* Entrada desde la calle */}
      <Panel factory={() => makeSignTexture({ title: 'cine ef', accent: '#f2f2f0', italic: true })} position={[0, 4.6, LOBBY.z[1] - north]} rotationY={Math.PI} size={[5.2, 1.3]} />
      {[-1.05, 1.05].map((x) => (
        <mesh key={x} position={[x, 1.5, LOBBY.z[1] - north]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[2, 3]} />
          <meshBasicMaterial color='#273447' toneMapped={false} />
        </mesh>
      ))}
      <Box position={[0, 3.08, LOBBY.z[1] - 0.14]} size={[4.4, 0.16, 0.1]} color='#b8894a' />
    </>
  )
}

function Corridor () {
  const carpet = useMemo(() => makeCarpetTexture([2, 20], '#1c1016', '#2e1722', '#8a6a3c'), [])
  useEffect(() => () => carpet.dispose(), [carpet])

  const sconces = []
  for (let z = -2.8; z > CORRIDOR.z[0] + 1; z -= 4.3) {
    for (const side of [1, -1]) {
      const nearDoor = SALAS.some((sala) => sala.side === side && Math.abs(z - sala.zc) < 4.2)
      if (!nearDoor) sconces.push([side * (HALF - 0.13), z])
    }
  }

  return (
    <>
      <Floor area={CORRIDOR_RECT} color='#141216' />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, CORRIDOR.z[0] / 2]}>
        <planeGeometry args={[2.4, -CORRIDOR.z[0]]} />
        <meshLambertMaterial map={carpet} />
      </mesh>
      {[1, -1].map((side) => (
        <Neon key={side} position={[side * (HALF - 0.12), 0.08, CORRIDOR.z[0] / 2]} size={[0.03, 0.04, -CORRIDOR.z[0]]} color='#e0457f' />
      ))}
      {sconces.map(([x, z]) => (
        <Neon key={`${x}-${z}`} position={[x, 2.2, z]} size={[0.05, 0.5, 0.16]} color='#ffd9a8' />
      ))}

      {SALAS.map((sala, i) => {
        const x = sala.side * (HALF - WALL / 2 - 0.03)
        const turn = -sala.side * Math.PI / 2
        const project = featuredProjects[i]
        return (
          <group key={sala.id}>
            {/* Marco de la puerta y rótulo de la sala */}
            <Box position={[sala.side * HALF, SALA.doorHeight + 0.06, sala.zc]} size={[0.3, 0.12, SALA.doorHalf * 2 + 0.3]} color='#b8894a' />
            {[-1, 1].map((edge) => (
              <Box key={edge} position={[sala.side * HALF, SALA.doorHeight / 2, sala.zc + edge * (SALA.doorHalf + 0.07)]} size={[0.3, SALA.doorHeight, 0.14]} color='#b8894a' />
            ))}
            <Panel
              factory={() => makeSignTexture({ title: `Sala ${sala.number}`, subtitle: sala.title, accent: sala.accent })}
              position={[x, 3.14, sala.zc]}
              rotationY={turn}
              size={[2.6, 0.65]}
            />
            <Panel
              factory={() => makePosterTexture({ number: sala.number, title: sala.title, accent: sala.accent, image: project?.cover, glyph: sala.id === 'contacto' ? '@' : 'ef' })}
              position={[x, 1.75, sala.zc + 2.7]}
              rotationY={turn}
              size={[1.2, 1.73]}
            />
          </group>
        )
      })}

      <Panel factory={() => makeSignTexture({ title: 'ef', accent: '#e0457f', italic: true })} position={[0, 2.1, CORRIDOR.z[0] + WALL / 2 + 0.03]} size={[3.2, 0.8]} />
    </>
  )
}

function Sala ({ sala }) {
  const curtain = useMemo(() => makeCurtainTexture([6, 1]), [])
  useEffect(() => () => curtain.dispose(), [curtain])

  const at = (u, v, y) => {
    const point = salaPoint(sala, u, v)
    return [point.x, y, point.z]
  }
  const faceSeats = -sala.side * Math.PI / 2
  const steps = []
  for (let u = 1.2; u < 13.5; u += 1.3) steps.push(u)

  return (
    <>
      <Floor area={salaRect(sala)} color='#101014' />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={at(7, 0, 0.006)}>
        <planeGeometry args={[13.6, 2.6]} />
        <meshLambertMaterial color='#3a1426' />
      </mesh>

      {/* Luces de paso del pasillo central */}
      {steps.flatMap((u) => [-1.42, 1.42].map((v) => (
        <Neon key={`${u}-${v}`} position={at(u, v, 0.03)} size={[0.16, 0.03, 0.05]} color={sala.accent} />
      )))}

      {/* Cortinas a los lados de la pantalla y bambalina */}
      {[-1, 1].map((edge) => (
        <mesh key={edge} position={at(SCREEN.u - 0.05, edge * 5.13, 3.3)} rotation={[0, faceSeats, 0]}>
          <planeGeometry args={[1.7, 6.3]} />
          <meshLambertMaterial map={curtain} />
        </mesh>
      ))}
      <Box position={at(SCREEN.u - 0.25, 0, 6.2)} size={[0.5, 0.6, 11.8]} color='#5a1525' />

      {/* Apliques de pared y salida */}
      {[3, 7, 11].flatMap((u) => [-1, 1].map((edge) => (
        <Neon key={`${u}-${edge}`} position={at(u, edge * (SALA.half - 0.13), 2.6)} size={[0.3, 0.12, 0.05]} color='#6b5540' />
      )))}
      <Panel
        factory={() => makeSignTexture({ title: 'Salida', accent: '#59d98e' })}
        position={at(WALL / 2 + 0.03, 0, 3.1)}
        rotationY={sala.side * Math.PI / 2}
        size={[1.4, 0.35]}
      />
    </>
  )
}

// Control de entradas en la boca del pasillo: dos postes y una línea en el suelo, roja hasta que tienes entrada
function Gate ({ open }) {
  const color = open ? '#59d98e' : '#ff4d5e'
  return (
    <>
      <Neon position={[0, 0.02, GATE_Z]} size={[HALF * 2 - 0.3, 0.03, 0.09]} color={color} />
      {[-1, 1].map((side) => (
        <group key={side} position={[side * (HALF - 0.12), 0, GATE_Z]}>
          <Box position={[0, 0.55, 0]} size={[0.12, 1.1, 0.12]} color='#b8894a' />
          <Neon position={[0, 1.16, 0]} size={[0.14, 0.12, 0.14]} color={color} />
        </group>
      ))}
    </>
  )
}

const HOUSE_LIGHTS = [
  { position: [-6, 5.2, 5.5], intensity: 75, distance: 20, color: '#ffd9b8' },
  { position: [6, 5.2, 5.5], intensity: 75, distance: 20, color: '#ffd9b8' },
  { position: [-6, 5.2, 14.5], intensity: 75, distance: 20, color: '#ffd9b8' },
  { position: [6, 5.2, 14.5], intensity: 75, distance: 20, color: '#ffd9b8' },
  { position: [8.4, 3.2, 9], intensity: 45, distance: 11, color: '#ffcf7a' },
  { position: [-8.4, 3.2, 8], intensity: 35, distance: 11, color: '#ff8fb8' },
  { position: [0, 3, -9], intensity: 55, distance: 24, color: '#ffd9b8' },
  { position: [0, 3, -29], intensity: 55, distance: 24, color: '#ffd9b8' }
]
const SKY_LIGHT = 1.25
const AMBIENT_LIGHT = 0.25
const SALA_LIGHT = 16
const SCREEN_LIGHT = 60
const DARK = 0.1

// Geometría fija del cine. wallsRef agrupa lo que frena a la cámara; lightSala es la sala que se ilumina;
// dim apaga las luces de sala mientras estás sentado y gateOpen indica si ya tienes entrada.
export default function Scene ({ wallsRef, lightSala, dim, gateOpen, game }) {
  const wallMaterial = flat('#2c242b')
  const ceilingMaterial = flat('#0d0d10')
  const sala = salaById(lightSala) ?? SALAS[0]
  const near = salaPoint(sala, 5.5, 0)
  const front = salaPoint(sala, 12.6, 0)

  const sky = useRef()
  const ambient = useRef()
  const house = useRef()
  const salaLight = useRef()
  const screenLight = useRef()
  const level = useRef(1)

  // Las luces se apagan poco a poco al sentarse y vuelven al levantarse. La pantalla no depende de ellas:
  // se ve igual, y de su resplandor sobre las primeras filas queda solo una parte.
  useFrame((_, delta) => {
    const target = dim ? DARK : 1
    if (Math.abs(level.current - target) < 0.001) return
    level.current += (target - level.current) * Math.min(1, delta * 2.4)
    sky.current.intensity = SKY_LIGHT * level.current
    ambient.current.intensity = AMBIENT_LIGHT * level.current
    salaLight.current.intensity = SALA_LIGHT * level.current
    screenLight.current.intensity = SCREEN_LIGHT * (0.3 + 0.7 * level.current)
    house.current.children.forEach((light, i) => { light.intensity = HOUSE_LIGHTS[i].intensity * level.current })
    game.current.light = level.current
  })

  return (
    <>
      <color attach='background' args={['#050506']} />
      <fog attach='fog' args={['#050506', 22, 52]} />

      <hemisphereLight ref={sky} args={['#ffe9d6', '#2a1a22', SKY_LIGHT]} />
      <ambientLight ref={ambient} intensity={AMBIENT_LIGHT} />
      <group ref={house}>
        {HOUSE_LIGHTS.map((light, i) => (
          <pointLight key={i} {...light} />
        ))}
      </group>
      <pointLight ref={salaLight} position={[near.x, 5.6, near.z]} intensity={SALA_LIGHT} distance={16} color='#ffd9b8' />
      <pointLight ref={screenLight} position={[front.x, 3.6, front.z]} intensity={SCREEN_LIGHT} distance={15} color='#cfd8ff' />
      <Gate open={gateOpen} />

      <group ref={wallsRef}>
        {WALLS.map((wall, i) => (
          <mesh key={i} position={wall.position} material={wallMaterial}>
            <boxGeometry args={wall.size} />
          </mesh>
        ))}
        {[[LOBBY_RECT, LOBBY.height], [CORRIDOR_RECT, CORRIDOR.height], ...SALAS.map((s) => [salaRect(s), SALA.height])].map(([area, height], i) => (
          <mesh key={i} material={ceilingMaterial} rotation={[Math.PI / 2, 0, 0]} position={[area.center[0], height, area.center[1]]}>
            <planeGeometry args={area.size} />
          </mesh>
        ))}
      </group>

      <Lobby />
      <Corridor />
      {SALAS.map((s) => (
        <Sala key={s.id} sala={s} />
      ))}
      <Seats />
    </>
  )
}
