import { Tabs, Typography, Layout } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import HeaderForTitle from '../../components/header/HeaderForTitle'

import ListPolicies from './ListPolicies'
import UserProfile from './UserProfile'

const { Title } = Typography
const { Content } = Layout

const USER_PROFILE_TABS_OPTIONS = {
    PROFILE_INFORMATION: 'profile_information',
    POLICIES: 'policies',
}

const MyProfile = () => {
    const { t } = useTranslation()
    const [searchParams, setSearchParams] = useSearchParams()
    useEffect(() => {
        if (!searchParams.get('tab')) {
            setSearchParams({
                tab: USER_PROFILE_TABS_OPTIONS.PROFILE_INFORMATION,
            })
        }
    }, [searchParams, setSearchParams])

    const myProfileTabData = [
        {
            key: USER_PROFILE_TABS_OPTIONS.PROFILE_INFORMATION,
            label: `${t('labels:profile_information')}`,
            value: 0,
        },
        {
            key: USER_PROFILE_TABS_OPTIONS.POLICIES,
            label: `${t('labels:policies')}`,
            value: 1,
        },
    ]
    const handelMyProfileTabChange = (tabKey) => {
        setSearchParams({
            tab: tabKey,
        })
    }
    return (
        <div>
            <HeaderForTitle
                title={
                    <Content className=''>
                        <Title level={3} className='!font-normal'>
                            {t('labels:profile')}
                        </Title>
                    </Content>
                }
            />
            <div className='px-6 pb-6 pt-24 mt-10'>
                <div className=' w-full bg-white rounded shadow-sm h-screen flex  justify-start'>
                    <div className=' py-4 h-full'>
                        <Tabs
                            items={myProfileTabData}
                            tabPosition={'left'}
                            defaultActiveKey={USER_PROFILE_TABS_OPTIONS.PROFILE_INFORMATION}
                            activeKey={searchParams.get('tab') || USER_PROFILE_TABS_OPTIONS.PROFILE_INFORMATION}
                            onTabClick={handelMyProfileTabChange}
                            type='line'
                            className=' !h-full'
                        />
                    </div>
                    <div className=' w-[80%]'>
                        {searchParams.get('tab') === USER_PROFILE_TABS_OPTIONS.PROFILE_INFORMATION && <UserProfile />}
                        {searchParams.get('tab') === USER_PROFILE_TABS_OPTIONS.POLICIES && (
                            <ListPolicies searchParams={searchParams} setSearchParams={setSearchParams} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default MyProfile
