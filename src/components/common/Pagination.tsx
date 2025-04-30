import React from 'react';
import Button from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  maxVisiblePages?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  maxVisiblePages = 5,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  // Calculate visible page numbers
  const getVisiblePageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than or equal to max visible pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      // Calculate start and end of visible pages
      let startPage: number;
      let endPage: number;
      
      if (currentPage <= Math.ceil(maxVisiblePages / 2)) {
        // Current page is near the start
        startPage = 2;
        endPage = maxVisiblePages - 2;
        
        if (endPage + 1 < totalPages) {
          pageNumbers.push('...');
        }
        
        for (let i = startPage; i <= endPage; i++) {
          pageNumbers.push(i);
        }
        
      } else if (currentPage >= totalPages - Math.floor(maxVisiblePages / 2)) {
        // Current page is near the end
        startPage = totalPages - (maxVisiblePages - 3);
        endPage = totalPages - 1;
        
        if (startPage > 2) {
          pageNumbers.push('...');
        }
        
        for (let i = startPage; i <= endPage; i++) {
          pageNumbers.push(i);
        }
        
      } else {
        // Current page is in the middle
        startPage = currentPage - Math.floor((maxVisiblePages - 4) / 2);
        endPage = currentPage + Math.floor((maxVisiblePages - 4) / 2);
        
        if (startPage > 2) {
          pageNumbers.push('...');
        }
        
        for (let i = startPage; i <= endPage; i++) {
          pageNumbers.push(i);
        }
        
        if (endPage < totalPages - 1) {
          pageNumbers.push('...');
        }
      }
      
      // Always show last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  const visiblePageNumbers = getVisiblePageNumbers();

  return (
    <div className={`flex items-center justify-end space-x-1 ${className}`}>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      
      {visiblePageNumbers.map((pageNumber, index) => (
        pageNumber === '...' ? (
          <span key={`ellipsis-${index}`} className="px-3 py-1">...</span>
        ) : (
          <Button
            key={`page-${pageNumber}`}
            variant={currentPage === pageNumber ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => onPageChange(pageNumber as number)}
            className={currentPage === pageNumber ? 'bg-blue-100 text-blue-700 border-blue-200' : ''}
          >
            {pageNumber}
          </Button>
        )
      ))}
      
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
