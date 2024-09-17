import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../shadcnComponents/ui/table'; // Adjust the import path
import { Switch } from '../../shadcnComponents/ui/switch'; // Adjust the import path

const StoreTable = ({ storeTableData, t }) => {
    const handleSwitchChange = (rowIndex) => {
        // Handle switch change logic here, such as updating the store's status
        console.log(`Switch changed for row ${rowIndex}`);
    };

    return (
        <Table className="w-full">
            {/* Table Header */}
            <TableHeader>
                <TableRow>
                    {storeTableData.table_header.map((header, index) => (
                        <TableHead key={index}>{header.title}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody>
                {storeTableData.table_content.length > 0 ? (
                    storeTableData.table_content.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {storeTableData.table_header.map((header, colIndex) => (
                                <TableCell key={colIndex}>
                                    {header.key === 'status' ? (
                                        <Switch
                                            checked={row[header.key] === 1}
                                            onChange={() => handleSwitchChange(rowIndex)}
                                        />
                                    ) : (
                                        row[header.key]
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={storeTableData.table_header.length} className="text-center">
                            {t('messages:no_data_available')}
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};

export default StoreTable;
