import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import Game from '../../features/Game/Game'
import { MAIN_PAGE_PATH } from '../../shared/constants/routes.constant'
import { restore } from '../../store/gameSlice'
import {
  type CharacterSkin,
  DIFFICULTY_SETTINGS,
  type Difficulty,
} from './constants'
import { GameOver } from './GameOver/GameOver'
import { GameStart } from './GameStart/GameStart'
import { GameStats } from './GameStats/GameStats'

import styles from './game-page.module.css'

type GameStatus = 'ready' | 'playing' | 'finished'

export const GamePage = () => {
  const dispatch = useDispatch()
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [selectedSkin, setSelectedSkin] = useState<CharacterSkin>('knight')
  const { lives, duration } = DIFFICULTY_SETTINGS[difficulty]
  const [gameStatus, setGameStatus] = useState<GameStatus>('ready')
  const [timeLeft, setTimeLeft] = useState<number>(duration)
  const [gameSession, setGameSession] = useState(0)
  const [gameStats, setGameStats] = useState({
    lives,
    world: 1,
  })

  useEffect(() => {
    dispatch(restore())
  }, [dispatch])

  useEffect(() => {
    if (gameStatus !== 'playing') {
      return
    }

    const endTime = Date.now() + duration * 1000

    const timer = setInterval(() => {
      const remainingSeconds = Math.max(
        0,
        Math.ceil((endTime - Date.now()) / 1000)
      )
      setTimeLeft(remainingSeconds)
    }, 1000)

    return () => clearInterval(timer)
  }, [gameStatus, duration])

  useEffect(() => {
    if (gameStatus === 'playing' && (timeLeft === 0 || gameStats.lives <= 0)) {
      setGameStatus('finished')
    }
  }, [gameStatus, timeLeft, gameStats.lives])

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    const settings = DIFFICULTY_SETTINGS[newDifficulty]

    setDifficulty(newDifficulty)
    setTimeLeft(settings.duration)
    setGameStats({
      lives: settings.lives,
      world: 1,
    })
  }

  const handleRetry = () => {
    dispatch(restore())
    setGameSession(prev => prev + 1)
    setTimeLeft(duration)
    setGameStats({
      lives,
      world: 1,
    })
    setGameStatus('ready')
  }

  return (
    <main className={styles.gamePage}>
      {gameStatus !== 'finished' && (
        <Link to={MAIN_PAGE_PATH} className={styles.backButton}>
          MAIN MENU
        </Link>
      )}

      <GameStats
        lives={gameStats.lives}
        world={gameStats.world}
        timeLeft={timeLeft}
      />

      <Game
        key={gameSession}
        isPlaying={gameStatus === 'playing'}
        selectedSkin={selectedSkin}
      />

      {gameStatus === 'ready' && (
        <GameStart
          difficulty={difficulty}
          onDifficultyChange={handleDifficultyChange}
          selectedSkin={selectedSkin}
          onSkinChange={setSelectedSkin}
          onStart={() => setGameStatus('playing')}
        />
      )}

      {gameStatus === 'finished' && <GameOver onRetry={handleRetry} />}
    </main>
  )
}

export default GamePage
