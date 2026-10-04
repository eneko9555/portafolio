// Texturas dibujadas en un canvas 2D: diapositivas, carteles, rótulos y materiales con dibujo
import * as THREE from 'three'

const INK = '#f2f2f0'
const MUTED = '#a3a3ad'
const DIM = '#6d6d77'
const BG = '#0b0b0d'

const cssFont = (name, fallback) => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback
const sans = () => getComputedStyle(document.body).fontFamily || 'sans-serif'
const serif = () => cssFont('--font-serif', 'Georgia, serif')
const mono = () => cssFont('--font-mono', 'monospace')

async function ready () {
  await Promise.all([
    document.fonts.load(`600 60px ${sans()}`),
    document.fonts.load(`400 60px ${sans()}`),
    document.fonts.load(`italic 400 60px ${serif()}`),
    document.fonts.load(`400 30px ${mono()}`)
  ]).catch(() => {})
}

// Si una imagen no carga se devuelve null y no se guarda el fallo, para reintentarla la próxima vez
const images = new Map()
function loadImage (src) {
  if (!images.has(src)) {
    images.set(src, new Promise((resolve) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = () => {
        images.delete(src)
        resolve(null)
      }
      image.src = src
    }))
  }
  return images.get(src)
}

// Descarga por adelantado las imágenes de una sala
export function preloadImages (slides) {
  for (const slide of slides) if (slide.image) loadImage(slide.image.src)
}

function toTexture (canvas, repeat) {
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  if (repeat) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(repeat[0], repeat[1])
  }
  return texture
}

function makeCanvas (width, height) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return [canvas, canvas.getContext('2d')]
}

function wrap (ctx, text, maxWidth) {
  const lines = []
  let line = ''
  for (const word of text.split(' ')) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  return lines
}

// Escribe un párrafo con salto de línea y devuelve la Y siguiente
function paragraph (ctx, text, x, y, maxWidth, size, { weight = 400, color = INK, family = sans(), lineHeight = 1.35, style = '' } = {}) {
  ctx.font = `${style} ${weight} ${size}px ${family}`
  ctx.fillStyle = color
  for (const line of wrap(ctx, text, maxWidth)) {
    y += size * lineHeight
    ctx.fillText(line, x, y)
  }
  return y
}

function roundedRect (ctx, x, y, width, height, radius) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + width, y, x + width, y + height, radius)
  ctx.arcTo(x + width, y + height, x, y + height, radius)
  ctx.arcTo(x, y + height, x, y, radius)
  ctx.arcTo(x, y, x + width, y, radius)
  ctx.closePath()
}

function slideFrame (ctx, { accent, header, index, total }) {
  ctx.fillStyle = BG
  ctx.fillRect(0, 0, 1920, 1080)
  const glow = ctx.createRadialGradient(1640, 0, 0, 1640, 0, 1250)
  glow.addColorStop(0, `${accent}44`)
  glow.addColorStop(1, `${accent}00`)
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, 1920, 1080)

  ctx.textAlign = 'left'
  ctx.font = `400 26px ${mono()}`
  ctx.fillStyle = DIM
  ctx.fillText(header.toUpperCase(), 110, 96)
  ctx.textAlign = 'right'
  ctx.fillText(`${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`, 1810, 96)
  ctx.textAlign = 'left'

  ctx.fillStyle = '#26262b'
  ctx.fillRect(110, 1010, 1700, 4)
  ctx.fillStyle = accent
  ctx.fillRect(110, 1010, (1700 * (index + 1)) / total, 4)
}

function eyebrow (ctx, text, x, y, accent) {
  ctx.font = `500 30px ${mono()}`
  ctx.fillStyle = accent
  ctx.fillText(text.toUpperCase(), x, y)
}

