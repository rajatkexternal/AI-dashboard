import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const PaginationComponent = ({
  currentPage = 1,
  totalItems = 0,
  itemsPerPage = 20,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 20, 50, 100]
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    const newTotalPages = Math.ceil(totalItems / newItemsPerPage);
    const newCurrentPage = Math.min(currentPage, newTotalPages);
    onItemsPerPageChange(newItemsPerPage);
    if (newCurrentPage !== currentPage) {
      onPageChange(newCurrentPage);
    }
  };

  // Generate page options for dropdown
  const pageOptions = [];
  for (let i = 1; i <= totalPages; i++) {
    pageOptions.push(i);
  }

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-200">
      {/* Left side - Items per page */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-700">Items per page:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
          className="border border-gray-300 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {itemsPerPageOptions.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="text-sm text-gray-700">
          {totalItems} items in total
        </span>
      </div>

      {/* Right side - Page navigation */}
      <div className="flex items-center space-x-2">
        {/* Page selector dropdown */}
        <select
          value={currentPage}
          onChange={(e) => handlePageChange(Number(e.target.value))}
          className="border border-gray-300 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={totalPages <= 1}
        >
          {pageOptions.map(page => (
            <option key={page} value={page}>
              {page}
            </option>
          ))}
        </select>
        
        <span className="text-sm text-gray-700">
          of {totalPages} page{totalPages !== 1 ? 's' : ''}
        </span>

        {/* Navigation buttons */}
        <div className="flex items-center space-x-1">
          {/* First page */}
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="First page"
          >
            <ChevronsLeft className="h-4 w-4 text-gray-600" />
          </button>

          {/* Previous page */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Previous page"
          >
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </button>

          {/* Next page */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Next page"
          >
            <ChevronRight className="h-4 w-4 text-gray-600" />
          </button>

          {/* Last page */}
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Last page"
          >
            <ChevronsRight className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaginationComponent;

