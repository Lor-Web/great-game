import type { AppDispatch } from '../../store'
import { clearUser, setLoading, setUser } from '../../store/userSlice'
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

class UserController {
  public async signin(
    data: SignInRequest,
    dispatch: AppDispatch,
    signal?: AbortSignal
  ) {
    return UserAPI.signin(data, signal)
      .then(() => this.getUser(dispatch, signal))
      .catch(error => {
        console.error('signin error:', error)
        throw error
      })
  }

  public async getUser(
    dispatch: AppDispatch,
    signal?: AbortSignal
  ): Promise<UserDTO | null> {
    dispatch(setLoading(true))
    try {
      const data = await UserAPI.getUser(signal)
      dispatch(setUser(data))
      return data
    } catch (error) {
      if (isHTTPError(error) && error.status === 401) {
        dispatch(setUser(null))
        return null
      }

      if (signal?.aborted) return null
      console.error('getUser error:', error)
      throw error
    } finally {
      dispatch(setLoading(false))
    }
  }

  public async signup(
    data: SignUpRequest,
    dispatch: AppDispatch,
    signal?: AbortSignal
  ) {
    try {
      //Создаем пользователя
      await UserAPI.create(data, signal)

      const user = await this.getUser(dispatch, signal)

      if (!user) {
        throw new Error('Ошибка во время входа.')
      }

      return user
    } catch (error) {
      if (signal?.aborted) return null
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
    try {
      const user = await UserAPI.updateAvatar(data)

      dispatch(setUser(user))

      return user
    } catch (error) {
      console.error('updateAvatar error:', error)
      throw error
    }
  }

  //Выход их профиля
  public async logout(dispatch: AppDispatch) {
    try {
      await UserAPI.logout()
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
    try {
      const user = await UserAPI.update(data)

      dispatch(setUser(user))

      return user
    } catch (error) {
      console.error('updateProfile error:', error)
      throw error
    }
  }
}

export default new UserController()
