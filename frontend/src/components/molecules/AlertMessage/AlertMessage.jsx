import './AlertMessage.css'

const AlertMessage = ({ message, type = 'info', className = '' }) => {
  let styles = "p-3 rounded-md text-sm mb-4";
  switch (type) {
    case 'success':
      styles += " bg-green-100 text-green-700 border border-green-200";
      break;
    case 'error':
      styles += " bg-red-100 text-red-700 border border-red-200";
      break;
    case 'warning':
      styles += " bg-yellow-100 text-yellow-700 border border-yellow-200";
      break;
    case 'info':
    default:
      styles += " bg-blue-100 text-blue-700 border border-blue-200";
      break;
  }
  return (
    <div className={`${styles} ${className}`} role="alert">
      {message}
    </div>
  );
};

export default AlertMessage;