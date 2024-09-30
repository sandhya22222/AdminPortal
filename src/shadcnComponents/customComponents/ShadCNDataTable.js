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
                        <TableHead key={index} className=''>
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
                            <TableCell key={column.key} className=''>
                                {column.render ? (
                                    <div className='capitalize'>{column.render(row[column.key], row)}</div>
                                ) : (
                                    <div className='capitalize'> {row[column.value]} </div>
                                )}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default ShadCNDataTable
