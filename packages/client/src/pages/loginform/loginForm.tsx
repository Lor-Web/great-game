import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input } from 'antd'
import type React from 'react'
import { antdCustomValidator } from '../validation/antdCustomValidator'
import { useLogin } from './useLogin'

const LoginForm: React.FC = () => {
  const { form, loading, contextHolder, onFinish } = useLogin()

  return (
    <>
      {contextHolder}
      <Form
        form={form}
        name="login_spa_form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
        size="large">
        {/* ИСПРАВЛЕНО: Изменили name с "email" на "login" для соответствия API Практикума */}
        <Form.Item
          name="login"
          label="Логин"
          rules={[
            { required: true, message: 'Логин' },
            antdCustomValidator('login'),
          ]}>
          <Input prefix={<UserOutlined />} placeholder="Введите ваш логин" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Пароль"
          rules={[{ required: true, message: 'Введите пароль' }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="Ваш пароль" />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Запомнить меня</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Войти в аккаунт
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default LoginForm
