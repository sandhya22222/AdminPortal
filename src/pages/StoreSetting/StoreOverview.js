import React, { useEffect, useState } from 'react'
import { Layout, Input, Col, Skeleton, Button, Segmented, Spin } from 'antd'
import util from '../../util/common'

import MarketplaceServices from '../../services/axios/MarketplaceServices'
import MarketplaceToaster from '../../util/marketplaceToaster'
import { useTranslation } from 'react-i18next'
import { useLocation, useSearchParams } from 'react-router-dom'
const { Content } = Layout

const usersAllAPI = process.env.REACT_APP_USERS_ALL_API

const updateStoreDistributorAPI = process.env.REACT_APP_UPDATE_STORE_DISTRIBUTOR
const domainName = process.env.REACT_APP_DOMAIN_NAME

const StoreOverview = ({ realmName }) => {
    const { t } = useTranslation()
    const location = useLocation()
    const search = useLocation().search
    const storeUuid = new URLSearchParams(search).get('id')
    const storeTypeFromURL = new URLSearchParams(search).get('storeType')
    const isDistributor = new URLSearchParams(search).get('isDistributor')

    const [searchParams, setSearchParams] = useSearchParams()
    const [userAllAPIData, setUserAllAPIData] = useState([])
    const [isUsersLoading, setIsUsersLoading] = useState(false)
    const [isNetworkError, setIsNetworkError] = useState(false)
    const [storeType, setStoreType] = useState(storeTypeFromURL)
    const [isStoreTypeLoading, setIsStoreTypeLoading] = useState(false)

    //! get call of user all API
    const findAllUserAllAPI = () => {
        setIsUsersLoading(true)
        MarketplaceServices.findAll(usersAllAPI, { realmname: realmName, is_default_owner: true })
            .then(function (response) {
                console.log('Success Response for userALL API', response?.data?.response_body)
                setUserAllAPIData(response?.data?.response_body?.users)
                setIsUsersLoading(false)
                setIsNetworkError(false)
            })
            .catch(function (error) {
                setIsUsersLoading(false)
                setIsNetworkError(true)
                console.log('error response for user all API', error)
            })
    }
    const updateQueryParam = (key, value) => {
        searchParams.set(key, value)
        setSearchParams(searchParams)
    }

    const updateStoreCurrencyApi = () => {
        setIsStoreTypeLoading(true)
        MarketplaceServices.update(
            updateStoreDistributorAPI,
            {
                distributor_store: true,
            },
            { store_id: storeUuid }
        )
            .then((response) => {
                setIsStoreTypeLoading(false)
                MarketplaceToaster.showToast(response)
                setStoreType('distributor')
                updateQueryParam('isDistributor', true)
            })
            .catch((error) => {
                setIsStoreTypeLoading(false)
                MarketplaceToaster.showToast(error.response)
            })
    }

    const handleStoreTypeChange = (val) => {
        setStoreType(val)
    }

    console.log('userAllAPIData', userAllAPIData, realmName)
    useEffect(() => {
        findAllUserAllAPI()
    }, [])

    return (
        <Content className='bg-white p-3 my-2'>
            {isUsersLoading ? (
                <Content className='bg-white p-3 !rounded-md mt-[2.0rem]'>
                    <Skeleton
                        active
                        paragraph={{
                            rows: 6,
                        }}></Skeleton>
                </Content>
            ) : isNetworkError ? (
                <Content className='!text-center  p-3 '>{t('messages:store_network_error')}</Content>
            ) : (
                <>
                    <Spin
                        tip={t('labels:please_wait')}
                        size='large'
                        // spinning={action === "edit" && isLoadingProductTemplatesById}
                        spinning={isStoreTypeLoading}>
                        <label className='text-lg  font-semibold mb-4  text-regal-blue'>{t('labels:overview')}</label>
                        <Content>
                            <Col span={10} className='mb-3'>
                                <label className='text-brandGray2 font-normal text-sm mb-2'>
                                    {t('labels:store_domain_name')}
                                </label>
                                <span className='mandatory-symbol-color text-sm text-center ml-1'>*</span>
                                <div className='flex'>
                                    <Input value={realmName} disabled={true} className={``} />
                                    <span className='mx-3 mt-1 text-brandGray2'>{domainName}</span>
                                </div>
                            </Col>
                            <div className='flex'>
                                <label
                                    className='text-[14px] leading-[22px] font-normal text-brandGray2 mb-2 ml-1 '
                                    id='labStNam'>
                                    {t('labels:store_type')}
                                </label>
                                <span className='mandatory-symbol-color text-sm text-center ml-1'>*</span>
                            </div>
                            <Segmented
                                options={[
                                    {
                                        value: 'partner',
                                        label: t('labels:partner'),
                                    },
                                    {
                                        value: 'distributor',
                                        label: t('labels:distributor'),
                                    },
                                ]}
                                block={true}
                                className='w-[30%] custom-segmented'
                                value={storeType}
                                onChange={(value) => {
                                    handleStoreTypeChange(value)
                                }}
                                disabled={isDistributor === 'true'}
                            />
                            <div className='w-[100%] !flex-col !gap-2 !justify-start'>
                                <div
                                    className={`justify-items-start  !inline-block  !w-[30%] ${
                                        util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL'
                                            ? 'text-left ml-2'
                                            : 'text-right mr-2 '
                                    }`}>
                                    <p className='text-brandGray1  my-3 flex'>
                                        {t('labels:store_front_url')}
                                        <span
                                            className={
                                                util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL'
                                                    ? '!mr-[108px]'
                                                    : '!ml-[108px]'
                                            }>
                                            :
                                        </span>
                                    </p>
                                    <p className='text-brandGray1  my-3 flex'>
                                        {t('labels:store_management_portal_url')}
                                        <span
                                            className={
                                                util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL'
                                                    ? 'mr-3'
                                                    : 'ml-3'
                                            }>
                                            :
                                        </span>
                                    </p>
                                </div>
                                <div
                                    className={`${
                                        util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL'
                                            ? 'w-[67%] !inline-block '
                                            : ' w-[67%] !inline-block '
                                    }`}>
                                    <p className='!font-semibold my-3'>
                                        {userAllAPIData[0]?.store_front_url !== null ? (
                                            <a
                                                className='cursor-pointer text-brandPrimaryColor no-underline'
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                href={userAllAPIData[0]?.store_front_url}>
                                                {userAllAPIData[0]?.store_front_url}
                                            </a>
                                        ) : (
                                            `${t('labels:not_available')}`
                                        )}
                                    </p>
                                    <p className='!font-semibold my-3'>
                                        {userAllAPIData[0]?.store_redirect_url !== null ? (
                                            <a
                                                className='cursor-pointer text-brandPrimaryColor no-underline'
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                href={userAllAPIData[0]?.store_redirect_url}>
                                                {userAllAPIData[0]?.store_redirect_url}
                                            </a>
                                        ) : (
                                            `${t('labels:not_available')}`
                                        )}
                                    </p>
                                </div>
                            </div>
                            <label className='my-2 text-regal-blue font-bold text-base'>
                                {t('labels:store_administrator_details')}
                            </label>
                            <Col span={12} className='mb-3 mt-2'>
                                <label className='text-brandGray2 font-normal text-sm mb-2'>{t('labels:email')}</label>
                                <span className='mandatory-symbol-color text-sm text-center ml-1'>*</span>
                                <Input value={userAllAPIData[0]?.email} disabled={true} className={``} />
                            </Col>
                            <Col span={12} className='mb-3'>
                                <label className='text-brandGray2 font-normal text-sm mb-2'>
                                    {t('labels:store_user_name')}
                                </label>
                                <span className='mandatory-symbol-color text-sm text-center ml-1'>*</span>
                                <Input value={userAllAPIData[0]?.username} disabled={true} className={``} />
                            </Col>
                        </Content>
                        {isDistributor === 'false' && (
                            <div className='flex space-x-3 !justify-start !pt-3'>
                                <Button
                                    className={'app-btn-primary'}
                                    disabled={storeTypeFromURL === storeType}
                                    onClick={() => {
                                        updateStoreCurrencyApi()
                                    }}>
                                    {t('labels:save')}
                                </Button>
                                <Button
                                    className={'app-btn-secondary'}
                                    disabled={storeTypeFromURL === storeType}
                                    onClick={() => {
                                        setStoreType(storeTypeFromURL)
                                    }}>
                                    {t('labels:discard')}
                                </Button>
                            </div>
                        )}
                    </Spin>
                </>
            )}
        </Content>
    )
}

export default StoreOverview
