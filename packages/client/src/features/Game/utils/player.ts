import { GAME_WIDTH, GROUND_Y, PLAYER_CONFIG } from '../constants'
import { PlayerAnimation } from '../enums'
import type { GameInput } from './keyboard'

export type Player = {
  x: number
  y: number
  velocityX: number
  velocityY: number
  grounded: boolean
  facingLeft: boolean
  animation: PlayerAnimation
  animationTime: number
}

export const createPlayer = (): Player => ({
  x: PLAYER_CONFIG.startX,
  y: GROUND_Y,
  velocityX: 0,
  velocityY: 0,
  grounded: true,
  facingLeft: false,
  animation: PlayerAnimation.Idle,
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
    player.velocityX += direction * PLAYER_CONFIG.acceleration * deltaSeconds
    player.velocityX = Math.max(
      -PLAYER_CONFIG.maxSpeed,
      Math.min(player.velocityX, PLAYER_CONFIG.maxSpeed)
    )
    player.facingLeft = direction < 0
  } else {
    // Уменьшаем модуль скорости, не позволяя торможению развернуть героя.
    const speed = Math.max(
      0,
      Math.abs(player.velocityX) - PLAYER_CONFIG.braking * deltaSeconds
    )
    player.velocityX = Math.sign(player.velocityX) * speed
  }

  if (input.jumpPressed && player.grounded) {
    player.velocityY = -PLAYER_CONFIG.jumpSpeed
    player.grounded = false
  }
  // Нажатие обрабатывается один раз, даже если за кадр было несколько шагов.
  input.jumpPressed = false

  player.velocityY += PLAYER_CONFIG.gravity * deltaSeconds
  player.x += player.velocityX * deltaSeconds
  player.y += player.velocityY * deltaSeconds

  // Временные границы экрана и земля
  if (player.x < PLAYER_CONFIG.halfWidth) {
    player.x = PLAYER_CONFIG.halfWidth
    player.velocityX = 0
  }
  if (player.x > GAME_WIDTH - PLAYER_CONFIG.halfWidth) {
    player.x = GAME_WIDTH - PLAYER_CONFIG.halfWidth
    player.velocityX = 0
  }
  if (player.y >= GROUND_Y) {
    player.y = GROUND_Y
    player.velocityY = 0
    player.grounded = true
  }

  let animation: Player['animation'] = PlayerAnimation.Idle
  if (!player.grounded) animation = PlayerAnimation.Air
  else if (player.velocityX !== 0) animation = PlayerAnimation.Run

  if (animation !== player.animation) player.animationTime = 0
  player.animation = animation
  player.animationTime += deltaSeconds
}
