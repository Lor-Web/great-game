import { useEffect, useRef } from 'react'
import { loadGameImages } from '../assets/loader'
import type { GameImages } from '../assets/manifest'
import { createGameLoop } from '../core/gameLoop'
import { drawPreview } from '../helpers'

export const useGameCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    let disposed = false
    let images: GameImages | undefined
    let failed = false
    // Храним время вне React state, чтобы не перерисовывать компонент каждый кадр.
    let elapsedSeconds = 0
    const loop = createGameLoop({
      update: deltaSeconds => {
        elapsedSeconds += deltaSeconds
      },
      render: () => {
        drawPreview({ context, images, failed, elapsedSeconds })
      },
    })
    const syncVisibility = () => {
      if (document.hidden || !images) loop.stop()
      else loop.start()
    }
    drawPreview({ context })
    // Симуляция начинается только после загрузки всех необходимых спрайтов.
    loadGameImages()
      .then(loadedImages => {
        if (disposed) return
        images = loadedImages
        drawPreview({ context, images })
        syncVisibility()
      })
      .catch(() => {
        if (disposed) return
        failed = true
        drawPreview({ context, failed })
      })
    document.addEventListener('visibilitychange', syncVisibility)
    syncVisibility()

    return () => {
      disposed = true
      loop.stop()
      document.removeEventListener('visibilitychange', syncVisibility)
    }
  }, [])

  return canvasRef
}
