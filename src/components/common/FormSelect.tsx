import React, { SelectHTMLAttributes } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  helpText?: string;
  fullWidth?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  emptyOptionLabel?: string;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  options,
  error,
  helpText,
  fullWidth = true,
  isLoading = false,
  loadingText = 'Loading...',
  emptyOptionLabel = 'Select an option',
  id,
  className = '',
  ...rest
}) => {
  const selectId = id || `select-${label.toLowerCase().replace(/\s+/g, '-')}`;
  
  const baseSelectClasses = 'block border rounded-md shadow-sm py-2 pl-3 pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm';
  const errorSelectClasses = error ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' : 'border-gray-300';
  const widthClasses = fullWidth ? 'w-full' : '';
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      <label htmlFor={selectId} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 relative">
        <select
          id={selectId}
          className={`${baseSelectClasses} ${errorSelectClasses} ${widthClasses}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${selectId}-error` : helpText ? `${selectId}-description` : undefined}
          disabled={isLoading}
          {...rest}
        >
          <option value="">{emptyOptionLabel}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <div className="absolute inset-y-0 right-0 pr-8 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      {isLoading && (
        <p className="mt-2 text-sm text-gray-500">
          {loadingText}
        </p>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-600" id={`${selectId}-error`}>
          {error}
        </p>
      )}
      {helpText && !error && !isLoading && (
        <p className="mt-2 text-sm text-gray-500" id={`${selectId}-description`}>
          {helpText}
        </p>
      )}
    </div>
  );
};

export default FormSelect;
