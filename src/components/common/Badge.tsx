import React, { ReactNode } from 'react';

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default';
export type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: 'full' | 'md' | 'none';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  rounded = 'md',
  className = '',
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center font-medium';
  
  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-blue-100 text-blue-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-indigo-100 text-indigo-700',
    default: 'bg-gray-100 text-gray-700',
  };
  
  // Rounded classes
  const roundedClasses = {
    full: 'rounded-full',
    md: 'rounded',
    none: '',
  };
  
  // Combine all classes
  const badgeClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${roundedClasses[rounded]} ${className}`;
  
  return (
    <span className={badgeClasses}>
      {children}
    </span>
  );
};

export default Badge;
