import { Card, Flex, Typography } from 'antd'
import type React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import styles from '../AuthLayout/AuthLayout.module.css'
import LoginForm from './LoginForm/LoginForm'

const { Title, Text } = Typography

export const LoginPage: React.FC = () => {
  return (
    <Flex
      flex="auto"
      align="center"
      justify="center"
      className={styles.authContainer}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Вход в систему</title>
      </Helmet>

      <Card
        className={`${styles.authCard} ${styles['authCard--login']}`}
        variant="borderless">
        <Title level={3} className={styles.authTitle}>
          Вход
        </Title>

        <LoginForm />

        <div className={styles.authFooter}>
          <Text type="secondary">Нет аккаунта? </Text>
          <Link to="/register" className={styles.authLink}>
            Зарегистрироваться
          </Link>
        </div>
      </Card>
    </Flex>
  )
}
