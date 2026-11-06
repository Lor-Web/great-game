import type { UserDTO } from '../../../api/Models/user-api'

export interface ProfileAvatarProps {
  avatar: UserDTO['avatar']
  isEditing: boolean
}

export type AvatarImgProps = Pick<ProfileAvatarProps, 'avatar'>

export interface ProfileInfoProps {
  user: UserDTO
  isEditing: boolean
  onEdit: () => void
  onSuccess: () => void
  onCancel: () => void
}

export interface ProfilePasswordProps {
  onSuccess: () => void
}

export interface ProfilePasswordFormValues {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}
