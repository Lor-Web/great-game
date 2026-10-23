import { Link } from 'react-router-dom'

import styles from './main-page.module.css'

export const MainPage = () => {
  return (
    <div className={styles.background}>
      <div className={styles.hudheader}>
        <div className={styles.logo}>GREAT GAME "MARIO ONLINE"</div>
        <nav className={styles.navigation}>
          {NavigationItems.map(item => (
            <Link key={item.to} to={item.to} className={styles.navigationLink}>
              {item.text}
            </Link>
          ))}
        </nav>
      </div>
      <main className={styles.body}>
        <Link to="/game" className={styles.startLink}>
          START GAME
        </Link>
        <div className={styles.description}>
          Культовая аркадная игра-платформер!
          <ul>
            {GameDescriptionItems.map(item => (
              <li key={item.id}>{item.text}</li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  )
}

const NavigationItems = [
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

const GameDescriptionItems = [
  {
    id: 1,
    text: 'Прохождение уровней: Игрок бежит слева направо, преодолевая препятствия, прыгая по платформам и уворачиваясь от ловушек.Время на каждый уровень ограничено.',
  },
  {
    id: 2,
    text: 'Бонусы и улучшения: Разбивая головой кирпичные блоки и блоки с вопросительным знаком [?], игрок находит полезные предметы.',
  },
  {
    id: 3,
    text: 'Сбор монет: За каждые 100 собранных золотых монет игрок получает дополнительную жизнь.',
  },
]
