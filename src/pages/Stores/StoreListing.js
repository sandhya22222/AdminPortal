import React, { useEffect, useState } from 'react';
import ShadCNTable from '../../shadcnComponents/customComponents/ShadCNTable'; // Import your custom ShadCNTable component
import { deepCopy } from '../../util/util'; // Import your deepCopy function if still needed

const ShadCNTableComponent = ({ tableComponentData }) => {
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        let copyOfDataSource = deepCopy(tableComponentData);
        setTableData(copyOfDataSource.table_content || []);
    }, [tableComponentData]);

    // Convert table headers to the format expected by ShadCNTable
    const columns = tableComponentData.table_header.map(col => ({
        key: col.key,
        label: col.title,
        width: col.width,
        render: col.render, // Pass the render function if available
    }));

    return (
        <div>
            {tableData && tableData.length > 0 ? (
                <ShadCNTable
                    data={tableData}
                    columns={columns}
                    actions={tableComponentData.actions} 
                />
            ) : (
                <div className='h-28 flex items-center justify-center !bg-white'>no data</div>
            )}
        </div>
    );
};

export default ShadCNTableComponent;
