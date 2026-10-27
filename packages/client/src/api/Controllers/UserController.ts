import UserAPI, {
  type SignInRequest,
  type SignUpRequest,
  type UserDTO,
} from '../Models/user-api'

class UserController {
  public async signin(data: SignInRequest) {
    return UserAPI.signin(data)
      .then(() => this.getUser())
      .catch(error => {
        console.error('signin error:', error)
        throw error
      })
  }

  public async getUser(): Promise<UserDTO | null> {
    return UserAPI.getUser()
      .then((data: UserDTO) => {
        return data
      })
      .catch(error => {
        if (error?.status === 401) {
          return null
        }
        console.error('getUser error:', error)
        throw error
      })
  }

  public async signup(data: SignUpRequest) {
    try {
      //Создаем пользователя
      await UserAPI.create(data)

      await this.getUser()
    } catch (error) {
      console.error('signup error:', error)
      throw error
    }
  }
}

export default new UserController()
