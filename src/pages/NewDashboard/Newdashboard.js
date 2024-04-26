//! Import libraries & components
import React, { useEffect, useState } from 'react'
import {
    Layout,
    Typography,
    Skeleton,
    Table,
    Progress,
    Divider,
} from 'antd'

import axios from 'axios'
import {
    BarChartOutlined,
} from '@ant-design/icons'
// import { useQuery } from "@tanstack/react-query";

//! Import CSS libraries

//! Import user defined services

//! Import user defined components & hooks
import { usePageTitle } from '../../hooks/usePageTitle'
//! Import user defined functions

//! Import user defined CSS
// import "./dashboard.css";

import MarketplaceServices from '../../services/axios/MarketplaceServices'
import util from '../../util/common'
import HeaderForTitle from '../../components/header/HeaderForTitle'
import { useAuth } from 'react-oidc-context'
import { useTranslation } from 'react-i18next'

import { UserOutlined } from '@ant-design/icons'
import { Avatar, Space } from 'antd'

//! Get all required details from .env file


const dm4sightBaseURL = process.env.REACT_APP_4SIGHT_BASE_URL
const dm4sightClientID = process.env.REACT_APP_4SIGHT_CLIENT_ID
const dm4sightEnabled = process.env.REACT_APP_4SIGHT_DATA_ENABLED
const dm4sightGetAnalysisDetailAPI = process.env.REACT_APP_4SIGHT_GETANALYSISDETAIL_API

const storePlatformLimitApi = process.env.REACT_APP_STORE_PLATFORM_LIMIT_API
const userProfileApi = process.env.REACT_APP_USER_PROFILE_API

// const auth = getAuth.toLowerCase() === "true";

//! Destructure the components
const { Title, Text} = Typography
const { Content } = Layout
const instance = axios.create()

