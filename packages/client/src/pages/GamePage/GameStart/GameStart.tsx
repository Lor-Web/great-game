import { Button } from 'antd'
import { useEffect, useState } from 'react'
import styles from './game-start.module.css'

type GameStartProps = {
  onStart: () => void
}

export const GameStart = ({ onStart }: GameStartProps) => {
  const [isCountdown, setIsCountdown] = useState(false)
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    if (!isCountdown) {
      return
    }

    const timer = setTimeout(() => {
      if (countdown > 0) {
        setCountdown(prev => prev - 1)
      } else {
        onStart()
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [isCountdown, countdown, onStart])

  return (
    <>
      {!isCountdown && (
        <div className={styles.hints}>
          <p className={styles.hint}>
            Получай очки за монеты и победы над врагами
          </p>
          <p className={styles.hint}>
            У тебя 3 жизни. Каждые 100 монет дают ещё одну!
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
            <h1>{countdown === 0 ? 'GO!' : countdown}</h1>
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
