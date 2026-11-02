import { Form, message } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UserController from '../../../../api/Controllers/UserController'
import { MAIN_PAGE_PATH } from '../../../../shared/constants/routes.constant'
import { useAppDispatch } from '../../../../store/hooks'
import { ErrorMessage } from '../../../../utils/ErrorMessage'
export interface LoginFields {
  login: string
  password: string
}

export const useLogin = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
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
    // блокируем повторную отправку, пока идет предыдущий запрос
    if (loading) return
    setLoading(true)

    // Создаем новый контроллер для текущего запроса
    const controller = new AbortController()
    abortControllerRef.current = controller

    const { ...signInData } = values

    try {
      // Вызываем метод авторизации контроллера
      const user = await UserController.signin(
        signInData,
        dispatch,
        controller.signal
      )

      // Проверяем актуальность компонента (не ушел ли юзер со страницы, пока шел запрос)
      if (controller.signal.aborted) return

      if (!user) {
        throw new Error('Не удалось получить данные пользователя')
      }

      messageApi.success('Вход выполнен успешно!')
      form.resetFields()
      navigate(MAIN_PAGE_PATH, { replace: true })
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
