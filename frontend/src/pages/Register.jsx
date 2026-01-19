import React, { useState } from 'react';
import { authAPI } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export const Register = () => {
  const [form, setForm] = useState({ 
    username: '', 
    email: '', 
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (form.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {      
      const response = await authAPI.register(form);
      
      if (response.status === 200 || response.status === 201) {
        setSuccess('Conta criada com sucesso! Redirecionando...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {      
      const errorMessage = 
        error.response?.data?.Message || 
        error.response?.data?.message ||
        'Erro ao criar conta. Tente novamente.';
      setError(errorMessage);
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
          maxWidth: "420px",
          display: "flex",
          flexDirection: "column",
          gap: "1.2rem",
          border: "1px solid #98e9d0",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
          <h2
            style={{
              margin: 0,
              color: "#8e3f65",
              fontFamily: "serif",
              fontSize: "2.2rem",
              fontWeight: "bold",
            }}
          >
            Registro Usuário
          </h2>
          <p style={{ color: "#73738d", marginTop: "0.5rem", fontSize: "0.95rem" }}>
            Registre um novo colaborador
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
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
              backgroundColor: "#fff",
              color: "#73738d",
              outline: "none",
              transition: "all 0.3s ease",
            }}
            onFocus={(e) => e.target.style.borderColor = "#72a5ae"}
            onBlur={(e) => e.target.style.borderColor = "#98e9d0"}
          />
          
          <input
            name="email"
            type="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
            required
            style={{
              padding: "0.9rem",
              borderRadius: "12px",
              border: "2px solid #98e9d0",
              fontSize: "1rem",
              backgroundColor: "#fff",
              color: "#73738d",
              outline: "none",
              transition: "all 0.3s ease",
            }}
            onFocus={(e) => e.target.style.borderColor = "#72a5ae"}
            onBlur={(e) => e.target.style.borderColor = "#98e9d0"}
          />
          
          <input
            name="password"
            type="password"
            placeholder="Senha (mínimo 6 caracteres)"
            value={form.password}
            onChange={handleChange}
            required
            style={{
              padding: "0.9rem",
              borderRadius: "12px",
              border: "2px solid #98e9d0",
              fontSize: "1rem",
              backgroundColor: "#fff",
              color: "#73738d",
              outline: "none",
              transition: "all 0.3s ease",
            }}
            onFocus={(e) => e.target.style.borderColor = "#72a5ae"}
            onBlur={(e) => e.target.style.borderColor = "#98e9d0"}
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
            marginTop: "0.5rem",
            boxShadow: "0 4px 12px rgba(142, 63, 101, 0.2)",
          }}
          onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = "#733352")}
          onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = "#8e3f65")}
        >
          {loading ? 'Criando conta...' : 'Registrar'}
        </button>

        {error && (
          <div style={{
            color: "#8e3f65",
            fontWeight: "600",
            textAlign: "center",
            padding: "0.8rem",
            backgroundColor: "rgba(142, 63, 101, 0.1)",
            borderRadius: "10px",
            fontSize: "0.9rem",
            border: "1px solid #8e3f65"
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            color: "#2e7d32",
            fontWeight: "600",
            textAlign: "center",
            padding: "0.8rem",
            backgroundColor: "#d8ffcc",
            borderRadius: "10px",
            fontSize: "0.9rem",
            border: "1px solid #7cb490"
          }}>
            {success}
          </div>
        )}

        <div style={{
          marginTop: "1rem",
          textAlign: "center",
          color: "#73738d",
          paddingTop: "1.5rem",
          borderTop: "2px dashed #98e9d0"
        }}>
          <p style={{ margin: 0, marginBottom: "0.5rem" }}>Já tem uma conta?</p>
          <Link
            to="/login"
            style={{
              color: "#72a5ae",
              fontWeight: "700",
              textDecoration: "none",
              fontSize: "1rem",
              transition: "color 0.3s",
            }}
            onMouseEnter={(e) => e.target.style.color = "#8e3f65"}
            onMouseLeave={(e) => e.target.style.color = "#72a5ae"}
          >
            Faça login aqui
          </Link>
        </div>
      </form>
    </div>
  );
};