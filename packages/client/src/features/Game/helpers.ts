import type { CharacterSkin } from './constants'
import {
  CHARACTER_ANIMATIONS,
  GAME_HEIGHT,
  GAME_OBJECT_CONFIG,
  GAME_WIDTH,
  PLAYER_CONFIG,
  SPRITE_SCALE,
  TILE_SIZE,
  TILE_SOURCE_SIZE,
  WORLD_TILES,
} from './constants'
import { PlayerAnimation, SpriteId } from './enums'
import { type Coin, EXIT, ISLANDS, type Slime, WORLD_WIDTH } from './level'
import {
  type AnimationClip,
  animations,
  type GameImages,
} from './utils/manifest'
import type { Player } from './utils/player'

type DrawAnimationOptions = {
  context: CanvasRenderingContext2D
  images: GameImages
  clip: AnimationClip
  elapsedSeconds: number
  x: number
  y: number
  facingLeft?: boolean
  rotate?: number
}

type DrawLevelOptions = {
  context: CanvasRenderingContext2D
  images?: GameImages
  failed?: boolean
  elapsedSeconds?: number
  player?: Player
  coins?: Coin[]
  slimes?: Slime[]
  checkpointX?: number
  selectedSkin?: CharacterSkin
}

interface DrawHealthBarOptions {
  context: CanvasRenderingContext2D
  x: number
  y: number
  currentHp: number
  maxHp: number
}

export const drawAnimation = ({
  context,
  images,
  clip,
  elapsedSeconds,
  x,
  y,
  facingLeft = false,
  rotate = 0,
}: DrawAnimationOptions) => {
  const elapsedFrames = Math.floor(elapsedSeconds * clip.fps)
  let frame = elapsedFrames % clip.frameCount
  if (!clip.loop) frame = Math.min(elapsedFrames, clip.frameCount - 1)

  const width = clip.frameWidth * SPRITE_SCALE
  const height = clip.frameHeight * SPRITE_SCALE
  context.save()
  // Координаты задают середину нижнего края кадра — точку опоры персонажа.
  context.translate(Math.round(x), Math.round(y))
  if (facingLeft) context.scale(-1, 1)
  context.rotate(rotate)
  context.drawImage(
    images[clip.sprite],
    frame * clip.frameWidth,
    clip.row * clip.frameHeight,
    clip.frameWidth,
    clip.frameHeight,
    -width / 2,
    -height,
    width,
    height
  )
  context.restore()
}

