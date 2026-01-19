import React, { useEffect, useState } from 'react';
import { ordersAPI } from '../services/api';

export const AdminReports = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const colors = {
    purple: "#8e3f65",
    slate: "#73738d",
    blue: "#72a5ae",
    mint: "#98e9d0",
    lightMint: "#d8ffcc"
  };

  useEffect(() => { loadSales(); }, []);

  const loadSales = async () => {
    try {
      const response = await ordersAPI.getAll();
      setSales(response.data);
    } catch (error) {
      console.error("Erro ao carregar vendas");
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = sales.reduce((acc, sale) => acc + (sale.totalOrder || 0), 0);

  if (loading) return (
    <div style={{ padding: '100px', textAlign: 'center', color: colors.purple, fontFamily: 'serif' }}>
      <h2>Buscando registros...</h2>
    </div>
  );

  return (
    <div style={{ width: '100%', color: colors.slate, fontFamily: "'Quicksand', sans-serif" }}>
      <h2 style={{ 
        fontFamily: 'serif', 
        fontSize: '2.5rem', 
        marginBottom: '1.5rem', 
        color: colors.purple,
        borderBottom: `3px solid ${colors.mint}`,
        display: 'inline-block',
        paddingBottom: '5px'
      }}>
        Relatório de Vendas
      </h2>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '35px' }}>
        <div style={{ 
          background: `linear-gradient(135deg, ${colors.purple} 0%, #733352 100%)`, 
          color: '#fff', 
          padding: '20px 35px', 
          borderRadius: '20px', 
          textAlign: 'right', 
          boxShadow: `0 10px 20px rgba(142, 63, 101, 0.2)`,
          borderBottom: `5px solid ${colors.blue}`
        }}>
          <span style={{ fontSize: '1rem', opacity: 0.85, fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Faturamento Total
          </span>
          <div style={{ fontSize: '2.4rem', fontWeight: '600', marginTop: '5px' }}>
            R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <div style={{ 
        backgroundColor: '#fff', 
        borderRadius: '20px', 
        overflow: 'hidden', 
        boxShadow: `0 15px 40px rgba(115, 115, 141, 0.1)`,
        border: `1px solid ${colors.mint}`
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: colors.lightMint, color: colors.purple }}>
              <th style={{ padding: '22px', fontFamily: 'serif', fontSize: '1.1rem' }}>Data e Hora</th>
              <th style={{ padding: '22px', fontFamily: 'serif', fontSize: '1.1rem' }}>Detalhes da Venda</th>
              <th style={{ padding: '22px', textAlign: 'right', fontFamily: 'serif', fontSize: '1.1rem' }}>Total da Venda</th>
            </tr>
          </thead>
          <tbody>
            {sales.length > 0 ? sales.map((sale, index) => (
              <tr 
                key={sale.id} 
                style={{ 
                  borderBottom: `1px solid ${colors.lightMint}`, 
                  backgroundColor: index % 2 === 0 ? '#fff' : '#fcfdfb',
                  transition: '0.3s' 
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.lightMint}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#fff' : '#fcfdfb'}
              >
                <td style={{ padding: '20px', color: colors.slate, fontWeight: '600' }}>
                  {sale.orderDate ? new Date(sale.orderDate).toLocaleString('pt-BR') : '---'}
                </td>
                <td style={{ padding: '20px' }}>
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '6px',
                    borderLeft: `3px solid ${colors.blue}`,
                    paddingLeft: '15px'
                  }}>
                    {sale.items?.map((item, idx) => (
                      <div key={idx} style={{ fontSize: '0.95rem', color: colors.slate }}>
                        <strong style={{ color: colors.purple }}>{item.quantity}x</strong> {item.productName || `Produto #${item.productId}`} 
                        <span style={{ color: colors.blue, fontSize: '0.85rem', marginLeft: '10px' }}>
                          (un: R$ {item.unitPrice.toFixed(2)})
                        </span>
                      </div>
                    ))}
                  </div>
                </td>
                <td style={{ 
                  fontWeight: '900', 
                  fontSize: '1.2rem', 
                  textAlign: 'right', 
                  paddingRight: '25px',
                  color: colors.purple 
                }}>
                  R$ {(sale.totalOrder || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="3" style={{ padding: '60px', textAlign: 'center', color: colors.slate }}>
                  Nenhuma venda registrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};