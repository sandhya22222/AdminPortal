//! Import libraries
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
//! Import user defined components
import HeaderForTitle from '../../components/header/HeaderForTitle'
import { useTranslation } from 'react-i18next'
import MarketplaceServices from '../../services/axios/MarketplaceServices'
import SkeletonComponent from '../../components/Skeleton/SkeletonComponent'
import DmPagination from '../../components/DmPagination/DmPagination'
import { usePageTitle } from '../../hooks/usePageTitle'
import ShadCNTooltip from '../../shadcnComponents/customComponents/ShadCNTooltip'
import { Badge } from '../../shadcnComponents/ui/badge'
import ShadCNDataTable from '../../shadcnComponents/customComponents/ShadCNDataTable'
import { Button } from '../../shadcnComponents/ui/button'
//! Get all required details from .env file
const currencyAPI = process.env.REACT_APP_CHANGE_CURRENCY_API
const pageLimit = parseInt(process.env.REACT_APP_ITEM_PER_PAGE)

//! Destructure the ant design components

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
            header: <span className='text-regal-blue text-sm font-medium leading-[22px]'>{t('labels:title')}</span>,
            value: 'currency_name',
            width: '25%',
            ellipsis: true,
            render: (text, record) => (
                <div className='flex items-center'>
                    {record.is_default ? (
                        <ShadCNTooltip content={record.currency_name}>
                            <div
                                className={`mx-1 text-brandGray1  ${record.is_default ? '!max-w-[68px] truncate' : '!max-w-[150px]'}`}
                                style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}>
                                {record.currency_name}
                            </div>
                        </ShadCNTooltip>
                    ) : (
                        <div>{record.currency_name}</div>
                    )}
                    {record.is_default && (
                        <Badge variant='' className='inline-flex items-center gap-1 rounded-xl' color='#FB8500'>
                            {t('labels:default_currency')}
                        </Badge>
                    )}
                </div>
            ),
        },
        {
            header: <span className='text-regal-blue text-sm font-medium leading-[22px]'>{t('labels:code')}</span>,
            value: 'iso_currency_code',
            width: '10%',
        },
        {
            header: (
                <span className='text-regal-blue text-sm font-medium leading-[22px]'>{t('labels:conversation')}</span>
            ),
            value: 'unit_conversion',
            width: '12%',
        },
        {
            header: (
                <span className='text-regal-blue text-sm font-medium leading-[22px]'>
                    {t('labels:unit_price_name')}
                </span>
            ),
            value: 'unit_price_name',
            width: '15%',
        },
        {
            header: (
                <span className='text-regal-blue text-sm font-medium leading-[22px]'>{t('labels:min_amount')}</span>
            ),
            value: 'minimum_amount',
            width: '10%',
        },
        {
            header: <span className='text-regal-blue text-sm font-medium leading-[22px]'>{t('labels:symbol')}</span>,
            value: 'symbol',
            width: '10%',
        },
        {
            header: (
                <span className='text-regal-blue text-sm font-medium leading-[22px]'>{t('labels:no_of_decimals')}</span>
            ),
            value: 'no_of_decimal',
            width: '10%',
        },
        {
            header: <span className='text-regal-blue text-sm font-medium leading-[22px]'>{t('labels:action')}</span>,
            value: 'action',
            render: (text, record) => {
                return (
                    <Button
                        variant='ghost'
                        className='app-btn-text text-sm font-medium rounded hover:bg-slate-100'
                        onClick={() => {
                            navigate(`/dashboard/currency/edit-currency?k=${record.id}`)
                        }}>
                        {t('labels:view_details')}
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
        <div>
            <div className='!shadow-lg'>
                <HeaderForTitle
                    className=''
                    title={<div className='!font-semibold text-2xl mb-4 text-regal-blue'>{t('labels:currency')}</div>}
                    titleContent={<div className=' !flex items-center !justify-end gap-3'></div>}
                />
            </div>
            <div className='p-3 mt-[8.8rem]'>
                {isLoading ? (
                    <div className=' bg-white text-center !p-2 rounded-md'>
                        <SkeletonComponent />
                    </div>
                ) : isNetworkError ? (
                    <div className='pt-[2.3rem] px-3 pb-3 text-center ml-2 '>
                        <p>{`${t('messages:network_error')}`}</p>
                    </div>
                ) : (
                    <div className='bg-white p-3 !shadow-brandShadow !rounded-md'>
                        <ShadCNDataTable columns={listCurrencyColumns} data={listCurrencyData?.data} />
                        {listCurrencyData && listCurrencyData?.count >= pageLimit ? (
                            <div className=' grid justify-items-end'>
                                <DmPagination
                                    currentPage={currencyPaginationData.pageNumber}
                                    totalItemsCount={listCurrencyData?.count}
                                    pageSize={currencyPaginationData.pageSize}
                                    handlePageNumberChange={handleCurrencyPageNumberChange}
                                    showSizeChanger={true}
                                    showTotal={true}
                                    showQuickJumper={true}
                                />
                            </div>
                        ) : null}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ListCurrency
