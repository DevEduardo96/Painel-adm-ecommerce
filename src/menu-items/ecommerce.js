import { IconShoppingCart, IconUsers, IconClipboardList, IconChartBar } from '@tabler/icons-react';

const icons = {
  IconShoppingCart,
  IconUsers,
  IconClipboardList,
  IconChartBar
};

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
      icon: icons.IconClipboardList,
      breadcrumbs: false
    },
    {
      id: 'relatorios',
      title: 'Relatórios',
      type: 'item',
      url: '/relatorios',
      icon: icons.IconChartBar,
      breadcrumbs: false
    }
  ]
};

export default ecommerce;