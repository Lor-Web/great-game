import { GameCanvas } from './components/GameCanvas/GameCanvas'
import styles from './game.module.css'

export const Game = () => (
  <main className={styles.game}>
    <GameCanvas />
  </main>
)
