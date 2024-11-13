//! Import libraries & components
import { Skeleton } from '../../shadcnComponents/ui/skeleton'
import { Progress } from '../../shadcnComponents/ui/progress'
import React, { useEffect, useState } from 'react'

import axios from 'axios'

import { useNavigate } from 'react-router-dom'

//! Import CSS libraries

//! Import user defined services

//! Import user defined components & hooks
import { usePageTitle } from '../../hooks/usePageTitle'
//! Import user defined functions

//! Import user defined CSS
// import "./dashboard.css";

import { useTranslation } from 'react-i18next'
import { useAuth } from 'react-oidc-context'
import HeaderForTitle from '../../components/header/HeaderForTitle'
import MarketplaceServices from '../../services/axios/MarketplaceServices'
import util from '../../util/common'

import OrdersIcon from '../../assets/images/dashboard/ordersIcon.svg'
import PerformanceIcon from '../../assets/images/dashboard/performanceIcon.svg'
import StatisticsIcon from '../../assets/images/dashboard/statisticsIcon.svg'
import ShadCNDataTable from '../../shadcnComponents/customComponents/ShadCNDataTable'
import { Button } from '../../shadcnComponents/ui/button'

//! Get all required details from .env file

const dm4sightBaseURL = process.env.REACT_APP_4SIGHT_BASE_URL
const dm4sightClientID = process.env.REACT_APP_4SIGHT_CLIENT_ID
const dm4sightEnabled = process.env.REACT_APP_4SIGHT_DATA_ENABLED
const dm4sightGetAnalysisDetailAPI = process.env.REACT_APP_4SIGHT_GETANALYSISDETAIL_API

const storePlatformLimitApi = process.env.REACT_APP_STORE_PLATFORM_LIMIT_API
const userProfileApi = process.env.REACT_APP_USER_PROFILE_API

//! Destructure the components
const instance = axios.create()

