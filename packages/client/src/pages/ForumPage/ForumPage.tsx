import { Table } from 'antd'
import styles from './forum-page.module.css'
import { useColumns } from './hooks'
import { ThemesMock, Topics } from './mocks'
import type { ForumPageProps } from './types'

export const ForumPage = ({ topics }: ForumPageProps) => {
  topics = Topics //todo get from store
  const columns = useColumns()

  return (
    <main className={styles.page}>
      <h2 className={styles.title}>Разделы</h2>
      <Table className={styles.table} columns={columns} dataSource={topics} />
    </main>
  )
}

export async function forumSectionsLoader() {
  console.log('get all forum sections')
  return Topics
}

export async function forumThemesLoader({
  params,
}: {
  params: { sectionId: string }
}) {
  console.log('get themes for section', params.sectionId)
  return ThemesMock
}

export async function themeMessagesLoader({
  params,
}: {
  params: { themeId: string }
}) {
  console.log('get messages for theme', params.themeId)
}
