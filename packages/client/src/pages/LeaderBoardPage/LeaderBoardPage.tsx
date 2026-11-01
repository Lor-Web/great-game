import { Link } from 'react-router-dom'
import { MAIN_PAGE_PATH } from '../../shared/constants/routes.constant'
import { LeaderboardRecords } from './config'
import { LeaderBoardTable } from './LeaderBoardTable/LeaderBoardTable'

import styles from './leaderboard-page.module.css'

export const LeaderBoardPage = () => {
  const topPlayers = [...LeaderboardRecords]
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)

  return (
    <div className={styles.background}>
      <h1 className={styles.title}>LEADERBOARD</h1>

      <LeaderBoardTable players={topPlayers} />
      <nav className={styles.navigation}>
        <Link to={MAIN_PAGE_PATH} className={styles.navigationLink}>
          На главную
        </Link>
      </nav>
    </div>
  )
}
