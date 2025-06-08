
import { Link } from 'react-router-dom';

const NavLink = ({ to, children, className = '', ...props }) => {
  return (
    <Link
      to={to}
      className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
};

export default NavLink;