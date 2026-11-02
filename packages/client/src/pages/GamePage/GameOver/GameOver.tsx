import { Button } from 'antd'
import { Link } from 'react-router-dom'
import { MAIN_PAGE_PATH } from '../../../shared/constants/routes.constant'
import { GameScreen } from '../components/GameScreen/GameScreen'
import screenStyles from '../components/GameScreen/game-screen.module.css'
import styles from './game-over.module.css'

type GameOverProps = {
  onRetry: () => void
}

export const GameOver = ({ onRetry }: GameOverProps) => {
  return (
    <GameScreen>
      <h1>GAME OVER</h1>

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