const Newdashboard = () => {
    const { t } = useTranslation()
    const auth = useAuth()
    const navigate = useNavigate()

    usePageTitle(t('labels:dashboard'))
    const [activeStoreCount, setActiveStoreCount] = useState()
    const [inActiveStoreCount, setInActiveStoreCount] = useState()
    const [tableData, setTableData] = useState([])
    const [loading, setLoading] = useState(true)

    const [storeLimitValues, setStoreLimitValues] = useState([])
    const [username, setUsername] = useState('')
    const [langDirection, setLangDirection] = useState('ltr')
    const [dashboardDataNetWorkError, setDashboardDataNetWorkError] = useState(false)
    let keyCLoak = sessionStorage.getItem('keycloakData')
    keyCLoak = JSON.parse(keyCLoak)
    let realmName = keyCLoak.clientId.replace(/-client$/, '')

    const dm4sightHeaders = {
        headers: {
            token: auth?.user?.access_token,
            realmname: realmName,
            dmClientId: dm4sightClientID,
            client: 'admin',
        },
    }

 
    useEffect(() => {
        if (util.getSelectedLanguageDirection()) {
            setLangDirection(util.getSelectedLanguageDirection()?.toLowerCase())
        }
    }, [util.getSelectedLanguageDirection()])

    const getActiveInactiveData = () => {
        setLoading(true)
        instance
            .get(dm4sightBaseURL + dm4sightGetAnalysisDetailAPI, dm4sightHeaders)
            .then((response) => {
                const activeCount = response.data.active_store_count
                setActiveStoreCount(activeCount)
                console.log('Active Store Count:', activeCount)

                setInActiveStoreCount(response.data.inactive_store_count)
                const transformedData = Object.entries(response.data.count_info).map(([key, value]) => ({
                    key: key,
                    store_name: value.name,
                    orders: value.count_order,
                    vendors: value.count_vendor,
                    products: value.count_product,
                    product_templates: value.count_template,
                    orders_received: value.count_received_order,
                    in_progress: value.count_inprogress_order,
                    orders_cancelled: value.count_cancelled_order,
                    orders_fulfilled: value.count_fulfilled_order,
                }))

                setTableData(transformedData)
                setLoading(false)
                setDashboardDataNetWorkError(false)
            })
            .catch((err) => {
                setLoading(false)
                setDashboardDataNetWorkError(true)
            })
    }

    useEffect(() => {
        getActiveInactiveData()
        MarketplaceServices.findAll(storePlatformLimitApi)
            .then(function (response) {
                setStoreLimitValues(response.data.response_body)
            })
            .catch((error) => {
                console.log('Server error from store limit API ', error.response)
            })

        MarketplaceServices.findAll(userProfileApi)
            .then(function (response) {
                setUsername(response.data.response_body?.preferred_username)
            })
            .catch((error) => {
                console.log('Server error from user profile API ', error.response)
            })
    }, [])

    const statisticsColumns = [
        {
            header: `${t('labels:store_name')}`,
            value: 'store_name',
            render: (text, record) => <div className='!text-regal-blue'>{record.store_name}</div>,
        },
        {
            header: `${t('labels:number_of') + ' ' + t('labels:product_templates')}`,
            value: 'product_templates',
            render: (text, record) => <div className='!text-regal-blue'>{record.product_templates}</div>,
        },
        {
            header: `${t('labels:number_of') + ' ' + t('labels:products')}`,
            value: 'products',
            render: (text, record) => <div className='!text-regal-blue'>{record.products}</div>,
        },
        {
            header: `${t('labels:number_of') + ' ' + t('labels:vendors')}`,
            value: 'vendors',
            render: (text, record) => <div className='!text-regal-blue'>{record.vendors}</div>,
        },
        {
            header: `${t('labels:number_of') + ' ' + t('labels:orders')}`,
            value: 'orders',
            render: (text, record) => <div className='!text-regal-blue'>{record.orders}</div>,
        },
    ]

    const ordersColumns = [
        {
            header: `${t('labels:store_name')}`,
            value: 'store_name',
            render: (text, record) => <div className='!text-regal-blue'>{record.store_name}</div>,
        },
        {
            header: `${t('labels:number_of') + ' ' + t('labels:orders_received')}`,
            value: 'orders_received',
            render: (text, record) => <div className='!text-regal-blue'>{record.orders_received}</div>,
        },
        {
            header: `${t('labels:number_of') + ' ' + t('labels:orders_inprogress')}`,
            value: 'in_progress',
            render: (text, record) => <div className='!text-regal-blue'>{record.in_progress}</div>,
        },
        {
            header: `${t('labels:number_of') + ' ' + t('labels:orders_fulfilled')}`,
            value: 'orders_fulfilled',
            render: (text, record) => <div className='!text-regal-blue'>{record.orders_fulfilled}</div>,
        },
        {
            header: `${t('labels:number_of') + ' ' + t('labels:orders_cancelled')}`,
            value: 'orders_cancelled',
            render: (text, record) => <div className='!text-regal-blue'>{record.orders_cancelled}</div>,
        },
        {
            header: `${t('labels:total') + ' ' + t('labels:number_of') + ' ' + t('labels:orders')}`,
            value: 'orders',
            render: (text, record) => <div className='!text-regal-blue'>{record.orders}</div>,
        },
    ]

    const performanceColumns = [
        {
            header: `${t('labels:store_name')}`,
            value: 'store_name',
            width: '30%', // Specify the width if needed
            render: (text, record) => (
                <div className='!text-regal-blue mb-1 !max-w-[150px]' title={record.store_name}>
                    {record.store_name}
                </div>
            ),
        },
        {
            header: `${t('labels:number_of') + ' ' + t('labels:orders')}`,
            value: 'orders',
            width: '20%', // Specify the width if needed
            render: (text, record) => <div className='!text-regal-blue'>{record.orders}</div>,
        },
    ]

    return (
        <div className='mb-2'>
            <div className='mb-2'>
                <HeaderForTitle
                    className='!w-full'
                    title={
                        <div className='flex z-20 mb-3 mt-2 w-full'>
                            <div className='!w-full mr-2 flex !font-semibold text-lg flex-col gap-1'>
                                <div className='flex gap-1 !font-semibold text-[24px]'>
                                    <h3 className='!text-[#637381] m-0'>{t('messages:hello') + ','}</h3>
                                    <h3 className='!text-regal-blue !m-0'>
                                        {username.slice(0, 1).toUpperCase() + username.slice(1)}
                                    </h3>
                                </div>
                                <p className='!text-sm my-3 !text-[#637381] w-auto font-normal'>
                                    {t('messages:dashboard_welcome_message')}
                                </p>
                            </div>
                        </div>
                    }
                    titleContent={
                        <div className='flex flex-row items-baseline w-full overflow-hidden'>
                            <div
                                className={
                                    storeLimitValues?.store_limit
                                        ? '!w-full flex flex-col justify-center items-baseline'
                                        : '!w-full mr-0 pr-0 flex flex-col justify-center items-baseline'
                                }>
                                <div className='text-[#637381] text-base !font-bold flex justify-left gap-1 items-center'>
                                    <div className='flex items-center gap-2'>
                                        <span className='inline-block w-1.5 h-1.5 bg-green-500 rounded-full'></span>
                                        <span className='!text-brandGray2 text-[14px] font-bold'>
                                            {t('labels:active_stores')}
                                        </span>
                                    </div>
                                </div>

                                <div className='flex flex-col items-baseline min-h-4 min-w-40 max-w-72 space-x-2'>
                                    <div className='flex justify-between items-baseline gap-1'>
                                        <div className={'!max-w-[3.4em]'}>
                                            <h2 className='!text-regal-blue m-0 text-[28px] font-semibold p-0 whitespace-nowrap'>
                                                {activeStoreCount || 0}
                                            </h2>
                                        </div>
                                        {storeLimitValues?.store_limit && (
                                            <span
                                                className={`${
                                                    storeLimitValues.store_limit.toString().length >= 5
                                                        ? '!text-md text-[#8899A8] w-60'
                                                        : '!text-md text-[#8899A8]'
                                                }`}>
                                                {t('labels:of')} {storeLimitValues.store_limit || 0}{' '}
                                                {t('labels:stores')} ({t('labels:max_allowed')})
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {storeLimitValues?.store_limit && (
                                    <Progress
                                        className='mt-0 pt-0 h-2'
                                        color={'brandOrange'}
                                        style={{ width: '90%', margin: 0, padding: 0 }}
                                        size='small'
                                        value={(activeStoreCount / storeLimitValues.store_limit) * 100}
                                    />
                                )}
                            </div>
                            <hr
                                className='z-10 h-20 ml-0 pl-0'
                                style={{ borderLeft: '3px solid #000000', height: 'auto' }}
                            />
                            <div
                                className={`!w-full
                                 flex flex-col justify-center ${
                                     util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? 'pr-10' : 'pl-4'
                                 }`}>
                                <div>
                                    <div className='text-[#637381] text-base !font-bold flex justify-left gap-1 items-center'>
                                        <div className='flex items-center gap-2'>
                                            <span className='inline-block w-1.5 h-1.5 bg-gray-400 rounded-full '></span>
                                            <span className='!text-brandGray2 text-[14px] font-bold'>
                                                {t('labels:inactive_stores')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className='flex items-baseline'>
                                        <h2 className='text-brandGray1 leading-[30px] font-semibold text-[24px]'>
                                            {inActiveStoreCount || 0}
                                        </h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                />
            </div>
            <div className='!p-3 !mt-[9rem]'>
                {loading ? (
                    <div className='mt-5 !bg-[var(--mp-bright-color)] !p-3 !rounded-md'>
                        <div className='space-y-4'>
                            {Array.from({ length: 8 }).map((_, index) => (
                                <Skeleton key={index} className='h-6 w-full' />
                            ))}
                        </div>
                    </div>
                ) : dashboardDataNetWorkError ? (
                    <div className='text-center !bg-[var(--mp-bright-color)] !p-3 mt-28 !rounded-md'>
                        {t('messages:dashboard_network_error')}
                    </div>
                ) : (
                    <div>
                        <div className='flex gap-3'></div>

                        <div hidden={dm4sightEnabled === 'true' ? false : true} className='flex justify-between !mt-14'>
                            <div className='!w-[70%] bg-[#ffff] p-[24px] mt-0 ml-2 shadow-sm rounded-md justify-center'>
                                <div className='flex items-center justify-between mb-1'>
                                    <h4 className='!m-0  !text-regal-blue !font-semibold text-lg flex gap-2'>
                                        <img
                                            className='w-8 p-1.5 flex items-center justify-center bg-[#FA8C16] rounded'
                                            src={StatisticsIcon}
                                            alt=''
                                        />
                                        {t('labels:statistics')}
                                    </h4>
                                </div>

                                <hr
                                    style={{
                                        width: 'calc(100% + 48px)',
                                        marginLeft: '-24px',
                                        borderTop: '1px solid #EAEAEA',
                                        marginTop: '24px',
                                        marginBottom: '24px',
                                    }}
                                />

                                <div>
                                    <ShadCNDataTable pagination={false} data={tableData} columns={statisticsColumns} />
                                </div>
                            </div>
                            <div className='!w-[30%] mt-0 ml-5 mr-2 bg-[#ffff] p-[24px] shadow-sm rounded-md justify-center'>
                                <div className='flex items-center justify-between mb-1'>
                                    <h4 className='!m-0  !text-regal-blue !font-semibold text-lg flex gap-2'>
                                        <img
                                            className='w-8 p-1.5 flex items-center justify-center bg-[#13C2C2] rounded'
                                            src={PerformanceIcon}
                                            alt=''
                                        />
                                        {t('labels:performance')}
                                    </h4>
                                </div>

                                <hr
                                    style={{
                                        width: 'calc(100% + 48px)',
                                        marginLeft: '-24px',
                                        borderTop: '1px solid #EAEAEA',
                                        marginTop: '24px',
                                        marginBottom: '24px',
                                    }}
                                />

                                <div>
                                    <ShadCNDataTable pagination={false} data={tableData} columns={performanceColumns} />
                                </div>
                            </div>
                        </div>
                        <div className='!w-[98.5%] bg-[#ffff] p-[24px] mt-4 ml-2 shadow-sm rounded-md justify-center'>
                            <div className='flex items-center justify-between mb-1'>
                                <h4 className='!m-0  !text-regal-blue !font-semibold text-lg flex gap-2'>
                                    <img
                                        className='w-8 p-1.5 flex items-center justify-center bg-[#2F54EB] rounded'
                                        src={OrdersIcon}
                                        alt=''
                                    />
                                    {t('labels:orders')}
                                </h4>
                            </div>

                            <hr
                                style={{
                                    width: 'calc(100% + 48px)',
                                    marginLeft: '-24px',
                                    borderTop: '1px solid #EAEAEA',
                                    marginTop: '24px',
                                    marginBottom: '24px',
                                }}
                            />

                            <div>
                                <ShadCNDataTable pagination={false} data={tableData} columns={ordersColumns} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Newdashboard
