import { useEffect, useState } from 'react';
import supabase from '../../supabaseClient';
import { Button, Table, TableHead, TableBody, TableRow, TableCell, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nome: '', preco: '', estoque: '' });

  useEffect(() => {
    buscarProdutos();
  }, []);

  async function buscarProdutos() {
    const { data } = await supabase.from('produtos').select('*').order('criado_em', { ascending: false });
    setProdutos(data || []);
  }

  async function salvarProduto() {
    await supabase.from('produtos').insert([form]);
    setForm({ nome: '', preco: '', estoque: '' });
    setOpen(false);
    buscarProdutos();
  }

  return (
    <div>
      <h1>Produtos</h1>
      <Button variant="contained" onClick={() => setOpen(true)}>Adicionar Produto</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Preço</TableCell>
            <TableCell>Estoque</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {produtos.map(p => (
            <TableRow key={p.id}>
              <TableCell>{p.nome}</TableCell>
              <TableCell>R$ {p.preco}</TableCell>
              <TableCell>{p.estoque}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Novo Produto</DialogTitle>
        <DialogContent>
          <TextField label="Nome" fullWidth margin="dense" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
          <TextField label="Preço" type="number" fullWidth margin="dense" value={form.preco} onChange={e => setForm({ ...form, preco: e.target.value })} />
          <TextField label="Estoque" type="number" fullWidth margin="dense" value={form.estoque} onChange={e => setForm({ ...form, estoque: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={salvarProduto}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
