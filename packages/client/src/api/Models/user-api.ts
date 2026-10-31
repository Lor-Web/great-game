import { BaseAPI } from '../base-api'
import {
  type SignUpResponse,
  SignUpResponseSchema,
  type UserDTO,
  UserDTOSchema,
} from '../Schemas/user.schema'
import HTTPTransport from '../services/HTTPTransport'

export type { UserDTO } from '../Schemas/user.schema'

const httpTransport = new HTTPTransport()

export interface SignInRequest extends Record<string, unknown> {
  login: string
  password: string
}

export interface SignUpRequest extends Record<string, unknown> {
  first_name: string
  second_name: string
  login: string
  email: string
  password: string
  phone: string
}

export interface ProfileUpdateRequest extends Record<string, unknown> {
  first_name: string
  second_name: string
  display_name: string
  login: string
  email: string
  phone: string
}

export interface PasswordUpdateRequest extends Record<string, unknown> {
  oldPassword: string
  newPassword: string
}

class UserAPI extends BaseAPI {
  // Авторизация
  signin(data: SignInRequest, signal?: AbortSignal) {
    return httpTransport.post<void>('/auth/signin', { data, signal })
  }

  // Получение текущего пользователя (после авторизации)
  getUser(signal?: AbortSignal) {
    return httpTransport.get<UserDTO>('/auth/user', {
      validate: data => UserDTOSchema.safeParse(data).success,
      signal, // передаем сигнал в запрос
    })
  }

  //Выход пользователя из приложения
  logout() {
    return httpTransport.post<void>('/auth/logout', {})
  }

  create(data: SignUpRequest, signal?: AbortSignal) {
    return httpTransport.post<SignUpResponse>('/auth/signup', {
      data,
      signal,
      validate: data => SignUpResponseSchema.safeParse(data).success,
    })
  }

  request() {
    return httpTransport.get('/full')
  }

  // Обновление данных пользователя
  update(data: ProfileUpdateRequest) {
    return httpTransport.put<UserDTO>('/user/profile', {
      data,
      validate: data => UserDTOSchema.safeParse(data).success,
    })
  }

  delete(): Promise<unknown> {
    throw new Error('ChatAPI.delete is not implemented')
  }
}

export default new UserAPI()
