import { Alert, AlertDescription, AlertTitle } from '../../shadcnComponents/ui/alert'
import { Button } from '../../shadcnComponents/ui/button'
import { Card, CardContent } from '../../shadcnComponents/ui/card'
import { Checkbox } from '../../shadcnComponents/ui/checkbox'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../../shadcnComponents/ui/dialog'
import { Skeleton } from '../../shadcnComponents/ui/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../shadcnComponents/ui/tooltip'
import { AlertCircle, Info, X, InfoIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import StoreModal from '../../components/storeModal/StoreModal'
import MarketplaceToaster from '../../util/marketplaceToaster'
import PolicyCard from './components/PolicyCard'
import PolicyHistory from './components/PolicyHistory'
import PreviewAndCustomise from './components/PreviewAndCustomise'
import VersionBanner from './components/VersionBanner'
import useDeleteUserConsent from './hooks/useDeleteUserConsent'
import useGetUserConsent from './hooks/useGetUserConsent'
import './policiesSettings.css'

const CONTACT_INFORMATION = 'Contact Information'

export default function PoliciesSettings({ storeName }) {
    const { t } = useTranslation()
    const search = useLocation().search
    const storeUUID = new URLSearchParams(search).get('id')
    const storeId = new URLSearchParams(search).get('storeId')
    const newPolicyRef = useRef(null)
    const [contactInformation, setContactInformation] = useState([])
    const [policiesWithoutContactInformation, setPoliciesWithoutContactInformation] = useState([])
    const [addNewPolicy, setAddNewPolicy] = useState(false)
    const [addContactInfo, setContactInfo] = useState(false)
    const [deletePolicy, setDeletePolicy] = useState(null)
    const [policyWarning, setPolicyWarning] = useState(false)
    const [previewAndCustomise, setPreviewAndCustomise] = useState(null)
    const {
        data: userConsents,
        status: userConsentStatus,
        refetch: refetchUserConsent,
        isFetched: isUserConsentFetched,
    } = useGetUserConsent({
        storeId: storeUUID,
    })
    const { mutate: deleteStoreUserConsent, status: deleteStoreUserConsentStatus } = useDeleteUserConsent()
    const [isPolicyhistory, setIsPolicyHistory] = useState(false)

    const handlePolicyHistory = () => {
        setIsPolicyHistory(true)
    }

    const handelAddNewPolicy = () => {
        if (userConsents?.count < 10) {
            setAddNewPolicy(true)
            setTimeout(() => {
                newPolicyRef.current?.scrollIntoView({ behavior: 'smooth' })
            }, 100)
        } else {
            setPolicyWarning(true)
        }
    }

    const onContactInfoChange = (checked) => {
        if (contactInformation?.length > 0) {
            const contactInformationId = contactInformation?.[0]?.id
            setDeletePolicy(contactInformationId)
        } else {
            setContactInfo(checked)
        }
    }

    useEffect(() => {
        let tempContactInformation = []
        const tempPoliciesWithoutContactInformation = []
        if (userConsentStatus === 'success' || isUserConsentFetched) {
            userConsents?.userconsent_data?.forEach((consent) => {
                if (consent?.version_details[0]?.consent_name === CONTACT_INFORMATION) {
                    tempContactInformation = [consent]
                } else tempPoliciesWithoutContactInformation.push(consent)
            })
            setContactInformation(tempContactInformation)
            setPoliciesWithoutContactInformation([...tempPoliciesWithoutContactInformation])
            if (tempContactInformation?.length > 0) setContactInfo(true)
        }
    }, [isUserConsentFetched, userConsentStatus, userConsents])

    const handelDeletePolicy = (userConsentId) => {
        if (userConsentId) setDeletePolicy(userConsentId)
        else setAddNewPolicy(false)
    }

    const deletePolicyById = (userConsentId) => {
        if (userConsentId) {
            deleteStoreUserConsent(
                { userConsentId },
                {
                    onSuccess: (response) => {
                        refetchUserConsent()
                        setContactInfo(false)
                        toast(response?.response_message, {
                            type: 'success',
                        })
                        setDeletePolicy(null)
                        setPolicyWarning(false)
                    },
                    onError: (err) => {
                        MarketplaceToaster.showToast(err?.response)
                    },
                }
            )
        }
    }

    const handelPreviewAndCustomise = () => {
        setPreviewAndCustomise(true)
    }

    return (
        <Card className='bg-white rounded-lg border my-4 w-[92%]'>
            <CardContent className='p-4'>
                <div className='mb-4'>
                    {policyWarning && (
                        <Alert variant='destructive'>
                            <AlertCircle className='h-4 w-4' />
                            <AlertTitle>{t('messages:poicy_warning')}</AlertTitle>
                            <X className='h-4 w-4 cursor-pointer' onClick={() => setPolicyWarning(false)} />
                        </Alert>
                    )}
                </div>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-lg font-semibold'>{t('messages:policies')}</h2>
                    <div className='flex gap-2'>
                        <Button
                            variant='outline'
                            onClick={handlePolicyHistory}
                            disabled={userConsentStatus !== 'success' || userConsents?.userconsent_data?.length <= 0}>
                            {t('labels:policy_history')}
                        </Button>
                        <Button
                            variant='outline'
                            onClick={handelPreviewAndCustomise}
                            disabled={userConsentStatus !== 'success' || userConsents?.userconsent_data?.length <= 0}>
                            {t('labels:preview_and_customise')}
                        </Button>
                        <Button onClick={handelAddNewPolicy} disabled={userConsentStatus !== 'success'}>
                            {t('labels:add_new_policy')}
                        </Button>
                    </div>
                </div>
                <div className='mt-3 max-w-[1000px]'>
                    <p className='text-gray-600'>{t('messages:help_info_policies')}</p>
                    <div className='mt-3'>
                        <span className='font-bold'>{t('labels:bonus')}: </span>
                        <span className='text-gray-600'>{t('messages:policy_bonus_note')}</span>
                    </div>
                </div>
                <div className='mt-5'>
                    {userConsentStatus === 'pending' && <Skeleton className='w-full h-20' />}
                    {userConsentStatus === 'success' && (
                        <div>
                            {policiesWithoutContactInformation?.length > 0 &&
                                policiesWithoutContactInformation?.map((consent) => (
                                    <PolicyCard
                                        key={consent?.id}
                                        policyType='SAVED_POLICY'
                                        consent={consent}
                                        refetchUserConsent={refetchUserConsent}
                                        handelDeletePolicy={handelDeletePolicy}
                                        storeId={storeId}
                                        consentDetails={consent?.version_details?.[0]}
                                        policyStatus={consent?.version_details?.[0]?.status}
                                        version={
                                            consent?.version_details?.[0]?.version_number === 1
                                                ? 'V1.0'
                                                : 'V' + consent?.version_details?.[0]?.version_number
                                        }
                                        storeUUID={storeUUID}
                                    />
                                ))}

                            {addNewPolicy ? (
                                <div ref={newPolicyRef}>
                                    <PolicyCard
                                        policyType='NEW_POLICY'
                                        isNewPolicy
                                        refetchUserConsent={refetchUserConsent}
                                        setAddNewPolicy={setAddNewPolicy}
                                        handelDeletePolicy={handelDeletePolicy}
                                        storeId={storeId}
                                        storeUUID={storeUUID}
                                    />
                                </div>
                            ) : userConsents?.userconsent_data?.length <= 0 ? (
                                <div className='py-3'>
                                    <VersionBanner addPolicyHandler={handelAddNewPolicy} />
                                </div>
                            ) : null}
                            <div className='flex items-center'>
                                <div className='flex items-center space-x-2'>
                                    <Checkbox
                                        id='contact-info'
                                        checked={addContactInfo}
                                        onCheckedChange={onContactInfoChange}
                                    />
                                    <label
                                        htmlFor='contact-info'
                                        className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                                        {t('messages:display_contact')}
                                    </label>
                                </div>
                            </div>
                            <div>
                                <Alert className='mt-2 ml-7 w-[420px] bg-blue-50 border-blue-200'>
                                    <InfoIcon className=' h-4 w-4 text-blue-500 mr-2' />
                                    <AlertDescription className='whitespace-nowrap'>
                                        {t('messages:contact_info')}
                                    </AlertDescription>
                                </Alert>
                            </div>
                            {addContactInfo && (
                                <div className='pl-[1.7rem] mt-10'>
                                    <PolicyCard
                                        policyType='CONTACT_POLICY'
                                        refetchUserConsent={refetchUserConsent}
                                        consent={contactInformation?.[0] || null}
                                        policyName={CONTACT_INFORMATION}
                                        isNewPolicy={contactInformation?.length === 0}
                                        key={contactInformation?.[0]?.id || 'addContactInfo'}
                                        storeId={storeId}
                                        consentDetails={contactInformation?.[0]?.version_details?.[0]}
                                        policyStatus={contactInformation?.[0]?.version_details?.[0]?.status}
                                        version={
                                            contactInformation?.[0]?.version_details?.[0]?.version_number === 1
                                                ? 'V1.0'
                                                : 'V' + contactInformation?.[0]?.version_details?.[0]?.version_number
                                        }
                                        storeUUID={storeUUID}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                    {userConsentStatus === 'error' && (
                        <div className='text-center mt-5 mb-4'>
                            <p>{t('messages:network_error')}</p>
                        </div>
                    )}
                </div>
            </CardContent>
            <Dialog open={deletePolicy !== null} onOpenChange={() => setDeletePolicy(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('labels:delete_policies')}</DialogTitle>
                        <DialogDescription>{t('messages:delete_confirmation')}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant='outline'
                            onClick={() => setDeletePolicy(null)}
                            disabled={deleteStoreUserConsentStatus === 'pending'}>
                            {t('labels:cancel')}
                        </Button>
                        <Button
                            variant='destructive'
                            onClick={() => deletePolicyById(deletePolicy)}
                            disabled={deleteStoreUserConsentStatus === 'pending'}>
                            {t('labels:yes')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <StoreModal
                isVisible={previewAndCustomise}
                title={<div className='text-xl font-bold text-gray-900'>{t('labels:preview_and_customise')}</div>}
                isSpin={false}
                cancelCallback={() => setPreviewAndCustomise(null)}
                width='1000px'
                height='500px'
                destroyOnClose={true}
                style={{ overflow: 'hidden' }} // Ensure no overflow for the modal
            >
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <PreviewAndCustomise
                        userConsents={userConsents}
                        closeModal={() => setPreviewAndCustomise(null)}
                        refetchUserConsent={refetchUserConsent}
                        storeId={storeId}
                        storeName={storeName}
                        style={{ overflowY: 'auto', height: '100%' }} // Ensure the child component is scrollable
                    />
                </div>
            </StoreModal>

            <StoreModal
                isVisible={isPolicyhistory}
                removePadding={true}
                title={
                    <div>
                        <div className='px-4 py-3'>{t('labels:policy_history')}</div>
                        <hr className='border-t border-gray-200' />
                    </div>
                }
                isSpin={false}
                cancelCallback={() => setIsPolicyHistory(null)}
                width='1000px'
                height='500px'
                destroyOnClose={true}>
                <PolicyHistory />
            </StoreModal>
        </Card>
    )
}
