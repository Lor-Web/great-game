import GameCanvas from './components/GameCanvas/GameCanvas'
import styles from './game.module.css'

const Game = () => (
  <main className={styles.game}>
    <GameCanvas />
  </main>
)

export default Game
