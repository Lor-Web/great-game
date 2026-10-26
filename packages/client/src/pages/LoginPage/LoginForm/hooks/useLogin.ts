import { Form, message } from 'antd'
import { useEffect, useRef, useState } from 'react'
import UserController from '../../../../api/Controllers/UserController'
import type { SignInRequest } from '../../../../api/Models/user-api'
import { ErrorMessage } from '../../../../utils/ErrorMessage'

export interface LoginFields {
  login: string
  password?: string
  remember?: boolean
}

export const useLogin = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = Form.useForm<LoginFields>()
  const [loading, setLoading] = useState<boolean>(false)

  const abortControllerRef = useRef<AbortController | null>(null)

  // Предотвращаем утечки памяти при отмене запроса
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort() // Отменяем запрос
      }
    }
  }, [])

  const onFinish = async (values: LoginFields) => {
    setLoading(true)

    // Создаем новый контроллер для текущего запроса
    const controller = new AbortController()
    abortControllerRef.current = controller

    const { remember: _remember, ...signInData } = values

    try {
      // Вызываем метод авторизации контроллера
      await UserController.signin(signInData as SignInRequest)

      // Проверяем актуальность компонента (не ушел ли юзер со страницы, пока шел запрос)
      if (controller.signal.aborted) return

      messageApi.success('Вход выполнен успешно!')
      form.resetFields()
    } catch (error: unknown) {
      if (controller.signal.aborted) {
        // Запрос был отменен легитимно, обновлять не нужно
        return
      }

      // парсим ошибку
      const errorMessage = ErrorMessage(error, 'Неверный логин или пароль.')

      // Подсвечиваем поля в интерфейсе
      form.setFields([
        {
          name: 'login',
          errors: [errorMessage],
        },
        {
          name: 'password',
          errors: [''], // Красим рамку пароля без дублирования текста
        },
      ])
    } finally {
      // Меняем стейт только в том случае, если компонент еще существует
      if (!controller.signal.aborted) {
        setLoading(false)
        abortControllerRef.current = null
      }
    }
  }

  return {
    form,
    loading,
    contextHolder,
    onFinish,
  }
}
