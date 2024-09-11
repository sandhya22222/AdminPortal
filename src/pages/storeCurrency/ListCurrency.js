//! Import libraries
import React, { useState, useEffect } from 'react'
import { Layout, Typography, Tag, Tooltip, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
//! Import user defined components
import HeaderForTitle from '../../components/header/HeaderForTitle'
import { useTranslation } from 'react-i18next'
import MarketplaceServices from '../../services/axios/MarketplaceServices'
import SkeletonComponent from '../../components/Skeleton/SkeletonComponent'
import DmPagination from '../../components/DmPagination/DmPagination'
import { usePageTitle } from '../../hooks/usePageTitle'
import ShadCNTable from '../../components/shadCNCustomComponents/ShadCNTable'
//! Get all required details from .env file
const currencyAPI = process.env.REACT_APP_CHANGE_CURRENCY_API
const pageLimit = parseInt(process.env.REACT_APP_ITEM_PER_PAGE)

//! Destructure the ant design components
const { Content } = Layout
const { Text } = Typography

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
            label: <Text className='text-regal-blue text-sm font-medium leading-[22px]'>{t('labels:title')}</Text>,
            key: 'currency_name',
        },
        {
            label: <Text className='text-regal-blue text-sm font-medium leading-[22px]'>{t('labels:code')}</Text>,
            key: 'iso_currency_code',
        },
        {
            label: (
                <Text className='text-regal-blue text-sm font-medium leading-[22px]'>{t('labels:conversation')}</Text>
            ),
            key: 'unit_conversion',
        },
        {
            label: (
                <Text className='text-regal-blue text-sm font-medium leading-[22px]'>
                    {t('labels:unit_price_name')}
                </Text>
            ),
            key: 'unit_price_name',
        },
        {
            label: <Text className='text-regal-blue text-sm font-medium leading-[22px]'>{t('labels:min_amount')}</Text>,
            key: 'minimum_amount',
        },
        {
            label: <Text className='text-regal-blue text-sm font-medium leading-[22px]'>{t('labels:symbol')}</Text>,
            key: 'symbol',
        },
        {
            label: (
                <Text className='text-regal-blue text-sm font-medium leading-[22px]'>{t('labels:no_of_decimals')}</Text>
            ),
            key: 'no_of_decimal',
        },
        {
            label: <Text className='text-regal-blue text-sm font-medium leading-[22px]'>{t('labels:action')}</Text>,
            key: 'action',
        },
    ]

    const actions = [
        {
            label: t('labels:view_details'),
            color: 'app-primary-color',
            hoverColor: 'app-primary-color',
            handler: (row) => {
                navigate(`/dashboard/currency/edit-currency?k=${row.id}`)
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
            <Content className='p-3 mt-[8.8rem]'>
                {isLoading ? (
                    <Content className=' bg-white text-center !p-2 rounded-md'>
                        <SkeletonComponent />
                    </Content>
                ) : isNetworkError ? (
                    <Content className='pt-[2.3rem] px-3 pb-3 text-center ml-2 '>
                        <p>{`${t('messages:network_error')}`}</p>
                    </Content>
                ) : (
                    <Content className='bg-white p-3 !shadow-brandShadow rounded-md'>
                        {/* <Table dataSource={listCurrencyData?.data} columns={listCurrencyColumns} pagination={false} /> */}
                        <ShadCNTable data={listCurrencyData?.data} columns={listCurrencyColumns} actions={actions} />
                        {listCurrencyData && listCurrencyData?.count >= pageLimit ? (
                            <Content className=' grid justify-items-end'>
                                <DmPagination
                                    currentPage={currencyPaginationData.pageNumber}
                                    totalItemsCount={listCurrencyData?.count}
                                    pageSize={currencyPaginationData.pageSize}
                                    handlePageNumberChange={handleCurrencyPageNumberChange}
                                    showSizeChanger={true}
                                    showTotal={true}
                                    showQuickJumper={true}
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
