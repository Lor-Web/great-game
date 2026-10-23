import { Button, Input, Modal, Table } from 'antd'
import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { ThemesMock } from '../ForumPage'
import styles from './themes.module.css'

interface Theme {
  id: string
  title: string
  author: string
  lastMessage: string
  answers: number
}

export const Themes = ({ themes }: { themes: Theme[] }) => {
  themes = ThemesMock //todo get from store
  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = useCallback(() => {
    setIsModalOpen(true)
  }, [])

  const handleOk = useCallback(() => {
    console.log('Create theme and navigate to it')
    setIsModalOpen(false)
  }, [])

  const handleCancel = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  return (
    <main className={styles.page}>
      <h2 className={styles.title}>Темы раздела</h2>
      <Table className={styles.table} columns={columns} dataSource={themes} />
      <Button className={styles.button} type="primary" onClick={showModal}>
        Новая тема
      </Button>
      <Modal
        title="Новая тема"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}>
        <label htmlFor="theme-name">Назовите новую тему</label>
        <Input id="theme-name"></Input>
      </Modal>
    </main>
  )
}

const columns = [
  {
    title: 'Тема/Автор',
    dataIndex: 'title',
    key: 'title',
    render: (title: string, record: Theme) => (
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
]
