import type { UserDTO } from '../api/Models/user-api'
import { UserDTOSchema } from '../api/Schemas/user.schema'

const OFFLINE_ACCESS_KEY = 'great-game-offline-access'
const OFFLINE_USER_KEY = 'great-game-offline-user'

export const saveOfflineAccess = () => {
  localStorage.setItem(OFFLINE_ACCESS_KEY, 'true')
}

export const hasOfflineAccess = () => {
  return localStorage.getItem(OFFLINE_ACCESS_KEY) === 'true'
}

export const clearOfflineAccess = () => {
  localStorage.removeItem(OFFLINE_ACCESS_KEY)
}

export const saveOfflineUser = (user: UserDTO) => {
  localStorage.setItem(OFFLINE_USER_KEY, JSON.stringify(user))
}

export const getOfflineUser = (): UserDTO | null => {
  const savedUser = localStorage.getItem(OFFLINE_USER_KEY)

  if (!savedUser) {
    return null
  }

  try {
    const result = UserDTOSchema.safeParse(JSON.parse(savedUser))
    return result.success ? result.data : null
  } catch {
    return null
  }
}

export const clearOfflineUser = () => {
  localStorage.removeItem(OFFLINE_USER_KEY)
}
