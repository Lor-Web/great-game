import { Card, Flex, Typography } from 'antd'
import type React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import styles from '../AuthLayout/AuthLayout.module.css'
import RegisterForm from './RegisterForm/RegisterForm'

const { Title, Text } = Typography

export const RegisterPage: React.FC = () => {
  return (
    <Flex
      flex="auto"
      align="center"
      justify="center"
      className={styles.authContainer}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Регистрация нового пользователя</title>
      </Helmet>

      <Card
        className={`${styles.authCard} ${styles['authCard--register']}`}
        variant="borderless">
        <Title level={3} className={styles.authTitle}>
          Регистрация
        </Title>

        <RegisterForm />

        <div className={styles.authFooter}>
          <Text type="secondary">Уже есть аккаунт? </Text>
          <Link to="/login" className={styles.authLink}>
            Войти
          </Link>
        </div>
      </Card>
    </Flex>
  )
}
