import { Button, Form, Input, message } from 'antd'
import { useState } from 'react'
import UserController from '../../../api/Controllers/UserController'
import type { ProfilePasswordFormValues, ProfilePasswordProps } from '../types'

import styles from './profile-password.module.css'

export const ProfilePassword = ({ onSuccess }: ProfilePasswordProps) => {
  const [form] = Form.useForm()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (values: {
    oldPassword: string
    newPassword: string
    confirmPassword: string
  }) => {
    setIsLoading(true)

    try {
      await UserController.updatePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      })

      message.success('Пароль успешно изменён')
      form.resetFields()
      onSuccess()
    } catch (error) {
      console.error('Ошибка смены пароля:', error)
      message.error('Не удалось изменить пароль')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item
        label="Старый пароль"
        name="oldPassword"
        rules={[{ required: true, message: 'Введите старый пароль' }]}>
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Новый пароль"
        name="newPassword"
        rules={[
          { required: true, message: 'Введите новый пароль' },
          { min: 8, message: 'Минимум 8 символов' },
        ]}>
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Повторите новый пароль"
        name="confirmPassword"
        dependencies={['newPassword']}
        rules={[
          { required: true, message: 'Повторите новый пароль' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve()
              }
              return Promise.reject(new Error('Пароли не совпадают'))
            },
          }),
        ]}>
        <Input.Password />
      </Form.Item>
      <div className={styles.button}>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          Изменить пароль
        </Button>
      </div>
    </Form>
  )
}
