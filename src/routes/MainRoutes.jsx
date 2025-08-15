import { lazy } from 'react';

// project imports
import MainLayout from 'layouts/MainLayout';
import Loadable from 'components/Loadable';

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
  children: [
    {
      path: '/',
      element: <DashboardDefault />
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
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    },
    {
      path: 'utils',
      children: [
        {
          path: 'typography',
          element: <Typography />
        }
      ]
    }
  ]
};

export default MainRoutes;