import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  shadow?: boolean;
  rounded?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  border = true,
  shadow = true,
  rounded = true,
  onClick,
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
  };
  
  const borderClasses = border ? 'border border-gray-200' : '';
  const shadowClasses = shadow ? 'shadow' : '';
  const roundedClasses = rounded ? 'rounded-lg' : '';
  const cursorClasses = onClick ? 'cursor-pointer hover:bg-gray-50' : '';
  
  return (
    <div 
      className={`bg-white ${paddingClasses[padding]} ${borderClasses} ${shadowClasses} ${roundedClasses} ${cursorClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
