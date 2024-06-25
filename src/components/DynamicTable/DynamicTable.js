import React, { useEffect, useState } from 'react'
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap'
import { Button, Skeleton, Layout, Table, Row, Col, Input, Space, Checkbox, Select, Typography } from 'antd'
import { sortObjectArrayByKey, deepCopy } from '../../util/util'
import { AiFillFilter } from 'react-icons/ai'
const { Content } = Layout
const { Search } = Input
const { Text } = Typography
const DynamicTable = ({ tableComponentData }) => {
    //! How to import this Component
    // step1:- import {DynamicTable} from './../tablelayoutcomponent';
    //here the  path will change according to where calling component is stored
    // step2:- <DynamicTable tableComponentData ={props which needs to send}/>
    // eg:- <DynamicTable tableComponentData ={tablePropsData}/>
    //tableComponentData is the props naame the name should be same like this
    //! props Structure
    // const tablepropsData = {
    //   table_header: ProductTableColumns,  // here we are defining the table_header how it the columns should appear in table
    //   table_content: TableData,           // passing the data to rows in columns
    //   search_settings: {                   // searchbox design props should look like this
    //     is_enabled: true,
    //     search_title: "Search by name",
    //     search_data: ["product_type_name","category_name","name","status"],  // here we are passing the serach data in the form array here data should be same as key name s which are sending the tabledata
    //   },
    //   filter_settings: {   //filteSettings we are defined here
    // filtervalues is the array of object which need to pass
    //     is_enabled: true,
    //     filter_title: "Filter's",
    //     filter_data: [
    //       {
    //         filter_type: "category_id",
    //         is_enabled: true,
    //         filter_title: "Product Category",
    //         filter_values: categoryList,
    //       },
    //       {
    //         filter_type: "product_type",
    //         is_enabled: true,
    //         filter_title: "Product Type",
    //         filter_values: productTypes,
    //       },
    //       {
    //         filter_type: "status_id",
    //         is_enabled: true,
    //         filter_title: "Status",
    //         filter_values: Status,
    //       },
    //       {
    //         filter_type: "version",
    //         is_enabled: true,
    //         filter_title: "version",
    //         filter_values: Versions,
    //       }
    //     ],
    //   },
    //   sorting_settings: {
    //     is_enabled: true,
    //     sorting_title: "Sorting by",
    //     sorting_data: ProductSortingOption,
    //   },
    // };
    //tableComponentData is the props getting from other component
    //copyOfDataSource is taking the copy of props.i.e tableComponentData for this here we are making the deep copy these props conatins the nested array of objects;
    let copyofDataSource = deepCopy(tableComponentData)
    // dataSource is the state variable which stores the copyOfDataSource
    const [dataSource, setDataSource] = useState(copyofDataSource)
    // storing the data for table
    const [tableData, setTableData] = useState()
    //below three are state variable which stores sortingvalue,sorting type, and sortkey whenver your select the sorting methods
    const [selectedSortingValue, setSelectedSortingValue] = useState()
    const [selectedSortingKey, setSelectedSortingKey] = useState()
    const [selectedSortingType, setSelectedSortingType] = useState()
    // opening and closing of dropdown
    const [openFilteringDropDown, setOpenFilteringDropDown] = useState(false)
    //when ever user click on any check box that values should saved on this state variable
    const [checkBoxData, setCheckBoxData] = useState([])
    const [updateingDataFromServer, setUpdateingDataFromServer] = useState(0)
    // onloading we are sorting the data based on sorting props where user will define on what bases which we have to sort
  
    useEffect(() => {
        let copyOfDataSource = deepCopy(tableComponentData)
        setDataSource(copyOfDataSource)
        let copyData = [...dataSource.table_content]
        if (
            tableComponentData.sorting_settings.sorting_data &&
            tableComponentData.sorting_settings.is_enabled === true &&
            tableComponentData.sorting_settings.sorting_data.length > 0
        ) {
            const defaultSortArray =
                tableComponentData.sorting_settings.sorting_data &&
                tableComponentData.sorting_settings.sorting_data.length > 0 &&
                tableComponentData.sorting_settings.sorting_data.filter((item) => item.default === true)
            if (defaultSortArray.length > 0) {
                const value = defaultSortArray && defaultSortArray.length > 0 && defaultSortArray[0].title
                const sortType = defaultSortArray && defaultSortArray.length > 0 && defaultSortArray[0].sortType
                const sortKey = defaultSortArray && defaultSortArray.length > 0 && defaultSortArray[0].sortKey
                setSelectedSortingValue(value)
                setSelectedSortingKey(sortKey)
                setSelectedSortingType(sortType)
                // sorted data will store in sortedData variable
                const sortedData = sortObjectArrayByKey(sortKey, 'string', copyData, sortType)
                // here we are setting TableData to sortedData
                setTableData(sortedData)
            } else {
                const defaultData =
                    tableComponentData.sorting_settings.sorting_data &&
                    tableComponentData.sorting_settings.sorting_data.length > 0 &&
                    tableComponentData.sorting_settings.sorting_data.filter((item) => item.sortType === 'default')
                if (defaultData.length > 0) {
                    setSelectedSortingValue(defaultData[0].title)
                    setSelectedSortingType(defaultData[0].sortType)
                }
                setTableData(dataSource.table_content)
            }
        } else {
            setTableData(tableComponentData.table_content)
        }
    }, [tableComponentData])
    useEffect(() => {
        if (updateingDataFromServer !== 0) {
            let copyData = [...dataSource.table_content]
            console.log('useffect---2')
            handleFilter(copyData)
        }
    }, [updateingDataFromServer])
    // searching the table data by props we are getting from serachData
    const handleSearchBoxChange = (e) => {
        const searchValue = e.target.value
        // we are checking the serachdata we are getting in props length is > 0 or not
        if (dataSource.search_settings.search_data.length && dataSource.search_settings.search_data.length > 0) {
            //we are taking as of now only on one element so here we are giving searchdata[0]
            if (searchValue !== '') {
                // in result we are stored the data based on text which user enters in the serach box
                let searchResult = []
                // for loop will goes until serachdata length and we will store data in serach Result
                for (let i = 0; i < dataSource.search_settings.search_data.length; i++) {
                    const searchKey = dataSource.search_settings.search_data[i]
                    const results = dataSource.table_content.filter((user) => {
                        return user[searchKey].toLowerCase().startsWith(searchValue.toLowerCase())
                    })
                    searchResult = searchResult.concat(results)
                }
                // we are removing the duplicated data in searchResult and storing the unique data in uniqueSearchData
                const uniqueSearchData = [...new Set(searchResult)]
                // setting the uniqueSearchData to tableData
                setTableData(uniqueSearchData)
            }
            // if the searchValue is not equal to "" then we are setting the tableData to normal tabledata
            else {
                setTableData(dataSource.table_content)
                // If the text field is empty, show all users
            }
        }
    }
    const handleSorting = (sortkey, data, sorttype) => {
        const sortedData = sortObjectArrayByKey(sortkey, 'string', data, sorttype)
        return sortedData
    }
    const handleFilter = (table_content) => {
        console.log('insidefilter---------->', selectedSortingType)
        let result = []
        if (checkBoxData && checkBoxData.length > 0) {
            let allCheckBoxTypes = []
            // first loop goes until checkBox Datalength
            for (var i = 0; i < checkBoxData.length; i++) {
                // type contains checkbox type ,,i.e type =producttypr or categoryid
                const type = checkBoxData[i].type
                // we are collecting all types and storing it in allcheckboxtypes array
                allCheckBoxTypes = allCheckBoxTypes.concat(type)
            }
            // here we are grtting unquie type
            const uniqueCheckBoxTypes = [...new Set(allCheckBoxTypes)]
            if (uniqueCheckBoxTypes.length > 0) {
                let finalFilterData = []
                // in this loop we are uniqueCheckBoxTypeslength
                for (var i = 0; i < uniqueCheckBoxTypes.length; i++) {
                    let filteredData = finalFilterData
                    if (filteredData.length === 0) {
                        // we are setting tabledata to filteredData during initial rendering and if filtereddata.length ===0
                        filteredData = [...table_content]
                    }
                    var type = uniqueCheckBoxTypes[i]
                    // we are getting the data which equals to type we are getting in firstloop and we are storing to typedaata
                    const typeData = checkBoxData.filter((element) => element.type === type)
                    let localFilteredData = []
                    // in this loop we are until typedatalength
                    for (var j = 0; j < typeData.length; j++) {
                        // we are storing the id of that selected check box type
                        var value = typeData[j].id
                        // we are filtering the data based on that id
                        const filterResult = filteredData.filter((element) => element[type] === value)
                        // storing the filterresult to localFiltereddata
                        localFilteredData = localFilteredData.concat(filterResult)
                        // console.log("localfiltereddata--------------", localFilteredData);
                    }
                    finalFilterData = localFilteredData
                }
                result = result.concat(finalFilterData)
            }
            if (
                dataSource.sorting_settings.is_enabled === true &&
                dataSource.sorting_settings.sorting_data.length > 0
            ) {
                if (selectedSortingType === 'default') {
                    setTableData(result)
                } else {
                    setTableData(handleSorting(selectedSortingKey, result, selectedSortingType))
                }
            } else {
                setTableData(result)
            }
        } else {
            if (
                dataSource.sorting_settings.is_enabled === true &&
                dataSource.sorting_settings.sorting_data.length > 0
            ) {
                if (selectedSortingType === 'default') {
                    setTableData(dataSource.table_content)
                } else {
                    setTableData(handleSorting(selectedSortingKey, dataSource.table_content, selectedSortingType))
                }
            } else {
                setTableData(dataSource.table_content)
            }
        }
        console.log('result--------->', result)
    }
    // sorting the tabledata according to the selected value
    const handleSelectedSorting = (value, obj) => {
        // we are making copy of tabledata for that only we are applying sorting
        let sortType = obj.sortTypeForSorting
        let sortKey = obj.sortKeyValueForSorting
        setSelectedSortingValue(value)
        setSelectedSortingKey(sortKey)
        setSelectedSortingType(sortType)
        let copyData = [...tableData]
        // sortObjectArrayByKey is the method it sort the data according to params which we sent to that method
        if (sortType !== 'default') {
            setTableData(handleSorting(sortKey, copyData, sortType))
        } else {
            //handleFilter(dataSource.table_content);
            setUpdateingDataFromServer(updateingDataFromServer + 1)
        }
    }
    //here we are getting the checkbox value and we are updateing the object based on ticked checkbox to true or false
    const handleCheckBoxClick = (e, type) => {
        let id = e.target.id
        let name = e.target.value
        let typeofCheckBoxData = type
        // here we are checking the selected checkbox values is present or not in checkBoxData state variable if it is there it will return 1 else -1
        const itemIndex =
            checkBoxData &&
            checkBoxData.length > 0 &&
            checkBoxData.findIndex((item) => item.id === id && item.name === name && item.type === typeofCheckBoxData)
        //storing the id,name,typeofcheckboxdata in one object
        const checkBoxObject = {
            id: id,
            name: name,
            type: typeofCheckBoxData,
        }
        // if it is true the only we are setting the data to setCheckBoxdata function
        if (e.target.checked) {
            // push in checkbox data
            if (checkBoxData && checkBoxData.length === 0) {
                setCheckBoxData([...checkBoxData, checkBoxObject])
            }
            if (itemIndex === -1) {
                setCheckBoxData([...checkBoxData, checkBoxObject])
            }
            // here we are updateing the dataSource for only selected checkbox id in that is_checked to true
            setDataSource((prevState) => {
                const oldData = { ...prevState }
                oldData.filter_settings.filter_data
                    .filter((item) => item.filter_type === typeofCheckBoxData)[0]
                    .filter_values.filter((ele) => ele.id === id)[0].is_checked = true
                return oldData
            })
        } else {
            //removeing the checkboxdata if the user uncheck the checkbox
            checkBoxData.splice(itemIndex, 1) // at that index it will remove one item
            //for that uncheck checkbox we are updateing the datasource for selected id to is_checked false
            setDataSource((prevState) => {
                const oldData = { ...prevState }
                oldData.filter_settings.filter_data
                    .filter((item) => item.filter_type === typeofCheckBoxData)[0]
                    .filter_values.filter((ele) => ele.id === id)[0].is_checked = false
                return oldData
            })
        }
    }
    // here we are doing the filteration table data according the selected checkbox
    const handleFilteringDataBasedOnCheckBox = () => {
        handleFilter(dataSource.table_content)
        setOpenFilteringDropDown(!openFilteringDropDown)
    }
    // we are clearing the checkbox data and filter applied to table
    const handleClearFilter = () => {
        setCheckBoxData([])
        // we are making copy of props here it is deep copy because the props we are getting is nested array of objects
        let copyOfDataSource = deepCopy(tableComponentData)
        // setting the datasource to its original state
        setDataSource(copyOfDataSource)
        //sorting the data after clear
        if (selectedSortingType === 'default' || selectedSortingType === undefined) {
            setTableData(dataSource.table_content)
        } else {
            const sortedData = sortObjectArrayByKey(
                selectedSortingKey,
                'string',
                dataSource.table_content,
                selectedSortingType
            )
            //setting the sorted data to tableData
            setTableData(sortedData)
        }
    }

    // jsx elements are started
    return (
        <div>
            {dataSource.table_content && dataSource.table_content.length > 0 ? (
                <div>
                    <Content className='bg-white mb-2 !rounded-md'>
                        {dataSource.filter_settings.is_enabled === true ||
                        dataSource.search_settings.is_enabled === true ||
                        dataSource.sorting_settings.is_enabled === true ? (
                            <Row justify='space-between' className='pt-3 px-3'>
                                {/* serachBox Design starts here */}
                                <Col className=''>
                                    {dataSource.search_settings.is_enabled ? (
                                        <Search
                                            placeholder={dataSource.search_settings.search_title}
                                            onChange={handleSearchBoxChange}
                                            style={{
                                                width: '324px',
                                            }}
                                        />
                                    ) : null}
                                </Col>
                                <Col>
                                    <Row>
                                        {/* sorting design starts here */}
                                        <Col className='mr-2'>
                                            {dataSource.sorting_settings.is_enabled ? (
                                                <div>
                                                    <Text className='pr-1'>Sort By :</Text>
                                                    <Select
                                                        className='text-xs'
                                                        onChange={handleSelectedSorting}
                                                        value={selectedSortingValue}
                                                        style={{
                                                            width: 184,
                                                            height: 30,
                                                        }}>
                                                        {dataSource.sorting_settings.sorting_data &&
                                                            dataSource.sorting_settings.sorting_data.length > 0 &&
                                                            dataSource.sorting_settings.sorting_data.map(
                                                                (dropdownvalue, index) => {
                                                                    return (
                                                                        <Select.Option
                                                                            value={dropdownvalue.title}
                                                                            key={index}
                                                                            className=' text-xs'
                                                                            sortTypeForSorting={dropdownvalue.sortType}
                                                                            sortKeyValueForSorting={
                                                                                dropdownvalue.sortKey
                                                                            }>
                                                                            {dropdownvalue.title}
                                                                        </Select.Option>
                                                                    )
                                                                }
                                                            )}
                                                    </Select>
                                                </div>
                                            ) : null}
                                        </Col>
                                        <Col>
                                            {/* filteration design starts here */}
                                            {dataSource.filter_settings.is_enabled ? (
                                                <Dropdown
                                                    className=''
                                                    toggle={() => {
                                                        setOpenFilteringDropDown(!openFilteringDropDown)
                                                    }}
                                                    isOpen={openFilteringDropDown}>
                                                    <DropdownToggle className='mr-1'>
                                                        {dataSource.filter_settings.filter_title !== null ? (
                                                            <Button>{dataSource.filter_settings.filter_title}</Button>
                                                        ) : (
                                                            <AiFillFilter style={{ color: 'black' }} />
                                                        )}
                                                    </DropdownToggle>
                                                    <DropdownMenu className=''>
                                                        <Row justify='space-between mx-2 px-2'>
                                                            <Col>
                                                                <p className='text-sm '>Filter by</p>
                                                            </Col>
                                                            <Col onClick={handleClearFilter} className='cursor-pointer'>
                                                                <p className='text-sm px-2'>Clear all</p>
                                                            </Col>
                                                        </Row>
                                                        <Content>
                                                            {dataSource.filter_settings.filter_data.length > 0 ? (
                                                                <div className='flex'>
                                                                    {dataSource.filter_settings.filter_data.map(
                                                                        (filteringdata, index) => {
                                                                            return (
                                                                                <div className='mx-2' key={index}>
                                                                                    {filteringdata.is_enabled ? (
                                                                                        <div
                                                                                            className='mt-3 whitespace-nowrap px-2'
                                                                                            key={
                                                                                                filteringdata.filter_type
                                                                                            }>
                                                                                            <h4 className='py-2 text-lg'>
                                                                                                {
                                                                                                    filteringdata.filter_title
                                                                                                }
                                                                                            </h4>
                                                                                            {filteringdata.filter_values &&
                                                                                            filteringdata.filter_values
                                                                                                .length > 0 ? (
                                                                                                <div className='h-[240px] overflow-y-auto'>
                                                                                                    <Space direction='vertical'>
                                                                                                        {filteringdata.filter_values.map(
                                                                                                            (
                                                                                                                element,
                                                                                                                index
                                                                                                            ) => {
                                                                                                                return (
                                                                                                                    <Checkbox
                                                                                                                        onChange={(
                                                                                                                            e
                                                                                                                        ) => {
                                                                                                                            handleCheckBoxClick(
                                                                                                                                e,
                                                                                                                                filteringdata.filter_type
                                                                                                                            )
                                                                                                                        }}
                                                                                                                        value={
                                                                                                                            element.name
                                                                                                                        }
                                                                                                                        id={
                                                                                                                            element.id
                                                                                                                        }
                                                                                                                        key={
                                                                                                                            element.id +
                                                                                                                            index
                                                                                                                        }
                                                                                                                        checked={
                                                                                                                            element.is_checked
                                                                                                                        }
                                                                                                                        className='pb-1'>
                                                                                                                        {
                                                                                                                            element.name
                                                                                                                        }
                                                                                                                    </Checkbox>
                                                                                                                )
                                                                                                            }
                                                                                                        )}
                                                                                                    </Space>
                                                                                                </div>
                                                                                            ) : (
                                                                                                <p>No Data</p>
                                                                                            )}
                                                                                        </div>
                                                                                    ) : null}
                                                                                </div>
                                                                            )
                                                                        }
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <p className='pl-7 text-red-400'>No Data</p>
                                                            )}
                                                        </Content>
                                                        <div>
                                                            {dataSource.filter_settings.filter_data.length > 0 ? (
                                                                <Button
                                                                    className='mt-3 mx-2'
                                                                    onClick={handleFilteringDataBasedOnCheckBox}>
                                                                    Apply
                                                                </Button>
                                                            ) : null}
                                                        </div>
                                                    </DropdownMenu>
                                                </Dropdown>
                                            ) : null}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        ) : null}

                        {tableData ? (
                            <Table
                                className='p-3'
                                dataSource={tableData}
                                columns={dataSource.table_header}
                                // pagination={{
                                //   defaultPageSize:tableData && tableData.length,
                                //   showSizeChanger:false,
                                //   pageSizeOptions:false,

                                //   hideOnSinglePage: false,
                                // }}
                                pagination={false}></Table>
                        ) : (
                            <Skeleton
                                className='p-3'
                                active
                                paragraph={{
                                    rows: 6,
                                }}></Skeleton>
                        )}
                    </Content>
                </div>
            ) : (
                <div className='h-28 flex items-center justify-center !bg-white'>
                    {/* No Data Available Currently, there is no data to display in the table. */}
                </div>
            )}
        </div>
    )
}
export default DynamicTable
