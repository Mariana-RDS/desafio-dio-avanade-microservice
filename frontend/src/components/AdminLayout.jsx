import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const colors = {
    purple: "#8e3f65",
    darkPurple: "#5a2841",
    slate: "#73738d",
    blue: "#72a5ae",
    mint: "#98e9d0",
    white: "#ffffff",
    lightGrey: "#f8faf9"
  };

  const menuItems = [
    { label: '🛒 Vendas', path: '/dashboard', roles: ['User', 'Admin']},
    { label: '📦 Estoque', path: '/admin/products', roles: ['Admin']},
    { label: '📊 Relatórios', path: '/admin/reports', roles: ['Admin']},
    { label: '👥 Usuários', path: '/admin/users', roles: ['Admin']}
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: colors.lightGrey, fontFamily: "'Quicksand', sans-serif" }}>
      
      <aside style={{ 
        width: '280px', 
        backgroundColor: colors.darkPurple, 
        color: colors.white, 
        padding: '2rem 1.2rem',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '4px 0 15px rgba(0,0,0,0.1)',
        zIndex: 100
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ 
            fontFamily: 'serif', 
            fontSize: '1.5rem', 
            margin: 0, 
            letterSpacing: '1px',
            color: colors.mint 
          }}>
            VESPERTINE
          </h2>
          <div style={{ width: '40px', height: '3px', backgroundColor: colors.blue, margin: '10px auto', borderRadius: '2px' }}></div>
        </div>
        
        <nav style={{ flex: 1 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (item.roles.includes(user?.role)) && (
              <button 
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  backgroundColor: isActive ? 'rgba(152, 233, 208, 0.15)' : 'transparent',
                  color: isActive ? colors.mint : colors.white,
                  border: 'none',
                  borderLeft: isActive ? `4px solid ${colors.mint}` : '4px solid transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderRadius: '0 12px 12px 0',
                  fontSize: '0.95rem',
                  fontWeight: isActive ? '700' : '500',
                  transition: 'all 0.3s ease',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
                onMouseEnter={(e) => {
                  if(!isActive) e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
                }}
                onMouseLeave={(e) => {
                  if(!isActive) e.target.style.backgroundColor = 'transparent';
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        <div style={{ 
          marginTop: 'auto', 
          padding: '1.5rem', 
          backgroundColor: 'rgba(0,0,0,0.2)', 
          borderRadius: '16px',
          border: `1px solid rgba(152, 233, 208, 0.1)`
        }}>
          <p style={{ 
            fontSize: '0.8rem', 
            margin: '0 0 12px 0', 
            color: colors.blue,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontWeight: 'bold'
          }}>
            Operador
          </p>
          <div style={{ marginBottom: '15px' }}>
            <div style={{ fontWeight: '700', fontSize: '1rem' }}>{user?.username}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>{user?.role}</div>
          </div>
          <button 
            onClick={logout} 
            style={{ 
              width: '100%', 
              padding: '10px', 
              borderRadius: '8px', 
              cursor: 'pointer',
              border: 'none',
              backgroundColor: colors.purple,
              color: colors.white,
              fontWeight: 'bold',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.filter = 'brightness(1.2)'}
            onMouseLeave={(e) => e.target.style.filter = 'brightness(1)'}
          >
            Sair
          </button>
        </div>
      </aside>

      <main style={{ 
        flex: 1, 
        padding: '2.5rem', 
        overflowY: 'auto', 
        height: '100vh',
        boxSizing: 'border-box' 
      }}>
        {children}
      </main>
    </div>
  );
};