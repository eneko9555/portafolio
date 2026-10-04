// Efectos de sonido generados con Web Audio, sin archivos: pasos, butaca, diapositiva, diálogo, palomitas y bebida
let context = null
let enabled = false

function noiseBuffer (seconds) {
  const buffer = context.createBuffer(1, context.sampleRate * seconds, context.sampleRate)
  const data = buffer.getChannelData(0)
  let last = 0
  for (let i = 0; i < data.length; i++) {
    // Ruido marrón: más grave y suave que el blanco
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02
    data[i] = last * 3.5
  }
  return buffer
}

function burst ({ frequency, duration, volume, type = 'bandpass', q = 1.2 }) {
  if (!enabled) return
  const source = context.createBufferSource()
  source.buffer = noiseBuffer(duration)
  const filter = context.createBiquadFilter()
  filter.type = type
  filter.frequency.value = frequency
  filter.Q.value = q
  const gain = context.createGain()
  gain.gain.setValueAtTime(volume, context.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration)
  source.connect(filter).connect(gain).connect(context.destination)
  source.start()
}

function tone ({ frequency, duration, volume }) {
  if (!enabled) return
  const oscillator = context.createOscillator()
  oscillator.type = 'sine'
  oscillator.frequency.value = frequency
  const gain = context.createGain()
  gain.gain.setValueAtTime(volume, context.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration)
  oscillator.connect(gain).connect(context.destination)
  oscillator.start()
  oscillator.stop(context.currentTime + duration)
}

// Hay que llamarlo desde un clic: los navegadores no dejan sonar nada antes
export function setSound (on) {
  if (on && !context) {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return false
    context = new AudioContext()
  }
  if (on) context.resume()
  enabled = Boolean(on && context)
  return enabled
}

export const sounds = {
  step: () => burst({ frequency: 180 + Math.random() * 60, duration: 0.09, volume: 0.5, type: 'lowpass' }),
  sit: () => burst({ frequency: 140, duration: 0.25, volume: 0.7, type: 'lowpass' }),
  slide: () => tone({ frequency: 660, duration: 0.12, volume: 0.05 }),
  talk: () => tone({ frequency: 440 + Math.random() * 80, duration: 0.09, volume: 0.05 }),
  buy: () => [660, 880].forEach((frequency, i) => setTimeout(() => tone({ frequency, duration: 0.14, volume: 0.06 }), i * 110)),
  crunch: () => [0, 90, 190].forEach((delay) => setTimeout(() => burst({ frequency: 2400 + Math.random() * 900, duration: 0.07, volume: 0.35, q: 2.5 }), delay)),
  sip: () => burst({ frequency: 900, duration: 0.5, volume: 0.12, q: 6 })
}
