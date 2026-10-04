'use client'
import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import Person from './Person'
import { SCREEN, atGate, canStand, nearestSeat, nearestStaff, roomAt, salaById, salaPoint } from './world'
import { sounds } from './audio'

const WALK_SPEED = 3.4
const RUN_SPEED = 5.8
const TURN_SPEED = 2
const CAMERA_DISTANCE = 4.6
const HEAD_HEIGHT = 1.5
const BASE_FOV = 55
const PLAYER_LOOK = { skin: '#e9bd97', hair: '#2a1d14', top: '#f2f2f0', bottom: '#3b4f7a' }

// Metros por paso al andar y al correr
const WALK_STEP = 1.05
const RUN_STEP = 1.45

const damp = (rate, delta) => 1 - Math.exp(-rate * delta)
// Pasos dados hasta una fase de zancada: el pie pisa cuando la pierna llega a su máximo
const footfalls = (stride) => Math.floor((stride - Math.PI / 2) / Math.PI)

// Jugador: movimiento con colisiones, cámara en tercera persona y detección de con qué se puede interactuar.
// game es un ref con el estado que cambia cada fotograma; lo que afecta a la interfaz se avisa con onChange.
export default function Player ({ game, wallsRef, onChange, onGate, popcorn, drink }) {
  const figure = useRef()
  const motion = useRef({ moving: false, eating: 0, drinking: 0, stride: 0 })
  const { camera, gl } = useThree()
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const vectors = useMemo(
    () => ({ head: new THREE.Vector3(), desired: new THREE.Vector3(), direction: new THREE.Vector3(), look: new THREE.Vector3(0, HEAD_HEIGHT, 0) }),
    []
  )

  useEffect(() => {
    game.current.motion = motion.current
  }, [game])

  // Arrastrar gira la cámara. Las diferencias se calculan a mano porque en táctil no hay movementX fiable.
  useEffect(() => {
    const element = gl.domElement
    let last = null
    const down = (e) => { last = { id: e.pointerId, x: e.clientX, y: e.clientY } }
    const up = (e) => { if (last?.id === e.pointerId) last = null }
    const move = (e) => {
      if (!last || last.id !== e.pointerId || game.current.seated) return
      game.current.yaw -= (e.clientX - last.x) * 0.005
      game.current.pitch = THREE.MathUtils.clamp(game.current.pitch + (e.clientY - last.y) * 0.004, 0.05, 0.9)
      last.x = e.clientX
      last.y = e.clientY
    }
    element.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    window.addEventListener('pointermove', move)
    return () => {
      element.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      window.removeEventListener('pointermove', move)
    }
  }, [gl, game])

  useFrame((state, rawDelta) => {
    const g = game.current
    const delta = Math.min(rawDelta, 0.05)
    const keys = g.keys
    let moving = false

    if (!g.seated && !g.frozen) {
      let forward = (keys.has('w') || keys.has('arrowup') ? 1 : 0) - (keys.has('s') || keys.has('arrowdown') ? 1 : 0) + g.stick.y
      let strafe = (keys.has('d') ? 1 : 0) - (keys.has('a') ? 1 : 0) + g.stick.x
      const turn = (keys.has('arrowright') ? 1 : 0) - (keys.has('arrowleft') ? 1 : 0)
      g.yaw -= turn * TURN_SPEED * delta

      const length = Math.hypot(forward, strafe)
      if (length > 0.08) {
        if (length > 1) {
          forward /= length
          strafe /= length
        }
        const speed = (keys.has('shift') ? RUN_SPEED : WALK_SPEED) * delta
        const dx = (-Math.sin(g.yaw) * forward + Math.cos(g.yaw) * strafe) * speed
        const dz = (-Math.cos(g.yaw) * forward - Math.sin(g.yaw) * strafe) * speed
        const before = { x: g.x, z: g.z }
        // Los ejes se resuelven por separado para deslizarse a lo largo de las paredes
        if (canStand(g.x + dx, g.z, g.ticket)) g.x += dx
        if (canStand(g.x, g.z + dz, g.ticket)) g.z += dz
        // Sin entrada, el vigilante te para en la boca del pasillo
        if (!g.ticket && (atGate(before.x + dx, before.z) || atGate(before.x, before.z + dz))) onGate()
        g.facing = Math.atan2(dx, dz)
        const walked = Math.hypot(g.x - before.x, g.z - before.z)
        moving = walked > 0.0005
        // La zancada avanza con la distancia recorrida, así las piernas no patinan
        // y el paso suena justo cuando una pierna llega delante
        const previous = motion.current.stride
        motion.current.stride += (walked / (keys.has('shift') ? RUN_STEP : WALK_STEP)) * Math.PI
        if (footfalls(motion.current.stride) > footfalls(previous)) sounds.step()
      }

      const room = roomAt(g.x, g.z)
      const sala = salaById(room)
      let target = null
      if (sala) {
        const seat = nearestSeat(room, g.x, g.z)
        if (seat) target = { type: 'seat', id: seat.id, seat }
      } else {
        const npc = nearestStaff(g.x, g.z)
        if (npc) target = { type: 'npc', id: npc.id, npc }
      }
      if (room !== g.room || target?.id !== g.target?.id) {
        g.room = room
        g.target = target
        onChange()
      }
    }
    motion.current.moving = moving

    // Sentado se ve la sala en primera persona, así que la figura se oculta
    const body = figure.current
    body.visible = !g.seated
    if (!g.seated) {
      body.position.set(g.x, 0, g.z)
      let diff = g.facing - body.rotation.y
      diff = Math.atan2(Math.sin(diff), Math.cos(diff))
      body.rotation.y += diff * damp(12, delta)
    }

    const { head, desired, direction, look } = vectors
    let fov = BASE_FOV
    if (g.seated) {
      const sala = salaById(g.seat.salaId)
      const screen = salaPoint(sala, SCREEN.u, 0)
      desired.set(g.seat.x - sala.side * 0.1, 1.28, g.seat.z)
      head.set(screen.x, SCREEN.y - 0.2, screen.z)
      // El campo de visión se cierra hasta que la pantalla ocupa casi toda la vista
      const distance = desired.distanceTo(head)
      const aspect = state.size.width / state.size.height
      const byWidth = 2 * Math.atan(Math.tan(Math.atan(SCREEN.width / 2 / distance / 0.8)) / aspect)
      const byHeight = 2 * Math.atan(SCREEN.height / 2 / distance / 0.68)
      fov = THREE.MathUtils.radToDeg(Math.max(byWidth, byHeight))
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
    if (Math.abs(camera.fov - fov) > 0.05) {
      camera.fov += (fov - camera.fov) * damp(4, delta)
      camera.updateProjectionMatrix()
    }
  })

  return (
    <group ref={figure}>
      <Person look={PLAYER_LOOK} motion={motion} popcorn={popcorn} drink={drink} />
    </group>
  )
}
