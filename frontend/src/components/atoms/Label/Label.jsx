import './Label.css'

const Label = ({ htmlFor, children, className = '', ...props }) => {
  return (
    <label htmlFor={htmlFor} className={`block text-gray-700 text-sm font-bold mb-1 ${className}`} {...props}>
      {children}
    </label>
  );
};

export default Label;