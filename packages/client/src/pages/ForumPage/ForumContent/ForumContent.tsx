import { Button, Form } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { useCallback } from 'react'
import { Message } from '../Message/Message'
import { MessagesMock } from '../mocks'
import type { MessageProps } from '../types'
import styles from './forum-content.module.css'

export const ForumContent = ({ messages }: { messages: MessageProps[] }) => {
  messages = MessagesMock //todo get from store
  const [form] = Form.useForm()

  const onSubmit = useCallback(
    (values: { message: string }) => {
      console.log('Send message', values.message)
      form.resetFields()
    },
    [form]
  )

  return (
    <main className={styles.page}>
      {messages.map(message => (
        <Message key={message.id} {...message}></Message>
      ))}
      <Form form={form} className={styles.form} onFinish={onSubmit}>
        <Form.Item
          label="Ответить:"
          name="message"
          layout="vertical"
          rules={[
            { required: true, message: 'Сообщение не должно быть пустым' },
          ]}>
          <TextArea rows={4} />
        </Form.Item>
        <Button className={styles.button} htmlType="submit">
          Отправить
        </Button>
      </Form>
    </main>
  )
}
