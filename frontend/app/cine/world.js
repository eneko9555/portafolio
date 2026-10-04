// Plano del cine en metros. X hacia el este, Z hacia el sur, Y hacia arriba.
import { featuredProjects } from '../data/projects'

export const PLAYER_RADIUS = 0.3
export const WALL = 0.2
export const SPAWN = { x: 0, z: 6.5 }

export const ROOMS = {
  lobby: { name: 'Vestíbulo', x: [-8, 8], z: [0, 12], height: 5 },
  corridor: { name: 'Pasillo', x: [-2, 2], z: [-20, 0], height: 3.5 },
  sala: { name: 'Sala 1 · Askesis', x: [2, 20], z: [-18, -4], height: 7 }
}

export const DOOR = { z: [-12.5, -9.5], height: 2.7 }

// Zonas por las que se puede andar. Se solapan en los pasos para que no queden huecos.
const ZONES = [
  { x: [-8, 8], z: [0, 12] },
  { x: [-2, 2], z: [-20, 1] },
  { x: [1, 3.2], z: DOOR.z },
  { x: [2.2, 19.2], z: [-18, -4] }
]

export const SCREEN = { x: 19.85, y: 3.6, z: -11, width: 9.6, height: 5.4 }

const ROW_X = [5.5, 7.1, 8.7, 10.3, 11.9, 13.5]
const BLOCKS = [
  [-16.9, -16.15, -15.4, -14.65, -13.9, -13.15],
  [-8.85, -8.1, -7.35, -6.6, -5.85, -5.1]
]

export const SEATS = ROW_X.flatMap((x, row) =>
  BLOCKS.flatMap((block, b) => block.map((z, i) => ({ id: `${row}-${b}-${i}`, x, z })))
)

export const TICKET_DESK = { x: [-6.5, -3.5], z: [3, 4.2], height: 1.1 }

const OBSTACLES = [
  TICKET_DESK,
  ...ROW_X.flatMap((x) =>
    BLOCKS.map((block) => ({ x: [x - 0.36, x + 0.3], z: [block[0] - 0.33, block[block.length - 1] + 0.33] }))
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

export function roomAt (x, z) {
  if (x > 2.1) return 'sala'
  if (z < 0.4) return 'corridor'
  return 'lobby'
}

export function nearestSeat (x, z, maxDistance = 1.15) {
  let best = null
  let bestDistance = maxDistance
  for (const seat of SEATS) {
    const distance = Math.hypot(seat.x - x, seat.z - z)
    if (distance < bestDistance) {
      best = seat
      bestDistance = distance
    }
  }
  return best
}

// Diapositivas de la sala: portada del proyecto y un pase por cada bloque del caso
const askesis = featuredProjects[0]

export const SLIDES = [
  { type: 'title', title: askesis.name, text: askesis.tagline, stat: `${askesis.highlight.value} ${askesis.highlight.label}`, accent: askesis.accent },
  ...askesis.features.map((feature) => ({ type: 'image', title: feature.title, text: feature.text, image: feature.image }))
]

export const PROJECT_LINK = `/projects/${askesis.slug}`

export const POSTERS = [
  { x: -6.7, label: 'Sala 1', title: askesis.name, image: askesis.cover, accent: askesis.accent, open: true },
  { x: -5, label: 'Sala 2', title: featuredProjects[1].name, image: featuredProjects[1].cover, accent: featuredProjects[1].accent },
  { x: -3.3, label: 'Sala 3', title: featuredProjects[2].name, image: featuredProjects[2].cover, accent: featuredProjects[2].accent },
  { x: 3.7, label: 'Sala 4', title: 'Sobre mí', accent: '#f2f2f0' },
  { x: 5.6, label: 'Sala 5', title: 'Contacto', accent: '#f2f2f0' }
]
