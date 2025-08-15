import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
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
import { useAuth } from 'contexts/AuthContext';
import supabase from 'supabaseClient';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentClient, setCurrentClient] = useState({
    nome: '',
    email: '',
    telefone: ''
  });
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchClientes();
    } else {
      setLoading(false); // Stop loading if not authenticated
      showAlert('Por favor, faça login para acessar esta página.', 'warning');
    }
  }, [isAuthenticated]); // Re-run effect when authentication state changes

  const fetchClientes = async () => {
    setLoading(true); // Start loading when fetching
    if (!isAuthenticated) {
      showAlert('Usuário não autenticado', 'error');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('nome'); // Assuming order by 'nome' as in the provided snippet

      if (error) throw error;
      setClientes(data || []);
    } catch (error) {
      showAlert('Erro ao carregar clientes: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, severity = 'success') => {
    setAlert({ show: true, message, severity });
    setTimeout(() => setAlert({ show: false, message: '', severity: 'success' }), 3000);
  };

  const handleOpen = (cliente = null) => {
    if (cliente) {
      setCurrentClient(cliente);
      setEditMode(true);
    } else {
      setCurrentClient({
        nome: '',
        email: '',
        telefone: ''
      });
      setEditMode(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentClient({
      nome: '',
      email: '',
      telefone: ''
    });
  };

  const handleInputChange = (field, value) => {
    setCurrentClient(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      showAlert('Você precisa estar logado para realizar esta ação.', 'error');
      return;
    }

    try {
      if (!currentClient.nome || !currentClient.email) {
        showAlert('Nome e email são obrigatórios', 'error');
        return;
      }

      const clientData = {
        nome: currentClient.nome,
        email: currentClient.email,
        telefone: currentClient.telefone
      };

      if (editMode) {
        const { error } = await supabase
          .from('clientes')
          .update(clientData)
          .eq('id', currentClient.id);

        if (error) throw error;
        showAlert('Cliente atualizado com sucesso!');
      } else {
        const { error } = await supabase
          .from('clientes')
          .insert([clientData]);

        if (error) throw error;
        showAlert('Cliente criado com sucesso!');
      }

      handleClose();
      fetchClientes();
    } catch (error) {
      showAlert('Erro ao salvar cliente: ' + error.message, 'error');
    }
  };

  if (loading && isAuthenticated) {
    return <MainCard title="Clientes">Carregando...</MainCard>;
  }

  if (!isAuthenticated) {
    // You might want to redirect to login page here instead of showing this message
    return <MainCard title="Clientes"><Alert severity="warning">Por favor, faça login para acessar os clientes.</Alert></MainCard>;
  }


  return (
    <MainCard title="Clientes">
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
          Novo Cliente
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell>{cliente.nome}</TableCell>
                <TableCell>{cliente.email}</TableCell>
                <TableCell>{cliente.telefone || 'N/A'}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpen(cliente)}
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
          {editMode ? 'Editar Cliente' : 'Novo Cliente'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome *"
                value={currentClient.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email *"
                type="email"
                value={currentClient.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Telefone"
                value={currentClient.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
              />
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