
import { Link } from 'react-router-dom';

const BrandLogo = ({ className = '', ...props }) => {
  return (
    <Link to="/" className={`text-white text-xl font-bold ${className}`} {...props}>
      LiteThinking
    </Link>
  );
};

export default BrandLogo;