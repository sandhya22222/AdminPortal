import { Button, Skeleton, Tabs, Typography } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckGreen, CopyTextImage } from '../../../constants/media'
import useGetUserConsentVersionDetails from '../hooks/useGetUserConsentVersionDetails'

function VersionHistory({ userConsentId }) {
    const { t } = useTranslation()
    const {
        data: userConsentVersionData,
        status: userConsentVersionStatus,
        isFetched: isUserConsentVersionDetailsFetched,
    } = useGetUserConsentVersionDetails({
        userConsentId,
    })
    const [activeKey, setActiveKey] = useState('0')
    const [userConsentVersionDetails, setUserConsentVersionDetails] = useState([])
    const [versionTabData, setVersionTabData] = useState([])

    // const versionData = [
    //     { id: '0', version: 'V2.0', timestamp: '17 March 2024, 13:00' },
    //     { id: '1', version: 'V1.5', timestamp: '18 March 2024, 12:00' },
    //     { id: '2', version: 'V1.8', timestamp: '19 March 2024, 14:00' },
    // ]

    const handleTabChange = (key) => {
        setActiveKey(key)
        setUserConsentVersionDetails(
            userConsentVersionData?.userconsent_version_details?.filter((data) => String(data.id) === activeKey)[0]
        )
    }

    useEffect(() => {
        let versionData = []
        if (userConsentVersionStatus === 'success' || isUserConsentVersionDetailsFetched) {
            console.log('userConsentVersionData.....', userConsentVersionData)
            userConsentVersionData?.userconsent_version_details?.forEach((data) => {
                versionData.push({
                    id: data.id,
                    version: data.version_number,
                })
            })
            setVersionTabData(versionData)
            setUserConsentVersionDetails(userConsentVersionData?.userconsent_version_details?.[0])
            setActiveKey(String(userConsentVersionData?.userconsent_version_details?.[0]?.id))
        }
    }, [userConsentVersionData, userConsentVersionStatus, isUserConsentVersionDetailsFetched])

    return (
        <div>
            <div className=' mt-3'>
                <Skeleton loading={userConsentVersionStatus === 'pending'} active />
            </div>
            {userConsentVersionStatus === 'success' && (
                <div className='flex justify-between'>
                    <Tabs
                        defaultActiveKey={'0'}
                        activeKey={activeKey}
                        onChange={handleTabChange}
                        tabPosition={'left'}
                        className='!mb-0'>
                        {versionTabData?.map((data) => (
                            <Tabs.TabPane
                                key={data?.id}
                                tab={
                                    <div className='flex flex-col items-start'>
                                        <div
                                            style={{
                                                maxWidth: '100px',
                                                display: 'inline-block',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}>
                                            {data?.version === 1 ? 'V1.0' : 'V' + data?.version}
                                        </div>
                                        <div>{'17 March 2024, 13:00'}</div>
                                    </div>
                                }></Tabs.TabPane>
                        ))}
                    </Tabs>
                    <div>
                        <div className='flex items-center justify-between pb-3'>
                            <Typography.Title level={5}>{userConsentVersionDetails?.consent_name}</Typography.Title>
                        </div>
                        <div>
                            <TextArea
                                className='!w-[650px] !h-[450px]'
                                placeholder={'Enter offer description here'}
                                value={userConsentVersionDetails?.consent_discription}
                            />
                            <p className='py-2 text-[#000000] text-opacity-50'>{t('labels:last_updated')}</p>
                            <div className='mt-4 flex justify-end'>
                                <Button className='app-btn-primary' onClick={''}>
                                    {t('labels:create_new_version')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default VersionHistory
