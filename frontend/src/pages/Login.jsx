import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(form);
      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (error) {
      setError('Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Quicksand', sans-serif",
        padding: "1rem",
        backgroundColor: "#d8ffcc", 
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#ffffff",
          padding: "2.5rem",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(142, 63, 101, 0.1)",
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "1.2rem",
          border: "1px solid #98e9d0",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <h2
            style={{
              margin: 0,
              color: "#8e3f65",
              fontFamily: "serif",
              fontSize: "2.2rem",
              fontWeight: "bold",
            }}
          >
            Vespertine
          </h2>
          <p style={{ color: "#73738d", marginTop: "0.5rem", fontSize: "0.95rem" }}>
            Sistema de Gerenciamento de Vendas
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          <label style={{ color: "#8e3f65", fontWeight: "600", fontSize: "0.9rem", marginLeft: "4px" }}>Usuário</label>
          <input
            name="username"
            type="text"
            placeholder="Nome de usuário"
            value={form.username}
            onChange={handleChange}
            required
            style={{
              padding: "0.9rem",
              borderRadius: "12px",
              border: "2px solid #98e9d0",
              fontSize: "1rem",
              outline: "none",
              backgroundColor: "#fff",
              color: "#73738d",
              transition: "all 0.3s ease",
            }}
            onFocus={(e) => {
                e.target.style.borderColor = "#72a5ae";
                e.target.style.boxShadow = "0 0 0 4px rgba(114, 165, 174, 0.1)";
            }}
            onBlur={(e) => {
                e.target.style.borderColor = "#98e9d0";
                e.target.style.boxShadow = "none";
            }}
          />

          <label style={{ color: "#8e3f65", fontWeight: "600", fontSize: "0.9rem", marginLeft: "4px", marginTop: "0.5rem" }}>Senha</label>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
            style={{
              padding: "0.9rem",
              borderRadius: "12px",
              border: "2px solid #98e9d0",
              fontSize: "1rem",
              outline: "none",
              backgroundColor: "#fff",
              color: "#73738d",
              transition: "all 0.3s ease",
            }}
            onFocus={(e) => {
                e.target.style.borderColor = "#72a5ae";
                e.target.style.boxShadow = "0 0 0 4px rgba(114, 165, 174, 0.1)";
            }}
            onBlur={(e) => {
                e.target.style.borderColor = "#98e9d0";
                e.target.style.boxShadow = "none";
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: "#8e3f65",
            color: "#ffffff",
            border: "none",
            padding: "1rem",
            borderRadius: "12px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "1.1rem",
            fontWeight: "700",
            transition: "all 0.3s ease",
            marginTop: "1rem",
            boxShadow: "0 4px 12px rgba(142, 63, 101, 0.2)",
          }}
          onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = "#733352")}
          onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = "#8e3f65")}
        >
          {loading ? 'Processando...' : 'Entrar'}
        </button>

        {error && (
          <div
            style={{
              color: "#8e3f65",
              fontWeight: "600",
              textAlign: "center",
              padding: "0.8rem",
              backgroundColor: "#d8ffcc",
              borderRadius: "10px",
              fontSize: "0.9rem",
              border: "1px solid #8e3f65"
            }}
          >
            {error}
          </div>
        )}

      </form>
    </div>
  );
};