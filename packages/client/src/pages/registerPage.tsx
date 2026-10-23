import type React from 'react'
import { Card, Typography } from 'antd'
import { Helmet } from 'react-helmet-async'

import RegisterForm from './registerform/registerForm'

const { Title, Text } = Typography

export const RegisterPage: React.FC = () => {

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '20px',
      }}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Регистрация нового пользователя</title>
        <meta
          name="description"
          content="Страница создания нового аккаунта в системе"
        />
      </Helmet>

      <Card
        style={{
          width: '100%',
          maxWidth: 460,
          boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
        }}
        variant="borderless">
        <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
          Регистрация
        </Title>

        {/* Рендерим вашу готовую форму */}
        <RegisterForm />

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Text type="secondary">Уже есть аккаунт? </Text>
          <a href="/login">Войти</a>
        </div>
      </Card>
    </div>
  )
}

// export const initRegisterPage = async ({ dispatch, state }: PageInitArgs) => {
//   // Оставляем пустой, если перед показом страницы не нужно загружать данные из API
// }
