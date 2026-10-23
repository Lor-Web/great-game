import UserAPI, {
  type SignInRequest,
  type UserDTO,
  type SignUpRequest,
  type ProfileUpdateRequest,
  type PasswordUpdateRequest,
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

  // public logout() {
  //   return UserAPI.logout()
  //     .then(() => {
  //       store.setState('user', null);
  //     })
  //     .catch((error) => {
  //       // eslint-disable-next-line no-console
  //       console.error('logout error:', error);
  //       throw error;
  //     });
  // }

  public async updateProfile(data: ProfileUpdateRequest) {
    try {
      const updatedUser = await UserAPI.update(data)
    } catch (error) {
      console.error('updateProfile error:', error)
      throw error
    }
  }

  // public async updateAvatar(data: FormData): Promise<void> {
  //   try {
  //     const updatedUser = await UserAPI.updateAvatar(data);

  //     store.setState('user', updatedUser);
  //   } catch (error) {
  //     // eslint-disable-next-line no-console
  //     console.error('updateAvatar error в UserController:', error);
  //     // Пробрасываем ошибку дальше, чтобы компонент мог вывести её в UI
  //     throw error;
  //   }
  // }

  // public async updatePassword(data: PasswordUpdateRequest): Promise<void> {
  //   try {
  //     await UserAPI.updatePassword(data);
  //   } catch (error) {
  //     // eslint-disable-next-line no-console
  //     console.error('updatePassword error :', error);
  //     throw error;
  //   }
  // }
}

export default new UserController()
