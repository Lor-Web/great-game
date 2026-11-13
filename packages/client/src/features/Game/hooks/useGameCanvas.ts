import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { incrementScore } from '../../../store/gameSlice'
import { PREVIEW_SCENE } from '../constants'
import { drawPreview } from '../helpers'
import { createGameLoop } from '../utils/gameLoop'
import { GameObject } from '../utils/gameObject'
import { createKeyboardControls } from '../utils/keyboard'
import { loadGameImages } from '../utils/loader'
import type { GameImages } from '../utils/manifest'
import { createPlayer, updatePlayer } from '../utils/player'

export const useGameCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dispatch = useDispatch()

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    let disposed = false
    let images: GameImages | undefined
    let failed = false
    const player = createPlayer()
    const coins = PREVIEW_SCENE.coins.map(coin => new GameObject(coin))
    const slimes = PREVIEW_SCENE.slimes.map(slime => new GameObject(slime))
    const controls = createKeyboardControls(canvas)

    let elapsedSeconds = 0
    const loop = createGameLoop({
      update: deltaSeconds => {
        elapsedSeconds += deltaSeconds
        updatePlayer({
          player,
          input: controls.input,
          deltaSeconds,
          slimes,
          coins,
          dispatch,
        })
      },
      render: () => {
        drawPreview({
          context,
          images,
          failed,
          elapsedSeconds,
          player,
          coins,
          slimes,
        })
      },
    })
    const syncVisibility = () => {
      if (document.hidden || !images) {
        controls.reset()
        loop.stop()
      } else loop.start()
    }
    drawPreview({ context, slimes })
    // Симуляция начинается только после загрузки всех необходимых спрайтов.
    loadGameImages()
      .then(loadedImages => {
        if (disposed) return
        images = loadedImages
        controls.reset()
        drawPreview({ context, images, player })
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
      controls.dispose()
      document.removeEventListener('visibilitychange', syncVisibility)
    }
  }, [dispatch])

  return canvasRef
}
