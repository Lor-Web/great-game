import { message, Upload, type UploadProps } from 'antd'
import { useState } from 'react'
import UserController from '../../../api/Controllers/UserController'
import { useAppDispatch } from '../../../store/hooks'
import type { ProfileAvatarProps } from '../types'
import { AvatarImg } from './AvatarImg/AvatarImg'

import styles from './profile-avatar.module.css'

export const ProfileAvatar = ({ avatar, isEditing }: ProfileAvatarProps) => {
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)

  const handleChange: UploadProps['onChange'] = async ({ file }) => {
    const selectedFile = file instanceof File ? file : file.originFileObj

    const MAX_FILE_SIZE = 5 * 1024 * 1024

    if (!selectedFile) return

    if (!selectedFile.type.startsWith('image/')) {
      message.error('Выберите файл изображения')
      return
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      message.error('Размер файла не должен превышать 5 МБ')
      return
    }

    const formData = new FormData()
    formData.append('avatar', selectedFile)

    setIsLoading(true)

    try {
      await UserController.updateAvatar(formData, dispatch)
      message.success('Аватар успешно обновлён')
    } catch (error) {
      console.error('Ошибка обновления аватара:', error)
      message.error('Не удалось обновить аватар')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.avatar}>
      {isEditing ? (
        <Upload
          accept="image/*"
          showUploadList={false}
          beforeUpload={() => false}
          onChange={handleChange}
          disabled={isLoading}>
          <div className={styles.avatarUpload}>
            <AvatarImg avatar={avatar} />
            <div className={styles.avatarOverlay}>
              {isLoading ? 'Загрузка...' : 'Поменять аватар'}
            </div>
          </div>
        </Upload>
      ) : (
        <AvatarImg avatar={avatar} />
      )}
    </div>
  )
}
