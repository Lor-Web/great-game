export type GameObjectProps = {
  x: number
  y: number
  value?: number //сколько очков приносит
  got?: boolean
  facingLeft?: boolean
}

export class GameObject {
  x: number = 0
  y: number = 0
  value?: number
  got?: boolean
  facingLeft?: boolean

  constructor({ x, y, value, got, facingLeft }: GameObjectProps) {
    this.y = y
    this.x = x
    this.value = value
    this.got = got
    this.facingLeft = facingLeft
  }
}
