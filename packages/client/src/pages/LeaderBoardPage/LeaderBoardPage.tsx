import { Avatar } from 'antd'
import { LeaderboardRecords } from './config'

import styles from './leaderboard-page.module.css'

const topPlayers = [...LeaderboardRecords]
  .sort((a, b) => b.score - a.score)
  .slice(0, 7)

export const LeaderBoardPage = () => {
  return (
    <div className={styles.background}>
      <h1 className={styles.title}>LEADERBOARD</h1>

      <div className={styles.table}>
        <div className={`${styles.row} ${styles.header}`}>
          <div>Место</div>
          <div>Аватар</div>
          <div>Игрок</div>
          <div>Очки</div>
        </div>

        {topPlayers.map((player, index) => (
          <div className={styles.row} key={player.id}>
            <div>{index + 1}</div>
            <div>
              <Avatar
                {...(player.avatar ? { src: player.avatar } : {})}
                className={styles.avatar}>
                {!player.avatar && player.nickname[0]}
              </Avatar>
            </div>
            <div className={styles.nickname}>{player.nickname}</div>
            <div
              className={
                index === 0
                  ? styles.firstScore
                  : index < 3
                    ? styles.topScore
                    : styles.score
              }>
              {player.score}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
