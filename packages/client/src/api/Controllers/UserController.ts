import type { AppDispatch } from '../../store'
import {
  clearUser,
  setAuthError,
  setLoading,
  setOffline,
  setUser,
} from '../../store/userSlice'
import {
  clearOfflineAccess,
  clearOfflineUser,
  getOfflineUser,
  hasOfflineAccess,
  saveOfflineAccess,
  saveOfflineUser,
} from '../../utils/offlineAccess'
import UserAPI, {
  type PasswordUpdateRequest,
  type ProfileUpdateRequest,
  type SignInRequest,
  type SignUpRequest,
  type UserDTO,
} from '../Models/user-api'
import type { HTTPError } from '../services/HTTPTransport'

function isHTTPError(error: unknown): error is HTTPError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    typeof error.status === 'number'
  )
}

function isOfflineError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'reason' in error &&
    (error.reason === 'Network error' || error.reason === 'Request timeout')
  )
}

class UserController {
  private getUserRequestId = 0
  private sessionVersion = 0
  private activeGetUserRequests = 0

  public async signin(
    data: SignInRequest,
    dispatch: AppDispatch,
    signal?: AbortSignal
  ) {
    const sessionVersion = this.sessionVersion

    try {
      await UserAPI.signin(data, signal)

      if (signal?.aborted || sessionVersion !== this.sessionVersion) {
        return null
      }

      return await this.getUser(dispatch, signal)
    } catch (error) {
      //Костыль если пользователь уже зарегестрирован
      if (
        isHTTPError(error) &&
        error.status === 400 &&
        error.response?.includes('User already in system')
      ) {
        await UserAPI.logout()
        return await this.getUser(dispatch, signal)
      }

      console.error('signin error:', error)
      throw error
    }
  }

  public async getUser(
    dispatch: AppDispatch,
    signal?: AbortSignal
  ): Promise<UserDTO | null> {
    const requestId = ++this.getUserRequestId
    const sessionVersion = this.sessionVersion

    this.activeGetUserRequests++
    dispatch(setLoading(true))

    try {
      const data = await UserAPI.getUser(signal)

      if (
        signal?.aborted ||
        requestId !== this.getUserRequestId ||
        sessionVersion !== this.sessionVersion
      ) {
        return null
      }

      dispatch(setUser(data))
      dispatch(setAuthError(false))
      dispatch(setOffline(false))
      saveOfflineAccess()
      saveOfflineUser(data)
      return data
    } catch (error) {
      if (
        signal?.aborted ||
        requestId !== this.getUserRequestId ||
        sessionVersion !== this.sessionVersion
      ) {
        return null
      }

      if (isHTTPError(error) && error.status === 401) {
        clearOfflineAccess()
        clearOfflineUser()
        dispatch(setOffline(false))
        dispatch(setAuthError(false))
        dispatch(setUser(null))
        return null
      }

      if (!navigator.onLine && hasOfflineAccess() && isOfflineError(error)) {
        const offlineUser = getOfflineUser()

        if (offlineUser) {
          dispatch(setUser(offlineUser))
        }

        dispatch(setOffline(true))
        dispatch(setAuthError(false))
        return offlineUser
      }

      dispatch(setOffline(false))
      console.error('getUser error:', error)
      dispatch(setAuthError(true))
      throw error
    } finally {
      this.activeGetUserRequests--
      dispatch(setLoading(this.activeGetUserRequests > 0))
    }
  }

  public async signup(
    data: SignUpRequest,
    dispatch: AppDispatch,
    signal?: AbortSignal
  ) {
    const sessionVersion = this.sessionVersion

    try {
      //Создаем пользователя
      await UserAPI.create(data, signal)

      if (signal?.aborted || sessionVersion !== this.sessionVersion) {
        return null
      }
      const user = await this.getUser(dispatch, signal)

      if (!user) {
        throw new Error('Ошибка во время входа.')
      }

      return user
    } catch (error) {
      if (signal?.aborted || sessionVersion !== this.sessionVersion) return null
      console.error('signup error:', error)
      throw error
    }
  }

  // Смена пароля
  public async updatePassword(data: PasswordUpdateRequest) {
    try {
      await UserAPI.updatePassword(data)
    } catch (error) {
      console.error('updatePassword error:', error)
      throw error
    }
  }

  // Обновление аватара
  public async updateAvatar(data: FormData, dispatch: AppDispatch) {
    const sessionVersion = this.sessionVersion

    try {
      const user = await UserAPI.updateAvatar(data)
      if (sessionVersion !== this.sessionVersion) return null

      dispatch(setUser(user))
      saveOfflineUser(user)

      return user
    } catch (error) {
      console.error('updateAvatar error:', error)
      throw error
    }
  }

  //Выход их профиля
  public async logout(dispatch: AppDispatch) {
    this.sessionVersion++
    this.getUserRequestId++

    try {
      await UserAPI.logout()
      clearOfflineAccess()
      clearOfflineUser()
      dispatch(clearUser())
    } catch (error) {
      console.error('logout error:', error)
      throw error
    }
  }

  // Обновление данных пользователя
  public async updateProfile(
    data: ProfileUpdateRequest,
    dispatch: AppDispatch
  ) {
    const sessionVersion = this.sessionVersion

    try {
      const user = await UserAPI.update(data)

      if (sessionVersion !== this.sessionVersion) return null

      dispatch(setUser(user))
      saveOfflineUser(user)

      return user
    } catch (error) {
      console.error('updateProfile error:', error)
      throw error
    }
  }
}

export default new UserController()
