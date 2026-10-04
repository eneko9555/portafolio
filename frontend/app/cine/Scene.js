'use client'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { ROOMS, DOOR, WALL, SEATS, TICKET_DESK, POSTERS } from './world'
import { makePosterTexture, makeSignTexture } from './textures'

const wallX = (x, z0, z1, y0, y1) => ({ position: [x, (y0 + y1) / 2, (z0 + z1) / 2], size: [WALL, y1 - y0, z1 - z0] })
const wallZ = (z, x0, x1, y0, y1) => ({ position: [(x0 + x1) / 2, (y0 + y1) / 2, z], size: [x1 - x0, y1 - y0, WALL] })

const { lobby, corridor, sala } = ROOMS

const WALLS = [
  // Vestíbulo
  wallZ(12, -8, 8, 0, lobby.height),
  wallX(-8, 0, 12, 0, lobby.height),
  wallX(8, 0, 12, 0, lobby.height),
  wallZ(0, -8, -2, 0, lobby.height),
  wallZ(0, 2, 8, 0, lobby.height),
  wallZ(0, -2, 2, corridor.height, lobby.height),
  // Pasillo
  wallX(-2, -20, 0, 0, corridor.height),
  wallX(2, -20, -18, 0, corridor.height),
  wallX(2, -4, 0, 0, corridor.height),
  wallZ(-20, -2, 2, 0, corridor.height),
  // Sala
  wallX(2, -18, DOOR.z[0], 0, sala.height),
  wallX(2, DOOR.z[1], -4, 0, sala.height),
  wallX(2, DOOR.z[0], DOOR.z[1], DOOR.height, sala.height),
  wallZ(-18, 2, 20, 0, sala.height),
  wallZ(-4, 2, 20, 0, sala.height),
  wallX(20, -18, -4, 0, sala.height)
]

const FLOORS = [
  { room: lobby, color: '#19191d' },
  { room: corridor, color: '#141417' },
  { room: sala, color: '#121215' }
]

