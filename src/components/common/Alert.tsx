import React, { ReactNode } from 'react';
import { XMarkIcon, ExclamationCircleIcon, CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

export type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  variant: AlertVariant;
  title?: string;
  message: ReactNode;
  onClose?: () => void;
  className?: string;
  showIcon?: boolean;
  showCloseButton?: boolean;
  position?: 'static' | 'fixed-bottom-right' | 'fixed-top-right' | 'fixed-top-center';
}

const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  message,
  onClose,
  className = '',
  showIcon = true,
  showCloseButton = true,
  position = 'static',
}) => {
  // Variant-specific styles
  const variantStyles = {
    success: {
      bg: 'bg-green-100',
      border: 'border-l-4 border-green-500',
      text: 'text-green-700',
      icon: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
    },
    error: {
      bg: 'bg-red-100',
      border: 'border-l-4 border-red-500',
      text: 'text-red-700',
      icon: <ExclamationCircleIcon className="h-6 w-6 text-red-500" />,
    },
    warning: {
      bg: 'bg-yellow-100',
      border: 'border-l-4 border-yellow-500',
      text: 'text-yellow-700',
      icon: <ExclamationCircleIcon className="h-6 w-6 text-yellow-500" />,
    },
    info: {
      bg: 'bg-blue-100',
      border: 'border-l-4 border-blue-500',
      text: 'text-blue-700',
      icon: <InformationCircleIcon className="h-6 w-6 text-blue-500" />,
    },
  };

  // Position styles
  const positionStyles = {
    'static': '',
    'fixed-bottom-right': 'fixed bottom-4 right-4',
    'fixed-top-right': 'fixed top-4 right-4',
    'fixed-top-center': 'fixed top-4 left-1/2 transform -translate-x-1/2',
  };

  const { bg, border, text, icon } = variantStyles[variant];
  const positionClass = positionStyles[position];

  return (
    <div className={`${bg} ${border} ${text} p-4 rounded shadow-md ${positionClass} ${className}`}>
      <div className="flex">
        {showIcon && (
          <div className="py-1 mr-4">
            {icon}
          </div>
        )}
        <div className="flex-grow">
          {title && <p className="font-bold">{title}</p>}
          {typeof message === 'string' ? <p className="text-sm">{message}</p> : message}
        </div>
        {showCloseButton && onClose && (
          <button 
            onClick={onClose}
            className="ml-auto focus:outline-none"
            aria-label="Close"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
