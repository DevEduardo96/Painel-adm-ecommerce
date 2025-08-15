const ecommerce = {
  id: 'ecommerce',
  title: 'E-commerce',
  type: 'group',
  children: [
    { id: 'produtos', title: 'Produtos', type: 'item', url: '/produtos' },
    { id: 'pedidos', title: 'Pedidos', type: 'item', url: '/pedidos' },
    { id: 'clientes', title: 'Clientes', type: 'item', url: '/clientes' },
    { id: 'relatorios', title: 'Relatórios', type: 'item', url: '/relatorios' }
  ]
};

export default ecommerce;
// assets
import { IconShoppingCart, IconUsers, IconFileText, IconChartLine } from '@tabler/icons-react';

// constant
const icons = { IconShoppingCart, IconUsers, IconFileText, IconChartLine };

// ==============================|| ECOMMERCE MENU ITEMS ||============================== //

const ecommerce = {
  id: 'ecommerce',
  title: 'E-commerce',
  type: 'group',
  children: [
    {
      id: 'produtos',
      title: 'Produtos',
      type: 'item',
      url: '/produtos',
      icon: icons.IconShoppingCart,
      breadcrumbs: false
    },
    {
      id: 'clientes',
      title: 'Clientes',
      type: 'item',
      url: '/clientes',
      icon: icons.IconUsers,
      breadcrumbs: false
    },
    {
      id: 'pedidos',
      title: 'Pedidos',
      type: 'item',
      url: '/pedidos',
      icon: icons.IconFileText,
      breadcrumbs: false
    },
    {
      id: 'relatorios',
      title: 'Relatórios',
      type: 'item',
      url: '/relatorios',
      icon: icons.IconChartLine,
      breadcrumbs: false
    }
  ]
};

export default ecommerce;
