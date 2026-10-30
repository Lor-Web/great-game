import type { ColumnsType } from 'antd/es/table'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import type { ThemeReacord } from '../types'
import styles from './themes.module.css'

export const useColumns = () => {
  const columns = useMemo<ColumnsType<ThemeReacord>>(
    () => [
      {
        title: 'Тема/Автор',
        key: 'title',
        dataIndex: 'title',
        render: (title: string, record: ThemeReacord) => (
          <Link to={`/theme/${record.id}`}>
            {
              <div>
                <div>{title} /</div>
                <div className={styles.author}>{record.author}</div>
              </div>
            }
          </Link>
        ),
      },
      {
        title: 'Последнее сообщение',
        dataIndex: 'lastMessage',
        key: 'lastMessage',
      },
      {
        title: 'Ответов',
        dataIndex: 'answers',
        key: 'answers',
      },
    ],
    []
  )

  return columns
}
