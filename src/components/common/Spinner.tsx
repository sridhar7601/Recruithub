import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
  fullScreen?: boolean;
  label?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className = '',
  fullScreen = false,
  label,
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-2',
  };
  
  // Color classes
  const colorClasses = {
    primary: 'border-blue-500',
    secondary: 'border-gray-500',
    white: 'border-white',
  };
  
  // Container classes for fullScreen
  const containerClasses = fullScreen 
    ? 'fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50' 
    : '';
  
  return (
    <div className={`${containerClasses} ${fullScreen ? '' : className}`}>
      <div className="flex flex-col items-center">
        <div 
          className={`animate-spin rounded-full border-t-transparent border-b-transparent ${sizeClasses[size]} ${colorClasses[color]} ${fullScreen ? '' : className}`}
          role="status"
          aria-label={label || 'Loading'}
        />
        {label && (
          <span className="mt-2 text-sm text-gray-500">{label}</span>
        )}
      </div>
    </div>
  );
};

export default Spinner;
