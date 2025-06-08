
const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white p-8 rounded-lg shadow-md w-full max-w-md ${className}`}>
      {children}
    </div>
  );
};

export default Card;