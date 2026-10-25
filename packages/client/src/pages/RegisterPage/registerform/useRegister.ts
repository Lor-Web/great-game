import { Form, message } from 'antd'
import { useEffect, useRef, useState } from 'react'
import UserController from '../../../api/Controllers/UserController'
import type { SignUpRequest } from '../../../api/Models/user-api'

export interface RegisterFields {
  login: string
  email: string
  first_name: string
  second_name: string
  phone: string
  password?: string
  confirmPassword?: string
  agreement: boolean
}

export const useRegister = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = Form.useForm<RegisterFields>()
  const [loading, setLoading] = useState<boolean>(false)

  const abortControllerRef = useRef<AbortController | null>(null)

  //Убираем риски утечки памяти при переходе
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const onFinish = async (values: RegisterFields) => {
    setLoading(true)

    const controller = new AbortController()
    abortControllerRef.current = controller

    const {
      confirmPassword: _confirmPassword,
      agreement: _agreement,
      ...signUpData
    } = values

    try {
      await UserController.signup(signUpData as SignUpRequest)

      if (controller.signal.aborted) return

      messageApi.success('Регистрация успешно завершена!')
      form.resetFields()
    } catch (error: unknown) {
      if (controller.signal.aborted) return

      // Приводим ошибку к безопасному индексируемому словарю Record для чтения ответа сервера
      const err = error as Record<string, unknown>

      // Вытягиваем текст технической ошибки
      let errorMessage = 'Ошибка сервера при регистрации.'

      if (err && typeof err.response === 'string') {
        try {
          const parsed = JSON.parse(err.response) as Record<string, unknown>
          if (parsed.reason) {
            errorMessage = String(parsed.reason)
          }
        } catch {
          // Если ответ пришел не в формате JSON — оставляем стандартный текст
        }
      }

      // Проверяем самые частые ошибки регистрации (дубликаты)
      if (
        errorMessage.toLowerCase().includes('login') ||
        errorMessage === 'EMAIL_ALREADY_TAKEN'
      ) {
        // Подсвечиваем конкретное поле email или login красным цветом прямо в интерфейсе Ant Design
        form.setFields([
          {
            name: 'email',
            errors: [
              'Этот e-mail адрес или логин уже зарегистрирован в системе.',
            ],
          },
        ])
      } else {
        // Если это общая сетевая ошибка (например, 500), выводим ее в глобальный тост
        messageApi.error(errorMessage)
      }
    } finally {
      // Защита от утечки памяти: обновляем стейт только если компонент еще живой
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
