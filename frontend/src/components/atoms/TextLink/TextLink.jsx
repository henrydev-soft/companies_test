
import { Link } from 'react-router-dom';

const TextLink = ({ to, children, className = '', ...props }) => {
  return (
    <Link to={to} className={`text-blue-600 hover:underline ${className}`} {...props}>
      {children}
    </Link>
  );
};

export default TextLink;