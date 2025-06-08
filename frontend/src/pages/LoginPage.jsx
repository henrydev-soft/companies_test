
import { useState } from 'react';
import AuthPageTemplate from '../templates/AuthPageTemplate/AuthPageTemplate';
import Card from '../components/organisms/Card/Card';
import LoginForm from '../components/organisms/LoginForm/LoginForm';
import { useAuth } from '../context/AuthContext'; // Asume que tienes un AuthContext
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth(); // Función de login de tu contexto de autenticación
  const navigate = useNavigate();

  const handleLogin = async ({ email, password }) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      await login(email, password);
      navigate('/'); // Redirige a la página principal tras login exitoso
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage(error.response?.data?.detail || "Error al iniciar sesión. Por favor, verifica tus credenciales.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthPageTemplate>
      <Card>
        <LoginForm onSubmit={handleLogin} isLoading={isLoading} errorMessage={errorMessage} />
        {/*<p className="mt-4 text-center text-sm text-gray-600">
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            Regístrate aquí
          </Link>
        </p>*/}
      </Card>
    </AuthPageTemplate>
  );
};

export default LoginPage;