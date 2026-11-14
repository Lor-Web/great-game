import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import type { CharacterSkin } from '../constants'
import { GAME_HEIGHT } from '../constants'
import { drawLevel } from '../helpers'
import { createLevel, EXIT, SPAWN } from '../level'
import { createGameLoop } from '../utils/gameLoop'
import { createKeyboardControls } from '../utils/keyboard'
import { loadGameImages } from '../utils/loader'
import type { GameImages } from '../utils/manifest'
import { createPlayer, updatePlayer } from '../utils/player'

export const useGameCanvas = (
  isPlaying: boolean,
  selectedSkin: CharacterSkin,
  onFall: () => void,
  onComplete: () => void
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isPlayingRef = useRef(isPlaying)
  const selectedSkinRef = useRef<CharacterSkin>(selectedSkin)
  const syncVisibilityRef = useRef<(() => void) | null>(null)
  const redrawRef = useRef<(() => void) | null>(null)
  const dispatch = useDispatch()

  useEffect(() => {
    isPlayingRef.current = isPlaying
    if (isPlaying) {
      canvasRef.current?.focus()
    }
    syncVisibilityRef.current?.()
  }, [isPlaying])

  useEffect(() => {
    selectedSkinRef.current = selectedSkin
    redrawRef.current?.()
  }, [selectedSkin])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    let disposed = false
    let images: GameImages | undefined
    let failed = false
    let player = createPlayer()
    let checkpoint = SPAWN
    let completed = false
    const { coins, slimes } = createLevel()
    const controls = createKeyboardControls(canvas)

    let elapsedSeconds = 0
    const render = () => {
      drawLevel({
        context,
        images,
        failed,
        elapsedSeconds,
        player,
        coins,
        slimes,
        checkpointX: checkpoint.x,
        selectedSkin: selectedSkinRef.current,
      })
    }
    const loop = createGameLoop({
      update: deltaSeconds => {
        if (completed) return
        elapsedSeconds += deltaSeconds
        const landing = updatePlayer({
          player,
          input: controls.input,
          deltaSeconds,
          slimes,
          coins,
          dispatch,
        })
        if (landing?.checkpoint) {
          checkpoint = { x: landing.x + 24, y: landing.y }
        }
        if (player.y > GAME_HEIGHT + 32) {
          player = createPlayer(checkpoint)
          controls.reset()
          onFall()
        } else if (
          player.grounded &&
          player.y === EXIT.y &&
          Math.abs(player.x - EXIT.x) <= 12 &&
          slimes.every(slime => slime.hp <= 0)
        ) {
          completed = true
          onComplete()
        }
      },
      render,
    })
    redrawRef.current = () => {
      if (!isPlayingRef.current) render()
    }
    const syncVisibility = () => {
      if (document.hidden || !images || !isPlayingRef.current) {
        controls.reset()
        loop.stop()
      } else loop.start()
    }
    syncVisibilityRef.current = syncVisibility
    render()
    // Симуляция начинается только после загрузки всех необходимых спрайтов.
    loadGameImages()
      .then(loadedImages => {
        if (disposed) return
        images = loadedImages
        controls.reset()
        render()
        syncVisibility()
      })
      .catch(() => {
        if (disposed) return
        failed = true
        render()
      })
    document.addEventListener('visibilitychange', syncVisibility)
    syncVisibility()

    return () => {
      disposed = true
      redrawRef.current = null
      syncVisibilityRef.current = null
      loop.stop()
      controls.dispose()
      document.removeEventListener('visibilitychange', syncVisibility)
    }
  }, [dispatch, onFall, onComplete])

  return canvasRef
}
