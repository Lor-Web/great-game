import { Card, Typography } from 'antd'
import type React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom' 
import RegisterForm from './registerform/registerForm'

import styles from './css/LoginPage.module.css';

const { Title, Text } = Typography

export const RegisterPage: React.FC = () => {
  return (
    <div className={styles.registerPage}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Регистрация нового пользователя</title>
        <meta
          name="description"
          content="Страница создания нового аккаунта в системе"
        />
      </Helmet>

      <Card className={styles.registerPage__card} variant="borderless">
        <Title level={3} className={styles.registerPage__title}>
          Регистрация
        </Title>

        {/* Рендерим форму */}
        <RegisterForm />

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Text type="secondary">Уже есть аккаунт? </Text>
          <Link to="/login" className={styles.registerPage__link}>
            Войти
          </Link>
        </div>
      </Card>
    </div>
  )
}

// export const initRegisterPage = async ({ dispatch, state }: PageInitArgs) => {
//   // Оставляем пустой, если перед показом страницы не нужно загружать данные из API
// }
