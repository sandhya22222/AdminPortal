import { Typography, Layout } from 'antd'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import HeaderForTitle from '../../components/header/HeaderForTitle'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../shadcnComponents/ui/tabs'

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
        <>
            <HeaderForTitle
                title={
                    <Content className=''>
                        <Title level={3} className='!font-semibold !text-regal-blue text-2xl'>
                            {t('labels:profile')}
                        </Title>
                    </Content>
                }
                headerContent={<Content className=' !pt-14 text-brandGray1'>{t('messages:profile_note')}</Content>}
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

                        <Tabs
                            defaultActiveKey='profile'
                            activeKey={searchParams.get('tab') || USER_PROFILE_TABS_OPTIONS.PROFILE_INFORMATION}
                            onTabClick={handelMyProfileTabChange}
                            orientation='vertical'
                            className='h-full'>
                            <TabsList orientation='vertical'>
                                {myProfileTabData.map((tab) => (
                                    <TabsTrigger key={tab.key} value={tab.key} borderPosition='right'>
                                        {tab.label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                            {myProfileTabData.map((tab) => (
                                <TabsContent key={tab.key} value={tab.key}>
                                    {tab.content}
                                </TabsContent>
                            ))}
                        </Tabs>
                    </div>
                    <div className=' w-full '>
                        {searchParams.get('tab') === USER_PROFILE_TABS_OPTIONS.PROFILE_INFORMATION && <UserProfile />}
                        {searchParams.get('tab') === USER_PROFILE_TABS_OPTIONS.POLICIES && (
                            <ListPolicies searchParams={searchParams} setSearchParams={setSearchParams} />
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
export default MyProfile
