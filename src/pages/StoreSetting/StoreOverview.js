import React, { useEffect, useState } from 'react'
import util from '../../util/common'
import API_ENDPOINTS from '../../services/API/apis'

import MarketplaceServices from '../../services/axios/MarketplaceServices'
import MarketplaceToaster from '../../util/marketplaceToaster'
import { useTranslation } from 'react-i18next'
import { useLocation, useSearchParams } from 'react-router-dom'
import { Input } from '../../shadcnComponents/ui/input'
import { Skeleton } from '../../shadcnComponents/ui/skeleton'
import { Button } from '../../shadcnComponents/ui/button'
import Spin from '../../shadcnComponents/customComponents/Spin'
import { Toggle } from '../../shadcnComponents/ui/toggle'

const usersAllAPI = API_ENDPOINTS.REACT_APP_USERS_ALL_API
const updateStoreDistributorAPI = API_ENDPOINTS.REACT_APP_UPDATE_STORE_DISTRIBUTOR
const domainName = process.env.REACT_APP_DOMAIN_NAME

const StoreOverview = ({ realmName, isDistributorStorePresent }) => {
    const { t } = useTranslation()
    const search = useLocation().search
    const storeUuid = new URLSearchParams(search).get('id')
    const storeTypeFromURL = new URLSearchParams(search).get('storeType')
    const isDistributor = new URLSearchParams(search).get('isDistributor') === 'false' ? false : true

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
        console.log('value', val)
        setStoreType(val)
    }

    useEffect(() => {
        findAllUserAllAPI()
    }, [])

    return (
        <div className='bg-white p-3 my-4 !rounded-md border'>
            {isUsersLoading || isStoreTypeLoading ? (
                <div className='bg-white p-3 !rounded-md !space-y-5'>
                    <Skeleton className={'h-4 w-[350px] '} />
                    <Skeleton className={'h-4 w-[350px] '} />
                    <Skeleton className={'h-4 w-[350px] '} />
                    <Skeleton className={'h-4 w-[350px] '} />
                    <Skeleton className={'h-4 w-[350px] '} />
                    <Skeleton className={'h-4 w-[300px] '} />
                </div>
            ) : isNetworkError ? (
                <div className='!text-center  p-3 '>{t('messages:store_network_error')}</div>
            ) : isStoreTypeLoading ? (
                <Spin />
            ) : (
                <>
                    <label className='text-lg  font-semibold text-regal-blue !mb-6'>{t('labels:overview')}</label>
                    <div className=''>
                        <div className='mb-3 w-[500px]'>
                            <label className='text-brandGray2 font-normal text-sm !mb-2'>
                                {t('labels:store_domain_name')}
                            </label>
                            <span className='mandatory-symbol-color text-sm text-center ml-1'>*</span>
                            <div className='flex mt-2'>
                                <Input value={realmName} disabled={true} className={``} />
                                <span className='mx-3 text-brandGray2'>{domainName}</span>
                            </div>
                        </div>
                        <div className='flex'>
                            <label
                                className='text-[14px] leading-[22px] font-normal text-brandGray2 mb-2 ml-1 '
                                id='labStNam'>
                                {t('labels:store_type')}
                            </label>
                            <span className='mandatory-symbol-color text-sm text-center ml-1'>*</span>
                        </div>
                        <div className='flex bg-gray-200 p-1 rounded-md w-max'>
                            <Toggle
                                pressed={storeType === 'partner'}
                                onPressedChange={() => handleStoreTypeChange('partner')}
                                className={`font-semibold b-0 text-gray-800 hover:text-gray-800 ${isDistributor || isDistributorStorePresent ? 'opacity-50 cursor-not-allowed' : ''} ${storeType === 'partner' && 'bg-white text-black hover:text-black font-bold'} transition-all`}
                                disabled={isDistributor || isDistributorStorePresent}>
                                {t('labels:partner')}
                            </Toggle>
                            <Toggle
                                pressed={storeType === 'distributor'}
                                onPressedChange={() => handleStoreTypeChange('distributor')}
                                className={`font-semibold b-0 text-gray-800 hover:text-gray-800 ${storeType === 'distributor' && 'bg-white text-black hover:text-black font-bold'} ${isDistributor || isDistributorStorePresent ? 'opacity-50 cursor-not-allowed' : ''} transition-all`}
                                disabled={isDistributor || isDistributorStorePresent}>
                                {t('labels:distributor')}
                            </Toggle>
                        </div>

                        <div className='w-full flex flex-row  justify-start'>
                            <div
                                className={`inline-block w-[35%] ${
                                    util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL'
                                        ? 'text-left ml-2'
                                        : 'text-right mr-2'
                                }`}>
                                <label className='text-brandGray1 my-3 flex'>
                                    {t('labels:store_front_url')}
                                    <span
                                        className={
                                            util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL'
                                                ? 'mr-[108px]'
                                                : 'ml-[120px]'
                                        }>
                                        :
                                    </span>
                                </label>
                                <label className='text-brandGray1 my-3 flex'>
                                    {t('labels:store_management_portal_url')}
                                    <span
                                        className={
                                            util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL'
                                                ? 'mr-3'
                                                : 'ml-1'
                                        }>
                                        :
                                    </span>
                                </label>
                            </div>

                            <div className={` w-[62%]`}>
                                <div className='font-semibold my-3'>
                                    {userAllAPIData[0]?.store_front_url ? (
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
                                </div>
                                <div className='font-semibold my-3'>
                                    {userAllAPIData[0]?.store_redirect_url ? (
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
                                </div>
                            </div>
                        </div>

                        <label className='my-2 text-regal-blue font-bold text-base'>
                            {t('labels:store_administrator_details')}
                        </label>
                        <div className='mb-3 mt-2 w-[360px]'>
                            <label className='text-brandGray2 font-normal text-sm !mb-2'>{t('labels:email')}</label>
                            <span className='mandatory-symbol-color text-sm text-center ml-1'>*</span>
                            <Input value={userAllAPIData[0]?.email} disabled={true} className={``} />
                        </div>
                        <div className='mb-3 w-[360px]'>
                            <label className='text-brandGray2 font-normal text-sm mb-2'>
                                {t('labels:store_user_name')}
                            </label>
                            <span className='mandatory-symbol-color text-sm text-center ml-1'>*</span>
                            <Input value={userAllAPIData[0]?.username} disabled={true} className={``} />
                        </div>
                    </div>
                    {!isDistributor && (
                        <div className='flex space-x-3 !justify-start !pt-3'>
                            <Button
                                disabled={storeTypeFromURL === storeType}
                                onClick={() => {
                                    updateStoreCurrencyApi()
                                }}>
                                {t('labels:save')}
                            </Button>
                            <Button
                                variant='outline'
                                disabled={storeTypeFromURL === storeType}
                                onClick={() => {
                                    setStoreType(storeTypeFromURL)
                                }}>
                                {t('labels:discard')}
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default StoreOverview
