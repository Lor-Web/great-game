import { GAME_WIDTH } from '../constants'
import type { GameInput } from './keyboard'

export const GROUND_Y = 296
const MAX_SPEED = 180
const ACCELERATION = 900
const BRAKING = 1200
const GRAVITY = 1100
const JUMP_SPEED = 400
const PLAYER_HALF_WIDTH = 12

export type Player = {
  x: number
  y: number
  velocityX: number
  velocityY: number
  grounded: boolean
  facingLeft: boolean
  animation: 'idle' | 'run' | 'air'
  animationTime: number
}

export const createPlayer = (): Player => ({
  x: 100,
  y: GROUND_Y,
  velocityX: 0,
  velocityY: 0,
  grounded: true,
  facingLeft: false,
  animation: 'idle',
  animationTime: 0,
})

type UpdatePlayerOptions = {
  player: Player
  input: GameInput
  deltaSeconds: number
}

export const updatePlayer = ({
  player,
  input,
  deltaSeconds,
}: UpdatePlayerOptions) => {
  let direction = 0
  if (input.left) direction -= 1
  if (input.right) direction += 1

  if (direction !== 0) {
    player.velocityX += direction * ACCELERATION * deltaSeconds
    player.velocityX = Math.max(
      -MAX_SPEED,
      Math.min(player.velocityX, MAX_SPEED)
    )
    player.facingLeft = direction < 0
  } else {
    // Уменьшаем модуль скорости, не позволяя торможению развернуть героя.
    const speed = Math.max(
      0,
      Math.abs(player.velocityX) - BRAKING * deltaSeconds
    )
    player.velocityX = Math.sign(player.velocityX) * speed
  }

  if (input.jumpPressed && player.grounded) {
    player.velocityY = -JUMP_SPEED
    player.grounded = false
  }
  // Нажатие обрабатывается один раз, даже если за кадр было несколько шагов.
  input.jumpPressed = false

  player.velocityY += GRAVITY * deltaSeconds
  player.x += player.velocityX * deltaSeconds
  player.y += player.velocityY * deltaSeconds

  // Временные границы экрана и земля
  if (player.x < PLAYER_HALF_WIDTH) {
    player.x = PLAYER_HALF_WIDTH
    player.velocityX = 0
  }
  if (player.x > GAME_WIDTH - PLAYER_HALF_WIDTH) {
    player.x = GAME_WIDTH - PLAYER_HALF_WIDTH
    player.velocityX = 0
  }
  if (player.y >= GROUND_Y) {
    player.y = GROUND_Y
    player.velocityY = 0
    player.grounded = true
  }

  let animation: Player['animation'] = 'idle'
  if (!player.grounded) animation = 'air'
  else if (player.velocityX !== 0) animation = 'run'

  if (animation !== player.animation) player.animationTime = 0
  player.animation = animation
  player.animationTime += deltaSeconds
}
