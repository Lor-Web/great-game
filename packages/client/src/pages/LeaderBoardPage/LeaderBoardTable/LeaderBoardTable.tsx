import { Avatar, Grid, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'

import type { LeaderBoardTableProps, LeaderboardRecord } from '../types'

import styles from './leaderboard-table.module.css'

export const LeaderBoardTable = ({ players }: LeaderBoardTableProps) => {
  const screens = Grid.useBreakpoint()
  const isMobile = !screens.md

  const columns: ColumnsType<LeaderboardRecord> = [
    {
      title: 'Место',
      key: 'place',
      render: (_value, _record, index) => index + 1,
      width: isMobile ? undefined : 100,
    },
    {
      title: 'Аватар',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (avatar, record) => (
        <Avatar src={avatar || undefined} className={styles.avatar}>
          {!avatar && record.nickname[0]}
        </Avatar>
      ),
      width: isMobile ? undefined : 120,
    },
    {
      title: 'Игрок',
      dataIndex: 'nickname',
      key: 'nickname',
      render: nickname => <span className={styles.nickname}>{nickname}</span>,
    },
    {
      title: 'Очки',
      dataIndex: 'score',
      key: 'score',
      render: (score, _record, index) => (
        <span
          className={
            index === 0
              ? styles.firstScore
              : index < 3
                ? styles.topScore
                : styles.score
          }>
          {score}
        </span>
      ),
      width: isMobile ? undefined : 150,
    },
  ]

  return (
    <div className={styles.table}>
      <Table<LeaderboardRecord>
        columns={columns}
        dataSource={players}
        rowKey="id"
        pagination={false}
      />
    </div>
  )
}
