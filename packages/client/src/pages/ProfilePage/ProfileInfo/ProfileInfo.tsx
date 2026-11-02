import { Button, Form, Input, message } from 'antd'
import { useState } from 'react'
import UserController from '../../../api/Controllers/UserController'
import type { ProfileUpdateRequest } from '../../../api/Models/user-api'
import { useAppDispatch } from '../../../store/hooks'
import type { ProfileInfoProps } from '../types'

import styles from './profile-info.module.css'

export const ProfileInfo = ({
  user,
  isEditing,
  onEdit,
  onSuccess,
}: ProfileInfoProps) => {
  const dispatch = useAppDispatch()
  const [form] = Form.useForm()
  const [isLoading, setIsLoading] = useState(false)

  const handleEdit = () => {
    form.setFieldsValue({
      first_name: user.first_name,
      second_name: user.second_name,
      display_name: user.display_name ?? '',
      login: user.login,
      email: user.email,
      phone: user.phone,
    })
    onEdit()
  }

  const handleSubmit = async (values: ProfileUpdateRequest) => {
    setIsLoading(true)

    try {
      await UserController.updateProfile(values, dispatch)
      message.success('Данные успешно обновлены')
      onSuccess()
    } catch (error) {
      console.error('Ошибка обновления профиля:', error)
      message.error('Не удалось обновить данные')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isEditing) {
    return (
      <section>
        <p>
          Имя: <span className={styles.userData}>{user.first_name}</span>
        </p>
        <p>
          Фамилия: <span className={styles.userData}>{user.second_name}</span>
        </p>
        <p>
          Имя в игре:{' '}
          <span className={styles.userData}>{user.display_name}</span>
        </p>
        <p>
          Логин: <span className={styles.userData}>{user.login}</span>
        </p>
        <p>
          Email: <span className={styles.userData}>{user.email}</span>
        </p>
        <p>
          Телефон: <span className={styles.userData}>{user.phone}</span>
        </p>
        <div className={styles.button}>
          <Button onClick={handleEdit}>Изменить данные</Button>
        </div>
      </section>
    )
  }

  return (
    <section>
      <h2>Редактирование данных</h2>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Имя"
          name="first_name"
          rules={[{ required: true, message: 'Введите имя' }]}>
          <Input />
        </Form.Item>

        <Form.Item
          label="Фамилия"
          name="second_name"
          rules={[{ required: true, message: 'Введите фамилию' }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Имя в игре" name="display_name">
          <Input />
        </Form.Item>

        <Form.Item
          label="Логин"
          name="login"
          rules={[{ required: true, message: 'Введите логин' }]}>
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Введите email' },
            { type: 'email', message: 'Введите корректный email' },
          ]}>
          <Input />
        </Form.Item>

        <Form.Item
          label="Телефон"
          name="phone"
          rules={[{ required: true, message: 'Введите телефон' }]}>
          <Input />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={isLoading}>
          Сохранить
        </Button>
      </Form>
    </section>
  )
}
