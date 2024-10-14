import { Button } from '../../../shadcnComponents/ui/button'
import { Card, CardContent } from '../../../shadcnComponents/ui/card'
import { Checkbox } from '../../../shadcnComponents/ui/checkbox'
import { Label } from '../../../shadcnComponents/ui/label'
import { Switch } from '../../../shadcnComponents/ui/switch'
import { Textarea } from '../../../shadcnComponents/ui/textarea'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../shadcnComponents/ui/tooltip'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { ConsentPreview } from '../../../constants/media'
import MarketplaceToaster from '../../../util/marketplaceToaster'
import useUpdateConsentLead from '../hooks/useUpdateConsentLead'
import useUpdateConsentsOrder from '../hooks/useUpdateConsentsOrder'
import useGetPreviewContentData from '../hooks/useGETPreviewContentData'

const portalInfo = JSON.parse(process.env.REACT_APP_PORTAL_INFO)

export default function PreviewAndCustomise({ closeModal, refetchUserConsent, storeName, storeId }) {
    const { t } = useTranslation()
    const {
        data: userConsents,
        status: userConsentsStatus,
        refetch: refetchUserConsents,
    } = useGetPreviewContentData({
        storeName,
    })
    const [leadInLine, setLeadInLine] = useState('')
    const [reorderList, setReorderList] = useState([])
    const [draggedItem, setDraggedItem] = useState(null)
    const [draggedOverItem, setDraggedOverItem] = useState(null)
    const [isListReordered, setIsListReordered] = useState(false)
    const [explicit, setExplicit] = useState(false)

    const { mutateAsync: UpdateConsentLead, status: UpdateConsentLeadStatus } = useUpdateConsentLead()
    const { mutateAsync: updateConsentsOrder, status: updateConsentsOrderStatus } = useUpdateConsentsOrder()

    const handelLeadInLine = (e) => {
        setLeadInLine(e.target.value)
    }

    useEffect(() => {
        if (userConsents?.store_userconsent_data?.length > 0 && userConsentsStatus === 'success') {
            setLeadInLine(userConsents?.leading_line || t('labels:leading_line'))
            setExplicit(userConsents?.explicit)
            const tempReorderList = userConsents?.store_userconsent_data?.map((consent) => ({
                key: consent?.id,
                name: consent?.version_details?.consent_display_name,
                ordering: consent?.ordering,
            }))
            tempReorderList.sort((a, b) => a.ordering - b.ordering)
            if (tempReorderList?.length > 0) setReorderList(tempReorderList)
        } else {
            setLeadInLine('')
            setExplicit(false)
            setReorderList([])
        }
    }, [userConsents, userConsentsStatus, t])

    const handleListDragStart = (e, index) => {
        setDraggedItem(index)
    }

    const handelListDragEnter = (e, index) => {
        setDraggedOverItem(index)
    }

    const handleListDrop = (e) => {
        const updatedFormItems = [...reorderList]
        if (draggedItem !== -1 && draggedOverItem !== -1) {
            ;[updatedFormItems[draggedItem], updatedFormItems[draggedOverItem]] = [
                updatedFormItems[draggedOverItem],
                updatedFormItems[draggedItem],
            ]
            setReorderList(updatedFormItems)
            setIsListReordered(true)
        }
    }

    const handelSave = async () => {
        try {
            if (leadInLine?.trim() !== userConsents?.leading_line || explicit !== userConsents?.explicit) {
                const body = {
                    store: storeId,
                    leading_line: leadInLine?.trim(),
                    explicit: !!explicit,
                }
                await UpdateConsentLead({ body })
                toast(t('messages:lead_in_line_updated'), { type: 'success' })
            }

            if (reorderList?.length > 0 && isListReordered) {
                const body = {
                    user_consent_order: reorderList.map((consent, index) => ({
                        userconsent_id: consent.key,
                        ordering: index + 1,
                    })),
                }
                await updateConsentsOrder({ body })
                toast(t('messages:consent_order_updated'), { type: 'success' })
            }

            refetchUserConsent()
            refetchUserConsents()
            closeModal()
        } catch (error) {
            MarketplaceToaster.showToast(error?.response)
        }
    }

    const handelExplicitChange = (checked) => {
        setExplicit(checked)
    }

    if (userConsentsStatus === 'pending') {
        return (
            <div className='w-full flex justify-center items-center h-[80px]'>
                <Loader2 className='h-8 w-8 animate-spin' />
            </div>
        )
    }

    return (
        <div className='flex flex-col h-[400px] w-[950px] space-y-4'>
            <div className='flex space-x-6 h-full overflow-hidden'>
                {/* Preview Section */}
                <div className='shrink-0 w-[550px] h-full'>
                    <h3 className='text-black text-opacity-40 font-bold py-3 mb-0'>{t('labels:preview')}</h3>
                    <div className='relative w-full h-full overflow-hidden'>
                        <img src={ConsentPreview} alt='ConsentPreview' className='w-full h-full object-cover' />
                        <div className='absolute top-[50%] w-full bg-gray-100 px-[50px] py-2 text-sm max-h-[100px] overflow-y-auto shadow-md'>
                            <div className='flex items-start gap-x-2'>
                                {explicit && <Checkbox />}
                                <div className={explicit ? 'w-[90%]' : 'w-full'}>
                                    <span className='mr-1 text-gray-700'>{leadInLine?.trim()}</span>
                                    {reorderList.map((list, index) => (
                                        <TooltipProvider key={list.key}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className='inline-block'>
                                                        {index !== 0 && <span className='text-black'>, </span>}
                                                        {list.name}
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent>{list.name}</TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vertical Divider */}
                <div className='w-px bg-black bg-opacity-5 self-stretch' />

                {/* Customization Section */}
                <div className='flex-1 h-full'>
                    <h3 className='text-black text-opacity-70 font-semibold py-3 mb-0'>{t('labels:customisation')}</h3>
                    <div className='space-y-4 h-full overflow-y-auto'>
                        {/* Explicit Consent Toggle */}
                        <div className='space-y-2 flex flex-col '>
                            <Label htmlFor='explicit-consent'>{t('labels:consent_explicit')}</Label>
                            <Switch id='explicit-consent' checked={explicit} onCheckedChange={handelExplicitChange} />
                        </div>

                        {/* Lead In Line */}
                        <div className='space-y-2'>
                            <Label htmlFor='lead-in-line'>
                                {t('labels:lead_in_line')} <span className='text-red-500'>*</span>
                            </Label>
                            <Textarea
                                id='lead-in-line'
                                value={leadInLine}
                                onChange={handelLeadInLine}
                                maxLength={100}
                                className='resize-none'
                            />
                            <p className='text-sm text-gray-500'>{`${leadInLine.length}/100`}</p>
                        </div>

                        {/* Order Policies */}
                        <div className='space-y-2'>
                            <h4 className='text-base text-black text-opacity-80 font-medium'>
                                {t('messages:order_policies')}
                            </h4>
                            <Card className='w-full h-[200px] overflow-y-auto border-none'>
                                <CardContent className='p-0'>
                                    {reorderList.map((list, index) => (
                                        <div
                                            key={list.key}
                                            className='flex items-center gap-x-4 px-4 py-2 border-b cursor-move'
                                            draggable={reorderList.length > 1}
                                            onDragStart={(e) => handleListDragStart(e, index)}
                                            onDragEnter={(e) => handelListDragEnter(e, index)}
                                            onDragEnd={handleListDrop}
                                            onDragOver={(e) => e.preventDefault()}>
                                            <svg
                                                width='16'
                                                height='17'
                                                viewBox='0 0 16 17'
                                                fill='none'
                                                xmlns='http://www.w3.org/2000/svg'>
                                                <path
                                                    d='M15.0003 2.21191H1.00028C0.921708 2.21191 0.857422 2.2762 0.857422 2.35477V3.49763C0.857422 3.5762 0.921708 3.64049 1.00028 3.64049H15.0003C15.0789 3.64049 15.1431 3.5762 15.1431 3.49763V2.35477C15.1431 2.2762 15.0789 2.21191 15.0003 2.21191ZM15.0003 13.3548H1.00028C0.921708 13.3548 0.857422 13.4191 0.857422 13.4976V14.6405C0.857422 14.7191 0.921708 14.7833 1.00028 14.7833H15.0003C15.0789 14.7833 15.1431 14.7191 15.1431 14.6405V13.4976C15.1431 13.4191 15.0789 13.3548 15.0003 13.3548ZM15.0003 7.78334H1.00028C0.921708 7.78334 0.857422 7.84763 0.857422 7.9262V9.06906C0.857422 9.14763 0.921708 9.21192 1.00028 9.21192H15.0003C15.0789 9.21192 15.1431 9.14763 15.1431 9.06906V7.9262C15.1431 7.84763 15.0789 7.78334 15.0003 7.78334Z'
                                                    fill='black'
                                                    fillOpacity='0.45'
                                                />
                                            </svg>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <span className='text-sm text-black text-opacity-80 truncate w-[200px]'>
                                                            {list.name}
                                                        </span>
                                                    </TooltipTrigger>
                                                    <TooltipContent side='right' className='max-w-[200px]'>
                                                        {list.name}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Section */}
            <div className='flex justify-end space-x-2'>
                <Button variant='outline' onClick={closeModal}>
                    {t('labels:cancel')}
                </Button>
                <Button
                    onClick={handelSave}
                    disabled={
                        !leadInLine?.trim() ||
                        updateConsentsOrderStatus === 'pending' ||
                        UpdateConsentLeadStatus === 'pending'
                    }>
                    {updateConsentsOrderStatus === 'pending' || UpdateConsentLeadStatus === 'pending' ? (
                        <Loader2 className='h-4 w-4 animate-spin' />
                    ) : (
                        t('labels:publish')
                    )}
                </Button>
            </div>
        </div>
    )
}
