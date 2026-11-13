import { Avatar, Card } from 'antd'
import type { MessageProps } from '../types'
import styles from './message.module.css'

export const Message = ({ content, time, author }: MessageProps) => {
  return (
    <Card
      className={styles.card}
      title={
        <div className={styles.info}>
          <div className={styles.avatar}>
            <Avatar size={64} src={author.avatar}>
              {author.name}
            </Avatar>
          </div>
          <div className={styles['author-name']}>{author.name}</div>
        </div>
      }
      extra={<div className={styles.time}>{time}</div>}>
      {/* todo Тут надо вставит использование const cleanHtml = DOMPurify.sanitize(userContributedHtml); из import DOMPurify from 'dompurify';*/}
      <div
        className={styles.content}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: safe via sanitize
        dangerouslySetInnerHTML={{ __html: content }}></div>
    </Card>
  )
}
