// Conversaciones con el personal. Cada página es un texto y, a veces, opciones.
// Las opciones devuelven las páginas siguientes y los cambios en lo que llevas encima.

export const POPCORN_PORTIONS = 6
export const DRINK_SIPS = 5

const say = (text) => ({ text })

function order (items, wantsPopcorn, wantsDrink) {
  const pages = []
  const changes = {}
  if (wantsPopcorn) {
    if (items.popcorn > 0) {
      pages.push(say('Eh, que ya tienes unas palomitas. Acábatelas y vuelves a por más.'))
    } else {
      changes.popcorn = POPCORN_PORTIONS
      pages.push(say('Marchando unas palomitas recién hechas. Pulsa 1 cuando quieras comer.'))
    }
  }
  if (wantsDrink) {
    if (items.drink > 0) {
      pages.push(say('Ya llevas un refresco en la mano. Cuando lo termines te pongo otro.'))
    } else {
      changes.drink = DRINK_SIPS
      pages.push(say('Aquí tienes tu refresco, bien frío. Pulsa 2 para beber.'))
    }
  }
  return { pages, changes }
}

const scripts = {
  taquilla (npc, items) {
    if (items.ticket) {
      return [say('Ya tienes tu entrada. Las salas están al fondo, por el pasillo. ¡Que disfrutes de la sesión!')]
    }
    return [
      ...npc.lines.map(say),
      {
        text: 'Toma, tu entrada. Vale para las cinco salas.',
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

  acomodador (npc, items) {
    return [
      say(items.ticket ? 'Veo que ya tienes entrada. Adelante.' : 'Buenas. Si no has pasado por taquilla no te preocupes: hoy la entrada es gratis.'),
      ...npc.lines.map(say)
    ]
  }
}

export function buildDialog (npc, items) {
  return scripts[npc.id](npc, items)
}
