import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Form, Input } from 'antd'
import type React from 'react'
import { antdCustomValidator } from '../../validation/antdCustomValidator'
import { useRegister } from './useRegister'

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
        <Form.Item
          name="login"
          label="Логин"
          rules={[
            { required: true, message: 'Логин' },
            antdCustomValidator('login'),
          ]}>
          <Input prefix={<UserOutlined />} placeholder="Login" />
        </Form.Item>

        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            { required: true, message: 'Введите ваш E-mail' },
            antdCustomValidator('email'),
          ]}>
          <Input prefix={<MailOutlined />} placeholder="email@example.com" />
        </Form.Item>

        <Form.Item
          name="first_name"
          label="Имя"
          rules={[
            { required: true, message: 'Введите ваше имя' },
            antdCustomValidator('first_name'),
          ]}>
          <Input prefix={<UserOutlined />} placeholder="Имя" />
        </Form.Item>

        <Form.Item
          name="second_name"
          label="Фамилия"
          rules={[
            { required: true, message: 'Введите вашу фамилию' },
            antdCustomValidator('second_name'),
          ]}>
          <Input prefix={<UserOutlined />} placeholder="Фамилия" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Телефон"
          rules={[
            { required: true, message: 'Введите ваш телефон' },
            antdCustomValidator('phone'),
          ]}>
          <Input prefix={<UserOutlined />} placeholder="Телефон" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Пароль"
          rules={[
            { required: true, message: 'Введите пароль!' },
            antdCustomValidator('password'),
          ]}
          hasFeedback>
          <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Повторите пароль"
          dependencies={['password']}
          hasFeedback
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
          ]}>
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Повторите пароль"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Зарегистрироваться
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default RegisterForm
