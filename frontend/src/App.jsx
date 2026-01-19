import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './components/AdminLayout';

import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ProductList } from './pages/ProductList';
import { AdminProducts } from './pages/AdminProducts';
import { AdminReports } from './pages/AdminReports';
import { UserManagement } from './components/UserManagement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <AdminLayout>
                <ProductList />
              </AdminLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/products" element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout>
                <AdminProducts />
              </AdminLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/reports" element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout>
                <AdminReports />
              </AdminLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/users" element={
              <ProtectedRoute adminOnly={true}>
                <AdminLayout>
                  <UserManagement />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;