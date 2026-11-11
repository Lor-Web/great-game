import GameCanvas from './components/GameCanvas/GameCanvas'
import type { CharacterSkin } from './constants'
import styles from './game.module.css'

interface GameProps {
  isPlaying: boolean
  selectedSkin: CharacterSkin
}

const Game = ({ isPlaying, selectedSkin }: GameProps) => (
  <div className={styles.game}>
    <GameCanvas isPlaying={isPlaying} selectedSkin={selectedSkin} />
  </div>
)

export default Game
