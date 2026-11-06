import { Button } from 'antd'
import type React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import UserController from '../api/Controllers/UserController'
import { useAppDispatch, useAppSelector } from '../store/hooks'

export const ProtectedLayout: React.FC = () => {
  const { isAuth, isLoading, authError } = useAppSelector(state => state.user)
  const dispatch = useAppDispatch()
  const location = useLocation()
  // Пока загружаются данные пользователя, не выполняем редирект
  if (isLoading) {
    return null
  }
  // При ошибке проверки авторизации даём возможность повторить запрос
  if (authError) {
    return (
      <div>
        <p>Не удалось проверить авторизацию.</p>
        <Button
          onClick={() => UserController.getUser(dispatch).catch(console.error)}>
          Повторить
        </Button>
      </div>
    )
  }
  // Если не авторизован редиректим на логин и сохраняем исходный путь
  if (!isAuth) {
    return <Navigate to="/" state={{ from: location }} replace />
  }
  // Если авторизован рендерим дочерний роут через Outlet
  return <Outlet />
}
