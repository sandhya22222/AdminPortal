import { Button } from '../../../shadcnComponents/ui/button'
import { Card, CardContent } from '../../../shadcnComponents/ui/card'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../../../shadcnComponents/ui/dropdownMenu'
import { Skeleton } from '../../../shadcnComponents/ui/skeleton'
import { ShadCNTabs, ShadCNTabsTrigger } from '../../../shadcnComponents/customComponents/ShadCNTabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../shadcnComponents/ui/tooltip'
import { ChevronDown } from 'lucide-react'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import useGetPolicyHistory from '../hooks/useGetPolicyHistory'
import { sanitizeHtml } from '../../../util/util'

function PolicyHistory() {
    const { t } = useTranslation()
    const search = useLocation().search
    const storeUUID = new URLSearchParams(search).get('id')

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
            setPolicyDescription(sanitizeHtml(processedData[0]?.versionDetails[0]?.consent_display_description))
            setPolicyUpdatedOn(processedData[0]?.versionDetails[0]?.updated_on)
        }
    }, [policiesWithoutContactInformation, versionDetails])

    const handleTabChange = (key) => {
        setActiveKey(key)
        let selectedPolicyTab = policyData?.filter((data) => data.id === key)[0]
        setSelectedPolicyData(selectedPolicyTab)
        setPolicyDescription(sanitizeHtml(selectedPolicyTab.versionDetails[0]?.consent_display_description))
        setPolicyUpdatedOn(selectedPolicyTab.versionDetails[0]?.updated_on)
        let processedData = processPolicyHistoryData()
        setDropDownLabel(processedData[0]?.versionDataForDropdown[0]?.label)
    }

    const handleMenuClick = (key) => {
        console.log('click', key)
        let selectedVersionDetails = selectedPolicyData?.versionDetails?.filter((data) => data.version_number == key)[0]
        setDropDownLabel(key == 1 ? 'V1.0' : 'V' + key)
        setPolicyDescription(sanitizeHtml(selectedVersionDetails.consent_display_description))
        setPolicyUpdatedOn(selectedVersionDetails.updated_on)
    }

    return (
        <div className='flex justify-between pl-2 pr-6 pb-2 pt-2'>
            {policyData?.length <= 0 ? (
                <Skeleton className='w-full h-[400px]' />
            ) : (
                <>
                    <div className='h-[400px] overflow-y-auto overflow-x-hidden'>
                        <ShadCNTabs
                            value={activeKey}
                            onTabClick={handleTabChange}
                            orientation='vertical'
                            borderPosition='right'
                            className='w-[200px]'>
                            {policyData?.map((data) => (
                                <ShadCNTabsTrigger key={data?.id} value={data?.id} className='justify-start w-full'>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span className='truncate w-[100px] text-left'>
                                                    {data?.policyTitle}
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent side='right'>
                                                <p>{data?.policyTitle}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </ShadCNTabsTrigger>
                            ))}
                        </ShadCNTabs>
                    </div>
                    <div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant='outline' className='w-[90px] mb-4 border-none'>
                                    {dropDownLabel}
                                    <ChevronDown className='ml-2 h-4 w-4' />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {selectedPolicyData?.versionDataForDropdown.map((item) => (
                                    <DropdownMenuItem key={item.key} onSelect={() => handleMenuClick(item.key)}>
                                        {item.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <div>
                            <Card className='w-[680px] max-h-[300px] overflow-y-auto'>
                                <CardContent className='p-0'>
                                    <div className='custom-editor-container'>
                                        <ReactQuill
                                            value={policyDescription}
                                            modules={{ toolbar: false }}
                                            readOnly={true}
                                            style={{ width: '100%', height: '250px' }}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                            <p className='py-2 text-muted-foreground'>
                                {t('labels:last_updated') + ': ' + getDate(policyUpdatedOn)}
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default PolicyHistory
