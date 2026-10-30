import GameCanvas from './components/GameCanvas/GameCanvas'
import styles from './game.module.css'

const Game = () => (
  <div className={styles.game}>
    <GameCanvas />
  </div>
)

export default Game
