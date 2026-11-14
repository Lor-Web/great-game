import { SpriteId } from '../enums'

export const spriteFiles = {
  [SpriteId.World]: 'world_tileset.png',
  [SpriteId.Knight]: 'knight.png',
  [SpriteId.Percival]: 'percival.png',
  [SpriteId.Merlin]: 'merlin.png',
  [SpriteId.King]: 'king.png',
  [SpriteId.Slime]: 'slime_green.png',
  [SpriteId.PurpleSlime]: 'slime_purple.png',
  [SpriteId.Coin]: 'coin.png',
  [SpriteId.Excalibur]: 'excalibur.png',
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
  percivalRun: {
    sprite: SpriteId.Percival,
    frameWidth: 32,
    frameHeight: 32,
    row: 2,
    frameCount: 4,
    fps: 12,
    loop: true,
  },
  percivalIdle: {
    sprite: SpriteId.Percival,
    frameWidth: 32,
    frameHeight: 32,
    row: 0,
    frameCount: 4,
    fps: 6,
    loop: true,
  },
  merlinRun: {
    sprite: SpriteId.Merlin,
    frameWidth: 32,
    frameHeight: 32,
    row: 2,
    frameCount: 4,
    fps: 12,
    loop: true,
  },
  merlinIdle: {
    sprite: SpriteId.Merlin,
    frameWidth: 32,
    frameHeight: 32,
    row: 0,
    frameCount: 4,
    fps: 6,
    loop: true,
  },
  kingRun: {
    sprite: SpriteId.King,
    frameWidth: 32,
    frameHeight: 32,
    row: 2,
    frameCount: 4,
    fps: 12,
    loop: true,
  },
  kingIdle: {
    sprite: SpriteId.King,
    frameWidth: 32,
    frameHeight: 32,
    row: 0,
    frameCount: 4,
    fps: 6,
    loop: true,
  },
  excalibur: {
    sprite: SpriteId.Excalibur,
    frameWidth: 32,
    frameHeight: 32,
    row: 1,
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
