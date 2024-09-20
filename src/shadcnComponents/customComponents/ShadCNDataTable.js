import React from 'react'
import { Table, TableHead, TableRow, TableCell, TableBody, TableHeader } from '../../shadcnComponents/ui/table'

// Reusable Table Component
const ShadCNDataTable = ({ columns, data }) => {
    return (
        <Table className='!rounded-sm'>
            {/* Table Header */}
            <TableHeader>
                <TableRow>
                    {columns.map((column, index) => (
                        <TableHead
                            key={index}
                            className='px-4 py-2 font-semibold bg-gray-50 '
                            style={{ width: column.width || 'auto' }} // Ensure proper width handling
                        >
                            {column.header}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody>
                {data.map((row, rowIndex) => (
                    <TableRow key={rowIndex} className='border-b'>
                        {columns.map((column) => (
                            <TableCell
                                key={column.key}
                                className='px-4 !text-brandGray1'
                                style={{ width: column.width || 'auto' }} // Ensure columns are contained
                            >
                                {column.render ? column.render(row[column.key], row) : row[column.value]}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default ShadCNDataTable
