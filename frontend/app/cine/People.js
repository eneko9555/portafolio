'use client'
import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Person, { lookOf, STAFF_LOOK } from './Person'
import { WALKERS, IDLERS, STAFF, SEATS } from './world'

// Persona que recorre un circuito cerrado y se detiene si tiene al jugador delante
function Walker ({ path, speed, offset, seed, game }) {
  const ref = useRef()
  const motion = useRef({ moving: true })
  const route = useMemo(() => {
    const points = path.map(([x, z]) => new THREE.Vector2(x, z))
    const lengths = points.map((point, i) => point.distanceTo(points[(i + 1) % points.length]))
    const total = lengths.reduce((sum, length) => sum + length, 0)
    return { points, lengths, total }
  }, [path])
  const travelled = useRef(offset * route.total)

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05)
    const body = ref.current
    const g = game.current
    const blocked = Math.hypot(g.x - body.position.x, g.z - body.position.z) < 0.9
    motion.current.moving = !blocked
    if (!blocked) travelled.current = (travelled.current + speed * delta) % route.total

    let rest = travelled.current
    let i = 0
    while (rest > route.lengths[i]) {
      rest -= route.lengths[i]
      i = (i + 1) % route.points.length
    }
    const from = route.points[i]
    const to = route.points[(i + 1) % route.points.length]
    const t = rest / route.lengths[i]
    body.position.set(from.x + (to.x - from.x) * t, 0, from.y + (to.y - from.y) * t)

    const target = Math.atan2(to.x - from.x, to.y - from.y)
    let diff = target - body.rotation.y
    diff = Math.atan2(Math.sin(diff), Math.cos(diff))
    body.rotation.y += diff * Math.min(1, delta * 6)
  })

  return <Person ref={ref} look={lookOf(seed)} motion={motion} phase={seed} />
}

// Público sentado en las salas: tres mallas instanciadas para todas las butacas ocupadas
function Audience () {
  const torso = useRef()
  const head = useRef()
  const hair = useRef()
  const occupied = useMemo(() => SEATS.filter((seat) => seat.occupied), [])

  useLayoutEffect(() => {
    const matrix = new THREE.Matrix4()
    const color = new THREE.Color()
    occupied.forEach((seat, i) => {
      const look = lookOf(seat.look * 97)
      matrix.makeScale(1, 1, 0.74).setPosition(seat.x, 0.72, seat.z)
      torso.current.setMatrixAt(i, matrix)
      torso.current.setColorAt(i, color.set(look.top))
      matrix.identity().setPosition(seat.x, 1.22, seat.z)
      head.current.setMatrixAt(i, matrix)
      head.current.setColorAt(i, color.set(look.skin))
      matrix.setPosition(seat.x - seat.side * 0.02, 1.25, seat.z)
      hair.current.setMatrixAt(i, matrix)
      hair.current.setColorAt(i, color.set(look.hair))
    })
    for (const mesh of [torso.current, head.current, hair.current]) {
      mesh.instanceMatrix.needsUpdate = true
      mesh.instanceColor.needsUpdate = true
    }
  }, [occupied])

  return (
    <>
      <instancedMesh ref={torso} args={[null, null, occupied.length]}>
        <capsuleGeometry args={[0.19, 0.4, 6, 14]} />
        <meshLambertMaterial />
      </instancedMesh>
      <instancedMesh ref={head} args={[null, null, occupied.length]}>
        <sphereGeometry args={[0.155, 16, 14]} />
        <meshLambertMaterial />
      </instancedMesh>
      <instancedMesh ref={hair} args={[null, null, occupied.length]}>
        <sphereGeometry args={[0.165, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshLambertMaterial />
      </instancedMesh>
    </>
  )
}

export default function People ({ game }) {
  return (
    <>
      {WALKERS.flatMap((walker, w) =>
        walker.offsets.map((offset, i) => (
          <Walker key={`${w}-${i}`} path={walker.path} speed={walker.speed} offset={offset} seed={w * 11 + i * 3 + 1} game={game} />
        ))
      )}

      {IDLERS.map((idler, i) => (
        <group key={i} position={[idler.x, idler.seated ? 0.1 : 0, idler.z]} rotation={[0, idler.facing, 0]}>
          <Person look={idler.staff ? { ...lookOf(i + 20), ...STAFF_LOOK } : lookOf(i * 4 + 5)} seated={idler.seated} phase={i} shadow={!idler.seated} />
        </group>
      ))}

      {STAFF.map((npc, i) => (
        <group key={npc.id} position={[npc.x, 0, npc.z]} rotation={[0, npc.facing, 0]}>
          <Person look={{ ...lookOf(i * 9 + 2), ...STAFF_LOOK }} phase={i * 2} />
        </group>
      ))}

      <Audience />
    </>
  )
}
