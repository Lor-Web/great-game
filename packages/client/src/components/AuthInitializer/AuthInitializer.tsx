import { type PropsWithChildren, useEffect } from 'react'
import UserController from '../../api/Controllers/UserController'
import { useAppDispatch } from '../../store/hooks'

export const AuthInitializer = ({ children }: PropsWithChildren) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const controller = new AbortController()

    UserController.getUser(dispatch, controller.signal).catch(error => {
      if (!controller.signal.aborted) {
        console.error('Auth initialization error:', error)
      }
    })

    return () => {
      controller.abort()
    }
  }, [dispatch])

  return children
}
