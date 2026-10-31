import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Form } from 'antd'
import type React from 'react'
import { FormInput } from '../../components/AuthFields/FormInput'
import { antdCustomValidator } from '../../validation/antdCustomValidator'
import { useLogin } from './hooks/useLogin'

const LoginForm: React.FC = () => {
  const { form, loading, contextHolder, onFinish } = useLogin()

  return (
    <>
      {contextHolder}
      <Form
        form={form}
        name="login_spa_form"
        onFinish={onFinish}
        layout="vertical"
        size="large">
        <FormInput
          name="login"
          label="Логин"
          placeholder="Введите ваш логин"
          prefix={<UserOutlined />}
          rules={[
            { required: true, message: 'Логин' },
            antdCustomValidator('login'),
          ]}
        />

        <FormInput
          name="password"
          label="Пароль"
          placeholder="Ваш пароль"
          prefix={<LockOutlined />}
          isPassword
          rules={[{ required: true, message: 'Введите пароль' }]}
        />

        <Button type="primary" htmlType="submit" block loading={loading}>
          Войти в аккаунт
        </Button>
      </Form>
    </>
  )
}

export default LoginForm
