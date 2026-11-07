import { useEffect } from 'react'
import { useRouteError } from 'react-router-dom'
import { ErrorFallback } from './ErrorFallback'

export const RouteErrorBoundary = () => {
  const error = useRouteError()

  useEffect(() => {
    console.error('Ошибка маршрута:', error)
  }, [error])

  return (
    <ErrorFallback
      error={error}
      resetErrorBoundary={() => window.location.reload()}
    />
  )
}
