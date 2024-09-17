import * as React from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

import { cn } from '../../lib/utils'
import { buttonVariants } from './button'

const Pagination = ({ className, ...props }) => (
    <nav
        role='navigation'
        aria-label='pagination'
        className={cn('mx-auto flex w-full justify-center', className)}
        {...props}
    />
)
Pagination.displayName = 'Pagination'

const PaginationContent = React.forwardRef(({ className, ...props }, ref) => (
    <ul ref={ref} className={cn('flex flex-row items-center gap-2', className)} {...props} />
))
PaginationContent.displayName = 'PaginationContent'

const PaginationItem = React.forwardRef(({ className, ...props }, ref) => (
    <li ref={ref} className={cn('', className)} {...props} />
))
PaginationItem.displayName = 'PaginationItem'

const PaginationLink = ({ className, isActive, size = 'icon', ...props }) => (
    <a
        aria-current={isActive ? 'page' : undefined}
        className={cn(
            isActive ? '!border-primary !text-priamry ' : ' !text-regal-blue hover:!text-regal-blue',
            buttonVariants({
                variant: 'outline',
            }),
            '!h-8 !px-3',
            className
        )}
        {...props}
    />
)
PaginationLink.displayName = 'PaginationLink'

const PaginationPrevious = ({ className, ...props }) => (
    <PaginationLink aria-label='Go to previous page' size='sm' className={cn('gap-1 pl-2.5', className)} {...props}>
        <ChevronLeft className='h-4 w-4' />
    </PaginationLink>
)
PaginationPrevious.displayName = 'PaginationPrevious'

const PaginationNext = ({ className, ...props }) => (
    <PaginationLink aria-label='Go to next page' size='sm' className={cn('gap-1 pr-2.5', className)} {...props}>
        <ChevronRight className='h-4 w-4' />
    </PaginationLink>
)
PaginationNext.displayName = 'PaginationNext'

const PaginationEllipsis = ({ className, ...props }) => (
    <span aria-hidden className={cn('flex h-9 w-9 items-center justify-center', className)} {...props}>
        <MoreHorizontal className='h-4 w-4' />
        <span className='sr-only'>More pages</span>
    </span>
)
PaginationEllipsis.displayName = 'PaginationEllipsis'

export {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
}
