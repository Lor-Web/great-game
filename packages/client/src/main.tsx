import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ForumContent } from './pages/ForumPage/ForumContent/ForumContent'
import {
  ForumPage,
  forumSectionsLoader,
  forumThemesLoader,
} from './pages/ForumPage/ForumPage'
import { Themes } from './pages/ForumPage/Themes/Themes'
import { MainPage } from './pages/MainPage/MainPage'

const routes = [
  {
    path: '/main',
    Component: MainPage,
  },
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

const router = createBrowserRouter(routes)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <RouterProvider router={router} />
)
