import type { ColumnsType } from 'antd/es/table'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import type { TopicRecord } from './types'

export const useColumns = () => {
  const columns = useMemo<ColumnsType<TopicRecord>>(
    () => [
      {
        title: 'Раздел',
        dataIndex: 'title',
        key: 'title',
        render: (title: string, record: TopicRecord) => (
          <Link to={`/forum/${record.id}`}>{title}</Link>
        ),
      },
      {
        title: 'Последнее сообщение',
        dataIndex: 'lastMessage',
        key: 'lastMessage',
      },
      {
        title: 'Тем',
        dataIndex: 'themes',
        key: 'themes',
      },
      {
        title: 'Сообщений',
        dataIndex: 'messages',
        key: 'messages',
      },
    ],
    []
  )

  return columns
}
