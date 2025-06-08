
const NavGroup = ({ children, className = '' }) => {
  return (
    <div className={`flex space-x-4 ${className}`}>
      {children}
    </div>
  );
};

export default NavGroup;