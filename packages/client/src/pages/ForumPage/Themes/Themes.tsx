import { Button, Input, Modal, Table } from 'antd'
import { useCallback, useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import type { ThemeReacord } from '../types'
import { useColumns } from './hooks'
import styles from './themes.module.css'

export const Themes = () => {
  const themes = useLoaderData() as ThemeReacord[]
  const columns = useColumns()
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