function useAsyncTexture (factory) {
  const [texture, setTexture] = useState(null)
  useEffect(() => {
    let cancelled = false
    let created
    factory().then((result) => {
      created = result
      if (cancelled) result.dispose()
      else setTexture(result)
    })
    return () => {
      cancelled = true
      created?.dispose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return texture
}

function Poster ({ poster }) {
  const texture = useAsyncTexture(() => makePosterTexture(poster))
  return (
    <mesh position={[poster.x, 2.2, WALL / 2 + 0.02]}>
      <planeGeometry args={[1.5, 2.2]} />
      <meshBasicMaterial key={texture?.uuid ?? 'vacío'} map={texture} color={texture ? '#ffffff' : '#1b1b20'} toneMapped={false} />
    </mesh>
  )
}

function Sign ({ title, subtitle, position, rotationY, width = 2.4 }) {
  const texture = useAsyncTexture(() => makeSignTexture(title, subtitle))
  return (
    <mesh position={position} rotation={[0, rotationY, 0]}>
      <planeGeometry args={[width, width / 4]} />
      <meshBasicMaterial key={texture?.uuid ?? 'vacío'} map={texture} color={texture ? '#ffffff' : '#1b1b20'} toneMapped={false} />
    </mesh>
  )
}

function Seats () {
  const baseRef = useRef()
  const backRef = useRef()

  useLayoutEffect(() => {
    const matrix = new THREE.Matrix4()
    SEATS.forEach((seat, i) => {
      matrix.setPosition(seat.x, 0.23, seat.z)
      baseRef.current.setMatrixAt(i, matrix)
      matrix.setPosition(seat.x - 0.3, 0.55, seat.z)
      backRef.current.setMatrixAt(i, matrix)
    })
    baseRef.current.instanceMatrix.needsUpdate = true
    backRef.current.instanceMatrix.needsUpdate = true
  }, [])

  return (
    <>
      <instancedMesh ref={baseRef} args={[null, null, SEATS.length]}>
        <boxGeometry args={[0.6, 0.46, 0.64]} />
        <meshStandardMaterial color='#3a1426' roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={backRef} args={[null, null, SEATS.length]}>
        <boxGeometry args={[0.12, 1.1, 0.64]} />
        <meshStandardMaterial color='#451830' roughness={0.9} />
      </instancedMesh>
    </>
  )
}

// Geometría fija del cine. wallsRef agrupa lo que frena a la cámara.
export default function Scene ({ wallsRef }) {
  const wallMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#202025', roughness: 0.95 }), [])
  const ceilingMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#0d0d0f', roughness: 1 }), [])

  return (
    <>
      <color attach='background' args={['#050506']} />
      <fog attach='fog' args={['#050506', 16, 44]} />

      <ambientLight intensity={0.55} />
      <pointLight position={[-4, 4.2, 6]} intensity={60} color='#ffd9b8' />
      <pointLight position={[4, 4.2, 6]} intensity={60} color='#ffd9b8' />
      <pointLight position={[0, 4, 1.5]} intensity={30} color='#e0457f' />
      <pointLight position={[0, 3, -5]} intensity={18} color='#f2f2f0' />
      <pointLight position={[0, 3, -11]} intensity={18} color='#e0457f' />
      <pointLight position={[0, 3, -17]} intensity={18} color='#f2f2f0' />
      <pointLight position={[11, 6, -11]} intensity={45} color='#b8c6ff' />
      <pointLight position={[17, 3.5, -11]} intensity={70} color='#ffffff' />

      <group ref={wallsRef}>
        {WALLS.map((wall, i) => (
          <mesh key={i} position={wall.position} material={wallMaterial}>
            <boxGeometry args={wall.size} />
          </mesh>
        ))}
        {FLOORS.map(({ room }, i) => (
          <mesh
            key={i}
            material={ceilingMaterial}
            rotation={[Math.PI / 2, 0, 0]}
            position={[(room.x[0] + room.x[1]) / 2, room.height, (room.z[0] + room.z[1]) / 2]}
          >
            <planeGeometry args={[room.x[1] - room.x[0], room.z[1] - room.z[0]]} />
          </mesh>
        ))}
      </group>

      {FLOORS.map(({ room, color }, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[(room.x[0] + room.x[1]) / 2, 0, (room.z[0] + room.z[1]) / 2]}>
          <planeGeometry args={[room.x[1] - room.x[0], room.z[1] - room.z[0]]} />
          <meshStandardMaterial color={color} roughness={0.85} />
        </mesh>
      ))}

      {/* Moqueta del pasillo central de la sala y del pasillo */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -9.5]}>
        <planeGeometry args={[1.6, 20]} />
        <meshStandardMaterial color='#3a1426' roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[10.5, 0.005, -11]}>
        <planeGeometry args={[16, 2.2]} />
        <meshStandardMaterial color='#3a1426' roughness={1} />
      </mesh>

      {/* Taquilla */}
      <mesh position={[(TICKET_DESK.x[0] + TICKET_DESK.x[1]) / 2, TICKET_DESK.height / 2, (TICKET_DESK.z[0] + TICKET_DESK.z[1]) / 2]}>
        <boxGeometry args={[TICKET_DESK.x[1] - TICKET_DESK.x[0], TICKET_DESK.height, TICKET_DESK.z[1] - TICKET_DESK.z[0]]} />
        <meshStandardMaterial color='#2a2a31' roughness={0.6} />
      </mesh>
      <Sign title='Taquilla' position={[-5, 0.6, TICKET_DESK.z[1] + 0.01]} rotationY={0} width={1.8} />

      {/* Cartelera */}
      <Sign title='Cartelera' position={[-5, 4.1, WALL / 2 + 0.02]} rotationY={0} width={3.2} />
      {POSTERS.map((poster) => (
        <Poster key={poster.label} poster={poster} />
      ))}

      {/* Rótulos del pasillo */}
      <Sign title='Sala 1' subtitle='Askesis' position={[2 - WALL / 2 - 0.02, 3.05, -11]} rotationY={-Math.PI / 2} />
      <Sign title='Sala 2' subtitle='Chronia · próximamente' position={[-2 + WALL / 2 + 0.02, 2.6, -11]} rotationY={Math.PI / 2} />
      <Sign title='Sala 3' subtitle='OurMap · próximamente' position={[-2 + WALL / 2 + 0.02, 2.6, -16.5]} rotationY={Math.PI / 2} />
      <Sign title='Salas' position={[0, 4.25, WALL / 2 + 0.02]} rotationY={0} width={2.4} />

      <Seats />
    </>
  )
}
