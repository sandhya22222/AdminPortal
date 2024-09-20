import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '../ui/pagination'
import React, { useState } from 'react'
import { Input } from '../ui/input'
import { useTranslation } from 'react-i18next'

// Constants
const PAGINATION_WINDOW_SIZE = 5
const PAGE_LIMIT_OPTIONS = [20, 50, 100]
/**
 * ShadCNPagination component renders a pagination control for navigating through pages of items.
 *
 * @param totalItemsCount - The total number of items to be paginated.
 * @param handlePageNumberChange - Callback function to handle page number changes. This function should be defined in the parent component and will receive the new page number and the page limit as arguments.
 * @param currentPage - The currently selected page number.
 * @param itemsPerPage - The number of items displayed per page.
 * @param showQuickJumper - Optional. Whether to show a quick jumper for direct page navigation.
 */
const ShadCNPagination = ({
    totalItemsCount,
    handlePageNumberChange = () => {},
    currentPage,
    itemsPerPage,
    showQuickJumper,
}) => {
    const { t } = useTranslation()
    const [goToValue, setGoToValue] = useState('')
    const totalPages = Math.ceil(totalItemsCount / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage + 1
    const endIndex = Math.min(currentPage * itemsPerPage, totalItemsCount)
    const handlePageNumberClick = (page) => {
        handlePageNumberChange(page, itemsPerPage)
    }
    const handlePrevButtonClick = () => {
        if (currentPage > 1) {
            handlePageNumberChange(currentPage - 1, itemsPerPage)
        }
    }
    const handleNextButtonClick = () => {
        if (currentPage < totalPages) {
            handlePageNumberChange(currentPage + 1, itemsPerPage)
        }
    }
    const handlePageLimitChange = (e) => {
        handlePageNumberChange(1, e)
    }
    const handleJumperValueChange = (e) => {
        setGoToValue(e.target.value)
    }
    const handleJumperKeyDown = (e) => {
        if (e?.key === 'Enter') {
            if (parseInt(goToValue) > 0 && parseInt(goToValue) <= totalPages) {
                handlePageNumberChange(goToValue, itemsPerPage)
            } else {
                setGoToValue('')
            }
        }
    }

    // Determine whether to show the left ellipsis (when there are more pages before the current set)
    const showLeftEllipsis = currentPage > PAGINATION_WINDOW_SIZE / 2 + 1
    // Determine whether to show the right ellipsis (when there are more pages after the current set)
    const showRightEllipsis = totalPages - currentPage > PAGINATION_WINDOW_SIZE / 2

    // Function to get the array of page numbers to display
    const getPageNumbers = () => {
        if (totalPages <= PAGINATION_WINDOW_SIZE) {
            // If the total number of pages is less than or equal to PAGINATION_WINDOW_SIZE, return all page numbers
            return Array.from({ length: totalPages }, (_, i) => i + 1)
        }

        // Calculate half of PAGINATION_WINDOW_SIZE to determine the range of pages to display around the current page
        const half = Math.floor(PAGINATION_WINDOW_SIZE / 2)
        let start = currentPage - half // Starting page number for display
        let end = currentPage + half // Ending page number for display

        // Adjust the start and end page numbers if they go out of bounds
        if (start < 1) {
            start = 1 // Ensure the start page number is at least 1
            end = PAGINATION_WINDOW_SIZE // If starting from page 1, set end to PAGINATION_WINDOW_SIZE to show the first set of pages
        } else if (end > totalPages) {
            start = totalPages - PAGINATION_WINDOW_SIZE + 1 // If end exceeds the total pages, adjust the start page number
            end = totalPages // Set end to the last page number
        }

        // Return an array of page numbers from start to end
        return Array.from({ length: end - start + 1 }, (_, i) => start + i)
    }

    // Function to render pagination items for each page number
    const renderPaginationItems = () => {
        const pageNumbers = getPageNumbers()
        return pageNumbers.map((page) => (
            <PaginationItem key={page}>
                <PaginationLink
                    isActive={page === currentPage ? true : false}
                    onClick={() => handlePageNumberClick(page)}>
                    {page}
                </PaginationLink>
            </PaginationItem>
        ))
    }

    return (
        <div>
            <Pagination>
                <PaginationContent>
                    <div>
                        {startIndex != null && endIndex != null && totalItemsCount != null && (
                            <span>{`${startIndex}-${endIndex} ${t('labels:of')} ${totalItemsCount} ${t('labels:items')}`}</span>
                        )}
                    </div>
                    <PaginationItem>
                        <PaginationPrevious
                            className={`${currentPage <= 1 ? 'cursor-not-allowed' : 'cursor-pointer'} !w-8 !p-1`}
                            onClick={() => handlePrevButtonClick()}
                        />
                    </PaginationItem>
                    {showLeftEllipsis && (
                        <PaginationItem>
                            <PaginationEllipsis
                                className='cursor-pointer'
                                onClick={() =>
                                    handlePageNumberChange(currentPage - PAGINATION_WINDOW_SIZE / 2, itemsPerPage)
                                }
                            />
                        </PaginationItem>
                    )}
                    {renderPaginationItems()}
                    {showRightEllipsis && (
                        <PaginationItem>
                            <PaginationEllipsis
                                className='cursor-pointer '
                                onClick={() =>
                                    handlePageNumberChange(currentPage + PAGINATION_WINDOW_SIZE / 2 + 1, itemsPerPage)
                                }
                            />
                        </PaginationItem>
                    )}
                    <PaginationItem>
                        <PaginationNext
                            onClick={() => handleNextButtonClick()}
                            className={`${currentPage === totalPages ? 'cursor-not-allowed' : 'cursor-pointer'} !w-8 !p-1`}
                        />
                    </PaginationItem>
                    <PaginationItem>
                        <Select onValueChange={(e) => handlePageLimitChange(e)} defaultValue={itemsPerPage}>
                            <SelectTrigger className='w-max h-8 !ml-2'>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {PAGE_LIMIT_OPTIONS.map((item) => {
                                    return (
                                        <SelectItem value={item}>
                                            {item} / {t('labels:page_capital')}
                                        </SelectItem>
                                    )
                                })}
                            </SelectContent>
                        </Select>
                    </PaginationItem>
                    {showQuickJumper && totalPages > 1 && (
                        <PaginationItem className='flex !flex-row !items-center gap-2'>
                            <span className='text-regal-blue'>{t('labels:go_to')}</span>
                            <Input
                                className='w-[50px] h-8'
                                onChange={(e) => handleJumperValueChange(e)}
                                value={goToValue}
                                onKeyDown={(e) => handleJumperKeyDown(e)}
                            />
                            <span className='text-regal-blue'>{t('labels:page_capital')}</span>
                        </PaginationItem>
                    )}
                </PaginationContent>
            </Pagination>
        </div>
    )
}

export default ShadCNPagination
