import { useEffect, useState } from 'react'
import Game from '../../features/Game/Game'
import { GAME_DURATION_SECONDS } from './constants'
import { GameStart } from './GameStart/GameStart'
import { GameStats } from './GameStats/GameStats'
import styles from './game-page.module.css'

export const GamePage = () => {
  type GameStatus = 'ready' | 'playing' | 'finished'

  const [gameStatus, setGameStatus] = useState<GameStatus>('ready')
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION_SECONDS)
  const [gameStats, setGameStats] = useState({
    score: 0,
    lives: 3,
    world: 1,
  })

  // Для обновления статистики после добавления игровой логики
  void setGameStats

  useEffect(() => {
    if (gameStatus !== 'playing') {
      return
    }

    const endTime = Date.now() + GAME_DURATION_SECONDS * 1000

    const timer = setInterval(() => {
      const remainingSeconds = Math.max(
        0,
        Math.ceil((endTime - Date.now()) / 1000)
      )
      setTimeLeft(remainingSeconds)

      if (remainingSeconds === 0) {
        setGameStatus('finished')
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [gameStatus])

  return (
    <main className={styles.gamePage}>
      <GameStats
        score={gameStats.score}
        lives={gameStats.lives}
        world={gameStats.world}
        timeLeft={timeLeft}
      />

      <Game />

      {gameStatus === 'ready' && (
        <GameStart onStart={() => setGameStatus('playing')} />
      )}
    </main>
  )
}

export default GamePage
