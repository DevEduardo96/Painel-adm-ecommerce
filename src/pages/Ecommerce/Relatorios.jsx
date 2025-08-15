import { useEffect, useState } from 'react';
import supabase from '../../supabaseClient';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Relatorios() {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    buscarRelatorio();
  }, []);

  async function buscarRelatorio() {
    const { data, error } = await supabase
      .from('pedidos')
      .select('total, criado_em')
      .eq('status', 'pago');

    if (error) {
      console.error(error);
      return;
    }

    // Agrupa por dia
    const agrupado = {};
    data.forEach(p => {
      const dia = new Date(p.criado_em).toLocaleDateString('pt-BR');
      agrupado[dia] = (agrupado[dia] || 0) + parseFloat(p.total);
    });

    const formatado = Object.entries(agrupado).map(([data, total]) => ({
      data,
      total
    }));

    setDados(formatado);
  }

  return (
    <div>
      <h1>Relatórios de Vendas</h1>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={dados}>
          <Line type="monotone" dataKey="total" stroke="#82ca9d" />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="data" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
