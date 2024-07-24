import React, { useEffect, useState } from 'react'
import { Layout, Input, Col, Skeleton } from 'antd'
import util from '../../util/common'
import { useTranslation } from 'react-i18next'
import MarketplaceServices from '../../services/axios/MarketplaceServices'
const { Content } = Layout

const usersAllAPI = process.env.REACT_APP_USERS_ALL_API

const StoreOverview = ({ realmName }) => {
    const { t } = useTranslation()
    const [userAllAPIData, setUserAllAPIData] = useState([])
    const [isUsersLoading, setIsUsersLoading] = useState(false)
    const [isNetworkError, setIsNetworkError] = useState(false)

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
                    <label className='text-lg  font-semibold mb-4  text-regal-blue'>{t('labels:overview')}</label>
                    <Content>
                        <Col span={8} className='mb-3'>
                            <label className='text-brandGray2 font-normal text-sm mb-2'>{t('labels:store_name')}</label>
                            <span className='mandatory-symbol-color text-sm text-center ml-1'>*</span>
                            <Input value={realmName} disabled={true} className={``} />
                        </Col>
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
                                                ? '!mr-28'
                                                : '!ml-28'
                                        }>
                                        :
                                    </span>
                                </p>
                                <p className='text-brandGray1  my-3 flex'>
                                    {t('labels:store_management_portal_url')}
                                    <span
                                        className={
                                            util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL'
                                                ? 'mr-6'
                                                : 'ml-6'
                                        }>
                                        :
                                    </span>
                                </p>
                            </div>
                            <div
                                className={`${
                                    util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL'
                                        ? 'w-[68%] !inline-block '
                                        : ' w-[68%] !inline-block '
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
                </>
            )}
        </Content>
    )
}

export default StoreOverview
