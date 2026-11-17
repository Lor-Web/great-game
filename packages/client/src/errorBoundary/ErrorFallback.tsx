import { Button } from 'antd'
import type { FallbackProps } from 'react-error-boundary'
import { MAIN_PAGE_PATH } from '../shared/constants/routes.constant'
import styles from './error-boundary.module.css'

export const ErrorFallback = ({ resetErrorBoundary }: FallbackProps) => {
  return (
    <main className={styles.container} role="alert">
      <h1>OOPS!</h1>
      <p>Что-то пошло не так</p>

      <div className={styles.actions}>
        <Button
          type="primary"
          className={styles.button}
          onClick={resetErrorBoundary}>
          ПОПРОБОВАТЬ СНОВА
        </Button>

        <Button
          type="primary"
          href={MAIN_PAGE_PATH}
          className={`${styles.button} ${styles.menuButton}`}>
          В ГЛАВНОЕ МЕНЮ
        </Button>
      </div>
    </main>
  )
}
