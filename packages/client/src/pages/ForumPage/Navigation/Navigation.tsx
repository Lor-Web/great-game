import { Table } from 'antd'
import { Link } from 'react-router-dom'
import styles from './navigation.module.css'

const columns = [
  {
    title: 'Раздел',
    dataIndex: 'title',
    key: 'title',
    render: (title: string, record: { id: string }) => (
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
]

interface Topic {
  id: string
  title: string
  themes: number
  messages: number
}

interface Props {
  topics: Array<Topic>
}

export const Navigation = ({ topics }: Props) => {
  return (
    <Table className={styles.table} columns={columns} dataSource={topics} />
  )
}
