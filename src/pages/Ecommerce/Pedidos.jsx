
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Alert,
  Grid
} from '@mui/material';
import { IconPlus, IconEdit } from '@tabler/icons-react';
import MainCard from 'components/cards/MainCard';
import supabase from 'supabaseClient';

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentOrder, setCurrentOrder] = useState({
    cliente_id: '',
    status: 'pendente',
    total: ''
  });
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });

  const statusColors = {
    pendente: 'warning',
    pago: 'info',
    enviado: 'primary',
    concluido: 'success'
  };

  const statusOptions = [
    { value: 'pendente', label: 'Pendente' },
    { value: 'pago', label: 'Pago' },
    { value: 'enviado', label: 'Enviado' },
    { value: 'concluido', label: 'Concluído' }
  ];

  useEffect(() => {
    fetchPedidos();
    fetchClientes();
  }, []);

  const fetchPedidos = async () => {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select(`
          *,
          clientes (
            nome,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPedidos(data || []);
    } catch (error) {
      showAlert('Erro ao carregar pedidos: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchClientes = async () => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('id, nome, email')
        .order('nome');

      if (error) throw error;
      setClientes(data || []);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  const showAlert = (message, severity = 'success') => {
    setAlert({ show: true, message, severity });
    setTimeout(() => setAlert({ show: false, message: '', severity: 'success' }), 3000);
  };

  const handleOpen = (pedido = null) => {
    if (pedido) {
      setCurrentOrder({
        id: pedido.id,
        cliente_id: pedido.cliente_id,
        status: pedido.status,
        total: pedido.total
      });
      setEditMode(true);
    } else {
      setCurrentOrder({
        cliente_id: '',
        status: 'pendente',
        total: ''
      });
      setEditMode(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentOrder({
      cliente_id: '',
      status: 'pendente',
      total: ''
    });
  };

  const handleInputChange = (field, value) => {
    setCurrentOrder(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!currentOrder.cliente_id || !currentOrder.total) {
        showAlert('Cliente e total são obrigatórios', 'error');
        return;
      }

      const orderData = {
        cliente_id: currentOrder.cliente_id,
        status: currentOrder.status,
        total: parseFloat(currentOrder.total)
      };

      if (editMode) {
        const { error } = await supabase
          .from('pedidos')
          .update(orderData)
          .eq('id', currentOrder.id);

        if (error) throw error;
        showAlert('Pedido atualizado com sucesso!');
      } else {
        const { error } = await supabase
          .from('pedidos')
          .insert([orderData]);

        if (error) throw error;
        showAlert('Pedido criado com sucesso!');
      }

      handleClose();
      fetchPedidos();
    } catch (error) {
      showAlert('Erro ao salvar pedido: ' + error.message, 'error');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <MainCard title="Pedidos">
      {alert.show && (
        <Alert severity={alert.severity} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<IconPlus />}
          onClick={() => handleOpen()}
        >
          Novo Pedido
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pedidos.map((pedido) => (
              <TableRow key={pedido.id}>
                <TableCell>{pedido.id.substring(0, 8)}</TableCell>
                <TableCell>{pedido.clientes?.nome || 'N/A'}</TableCell>
                <TableCell>{pedido.clientes?.email || 'N/A'}</TableCell>
                <TableCell>R$ {pedido.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip
                    label={pedido.status}
                    color={statusColors[pedido.status]}
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatDate(pedido.created_at)}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpen(pedido)}
                  >
                    <IconEdit />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editMode ? 'Editar Pedido' : 'Novo Pedido'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Cliente *</InputLabel>
                <Select
                  value={currentOrder.cliente_id}
                  onChange={(e) => handleInputChange('cliente_id', e.target.value)}
                >
                  {clientes.map((cliente) => (
                    <MenuItem key={cliente.id} value={cliente.id}>
                      {cliente.nome} - {cliente.email}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Total *"
                type="number"
                value={currentOrder.total}
                onChange={(e) => handleInputChange('total', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={currentOrder.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editMode ? 'Atualizar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}
