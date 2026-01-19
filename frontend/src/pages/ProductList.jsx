import React, { useEffect, useState } from 'react';
import { productsAPI, ordersAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const { user } = useAuth();

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
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      setMessage({ text: 'Erro ao carregar catálogo.', type: 'error' });
    } finally { setLoading(false); }
  };

  const addToCart = (product) => {
    if (product.stockQuantity <= 0) return;
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleFinalizeSale = async () => {
    try {
      const orderData = {
        totalPrice: cartTotal,
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          unitPrice: item.price
        }))
      };
      await ordersAPI.create(orderData);
      setCart([]);
      setMessage({ text: 'Venda finalizada com sucesso!', type: 'success' });
      loadProducts();
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: 'Erro ao processar venda.', type: 'error' });
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toString() === searchTerm
  );

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '100px', color: colors.purple, fontFamily: 'serif', fontSize: '1.5rem' }}>
      Iniciando catálogo...
    </div>
  );

  return (
    <div style={{ 
      width: '100%', 
      boxSizing: 'border-box',
      display: 'flex', 
      flexDirection: 'column', 
      gap: '25px',
      fontFamily: "'Quicksand', sans-serif",
      padding: '10px'
    }}>
      
      <div style={{ width: '100%' }}>
        <input 
          type="text"
          placeholder="🔍 Buscar por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '18px 25px', 
            borderRadius: '16px', 
            border: `2px solid ${colors.mint}`, 
            fontSize: '1.1rem',
            boxSizing: 'border-box',
            outline: 'none',
            backgroundColor: colors.white,
            color: colors.slate,
            transition: 'all 0.3s ease',
            boxShadow: `0 8px 20px rgba(152, 233, 208, 0.2)`
          }}
          onFocus={(e) => {
            e.target.style.borderColor = colors.blue;
            e.target.style.boxShadow = `0 8px 25px rgba(114, 165, 174, 0.3)`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = colors.mint;
            e.target.style.boxShadow = `0 8px 20px rgba(152, 233, 208, 0.2)`;
          }}
        />
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 420px', 
        gap: '30px', 
        alignItems: 'start',
        width: '100%'
      }}>
        
        <section style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {filteredProducts.map(product => (
            <div 
              key={product.id}
              onClick={() => addToCart(product)}
              style={{
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '22px', 
                backgroundColor: colors.white, 
                borderRadius: '18px',
                cursor: product.stockQuantity > 0 ? 'pointer' : 'not-allowed',
                border: `1px solid ${colors.lightMint}`, 
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: product.stockQuantity > 0 ? 1 : 0.6,
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
              }}
              onMouseEnter={(e) => {
                if(product.stockQuantity > 0) {
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.01)';
                  e.currentTarget.style.borderColor = colors.blue;
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.07)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.borderColor = colors.lightMint;
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
              }}
            >
              <div>
                <strong style={{ color: colors.purple, fontSize: '1.25rem', fontFamily: 'serif' }}>{product.name}</strong>
                <div style={{ fontSize: '0.9rem', color: colors.slate, marginTop: '6px', fontWeight: '500' }}>
                  ID: {product.id} • <span style={{ 
                    color: product.stockQuantity < 10 ? '#d31900' : colors.blue,
                    fontWeight: 'bold'
                  }}>Disponível: {product.stockQuantity}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: colors.purple }}>
                  R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                {product.stockQuantity <= 0 && (
                  <span style={{ 
                    backgroundColor: colors.slate, 
                    color: colors.white, 
                    fontSize: '0.75rem', 
                    padding: '4px 10px', 
                    borderRadius: '6px',
                    fontWeight: '700'
                  }}>INDISPONÍVEL</span>
                )}
              </div>
            </div>
          ))}
        </section>

        <aside style={{ 
          backgroundColor: colors.white, 
          padding: '35px', 
          borderRadius: '24px', 
          boxShadow: `0 20px 50px rgba(114, 165, 174, 0.2)`, 
          position: 'sticky', 
          top: '20px',
          border: `1px solid ${colors.mint}`
        }}>
          <h3 style={{ 
            color: colors.purple, 
            borderBottom: `2px solid ${colors.lightMint}`, 
            paddingBottom: '20px', 
            marginTop: 0, 
            fontFamily: 'serif',
            fontSize: '1.6rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span>🛒</span> Venda Atual
          </h3>
          
          <div style={{ minHeight: '200px', maxHeight: '50vh', overflowY: 'auto', margin: '20px 0', paddingRight: '10px' }}>
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', color: colors.slate, marginTop: '60px' }}>
                <div style={{ fontSize: '3.5rem', opacity: 0.3 }}>🛍️</div>
                <p style={{ fontWeight: '500', fontSize: '1.1rem' }}>Carrinho vazio</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '16px 0', borderBottom: `1px solid ${colors.lightMint}`
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '1rem', color: colors.purple, fontWeight: '700' }}>
                       {item.name}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: colors.slate }}>
                      {item.quantity} un x R$ {item.price.toFixed(2)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ fontWeight: '800', color: colors.purple, fontSize: '1.1rem' }}>R$ {(item.price * item.quantity).toFixed(2)}</span>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      style={{ 
                        background: colors.lightMint, 
                        border: 'none', 
                        color: colors.purple, 
                        cursor: 'pointer', 
                        borderRadius: '10px', 
                        width: '32px', height: '32px', 
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => { e.target.style.background = "#ffcccc"; e.target.style.color = "#d31900"; }}
                      onMouseLeave={(e) => { e.target.style.background = colors.lightMint; e.target.style.color = colors.purple; }}
                    >
                      &times;
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{ borderTop: `3px solid ${colors.purple}`, paddingTop: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '2rem', fontWeight: '900', color: colors.purple, marginBottom: '25px' }}>
              <span style={{ fontSize: '1rem', alignSelf: 'center', color: colors.slate, textTransform: 'uppercase', letterSpacing: '1px' }}>Total Geral</span>
              <span>R$ {cartTotal.toFixed(2)}</span>
            </div>
            
            <button 
              onClick={handleFinalizeSale}
              disabled={cart.length === 0}
              style={{
                width: '100%', 
                padding: '22px', 
                borderRadius: '16px', 
                border: 'none',
                backgroundColor: cart.length > 0 ? colors.purple : colors.slate,
                color: colors.white, 
                fontSize: '1.2rem', 
                fontWeight: '800',
                cursor: cart.length > 0 ? 'pointer' : 'not-allowed',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                boxShadow: cart.length > 0 ? `0 10px 25px rgba(142, 63, 101, 0.4)` : 'none'
              }}
              onMouseEnter={(e) => { if(cart.length > 0) e.target.style.transform = 'scale(1.02)'; }}
              onMouseLeave={(e) => { if(cart.length > 0) e.target.style.transform = 'scale(1)'; }}
            >
              FINALIZAR VENDA
            </button>
          </div>

          {message.text && (
            <div style={{ 
              marginTop: '20px', 
              padding: '15px', 
              borderRadius: '12px', 
              textAlign: 'center', 
              fontWeight: '700',
              animation: 'fadeIn 0.5s ease',
              backgroundColor: message.type === 'success' ? colors.lightMint : '#f8d7da',
              color: message.type === 'success' ? '#155724' : '#721c24',
              border: `1px solid ${message.type === 'success' ? colors.mint : '#f5c6cb'}`
            }}>{message.text}</div>
          )}
        </aside>

      </div>
    </div>
  );
};