import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Form } from 'antd'
import type React from 'react'
import { FormInput } from '../../components/AuthFields/FormInput'
import { antdCustomValidator } from '../../validation/antdCustomValidator'
import { useRegister } from './hooks/useRegister'

const RegisterForm: React.FC = () => {
  const { form, loading, contextHolder, onFinish } = useRegister()

  return (
    <>
      {contextHolder}
      <Form
        form={form}
        name="register_spa_form"
        onFinish={onFinish}
        layout="vertical"
        size="large">
        <FormInput
          name="login"
          label="Логин"
          placeholder="Login"
          prefix={<UserOutlined />}
          rules={[
            { required: true, message: 'Логин' },
            antdCustomValidator('login'),
          ]}
        />

        <FormInput
          name="email"
          label="E-mail"
          placeholder="email@example.com"
          prefix={<MailOutlined />}
          rules={[
            { required: true, message: 'Введите ваш E-mail' },
            antdCustomValidator('email'),
          ]}
        />

        <FormInput
          name="first_name"
          label="Имя"
          placeholder="Имя"
          prefix={<UserOutlined />}
          rules={[
            { required: true, message: 'Введите ваше имя' },
            antdCustomValidator('first_name'),
          ]}
        />

        <FormInput
          name="second_name"
          label="Фамилия"
          placeholder="Фамилия"
          prefix={<UserOutlined />}
          rules={[
            { required: true, message: 'Введите вашу фамилию' },
            antdCustomValidator('second_name'),
          ]}
        />

        <FormInput
          name="phone"
          label="Телефон"
          placeholder="Телефон"
          prefix={<UserOutlined />}
          rules={[
            { required: true, message: 'Введите ваш телефон' },
            antdCustomValidator('phone'),
          ]}
        />

        <FormInput
          name="password"
          label="Пароль"
          placeholder="Пароль"
          prefix={<LockOutlined />}
          isPassword
          hasFeedback
          rules={[
            { required: true, message: 'Введите пароль!' },
            antdCustomValidator('password'),
          ]}
        />

        <FormInput
          name="confirmPassword"
          label="Повторите пароль"
          placeholder="Повторите пароль"
          prefix={<LockOutlined />}
          isPassword
          hasFeedback
          dependencies={['password']}
          rules={[
            { required: true, message: 'Повторите пароль!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('Пароли не совпадают!'))
              },
            }),
          ]}
        />

        <Button type="primary" htmlType="submit" block loading={loading}>
          Зарегистрироваться
        </Button>
      </Form>
    </>
  )
}

export default RegisterForm
