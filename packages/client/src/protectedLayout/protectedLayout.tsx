import type React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

interface RootState {
  user: Record<string, unknown> | null
}

export const ProtectedLayout: React.FC = () => {
  const location = useLocation()

  // Извлекаем пользователя из Redux
  const user = useSelector((state: RootState) => state.user)

  // Если не авторизован редиректим на логин и сохраняем исходный путь
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  // Если авторизован рендерим дочерний роут через Outlet
  return <Outlet />
}
