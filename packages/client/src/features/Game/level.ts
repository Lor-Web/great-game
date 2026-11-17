export type Island = {
  x: number
  y: number
  width: number
  depth: number
  checkpoint?: boolean
}

export const ISLANDS: readonly Island[] = [
  { x: 0, y: 292, width: 224, depth: 3 },
  { x: 288, y: 258, width: 128, depth: 2 },
  { x: 480, y: 214, width: 160, depth: 2 },
  { x: 720, y: 262, width: 96, depth: 2 },
  { x: 888, y: 290, width: 224, depth: 3, checkpoint: true },
  { x: 1192, y: 240, width: 128, depth: 2 },
  { x: 1392, y: 185, width: 96, depth: 2 },
  { x: 1568, y: 219, width: 160, depth: 2 },
  { x: 1816, y: 282, width: 192, depth: 3, checkpoint: true },
  { x: 2096, y: 230, width: 96, depth: 2 },
  { x: 2280, y: 190, width: 128, depth: 2 },
  { x: 2496, y: 252, width: 224, depth: 3 },
]

export const WORLD_WIDTH = 2720
export const SPAWN = { x: 80, y: ISLANDS[0].y }
export const EXIT = { x: 2660, y: ISLANDS[11].y }

export type Coin = { x: number; y: number; got: boolean }

export type Slime = {
  x: number
  y: number
  hp: number
  maxHp: number
  variant: 'green' | 'purple'
}

export const createLevel = () => {
  const coins: Coin[] = ISLANDS.flatMap(island => {
    const offsets =
      island.width >= 160 ? [40, island.width - 32] : [island.width / 2]
    return offsets.map(offset => ({
      x: island.x + offset,
      y: island.y - 8,
      got: false,
    }))
  })
  // Монеты над разрывами отмечают дугу прыжка.
  coins.push(
    { x: 255, y: 225, got: false },
    { x: 1355, y: 171, got: false },
    { x: 2048, y: 212, got: false }
  )

  const encounters = [
    { island: 2, offset: 84, hp: 2 },
    { island: 4, offset: 142, hp: 2 },
    { island: 5, offset: 78, hp: 2 },
    { island: 7, offset: 96, hp: 3 },
    { island: 8, offset: 128, hp: 2 },
    { island: 10, offset: 76, hp: 3 },
    { island: 11, offset: 122, hp: 3 },
  ]
  const slimes: Slime[] = encounters.map(({ island, offset, hp }) => ({
    x: ISLANDS[island].x + offset,
    y: ISLANDS[island].y,
    hp,
    maxHp: hp,
    variant: hp === 3 ? 'purple' : 'green',
  }))

  return { coins, slimes }
}
