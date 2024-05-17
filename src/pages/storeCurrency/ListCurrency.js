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
            title: (
                <Text className='text-regal-blue text-sm font-medium leading-[22px]'>{t('labels:currency_name')}</Text>
            ),
            dataIndex: 'currencyName',
            key: 'currencyName',
            width: '20%',
            ellipsis: true,
            render: (text, record) => {
                return (
                    <Content className='inline-block'>
                        <Text
                            className={`mx-1 text-brandGray1
                   ${record.is_default === true ? '!max-w-[95px]' : '!max-w-[150px]'} `}
                            ellipsis={{ tooltip: record.currency_name }}>
                            {record.currency_name}
                        </Text>
                        {record.is_default === true ? (
                            <Tag
                                icon={<img src={starIcon} className='mr-1 flex !items-center ' alt='defaultIcon' />}
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
            title: <Text className='text-regal-blue text-sm font-medium leading-[22px]'>{t('labels:code')}</Text>,
            dataIndex: 'currency_code',
            key: 'currency_code',
            width: '8%',
            render: (text, record) => {
                return (
                    <>
                        <Tooltip title={record.iso_currency_code}>
                            <Text className='max-w-xs text-brandGray1' ellipsis={{ tooltip: record.iso_currency_code }}>
                                {record.iso_currency_code}
                            </Text>
                        </Tooltip>
                    </>
                )
            },
        },
        {
            title: (
                <Text className='text-regal-blue text-sm font-medium leading-[22px]'>{t('labels:conversation')}</Text>
            ),
            dataIndex: 'conversation',
            key: 'conversation',
            ellipsis: true,
            width: '13%',
            render: (text, record) => {
                return <Text className='text-brandGray1'>{record.unit_conversion}</Text>
            },
        },
        {
            title: (
                <Text className='text-regal-blue text-sm font-medium leading-[22px]'>
                    {t('labels:unit_price_name')}
                </Text>
            ),
            dataIndex: 'unitPriceName',
            key: 'unitPriceName',
            width: '14%',
            render: (text, record) => {
                return <Text className='text-brandGray1'>{record.unit_price_name}</Text>
            },
        },
        {
            title: <Text className='text-regal-blue text-sm font-medium leading-[22px]'>{t('labels:min_amount')}</Text>,
            dataIndex: 'minAmount',
            key: 'minAmount',
            width: '10%',
            render: (text, record) => {
                return <Text className='text-brandGray1'>{record.minimum_amount}</Text>
            },
        },
        {
            title: <Text className='text-regal-blue text-sm font-medium leading-[22px]'>{t('labels:symbol')}</Text>,
            dataIndex: 'symbol',
            key: 'symbol',
            width: '9%',
            render: (text, record) => {
                return <Text className='text-brandGray1'>{record.symbol}</Text>
            },
        },
        {
            title: (
                <Text className='text-regal-blue text-sm font-medium leading-[22px]'>{t('labels:no_of_decimals')}</Text>
            ),
            dataIndex: 'noOfDecimals',
            key: 'noOfDecimals',
            width: '12%',
            render: (text, record) => {
                return <Text className='text-brandGray1'>{record.no_of_decimal}</Text>
            },
        },
        {
            title: <Text className='text-regal-blue text-sm font-medium leading-[22px]'>{t('labels:action')}</Text>,
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
            <div className='!shadow-lg'>
                <HeaderForTitle
                    className=''
                    title={
                        <Content className=''>
                            <div className='!font-semibold text-2xl mb-4 text-regal-blue'>{t('labels:currency')}</div>
                        </Content>
                    }
                    titleContent={<Content className=' !flex items-center !justify-end gap-3'></Content>}
                />
            </div>
            <Content className='p-3 mt-[9.5rem]'>
                {isLoading ? (
                    <Content className=' bg-white text-center !p-2'>
                        <SkeletonComponent />
                    </Content>
                ) : isNetworkError ? (
                    <Content className='pt-[2.3rem] px-3 pb-3 text-center ml-2 '>
                        <p>{`${t('messages:network_error')}`}</p>
                    </Content>
                ) : (
                    <Content className='bg-white p-3 shadow-brandShadow rounded-md'>
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
                    </Content>
                )}
            </Content>
        </Content>
    )
}

export default ListCurrency
