import React, { useEffect, useState } from 'react'
import ShadCNDataTable from '../../shadcnComponents/customComponents/ShadCNDataTable' // Import your custom ShadCNTable component
import { deepCopy } from '../../util/util' // Import your deepCopy function if still needed

const ShadCNTableComponent = ({ tableComponentData }) => {
    const [tableData, setTableData] = useState([])

    useEffect(() => {
        let copyOfDataSource = deepCopy(tableComponentData)
        setTableData(copyOfDataSource.table_content || [])
    }, [tableComponentData])

    // Convert table headers to the format expected by ShadCNTable
    const columns = tableComponentData.table_header.map((col) => ({
        value: col.key,
        header: col.title,
        width: col.width,
        render: col.render, // Pass the render function if available
    }))

    return (
        <div>
            {tableData && tableData.length > 0 ? (
                <ShadCNDataTable data={tableData} columns={columns} />
            ) : (
                <div className='h-28 flex items-center justify-center !bg-white'>no data</div>
            )}
        </div>
    )
}

export default ShadCNTableComponent
