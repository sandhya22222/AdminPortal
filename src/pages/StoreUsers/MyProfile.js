import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import HeaderForTitle from '../../components/header/HeaderForTitle'
import { ShadCNTabs, ShadCNTabsContent, ShadCNTabsTrigger } from '../../shadcnComponents/customComponents/ShadCNTabs'

import ListPolicies from './ListPolicies'
import UserProfile from './UserProfile'
import LoginSessions from '../LoginSessions/LoginSessions'

const USER_PROFILE_TABS_OPTIONS = {
    PROFILE_INFORMATION: 'profile_information',
    POLICIES: 'policies',
    LOGIN_SESSIONS: 'login_sessions',
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
        {
            key: USER_PROFILE_TABS_OPTIONS.LOGIN_SESSIONS,
            label: `${t('profile:logged_in_devices')}`,
            value: 2,
        },
    ]
    const handelMyProfileTabChange = (tabKey) => {
        setSearchParams({
            tab: tabKey,
        })
    }
    return (
        <>
            <HeaderForTitle
                title={
                    <div className=''>
                        <label className='!font-semibold !text-regal-blue text-2xl'>{t('labels:profile')}</label>
                    </div>
                }
                headerContent={<div className=' !pt-14 text-brandGray1'>{t('messages:profile_note')}</div>}
            />
            <div className='!px-6 !pb-6 !mt-6'>
                <div className=' w-full bg-white rounded flex  justify-start shadow-brandShadow'>
                    <div className='py-4 h-full top-[110px] sticky !w-[17%] '>
                        {/* <Tabs
                            items={myProfileTabData}
                            tabPosition={'left'}
                            defaultActiveKey={USER_PROFILE_TABS_OPTIONS.PROFILE_INFORMATION}
                            activeKey={searchParams.get('tab') || USER_PROFILE_TABS_OPTIONS.PROFILE_INFORMATION}
                            onTabClick={handelMyProfileTabChange}
                            type='line'
                            className=' !h-full'
                        /> */}

                        <ShadCNTabs
                            value={searchParams.get('tab') || USER_PROFILE_TABS_OPTIONS.PROFILE_INFORMATION}
                            onValueChange={handelMyProfileTabChange}
                            className='h-full'
                            orientation='vertical'>
                            <div className='flex flex-col !h-full space-y-3'>
                                {myProfileTabData.map((tab) => (
                                    <ShadCNTabsTrigger key={tab.key} value={tab.key} borderPosition='right'>
                                        {tab.label}
                                    </ShadCNTabsTrigger>
                                ))}
                            </div>

                            {/* Content Area */}
                            <div>
                                {myProfileTabData.map((tab) => (
                                    <ShadCNTabsContent key={tab.key} value={tab.key}>
                                        {tab.content}
                                    </ShadCNTabsContent>
                                ))}
                            </div>
                        </ShadCNTabs>
                    </div>
                    <div className=' w-full '>
                        {searchParams.get('tab') === USER_PROFILE_TABS_OPTIONS.PROFILE_INFORMATION && <UserProfile />}
                        {searchParams.get('tab') === USER_PROFILE_TABS_OPTIONS.POLICIES && (
                            <ListPolicies searchParams={searchParams} setSearchParams={setSearchParams} />
                        )}
                        {searchParams.get('tab') === USER_PROFILE_TABS_OPTIONS.LOGIN_SESSIONS && <LoginSessions />}
                    </div>
                </div>
            </div>
        </>
    )
}
export default MyProfile
