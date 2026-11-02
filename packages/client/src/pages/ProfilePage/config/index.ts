import type { UserDTO } from '../../../api/Models/user-api'

export const MockUser: UserDTO = {
  id: 1,
  first_name: 'Анна',
  second_name: 'Иванова',
  display_name: 'Annie',
  login: 'annie123',
  email: 'annie@example.com',
  phone: '79991234567',
  avatar: '/avatar/avatar3.jpg',
}
