'use client'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Figura estilizada hecha con formas simples. Todas las personas comparten geometrías y materiales.
const GEO = {
  leg: new THREE.CapsuleGeometry(0.075, 0.5, 4, 10),
  torso: new THREE.CapsuleGeometry(0.19, 0.4, 6, 14),
  arm: new THREE.CapsuleGeometry(0.058, 0.15, 4, 10),
  head: new THREE.SphereGeometry(0.155, 18, 16),
  hair: new THREE.SphereGeometry(0.165, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.58),
  eye: new THREE.SphereGeometry(0.034, 12, 10),
  pupil: new THREE.SphereGeometry(0.019, 10, 8),
  hand: new THREE.SphereGeometry(0.07, 10, 8),
  shadow: new THREE.CircleGeometry(0.34, 20),
  bucket: new THREE.CylinderGeometry(0.11, 0.08, 0.2, 14),
  popcorn: new THREE.SphereGeometry(0.11, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2),
  cup: new THREE.CylinderGeometry(0.055, 0.045, 0.19, 12),
  straw: new THREE.CylinderGeometry(0.008, 0.008, 0.16, 6),
  cap: new THREE.SphereGeometry(0.174, 18, 10, 0, Math.PI * 2, 0, Math.PI * 0.42),
  visor: new THREE.BoxGeometry(0.2, 0.02, 0.13),
  stripe: new THREE.BoxGeometry(0.22, 0.055, 0.02)
}

const materials = new Map()
export function flat (color) {
  if (!materials.has(color)) materials.set(color, new THREE.MeshLambertMaterial({ color }))
  return materials.get(color)
}

// Brazo que sujeta algo: [hombro, codo, giro hacia dentro]. El objeto se inclina lo contrario para quedar derecho.
const HOLD = [-0.3, -1.3, 0]
const HELD_TILT = 1.6
// Brazos de quien atiende detrás de un mostrador: las manos quedan apoyadas encima
const ON_COUNTER = [-0.75, -0.85, 0]
// Vigilante: manos recogidas delante del cuerpo y, para dar el alto, el brazo derecho extendido
const GUARD_REST = [-0.3, -1.3, 0.7]
const HALT = [-1.45, -0.12, 0]

export const EYE_WHITE = '#f4f1ea'
export const EYE_DARK = '#17171b'

const shadowMaterial = new THREE.MeshBasicMaterial({ color: '#000000', transparent: true, opacity: 0.28, depthWrite: false })

const SKIN = ['#e9bd97', '#c88f63', '#f2ceac', '#8f5d3d', '#dba878', '#a9744e']
const HAIR = ['#1d1612', '#3b2718', '#6b4a2c', '#c9a063', '#0e0e10', '#7a3b22']
const TOPS = ['#3f6fd8', '#d6456f', '#e8e3d6', '#2f9e77', '#e0a23a', '#7b5bd6', '#3a3a44', '#c7533a', '#4aa7c9']
// Pantalones algo más claros que la moqueta y los zócalos, para que las piernas se distingan
const BOTTOMS = ['#3b4f7a', '#55596b', '#6b5a48', '#2f5d7c', '#7a7f8c']

const pick = (list, n) => list[Math.abs(Math.floor(n)) % list.length]

export function lookOf (seed) {
  return {
    skin: pick(SKIN, seed * 7.3),
    hair: pick(HAIR, seed * 3.1 + 1),
    top: pick(TOPS, seed * 5.7 + 2),
    bottom: pick(BOTTOMS, seed * 2.3 + 3)
  }
}

export const STAFF_LOOK = { top: '#b3263a', bottom: '#3a3a46' }
export const GUARD_LOOK = { top: '#17171d', bottom: '#2d2d38' }

