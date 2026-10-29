import {
  GAME_HEIGHT,
  GAME_WIDTH,
  GROUND_Y,
  PLAYER_CONFIG,
  PREVIEW_HUD,
  PREVIEW_SCENE,
  PREVIEW_STYLE,
  SPRITE_SCALE,
  TILE_SIZE,
  TILE_SOURCE_SIZE,
  WORLD_TILES,
} from './constants'
import { PlayerAnimation, SpriteId } from './enums'
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
}

type DrawPreviewOptions = {
  context: CanvasRenderingContext2D
  images?: GameImages
  failed?: boolean
  elapsedSeconds?: number
  player?: Player
}

export const drawAnimation = ({
  context,
  images,
  clip,
  elapsedSeconds,
  x,
  y,
  facingLeft = false,
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

export const drawPreview = ({
  context,
  images,
  failed = false,
  elapsedSeconds = 0,
  player,
}: DrawPreviewOptions) => {
  context.imageSmoothingEnabled = false
  context.fillStyle = PREVIEW_STYLE.sky
  context.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)

  context.fillStyle = PREVIEW_STYLE.mountains
  context.beginPath()
  const [firstPoint, ...otherPoints] = PREVIEW_SCENE.mountainPoints
  context.moveTo(firstPoint.x, firstPoint.y)
  for (const point of otherPoints) context.lineTo(point.x, point.y)
  context.closePath()
  context.fill()

  const cloud = PREVIEW_SCENE.cloud
  const travelDistance = GAME_WIDTH + cloud.travelWidth
  const distance = elapsedSeconds * cloud.speed
  const cloudX = Math.floor(distance % travelDistance) - cloud.travelWidth
  context.fillStyle = PREVIEW_STYLE.cloud
  context.fillRect(cloudX, cloud.baseY, cloud.baseWidth, cloud.height)
  context.fillRect(
    cloudX + cloud.topX,
    cloud.topY,
    cloud.topWidth,
    cloud.height
  )

  if (images) {
    const tileset = images[SpriteId.World]
    const { grass, dirt } = WORLD_TILES
    for (let x = 0; x < GAME_WIDTH; x += TILE_SIZE) {
      context.drawImage(
        tileset,
        grass.x,
        grass.y,
        TILE_SOURCE_SIZE,
        TILE_SOURCE_SIZE,
        x,
        GROUND_Y,
        TILE_SIZE,
        TILE_SIZE
      )
      context.drawImage(
        tileset,
        dirt.x,
        dirt.y,
        TILE_SOURCE_SIZE,
        TILE_SOURCE_SIZE,
        x,
        GROUND_Y + TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE
      )
    }
    const platform = PREVIEW_SCENE.platform
    const platformRight = platform.x + platform.width
    for (let x = platform.x; x < platformRight; x += TILE_SIZE) {
      context.drawImage(
        tileset,
        grass.x,
        grass.y,
        TILE_SOURCE_SIZE,
        TILE_SOURCE_SIZE,
        x,
        platform.y,
        TILE_SIZE,
        TILE_SIZE
      )
    }
    if (player) {
      const clip =
        player.animation === PlayerAnimation.Run
          ? animations.knightRun
          : animations.knightIdle
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
    }
    for (const slime of PREVIEW_SCENE.slimes) {
      drawAnimation({
        context,
        images,
        clip: animations.slimeIdle,
        elapsedSeconds,
        x: slime.x,
        y: slime.y,
        facingLeft: slime.facingLeft,
      })
    }
    drawAnimation({
      context,
      images,
      clip: animations.coinSpin,
      elapsedSeconds,
      x: PREVIEW_SCENE.coin.x,
      y: PREVIEW_SCENE.coin.y,
    })
  }
}
