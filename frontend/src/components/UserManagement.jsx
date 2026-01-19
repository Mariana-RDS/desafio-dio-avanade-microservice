import React, { useState, useEffect } from 'react';
import { authAPI } from '../services/api';

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'User' });
  const [loading, setLoading] = useState(false);

  const colors = {
    purple: "#8e3f65",
    slate: "#73738d",
    blue: "#72a5ae",
    mint: "#98e9d0",
    lightMint: "#d8ffcc",
    white: "#ffffff"
  };

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      const res = await authAPI.getAllUsers();
      setUsers(res.data);
    } catch (err) {
      console.error("Erro ao carregar usuários", err);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.register(newUser);
      alert("Funcionário cadastrado com sucesso!");
      setNewUser({ username: '', email: '', password: '', role: 'User' });
      loadUsers();
    } catch (err) {
      alert("Erro ao criar usuário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Quicksand', sans-serif" }}>
      <h2 style={{ color: colors.purple, fontFamily: 'serif', fontSize: '2rem', marginBottom: '1.5rem' }}>
        Controle de Acessos
      </h2>

      <div style={{
        backgroundColor: colors.white,
        padding: '2rem',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        marginBottom: '2rem',
        border: `1px solid ${colors.mint}`
      }}>
        <h3 style={{ marginTop: 0, color: colors.purple, fontSize: '1.1rem', marginBottom: '1.2rem' }}>
          Registrar Novo Funcionário
        </h3>
        <form onSubmit={handleCreateUser} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <input
            placeholder="Nome de Usuário"
            value={newUser.username}
            onChange={e => setNewUser({ ...newUser, username: e.target.value })}
            required
            style={{ padding: '12px', borderRadius: '10px', border: `1px solid ${colors.lightMint}`, flex: 1 }}
          />
          <input
            type="email"
            placeholder="E-mail"
            value={newUser.email}
            onChange={e => setNewUser({ ...newUser, email: e.target.value })}
            required
            style={{ padding: '12px', borderRadius: '10px', border: `1px solid ${colors.lightMint}`, flex: 1 }}
          />
          <input
            type="password"
            placeholder="Senha"
            value={newUser.password}
            onChange={e => setNewUser({ ...newUser, password: e.target.value })}
            required
            style={{ padding: '12px', borderRadius: '10px', border: `1px solid ${colors.lightMint}`, flex: 1 }}
          />
          <select
            value={newUser.role}
            onChange={e => setNewUser({ ...newUser, role: e.target.value })}
            style={{ padding: '12px', borderRadius: '10px', border: `1px solid ${colors.lightMint}`, backgroundColor: colors.white }}
          >
            <option value="User">Nível: Usuário (Vendas)</option>
            <option value="Admin">Nível: Administrador (Total)</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: colors.blue, color: '#fff', border: 'none',
              padding: '12px 25px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer'
            }}
          >
            {loading ? "Gravando..." : "CRIAR CONTA"}
          </button>
        </form>
      </div>

      <div style={{ 
        backgroundColor: colors.white, 
        borderRadius: '20px', 
        overflow: 'hidden', 
        border: `1px solid ${colors.lightMint}`,
        boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: colors.lightMint, color: colors.purple }}>
              <th style={{ padding: '18px 15px', textAlign: 'left' }}>Usuário</th>
              <th style={{ padding: '18px 15px', textAlign: 'left' }}>Cargo</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: `1px solid ${colors.lightMint}`, transition: 'background 0.2s' }}>
                <td style={{ padding: '15px', fontWeight: 'bold' }}>{u.username}</td>
                <td style={{ padding: '15px' }}>
                  <span style={{
                    padding: '6px 12px', 
                    borderRadius: '8px', 
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    backgroundColor: u.role === 'Admin' ? colors.purple : colors.blue,
                    color: '#fff'
                  }}>
                    {u.role}
                  </span>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="2" style={{ padding: '20px', textAlign: 'center', color: colors.slate }}>
                  Nenhum usuário encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};