'use client'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Figura estilizada hecha con formas simples. Todas las personas comparten geometrías y materiales.
const GEO = {
  leg: new THREE.CapsuleGeometry(0.075, 0.5, 4, 10),
  torso: new THREE.CapsuleGeometry(0.19, 0.4, 6, 14),
  arm: new THREE.CapsuleGeometry(0.058, 0.4, 4, 10),
  head: new THREE.SphereGeometry(0.155, 18, 16),
  hair: new THREE.SphereGeometry(0.165, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.58),
  eye: new THREE.SphereGeometry(0.018, 8, 8),
  shadow: new THREE.CircleGeometry(0.34, 20),
  bucket: new THREE.CylinderGeometry(0.11, 0.08, 0.2, 14),
  popcorn: new THREE.SphereGeometry(0.11, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2),
  cup: new THREE.CylinderGeometry(0.055, 0.045, 0.19, 12),
  straw: new THREE.CylinderGeometry(0.008, 0.008, 0.16, 6)
}

const materials = new Map()
export function flat (color) {
  if (!materials.has(color)) materials.set(color, new THREE.MeshLambertMaterial({ color }))
  return materials.get(color)
}

const shadowMaterial = new THREE.MeshBasicMaterial({ color: '#000000', transparent: true, opacity: 0.28, depthWrite: false })

const SKIN = ['#e9bd97', '#c88f63', '#f2ceac', '#8f5d3d', '#dba878', '#a9744e']
const HAIR = ['#1d1612', '#3b2718', '#6b4a2c', '#c9a063', '#0e0e10', '#7a3b22']
const TOPS = ['#3f6fd8', '#d6456f', '#e8e3d6', '#2f9e77', '#e0a23a', '#7b5bd6', '#3a3a44', '#c7533a', '#4aa7c9']
const BOTTOMS = ['#1f2430', '#2b2b33', '#3d3f52', '#4a3b32', '#1b2a3a']

const pick = (list, n) => list[Math.abs(Math.floor(n)) % list.length]

export function lookOf (seed) {
  return {
    skin: pick(SKIN, seed * 7.3),
    hair: pick(HAIR, seed * 3.1 + 1),
    top: pick(TOPS, seed * 5.7 + 2),
    bottom: pick(BOTTOMS, seed * 2.3 + 3)
  }
}

export const STAFF_LOOK = { top: '#b3263a', bottom: '#17171b' }

// motion es un ref { moving, eating, drinking } que la figura consulta en cada fotograma
const Person = forwardRef(function Person ({ look, motion, seated = false, phase = 0, popcorn = false, drink = false, shadow = true }, ref) {
  const root = useRef()
  const legL = useRef()
  const legR = useRef()
  const armL = useRef()
  const armR = useRef()
  const body = useRef()

  useImperativeHandle(ref, () => root.current)

  useFrame((state) => {
    const m = motion?.current
    const t = state.clock.elapsedTime * 8.5 + phase
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

    // Con algo en la mano el brazo va doblado; al comer o beber sube hasta la boca
    const now = performance.now()
    const eating = m?.eating > now
    const drinking = m?.drinking > now
    const bite = Math.abs(Math.sin(state.clock.elapsedTime * 9))
    armL.current.rotation.x = popcorn ? -1.15 : seated ? -0.5 : -swing * 0.7
    armR.current.rotation.x = drinking ? -2.35 : eating ? -1.6 - bite * 0.75 : drink ? -1.15 : seated ? -0.5 : swing * 0.7
    armR.current.rotation.z = eating && !drink ? 0.35 : 0
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
        <group ref={armL} position={[-0.27, 1.34, 0]}>
          <mesh geometry={GEO.arm} material={flat(look.top)} position={[0, -0.26, 0]} />
          {popcorn && (
            <group position={[0.06, -0.5, 0.05]} rotation={[1.15, 0, 0]}>
              <mesh geometry={GEO.bucket} material={flat('#d43a4c')} />
              <mesh geometry={GEO.popcorn} material={flat('#f6dc7a')} position={[0, 0.1, 0]} />
            </group>
          )}
        </group>
        <group ref={armR} position={[0.27, 1.34, 0]}>
          <mesh geometry={GEO.arm} material={flat(look.top)} position={[0, -0.26, 0]} />
          {drink && (
            <group position={[-0.04, -0.5, 0.05]} rotation={[1.15, 0, 0]}>
              <mesh geometry={GEO.cup} material={flat('#3f6fd8')} />
              <mesh geometry={GEO.straw} material={flat('#f2f2f0')} position={[0.02, 0.15, 0]} />
            </group>
          )}
        </group>
        <mesh geometry={GEO.head} material={flat(look.skin)} position={[0, 1.6, 0]} />
        <mesh geometry={GEO.hair} material={flat(look.hair)} position={[0, 1.615, -0.015]} rotation={[-0.25, 0, 0]} />
        <mesh geometry={GEO.eye} material={flat('#17171b')} position={[-0.055, 1.615, 0.142]} />
        <mesh geometry={GEO.eye} material={flat('#17171b')} position={[0.055, 1.615, 0.142]} />
      </group>
    </group>
  )
})

export default Person
