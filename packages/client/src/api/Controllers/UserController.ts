import type { AppDispatch } from '../../store'
import { setUser } from '../../store/userSlice'
import UserAPI, {
  type SignInRequest,
  type SignUpRequest,
  type UserDTO,
} from '../Models/user-api'

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
    return UserAPI.getUser()
      .then((data: UserDTO) => {
        dispatch(setUser(data))
        return data
      })
      .catch(error => {
        if (error?.status === 401) {
          dispatch(setUser(null))
          return null
        }

        if (signal?.aborted) return null
        console.error('getUser error:', error)
        throw error
      })
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
}

export default new UserController()