// Cada pintor dibuja el contenido a un tamaño k y devuelve hasta dónde llega; si no cabe se reintenta más pequeño
const painters = {
  title (ctx, slide, k, accent) {
    eyebrow(ctx, slide.note, 120, 300, accent)
    let size = 210
    ctx.font = `600 ${size}px ${sans()}`
    while (ctx.measureText(slide.title).width > 1680 && size > 90) {
      size -= 10
      ctx.font = `600 ${size}px ${sans()}`
    }
    ctx.fillStyle = INK
    ctx.fillText(slide.title, 112, 330 + size)
    let y = paragraph(ctx, slide.text, 120, 370 + size, 1450, 52 * k, { color: MUTED })
    y = paragraph(ctx, slide.stat, 120, y + 40, 1600, 62 * k, { weight: 600, color: accent })
    ctx.font = `400 28px ${mono()}`
    ctx.fillStyle = DIM
    ctx.fillText('→  PASAR', 120, 960)
    return y
  },

  text (ctx, slide, k, accent) {
    eyebrow(ctx, slide.eyebrow, 120, 230, accent)
    let y = paragraph(ctx, slide.title, 116, 250, 1650, 92 * k, { weight: 600, lineHeight: 1.12 })
    y += 30 * k
    slide.paragraphs.forEach((text, i) => {
      y = paragraph(ctx, text, 120, y + 22 * k, 1620, (i === 0 ? 46 : 41) * k, { color: i === 0 ? INK : MUTED })
    })
    return y
  },

  list (ctx, slide, k, accent) {
    eyebrow(ctx, slide.eyebrow, 120, 220, accent)
    let y = paragraph(ctx, slide.title, 116, 238, 1650, 78 * k, { weight: 600, lineHeight: 1.12 })
    if (slide.lead) y = paragraph(ctx, slide.lead, 120, y + 22 * k, 1620, 40 * k)
    y += 26 * k
    for (const item of slide.items) {
      y += 24 * k
      ctx.fillStyle = accent
      ctx.beginPath()
      ctx.arc(132, y + 30 * k, 8, 0, Math.PI * 2)
      ctx.fill()
      if (item.title) y = paragraph(ctx, item.title, 170, y, 1580, 40 * k, { weight: 600 })
      y = paragraph(ctx, item.text, 170, y, 1580, (item.title ? 35 : 39) * k, { color: item.title ? MUTED : INK })
    }
    return y
  },

  feature (ctx, slide, k, accent, image) {
    const frame = { x: 110, y: 170, width: 1090, height: 760 }
    const source = image ?? { width: 16, height: 9 }
    const scale = Math.min(frame.width / source.width, frame.height / source.height)
    const width = source.width * scale
    const height = source.height * scale
    const x = frame.x + (frame.width - width) / 2
    const y0 = frame.y + (frame.height - height) / 2
    ctx.save()
    roundedRect(ctx, x, y0, width, height, 16)
    ctx.clip()
    if (image) {
      ctx.drawImage(image, x, y0, width, height)
    } else {
      ctx.fillStyle = '#17171b'
      ctx.fillRect(x, y0, width, height)
    }
    ctx.restore()
    ctx.strokeStyle = '#2e2e35'
    ctx.lineWidth = 2
    roundedRect(ctx, x, y0, width, height, 16)
    ctx.stroke()

    const tx = 1260
    const tw = 550
    eyebrow(ctx, slide.eyebrow, tx, 230, accent)
    let y = paragraph(ctx, slide.title, tx - 2, 246, tw, 60 * k, { weight: 600, lineHeight: 1.14 })
    y = paragraph(ctx, slide.text, tx, y + 18 * k, tw, 32 * k, { color: MUTED })
    y += 22 * k
    for (const point of slide.points) {
      y += 16 * k
      ctx.fillStyle = accent
      ctx.beginPath()
      ctx.arc(tx + 8, y + 24 * k, 6, 0, Math.PI * 2)
      ctx.fill()
      y = paragraph(ctx, point, tx + 30, y, tw - 30, 29 * k)
    }
    return y
  },

  end (ctx, slide, k, accent) {
    ctx.textAlign = 'center'
    ctx.font = `italic 400 ${170 * k}px ${serif()}`
    ctx.fillStyle = INK
    ctx.fillText(slide.title, 960, 470)
    let y = paragraph(ctx, slide.text, 960, 520, 1500, 54 * k, { color: accent, weight: 600 })
    y = paragraph(ctx, slide.note, 960, y + 30, 1500, 34 * k, { color: MUTED })
    ctx.font = `400 28px ${mono()}`
    ctx.fillStyle = DIM
    ctx.fillText('E  LEVANTARSE', 960, 960)
    ctx.textAlign = 'left'
    return y
  }
}

// Textura de la pantalla de cine. size permite una versión pequeña para las salas en las que no estás.
export async function makeSlideTexture (slide, context, size = 1920) {
  await ready()
  const [canvas, ctx] = makeCanvas(size, (size * 9) / 16)
  ctx.scale(size / 1920, size / 1920)
  const image = slide.image ? await loadImage(slide.image.src) : null

  for (const k of [1, 0.92, 0.84, 0.77, 0.7, 0.63, 0.56]) {
    slideFrame(ctx, context)
    const bottom = painters[slide.type](ctx, slide, k, context.accent, image)
    if (bottom <= 955) break
  }
  const texture = toTexture(canvas)
  texture.userData.incomplete = Boolean(slide.image && !image)
  return texture
}

