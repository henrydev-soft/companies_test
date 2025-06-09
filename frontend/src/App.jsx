
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import InventoryView from './pages/InventoryView';
import CompaniesPage from './pages/CompaniesPage';
import MyCompaniesPage from './pages/MyCompaniesPage';
import MyProductsPage from './pages/MyProductsPage';

import './App.css'

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div>Cargando...</div>; // O un spinner
  }
  return user ? children : <Navigate to="/login" />;
};


function App() {

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/inventory/:companyNit" element={<InventoryView />} />          

          {/* Rutas protegidas */}          
          <Route path="/my-companies" element={<PrivateRoute><MyCompaniesPage /></PrivateRoute>} />
          <Route path="/my-products" element={<PrivateRoute><MyProductsPage /></PrivateRoute>} />

          {/* Puedes añadir una ruta de 404 si lo deseas */}
          {<Route path="*" element={<div>404 - Página no encontrada</div>} />}
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App
