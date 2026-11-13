import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthInitializer } from './components/AuthInitializer/AuthInitializer'
import { routes } from './routes'
import { store } from './store'

const router = createBrowserRouter(routes)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <HelmetProvider>
      <AuthInitializer>
        <RouterProvider router={router} />
      </AuthInitializer>
    </HelmetProvider>
  </Provider>
)