// Cartel de la cartelera
export async function makePosterTexture (poster) {
  await ready()
  const [canvas, ctx] = makeCanvas(640, 920)
  ctx.fillStyle = '#131316'
  ctx.fillRect(0, 0, 640, 920)

  const image = poster.image ? await loadImage(poster.image.src) : null
  if (image) {
    const scale = Math.max(640 / image.width, 560 / image.height)
    ctx.save()
    ctx.beginPath()
    ctx.rect(0, 0, 640, 560)
    ctx.clip()
    ctx.drawImage(image, 0, 0, image.width * scale, image.height * scale)
    ctx.restore()
  } else {
    const glow = ctx.createRadialGradient(480, 80, 0, 480, 80, 620)
    glow.addColorStop(0, `${poster.accent}66`)
    glow.addColorStop(1, '#17171b')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, 640, 560)
    ctx.font = `italic 400 190px ${serif()}`
    ctx.fillStyle = INK
    ctx.fillText(poster.glyph ?? '', 46, 360)
  }

  ctx.fillStyle = poster.accent
  ctx.fillRect(0, 560, 640, 8)
  ctx.font = `500 30px ${mono()}`
  ctx.fillStyle = poster.accent
  ctx.fillText(`SALA ${poster.number}`, 46, 650)
  paragraph(ctx, poster.title, 44, 670, 560, 70, { weight: 600, lineHeight: 1.1 })
  ctx.font = `400 28px ${sans()}`
  ctx.fillStyle = MUTED
  ctx.fillText('En cartelera', 46, 868)
  return toTexture(canvas)
}

// Rótulo luminoso
export async function makeSignTexture ({ title, subtitle, accent = INK, background = '#101013', italic = false }) {
  await ready()
  const [canvas, ctx] = makeCanvas(1024, 256)
  ctx.fillStyle = background
  ctx.fillRect(0, 0, 1024, 256)
  ctx.textAlign = 'center'
  ctx.shadowColor = accent
  ctx.shadowBlur = 26
  ctx.fillStyle = accent
  ctx.font = italic ? `italic 400 ${subtitle ? 110 : 150}px ${serif()}` : `600 ${subtitle ? 88 : 112}px ${sans()}`
  ctx.fillText(title, 512, subtitle ? 122 : 168)
  ctx.shadowBlur = 0
  if (subtitle) {
    ctx.fillStyle = MUTED
    ctx.font = `400 44px ${sans()}`
    ctx.fillText(subtitle, 512, 204)
  }
  return toTexture(canvas)
}

// Tablón con título y filas a dos columnas (menú de la barra, sesiones de la taquilla)
export async function makeBoardTexture ({ title, rows, accent }) {
  await ready()
  const [canvas, ctx] = makeCanvas(900, 600)
  ctx.fillStyle = '#0e0e11'
  ctx.fillRect(0, 0, 900, 600)
  ctx.strokeStyle = '#2c2c33'
  ctx.lineWidth = 6
  ctx.strokeRect(3, 3, 894, 594)
  ctx.font = `600 60px ${sans()}`
  ctx.fillStyle = accent
  ctx.fillText(title, 50, 100)
  rows.forEach(([left, right], i) => {
    const y = 190 + i * 76
    ctx.font = `500 40px ${sans()}`
    ctx.fillStyle = INK
    ctx.textAlign = 'left'
    ctx.fillText(left, 50, y)
    ctx.font = `400 34px ${mono()}`
    ctx.fillStyle = MUTED
    ctx.textAlign = 'right'
    ctx.fillText(right, 850, y)
    ctx.textAlign = 'left'
  })
  return toTexture(canvas)
}

// Moqueta con rombos
export function makeCarpetTexture (repeat, base = '#2b101d', line = '#421a2d', dot = '#b8894a') {
  const [canvas, ctx] = makeCanvas(256, 256)
  ctx.fillStyle = base
  ctx.fillRect(0, 0, 256, 256)
  ctx.strokeStyle = line
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.moveTo(128, 0)
  ctx.lineTo(256, 128)
  ctx.lineTo(128, 256)
  ctx.lineTo(0, 128)
  ctx.closePath()
  ctx.stroke()
  ctx.fillStyle = dot
  for (const [x, y] of [[0, 0], [256, 0], [0, 256], [256, 256], [128, 128]]) {
    ctx.beginPath()
    ctx.arc(x, y, 7, 0, Math.PI * 2)
    ctx.fill()
  }
  return toTexture(canvas, repeat)
}

// Rayas rojas y blancas de la barra y de los cubos de palomitas
export function makeStripesTexture (repeat) {
  const [canvas, ctx] = makeCanvas(128, 128)
  ctx.fillStyle = '#f4efe6'
  ctx.fillRect(0, 0, 128, 128)
  ctx.fillStyle = '#c0283a'
  ctx.fillRect(0, 0, 64, 128)
  return toTexture(canvas, repeat)
}

// Pliegues de cortina
export function makeCurtainTexture (repeat) {
  const [canvas, ctx] = makeCanvas(128, 32)
  const fold = ctx.createLinearGradient(0, 0, 128, 0)
  fold.addColorStop(0, '#3d0f1c')
  fold.addColorStop(0.5, '#8c1f35')
  fold.addColorStop(1, '#3d0f1c')
  ctx.fillStyle = fold
  ctx.fillRect(0, 0, 128, 32)
  return toTexture(canvas, repeat)
}
