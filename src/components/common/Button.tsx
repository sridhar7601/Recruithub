import React, { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'icon' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
  children?: ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  icon,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...rest
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-blue-600 text-white border border-transparent rounded-md shadow-sm hover:bg-blue-700',
    secondary: 'bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50',
    outline: 'bg-transparent text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50',
    icon: 'text-gray-600 hover:text-gray-800 border-0',
    link: 'bg-transparent text-blue-600 hover:text-blue-800 border-0 shadow-none underline',
  };
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Combine all classes
  const buttonClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClasses} ${className}`;
  
  // Icon-only button doesn't need padding
  const iconOnlyClasses = variant === 'icon' ? 'p-1' : '';
  
  return (
    <button
      className={`${buttonClasses} ${iconOnlyClasses}`}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {icon && !isLoading && <span className={children ? 'mr-2' : ''}>{icon}</span>}
      {isLoading && loadingText ? loadingText : children}
    </button>
  );
};

export default Button;
