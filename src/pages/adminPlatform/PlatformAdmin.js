import React, { useState, useEffect } from 'react'
import HeaderForTitle from '../../components/header/HeaderForTitle'
import { useTranslation } from 'react-i18next'
import MarketplaceServices from '../../services/axios/MarketplaceServices'
import { Input } from '../../shadcnComponents/ui/input'
import { Skeleton } from '../../shadcnComponents/ui/skeleton'

const usersAllAPI = process.env.REACT_APP_USERS_ALL_API

const PlatformAdmin = () => {
    const { t } = useTranslation()

    const [userAllAPIData, setUserAllAPIData] = useState([])
    const [isUsersLoading, setIsUsersLoading] = useState(false)
    const [isNetworkError, setIsNetworkError] = useState(false)

    //! get call of user all API
    const findAllUserAllAPI = () => {
        setIsUsersLoading(true)
        MarketplaceServices.findAll(usersAllAPI, { is_default_owner: true })
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

    useEffect(() => {
        findAllUserAllAPI()
    }, [])

    return (
        <div className=''>
            <HeaderForTitle
                title={
                    <div>
                        <div className='!font-semibold text-2xl mb-4 text-regal-blue'>{t('labels:platform_admin')}</div>
                    </div>
                }
            />

            <div className='bg-white p-3 mx-3 rounded-md shadow-brandShadow !mt-[10.5rem]'>
                {isUsersLoading ? (
                    <div className='bg-white p-3 !mb-3 !rounded-md space-y-4 w-96'>
                        <Skeleton className={'h-4'} />
                        <Skeleton className={'h-4'} />
                        <Skeleton className={'h-4'} />
                        <Skeleton className={'h-4'} />
                        <Skeleton className={'h-4'} />
                    </div>
                ) : isNetworkError ? (
                    <div className='!text-center  p-3 '>{t('messages:store_network_error')}</div>
                ) : (
                    <div className='mx-1'>
                        <label className='font-semibold text-base mb-4'>{t('labels:contact_details')}</label>
                        <div className='mb-3 mt-2 w-96'>
                            <label className='text-brandGray2 font-normal text-sm'>{t('labels:email')}</label>
                            <span className='mandatory-symbol-color text-sm text-center ml-1'>*</span>
                            <Input value={userAllAPIData[0]?.email} disabled={true} className={``} />
                        </div>
                        <div className='mb-3 w-96'>
                            <label className='text-brandGray2 font-normal text-sm'>{t('labels:user_name')}</label>
                            <span className='mandatory-symbol-color text-sm text-center ml-1'>*</span>
                            <Input value={userAllAPIData[0]?.username} disabled={true} className={``} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PlatformAdmin
