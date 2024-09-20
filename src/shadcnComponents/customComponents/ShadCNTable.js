import React from 'react'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/table'
import { Button } from '../ui/button'
const ShadCNTable = ({ data, columns, actions }) => {
    return (
        <Table>
            {/* Table Header */}
            <TableHeader>
                <TableRow>
                    {columns.map((column) => (
                        <TableHead
                            key={column.key}
                            style={{ width: column.width }} // Applying dynamic width here
                            className='text-regal-blue text-sm font-medium leading-[22px]'>
                            {column.label}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody>
                {data.map((row) => (
                    <TableRow key={row.id}>
                        {columns.map((column) => (
                            <TableCell
                                key={column.key}
                                style={{ width: column.width }} // Applying dynamic width here
                                className='!text-brandGray1'>
                                {column.render ? (
                                    column.render(row[column.key], row) // Call the custom render function
                                ) : column.key === 'action' ? (
                                    <div className='flex space-x-2'>
                                        {actions.map((action, index) => (
                                            <Button
                                                variant='ghost'
                                                key={index}
                                                className={`text-sm font-medium rounded ${action.color}`}
                                                onClick={() => action.handler(row)}>
                                                {action.label}
                                            </Button>
                                        ))}
                                    </div>
                                ) : (
                                    row[column.key] // Default rendering
                                )}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default ShadCNTable
