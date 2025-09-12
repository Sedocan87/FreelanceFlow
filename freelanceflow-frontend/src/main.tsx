import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import './index.css';

import useAuthStore from './store/authStore';
import Layout from './components/shared/Layout';
import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/ClientsPage';
import ProjectsPage from './pages/ProjectsPage';
import InvoicesPage from './pages/InvoicesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const App = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const router = createBrowserRouter([
    {
      path: '/',
      element: isAuthenticated ? <Layout /> : <Navigate to="/login" />,
      children: [
        { path: '/', element: <DashboardPage /> },
        { path: '/clients', element: <ClientsPage /> },
        { path: '/projects', element: <ProjectsPage /> },
        { path: '/invoices', element: <InvoicesPage /> },
      ],
    },
    {
      path: '/login',
      element: isAuthenticated ? <Navigate to="/" /> : <LoginPage />,
    },
    {
      path: '/register',
      element: isAuthenticated ? <Navigate to="/" /> : <RegisterPage />,
    },
  ]);

  return <RouterProvider router={router} />;
};


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
