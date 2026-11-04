import { type PropsWithChildren, useEffect } from 'react'
import UserController from '../../api/Controllers/UserController'
import { useAppDispatch } from '../../store/hooks'

export const AuthInitializer = ({ children }: PropsWithChildren) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    UserController.getUser(dispatch).catch(error => {
      console.error('Auth initialization error:', error)
    })
  }, [dispatch])

  return children
}
