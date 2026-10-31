import { Form, message } from 'antd'
import { useEffect, useRef, useState } from 'react'
import UserController from '../../../../api/Controllers/UserController'
import { useAppDispatch } from '../../../../store/hooks'
import { ErrorMessage } from '../../../../utils/ErrorMessage'

export interface RegisterFields {
  login: string
  email: string
  first_name: string
  second_name: string
  phone: string
  password: string
  confirmPassword: string
  agreement: boolean
}

export const useRegister = () => {
  const dispatch = useAppDispatch()
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = Form.useForm<RegisterFields>()
  const [loading, setLoading] = useState<boolean>(false)

  // Флаг для проверки, смонтирован ли компонент
  const isMountedRef = useRef<boolean>(true)
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
    if (loading) return
    setLoading(true)

    const controller = new AbortController()
    abortControllerRef.current = controller

    const {
      confirmPassword: _confirmPassword,
      agreement: _agreement,
      ...signUpData
    } = values

    try {
      await UserController.signup(signUpData, dispatch, controller.signal)

      // если запрос завершился успехом, но пользователь ушел со страницы
      if (!isMountedRef.current || controller.signal.aborted) {
        console.warn(
          'Пользователь ушел со страницы, но регистрация на сервере успешно завершена.'
        )
        return
      }

      messageApi.success('Регистрация успешно завершена!')
      form.resetFields()
    } catch (error: unknown) {
      if (!isMountedRef.current || controller.signal.aborted) {
        console.warn('Запрос регистрации был отменен клиентом.')
        return
      }

      const errorMessage = ErrorMessage(
        error,
        'Ошибка сервера при регистрации.'
      )
      const lowerMessage = errorMessage.toLowerCase()

      // Точечно распределяем ошибки по полям формы на основе ответа сервера
      if (lowerMessage.includes('login')) {
        form.setFields([
          {
            name: 'login',
            errors: ['Этот логин уже занят.'],
          },
        ])
      } else if (
        lowerMessage.includes('email') ||
        errorMessage === 'EMAIL_ALREADY_TAKEN'
      ) {
        form.setFields([
          {
            name: 'email',
            errors: ['Этот e-mail адрес уже зарегистрирован в системе.'],
          },
        ])
      } else {
        // Для системных сбоев (например, 500) выводим глобальное всплывающее уведомление
        messageApi.error(errorMessage)
      }
    } finally {
      // Защита от утечки памяти: обновляем стейт только если компонент еще живой
      if (isMountedRef.current && !controller.signal.aborted) {
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
