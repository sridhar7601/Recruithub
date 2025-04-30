import React, { ReactNode } from 'react';

export interface TableColumn<T> {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
  className?: string;
  headerClassName?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
  onRowClick?: (item: T) => void;
  rowClassName?: string | ((item: T) => string);
}

function Table<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyMessage = 'No data available',
  className = '',
  onRowClick,
  rowClassName = '',
}: TableProps<T>) {
  const renderCell = (item: T, column: TableColumn<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(item);
    }
    
    const value = item[column.accessor as keyof T];
    return value as ReactNode;
  };
  
  const getRowClassName = (item: T) => {
    const baseClasses = 'bg-white border-b hover:bg-gray-50';
    const clickableClasses = onRowClick ? 'cursor-pointer' : '';
    
    let customClasses = '';
    if (typeof rowClassName === 'function') {
      customClasses = rowClassName(item);
    } else {
      customClasses = rowClassName;
    }
    
    return `${baseClasses} ${clickableClasses} ${customClasses}`;
  };
  
  if (isLoading) {
    return (
      <div className="w-full animate-pulse">
        <div className="h-10 bg-gray-200 rounded mb-4"></div>
        {[...Array(5)].map((_, index) => (
          <div key={index} className="h-16 bg-gray-100 rounded mb-2"></div>
        ))}
      </div>
    );
  }
  
  if (data.length === 0) {
    return (
      <div className="w-full text-center py-8 bg-white border rounded">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }
  
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            {columns.map((column, index) => (
              <th 
                key={index} 
                scope="col" 
                className={`px-4 py-3 ${column.headerClassName || ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr 
              key={keyExtractor(item)} 
              className={getRowClassName(item)}
              onClick={onRowClick ? () => onRowClick(item) : undefined}
            >
              {columns.map((column, index) => (
                <td 
                  key={index} 
                  className={`px-4 py-3 ${column.className || ''}`}
                >
                  {renderCell(item, column)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
