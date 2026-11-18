import { Button } from 'antd'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { MAIN_PAGE_PATH } from '../../../shared/constants/routes.constant'
import type { RootState } from '../../../store'
import { GameScreen } from '../components/GameScreen/GameScreen'
import screenStyles from '../components/GameScreen/game-screen.module.css'
import styles from './game-over.module.css'

type GameOverProps = {
  won: boolean
  onRetry: () => void
}

export const GameOver = ({ won, onRetry }: GameOverProps) => {
  const score = useSelector((state: RootState) => state.game.score)

  return (
    <GameScreen>
      <h1>{won ? 'LEVEL COMPLETE' : 'GAME OVER'}</h1>

      <p className={styles.score}>ВАШ СЧЁТ: {score}</p>

      <Button type="primary" className={screenStyles.button} onClick={onRetry}>
        RETRY
      </Button>

      <Link
        to={MAIN_PAGE_PATH}
        className={`${screenStyles.button} ${styles.menuLink}`}>
        MAIN MENU
      </Link>
    </GameScreen>
  )
}
