import { Form } from 'react-router-dom'
import { MessagesMock } from '../ForumPage'
import { Message } from '../Message/Message'

import styles from './forum-content.module.css'

export const ForumContent = ({ messages }: { messages: Message[] }) => {
  messages = MessagesMock //todo get from store
  return (
    <main className={styles.page}>
      {messages.map(message => (
        <Message key={message.id} {...message}></Message>
      ))}
      <Form className={styles.form} method="post" action="/send-message">
        <label className={styles.label} htmlFor="message-textarea">
          Ответить:
        </label>
        <textarea
          id="message-textarea"
          className={styles.textarea}
          name="message"
        />
        <button className={styles.button} type="submit">
          Отправить
        </button>
      </Form>
    </main>
  )
}