const Newdashboard = () => {
    const { t } = useTranslation()
    const auth = useAuth()
    usePageTitle(t('labels:dashboard'))
    const [activeStoreCount, setActiveStoreCount] = useState()
    const [inActiveStoreCount, setInActiveStoreCount] = useState()
    const [tableData, setTableData] = useState([])
    const [loading, setLoading] = useState(true)

    const [storeLimitValues, setStoreLimitValues] = useState([])
    const [username, setUsername] = useState('')
    const [langDirection, setLangDirection] = useState('ltr')
    const [storeOveriewError, setStoreOveriewError] = useState(false)

    let keyCLoak = sessionStorage.getItem('keycloakData')
    keyCLoak = JSON.parse(keyCLoak)
    let realmName = keyCLoak.clientId.replace(/-client$/, '')

    const dm4sightHeaders = {
        headers: {
            token: auth.user && auth.user?.access_token,
            realmname: realmName,
            dmClientId: dm4sightClientID,
            client: 'admin',
        },
    }

    useEffect(() => {
        if (auth && auth.user && auth.user?.access_token) {
            util.setAuthToken(auth.user?.access_token)
            util.setIsAuthorized(true)
        } else {
            util.removeAuthToken()
            util.removeIsAuthorized()
        }
    }, [auth])
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
                setActiveStoreCount(response.data.active_store_count)
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
                setStoreOveriewError(false)
            })
            .catch((err) => {
                setStoreOveriewError(true)
                setLoading(false)
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
                console.log('Server error from store limit API ', error.response)
            })
    }, [])

    const statisticsColumns = [
        {
            title: t('labels:store_name'),
            dataIndex: 'store_name',
            key: 'store_name',
        },
        {
            title: t('labels:number_of') + ' ' + t('labels:orders'),
            dataIndex: 'orders',
            key: 'orders',
        },
        {
            title: t('labels:number_of') + ' ' + t('labels:product_templates'),
            dataIndex: 'product_templates',
            key: 'product_templates',
        },
        {
            title: t('labels:number_of') + ' ' + t('labels:products'),
            dataIndex: 'products',
            key: 'products',
        },
        {
            title: t('labels:number_of') + ' ' + t('labels:vendors'),
            dataIndex: 'vendors',
            key: 'vendors',
        },
    ]

    return (
        <Content className='mb-2'>
            <Content className='mb-2'>
                {!storeOveriewError && (
                    <HeaderForTitle
                        title={
                            <Content className='flex z-20 mb-3  !justify-between'>
                                <Content className='!w-[10%] flex  align-start'>
                                    <Space direction='vertical' size={16}>
                                        <Space wrap size={16}>
                                            <Avatar
                                                size={64}
                                                className='flex items-center justify-center'
                                                icon={<UserOutlined />}
                                            />
                                        </Space>
                                    </Space>
                                </Content>

                                <Content className='!w-[80%] mr-2 '>
                                    <Title level={3} className='!text-black'>
                                        {t('messages:hello')} {username.slice(0, 1).toUpperCase() + username.slice(1)},
                                    </Title>
                                    <Text className='!text-sm mb-2 text-zinc-400 '>
                                        {t('messages:dashboard_welcome_message')}
                                    </Text>
                                </Content>
                                <Content
                                    className={
                                        storeLimitValues?.store_limit
                                            ? ' !w-[40%] flex flex-col justify-center items-baseline'
                                            : ' !w-[24%]  mr-0 pr-0 flex flex-col justify-center items-baseline'
                                    }
                                    // "  !w-[30%] flex flex-col justify-center items-baseline"
                                >
                                    <Text className='!text-md mb-2 text-zinc-400 flex gap-1 items-center'>
                                        <Content class='w-2 h-2 bg-lime-500 rounded-full float-left'></Content>{' '}
                                        {t('labels:active_stores')}
                                    </Text>

                                    <Content className='flex flex-col  items-baseline h-4 min-w-40 max-w-72 space-x-2 '>
                                        <div className='flex justify-between  items-baseline gap-1 '>
                                            {langDirection == 'ltr' ? (
                                                <div className={activeStoreCount > 9 ? 'min-w-[34px]' : ''}>
                                                    <Title style={{ color: '#4A2D73' }} level={2}>
                                                        {activeStoreCount ? activeStoreCount : 0}{' '}
                                                    </Title>
                                                </div>
                                            ) : null}
                                            {storeLimitValues?.store_limit ? (
                                                <Text
                                                    level={5}
                                                    className={
                                                        storeLimitValues?.store_limit.toString().length >= 5
                                                            ? `text-zinc-400 !font-semibold   ${
                                                                  langDirection == 'rtl' ? 'w-[185px]' : 'w-60'
                                                              }`
                                                            : 'text-zinc-400 !font-semibold '
                                                    }>
                                                    {' '}
                                                    {t('labels:of')}{' '}
                                                    {storeLimitValues?.store_limit ? storeLimitValues?.store_limit : 0}{' '}
                                                    {/* {storeLimitValues?.store_limit.toString().length} */}
                                                    {t('labels:stores')} ({t('labels:max_allowed')})
                                                </Text>
                                            ) : null}
                                            {langDirection == 'rtl' ? (
                                                <div className=''>
                                                    <Title style={{ color: '#4A2D73' }} level={2}>
                                                        {activeStoreCount ? activeStoreCount : 0}{' '}
                                                    </Title>
                                                </div>
                                            ) : null}
                                        </div>
                                    </Content>
                                    {storeLimitValues?.store_limit ? (
                                        <Progress
                                            style={{ paddingTop: '10px', width: '72%' }}
                                            strokeColor={'#4A2D73'}
                                            size='small'
                                            percent={(activeStoreCount / storeLimitValues?.store_limit) * 100}
                                            showInfo={false}
                                        />
                                    ) : null}
                                </Content>

                                <Divider className='h-20 ml-0 pl-0' type='vertical' />

                                <Content
                                    className={`!w-[25%] flex flex-col justify-center ${
                                        util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? 'pr-10' : 'pl-4'
                                    }`}>
                                    <Content>
                                        <Text className='!text-md mb-2 text-zinc-400 flex justify-left gap-1 items-center'>
                                            <Content class='w-2 h-2  bg-neutral-400 rounded-full'></Content>{' '}
                                            {t('labels:inactive_sores')}
                                        </Text>
                                        <Content className='flex items-baseline'>
                                            <Title class='text-zinc-400' level={2}>
                                                {' '}
                                                {inActiveStoreCount ? inActiveStoreCount : 0}{' '}
                                            </Title>
                                        </Content>
                                    </Content>
                                </Content>
                            </Content>
                        }
                    />
                )}
            </Content>
            <Content className='!p-3 !mt-[7.8rem]'>
                {loading ? (
                    <Content className='mt-5 !bg-[var(--mp-bright-color)] !p-3 !rounded-md'>
                        <Content className='mt-2 flex justify-between'>
                            <Skeleton
                                paragraph={{
                                    rows: 6,
                                }}
                            />
                        </Content>
                    </Content>
                ) :   storeOveriewError ? (
                    <Content className='text-center !bg-[var(--mp-bright-color)] !p-3  !rounded-md'>
                        {t('messages:dashboard_network_error')}
                    </Content>
                ) : (
                    <Content>
                        <Content
                            hidden={dm4sightEnabled === 'true' ? false : true}
                            className='flex justify-between mt-[65px]'>
                            <Content className='!w-[65%] m-1 bg-[#ffff] p-4  shadow-sm rounded-md justify-center'>
                                <Content className='flex items-center justify-between mb-1'>
                                    <Title level={4} className='!m-0  !text-black flex gap-2'>
                                        <Avatar
                                            shape='square'
                                            className='flex items-center justify-center bg-yellow-500	'
                                            icon={<BarChartOutlined />}
                                        />

                                        {t('labels:store_overview')}
                                    </Title>
                                </Content>
                                <Divider className='w-10' />
                                <Content>
                                    <Table pagination={false} dataSource={tableData} columns={statisticsColumns} />
                                </Content>
                            </Content>
                        </Content>
                    </Content>
                )}
            </Content>
        </Content>
    )
}

export default Newdashboard
