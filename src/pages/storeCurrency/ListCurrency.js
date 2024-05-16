//! Import libraries
import React, { useState, useEffect } from 'react'
import { Layout, Typography, Col, Tag, Tooltip, Image, Table, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

//! Import user defined components
import HeaderForTitle from '../../components/header/HeaderForTitle'
import { useTranslation } from 'react-i18next'
import MarketplaceServices from '../../services/axios/MarketplaceServices'
import SkeletonComponent from '../../components/Skeleton/SkeletonComponent'
import DmPagination from '../../components/DmPagination/DmPagination'
import { usePageTitle } from '../../hooks/usePageTitle'
import util from '../../util/common'
import { starIcon } from '../../constants/media'

//! Get all required details from .env file
const currencyAPI = process.env.REACT_APP_CHANGE_CURRENCY_API
const pageLimit = parseInt(process.env.REACT_APP_ITEM_PER_PAGE)

//! Destructure the ant design components
const { Content } = Layout
const { Title, Text } = Typography

const ListCurrency = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    usePageTitle(t('labels:currency'))

    //! declaring useState variables here
    const [currencyPaginationData, setCurrencyPaginationData] = useState({
        pageNumber: 1,
        pageSize: pageLimit,
    })

    //! columns for currency
    const listCurrencyColumns = [
        {
            title: `${t('labels:currency_name')}`,
            dataIndex: 'currencyName',
            key: 'currencyName',
            width: '20%',
            ellipsis: true,
            render: (text, record) => {
                return (
                    <Content className='inline-block'>
                        <Tooltip
                            title={record.currency_name}
                            overlayStyle={{ zIndex: 1 }}
                            placement={util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? 'left' : 'right'}>
                            <Text
                                className={`mx-1
                   ${record.is_default === true ? '!max-w-[80px]' : '!max-w-[150px]'} `}
                                ellipsis={true}>
                                {record.currency_name}
                            </Text>
                        </Tooltip>
                        {record.is_default === true ? (
                            <Tag
                                icon={<Image preview={false} src={starIcon} className='mr-1 flex !items-center ' />}
                                className='inline-flex items-center gap-1'
                                color='#FB8500'>
                                {t('labels:default')}
                            </Tag>
                        ) : (
                            ''
                        )}
                    </Content>
                )
            },
        },
        {
            title: `${t('labels:code')}`,
            dataIndex: 'currency_code',
            key: 'currency_code',
            width: '8%',
            render: (text, record) => {
                return (
                    <>
                        <Tooltip title={record.iso_currency_code}>
                            <Text className='max-w-xs' ellipsis={{ tooltip: record.iso_currency_code }}>
                                {record.iso_currency_code}
                            </Text>
                        </Tooltip>
                    </>
                )
            },
        },
        {
            title: `${t('labels:conversation')}`,
            dataIndex: 'conversation',
            key: 'conversation',
            ellipsis: true,
            width: '12%',
            render: (text, record) => {
                return <>{record.unit_conversion}</>
            },
        },
        {
            title: `${t('labels:unit_price_name')}`,
            dataIndex: 'unitPriceName',
            key: 'unitPriceName',
            width: '14%',
            render: (text, record) => {
                return <>{record.unit_price_name}</>
            },
        },
        {
            title: `${t('labels:min_amount')}`,
            dataIndex: 'minAmount',
            key: 'minAmount',
            width: '12%',
            render: (text, record) => {
                return <>{record.minimum_amount}</>
            },
        },
        {
            title: `${t('labels:symbol')}`,
            dataIndex: 'symbol',
            key: 'symbol',
            width: '9%',
            render: (text, record) => {
                return <>{record.symbol}</>
            },
        },
        {
            title: `${t('labels:no_of_decimals')}`,
            dataIndex: 'noOfDecimals',
            key: 'noOfDecimals',
            width: '14%',
            render: (text, record) => {
                return <>{record.no_of_decimal}</>
            },
        },
        {
            title: `${t('labels:action')}`,
            dataIndex: '',
            key: '',
            width: '12%',
            // align: 'center',
            render: (text, record) => {
                return (
                    <Button
                        type='text'
                        className='app-btn-text'
                        onClick={() => {
                            navigate(`/dashboard/currency/edit-currency?k=${record.id}`)
                        }}>
                        <Text ellipsis className='app-primary-color'>
                            {t('labels:view_details')}{' '}
                        </Text>
                    </Button>
                )
            },
        },
    ]

    //!doing get call for currency using React Query
    const findByPageCurrencyData = async (page, limit) => {
        // Fetcher function
        const res = await MarketplaceServices.findByPage(currencyAPI, null, page, limit, false)
        return res?.data?.response_body
    }

    //! Using the useQuery hook to fetch the currency Data
    const {
        data: listCurrencyData,
        isError: isNetworkError,
        isLoading,
    } = useQuery({
        queryKey: ['currency'],
        queryFn: () => findByPageCurrencyData(currencyPaginationData.pageNumber, currencyPaginationData.pageSize),
        refetchOnWindowFocus: false,
        retry: false,
    })

    //!currency pagination onchange function , when we change the page number this onChange function will trigger
    const handleCurrencyPageNumberChange = (page, pageSize) => {
        setCurrencyPaginationData({
            pageNumber: page,
            pageSize: pageSize,
        })
    }

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    //!JSX for list currency page
    return (
        <Content>
            <HeaderForTitle
                title={
                    <Content className=''>
                        <Title level={3} className='!font-normal'>
                            {t('labels:currency')}
                        </Title>
                    </Content>
                }
                titleContent={<Content className=' !flex items-center !justify-end gap-3'></Content>}
            />
            <Content className='p-3 mt-[7.0rem]'>
                {isLoading ? (
                    <Content className=' bg-white text-center !p-2'>
                        <SkeletonComponent />
                    </Content>
                ) : isNetworkError ? (
                    <Content className='pt-[2.3rem] px-3 pb-3 text-center ml-2 '>
                        <p>{`${t('messages:network_error')}`}</p>
                    </Content>
                ) : (
                    <>
                        <Table dataSource={listCurrencyData?.data} columns={listCurrencyColumns} pagination={false} />
                        {listCurrencyData && listCurrencyData?.count >= pageLimit ? (
                            <Content className=' grid justify-items-end'>
                                <DmPagination
                                    currentPage={currencyPaginationData.pageNumber}
                                    totalItemsCount={listCurrencyData?.count}
                                    pageSize={currencyPaginationData.pageSize}
                                    handlePageNumberChange={handleCurrencyPageNumberChange}
                                    showSizeChanger={true}
                                    showTotal={true}
                                />
                            </Content>
                        ) : null}
                    </>
                )}
            </Content>
        </Content>
    )
}

export default ListCurrency
