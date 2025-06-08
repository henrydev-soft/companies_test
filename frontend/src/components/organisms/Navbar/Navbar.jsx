
import { useAuth } from '../../../context/AuthContext'; // Ajusta la ruta si es necesario
import NavLink from '../../atoms/NavLink/NavLink';
import BrandLogo from '../../atoms/BrandLogo/BrandLogo';
import NavGroup from '../../molecules/NavGroup/NavGroup';
import Button from '../../atoms/Button/Button'; // Para el botón de Logout

const Navbar = () => {
  const { user, logout } = useAuth(); // Obtiene el estado del usuario y la función de logout

  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo de la marca */}
        <BrandLogo />

        {/* Grupo de navegación principal */}
        <NavGroup>
          <NavLink to="/">Inicio</NavLink>
          <NavLink to="/companies">Empresas</NavLink> {/* Visible para todos */}

          {/* Enlaces solo si está logueado */}
          {user && (
            <>
              <NavLink to="/my-companies">Mis Empresas</NavLink>
              <NavLink to="/my-products">Mis Productos</NavLink>
              {/* Puedes añadir más enlaces privados aquí */}
            </>
          )}
        </NavGroup>

        {/* Botón de Login/Logout */}
        <div>
          {user ? (
            <Button onClick={logout} variant="outline" className="text-white border-white hover:bg-gray-700">
              Cerrar Sesión
            </Button>
          ) : (
            <NavLink to="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
              Iniciar Sesión
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;