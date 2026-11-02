import { UserOutlined } from '@ant-design/icons'
import { Avatar, message, Upload, type UploadProps } from 'antd'
import { useState } from 'react'
import UserController from '../../../api/Controllers/UserController'
import { BASE_URL } from '../../../api/config'
import { useAppDispatch } from '../../../store/hooks'
import type { ProfileAvatarProps } from '../types'

import styles from './profile-avatar.module.css'

export const ProfileAvatar = ({ avatar, isEditing }: ProfileAvatarProps) => {
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)

  const handleChange: UploadProps['onChange'] = async ({ file }) => {
    const selectedFile = file.originFileObj ?? (file as unknown as File)

    if (!selectedFile) return

    if (!selectedFile.type.startsWith('image/')) {
      message.error('Выберите файл изображения')
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
            <Avatar
              className={styles.avatarImage}
              src={avatar ? `${BASE_URL}/resources${avatar}` : undefined}
              icon={!avatar && <UserOutlined />}
              size={120}
            />
            <div className={styles.avatarOverlay}>
              {isLoading ? 'Загрузка...' : 'Поменять аватар'}
            </div>
          </div>
        </Upload>
      ) : (
        <Avatar
          className={styles.avatarImage}
          src={avatar ? `${BASE_URL}/resources${avatar}` : undefined}
          icon={!avatar && <UserOutlined />}
          size={120}
        />
      )}
    </div>
  )
}