export const drawLevel = ({
  context,
  images,
  failed = false,
  elapsedSeconds = 0,
  player,
  coins,
  slimes,
  checkpointX,
  selectedSkin = SpriteId.Knight,
}: DrawLevelOptions) => {
  const cameraX = Math.round(
    Math.max(0, Math.min((player?.x ?? 0) - 224, WORLD_WIDTH - GAME_WIDTH))
  )
  context.imageSmoothingEnabled = false
  context.fillStyle = '#a6d6ea'
  context.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)

  context.fillStyle = '#e5f3fa'
  for (let index = 0; index < 4; index += 1) {
    const x =
      ((((index * 201 - cameraX * 0.15 + elapsedSeconds * 6) % 780) + 780) %
        780) -
      100
    const y = 56 + (index % 2) * 44
    context.fillRect(Math.round(x), y, 76, 12)
    context.fillRect(Math.round(x) + 16, y - 12, 40, 12)
  }

  for (const ridge of [
    { color: '#8db9bb', offset: 0.2, height: 146, spacing: 216, base: 320 },
    { color: '#719c98', offset: 0.36, height: 104, spacing: 164, base: 350 },
  ]) {
    const startX = -Math.floor(cameraX * ridge.offset) % ridge.spacing
    context.fillStyle = ridge.color
    context.beginPath()
    context.moveTo(startX, ridge.base)
    for (let x = startX; x < GAME_WIDTH; x += ridge.spacing) {
      context.lineTo(x + ridge.spacing * 0.42, ridge.base - ridge.height)
      context.lineTo(x + ridge.spacing, ridge.base)
    }
    context.lineTo(GAME_WIDTH, GAME_HEIGHT)
    context.lineTo(0, GAME_HEIGHT)
    context.fill()
  }

  context.fillStyle = '#5d929e'
  context.fillRect(0, 336, GAME_WIDTH, 24)
  context.fillStyle = '#8bbdc2'
  for (let x = -(Math.floor(cameraX * 0.6) % 80); x < GAME_WIDTH; x += 80) {
    context.fillRect(x, 341, 34, 2)
    context.fillRect(x + 30, 352, 26, 2)
  }

  if (!images) {
    context.fillStyle = '#17283e'
    context.font = '14px monospace'
    context.fillText(
      failed
        ? 'Не удалось загрузить графику. Обновите страницу.'
        : 'Загрузка графики…',
      24,
      36
    )
    return
  }

  context.save()
  context.translate(-cameraX, 0)
  const tileset = images[SpriteId.World]
  for (const island of ISLANDS) {
    if (island.x + island.width < cameraX || island.x > cameraX + GAME_WIDTH)
      continue
    for (let row = 0; row < island.depth; row += 1) {
      const inset = row * TILE_SIZE
      const tile = row === 0 ? WORLD_TILES.grass : WORLD_TILES.dirt
      for (let x = inset; x < island.width - inset; x += TILE_SIZE) {
        context.drawImage(
          tileset,
          tile.x,
          tile.y,
          TILE_SOURCE_SIZE,
          TILE_SOURCE_SIZE,
          island.x + x,
          island.y + row * TILE_SIZE,
          TILE_SIZE,
          TILE_SIZE
        )
      }
    }
    if (island.checkpoint) {
      const x = island.x + 24
      context.fillStyle = '#263b42'
      context.fillRect(x, island.y - 44, 3, 44)
      context.fillStyle = checkpointX === x ? '#f9cb63' : '#e9f2e9'
      context.fillRect(x + 3, island.y - 43, 21, 12)
      context.fillRect(x + 24, island.y - 43, 5, 8)
    }
  }

  const exitOpen = slimes?.every(slime => slime.hp <= 0)
  context.fillStyle = '#28384c'
  context.fillRect(EXIT.x - 16, EXIT.y - 43, 32, 43)
  context.fillRect(EXIT.x - 12, EXIT.y - 49, 24, 8)
  context.fillStyle = exitOpen ? '#9bf2b7' : '#a084a4'
  context.fillRect(EXIT.x - 10, EXIT.y - 37, 20, 37)
  if (!exitOpen) {
    context.fillStyle = '#28384c'
    for (let x = EXIT.x - 6; x <= EXIT.x + 6; x += 6) {
      context.fillRect(x, EXIT.y - 37, 2, 37)
    }
  }

  if (player) {
    const clip =
      player.animation === PlayerAnimation.Run
        ? CHARACTER_ANIMATIONS[selectedSkin][PlayerAnimation.Run]
        : CHARACTER_ANIMATIONS[selectedSkin][PlayerAnimation.Idle]

    const animationTime =
      player.animation === PlayerAnimation.Air ? 0 : player.animationTime
    drawAnimation({
      context,
      images,
      clip,
      elapsedSeconds: animationTime,
      x: player.x,
      y: player.y + PLAYER_CONFIG.spriteBottomOffset, // У спрайта с рыцарем лишние пустые пиксели снизу
      facingLeft: player.facingLeft,
    })

    if (player.attack.isAttacking) {
      drawAnimation({
        context,
        images,
        clip: animations.excalibur,
        elapsedSeconds: player.attack.attackAnimationTime,
        x: player.x,
        y: player.y - GAME_OBJECT_CONFIG.excaliburGap,
        facingLeft: player.facingLeft,
        rotate: Math.PI / 2,
      })
    }

    if (slimes) {
      for (const slime of slimes) {
        if (slime.hp <= 0) {
          continue
        }
        drawAnimation({
          context,
          images,
          clip: {
            ...animations.slimeIdle,
            sprite:
              slime.variant === 'purple'
                ? SpriteId.PurpleSlime
                : SpriteId.Slime,
          },
          elapsedSeconds,
          x: slime.x,
          y: slime.y,
          facingLeft: slime.x > player.x,
        })
        drawHealthBar({
          context,
          x: slime.x,
          y: slime.y,
          currentHp: slime.hp,
          maxHp: slime.maxHp,
        })
      }
    }

    if (coins) {
      for (const coin of coins) {
        if (coin.got) {
          continue
        }

        drawAnimation({
          context,
          images,
          clip: animations.coinSpin,
          elapsedSeconds,
          x: coin.x,
          y: coin.y,
        })
      }
    }
  }
  context.restore()
}

export function checkIfTheSameCoordinates(
  player: Player,
  object: { x: number; y: number }
) {
  const { x: pX, y: pY } = player
  const { x: oX, y: oY } = object
  const gap = GAME_OBJECT_CONFIG.coordinatesGap

  return pX >= oX - gap && pX <= oX + gap && pY >= oY - gap && pY <= oY + gap
}

export function checkIfPlayerInFrontOfObject(
  player: Player,
  object: { x: number; y: number }
) {
  const { x: pX, y: pY, facingLeft } = player
  const { x: oX, y: oY } = object
  const maxDistance = GAME_OBJECT_CONFIG.attackMaxDistance
  const gap = GAME_OBJECT_CONFIG.coordinatesGap

  const isTheSameY = pY >= oY - gap && pY <= oY + gap

  const distanceX = Math.abs(pX - oX)
  const isFacingByX = facingLeft
    ? oX <= pX && distanceX <= maxDistance
    : oX >= pX && distanceX <= maxDistance

  return isTheSameY && isFacingByX
}

export const drawHealthBar = ({
  context,
  x,
  y,
  currentHp,
  maxHp,
}: DrawHealthBarOptions) => {
  if (currentHp <= 0) return

  const { width, height, upGap, maxColor, middleColor, minColor } =
    GAME_OBJECT_CONFIG.healthBar

  const barX = x - width / 2
  const barY = y - upGap

  context.fillStyle = 'rgba(0, 0, 0, 0.5)'
  context.fillRect(barX, barY, width, height)

  const hpPercentage = Math.max(0, Math.min(1, currentHp / maxHp))
  const currentWidth = width * hpPercentage

  if (hpPercentage > 0.5) {
    context.fillStyle = maxColor
  } else if (hpPercentage > 0.2) {
    context.fillStyle = middleColor
  } else {
    context.fillStyle = minColor
  }

  context.fillRect(barX, barY, currentWidth, height)
}
