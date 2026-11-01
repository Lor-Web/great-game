import { LeaderboardRecords } from './config'
import { LeaderBoardTable } from './LeaderBoardTable/LeaderBoardTable'

import styles from './leaderboard-page.module.css'

export const LeaderBoardPage = () => {
  const topPlayers = [...LeaderboardRecords]
    .sort((a, b) => b.score - a.score)
    .slice(0, 7)

  return (
    <div className={styles.background}>
      <h1 className={styles.title}>LEADERBOARD</h1>

      <LeaderBoardTable players={topPlayers} />
    </div>
  )
}
