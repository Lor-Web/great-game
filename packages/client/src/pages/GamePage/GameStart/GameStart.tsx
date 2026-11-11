import { Button } from 'antd'
import { useEffect, useState } from 'react'
import {
  CHARACTER_SKINS,
  type CharacterSkin,
} from '../../../features/Game/constants'
import { GameScreen } from '../components/GameScreen/GameScreen'
import screenStyles from '../components/GameScreen/game-screen.module.css'
import {
  COUNTDOWN_SECONDS,
  DIFFICULTY_SETTINGS,
  type Difficulty,
  GO_DISPLAY_MS,
} from '../constants'
import styles from './game-start.module.css'

type GameStartProps = {
  difficulty: Difficulty
  onDifficultyChange: (difficulty: Difficulty) => void
  selectedSkin: CharacterSkin
  onSkinChange: (skin: CharacterSkin) => void
  onStart: () => void
}

export const GameStart = ({
  difficulty,
  onDifficultyChange,
  selectedSkin,
  onSkinChange,
  onStart,
}: GameStartProps) => {
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

      <GameScreen>
        {isCountdown ? (
          <h1>{showGo ? 'GO!' : countdown}</h1>
        ) : (
          <>
            <h1>READY?</h1>

            <div className={styles.startLayout}>
              <div className={styles.skinSelection}>
                <h2>ПЕРСОНАЖ</h2>

                {CHARACTER_SKINS.map(skin => (
                  <button
                    key={skin}
                    type="button"
                    className={`${styles.skinCard} ${
                      selectedSkin === skin ? styles.skinCardActive : ''
                    }`}
                    aria-pressed={selectedSkin === skin}
                    onClick={() => onSkinChange(skin)}>
                    {skin.toUpperCase()}
                  </button>
                ))}
              </div>

              <Button
                type="primary"
                className={screenStyles.button}
                onClick={() => setIsCountdown(true)}>
                START
              </Button>

              <div className={styles.difficulty}>
                <h2>СЛОЖНОСТЬ</h2>

                {(Object.keys(DIFFICULTY_SETTINGS) as Difficulty[]).map(
                  level => {
                    const settings = DIFFICULTY_SETTINGS[level]

                    return (
                      <button
                        key={level}
                        type="button"
                        className={`${styles.difficultyCard} ${
                          difficulty === level
                            ? styles.difficultyCardActive
                            : ''
                        }`}
                        aria-pressed={difficulty === level}
                        onClick={() => onDifficultyChange(level)}>
                        <span className={styles.difficultyTitle}>
                          {settings.label}
                        </span>
                        <span
                          role="img"
                          aria-label={`Количество жизней: ${settings.lives}`}>
                          <span aria-hidden="true">
                            Жизни: {'♥ '.repeat(settings.lives)}
                          </span>
                        </span>
                        <span>Время: {settings.duration} сек.</span>
                      </button>
                    )
                  }
                )}
              </div>
            </div>
          </>
        )}
      </GameScreen>
    </>
  )
}
