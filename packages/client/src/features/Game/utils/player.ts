import type { AppDispatch } from '../../../store'
import { incrementScore } from '../../../store/gameSlice'
import {
  ATTACK_DURATION,
  GAME_WIDTH,
  GROUND_Y,
  PLAYER_CONFIG,
  PREVIEW_SCENE,
} from '../constants'
import { PlayerAnimation } from '../enums'
import {
  checkIfPlayerInFrontOfObject,
  checkIfPlayerOverPlatform,
  checkIfTheSameCoordinates,
  type GameObject,
} from '../helpers'
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
  isAttacking: boolean
  attackAnimationTime: number
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
  isAttacking: false,
  attackAnimationTime: 0,
})

type UpdatePlayerOptions = {
  player: Player
  input: GameInput
  deltaSeconds: number
  coins: Array<GameObject>
  slimes: Array<GameObject>
  dispatch: AppDispatch
}

export const updatePlayer = ({
  player,
  input,
  deltaSeconds,
  coins,
  slimes,
  dispatch,
}: UpdatePlayerOptions) => {
  let direction = 0
  if (input.left) direction -= 1
  if (input.right) direction += 1

  const isFacingSomebody = slimes.some(slime => {
    if ((slime.value ?? 0) <= 0) return false

    return checkIfPlayerInFrontOfObject(player, slime)
  })

  if (isFacingSomebody) {
    if (player.facingLeft && direction < 0) {
      direction = 0
      player.velocityX = 0
    } else if (!player.facingLeft && direction > 0) {
      direction = 0
      player.velocityX = 0
    }
  }

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

  const groudY =
    checkIfPlayerOverPlatform(player) && player.y < GROUND_Y
      ? PREVIEW_SCENE.platform.y
      : GROUND_Y

  player.y += player.velocityY * deltaSeconds

  if (player.x < PLAYER_CONFIG.halfWidth) {
    player.x = PLAYER_CONFIG.halfWidth
    player.velocityX = 0
  }
  if (player.x > GAME_WIDTH - PLAYER_CONFIG.halfWidth) {
    player.x = GAME_WIDTH - PLAYER_CONFIG.halfWidth
    player.velocityX = 0
  }

  if (player.y >= groudY) {
    player.y = groudY
    player.velocityY = 0
    player.grounded = true
  }

  if (input.attackPressed && !player.isAttacking) {
    player.isAttacking = true
    player.attackAnimationTime = 0

    for (const slime of slimes) {
      if (
        (slime.value ?? 0) >= 0 &&
        checkIfPlayerInFrontOfObject(player, slime)
      ) {
        slime.value = Math.max(0, (slime.value ?? 0) - 1)
      }
    }
  }

  input.attackPressed = false

  if (player.isAttacking) {
    player.attackAnimationTime += deltaSeconds

    if (player.attackAnimationTime >= ATTACK_DURATION) {
      player.isAttacking = false
      player.attackAnimationTime = 0
    }
  }

  for (const coin of coins) {
    if (!coin.got && checkIfTheSameCoordinates(player, coin)) {
      coin.got = true
      dispatch(incrementScore(1))
    }
  }

  let animation: Player['animation'] = PlayerAnimation.Idle
  if (!player.grounded) animation = PlayerAnimation.Air
  else if (player.velocityX !== 0) animation = PlayerAnimation.Run

  if (animation !== player.animation) player.animationTime = 0
  player.animation = animation
  player.animationTime += deltaSeconds
}
