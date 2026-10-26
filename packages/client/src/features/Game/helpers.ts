import { GAME_HEIGHT, GAME_WIDTH } from './constants'

// Static preview only. Simulation and the game loop will be added separately.
export function drawPreview(
  context: CanvasRenderingContext2D,
  tileset?: HTMLImageElement,
  failed = false
) {
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

  if (tileset) {
    for (let x = 0; x < GAME_WIDTH; x += 32) {
      context.drawImage(tileset, 0, 0, 16, 16, x, 296, 32, 32)
      context.drawImage(tileset, 0, 16, 16, 16, x, 328, 32, 32)
    }
    for (let x = 256; x < 384; x += 32) {
      context.drawImage(tileset, 0, 0, 16, 16, x, 216, 32, 32)
    }
  }

  context.fillStyle = '#17283e'
  context.fillRect(20, 20, 600, 76)
  context.fillStyle = '#ffffff'
  context.font = 'bold 20px monospace'
  context.fillText('GREAT GAME / DEV', 36, 50)
  context.font = '14px monospace'
  context.fillText(
    failed
      ? 'Не удалось загрузить графику. Обновите страницу.'
      : tileset
        ? 'Статическая сцена · управление появится позже'
        : 'Загрузка графики…',
    36,
    78
  )
}
