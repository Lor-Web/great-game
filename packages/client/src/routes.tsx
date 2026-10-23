import { ForumContent } from './pages/ForumPage/ForumContent/ForumContent'
import {
  ForumPage,
  forumSectionsLoader,
  forumThemesLoader,
} from './pages/ForumPage/ForumPage'
import { Themes } from './pages/ForumPage/Themes/Themes'

export const routes = [
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
  },
]
