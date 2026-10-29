import { Button, Form, message } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { useCallback } from 'react'
import { useLoaderData } from 'react-router-dom'
import { sendMessage } from '../../../api/forum.api'
import { Message } from '../Message/Message'
import type { MessageProps } from '../types'
import styles from './forum-content.module.css'

export const ForumContent = () => {
  const messages = useLoaderData() as MessageProps[]
  const [form] = Form.useForm()
  const [messageApi, contextHolder] = message.useMessage()

  const onSubmit = useCallback(
    (values: { message: string }) => {
      sendMessage(values.message)
        .then(() => {
          form.resetFields()
        })
        .catch(() => {
          messageApi.warning('Не удалось отправить сообщение. Попробуйте еще')
        })
    },
    [form, messageApi.warning]
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
        {contextHolder}
      </Form>
    </main>
  )
}
