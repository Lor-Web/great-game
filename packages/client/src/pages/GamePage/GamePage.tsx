import { useEffect, useState } from 'react'
import { GameStart } from './GameStart/GameStart'
import styles from './game-page.module.css'

export const GamePage = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeLeft, setTimeLeft] = useState(120)

  useEffect(() => {
    if (!isPlaying || timeLeft === 0) {
      return
    }

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [isPlaying, timeLeft])

  return (
    <main className={styles.gamePage}>
      <header className={styles.gameStats}>
        <div>
          <span>SCORE</span>
          <span>000000</span>
        </div>
        <div>
          <span>LIVES</span>
          <span>♥ ♥ ♥</span>
        </div>
        <div>
          <span>WORLD</span>
          <span>1-1</span>
        </div>
        <div>
          <span>TIME</span>
          <span>{timeLeft}</span>
        </div>
      </header>

      {!isPlaying && <GameStart onStart={() => setIsPlaying(true)} />}
    </main>
  )
}
