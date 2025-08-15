
import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Alert
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import MainCard from 'components/cards/MainCard';
import supabase from 'supabaseClient';

export default function Relatorios() {
  const [salesData, setSalesData] = useState([]);
  const [stats, setStats] = useState({
    totalVendas: 0,
    pedidosPagos: 0,
    totalClientes: 0,
    totalProdutos: 0
  });
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchReportsData();
  }, []);

  const showAlert = (message, severity = 'success') => {
    setAlert({ show: true, message, severity });
    setTimeout(() => setAlert({ show: false, message: '', severity: 'success' }), 3000);
  };

  const fetchReportsData = async () => {
    try {
      await Promise.all([
        fetchSalesChart(),
        fetchStats()
      ]);
    } catch (error) {
      showAlert('Erro ao carregar relatórios: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchSalesChart = async () => {
    try {
      // Buscar pedidos pagos dos últimos 7 dias
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data, error } = await supabase
        .from('pedidos')
        .select('created_at, total')
        .eq('status', 'pago')
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at');

      if (error) throw error;

      // Agrupar por dia
      const salesByDay = {};
      const last7Days = [];

      // Criar array com os últimos 7 dias
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        last7Days.push(dateStr);
        salesByDay[dateStr] = 0;
      }

      // Somar vendas por dia
      data?.forEach(pedido => {
        const date = new Date(pedido.created_at);
        const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        if (salesByDay[dateStr] !== undefined) {
          salesByDay[dateStr] += parseFloat(pedido.total);
        }
      });

      // Converter para formato do gráfico
      const chartData = last7Days.map(day => ({
        data: day,
        vendas: salesByDay[day]
      }));

      setSalesData(chartData);
    } catch (error) {
      console.error('Erro ao buscar dados do gráfico:', error);
    }
  };

  const fetchStats = async () => {
    try {
      // Total de vendas (pedidos pagos)
      const { data: paidOrders, error: paidError } = await supabase
        .from('pedidos')
        .select('total')
        .eq('status', 'pago');

      if (paidError) throw paidError;

      const totalVendas = paidOrders?.reduce((sum, order) => sum + parseFloat(order.total), 0) || 0;
      const pedidosPagos = paidOrders?.length || 0;

      // Total de clientes
      const { count: totalClientes, error: clientsError } = await supabase
        .from('clientes')
        .select('*', { count: 'exact', head: true });

      if (clientsError) throw clientsError;

      // Total de produtos
      const { count: totalProdutos, error: productsError } = await supabase
        .from('produtos')
        .select('*', { count: 'exact', head: true });

      if (productsError) throw productsError;

      setStats({
        totalVendas,
        pedidosPagos,
        totalClientes: totalClientes || 0,
        totalProdutos: totalProdutos || 0
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  return (
    <MainCard title="Relatórios">
      {alert.show && (
        <Alert severity={alert.severity} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Cards de Estatísticas */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total de Vendas
              </Typography>
              <Typography variant="h4" component="div">
                R$ {stats.totalVendas.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Pedidos Pagos
              </Typography>
              <Typography variant="h4" component="div">
                {stats.pedidosPagos}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total de Clientes
              </Typography>
              <Typography variant="h4" component="div">
                {stats.totalClientes}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total de Produtos
              </Typography>
              <Typography variant="h4" component="div">
                {stats.totalProdutos}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfico de Vendas */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Vendas dos Últimos 7 Dias
              </Typography>
              <Box sx={{ width: '100%', height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="data" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`R$ ${value.toFixed(2)}`, 'Vendas']}
                    />
                    <Legend />
                    <Bar dataKey="vendas" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </MainCard>
  );
}
