const FIXED_STEP = 1 / 60
const MAX_FRAME_TIME = 0.1

type GameLoopOptions = {
  update: (deltaSeconds: number) => void
  render: () => void
}

export const createGameLoop = ({ update, render }: GameLoopOptions) => {
  let frameId: number | null = null
  let running = false
  let previousTime: number | null = null
  let accumulatedTime = 0

  const frame = (time: number) => {
    if (!running) return

    if (previousTime !== null) {
      // requestAnimationFrame передаёт миллисекунды, симуляция работает в секундах.
      const deltaSeconds = (time - previousTime) / 1000
      // После долгого кадра не пытаемся обработать всё пропущенное время.
      accumulatedTime += Math.min(deltaSeconds, MAX_FRAME_TIME)
    }
    previousTime = time

    // На быстрых экранах обновление может пропускаться, на медленных — повторяться.
    while (accumulatedTime >= FIXED_STEP) {
      update(FIXED_STEP)
      accumulatedTime -= FIXED_STEP
    }

    render()
    if (running) frameId = requestAnimationFrame(frame)
  }

  return {
    start: () => {
      if (running) return
      running = true
      previousTime = null
      accumulatedTime = 0
      frameId = requestAnimationFrame(frame)
    },
    stop: () => {
      running = false
      if (frameId !== null) cancelAnimationFrame(frameId)
      frameId = null
      previousTime = null
      accumulatedTime = 0
    },
  }
}
