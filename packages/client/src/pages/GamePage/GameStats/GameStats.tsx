import styles from './game-stats.module.css'

type GameStatsProps = {
  score: number
  lives: number
  world: string
  timeLeft: number
}

export const GameStats = ({
  score,
  lives,
  world,
  timeLeft,
}: GameStatsProps) => {
  return (
    <header className={styles.gameStats}>
      <div>
        <span>SCORE</span>
        <span>{String(score).padStart(6, '0')}</span>
      </div>
      <div>
        <span>LIVES</span>
        <span>{'♥ '.repeat(lives)}</span>
      </div>
      <div>
        <span>WORLD</span>
        <span>{world}</span>
      </div>
      <div>
        <span>TIME</span>
        <span>{timeLeft}</span>
      </div>
    </header>
  )
}
