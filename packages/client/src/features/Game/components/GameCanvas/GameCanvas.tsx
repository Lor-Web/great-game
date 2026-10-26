import { GAME_HEIGHT, GAME_WIDTH } from '../../constants'
import { useGameCanvas } from '../../hooks/useGameCanvas'
import styles from './game-canvas.module.css'

export const GameCanvas = () => {
  const canvasRef = useGameCanvas()

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      width={GAME_WIDTH}
      height={GAME_HEIGHT}
      aria-label="Прототип платформера. Статическая сцена, управление ещё не подключено.">
      Для отображения игры необходим браузер с поддержкой Canvas 2D.
    </canvas>
  )
}
