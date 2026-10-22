import { Link } from 'react-router-dom'

import styles from './main-page.module.css'

const NaavigationItems = [
  {
    to: '/leaderbord',
    text: 'ЛИДЕРБОРД',
  },
  {
    to: '/forum',
    text: 'ФОРУМ',
  },
  {
    to: '/profile',
    text: 'ПРОФИЛЬ [?]',
  },
]

export const MainPage = () => {
  return (
    <div className={styles.background}>
      <div className={styles.hudheader}>
        <div className={styles.logo}>GREAT GAME "MARIO ONLINE"</div>
        <nav className={styles.navigation}>
          {NaavigationItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={styles['navigation-link']}>
              {item.text}
            </Link>
          ))}
        </nav>
      </div>
      <main className={styles.body}>
        <Link to="/game" className={styles['start-link']}>
          START GAME
        </Link>
        <div className={styles.description}>
          Культовая аркадная игра-платформер!
          <ul>
            <li>
              Прохождение уровней: Игрок бежит слева направо, преодолевая
              препятствия, прыгая по платформам и уворачиваясь от ловушек. Время
              на каждый уровень ограничено.
            </li>
            <li>
              Бонусы и улучшения: Разбивая головой кирпичные блоки и блоки с
              вопросительным знаком [?], игрок находит полезные предметы:
            </li>
            <li>
              Сбор монет: За каждые 100 собранных золотых монет игрок получает
              дополнительную жизнь.
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}
