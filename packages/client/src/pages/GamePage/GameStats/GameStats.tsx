import styles from './game-stats.module.css'

type GameStatsProps = {
  score: number
  lives: number
  world: number
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
        <span aria-label={`Осталось жизней: ${lives}`} role="img">
          <span aria-hidden="true">{'♥ '.repeat(lives)}</span>
        </span>
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
