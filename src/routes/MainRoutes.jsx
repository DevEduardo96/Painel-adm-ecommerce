
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// project imports
import MainLayout from 'layouts/MainLayout';
import Loadable from 'components/Loadable';
import ErrorFallback from 'components/ErrorFallback';
import ProtectedRoute from 'components/ProtectedRoute';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/default')));

// ecommerce routing
const Produtos = Loadable(lazy(() => import('pages/Ecommerce/Produtos')));
const Clientes = Loadable(lazy(() => import('pages/Ecommerce/Clientes')));
const Pedidos = Loadable(lazy(() => import('pages/Ecommerce/Pedidos')));
const Relatorios = Loadable(lazy(() => import('pages/Ecommerce/Relatorios')));

// pages routing
const SamplePage = Loadable(lazy(() => import('views/pages/SamplePage')));

// utilities routing
const Typography = Loadable(lazy(() => import('views/components/Typography')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  ),
  errorElement: <ErrorFallback />,
  children: [
    {
      path: '/',
      element: <Navigate to="/dashboard" />
    },
    {
      path: 'dashboard',
      element: <DashboardDefault />
    },
    {
      path: 'ecommerce',
      children: [
        {
          path: 'produtos',
          element: <Produtos />
        },
        {
          path: 'clientes',
          element: <Clientes />
        },
        {
          path: 'pedidos',
          element: <Pedidos />
        },
        {
          path: 'relatorios',
          element: <Relatorios />
        }
      ]
    },
    {
      path: 'components',
      children: [
        {
          path: 'typography',
          element: <Typography />
        }
      ]
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    }
  ]
};

export default MainRoutes;
