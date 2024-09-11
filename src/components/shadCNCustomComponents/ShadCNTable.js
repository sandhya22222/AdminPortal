import React from 'react'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../shadcnComponents/ui/table'
const ShadCNTable = ({ data, columns, actions }) => {
    return (
        <Table>
            {/* Table Header */}
            <TableHeader>
                <TableRow>
                    {columns.map((column) => (
                        <TableHead key={column.key} className='text-regal-blue text-sm font-medium leading-[22px]'>
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
                            <TableCell key={column.key} className='!text-brandGray1'>
                                {column.key === 'action' ? (
                                    <div className='flex space-x-2'>
                                        {actions.map((action, index) => (
                                            <button
                                                key={index}
                                                className={`py-1 text-sm font-medium rounded ${action.color}`}
                                                onClick={() => action.handler(row)}>
                                                {action.label}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    row[column.key]
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
