import { useEffect, useState } from 'react'
import { GameStart } from './GameStart/GameStart'
import { GameStats } from './GameStats/GameStats'
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
      <GameStats score={0} lives={3} world="1-1" timeLeft={timeLeft} />

      {!isPlaying && <GameStart onStart={() => setIsPlaying(true)} />}
    </main>
  )
}
