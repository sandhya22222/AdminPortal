import { DownOutlined } from '@ant-design/icons'
import { Button, Dropdown, Space, Tabs } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

function PolicyHistory() {
    const { t } = useTranslation()
    const policyStaticData = [
        {
            id: '0',
            policyTitle: 'Terms of Service',
            policyDescription: 'hbdhbdhsbhbf',
            versionData: [
                {
                    label: 'V2.0',
                    key: 'V2.0',
                },
                {
                    label: 'V1.5',
                    key: 'V1.5',
                },
                {
                    label: 'V2.0',
                    key: 'V2.0',
                },
            ],
        },
        {
            id: '1',
            policyTitle: 'Refund of Data',
            policyDescription:
                'BHSBhdbhdbhbhdbhbdhbdhbbbbbsssssssssssssssssssssssssssssssssssssssssssssssssssbdhbhbfhbhbsahdbhbdhasbhdbhbdbhbshabdhdnjsanjdnjdnssssssssssssssssssssssssssssssssssssssssssssssssssbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbb',
            versionData: [
                {
                    label: 'V2.0',
                    key: 'V2.0',
                },
                {
                    label: 'V1.5',
                    key: 'V1.5',
                },
                {
                    label: 'V2.0',
                    key: 'V2.0',
                },
            ],
        },
        {
            id: '2',
            policyTitle: 'My Policy',
            policyDescription: 'dsbhbsdhbfhb',
            versionData: [
                {
                    label: 'V2.0',
                    key: 'V2.0',
                },
                {
                    label: 'V1.5',
                    key: 'V1.5',
                },
                {
                    label: 'V2.0',
                    key: 'V2.0',
                },
            ],
        },
    ]

    const [activeKey, setActiveKey] = useState('0')
    const [policyData, setPolicyData] = useState(policyStaticData[0])

    const handleTabChange = (key) => {
        setActiveKey(key)
        setPolicyData(policyStaticData?.filter((data) => data.id === activeKey)[0])
    }

    return (
        <div className='flex justify-between pt-4'>
            <Tabs
                defaultActiveKey={'0'}
                activeKey={activeKey}
                onChange={handleTabChange}
                tabPosition={'left'}
                className='!mb-0'>
                {policyStaticData?.map((data) => (
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
                                    {data?.policyTitle}
                                </div>
                            </div>
                        }></Tabs.TabPane>
                ))}
            </Tabs>
            <div>
                <Dropdown
                    className='w-[90px] mb-4'
                    menu={{
                        items: policyData?.versionData,
                    }}>
                    <Space>
                        <span>{policyData?.versionData[0]?.label}</span>
                        <DownOutlined />
                    </Space>
                </Dropdown>
                <div>
                    <TextArea
                        className='!w-[650px] !h-[450px]'
                        placeholder={'Enter offer description here'}
                        value={policyData?.policyDescription}
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

export default PolicyHistory
