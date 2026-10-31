// Прослойка для отслеживания статуса пользователя, когда заработает в него нужно будет обернуть недоступные для авторизованных пользователей страницы
//import { ProtectedLayout } from './protectedLayout/protectedLayout'
import GamePage from './pages/GamePage/GamePage'
import { LeaderBoardPage } from './pages/LeaderBoardPage/LeaderBoardPage'
import { LoginPage } from './pages/LoginPage/LoginPage'
import { MainPage } from './pages/MainPage/MainPage'

import { ForumContent } from './pages/ForumPage/ForumContent/ForumContent'
import {
  ForumPage,
  forumSectionsLoader,
  forumThemesLoader,
  themeMessagesLoader,
} from './pages/ForumPage/ForumPage'
import { Themes } from './pages/ForumPage/Themes/Themes'
import GamePage from './pages/GamePage/GamePage'
import { LeaderBoardPage } from './pages/LeaderBoardPage/LeaderBoardPage'
import { LoginPage } from './pages/LoginPage/LoginPage'
import { MainPage } from './pages/MainPage/MainPage'
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage'
import { ProfilePage } from './pages/ProfilePage/ProfilePage'
import { RegisterPage } from './pages/RegisterPage/RegisterPage'
import { ServerErrorPage } from './pages/ServerErrorPage/ServerErrorPage'
import {
  FORUM_PAGE_PATH,
  FORUM_SECTION_PAGE_PATH,
  GAME_PAGE_PATH,
  LEADERBOARD_PAGE_PATH,
  LOGIN_PAGE_PATH,
  MAIN_PAGE_PATH,
  NOT_FOUND_PAGE_PATH,
  PROFILE_PAGE_PATH,
  REGISTER_PAGE_PATH,
  SERVER_ERROR_PAGE_PATH,
  THEME_PAGE_PATH,
} from './shared/constants/routes.constant'

export const routes = [
  {
    path: LOGIN_PAGE_PATH,
    Component: LoginPage,
  },
  {
    path: REGISTER_PAGE_PATH,
    Component: RegisterPage,
  },
  {
    path: MAIN_PAGE_PATH,
    Component: MainPage,
  },
  {
    path: PROFILE_PAGE_PATH,
    Component: ProfilePage,
  },
  {
    path: GAME_PAGE_PATH,
    Component: GamePage,
  },
  {
    path: LEADERBOARD_PAGE_PATH,
    Component: LeaderBoardPage,
  },
  {
    path: FORUM_PAGE_PATH,
    Component: ForumPage,
    loader: forumSectionsLoader,
  },
  {
    path: FORUM_SECTION_PAGE_PATH,
    Component: Themes,
    loader: forumThemesLoader,
  },
  {
    path: THEME_PAGE_PATH,
    Component: ForumContent,
    loader: themeMessagesLoader,
  },
  {
    path: NOT_FOUND_PAGE_PATH,
    Component: NotFoundPage,
  },
  {
    path: SERVER_ERROR_PAGE_PATH,
    Component: ServerErrorPage,
    //далее нужно будет понять что именно будем обрабатывать для 500х
  },
]
