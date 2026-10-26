export const spriteFiles = {
  world: 'world_tileset.png',
  knight: 'knight.png',
  slime: 'slime_green.png',
  coin: 'coin.png',
}

export type SpriteId = keyof typeof spriteFiles
export type GameImages = Record<SpriteId, HTMLImageElement>

export type AnimationClip = {
  sprite: SpriteId
  frameWidth: number
  frameHeight: number
  row: number
  frameCount: number
  fps: number
  loop: boolean
}

export const animations = {
  knightIdle: {
    sprite: 'knight',
    frameWidth: 32,
    frameHeight: 32,
    row: 0,
    frameCount: 4,
    fps: 6,
    loop: true,
  },
  slimeIdle: {
    sprite: 'slime',
    frameWidth: 24,
    frameHeight: 24,
    row: 0,
    frameCount: 4,
    fps: 6,
    loop: true,
  },
  coinSpin: {
    sprite: 'coin',
    frameWidth: 16,
    frameHeight: 16,
    row: 0,
    frameCount: 12,
    fps: 12,
    loop: true,
  },
} satisfies Record<string, AnimationClip>
