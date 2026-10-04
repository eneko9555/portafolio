import * as THREE from 'three'

const INK = '#f2f2f0'
const MUTED = '#9c9ca6'
const BG = '#0b0b0d'

const fontFamily = () => getComputedStyle(document.body).fontFamily || 'sans-serif'

function loadImage (src) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = src
  })
}

function toTexture (canvas) {
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return texture
}

function wrapText (ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ')
  let line = ''
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y)
      line = word
      y += lineHeight
    } else {
      line = test
    }
  }
  ctx.fillText(line, x, y)
  return y
}

// Textura de la pantalla de cine para una diapositiva
export async function makeSlideTexture (slide) {
  const canvas = document.createElement('canvas')
  canvas.width = 1920
  canvas.height = 1080
  const ctx = canvas.getContext('2d')
  const family = fontFamily()
  await document.fonts.load(`600 100px ${family}`).catch(() => {})

  ctx.fillStyle = BG
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  if (slide.type === 'title') {
    const glow = ctx.createRadialGradient(1500, 100, 0, 1500, 100, 1300)
    glow.addColorStop(0, `${slide.accent}55`)
    glow.addColorStop(1, 'transparent')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = MUTED
    ctx.font = `500 34px ${family}`
    ctx.fillText('SALA 1', 140, 330)
    ctx.fillStyle = INK
    ctx.font = `600 220px ${family}`
    ctx.fillText(slide.title, 130, 560)
    ctx.fillStyle = MUTED
    ctx.font = `400 52px ${family}`
    const lastY = wrapText(ctx, slide.text, 140, 680, 1300, 70)
    ctx.fillStyle = slide.accent
    ctx.font = `600 60px ${family}`
    ctx.fillText(slide.stat, 140, lastY + 130)
    return toTexture(canvas)
  }

  const image = await loadImage(slide.image.src)
  const margin = 70
  const scale = Math.min((canvas.width - margin * 2) / image.width, (canvas.height - margin * 2) / image.height)
  const width = image.width * scale
  const height = image.height * scale
  ctx.drawImage(image, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height)
  return toTexture(canvas)
}

// Cartel de la cartelera del vestíbulo
export async function makePosterTexture (poster) {
  const canvas = document.createElement('canvas')
  canvas.width = 600
  canvas.height = 880
  const ctx = canvas.getContext('2d')
  const family = fontFamily()
  await document.fonts.load(`600 60px ${family}`).catch(() => {})

  ctx.fillStyle = '#131316'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  if (poster.image) {
    const image = await loadImage(poster.image.src)
    const scale = Math.max(canvas.width / image.width, 520 / image.height)
    const width = image.width * scale
    const height = image.height * scale
    ctx.save()
    ctx.beginPath()
    ctx.rect(0, 0, canvas.width, 520)
    ctx.clip()
    ctx.drawImage(image, 0, 0, width, height)
    ctx.restore()
  } else {
    const glow = ctx.createLinearGradient(0, 0, canvas.width, 520)
    glow.addColorStop(0, '#1b1b20')
    glow.addColorStop(1, '#26262c')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, canvas.width, 520)
  }

  ctx.fillStyle = poster.accent
  ctx.fillRect(0, 520, canvas.width, 8)
  ctx.fillStyle = MUTED
  ctx.font = `500 30px ${family}`
  ctx.fillText(poster.label.toUpperCase(), 44, 610)
  ctx.fillStyle = INK
  ctx.font = `600 64px ${family}`
  wrapText(ctx, poster.title, 44, 700, 520, 70)
  ctx.fillStyle = poster.open ? INK : MUTED
  ctx.font = `400 30px ${family}`
  ctx.fillText(poster.open ? 'Sesión abierta' : 'Próximamente', 44, 830)
  return toTexture(canvas)
}

// Rótulo luminoso de una línea o dos
export async function makeSignTexture (title, subtitle) {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  const family = fontFamily()
  await document.fonts.load(`600 80px ${family}`).catch(() => {})

  ctx.fillStyle = '#131316'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.textAlign = 'center'
  ctx.fillStyle = INK
  ctx.font = `600 ${subtitle ? 84 : 100}px ${family}`
  ctx.fillText(title, canvas.width / 2, subtitle ? 120 : 160)
  if (subtitle) {
    ctx.fillStyle = MUTED
    ctx.font = `400 46px ${family}`
    ctx.fillText(subtitle, canvas.width / 2, 200)
  }
  return toTexture(canvas)
}
