// Plano del cine en metros. X hacia el este, Z hacia el sur, Y hacia arriba.
import { featuredProjects } from '../data/projects'

export const PLAYER_RADIUS = 0.3
export const WALL = 0.2
export const HALF = 2.5 // media anchura del pasillo

export const LOBBY = { name: 'Vestíbulo', x: [-13, 13], z: [0, 20], height: 6 }
export const CORRIDOR = { name: 'Pasillo de salas', x: [-HALF, HALF], z: [-41, 0], height: 3.6 }
export const SALA = { length: 16, half: 6, height: 6.5, doorHalf: 1.5, doorHeight: 2.7 }
export const SCREEN = { u: SALA.length - 0.15, y: 3.45, width: 8.6, height: 4.84 }
export const SPAWN = { x: 0, z: 14 }

// Cada sala cuelga de un lado del pasillo. u = distancia desde la pared del pasillo, v = desplazamiento en Z desde su centro.
export const SALAS = [
  { id: 'askesis', number: 1, side: 1, zc: -8, title: featuredProjects[0].name, accent: featuredProjects[0].accent },
  { id: 'chronia', number: 2, side: 1, zc: -21, title: featuredProjects[1].name, accent: featuredProjects[1].accent },
  { id: 'ourmap', number: 3, side: 1, zc: -34, title: featuredProjects[2].name, accent: featuredProjects[2].accent },
  { id: 'sobre-mi', number: 4, side: -1, zc: -8, title: 'Sobre mí', accent: '#f0c674' },
  { id: 'contacto', number: 5, side: -1, zc: -21, title: 'Contacto', accent: '#6fd3b8' }
]

export const salaById = (id) => SALAS.find((sala) => sala.id === id)
export const salaPoint = (sala, u, v) => ({ x: sala.side * (HALF + u), z: sala.zc + v })
export const salaName = (sala) => `Sala ${sala.number} · ${sala.title}`

const ROW_U = [4.4, 6, 7.6, 9.2, 10.8]
const BLOCKS_V = [
  [-5, -4.25, -3.5, -2.75, -2],
  [2, 2.75, 3.5, 4.25, 5]
]

// Reparto fijo de público: mismo resultado en cada carga
const pseudoRandom = (n) => {
  const value = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return value - Math.floor(value)
}

export const SEATS = SALAS.flatMap((sala, s) =>
  ROW_U.flatMap((u, row) =>
    BLOCKS_V.flatMap((block, b) =>
      block.map((v, i) => {
        const index = s * 100 + row * 10 + b * 5 + i
        const aisle = Math.abs(v) === 2
        return {
          id: `${sala.id}-${row}-${b}-${i}`,
          salaId: sala.id,
          side: sala.side,
          ...salaPoint(sala, u, v),
          occupied: !aisle && pseudoRandom(index) < 0.3,
          look: pseudoRandom(index + 0.5)
        }
      })
    )
  )
)

const box = (x0, x1, z0, z1) => ({ x: [Math.min(x0, x1), Math.max(x0, x1)], z: [Math.min(z0, z1), Math.max(z0, z1)] })

// Mobiliario del vestíbulo
export const TICKET_DESK = box(-10.2, -9.2, 5, 11)
export const POPCORN_BAR = box(9.2, 10.2, 5.5, 12.5)
export const COLUMNS = [[-6.5, 5.5], [6.5, 5.5], [-6.5, 14.5], [6.5, 14.5]]
export const BENCHES = [[-4.6, 14.6], [4.6, 14.6]]
export const PLANTS = [[-12, 1], [12, 1], [-12, 19], [12, 19], [-3.4, 0.9], [3.4, 0.9]]

const ZONES = [
  box(LOBBY.x[0], LOBBY.x[1], LOBBY.z[0], LOBBY.z[1]),
  box(-HALF, HALF, CORRIDOR.z[0], 1),
  ...SALAS.flatMap((sala) => [
    box(sala.side * 1.5, sala.side * 3.7, sala.zc - SALA.doorHalf, sala.zc + SALA.doorHalf),
    box(sala.side * HALF, sala.side * (HALF + SALA.length - 0.9), sala.zc - SALA.half, sala.zc + SALA.half)
  ])
]

const OBSTACLES = [
  TICKET_DESK,
  POPCORN_BAR,
  box(-12.9, -10.2, 4.6, 11.4),
  box(10.2, 12.9, 5.1, 12.9),
  ...COLUMNS.map(([x, z]) => box(x - 0.4, x + 0.4, z - 0.4, z + 0.4)),
  ...BENCHES.map(([x, z]) => box(x - 1.2, x + 1.2, z - 0.35, z + 0.35)),
  ...PLANTS.map(([x, z]) => box(x - 0.35, x + 0.35, z - 0.35, z + 0.35)),
  box(1.35, 2.05, -2.55, -1.85),
  ...SALAS.flatMap((sala) =>
    ROW_U.flatMap((u) =>
      BLOCKS_V.map((block) => {
        const back = salaPoint(sala, u - 0.36, block[0] - 0.33)
        const front = salaPoint(sala, u + 0.3, block[block.length - 1] + 0.33)
        return box(back.x, front.x, back.z, front.z)
      })
    )
  )
]

export function canStand (x, z) {
  const margin = PLAYER_RADIUS + WALL / 2
  const inZone = ZONES.some(
    (zone) => x >= zone.x[0] + margin && x <= zone.x[1] - margin && z >= zone.z[0] + margin && z <= zone.z[1] - margin
  )
  if (!inZone) return false
  return !OBSTACLES.some(
    (o) => x > o.x[0] - PLAYER_RADIUS && x < o.x[1] + PLAYER_RADIUS && z > o.z[0] - PLAYER_RADIUS && z < o.z[1] + PLAYER_RADIUS
  )
}

