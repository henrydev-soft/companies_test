
const IconButton = ({ onClick, children, className = '', ...props }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-1 rounded-full text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default IconButton;