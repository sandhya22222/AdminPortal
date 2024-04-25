import { Empty, Layout, Skeleton, Tabs, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useGetStoreAdminConsent from '../../hooks/useGetStoreAdminConsent'
import useGetStoreAdminConsentDescription from '../../hooks/useGetStoreAdminConsentDescription'
import util from '../../util/common'
import DisplayPolicy from './DisplayPolicy'
const { Content } = Layout
const { Text } = Typography
const ListPolicies = ({ searchParams, setSearchParams }) => {
    const { t } = useTranslation()
    const [policiesTab, setPoliciesTab] = useState([])

    const { data: storeAdminConsent, status: storeAdminStatus } = useGetStoreAdminConsent()
    const {
        data: consentDescription,
        status: consentDescriptionStatus,
        isLoading,
    } = useGetStoreAdminConsentDescription({
        adminConsentId: searchParams.get('subtab') || policiesTab?.[0]?.key,
    })
    useEffect(() => {
        if (searchParams.get('subtab')) window.scrollTo(0, 0)
    }, [searchParams])

    useEffect(() => {
        if (storeAdminStatus === 'success') {
            const tempTabData = []
            storeAdminConsent?.forEach((consent) => {
                if (consent?.version_details?.consent_display_name) {
                    tempTabData.push({
                        key: String(consent?.id),
                        label: (
                            <div className=' max-w-[150px]'>
                                <Text
                                    ellipsis={{
                                        tooltip: {
                                            title: consent?.version_details?.consent_display_name,
                                            mouseLeaveDelay: 0,
                                            mouseEnterDelay: 0.5,
                                        },
                                    }}
                                    className=' font-medium  !text-base '>
                                    {consent?.version_details?.consent_display_name}
                                </Text>
                            </div>
                        ),
                        value: consent?.name,
                    })
                }
            })
            if (tempTabData?.length > 0) setPoliciesTab(tempTabData)
        }
    }, [storeAdminConsent, storeAdminStatus])

    const handelPoliciesTabChange = (tabKey) => {
        setSearchParams({
            tab: searchParams.get('tab'),
            subtab: tabKey,
        })
    }
    return (
        <Content className='overflow-hidden w-full  h-full'>
            <div
                className={`${
                    util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? 'mr-4' : ''
                } !text-xl !font-medium !pt-4`}>
                {t('labels:policies')}
            </div>
            {storeAdminStatus === 'pending' && (
                <Skeleton
                    active
                    paragraph={{
                        rows: 6,
                    }}
                    className='p-3 w-full'></Skeleton>
            )}
            {storeAdminStatus === 'success' && (
                <>
                    {policiesTab?.length > 0 && (
                        <div className=' h-full flex w-full'>
                          <div className='w-[80%]'>
                            {isLoading ? (
                                <div className='p-3 !rounded-md '>
                                    <Skeleton
                                        active
                                        paragraph={{
                                            rows: 4,
                                        }}></Skeleton>
                                </div>
                            ) : (
                                <>
                                    {consentDescriptionStatus === 'success' && (
                                        <div className='h-full   overflow-y-auto  mt-3'>
                                            <DisplayPolicy policy={consentDescription?.[0].version_details} />
                                        </div>
                                    )}
                                </>
                            )}
                            </div>
                            <div className='!mt-0 '>
                            <Tabs
                                items={policiesTab}
                                tabPosition={'right'}
                                activeKey={searchParams.get('subtab') || String(policiesTab?.[0].key)}
                                onTabClick={handelPoliciesTabChange}
                                type='line'
                                className=''
                            />
                            </div>
                        </div>
                    )}
                    {policiesTab?.length === 0 && (
                        <div className='  flex justify-center pt-20'>
                            <Empty description={t('messages:no_policies_available')} />
                        </div>
                    )}
                </>
            )}
            {storeAdminStatus === 'error' && (
                <p className=' !text-black !text-opacity-80 pt-5 text-center'>{t('messages:network_error')}</p>
            )}
        </Content>
    )
}
export default ListPolicies
