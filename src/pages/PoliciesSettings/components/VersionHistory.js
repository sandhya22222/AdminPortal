import { Button, Tabs, Typography } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckGreen, CopyTextImage } from '../../../constants/media'

function VersionHistory() {
    const { t } = useTranslation()
    const policyStaticData = [
        {
            id: '0',
            policyTitle: 'Terms of Service',
            policyDescription: 'hbdhbdhsbhbf',
            timestamp: '17 March 2024, 13:00',
        },
        {
            id: '1',
            policyTitle: 'Refund of Data',
            policyDescription:
                'BHSBhdbhdbhbhdbhbdhbdhbbbbbsssssssssssssssssssssssssssssssssssssssssssssssssssbdhbhbfhbhbsahdbhbdhasbhdbhbdbhbshabdhdnjsanjdnjdnssssssssssssssssssssssssssssssssssssssssssssssssssbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbb',
            timestamp: '17 March 2024, 13:00',
        },
        {
            id: '2',
            policyTitle: 'My Policy',
            policyDescription: 'dsbhbsdhbfhb',
            timestamp: '17 March 2024, 13:00',
        },
    ]
    const versionData = [
        { id: '0', version: 'V2.0', timestamp: '17 March 2024, 13:00' },
        { id: '1', version: 'V1.5', timestamp: '18 March 2024, 12:00' },
        { id: '2', version: 'V1.8', timestamp: '19 March 2024, 14:00' },
    ]
    const [activeKey, setActiveKey] = useState('0')
    const [policyData, setPolicyData] = useState(policyStaticData[0])
    const [copyMessage, setCopyMessage] = useState(false)

    const handleTabChange = (key) => {
        setActiveKey(key)
        setPolicyData(policyStaticData?.filter((data) => data.id === activeKey)[0])
    }

    return (
        <div className='flex justify-between'>
            <Tabs
                defaultActiveKey={'0'}
                activeKey={activeKey}
                onChange={handleTabChange}
                tabPosition={'left'}
                className='!mb-0'>
                {versionData?.map((data) => (
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
                                    {data?.version}
                                </div>
                                <div>{data?.timestamp}</div>
                            </div>
                        }></Tabs.TabPane>
                ))}
            </Tabs>
            <div>
                <div className='flex items-center justify-between pb-3'>
                    <Typography.Title level={5}>{policyData.policyTitle}</Typography.Title>
                    <div>
                        <img
                            src={copyMessage ? CheckGreen : CopyTextImage}
                            alt='copyText'
                            width={12}
                            height={12}
                            className='cursor-pointer mx-1'
                            onClick={() => {
                                // navigator.clipboard.writeText(record.coupon_code)
                                setCopyMessage(true)
                                setTimeout(() => {
                                    setCopyMessage(false)
                                }, 3000)
                            }}
                        />
                    </div>
                </div>
                <div>
                    <TextArea
                        className='!w-[650px] !h-[450px]'
                        placeholder={'Enter offer description here'}
                        value={policyData.policyDescription}
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
    )
}

export default VersionHistory
