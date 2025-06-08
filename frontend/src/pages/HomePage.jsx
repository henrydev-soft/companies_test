
import HomePageTemplate from '../templates/HomePageTemplate/HomePageTemplate';
import { useAuth } from '../context/AuthContext'; // Para acceder a la información del usuario logueado
import Button from '../components/atoms/Button/Button'; // Importa el átomo Button

const HomePage = () => {
  const { user, logout } = useAuth(); // Obtén el usuario y la función de logout del contexto

  return (
    <HomePageTemplate>
      <div className="text-center py-10">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          Bienvenido a <span className="text-blue-600">Lite Thinking</span>
        </h1>
        {user && (
          <p className="mt-4 text-xl text-gray-600">
            Hola, {user.email}! Estás logueado.
          </p>
        )}
        <p className="mt-6 text-lg text-gray-500">
          Esta es la página de inicio de tu aplicación.
        </p>
        
        {user && (
          <div className="mt-8 flex justify-center">
            <Button onClick={logout} variant="secondary">
              Cerrar Sesión
            </Button>
          </div>
        )}
      </div>

      
    </HomePageTemplate>
  );
};

export default HomePage;