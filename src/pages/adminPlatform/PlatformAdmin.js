import React, { useState, useEffect } from 'react'
import { Layout, Col, Input, Skeleton } from 'antd'
import HeaderForTitle from '../../components/header/HeaderForTitle'
import { useTranslation } from 'react-i18next'
import MarketplaceServices from '../../services/axios/MarketplaceServices'
const { Content } = Layout

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
        <Content className=''>
            <HeaderForTitle
                title={
                    <Content>
                        <div className='!font-semibold text-2xl mb-4 text-regal-blue'>{t('labels:platform_admin')}</div>
                    </Content>
                }
            />

            <Content className='bg-white p-3 mx-3 rounded-md shadow-brandShadow !mt-[10.5rem]'>
                {isUsersLoading ? (
                    <Content className='bg-white p-3 !mb-3 !rounded-md '>
                        <Skeleton
                            active
                            paragraph={{
                                rows: 4,
                            }}></Skeleton>
                    </Content>
                ) : isNetworkError ? (
                    <Content className='!text-center  p-3 '>{t('messages:store_network_error')}</Content>
                ) : (
                    <Content className='mx-1'>
                        <label className='font-semibold text-base mb-4'>{t('labels:contact_details')}</label>
                        <Col span={12} className='mb-3 mt-2'>
                            <label className='text-brandGray2 font-normal text-sm mb-2'>{t('labels:email')}</label>
                            <span className='mandatory-symbol-color text-sm text-center ml-1'>*</span>
                            <Input value={userAllAPIData[0]?.email} disabled={true} className={``} />
                        </Col>
                        <Col span={12} className='mb-3'>
                            <label className='text-brandGray2 font-normal text-sm mb-2'>{t('labels:user_name')}</label>
                            <span className='mandatory-symbol-color text-sm text-center ml-1'>*</span>
                            <Input value={userAllAPIData[0]?.username} disabled={true} className={``} />
                        </Col>
                    </Content>
                )}
            </Content>
        </Content>
    )
}

export default PlatformAdmin
