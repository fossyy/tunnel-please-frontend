import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import NotFound from './pages/NotFound'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Landing /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
