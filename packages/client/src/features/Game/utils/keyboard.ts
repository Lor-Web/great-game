export type GameInput = {
  left: boolean
  right: boolean
  jumpPressed: boolean
}

export const createKeyboardControls = (canvas: HTMLCanvasElement) => {
  const keys = new Set<string>()
  const input: GameInput = { left: false, right: false, jumpPressed: false }
  const gameKeys = ['KeyA', 'KeyD', 'ArrowLeft', 'ArrowRight', 'Space']

  const updateDirection = () => {
    input.left = keys.has('KeyA') || keys.has('ArrowLeft')
    input.right = keys.has('KeyD') || keys.has('ArrowRight')
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
    if (event.code === 'Space' && !event.repeat && !keys.has('Space')) {
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
