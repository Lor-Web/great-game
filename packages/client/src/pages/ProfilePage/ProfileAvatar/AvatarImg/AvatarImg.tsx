import { UserOutlined } from '@ant-design/icons'
import { Avatar } from 'antd'
import { BASE_URL } from '../../../../api/config'
import type { AvatarImgProps } from '../../types'

import styles from './avatar-img.module.css'

export const AvatarImg = ({ avatar }: AvatarImgProps) => {
  return (
    <Avatar
      className={styles.avatarImage}
      src={avatar ? `${BASE_URL}/resources${avatar}` : undefined}
      icon={!avatar && <UserOutlined />}
      size={120}
    />
  )
}
