import type { AppDispatch } from '../../../store'
import { incrementScore } from '../../../store/gameSlice'
import { ATTACK_DURATION, PLAYER_CONFIG } from '../constants'
import { PlayerAnimation } from '../enums'
import {
  checkIfPlayerInFrontOfObject,
  checkIfTheSameCoordinates,
} from '../helpers'
import {
  type Coin,
  ISLANDS,
  type Island,
  type Slime,
  SPAWN,
  WORLD_WIDTH,
} from '../level'
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
  attack: {
    isAttacking: boolean
    attackAnimationTime: number
    success: boolean
  }
}

export const createPlayer = (spawn = SPAWN): Player => ({
  x: spawn.x,
  y: spawn.y,
  velocityX: 0,
  velocityY: 0,
  grounded: true,
  facingLeft: false,
  animation: PlayerAnimation.Idle,
  animationTime: 0,
  attack: {
    isAttacking: false,
    attackAnimationTime: 0,
    success: false,
  },
})

type UpdatePlayerOptions = {
  player: Player
  input: GameInput
  deltaSeconds: number
  coins: Coin[]
  slimes: Slime[]
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
    if (slime.hp <= 0 || direction === 0) return false

    return checkIfPlayerInFrontOfObject(
      { ...player, facingLeft: direction < 0 },
      slime
    )
  })

  if (isFacingSomebody) {
    player.facingLeft = direction < 0
    direction = 0
    player.velocityX = 0
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

  const previousY = player.y
  player.velocityY += PLAYER_CONFIG.gravity * deltaSeconds
  const nextX = player.x + player.velocityX * deltaSeconds
  player.x = Math.max(
    PLAYER_CONFIG.halfWidth,
    Math.min(nextX, WORLD_WIDTH - PLAYER_CONFIG.halfWidth)
  )
  if (player.x !== nextX) player.velocityX = 0
  player.y += player.velocityY * deltaSeconds

  let landing: Island | undefined
  if (player.velocityY >= 0) {
    for (const island of ISLANDS) {
      if (
        previousY <= island.y &&
        player.y >= island.y &&
        player.x + PLAYER_CONFIG.halfWidth > island.x &&
        player.x - PLAYER_CONFIG.halfWidth < island.x + island.width &&
        (!landing || island.y < landing.y)
      ) {
        landing = island
      }
    }
  }

  player.grounded = landing !== undefined
  if (landing) {
    player.y = landing.y
    player.velocityY = 0
  }

  if (input.attackPressed && !player.attack.isAttacking) {
    player.attack.isAttacking = true
    player.attack.attackAnimationTime = 0
    player.attack.success = false
    input.attackPressed = false
  }

  if (player.attack.isAttacking) {
    player.attack.attackAnimationTime += deltaSeconds

    if (
      player.attack.attackAnimationTime > ATTACK_DURATION / 2 &&
      !player.attack.success
    ) {
      for (const slime of slimes) {
        if (slime.hp > 0 && checkIfPlayerInFrontOfObject(player, slime)) {
          slime.hp -= 1
          player.attack.success = true
        }
      }
    }

    if (player.attack.attackAnimationTime >= ATTACK_DURATION) {
      player.attack.isAttacking = false
      player.attack.attackAnimationTime = 0
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

  return landing
}
