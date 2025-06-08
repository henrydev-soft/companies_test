
import './Button.css'

const Button = ({ children, onClick, variant = 'primary', type = 'button', className = '', ...props }) => {
  const baseStyles = "px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-opacity-75";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    outline: "border border-blue-500 text-blue-500 hover:bg-blue-50 focus:ring-blue-500"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;