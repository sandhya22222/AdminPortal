import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '../../shadcnComponents/ui/pagination'; // Adjust the import path
import { Input } from '../../shadcnComponents/ui/input'; // Adjust the import path for Input component

export default function DmPagination({
  currentPage,
  totalItemsCount,
  handlePageNumberChange,
  pageSize,
  showSizeChanger,
  defaultPageSize,
  showTotal,
  presentPage,
  showQuickJumper
}) {
  const { t } = useTranslation();
  const selectedLanguageFromReduxState = useSelector(
    (state) => state.reducerSelectedLanguage.selectedLanguage
  );

  const [jumpToPage, setJumpToPage] = useState('');

  const handlePageChange = (page) => {
    handlePageNumberChange(page, pageSize);
  };

  const handleJumpToPageChange = (e) => {
    setJumpToPage(e.target.value);
  };

  const handleJumpToPage = () => {
    const pageNumber = parseInt(jumpToPage, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      handlePageChange(pageNumber);
      setJumpToPage(''); // Clear the input after navigating
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleJumpToPage();
    }
  };

  // Determine the total number of pages
  const totalPages = Math.ceil(totalItemsCount / pageSize);

  useEffect(() => {
    if (
      String(selectedLanguageFromReduxState?.writing_script_direction).toUpperCase() === 'RTL'
    ) {
      // Adjust RTL settings here if needed
    }
  }, [selectedLanguageFromReduxState]);

  return (
    <div className='flex items-center gap-2'>
      <Pagination className='my-3'>
        <PaginationContent>
          {/* Previous Page */}
          {currentPage > 1 && (
            <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
          )}

          {/* Render Page Numbers */}
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNum = index + 1;
            return (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  isActive={pageNum === currentPage}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          {/* Ellipsis for more pages (if needed) */}
          {totalPages > 5 && <PaginationEllipsis />}

          {/* Next Page */}
          {currentPage < totalPages && (
            <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
          )}
        </PaginationContent>
      </Pagination>

      {/* Jump-to-Page Input */}
      <div className='flex items-center gap-1'>
        <Input
          type='number'
          min='1'
          max={totalPages}
          value={jumpToPage}
          onChange={handleJumpToPageChange}
          onKeyPress={handleKeyPress} // Listen for Enter key
          placeholder={t('labels:go_to_page')}
          className='w-20'
        />
      </div>
    </div>
  );
}