// motion es un ref { moving, eating, drinking, stride, halt } que la figura consulta en cada fotograma.
// stride es la fase del paso: si viene, las piernas la siguen en vez de ir por tiempo.
const Person = forwardRef(function Person ({ look, motion, seated = false, counter = false, guard = false, phase = 0, popcorn = false, drink = false, shadow = true }, ref) {
  const root = useRef()
  const legL = useRef()
  const legR = useRef()
  const armL = useRef()
  const armR = useRef()
  const elbowL = useRef()
  const elbowR = useRef()
  const turnL = useRef()
  const turnR = useRef()
  const body = useRef()

  useImperativeHandle(ref, () => root.current)

  useFrame((state, delta) => {
    const m = motion?.current
    const t = m?.stride ?? state.clock.elapsedTime * 8.5 + phase
    const moving = Boolean(m?.moving)
    const swing = moving ? Math.sin(t) * 0.65 : 0

    if (seated) {
      legL.current.rotation.x = legR.current.rotation.x = -Math.PI / 2
      body.current.position.y = -0.36
    } else {
      legL.current.rotation.x = swing
      legR.current.rotation.x = -swing
      body.current.position.y = moving ? Math.abs(Math.cos(t)) * 0.035 : Math.sin(state.clock.elapsedTime * 1.6 + phase) * 0.006
    }

    // Cada cosa va en una mano: las palomitas en la izquierda y el refresco en la derecha.
    // Cada brazo tiene hombro, codo y un giro hacia dentro; al comer o beber la mano sube hasta la boca.
    const now = performance.now()
    const eating = m?.eating > now
    const drinking = m?.drinking > now
    const bite = Math.sin(state.clock.elapsedTime * 11) * 0.12
    const ease = Math.min(1, delta * 12)
    const pose = (shoulder, elbow, turn, target) => {
      shoulder.current.rotation.x += (target[0] - shoulder.current.rotation.x) * ease
      elbow.current.rotation.x += (target[1] - elbow.current.rotation.x) * ease
      turn.current.rotation.y += (target[2] - turn.current.rotation.y) * ease
    }
    const rest = (side) => {
      if (guard) return side === 1 && m?.halt ? HALT : [GUARD_REST[0], GUARD_REST[1], -side * GUARD_REST[2]]
      if (counter) return ON_COUNTER
      return seated ? [-0.35, -1.1, 0] : [side * swing * 0.7, -0.15, 0]
    }
    pose(armL, elbowL, turnL, eating ? [-1.1, -1.9 + bite, 0.5] : popcorn ? HOLD : rest(-1))
    pose(armR, elbowR, turnR, drinking ? [-1.1, -1.9, -0.5] : drink ? HOLD : rest(1))
  })

  return (
    <group ref={root}>
      {shadow && <mesh geometry={GEO.shadow} material={shadowMaterial} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]} />}
      <group ref={body}>
        <group ref={legL} position={[-0.1, 0.82, 0]}>
          <mesh geometry={GEO.leg} material={flat(look.bottom)} position={[0, -0.4, 0]} />
        </group>
        <group ref={legR} position={[0.1, 0.82, 0]}>
          <mesh geometry={GEO.leg} material={flat(look.bottom)} position={[0, -0.4, 0]} />
        </group>
        <mesh geometry={GEO.torso} material={flat(look.top)} position={[0, 1.1, 0]} scale={[1, 1, 0.74]} />
        <group ref={turnL} position={[-0.27, 1.34, 0]}>
          <group ref={armL}>
            <mesh geometry={GEO.arm} material={flat(look.top)} position={[0, -0.12, 0]} />
            <group ref={elbowL} position={[0, -0.24, 0]}>
              <mesh geometry={GEO.arm} material={flat(look.top)} position={[0, -0.12, 0]} />
              <mesh geometry={GEO.hand} material={flat(look.skin)} position={[0, -0.25, 0]} />
              {popcorn && (
                <group position={[0, -0.3, 0.1]} rotation={[HELD_TILT, 0, 0]}>
                  <mesh geometry={GEO.bucket} material={flat('#d43a4c')} />
                  <mesh geometry={GEO.popcorn} material={flat('#f6dc7a')} position={[0, 0.1, 0]} />
                </group>
              )}
            </group>
          </group>
        </group>
        <group ref={turnR} position={[0.27, 1.34, 0]}>
          <group ref={armR}>
            <mesh geometry={GEO.arm} material={flat(look.top)} position={[0, -0.12, 0]} />
            <group ref={elbowR} position={[0, -0.24, 0]}>
              <mesh geometry={GEO.arm} material={flat(look.top)} position={[0, -0.12, 0]} />
              <mesh geometry={GEO.hand} material={flat(look.skin)} position={[0, -0.25, 0]} />
              {drink && (
                <group position={[0, -0.3, 0.08]} rotation={[HELD_TILT, 0, 0]}>
                  <mesh geometry={GEO.cup} material={flat('#3f6fd8')} />
                  <mesh geometry={GEO.straw} material={flat('#f2f2f0')} position={[0.02, 0.15, 0]} />
                </group>
              )}
            </group>
          </group>
        </group>
        <mesh geometry={GEO.head} material={flat(look.skin)} position={[0, 1.6, 0]} />
        <mesh geometry={GEO.hair} material={flat(look.hair)} position={[0, 1.615, -0.015]} rotation={[-0.5, 0, 0]} />
        {guard && (
          <>
            <mesh geometry={GEO.cap} material={flat('#0e0e12')} position={[0, 1.622, -0.01]} />
            <mesh geometry={GEO.visor} material={flat('#0e0e12')} position={[0, 1.664, 0.2]} />
            <mesh geometry={GEO.stripe} material={flat('#ffd23f')} position={[0, 1.27, 0.134]} />
            <mesh geometry={GEO.stripe} material={flat('#ffd23f')} position={[0, 1.27, -0.134]} />
          </>
        )}
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 0.058, 1.592, 0]}>
            <mesh geometry={GEO.eye} material={flat(EYE_WHITE)} position={[0, 0, 0.127]} scale={[1, 1, 0.55]} />
            <mesh geometry={GEO.pupil} material={flat(EYE_DARK)} position={[0, 0, 0.142]} scale={[1, 1, 0.4]} />
          </group>
        ))}
      </group>
    </group>
  )
})

export default Person
