import React, { useEffect, useState } from 'react'
import { Table } from 'antd'
import { deepCopy } from '../../util/util'

const DynamicTable = ({ tableComponentData }) => {
    const [tableData, setTableData] = useState()

    useEffect(() => {
        let copyOfDataSource = deepCopy(tableComponentData)
        setTableData(copyOfDataSource.table_content)
    }, [tableComponentData])

    return (
        <div>
            {tableData && tableData.length > 0 ? (
                <Table
                    className='p-3'
                    dataSource={tableData}
                    columns={tableComponentData.table_header}
                    pagination={false}
                />
            ) : (
                <div className='h-28 flex items-center justify-center !bg-white'>no data</div>
            )}
        </div>
    )
}
export default DynamicTable
