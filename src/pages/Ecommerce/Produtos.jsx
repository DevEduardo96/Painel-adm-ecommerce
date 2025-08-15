
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
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
  Typography,
  Alert,
  Grid
} from '@mui/material';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import MainCard from 'components/cards/MainCard';
import supabase from 'supabaseClient';

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    nome: '',
    preco: '',
    estoque: '',
    descricao: '',
    imagem: ''
  });
  const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProdutos(data || []);
    } catch (error) {
      showAlert('Erro ao carregar produtos: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, severity = 'success') => {
    setAlert({ show: true, message, severity });
    setTimeout(() => setAlert({ show: false, message: '', severity: 'success' }), 3000);
  };

  const handleOpen = (produto = null) => {
    if (produto) {
      setCurrentProduct(produto);
      setEditMode(true);
    } else {
      setCurrentProduct({
        nome: '',
        preco: '',
        estoque: '',
        descricao: '',
        imagem: ''
      });
      setEditMode(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentProduct({
      nome: '',
      preco: '',
      estoque: '',
      descricao: '',
      imagem: ''
    });
  };

  const handleInputChange = (field, value) => {
    setCurrentProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!currentProduct.nome || !currentProduct.preco || !currentProduct.estoque) {
        showAlert('Preencha todos os campos obrigatórios', 'error');
        return;
      }

      const productData = {
        nome: currentProduct.nome,
        preco: parseFloat(currentProduct.preco),
        estoque: parseInt(currentProduct.estoque),
        descricao: currentProduct.descricao,
        imagem: currentProduct.imagem
      };

      if (editMode) {
        const { error } = await supabase
          .from('produtos')
          .update(productData)
          .eq('id', currentProduct.id);

        if (error) throw error;
        showAlert('Produto atualizado com sucesso!');
      } else {
        const { error } = await supabase
          .from('produtos')
          .insert([productData]);

        if (error) throw error;
        showAlert('Produto criado com sucesso!');
      }

      handleClose();
      fetchProdutos();
    } catch (error) {
      showAlert('Erro ao salvar produto: ' + error.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        const { error } = await supabase
          .from('produtos')
          .delete()
          .eq('id', id);

        if (error) throw error;
        showAlert('Produto excluído com sucesso!');
        fetchProdutos();
      } catch (error) {
        showAlert('Erro ao excluir produto: ' + error.message, 'error');
      }
    }
  };

  return (
    <MainCard title="Produtos">
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
          Novo Produto
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Preço</TableCell>
              <TableCell>Estoque</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {produtos.map((produto) => (
              <TableRow key={produto.id}>
                <TableCell>{produto.nome}</TableCell>
                <TableCell>R$ {produto.preco.toFixed(2)}</TableCell>
                <TableCell>{produto.estoque}</TableCell>
                <TableCell>{produto.descricao || 'N/A'}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpen(produto)}
                  >
                    <IconEdit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(produto.id)}
                  >
                    <IconTrash />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editMode ? 'Editar Produto' : 'Novo Produto'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nome *"
                value={currentProduct.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Preço *"
                type="number"
                value={currentProduct.preco}
                onChange={(e) => handleInputChange('preco', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Estoque *"
                type="number"
                value={currentProduct.estoque}
                onChange={(e) => handleInputChange('estoque', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="URL da Imagem"
                value={currentProduct.imagem}
                onChange={(e) => handleInputChange('imagem', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                multiline
                rows={3}
                value={currentProduct.descricao}
                onChange={(e) => handleInputChange('descricao', e.target.value)}
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
