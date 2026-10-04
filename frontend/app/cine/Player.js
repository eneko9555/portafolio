'use client'
import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { SCREEN, canStand, nearestSeat, roomAt } from './world'

const WALK_SPEED = 3.4
const RUN_SPEED = 5.6
const TURN_SPEED = 2
const CAMERA_DISTANCE = 4.4
const HEAD_HEIGHT = 1.45

const damp = (rate, delta) => 1 - Math.exp(-rate * delta)

// Muñeco provisional, movimiento con colisiones y cámara en tercera persona.
// game es un ref con el estado que cambia cada fotograma; los cambios que afectan a la interfaz salen por onChange.
export default function Player ({ game, wallsRef, onChange }) {
  const figure = useRef()
  const { camera, gl } = useThree()
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const vectors = useMemo(
    () => ({ head: new THREE.Vector3(), desired: new THREE.Vector3(), direction: new THREE.Vector3(), look: new THREE.Vector3(0, HEAD_HEIGHT, 0) }),
    []
  )

  // Arrastrar con el ratón gira la cámara
  useEffect(() => {
    const element = gl.domElement
    let dragging = false
    const down = () => { dragging = true }
    const up = () => { dragging = false }
    const move = (e) => {
      if (!dragging || game.current.seated) return
      game.current.yaw -= e.movementX * 0.005
      game.current.pitch = THREE.MathUtils.clamp(game.current.pitch + e.movementY * 0.004, 0.05, 0.9)
    }
    element.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointermove', move)
    return () => {
      element.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointermove', move)
    }
  }, [gl, game])

  useFrame((state, rawDelta) => {
    const g = game.current
    const delta = Math.min(rawDelta, 0.05)
    const keys = g.keys
    let moving = false

    if (!g.seated) {
      const forward = (keys.has('w') || keys.has('arrowup') ? 1 : 0) - (keys.has('s') || keys.has('arrowdown') ? 1 : 0)
      const strafe = (keys.has('d') ? 1 : 0) - (keys.has('a') ? 1 : 0)
      const turn = (keys.has('arrowright') ? 1 : 0) - (keys.has('arrowleft') ? 1 : 0)
      g.yaw -= turn * TURN_SPEED * delta

      if (forward !== 0 || strafe !== 0) {
        const speed = (keys.has('shift') ? RUN_SPEED : WALK_SPEED) * delta
        const length = Math.hypot(forward, strafe)
        const dx = ((-Math.sin(g.yaw) * forward + Math.cos(g.yaw) * strafe) / length) * speed
        const dz = ((-Math.cos(g.yaw) * forward - Math.sin(g.yaw) * strafe) / length) * speed
        // Los ejes se resuelven por separado para deslizarse a lo largo de las paredes
        if (canStand(g.x + dx, g.z)) g.x += dx
        if (canStand(g.x, g.z + dz)) g.z += dz
        g.facing = Math.atan2(dx, dz)
        moving = true
      }

      const room = roomAt(g.x, g.z)
      const seat = room === 'sala' ? nearestSeat(g.x, g.z) : null
      if (room !== g.room || seat?.id !== g.nearSeat?.id) {
        g.room = room
        g.nearSeat = seat
        onChange()
      }
    }

    // Figura
    const body = figure.current
    // Sentado se ve la sala en primera persona, así que la figura se oculta
    body.visible = !g.seated
    if (!g.seated) {
      body.position.set(g.x, moving ? Math.abs(Math.sin(state.clock.elapsedTime * 9)) * 0.05 : 0, g.z)
      let diff = g.facing - body.rotation.y
      diff = Math.atan2(Math.sin(diff), Math.cos(diff))
      body.rotation.y += diff * damp(12, delta)
    }

    // Cámara
    const { head, desired, direction, look } = vectors
    if (g.seated) {
      desired.set(g.seat.x - 0.15, 1.3, g.seat.z)
      // Se mira por debajo del centro para que la pantalla quede por encima del panel de la diapositiva
      head.set(SCREEN.x, SCREEN.y - 1.7, SCREEN.z)
      camera.position.lerp(desired, damp(3.5, delta))
      look.lerp(head, damp(3.5, delta))
    } else {
      head.set(g.x, HEAD_HEIGHT, g.z)
      direction.set(Math.sin(g.yaw) * Math.cos(g.pitch), Math.sin(g.pitch), Math.cos(g.yaw) * Math.cos(g.pitch))
      let distance = CAMERA_DISTANCE
      if (wallsRef.current) {
        raycaster.set(head, direction)
        raycaster.far = CAMERA_DISTANCE
        const hit = raycaster.intersectObjects(wallsRef.current.children, false)[0]
        if (hit) distance = Math.max(0.5, hit.distance - 0.3)
      }
      desired.copy(head).addScaledVector(direction, distance)
      camera.position.lerp(desired, damp(10, delta))
      look.lerp(head, damp(14, delta))
    }
    camera.lookAt(look)
  })

  return (
    <group ref={figure}>
      <mesh position={[0, 0.75, 0]}>
        <capsuleGeometry args={[0.26, 0.7, 6, 16]} />
        <meshStandardMaterial color='#f2f2f0' roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.52, 0]}>
        <sphereGeometry args={[0.2, 20, 20]} />
        <meshStandardMaterial color='#f2f2f0' roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.54, 0.16]}>
        <boxGeometry args={[0.26, 0.08, 0.1]} />
        <meshStandardMaterial color='#0a0a0b' roughness={0.3} />
      </mesh>
    </group>
  )
}
