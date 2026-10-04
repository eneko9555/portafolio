'use client'
import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Person, { lookOf, STAFF_LOOK, GUARD_LOOK, EYE_WHITE, EYE_DARK } from './Person'
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

// Personal con el que se habla. Quien no está tras un mostrador se gira hacia ti mientras conversáis;
// el vigilante, además, levanta la mano cuando te para por no llevar entrada.
function Staff ({ npc, index, game }) {
  const ref = useRef()
  const motion = useRef({ moving: false, halt: false })

  useFrame((_, rawDelta) => {
    const g = game.current
    const talking = g.talkingTo === npc.id
    motion.current.halt = talking && g.halted
    if (npc.counter) return
    const target = talking ? Math.atan2(g.x - npc.x, g.z - npc.z) : npc.facing
    let diff = target - ref.current.rotation.y
    diff = Math.atan2(Math.sin(diff), Math.cos(diff))
    ref.current.rotation.y += diff * Math.min(1, Math.min(rawDelta, 0.05) * 7)
  })

  const uniform = npc.guard ? GUARD_LOOK : STAFF_LOOK
  return (
    <group ref={ref} position={[npc.x, 0, npc.z]} rotation={[0, npc.facing, 0]} scale={npc.guard ? 1.1 : 1}>
      <Person look={{ ...lookOf(index * 9 + 2), ...uniform }} motion={motion} counter={npc.counter} guard={npc.guard} phase={index * 2} />
    </group>
  )
}

const AXIS_Z = new THREE.Vector3(0, 0, 1)
const UPRIGHT = new THREE.Quaternion()
const LYING = new THREE.Quaternion().setFromAxisAngle(AXIS_Z, Math.PI / 2)

// Público sentado en las salas, de cuerpo entero: unas pocas mallas instanciadas para todas las butacas ocupadas.
// Cada persona mira hacia la pantalla (seat.side en X); las piernas, los brazos, las manos y los ojos van por pares en Z.
function Audience () {
  const torso = useRef()
  const head = useRef()
  const hair = useRef()
  const limbs = useRef()
  const hands = useRef()
  const eyes = useRef()
  const pupils = useRef()
  const occupied = useMemo(() => SEATS.filter((seat) => seat.occupied), [])

  useLayoutEffect(() => {
    const matrix = new THREE.Matrix4()
    const position = new THREE.Vector3()
    const scale = new THREE.Vector3()
    const tilt = new THREE.Quaternion()
    const color = new THREE.Color()
    const place = (mesh, index, x, y, z, tone, quaternion = UPRIGHT, sx = 1, sy = 1, sz = 1) => {
      matrix.compose(position.set(x, y, z), quaternion, scale.set(sx, sy, sz))
      mesh.current.setMatrixAt(index, matrix)
      mesh.current.setColorAt(index, color.set(tone))
    }

    occupied.forEach((seat, i) => {
      const look = lookOf(seat.look * 97)
      const { x, z, side } = seat
      place(torso, i, x, 0.72, z, look.top, UPRIGHT, 1, 1, 0.74)
      place(head, i, x, 1.22, z, look.skin)
      // El pelo se echa hacia atrás para dejar la frente y los ojos a la vista
      place(hair, i, x - side * 0.02, 1.235, z, look.hair, tilt.setFromAxisAngle(AXIS_Z, side * 0.5))

      ;[-1, 1].forEach((pair, p) => {
        const limb = i * 8 + p * 4
        place(limbs, limb, x + side * 0.2, 0.55, z + pair * 0.1, look.bottom, LYING) // muslo
        place(limbs, limb + 1, x + side * 0.4, 0.3, z + pair * 0.1, look.bottom) // pierna
        place(limbs, limb + 2, x + side * 0.03, 0.86, z + pair * 0.25, look.top, UPRIGHT, 0.8, 0.75, 0.8) // brazo
        place(limbs, limb + 3, x + side * 0.17, 0.66, z + pair * 0.22, look.top, LYING, 0.8, 0.6, 0.8) // antebrazo
        place(hands, i * 2 + p, x + side * 0.32, 0.66, z + pair * 0.2, look.skin)
        place(eyes, i * 2 + p, x + side * 0.127, 1.212, z + pair * 0.058, EYE_WHITE, UPRIGHT, 0.55, 1, 1)
        place(pupils, i * 2 + p, x + side * 0.142, 1.212, z + pair * 0.058, EYE_DARK, UPRIGHT, 0.4, 1, 1)
      })
    })
    for (const mesh of [torso, head, hair, limbs, hands, eyes, pupils]) {
      mesh.current.instanceMatrix.needsUpdate = true
      mesh.current.instanceColor.needsUpdate = true
    }
  }, [occupied])

  const count = occupied.length
  return (
    <>
      <instancedMesh ref={torso} args={[null, null, count]}>
        <capsuleGeometry args={[0.19, 0.4, 6, 14]} />
        <meshLambertMaterial />
      </instancedMesh>
      <instancedMesh ref={head} args={[null, null, count]}>
        <sphereGeometry args={[0.155, 16, 14]} />
        <meshLambertMaterial />
      </instancedMesh>
      <instancedMesh ref={hair} args={[null, null, count]}>
        <sphereGeometry args={[0.165, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshLambertMaterial />
      </instancedMesh>
      <instancedMesh ref={limbs} args={[null, null, count * 8]}>
        <capsuleGeometry args={[0.07, 0.3, 4, 10]} />
        <meshLambertMaterial />
      </instancedMesh>
      <instancedMesh ref={hands} args={[null, null, count * 2]}>
        <sphereGeometry args={[0.07, 10, 8]} />
        <meshLambertMaterial />
      </instancedMesh>
      <instancedMesh ref={eyes} args={[null, null, count * 2]}>
        <sphereGeometry args={[0.034, 12, 10]} />
        <meshLambertMaterial />
      </instancedMesh>
      <instancedMesh ref={pupils} args={[null, null, count * 2]}>
        <sphereGeometry args={[0.019, 10, 8]} />
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
          <Person look={idler.staff ? { ...lookOf(i + 20), ...STAFF_LOOK } : lookOf(i * 4 + 5)} seated={idler.seated} counter={idler.counter} phase={i} shadow={!idler.seated} />
        </group>
      ))}

      {STAFF.map((npc, i) => (
        <Staff key={npc.id} npc={npc} index={i} game={game} />
      ))}

      <Audience />
    </>
  )
}
