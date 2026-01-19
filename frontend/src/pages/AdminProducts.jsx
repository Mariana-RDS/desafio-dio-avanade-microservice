import React, { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stockQuantity: '' });
  const [stockAdjustment, setStockAdjustment] = useState({});

  const colors = {
    purple: "#8e3f65",
    slate: "#73738d",
    blue: "#72a5ae",
    mint: "#98e9d0",
    lightMint: "#d8ffcc",
    white: "#ffffff"
  };

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    const res = await productsAPI.getAll();
    setProducts(res.data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await productsAPI.create({
        ...newProduct,
        price: parseFloat(newProduct.price),
        stockQuantity: parseInt(newProduct.stockQuantity)
      });
      setNewProduct({ name: '', price: '', stockQuantity: '' });
      loadProducts();
      alert("Produto cadastrado com sucesso!");
    } catch (err) { alert("Erro ao cadastrar"); }
  };

  const handleUpdateStock = async (productId) => {
    const quantity = parseInt(stockAdjustment[productId]);
    if (!quantity || quantity <= 0) return alert("Digite um valor válido.");

    try {
      await productsAPI.updateStock(productId, quantity);
      setStockAdjustment({ ...stockAdjustment, [productId]: '' });
      loadProducts();
      alert("Estoque atualizado!");
    } catch (err) {
      alert("Erro ao atualizar estoque.");
    }
  };

  return (
    <div style={{ fontFamily: "'Quicksand', sans-serif", color: colors.slate }}>
      <h2 style={{ 
        color: colors.purple, 
        fontFamily: 'serif', 
        fontSize: '2.2rem', 
        marginBottom: '1.5rem',
        borderLeft: `6px solid ${colors.mint}`,
        paddingLeft: '15px'
      }}>
        Gestão de Inventário
      </h2>
      
      <div style={{ 
        backgroundColor: colors.white, 
        padding: '2rem', 
        borderRadius: '20px', 
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        marginBottom: '2.5rem',
        border: `1px solid ${colors.lightMint}`
      }}>
        <h3 style={{ marginTop: 0, color: colors.purple, fontSize: '1.1rem', marginBottom: '1rem' }}>
          ➕ Cadastrar Novo Item
        </h3>
        <form onSubmit={handleCreate} style={{ 
          display: 'flex', 
          gap: '15px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <input 
            placeholder="Nome do Produto" 
            value={newProduct.name} 
            onChange={e => setNewProduct({...newProduct, name: e.target.value})} 
            required 
            style={{ 
              padding: '12px 15px', borderRadius: '10px', border: `2px solid ${colors.lightMint}`, 
              flex: 2, minWidth: '200px', outline: 'none', transition: '0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = colors.blue}
            onBlur={(e) => e.target.style.borderColor = colors.lightMint}
          />
          <input 
            type="number" placeholder="Preço (R$)" 
            value={newProduct.price} 
            onChange={e => setNewProduct({...newProduct, price: e.target.value})} 
            required 
            style={{ 
              padding: '12px 15px', borderRadius: '10px', border: `2px solid ${colors.lightMint}`, 
              width: '120px', outline: 'none'
            }} 
          />
          <input 
            type="number" placeholder="Qtd Inicial" 
            value={newProduct.stockQuantity} 
            onChange={e => setNewProduct({...newProduct, stockQuantity: e.target.value})} 
            required 
            style={{ 
              padding: '12px 15px', borderRadius: '10px', border: `2px solid ${colors.lightMint}`, 
              width: '120px', outline: 'none'
            }} 
          />
          <button type="submit" style={{ 
            backgroundColor: colors.purple, 
            color: '#fff', border: 'none', 
            padding: '13px 30px', borderRadius: '10px', 
            cursor: 'pointer', fontWeight: '800',
            transition: 'all 0.3s',
            boxShadow: `0 4px 12px rgba(142, 63, 101, 0.2)`
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = "#733352"}
          onMouseLeave={(e) => e.target.style.backgroundColor = colors.purple}
          >
            ADICIONAR
          </button>
        </form>
      </div>

      <div style={{ 
        backgroundColor: colors.white, 
        borderRadius: '20px', 
        overflow: 'hidden', 
        boxShadow: '0 15px 40px rgba(0,0,0,0.04)',
        border: `1px solid ${colors.mint}`
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: colors.purple, color: colors.white }}>
              <th style={{ padding: '20px' }}>ID</th>
              <th>Nome do Produto</th>
              <th>Preço Unit.</th>
              <th style={{ textAlign: 'center' }}>Status de Estoque</th>
              <th style={{ width: '280px', textAlign: 'center' }}>Reposição</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, index) => (
              <tr key={p.id} style={{ 
                borderBottom: `1px solid ${colors.lightMint}`,
                backgroundColor: index % 2 === 0 ? colors.white : '#fcfdfb'
              }}>
                <td style={{ padding: '18px', fontSize: '0.85rem', color: colors.blue, fontWeight: 'bold' }}>#{p.id}</td>
                <td style={{ fontWeight: '700', color: colors.purple }}>{p.name}</td>
                <td style={{ fontWeight: '500' }}>R$ {p.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td style={{ textAlign: 'center' }}>
                  <span style={{ 
                    backgroundColor: p.stockQuantity < 10 ? '#fff0f0' : colors.lightMint,
                    color: p.stockQuantity < 10 ? '#d31900' : '#2e7d32',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '800',
                    border: `1px solid ${p.stockQuantity < 10 ? '#ffcccc' : colors.mint}`
                  }}>
                    {p.stockQuantity} un
                  </span>
                </td>
                <td style={{ padding: '15px' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <input 
                      type="number" 
                      placeholder="+" 
                      value={stockAdjustment[p.id] || ''} 
                      onChange={(e) => setStockAdjustment({...stockAdjustment, [p.id]: e.target.value})}
                      style={{ 
                        width: '70px', padding: '8px', borderRadius: '8px', 
                        border: `1px solid ${colors.blue}`, textAlign: 'center', outline: 'none' 
                      }}
                    />
                    <button 
                      onClick={() => handleUpdateStock(p.id)}
                      style={{ 
                        backgroundColor: colors.blue, 
                        color: '#fff', border: 'none', 
                        padding: '8px 15px', borderRadius: '8px', 
                        cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem',
                        transition: '0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = colors.purple}
                      onMouseLeave={(e) => e.target.style.backgroundColor = colors.blue}
                    >
                      ADICIONAR
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};