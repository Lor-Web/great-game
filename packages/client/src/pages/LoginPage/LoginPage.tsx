import { Card, Typography } from 'antd'
import type React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom' 
import LoginForm from './loginform/loginForm'

import styles from  './css/LoginPage.module.css';

const { Title, Text } = Typography

export const LoginPage: React.FC = () => {
  return (
    <div className={styles.loginPage}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Вход в систему</title>
        <meta
          name="description"
          content="Страница авторизации для входа в личный кабинет"
        />
      </Helmet>

      <Card className={styles.loginPage__card} variant="borderless">
        <Title level={3} className={styles.loginPage__title}>
          Вход
        </Title>

        {/* Рендерим форму */}
        <LoginForm />

        <div className={styles.loginPage__footer}>
          <Text type="secondary">Нет аккаунта? </Text>
          <Link to="/register" className={styles.loginPage__link}>
            Зарегистрироваться
          </Link>
        </div>
      </Card>
    </div>
  )
}

// На этапе входа нам обычно не нужно ничего загружать, поэтому оставляем её пустой.
// export const initLoginPage = async ({ dispatch, state }: PageInitArgs) => {
//   // В будущем здесь можно проверить: если пользователь уже авторизован, сделать автоматический редирект на главную страницу
// }
