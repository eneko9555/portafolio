// Conversaciones con el personal. Cada página es un texto y, a veces, opciones.
// Las opciones devuelven las páginas siguientes y los cambios en lo que llevas encima.
import { SALAS, salaName } from './world'

export const POPCORN_PORTIONS = 6
export const DRINK_SIPS = 5

const say = (text) => ({ text })

function order (items, wantsPopcorn, wantsDrink) {
  const pages = []
  const changes = {}
  if (wantsPopcorn) {
    if (items.popcorn > 0 && !items.pass) {
      pages.push(say('Eh, que ya tienes unas palomitas. Acábatelas y vuelves a por más.'))
    } else {
      changes.popcorn = POPCORN_PORTIONS
      pages.push(say(items.popcorn > 0
        ? 'Con el pase de estreno hay barra libre: te relleno el cubo.'
        : 'Marchando unas palomitas recién hechas. Pulsa 1 cuando quieras comer.'))
    }
  }
  if (wantsDrink) {
    if (items.drink > 0 && !items.pass) {
      pages.push(say('Ya llevas un refresco en la mano. Cuando lo termines te pongo otro.'))
    } else {
      changes.drink = DRINK_SIPS
      pages.push(say(items.drink > 0
        ? 'Pase de estreno, vaso lleno. Aquí tienes.'
        : 'Aquí tienes tu refresco, bien frío. Pulsa 2 para beber.'))
    }
  }
  return { pages, changes }
}

const scripts = {
  taquilla (npc, items) {
    if (items.ticket) {
      return [say('Ya tienes tu entrada. Enséñasela a Mikel, en la boca del pasillo, y pasa a las salas. ¡Que disfrutes de la sesión!')]
    }
    return [
      ...npc.lines.map(say),
      {
        text: 'Toma, tu entrada. Se sella en cada sala que veas: si completas las cinco, hay premio.',
        changes: { ticket: true }
      }
    ]
  },

  palomitas (npc, items) {
    return [
      say(npc.lines[0]),
      {
        text: '¿Qué te pongo?',
        choices: [
          { label: 'Palomitas', select: (current) => order(current, true, false) },
          { label: 'Refresco', select: (current) => order(current, false, true) },
          { label: 'Las dos cosas', select: (current) => order(current, true, true) },
          { label: 'Nada, gracias', select: () => ({ pages: [say('Sin problema. Si cambias de idea, aquí estoy.')], changes: {} }) }
        ]
      },
      ...npc.lines.slice(1).map(say)
    ]
  },

  // Mikel vigila la boca del pasillo: sin entrada no deja pasar, y lleva la cuenta de las salas selladas
  acomodador (npc, items) {
    if (!items.ticket) {
      return [
        say('Alto ahí. Para pasar a las salas necesito ver tu entrada.'),
        say('Se saca en la taquilla, a tu izquierda según miras al pasillo. Es gratis: Ane te la da en un momento.')
      ]
    }
    if (items.pass) {
      return [say('Con el pase de estreno entras cuando quieras. Y en la barra tienes palomitas y refresco sin límite.')]
    }
    const pending = SALAS.filter((sala) => !items.seen.includes(sala.id))
    if (!pending.length) {
      return [
        say('¡Entrada completa! Has visto las cinco salas.'),
        { text: 'Te has ganado el pase de estreno: barra libre de palomitas y refresco.', changes: { pass: true } },
        say('Y si te ha gustado la sesión, a Eneko le encantará saberlo: en la sala 5 puedes escribirle sin levantarte de la butaca.')
      ]
    }
    if (!items.seen.length) {
      return [say('Entrada en regla. Adelante.'), ...npc.lines.map(say)]
    }
    return [
      say(`Llevas ${items.seen.length} de ${SALAS.length} salas selladas.`),
      say(`Te ${pending.length === 1 ? 'falta' : 'faltan'}: ${pending.map(salaName).join(', ')}.`),
      say('Cuando completes la entrada, vuelve a verme.')
    ]
  }
}

export function buildDialog (npc, items) {
  return scripts[npc.id](npc, items)
}
