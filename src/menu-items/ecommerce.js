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
