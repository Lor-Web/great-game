import GameCanvas from './components/GameCanvas/GameCanvas'
import type { CharacterSkin } from './constants'
import styles from './game.module.css'

interface GameProps {
  isPlaying: boolean
  selectedSkin: CharacterSkin
  onFall: () => void
  onComplete: () => void
}

const Game = ({ isPlaying, selectedSkin, onFall, onComplete }: GameProps) => (
  <div className={styles.game}>
    <GameCanvas
      isPlaying={isPlaying}
      selectedSkin={selectedSkin}
      onFall={onFall}
      onComplete={onComplete}
    />
  </div>
)

export default Game
