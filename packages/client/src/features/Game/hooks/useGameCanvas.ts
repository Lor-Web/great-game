import { useEffect, useRef } from 'react'
import { drawPreview } from '../helpers'

export function useGameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    let disposed = false
    const image = new Image()
    drawPreview(context)
    image.onload = () => {
      if (!disposed) drawPreview(context, image)
    }
    image.onerror = () => {
      if (!disposed) drawPreview(context, undefined, true)
    }
    image.src = `${import.meta.env.BASE_URL}game-assets/sprites/world_tileset.png`

    return () => {
      disposed = true
      image.onload = null
      image.onerror = null
    }
  }, [])

  return canvasRef
}
