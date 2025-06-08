import { useState } from 'react';
import FormField from '../../molecules/FormField/FormField';
import Button from '../../atoms/Button/Button';
import AlertMessage from '../../molecules/AlertMessage/AlertMessage';

const LoginForm = ({ onSubmit, isLoading, errorMessage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>
      {errorMessage && <AlertMessage message={errorMessage} type="error" />}

      <FormField
        label="Correo Electrónico"
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@ejemplo.com"
      />
      <FormField
        label="Contraseña"
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
      />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
      </Button>
    </form>
  );
};

export default LoginForm;