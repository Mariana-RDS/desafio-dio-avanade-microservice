import axios from 'axios';

const API_GATEWAY = 'http://localhost:5008';

const api = axios.create({
  baseURL: API_GATEWAY,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('Token no localStorage:', token ? 'PRESENTE' : 'AUSENTE');
  console.log('URL da requisição:', config.url);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Header Authorization adicionado');
  } else {
    console.log('Nenhum token encontrado');
  }
  
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('Resposta recebida:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.log('Erro na requisição:', {
      status: error.response?.status,
      url: error.config?.url,
      headers: error.config?.headers
    });
    
    if (error.response?.status === 401) {
      console.log('Token inválido ou expirado - redirecionando para login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  getProfile: () => api.get('/api/auth/me'),
  getAllUsers: () => api.get('/api/auth/users'),
};

export const productsAPI = {
  getAll: () => api.get('/api/products'),
  getById: (id) => api.get(`/api/products/${id}`),
  create: (product) => api.post('/api/products/create', product),
  update: (id, product) => api.put(`/api/products/${id}`, product),
  delete: (id) => api.delete(`/api/products/${id}`),
  updateStock: (id, quantity) => api.patch(`/api/products/${id}/stock`, { quantityChange: quantity }),
};

export const ordersAPI = {
  getAll: () => api.get('/api/orders'),
  getById: (id) => api.get(`/api/orders/${id}`),
  create: (order) => api.post('/api/orders/create', order),
};

export default api;