import { useEffect, useState } from 'react';
import supabase from '../../supabaseClient';
import {
  Button,
  Table, TableHead, TableBody, TableRow, TableCell,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nome: '', email: '', telefone: '' });

  // Carrega clientes ao abrir a página
  useEffect(() => {
    buscarClientes();
  }, []);

  async function buscarClientes() {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('criado_em', { ascending: false });

    if (!error) setClientes(data || []);
    else console.error(error);
  }

  async function salvarCliente() {
    if (!form.nome || !form.email) {
      alert('Nome e e-mail são obrigatórios.');
      return;
    }

    const { error } = await supabase.from('clientes').insert([form]);
    if (error) {
      console.error(error);
      alert('Erro ao salvar cliente');
      return;
    }

    setForm({ nome: '', email: '', telefone: '' });
    setOpen(false);
    buscarClientes();
  }

  return (
    <div>
      <h1>Clientes</h1>
      <Button variant="contained" onClick={() => setOpen(true)}>Adicionar Cliente</Button>

      <Table style={{ marginTop: '20px' }}>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>E-mail</TableCell>
            <TableCell>Telefone</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clientes.map(c => (
            <TableRow key={c.id}>
              <TableCell>{c.nome}</TableCell>
              <TableCell>{c.email}</TableCell>
              <TableCell>{c.telefone}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Novo Cliente</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome"
            fullWidth
            margin="dense"
            value={form.nome}
            onChange={e => setForm({ ...form, nome: e.target.value })}
          />
          <TextField
            label="E-mail"
            type="email"
            fullWidth
            margin="dense"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            label="Telefone"
            fullWidth
            margin="dense"
            value={form.telefone}
            onChange={e => setForm({ ...form, telefone: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={salvarCliente}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
