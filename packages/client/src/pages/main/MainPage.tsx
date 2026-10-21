import './MainPage.css'

export const MainPage = () => {
  return (
    <div className="main-page-background">
      <div className="main-page-hud-header">
        <div className="main-page-logo">GREAT GAME "MARIO ONLINE"</div>
        <nav className="main-page-navigation">
          {/*
                    <Link to='/leaderbord' className="main-page-nsvigstion-link theme-primary">
                        Лидерборд
                    </Link>
                    <Link to='/forum' className="main-page-nsvigstion-link btn-solid theme-primary">
                        ФОРУМ
                    </Link>
                    <Link to='/profile' className="main-page-nsvigstion-link btn-solid theme-primary">
                        ПРОФИЛЬ [?]
                    </Link>
                     */}
          <button
            type="button"
            className="main-page-nsvigstion-link btn-solid theme-primary">
            Лидерборд
          </button>
          <button
            type="button"
            className="main-page-nsvigstion-link btn-solid theme-primary">
            ФОРУМ
          </button>
          <button
            type="button"
            className="main-page-nsvigstion-link btn-solid theme-primary">
            ПРОФИЛЬ [?]
          </button>
        </nav>
      </div>
      <main className="main-page-body">
        {/*
                <Link to='/game' className="main-page-start-link btn-solid theme-accent">
                    START GAME
                </Link>
                 */}
        <button
          type="button"
          className="main-page-start-link btn-solid theme-accent">
          START GAME
        </button>
        <div className="main-page-description">
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
