import { SpriteId } from '../enums'

export const spriteFiles = {
  [SpriteId.World]: 'world_tileset.png',
  [SpriteId.Knight]: 'knight.png',
  [SpriteId.Slime]: 'slime_green.png',
  [SpriteId.Coin]: 'coin.png',
}

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
  knightRun: {
    sprite: SpriteId.Knight,
    frameWidth: 32,
    frameHeight: 32,
    row: 2,
    frameCount: 8,
    fps: 12,
    loop: true,
  },
  knightIdle: {
    sprite: SpriteId.Knight,
    frameWidth: 32,
    frameHeight: 32,
    row: 0,
    frameCount: 4,
    fps: 6,
    loop: true,
  },
  slimeIdle: {
    sprite: SpriteId.Slime,
    frameWidth: 24,
    frameHeight: 24,
    row: 0,
    frameCount: 4,
    fps: 6,
    loop: true,
  },
  coinSpin: {
    sprite: SpriteId.Coin,
    frameWidth: 16,
    frameHeight: 16,
    row: 0,
    frameCount: 12,
    fps: 12,
    loop: true,
  },
} satisfies Record<string, AnimationClip>
