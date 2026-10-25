import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { GamePage } from './pages/GamePage/GamePage'
import { MainPage } from './pages/MainPage/MainPage'

const routes = [
  {
    path: '/main',
    Component: MainPage,
  },
  {
    path: '/game',
    Component: GamePage,
  },
]

const router = createBrowserRouter(routes)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <RouterProvider router={router} />
)
