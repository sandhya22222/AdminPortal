import { Button, Skeleton, Tabs, Typography } from 'antd'
import moment from 'moment/moment'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactQuill from 'react-quill'
import StoreModal from '../../../components/storeModal/StoreModal'
import useGetUserConsentVersionDetails from '../hooks/useGetUserConsentVersionDetails'
import AddVersion from './AddVersion'
import '../policiesSettings.css'

function VersionHistory({ userConsentId, refetchUserConsent, setVersionHistory }) {
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
    const [addVersion, setAddVersion] = useState(false)

    const getDate = (date) => {
        try {
            const formattedDate = moment(date).format('D MMM YYYY')
            return formattedDate
        } catch (error) {
            return ''
        }
    }

    const handleTabChange = (key) => {
        setActiveKey(key)
        setUserConsentVersionDetails(
            userConsentVersionData?.userconsent_version_details?.filter((data) => String(data.id) === key)[0]
        )
    }

    useEffect(() => {
        let versionData = []
        if (userConsentVersionStatus === 'success' || isUserConsentVersionDetailsFetched) {
            console.log('userConsentVersionData.....', userConsentVersionData)
            userConsentVersionData?.userconsent_version_details
                ?.sort((a, b) => b.id - a.id)
                ?.forEach((data) => {
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
            <div className='px-3 pt-2'>
                <Skeleton loading={userConsentVersionStatus === 'pending'} active />
            </div>
            {userConsentVersionStatus === 'success' && (
                <div className='flex justify-between pt-1 pl-2 pr-6 pb-4'>
                    <div className='h-[530px] w-[200px] overflow-y-auto overflow-x-hidden'>
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
                                            <div>{getDate(userConsentVersionDetails?.created_on)}</div>
                                        </div>
                                    }></Tabs.TabPane>
                            ))}
                        </Tabs>
                    </div>
                    <div>
                        <div className='flex items-center justify-between pb-3'>
                            <Typography.Title level={5}>{userConsentVersionDetails?.consent_name}</Typography.Title>
                        </div>
                        <div>
                            <div className='!w-[700px] '>
                                <ReactQuill
                                    value={userConsentVersionDetails?.consent_discription}
                                    modules={{ toolbar: false }}
                                    readOnly={true}
                                    style={{ width: '100%', height: '400px' }}
                                />
                            </div>
                            <p className='py-2 text-[#000000] text-opacity-50'>
                                {t('labels:last_updated') + ': ' + getDate(userConsentVersionDetails?.updated_on)}
                            </p>
                            <div className='mt-4 flex justify-end'>
                                <Button className='app-btn-primary' onClick={() => setAddVersion(true)}>
                                    {t('labels:create_new_version')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <StoreModal
                isVisible={addVersion}
                title={t('labels:add_version')}
                isSpin={false}
                cancelCallback={() => setAddVersion(false)}
                width={400}
                destroyOnClose={true}>
                <AddVersion
                    versionNumber={userConsentVersionDetails?.version_number}
                    storeId={userConsentVersionDetails?.store_id}
                    consentId={userConsentId}
                    refetchUserConsent={refetchUserConsent}
                    setAddVersion={setAddVersion}
                    setVersionHistory={setVersionHistory}
                    versionId={userConsentVersionDetails?.id}
                    versionfrom={true}></AddVersion>
            </StoreModal>
        </div>
    )
}

export default VersionHistory
