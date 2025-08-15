import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// project imports
import MainLayout from 'layouts/MainLayout';
import Loadable from 'components/Loadable';
import ErrorFallback from 'components/ErrorFallback';

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
  element: <MainLayout />,
  errorElement: <ErrorFallback />,
  children: [
    {
      path: '',
      element: <Navigate to="/dashboard/default" replace />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'produtos',
      element: <Produtos />,
      errorElement: <ErrorFallback />
    },
    {
      path: 'clientes',
      element: <Clientes />,
      errorElement: <ErrorFallback />
    },
    {
      path: 'pedidos',
      element: <Pedidos />,
      errorElement: <ErrorFallback />
    },
    {
      path: 'relatorios',
      element: <Relatorios />,
      errorElement: <ErrorFallback />
    },
    {
      path: 'sample-page',
      element: <SamplePage />,
      errorElement: <ErrorFallback />
    },
    {
      path: 'utils',
      children: [
        {
          path: 'typography',
          element: <Typography />,
          errorElement: <ErrorFallback />
        }
      ]
    }
  ]
};

export default MainRoutes;