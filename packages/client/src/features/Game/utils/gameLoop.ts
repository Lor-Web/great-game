import { LOOP_CONFIG } from '../constants'

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
      const deltaSeconds =
        (time - previousTime) / LOOP_CONFIG.millisecondsPerSecond
      // После долгого кадра не пытаемся обработать всё пропущенное время.
      accumulatedTime += Math.min(deltaSeconds, LOOP_CONFIG.maxFrameTime)
    }
    previousTime = time

    // На быстрых экранах обновление может пропускаться, на медленных — повторяться.
    while (accumulatedTime >= LOOP_CONFIG.fixedStep) {
      update(LOOP_CONFIG.fixedStep)
      accumulatedTime -= LOOP_CONFIG.fixedStep
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
