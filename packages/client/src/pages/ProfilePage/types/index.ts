import type { UserDTO } from '../../../api/Models/user-api'

export interface ProfileAvatarProps {
  avatar: UserDTO['avatar']
  isEditing: boolean
}

export interface ProfileInfoProps {
  user: UserDTO
  isEditing: boolean
  onEdit: () => void
  onSuccess: () => void
}

export interface ProfilePasswordProps {
  onSuccess: () => void
}

export interface ProfilePasswordFormValues {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}
