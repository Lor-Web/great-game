import { PlayerAnimation, SpriteId } from './enums'
import { animations } from './utils/manifest'

export const GAME_WIDTH = 640
export const GAME_HEIGHT = 360
export const SPRITE_SCALE = 2
export const TILE_SOURCE_SIZE = 16
export const TILE_SIZE = TILE_SOURCE_SIZE * SPRITE_SCALE
export const ATTACK_DURATION = 0.5

export const PLAYER_CONFIG = {
  maxSpeed: 180,
  acceleration: 900,
  braking: 1200,
  gravity: 1100,
  jumpSpeed: 440,
  halfWidth: 12,
  spriteBottomOffset: 8,
}

export const GAME_OBJECT_CONFIG = {
  excaliburGap: 12,
  attackMaxDistance: 30,
  coordinatesGap: 10,
  healthBar: {
    width: 32,
    height: 4,
    upGap: 35,
    maxColor: '#4ade80',
    middleColor: '#facc15',
    minColor: '#ef4444',
  },
}

export const LOOP_CONFIG = {
  fixedStep: 1 / 60,
  maxFrameTime: 0.1,
  millisecondsPerSecond: 1000,
}

// Координаты исходных тайлов в world_tileset.png.
export const WORLD_TILES = {
  grass: { x: 0, y: 0 },
  dirt: { x: 0, y: TILE_SOURCE_SIZE },
}

export const CHARACTER_ANIMATIONS = {
  [SpriteId.Knight]: {
    [PlayerAnimation.Idle]: animations.knightIdle,
    [PlayerAnimation.Run]: animations.knightRun,
  },
  [SpriteId.Percival]: {
    [PlayerAnimation.Idle]: animations.percivalIdle,
    [PlayerAnimation.Run]: animations.percivalRun,
  },
  [SpriteId.Merlin]: {
    [PlayerAnimation.Idle]: animations.merlinIdle,
    [PlayerAnimation.Run]: animations.merlinRun,
  },
  [SpriteId.King]: {
    [PlayerAnimation.Idle]: animations.kingIdle,
    [PlayerAnimation.Run]: animations.kingRun,
  },
}

export type CharacterSkin = keyof typeof CHARACTER_ANIMATIONS

export const CHARACTER_SKINS = [
  SpriteId.Knight,
  SpriteId.Percival,
  SpriteId.Merlin,
  SpriteId.King,
] satisfies CharacterSkin[]
