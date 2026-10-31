import { Table } from 'antd'
import { useLoaderData } from 'react-router-dom'
import styles from './forum-page.module.css'
import { useColumns } from './hooks'
import { MessagesMock, ThemesMock, Topics } from './mocks'
import type { ThemeReacord, TopicRecord } from './types'

export const ForumPage = () => {
  const topics = useLoaderData() as Array<TopicRecord>
  const columns = useColumns()

  return (
    <main className={styles.page}>
      <h2 className={styles.title}>Разделы</h2>
      <Table className={styles.table} columns={columns} dataSource={topics} />
    </main>
  )
}

export async function forumSectionsLoader() {
  return Topics
}

export async function forumThemesLoader({
  params,
}: {
  params: { sectionId: string }
}): Promise<ThemeReacord[]> {
  console.log(`get themes for section ${params.sectionId}`)

  return ThemesMock
}

export async function themeMessagesLoader({
  params,
}: {
  params: { themeId: string }
}) {
  console.log(`get messages for theme ${params.themeId}`)

  return MessagesMock
}
