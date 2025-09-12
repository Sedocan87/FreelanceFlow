import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

import Layout from './components/shared/Layout'
import DashboardPage from './pages/DashboardPage'
import ClientsPage from './pages/ClientsPage'
import ProjectsPage from './pages/ProjectsPage'
import InvoicesPage from './pages/InvoicesPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <DashboardPage /> },
      { path: '/clients', element: <ClientsPage /> },
      { path: '/projects', element: <ProjectsPage /> },
      { path: '/invoices', element: <InvoicesPage /> },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
