import React, { InputHTMLAttributes } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helpText?: string;
  fullWidth?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  helpText,
  fullWidth = true,
  id,
  className = '',
  ...rest
}) => {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
  
  const baseInputClasses = 'block border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm';
  const errorInputClasses = error ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300';
  const widthClasses = fullWidth ? 'w-full' : '';
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 relative">
        <input
          id={inputId}
          className={`${baseInputClasses} ${errorInputClasses} ${widthClasses}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helpText ? `${inputId}-description` : undefined}
          {...rest}
        />
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600" id={`${inputId}-error`}>
          {error}
        </p>
      )}
      {helpText && !error && (
        <p className="mt-2 text-sm text-gray-500" id={`${inputId}-description`}>
          {helpText}
        </p>
      )}
    </div>
  );
};

export default FormInput;
