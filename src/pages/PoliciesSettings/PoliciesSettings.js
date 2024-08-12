import { Alert, Button, Checkbox, Divider, Modal, Skeleton, Tag, Tooltip, Typography, Layout } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RiInformationFill, RiCloseCircleFill } from 'react-icons/ri'
import { useSearchParams } from 'react-router-dom'
import StoreModal from '../../components/storeModal/StoreModal'
import MarketplaceToaster from '../../util/marketplaceToaster'
import PolicyCard from './components/PolicyCard'
import PolicyHistory from './components/PolicyHistory'
import PreviewAndCustomise from './components/PreviewAndCustomise'
import VersionBanner from './components/VersionBanner'
import useDeleteUserConsent from './hooks/useDeleteUserConsent'
import useGetUserConsent from './hooks/useGetUserConsent'
import './policiesSettings.css'
import { toast } from 'react-toastify'

const { Content } = Layout
const { Text, Title } = Typography
const CONTACT_INFORMATION = 'Contact Information'

const PoliciesSettings = ({ storeName }) => {
    const { t } = useTranslation()
    const [searchParams, setSearchParams] = useSearchParams()
    const storeUUID = searchParams.get('id')
    const storeId = searchParams.get('storeId')
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
        error: userConsentError,
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
                newPolicyRef.current.scrollIntoView(false)
            }, [100])
        } else {
            setPolicyWarning(true)
        }
    }
    const onContactInfoChange = (e) => {
        if (contactInformation?.length > 0) {
            const contactInformationId = contactInformation?.[0]?.id
            setDeletePolicy(contactInformationId)
        } else {
            setContactInfo(e.target.checked)
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
                        // MarketplaceToaster.showToast(response?.response_body?.message)
                        toast(response?.response_message, {
                            type: 'success',
                        })
                        setDeletePolicy(null)
                        setPolicyWarning(false)
                    },
                    onError: (err) => {
                        MarketplaceToaster.showToast(err?.response)
                        // toast(err?.response?.data?.response_message || t('messages:error_deleting_policy'), {
                        //     type: 'error',
                        // })
                    },
                }
            )
        }
    }

    const handelPreviewAndCustomise = () => {
        setPreviewAndCustomise(true)
    }

    return (
        <Content className=' bg-white rounded-lg border my-4'>
            <div className=' w-full  bg-white !h-auto px-4'>
                <div className='mb-4'>
                    {policyWarning && (
                        <Tag
                            color='magenta'
                            className='text-black text-[14px] policy-tag w-full flex justify-between px-2 py-2'
                            closable
                            onClose={() => setPolicyWarning(false)}>
                            <div className='flex items-center'>
                                <div className='pr-2'>
                                    {' '}
                                    <RiCloseCircleFill className='text-[#FF4D4F] text-base' />
                                </div>
                                {t('messages:poicy_warning')}
                            </div>
                        </Tag>
                    )}
                </div>
                <div className=' flex  w-full  justify-between '>
                    <label className='text-lg mb-3 font-semibold'>{t('messages:policies')}</label>
                    <div className='flex !gap-2'>
                        <Button
                            className='app-btn-secondary'
                            onClick={handlePolicyHistory}
                            disabled={userConsentStatus !== 'success' || userConsents?.userconsent_data?.length <= 0}>
                            {t('labels:policy_history')}
                        </Button>
                        <Button
                            className='app-btn-secondary'
                            onClick={handelPreviewAndCustomise}
                            disabled={userConsentStatus !== 'success' || userConsents?.userconsent_data?.length <= 0}>
                            {t('labels:preview_and_customise')}
                        </Button>
                        <Button
                            className='app-btn-primary'
                            onClick={handelAddNewPolicy}
                            disabled={userConsentStatus !== 'success'}>
                            {t('labels:add_new_policy')}
                        </Button>
                    </div>
                </div>
                <div className='mt-3 max-w-[1000px] '>
                    <div>
                        <Text className='input-label-color'>{t('messages:help_info_policies')}</Text>
                    </div>
                    <div className='mt-3'>
                        <Text className='input-label-color font-bold'>{t('labels:bonus')}</Text>
                        <span>{': '}</span>
                        <Text className='input-label-color '> {t('messages:policy_bonus_note')}</Text>
                    </div>
                </div>
            </div>
            <div className='!p-5'>
                <div className=' mt-3'>
                    <Skeleton loading={userConsentStatus === 'pending'} active />
                </div>
                {userConsentStatus === 'success' && (
                    <div>
                        {policiesWithoutContactInformation?.length > 0 &&
                            policiesWithoutContactInformation?.map((consent) => {
                                return (
                                    <div key={consent?.id}>
                                        <PolicyCard
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
                                    </div>
                                )
                            })}

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
                            <div className=' py-3'>
                                <VersionBanner addPolicyHandler={handelAddNewPolicy}></VersionBanner>
                            </div>
                        ) : null}
                        <div className=' flex items-center '>
                            <Checkbox onChange={onContactInfoChange} checked={addContactInfo}>
                                <div className='text-brandGray2'>{t('messages:display_contact')}</div>
                            </Checkbox>
                            <Tooltip title={t('messages:contact_policy_info')}>
                                <RiInformationFill className=' text-[#1677ff] text-base cursor-pointer' />
                            </Tooltip>
                        </div>
                        <div>
                            <Alert
                                message={t('messages:contact_info')}
                                type='info'
                                showIcon
                                className=' mt-2 ml-7 w-[395px]'
                            />
                        </div>
                        {addContactInfo && (
                            <div className='pl-[1.7rem]'>
                                <PolicyCard
                                    policyType='CONTACT_POLICY'
                                    refetchUserConsent={refetchUserConsent}
                                    consent={contactInformation?.[0] || null}
                                    policyName={t('labels:contact_information')}
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
                    <div className=' text-center mt-5 mb-4'>
                        <Text>{t('messages:network_error')}</Text>
                    </div>
                )}
                <Modal
                    title={t('labels:delete_policies')}
                    isSpin={false}
                    open={deletePolicy}
                    width={'446px'}
                    centered={true}
                    onCancel={() => setDeletePolicy(null)}
                    footer={[
                        <Button
                            className='app-btn-secondary'
                            onClick={() => setDeletePolicy(null)}
                            disabled={deleteStoreUserConsentStatus === 'pending'}>
                            {t('labels:cancel')}
                        </Button>,
                        <Button
                            danger
                            className=' app-btn-primary'
                            onClick={() => deletePolicyById(deletePolicy)}
                            loading={deleteStoreUserConsentStatus === 'pending'}>
                            {t('labels:yes')}
                        </Button>,
                    ]}>
                    <Text className='!text-[#333333]'>{t('messages:delete_confirmation')}</Text>
                </Modal>
                <StoreModal
                    isVisible={previewAndCustomise}
                    title={
                        <div className='text-regal-blue font-bold text-[18px] leading-[26px]'>
                            {t('labels:preview_and_customise')}
                        </div>
                    }
                    isSpin={false}
                    cancelCallback={() => setPreviewAndCustomise(null)}
                    width={1088}
                    destroyOnClose={true}>
                    <PreviewAndCustomise
                        userConsents={userConsents}
                        closeModal={() => setPreviewAndCustomise(null)}
                        refetchUserConsent={refetchUserConsent}
                        storeId={storeId}
                        storeName={storeName}
                    />
                </StoreModal>
                <StoreModal
                    isVisible={isPolicyhistory}
                    removePadding={true}
                    title={
                        <div>
                            <div className='px-4 py-3'>{t('labels:policy_history')}</div>
                            <Divider style={{ margin: 0, width: '100%' }} type='horizontal' />
                        </div>
                    }
                    isSpin={false}
                    cancelCallback={() => setIsPolicyHistory(null)}
                    width={900}
                    destroyOnClose={true}>
                    <PolicyHistory></PolicyHistory>
                </StoreModal>
            </div>
        </Content>
    )
}
export default PoliciesSettings
