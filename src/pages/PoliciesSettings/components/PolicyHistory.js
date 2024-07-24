import { DownOutlined } from '@ant-design/icons'
import { Dropdown, Skeleton, Space, Tabs, Typography } from 'antd'
import moment from 'moment/moment'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import useGetPolicyHistory from '../hooks/useGetPolicyHistory'
import ReactQuill from 'react-quill'

const { Text } = Typography

function PolicyHistory() {
    const { t } = useTranslation()
    const [searchParams, setSearchParams] = useSearchParams()
    const storeUUID = searchParams.get('id')

    const { policiesWithoutContactInformation, versionDetails } = useGetPolicyHistory({
        storeId: storeUUID,
    })

    const [activeKey, setActiveKey] = useState('0')
    const [policyData, setPolicyData] = useState([])
    const [selectedPolicyData, setSelectedPolicyData] = useState()
    const [policyDescription, setPolicyDescription] = useState('')
    const [dropDownLabel, setDropDownLabel] = useState('')
    const [policyUpdatedOn, setPolicyUpdatedOn] = useState('')

    const getDate = (date) => {
        try {
            const formattedDate = moment(date).format('D MMM YYYY h:mm:ss')
            return formattedDate
        } catch (error) {
            return ''
        }
    }

    const processPolicyHistoryData = () => {
        let processedPolicy = []
        policiesWithoutContactInformation.forEach((policyData) => {
            let obj = {
                id: String(policyData.id),
                policyTitle: policyData.consent_display_name,
            }
            versionDetails.forEach((versionData) => {
                if (policyData.user_consent_id === versionData.consent_id) {
                    obj['versionDataForDropdown'] = versionData.data?.map((versionDetails) => {
                        return {
                            label: versionDetails.version_number === 1 ? 'V1.0' : 'V' + versionDetails.version_number,
                            key: versionDetails.version_number,
                        }
                    })
                    obj['versionDetails'] = versionData.data
                }
            })
            processedPolicy.push(obj)
        })
        return processedPolicy
    }

    useEffect(() => {
        if (policiesWithoutContactInformation.length > 0 && versionDetails.length > 0) {
            console.log('hbdhbd', policiesWithoutContactInformation, versionDetails, processPolicyHistoryData())
            let processedData = processPolicyHistoryData()
            setPolicyData(processedData)
            setSelectedPolicyData(processedData[0])
            setActiveKey(processedData[0]?.id)
            setDropDownLabel(processedData[0]?.versionDataForDropdown[0]?.label)
            setPolicyDescription(processedData[0]?.versionDetails[0]?.consent_display_description)
            setPolicyUpdatedOn(processedData[0]?.versionDetails[0]?.updated_on)
        }
    }, [policiesWithoutContactInformation, versionDetails])

    const handleTabChange = (key) => {
        setActiveKey(key)
        let selectedPolicyTab = policyData?.filter((data) => data.id === key)[0]
        setSelectedPolicyData(selectedPolicyTab)
        setPolicyDescription(selectedPolicyTab.versionDetails[0]?.consent_display_description)
        setPolicyUpdatedOn(selectedPolicyTab.versionDetails[0]?.updated_on)
        let processedData = processPolicyHistoryData()
        setDropDownLabel(processedData[0]?.versionDataForDropdown[0]?.label)
    }

    const handleMenuClick = (e) => {
        console.log('click', e.key)
        let selectedVersionDetails = selectedPolicyData?.versionDetails?.filter(
            (data) => data.version_number == e.key
        )[0]
        setDropDownLabel(e.key == 1 ? 'V1.0' : 'V' + e.key)
        setPolicyDescription(selectedVersionDetails.consent_display_description)
        setPolicyUpdatedOn(selectedVersionDetails.updated_on)
    }

    return (
        <div className='flex justify-between pl-2 pr-6 pb-2 pt-2'>
            {policyData?.length <= 0 ? (
                <Skeleton active />
            ) : (
                <>
                    <div className='h-[530px]  overflow-y-auto overflow-x-hidden'>
                        <Tabs activeKey={activeKey} onChange={handleTabChange} tabPosition={'left'} className='!mb-0'>
                            {policyData?.map((data) => (
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
                                                <Text
                                                    ellipsis={{
                                                        tooltip: {
                                                            title: data?.policyTitle,
                                                            mouseLeaveDelay: 0,
                                                            mouseEnterDelay: 0.5,
                                                            placement: 'left',
                                                        },
                                                    }}
                                                    className='text-[13px] '>
                                                    {data?.policyTitle}
                                                </Text>
                                            </div>
                                        </div>
                                    }></Tabs.TabPane>
                            ))}
                        </Tabs>
                    </div>
                    <div>
                        <Dropdown
                            className='w-[90px] mb-4'
                            menu={{
                                items: selectedPolicyData?.versionDataForDropdown,
                                onClick: handleMenuClick,
                            }}>
                            <Space>
                                <span>{dropDownLabel}</span>
                                <DownOutlined />
                            </Space>
                        </Dropdown>
                        <div>
                            <div className='!w-[680px] rounded border-[1px]'>
                                <ReactQuill
                                    value={policyDescription}
                                    modules={{ toolbar: false }}
                                    readOnly={true}
                                    style={{ width: '100%', height: '400px' }}
                                />
                            </div>
                            <p className='py-2 text-[#000000] text-opacity-50'>
                                {t('labels:last_updated') + ': ' + getDate(policyUpdatedOn)}
                            </p>
                            {/* <div className='mt-4 flex justify-end'>
                        <Button className='app-btn-primary' onClick={''}>
                            {t('labels:create_new_version')}
                        </Button>
                    </div> */}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default PolicyHistory