// Devuelve 'lobby', 'corridor' o el id de la sala
export function roomAt (x, z) {
  if (z >= 0.4) return 'lobby'
  if (Math.abs(x) <= HALF + 0.1) return 'corridor'
  const sala = SALAS.find((s) => Math.sign(x) === s.side && Math.abs(z - s.zc) <= SALA.half)
  return sala ? sala.id : 'corridor'
}

export function roomName (room) {
  if (room === 'lobby') return LOBBY.name
  if (room === 'corridor') return CORRIDOR.name
  return salaName(salaById(room))
}

export function nearestSeat (salaId, x, z, maxDistance = 1.15) {
  let best = null
  let bestDistance = maxDistance
  for (const seat of SEATS) {
    if (seat.salaId !== salaId || seat.occupied) continue
    const distance = Math.hypot(seat.x - x, seat.z - z)
    if (distance < bestDistance) {
      best = seat
      bestDistance = distance
    }
  }
  return best
}

// Personal del cine con el que se puede hablar. talk es el punto al que hay que acercarse.
export const STAFF = [
  {
    id: 'taquilla',
    name: 'Ane',
    role: 'Taquilla',
    x: -11.3,
    z: 8,
    facing: Math.PI / 2,
    talk: { x: -8.7, z: 8 },
    lines: [
      '¡Hola! Bienvenido al cine de Eneko Fernández. Hoy la entrada es gratis.',
      'Tenemos cinco sesiones. En las salas 1, 2 y 3 se proyectan sus productos: Askesis, Chronia Timeline y OurMap.',
      'En la sala 4 cuenta quién es, dónde trabaja y qué ha estudiado. La sala 5 es para ponerse en contacto con él.',
      'Sigue el pasillo del fondo, entra en la sala que quieras y siéntate en cualquier butaca libre.'
    ]
  },
  {
    id: 'palomitas',
    name: 'Jon',
    role: 'Palomitas',
    x: 11.3,
    z: 8.4,
    facing: -Math.PI / 2,
    talk: { x: 8.7, z: 8.4 },
    lines: [
      '¿Unas palomitas para la sesión? Invita la casa.',
      'El menú lleva lo que Eneko usa a diario: React y Next.js en el frontend, Node.js y MongoDB en el backend.',
      'Si solo tienes tiempo para una película, entra en la sala 1. Askesis es su proyecto más grande: más de 600 usuarios activos.'
    ]
  },
  {
    id: 'acomodador',
    name: 'Mikel',
    role: 'Acomodador',
    x: 1.7,
    z: -2.2,
    facing: -0.5,
    talk: { x: 0.9, z: -1.6 },
    lines: [
      'Las salas 1, 2 y 3 quedan a tu derecha según entras. La 4 y la 5, a tu izquierda.',
      'Dentro, acércate a una butaca libre y pulsa E para sentarte. Con las flechas pasas la película.',
      'Eneko trabaja como desarrollador full stack en Butler Scientifics y es co-fundador de Askesis. En la sala 4 lo cuenta con detalle.'
    ]
  }
]

export function nearestStaff (x, z, maxDistance = 1.9) {
  return STAFF.find((npc) => Math.hypot(npc.talk.x - x, npc.talk.z - z) < maxDistance) ?? null
}

// Gente de ambiente. Los que andan siguen un circuito cerrado de puntos.
export const WALKERS = [
  { path: [[-2.6, 18], [-2.6, 3], [-1.3, 1], [-1.3, -7], [1.3, -7], [1.3, 1], [2.6, 3], [2.6, 18]], speed: 1.25, offsets: [0, 0.37, 0.71] },
  { path: [[-7.8, 17.5], [-7.8, 2.6], [7.8, 2.6], [7.8, 17.5]], speed: 1.1, offsets: [0.1, 0.45, 0.8] },
  { path: [[-1.4, -9], [-1.4, -38.5], [1.4, -38.5], [1.4, -9]], speed: 1.3, offsets: [0.05, 0.55] }
]

const NORTH = Math.PI
const EAST = Math.PI / 2
const WEST = -Math.PI / 2
const SOUTH = 0

export const IDLERS = [
  // Mirando la cartelera
  { x: -7.9, z: 1.9, facing: NORTH },
  { x: -7.1, z: 2.1, facing: NORTH - 0.2 },
  { x: 7.6, z: 1.9, facing: NORTH },
  // Cola de palomitas
  { x: 8.6, z: 10.4, facing: EAST },
  { x: 7.9, z: 11.3, facing: EAST - 0.4 },
  // Cola de taquilla
  { x: -8.7, z: 6.6, facing: WEST },
  { x: -8.7, z: 9.6, facing: WEST },
  // Corrillos
  { x: 3.4, z: 8.2, facing: EAST + 0.3 },
  { x: 4.4, z: 8.5, facing: WEST + 0.3 },
  { x: 3.9, z: 9.2, facing: NORTH },
  { x: -4.2, z: 6.2, facing: SOUTH + 0.5 },
  { x: -3.5, z: 7, facing: NORTH + 0.6 },
  // Personal de la barra
  { x: 11.3, z: 9.6, facing: WEST, staff: true },
  // Sentados en los bancos
  { x: -5.1, z: 14.6, facing: NORTH, seated: true },
  { x: -4.1, z: 14.6, facing: NORTH, seated: true },
  { x: 4.9, z: 14.6, facing: NORTH, seated: true }
]
