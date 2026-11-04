import type React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'

export const ProtectedLayout: React.FC = () => {
  const isAuth = useAppSelector(state => state.user.isAuth)
  const isLoading = useAppSelector(state => state.user.isLoading)
  const location = useLocation()

  // Пока загружаются данные пользователя, не выполняем редирект
  if (isLoading) {
    return null
  }
  // Если не авторизован редиректим на логин и сохраняем исходный путь
  if (!isAuth) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  // Если авторизован рендерим дочерний роут через Outlet
  return <Outlet />
}
