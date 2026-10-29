export const GAME_WIDTH = 640
export const GAME_HEIGHT = 360
export const SPRITE_SCALE = 2
export const TILE_SOURCE_SIZE = 16
export const TILE_SIZE = TILE_SOURCE_SIZE * SPRITE_SCALE
export const GROUND_Y = 296

export const PLAYER_CONFIG = {
  startX: 100,
  maxSpeed: 180,
  acceleration: 900,
  braking: 1200,
  gravity: 1100,
  jumpSpeed: 400,
  halfWidth: 12,
  spriteBottomOffset: 8,
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

export const PREVIEW_SCENE = {
  mountainPoints: [
    { x: 0, y: GROUND_Y },
    { x: 128, y: 184 },
    { x: 256, y: GROUND_Y },
    { x: 432, y: 168 },
    { x: GAME_WIDTH, y: GROUND_Y },
  ],
  platform: { x: 256, y: 216, width: 128 },
  slimes: [
    { x: 448, y: GROUND_Y, facingLeft: false },
    { x: 528, y: GROUND_Y, facingLeft: true },
  ],
  coin: { x: 320, y: 200 },
  cloud: {
    travelWidth: 80,
    speed: 12,
    baseY: 128,
    baseWidth: 64,
    topX: 16,
    topY: 112,
    topWidth: 32,
    height: 16,
  },
}

export const PREVIEW_STYLE = {
  sky: '#92c9e8',
  mountains: '#71a888',
  cloud: '#e5f3fa',
  hudBackground: '#17283e',
  text: '#ffffff',
  titleFont: 'bold 20px monospace',
  messageFont: '14px monospace',
}

export const PREVIEW_HUD = {
  x: 20,
  y: 20,
  width: 600,
  height: 76,
  textX: 36,
  titleY: 50,
  messageY: 78,
  title: 'GREAT GAME / DEV',
  loading: 'Загрузка графики…',
  error: 'Не удалось загрузить графику. Обновите страницу.',
  controls: 'A/D или ←/→ — движение · Space — прыжок',
}
