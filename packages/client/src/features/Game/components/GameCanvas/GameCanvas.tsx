import type { CharacterSkin } from '../../../../pages/GamePage/constants'
import { GAME_HEIGHT, GAME_WIDTH } from '../../constants'
import { useGameCanvas } from '../../hooks/useGameCanvas'
import styles from './game-canvas.module.css'

interface GameCanvasProps {
  isPlaying: boolean
  selectedSkin: CharacterSkin
}

const GameCanvas = ({ isPlaying, selectedSkin }: GameCanvasProps) => {
  const canvasRef = useGameCanvas(isPlaying, selectedSkin)
  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      width={GAME_WIDTH}
      height={GAME_HEIGHT}
      tabIndex={0}
      aria-label="Игровое поле игры">
      Для отображения игры необходим браузер с поддержкой Canvas 2D.
    </canvas>
  )
}

export default GameCanvas
