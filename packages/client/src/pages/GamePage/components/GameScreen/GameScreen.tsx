import type { ReactNode } from 'react'
import styles from './game-screen.module.css'

type GameScreenProps = {
  children: ReactNode
}

export const GameScreen = ({ children }: GameScreenProps) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.content}>{children}</div>
    </div>
  )
}
