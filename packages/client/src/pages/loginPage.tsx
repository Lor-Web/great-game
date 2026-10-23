import React from 'react'
import { Card, Typography } from 'antd'
import { Helmet } from 'react-helmet-async'

import LoginForm from './loginform/loginForm'

const { Title, Text } = Typography

export const LoginPage: React.FC = () => {

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
        <title>Вход в систему</title>
        <meta
          name="description"
          content="Страница авторизации для входа в личный кабинет"
        />
      </Helmet>

      <Card
        style={{
          width: '100%',
          maxWidth: 420,
          boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
        }}
        variant="borderless">
        <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
          Вход
        </Title>

        {/* Рендерим форму */}
        <LoginForm />

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Text type="secondary">Нет аккаунта? </Text>
          <a href="/register">Зарегистрироваться</a>
        </div>
      </Card>
    </div>
  )
}

// На этапе входа нам обычно не нужно ничего загружать, поэтому оставляем её пустой.
// export const initLoginPage = async ({ dispatch, state }: PageInitArgs) => {
//   // В будущем здесь можно проверить: если пользователь уже авторизован, сделать автоматический редирект на главную страницу
// }
