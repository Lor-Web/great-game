import styled from 'styled-components'
import { Helmet } from 'react-helmet-async'
import { useSelector } from 'react-redux'
import { fetchUserThunk, selectUser } from '../../slices/userSlice'
import { usePage } from '../../hooks/usePage'
import { Header } from '../../components/Header'
import { PageInitArgs } from '../../routes'
import bg from '../../../public/main-bg.png'

export const MainPage = () => {
  const user = useSelector(selectUser)

  usePage({ initPage: initMainPage })
  return (
    <MainPageBackground>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Главная</title>
        <meta
          name="description"
          content="Главная страница с информацией о пользователе"
        />
      </Helmet>
      <Header />
      <HudHeader>
        <Logo>GREAT GAME "MARIO ONLINE"</Logo>
        <Navigation>
          <PixelButton className="pixel-btn btn-solid theme-primary">
            Лидерборд
          </PixelButton>
          <PixelButton className="pixel-btn btn-solid theme-primary">
            ФОРУМ
          </PixelButton>
          <PixelButton className="pixel-btn btn-solid theme-primary">
            ПРОФИЛЬ [?]
          </PixelButton>
        </Navigation>
      </HudHeader>
      <Main className="main-menu">
        <StartButton className="pixel-btn btn-solid theme-accent">
          START GAME
        </StartButton>
        <Description>
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
        </Description>
      </Main>
    </MainPageBackground>
  )
}

const Logo = styled.div`
  font-size: 24px;
  color: #f8b800;
  text-shadow: 4px 4px #000;
`

const MainPageBackground = styled.div`
  background: var(--bg-blue-color); /* Тот самый синий цвет неба из Марио */
  font-family: 'Press Start 2P', cursive;
  color: #ffffff;
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  background-image: url('../../../public/main-bg.png');
  background-position-y: bottom;
  background-repeat: repeat-x;
`

const HudHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background: rgba(0, 0, 0, 0.4);
  border-bottom: 4px solid #000;
`

const Navigation = styled.nav`
  margin-top: 18px;
  display: flex;
  flex-direction: column;
`

const Description = styled.text`
  background: rgba(0, 0, 0, 0.4);
  padding: 16px;
`

const PixelButton = styled.button`
  margin-bottom: 12px;
`

const Main = styled.main`
  display: flex;
  flex-direction: column;
  margin: auto;
  margin-top: 24px;
  width: 75%;
  align-items: center;
`

const StartButton = styled.button`
  font-size: 32px;
  padding: 24px 48px;
  animation: blink 1.5s infinite;
  margin-bottom: 24px;

  &:hover {
    animation: none;
  }

  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
  }
`

export const initMainPage = async ({ dispatch, state }: PageInitArgs) => {
  if (!selectUser(state)) {
    return dispatch(fetchUserThunk())
  }
}
