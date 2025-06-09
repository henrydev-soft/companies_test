// src/components/molecules/Spinner/Spinner.jsx
import React from 'react';

const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-3',
    lg: 'w-8 h-8 border-4',
  };

  return (
    <div className={`
      inline-block rounded-full animate-spin border-t-blue-500 border-solid
      ${sizeClasses[size]}
      ${className}
    `}></div>
  );
};

export default Spinner;