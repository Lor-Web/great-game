import { z } from 'zod'
//Выполняем проверки через пакет zod

//Схема для успешной регистрации (сервер возвращает только id)
export const SignUpResponseSchema = z.object({
  id: z.number(),
})
export type SignUpResponse = z.infer<typeof SignUpResponseSchema>

// основной объект пользователя
export const UserDTOSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  second_name: z.string(),
  display_name: z.string().nullable().catch(null),
  login: z.string(),
  email: z.string().email(),
  phone: z.string(),
  avatar: z.string().nullable().catch(null),
})
export type UserDTO = z.infer<typeof UserDTOSchema>
