import { LoginPage } from './pages/LoginPage/LoginPage'
import { RegisterPage } from './pages/RegisterPage/RegisterPage'
import { ProfilePage } from './pages/ProfilePage/ProfilePage'
import { MainPage } from './pages/MainPage/MainPage'
import { GamePage } from './pages/GamePage/GamePage'
import { LeaderBoardPage } from './pages/LeaderBoardPage/LeaderBoardPage'
/* 
Код ниже необходимо раскомментить при мердже ветки "5.10 Верстка страницы форума"
import {
  ForumPage,
  forumSectionsLoader,
  forumThemesLoader,
} from './pages/ForumPage/ForumPage'
import { ForumContent } from './pages/ForumPage/ForumContent/ForumContent'
import { Themes } from './pages/ForumPage/Themes/Themes'
*/
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage'
import { ServerErrorPage } from './pages/ServerErrorPage/ServerErrorPage'

export const routes = [
  {
    path: '/',
    Component: LoginPage,
  },
  {
    path: '/sign-up',
    Component: RegisterPage,
  },
  {
    path: '/main',
    Component: MainPage,
  },
  {
    path: '/profile',
    Component: ProfilePage,
  },
  {
    path: '/game',
    Component: GamePage,
  },
  {
    path: '/leaderboard',
    Component: LeaderBoardPage,
  },
  /* 
  Код ниже необходимо раскомментить при мердже ветки "5.10 Верстка страницы форума"
  {
    path: '/forum',
    Component: ForumPage,
    loader: forumSectionsLoader,
  },
  {
    path: '/forum/:sectionId',
    Component: Themes,
    loader: forumThemesLoader,
  },
  {
    path: '/theme/:themeId',
    Component: ForumContent,
    loader: forumThemesLoader,
  },*/
  {
    path: '*',
    Component: NotFoundPage,
  },
  {
    path: '/500',
    Component: ServerErrorPage,
    //далее нужно будет понять что именно будем обрабатывать для 500х
  },
]