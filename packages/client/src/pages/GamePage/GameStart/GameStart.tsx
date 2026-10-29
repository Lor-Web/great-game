import { Button } from 'antd'
import { useEffect, useState } from 'react'
import { COUNTDOWN_SECONDS, GO_DISPLAY_MS } from '../constants'
import styles from './game-start.module.css'

type GameStartProps = {
  onStart: () => void
}

export const GameStart = ({ onStart }: GameStartProps) => {
  const [isCountdown, setIsCountdown] = useState(false)
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS)
  const [showGo, setShowGo] = useState(false)

  useEffect(() => {
    if (!isCountdown) {
      return
    }

    if (showGo) {
      const timer = setTimeout(() => {
        onStart()
      }, GO_DISPLAY_MS)

      return () => clearTimeout(timer)
    }

    const timer = setTimeout(() => {
      if (countdown > 1) {
        setCountdown(prev => prev - 1)
      } else {
        setShowGo(true)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [isCountdown, countdown, showGo, onStart])

  return (
    <>
      {!isCountdown && (
        <div className={styles.hints}>
          <p className={styles.hint}>
            Получай очки за монеты и победы над врагами
          </p>
          <p className={styles.hint}>
            Твои жизни. Каждые 100 монет дают ещё одну!
          </p>
          <p className={styles.hint}>Номер текущего уровня</p>
          <p className={styles.hint}>
            Успей пройти уровень до окончания времени!
          </p>
        </div>
      )}

      <div className={styles.overlay}>
        <div className={styles.startContent}>
          {isCountdown ? (
            <h1>{showGo ? 'GO!' : countdown}</h1>
          ) : (
            <>
              <h1>READY?</h1>
              <Button
                type="primary"
                className={styles.startButton}
                onClick={() => setIsCountdown(true)}>
                START
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  )
}
