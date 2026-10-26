import { GAME_HEIGHT, GAME_WIDTH } from './constants'
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

  const width = clip.frameWidth * 2
  const height = clip.frameHeight * 2
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
  context.fillStyle = '#92c9e8'
  context.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)

  context.fillStyle = '#71a888'
  context.beginPath()
  context.moveTo(0, 296)
  context.lineTo(128, 184)
  context.lineTo(256, 296)
  context.lineTo(432, 168)
  context.lineTo(640, 296)
  context.closePath()
  context.fill()

  // Облако движется со скоростью 12 пикселей в секунду и возвращается слева.
  const cloudWidth = 80
  const cloudSpeed = 12
  const travelDistance = GAME_WIDTH + cloudWidth
  const distance = elapsedSeconds * cloudSpeed
  const cloudX = Math.floor(distance % travelDistance) - cloudWidth
  context.fillStyle = '#e5f3fa'
  context.fillRect(cloudX, 128, 64, 16)
  context.fillRect(cloudX + 16, 112, 32, 16)

  if (images) {
    const tileset = images.world
    for (let x = 0; x < GAME_WIDTH; x += 32) {
      context.drawImage(tileset, 0, 0, 16, 16, x, 296, 32, 32)
      context.drawImage(tileset, 0, 16, 16, 16, x, 328, 32, 32)
    }
    for (let x = 256; x < 384; x += 32) {
      context.drawImage(tileset, 0, 0, 16, 16, x, 216, 32, 32)
    }
    if (player) {
      const clip =
        player.animation === 'run'
          ? animations.knightRun
          : animations.knightIdle
      const animationTime =
        player.animation === 'air' ? 0 : player.animationTime
      drawAnimation({
        context,
        images,
        clip,
        elapsedSeconds: animationTime,
        x: player.x,
        y: player.y + 8, // У спрайта с рыцарем лишние пустые пиксели снизу
        facingLeft: player.facingLeft,
      })
    }
    drawAnimation({
      context,
      images,
      clip: animations.slimeIdle,
      elapsedSeconds,
      x: 448,
      y: 296,
    })
    drawAnimation({
      context,
      images,
      clip: animations.slimeIdle,
      elapsedSeconds,
      x: 528,
      y: 296,
      facingLeft: true,
    })
    drawAnimation({
      context,
      images,
      clip: animations.coinSpin,
      elapsedSeconds,
      x: 320,
      y: 200,
    })
  }

  context.fillStyle = '#17283e'
  context.fillRect(20, 20, 600, 76)
  context.fillStyle = '#ffffff'
  context.font = 'bold 20px monospace'
  context.fillText('GREAT GAME / DEV', 36, 50)
  context.font = '14px monospace'
  let message = 'Загрузка графики…'
  if (failed) {
    message = 'Не удалось загрузить графику. Обновите страницу.'
  } else if (images) {
    message = 'A/D или ←/→ — движение · Space — прыжок'
  }
  context.fillText(message, 36, 78)
}
