import { useEffect, useState } from 'react';
import supabase from '../../supabaseClient';
import {
  Button, Table, TableHead, TableBody, TableRow, TableCell,
  Select, MenuItem
} from '@mui/material';

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    buscarPedidos();
  }, []);

  async function buscarPedidos() {
    const { data, error } = await supabase
      .from('pedidos')
      .select(`
        id, total, status, criado_em,
        clientes ( nome, email )
      `)
      .order('criado_em', { ascending: false });

    if (!error) setPedidos(data || []);
    else console.error(error);
  }

  async function atualizarStatus(id, status) {
    const { error } = await supabase
      .from('pedidos')
      .update({ status })
      .eq('id', id);

    if (!error) buscarPedidos();
    else console.error(error);
  }

  return (
    <div>
      <h1>Pedidos</h1>
      <Table style={{ marginTop: '20px' }}>
        <TableHead>
          <TableRow>
            <TableCell>Cliente</TableCell>
            <TableCell>E-mail</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Data</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pedidos.map(p => (
            <TableRow key={p.id}>
              <TableCell>{p.clientes?.nome}</TableCell>
              <TableCell>{p.clientes?.email}</TableCell>
              <TableCell>R$ {p.total}</TableCell>
              <TableCell>
                <Select
                  value={p.status}
                  onChange={(e) => atualizarStatus(p.id, e.target.value)}
                >
                  <MenuItem value="pendente">Pendente</MenuItem>
                  <MenuItem value="pago">Pago</MenuItem>
                  <MenuItem value="enviado">Enviado</MenuItem>
                  <MenuItem value="concluido">Concluído</MenuItem>
                </Select>
              </TableCell>
              <TableCell>{new Date(p.criado_em).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
