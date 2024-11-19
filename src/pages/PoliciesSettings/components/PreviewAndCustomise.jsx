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
import StoreModal from '../../../components/storeModal/StoreModal'
import TranslatorModal from './TranslatorModal'
import { toast } from 'react-toastify'
import { ConsentPreview } from '../../../constants/media'
import MarketplaceToaster from '../../../util/marketplaceToaster'
import useUpdateConsentLead from '../hooks/useUpdateConsentLead'
import useUpdateConsentsOrder from '../hooks/useUpdateConsentsOrder'
import useGetPreviewContentData from '../hooks/useGETPreviewContentData'
import util from '../../../util/common'

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
    const [leadInLineId, setLeadInLineId] = useState('')
    const [leadInLineBaseName, setLeadInLineBaseName] = useState('')
    const [reorderList, setReorderList] = useState([])
    const [draggedItem, setDraggedItem] = useState(null)
    const [draggedOverItem, setDraggedOverItem] = useState(null)
    const [isListReordered, setIsListReordered] = useState(false)
    const [explicit, setExplicit] = useState(false)

    const [loadingSkelton, setLoadingSkelton] = useState(false)
    const [translateModalVisible, setTranslateModalVisible] = useState(false)
    const [onChangeDisableFields, setOnChangeDisableFields] = useState(false)

    const { mutateAsync: UpdateConsentLead, status: UpdateConsentLeadStatus } = useUpdateConsentLead()
    const { mutateAsync: updateConsentsOrder, status: updateConsentsOrderStatus } = useUpdateConsentsOrder()

    const handelLeadInLine = (e) => {
        setLeadInLine(e.target.value)
    }

    useEffect(() => {
        if (userConsents?.store_userconsent_data?.length > 0 && userConsentsStatus === 'success') {
            console.log('userConsentss', userConsents)
            setLeadInLine(userConsents?.leading_line_displayname || t('labels:leading_line'))
            setLeadInLineId(userConsents?.lead_line_id)

            setLeadInLineBaseName(userConsents?.leading_line)
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

    const translateModalCloseHandler = () => {
        setTranslateModalVisible(false)
        setLoadingSkelton(false)
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
            <div className='flex gap-6 h-full overflow-hidden'>
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
                            <div className='flex'>
                                <Textarea
                                    id='lead-in-line'
                                    value={leadInLine}
                                    onChange={handelLeadInLine}
                                    maxLength={100}
                                    disabled={true}
                                    className={` ${util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? 'mr-1' : 'ml-1'} resize-none w-72`}
                                />
                                <div
                                    className='mt-[62px] mx-1 cursor-pointer'
                                    onClick={() => {
                                        setLoadingSkelton(true)
                                        setTranslateModalVisible(true)
                                        setOnChangeDisableFields(true)
                                    }}>
                                    <svg
                                        width='14'
                                        height='14'
                                        viewBox='0 0 14 14'
                                        fill='none'
                                        xmlns='http://www.w3.org/2000/svg'>
                                        <g clip-path='url(#clip0_3075_21187)'>
                                            <path
                                                fill-rule='evenodd'
                                                clip-rule='evenodd'
                                                d='M2.74565 0.583008C2.94253 0.583008 3.09565 0.670508 3.18315 0.823633L4.8019 3.73301C4.95503 3.97363 4.86753 4.27988 4.6269 4.41113C4.56128 4.45488 4.47378 4.47676 4.38628 4.47676C4.21128 4.47676 4.03628 4.38926 3.94878 4.23613L3.62065 3.64551H1.8269L1.49878 4.23613C1.36753 4.45488 1.06128 4.54238 0.820652 4.41113C0.601902 4.27988 0.514402 3.97363 0.645652 3.73301L2.30815 0.823633C2.39565 0.670508 2.54878 0.583008 2.74565 0.583008ZM2.74565 2.07051L2.41753 2.66113H3.07378L2.74565 2.07051ZM11.869 11.083L12.4524 10.4997H12.884C13.0387 10.4997 13.1871 10.4382 13.2965 10.3288C13.4059 10.2194 13.4674 10.071 13.4674 9.91634C13.4674 9.76163 13.4059 9.61326 13.2965 9.50386C13.1871 9.39446 13.0387 9.33301 12.884 9.33301H11.7174V8.74967C11.7174 8.59496 11.6559 8.44659 11.5465 8.33719C11.4371 8.2278 11.2887 8.16634 11.134 8.16634C10.9793 8.16634 10.8309 8.2278 10.7216 8.33719C10.6122 8.44659 10.5507 8.59496 10.5507 8.74967V9.33301H9.38403C9.22932 9.33301 9.08095 9.39446 8.97155 9.50386C8.86216 9.61326 8.8007 9.76163 8.8007 9.91634C8.8007 10.071 8.86216 10.2194 8.97155 10.3288C9.08095 10.4382 9.22932 10.4997 9.38403 10.4997H10.8015L8.9232 12.3722C8.86852 12.4264 8.82513 12.4909 8.79551 12.562C8.7659 12.6331 8.75065 12.7093 8.75065 12.7863C8.75065 12.8633 8.7659 12.9396 8.79551 13.0107C8.82513 13.0818 8.86852 13.1463 8.9232 13.2005C8.97771 13.2546 9.04235 13.2973 9.11342 13.3264C9.18449 13.3554 9.2606 13.3701 9.33737 13.3697C9.41414 13.3701 9.49024 13.3554 9.56131 13.3264C9.63238 13.2973 9.69703 13.2546 9.75153 13.2005L11.0465 11.9055L12.429 13.288C12.5383 13.3967 12.6862 13.4576 12.8403 13.4576C12.9944 13.4576 13.1422 13.3967 13.2515 13.288C13.3602 13.1787 13.4212 13.0309 13.4212 12.8768C13.4212 12.7226 13.3602 12.5748 13.2515 12.4655L11.869 11.083ZM6.08402 11.3201H3.67284C3.45946 11.3201 3.28875 11.1548 3.28875 10.9482L3.28875 9.97733L3.67284 10.2872C3.86488 10.4525 4.18495 10.4318 4.35565 10.2459C4.52635 10.06 4.50501 9.7501 4.31297 9.58484L3.13939 8.59327C3.05404 8.51064 2.92601 8.46932 2.81932 8.46932C2.71263 8.46932 2.5846 8.51064 2.49925 8.59327L1.32567 9.58484C1.13363 9.7501 1.11229 10.0393 1.28299 10.2459C1.45369 10.4318 1.75242 10.4525 1.9658 10.2872L2.34989 9.97733L2.34989 10.9482C2.34989 11.6713 2.94735 12.2497 3.69417 12.2497L6.08402 12.2497C6.34007 12.2497 6.57479 12.0431 6.57479 11.7745C6.57479 11.506 6.36141 11.3201 6.08402 11.3201ZM10.3284 2.67927H7.91721C7.63981 2.67927 7.42643 2.49335 7.42643 2.2248C7.42643 1.95625 7.66115 1.74967 7.91721 1.74967H10.3071C11.0539 1.74967 11.6513 2.32809 11.6513 3.05111V4.02202L12.0354 3.71215C12.2488 3.54689 12.5475 3.56755 12.7182 3.75347C12.8889 3.96004 12.8676 4.24925 12.6756 4.41451L11.502 5.40608C11.4166 5.48871 11.2886 5.53003 11.1819 5.53003C11.0752 5.53003 10.9472 5.48871 10.8618 5.40608L9.68825 4.41451C9.49621 4.24925 9.47487 3.93939 9.64557 3.75347C9.81628 3.56755 10.1363 3.54689 10.3284 3.71215L10.7125 4.02202V3.05111C10.7125 2.84453 10.5418 2.67927 10.3284 2.67927Z'
                                                fill='currentColor'
                                            />
                                        </g>
                                        <defs>
                                            <clipPath id='clip0_3075_21187'>
                                                <rect width='14' height='14' fill='white' />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                            </div>
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
            <StoreModal
                title={`${t('labels:translate')}`}
                isVisible={translateModalVisible}
                okButtonText={null}
                cancelButtonText={null}
                hideCloseButton={false}
                okCallback={null}
                cancelCallback={() => translateModalCloseHandler()}
                isSpin={false}
                width={1000}>
                <div>
                    <TranslatorModal
                        dataJson={[
                            {
                                order: 1,
                                label: '',
                                type: 'textbox',
                                value: leadInLineBaseName,
                            },
                        ]}
                        componentType='leadline'
                        respectiveId={leadInLineId}
                        setTranslateModalVisible={setTranslateModalVisible}
                        onChangeDisableFields={onChangeDisableFields}
                        setOnChangeDisableFields={setOnChangeDisableFields}
                        setLeadInLine={setLeadInLine}
                        loadingSkelton={loadingSkelton}
                        setLoadingSkelton={setLoadingSkelton}
                    />
                </div>
            </StoreModal>

            {/* Footer Section */}
            <div className='flex justify-end gap-2'>
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
