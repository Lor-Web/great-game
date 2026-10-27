import { GameKey } from '../enums'

export type GameInput = {
  left: boolean
  right: boolean
  jumpPressed: boolean
}

export const createKeyboardControls = (canvas: HTMLCanvasElement) => {
  const keys = new Set<string>()
  const input: GameInput = { left: false, right: false, jumpPressed: false }
  const gameKeys = Object.values(GameKey) as string[]

  const updateDirection = () => {
    input.left = keys.has(GameKey.Left) || keys.has(GameKey.ArrowLeft)
    input.right = keys.has(GameKey.Right) || keys.has(GameKey.ArrowRight)
  }

  const reset = () => {
    keys.clear()
    input.left = false
    input.right = false
    input.jumpPressed = false
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (!gameKeys.includes(event.code)) return
    event.preventDefault()
    // Удержание Space не запускает новый прыжок после приземления.
    if (
      event.code === GameKey.Jump &&
      !event.repeat &&
      !keys.has(GameKey.Jump)
    ) {
      input.jumpPressed = true
    }
    keys.add(event.code)
    updateDirection()
  }

  const onKeyUp = (event: KeyboardEvent) => {
    keys.delete(event.code)
    updateDirection()
  }

  const focusCanvas = () => canvas.focus({ preventScroll: true })
  canvas.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  canvas.addEventListener('blur', reset)
  window.addEventListener('blur', reset)
  canvas.addEventListener('pointerdown', focusCanvas)
  focusCanvas()

  return {
    input,
    reset,
    dispose: () => {
      reset()
      canvas.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      canvas.removeEventListener('blur', reset)
      window.removeEventListener('blur', reset)
      canvas.removeEventListener('pointerdown', focusCanvas)
    },
  }
}
