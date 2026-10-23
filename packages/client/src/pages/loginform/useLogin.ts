import { Form, message } from 'antd'
import { useEffect, useRef, useState } from 'react'
import UserController from '../../api/Controllers/UserController'
import type { SignInRequest } from '../../api/Models/user-api'

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
      // 1. Вызываем метод авторизации контроллера вместо искусственного Promise и setTimeout
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

      const err = error as Record<string, unknown>
      let errorMessage = 'Неверный логин или пароль.'

      // Парсим JSON-строку ответа бэкенда, если она пришла
      if (err && typeof err.response === 'string') {
        try {
          const parsed = JSON.parse(err.response) as Record<string, unknown>
          if (parsed.reason) {
            errorMessage = String(parsed.reason) // Достаем точный reason от бэкенда
          }
        } catch {
          // оставляем дефолтный текст
        }
      }

      // Обработка серверных ошибок валидации через подсветку полей Antd
      form.setFields([
        {
          name: 'login',
          errors: [errorMessage],
        },
        {
          name: 'password',
          errors: [''], // Подсвечиваем рамку пароля красным
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
