
const EmptyState = ({ message = 'No hay datos disponibles.', className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg text-gray-500 text-center ${className}`}>
      <svg className="w-16 h-16 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
      </svg>
      <p className="text-lg font-medium">{message}</p>
    </div>
  );
};

export default EmptyState;