import { Button, message } from 'antd'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import UserController from '../../api/Controllers/UserController'
import {
  LOGIN_PAGE_PATH,
  MAIN_PAGE_PATH,
} from '../../shared/constants/routes.constant'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { ProfileAvatar } from './ProfileAvatar/ProfileAvatar'
import { ProfileInfo } from './ProfileInfo/ProfileInfo'
import { ProfilePassword } from './ProfilePassword/ProfilePassword'

import styles from './profile-page.module.css'

export const ProfilePage = () => {
  const user = useAppSelector(state => state.user.user)

  const [isPasswordFormOpen, setIsPasswordFormOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isLogoutLoading, setIsLogoutLoading] = useState(false)

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  if (!user) {
    return <p>Данные пользователя не найдены</p>
  }

  const handleLogout = async () => {
    setIsLogoutLoading(true)

    try {
      await UserController.logout(dispatch)
      navigate(LOGIN_PAGE_PATH, { replace: true })
    } catch (error) {
      console.error('Ошибка выхода:', error)
      message.error('Не удалось выйти из аккаунта')
    } finally {
      setIsLogoutLoading(false)
    }
  }

  return (
    <div className={styles.background}>
      <h1 className={styles.title}>ПРОФИЛЬ</h1>

      <div className={styles.profileBg}>
        <div className={styles.profileBgLight}>
          <ProfileAvatar avatar={user.avatar} isEditing={isEditing} />

          {isPasswordFormOpen ? (
            <>
              <h2>Изменить пароль</h2>
              <ProfilePassword onSuccess={() => setIsPasswordFormOpen(false)} />
              <Button onClick={() => setIsPasswordFormOpen(false)}>
                Отмена
              </Button>
            </>
          ) : (
            <>
              <ProfileInfo
                user={user}
                isEditing={isEditing}
                onEdit={() => setIsEditing(true)}
                onSuccess={() => setIsEditing(false)}
                onCancel={() => setIsEditing(false)}
              />

              {!isEditing && (
                <Button onClick={() => setIsPasswordFormOpen(true)}>
                  Изменить пароль
                </Button>
              )}
            </>
          )}

          <Button onClick={handleLogout} loading={isLogoutLoading}>
            Выйти
          </Button>
        </div>
      </div>

      {!isEditing && !isPasswordFormOpen && (
        <nav className={styles.navigation}>
          <Link to={MAIN_PAGE_PATH} className={styles.navigationLink}>
            На главную
          </Link>
        </nav>
      )}
    </div>
  )
}
