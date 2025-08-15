import { lazy } from 'react';
import Loadable from 'components/Loadable';
import MainLayout from 'layouts/MainLayout';

// ==============================|| PÁGINAS DO PAINEL ||============================== //

// Dashboard
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/default')));
const SamplePage = Loadable(lazy(() => import('views/pages/SamplePage')));

// Components
const UtilsTypography = Loadable(lazy(() => import('views/components/Typography')));

// E-commerce (Produtos, Pedidos, Clientes, Relatórios)
const Produtos = Loadable(lazy(() => import('pages/Ecommerce/Produtos')));
const Pedidos = Loadable(lazy(() => import('pages/Ecommerce/Pedidos')));
const Clientes = Loadable(lazy(() => import('pages/Ecommerce/Clientes')));
const Relatorios = Loadable(lazy(() => import('pages/Ecommerce/Relatorios')));

// ==============================|| MAIN ROUTES ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    // Dashboard
    { path: '/', element: <DashboardDefault /> },
    { path: '/dashboard/default', element: <DashboardDefault /> },

    // Sample Page
    { path: '/sample-page', element: <SamplePage /> },

    // Components
    {
      path: 'components',
      children: [
        { path: 'typography', element: <UtilsTypography /> }
      ]
    },

    // E-commerce
    { path: '/produtos', element: <Produtos /> },
    { path: '/pedidos', element: <Pedidos /> },
    { path: '/clientes', element: <Clientes /> },
    { path: '/relatorios', element: <Relatorios /> }
  ]
};

export default MainRoutes;
