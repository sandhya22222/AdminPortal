import { DownOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Divider, Dropdown, Input, Space, Tooltip, Typography } from 'antd'
import moment from 'moment/moment'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RiInformationFill, RiTranslate2, RiDeleteBin6Fill, RiInformationLine } from 'react-icons/ri'
import ReactQuill, { Quill } from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { toast } from 'react-toastify'
import StoreModal from '../../../components/storeModal/StoreModal'
import useCreateUserConsent from '../hooks/useCreateUserConsent'
import useUpdateUserConsent from '../hooks/useUpdateUserConsent'
import AddVersion from './AddVersion'
import TranslatePolicy from './TranslatePolicy'
import VersionHistory from './VersionHistory'
import usePublishUserConsent from '../hooks/usePublishUserConsent'
import MarketplaceToaster from '../../../util/marketplaceToaster'

const { Paragraph } = Typography
const Link = Quill.import('formats/link')
Link.sanitize = function (url) {
    const trimmedURL = url?.trim()
    // quill by default creates relative links if scheme is missing.
    if (!trimmedURL.startsWith('http://') && !trimmedURL.startsWith('https://')) {
        return `https://${trimmedURL}`
    }
    return trimmedURL
}

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        // [{ size: ["small", false, "large", "huge"] }], // custom dropdown
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        ['blockquote'],
        ['link'],
        // [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
        // [{ direction: "rtl" }], // text direction
        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ align: [] }],
        ['clean'],
    ],
}

const formats = [
    'background',
    'bold',
    'color',
    'font',
    'code',
    'italic',
    'link',
    'size',
    'strike',
    'underline',
    'blockquote',
    'header',
    'indent',
    'list',
    'align',
    'direction',
    // 'code-block',
    // 'formula',
    // 'image'
    // 'video',
    'script',
]
const CONSENT_NAME_LENGTH = 100

const PolicyCard = ({
    consent,
    refetchUserConsent,
    isNewPolicy,
    setAddNewPolicy,
    policyName,
    handelDeletePolicy,
    storeId,
    policyType,
    consentDetails,
    policyStatus,
    version,
}) => {
    const { t } = useTranslation()
    const { mutate: UpdateUserConsent, status: UpdateUserConsentStatus } = useUpdateUserConsent()
    const { mutate: createNewUserConsent, status: createNewUserConsentStatus } = useCreateUserConsent()
    const { mutate: publishUserConsent, status: publishUserConsentStatus } = usePublishUserConsent()
    const [consentName, setConsentName] = useState(consentDetails?.consent_name || policyName)
    const [description, setDescription] = useState(consentDetails?.consent_description)
    const [descriptionText, setDescriptionText] = useState(consentDetails?.consent_description)
    const [descriptionModified, setDescriptionModified] = useState(false)
    const [policyConfirmation, setPolicyConfirmation] = useState(false)
    const isConsentNameChanged = isNewPolicy
        ? !!consentName
        : consentName?.trim() !== consentDetails?.consent_name?.trim()
    const [versionHistory, setVersionHistory] = useState(false)
    const [addVersion, setAddVersion] = useState(false)
    const [translatePolicy, setTranslatePolicy] = useState(false)
    const [policyChangeWarning, setPolicyChangeWarning] = useState(false)

    useEffect(() => {
        if (consentDetails?.consent_name && consentDetails?.consent_description) {
            setConsentName(consentDetails?.consent_name)
            setDescription(consentDetails?.consent_description)
        }
    }, [consentDetails])

    const addVersionHandler = () => {
        setAddVersion(true)
    }

    const handleVersionHistory = () => {
        setVersionHistory(true)
    }

    const handleTranslateVersion = () => {
        setTranslatePolicy(true)
    }
    const handelConsentNameChange = (name) => {
        if (name?.length > CONSENT_NAME_LENGTH) return
        setConsentName(name)
    }
    const handelCancelPolicyName = () => {
        if (policyType !== 'CONTACT_POLICY') {
            setConsentName(consentDetails?.consent_name || '')
        }
        setPolicyChangeWarning(false)
    }

    const handelDescriptionChange = (content, delta, source, editor) => {
        setDescription(content)
        setDescriptionText(editor.getText(content)?.trim())
        if (!descriptionModified) setDescriptionModified(true)
    }

    const handelPublishConsent = () => {
        const body = {
            status: 2,
        }
        publishUserConsent(
            { body, userConsentVersionId: consentDetails?.id },
            {
                onSuccess: (response) => {
                    refetchUserConsent()
                    MarketplaceToaster.showToast(response)
                    // toast(t('Policy updated successfully'), {
                    //     type: 'success',
                    // })
                    setPolicyConfirmation(false)
                },
                onError: (err) => {
                    MarketplaceToaster.showToast(err.response)
                    // toast(err?.response?.data?.response_message || t('messages:error_saving_policy'), {
                    //     type: 'error',
                    // })
                },
            }
        )
    }

    const handelSaveConsent = () => {
        const body = {
            store: Number(storeId),
        }

        if (isConsentNameChanged) {
            body.consent_name = consentName?.trim()
        }
        if (descriptionModified) body.consent_description = description

        if (isNewPolicy) {
            createNewUserConsent(
                { body },
                {
                    onSuccess: (response) => {
                        refetchUserConsent()
                        MarketplaceToaster.showToast(response)
                        // toast(t('messages:policy_saved_successfully'), {
                        //     type: 'success',
                        // })
                        setTimeout(() => {
                            setAddNewPolicy(false)
                        }, [100])
                    },
                    onError: (err) => {
                        MarketplaceToaster.showToast(err?.response)
                        // toast(err?.response?.data?.response_message || t('messages:error_saving_policy'), {
                        //     type: 'error',
                        // })
                    },
                }
            )
        } else {
            UpdateUserConsent(
                { body, userConsentVersionId: consentDetails?.id },
                {
                    onSuccess: (response) => {
                        // MarketplaceToaster.showToast(response?.response_message)
                        refetchUserConsent()
                        toast(response?.response_message, {
                            type: 'success',
                        })
                        setTimeout(() => {
                            setDescriptionModified(false)
                        }, [300])
                    },
                    onError: (err) => {
                        MarketplaceToaster.showToast(err?.response)
                        // toast(err?.response?.data?.response_message || t('messages:error_saving_policy'), {
                        //     type: 'error',
                        // })
                    },
                }
            )
        }
    }

    const handelCancelDescription = () => {
        setDescriptionModified(false)
        setDescription(consentDetails?.consent_description)
        setDescriptionText(consentDetails?.consent_description)
        handelCancelPolicyName()
    }

    const handlePublishModelConfirmation = () => {
        setPolicyConfirmation(true)
    }

    const handlePolicyChangeWarningModal = () => {
        setPolicyChangeWarning(true)
    }

    const getDate = (date) => {
        try {
            const formattedDate = moment(date).format('D MMM YYYY')
            return formattedDate
        } catch (error) {
            return ''
        }
    }

    return (
        <div key={consent?.id} className=' bg-white  pb-6 policy-card w-full shadow-md rounded-md mb-3 px-4 pt-2'>
            <div className=' h-[64px] flex justify-between items-center  w-full'>
                <div className={`flex items-center gap-x-2 max-w-[60%] cursor-default `}>
                    <Paragraph className=' !font-medium text-base !mb-0  ' ellipsis={{ tooltip: consentName }}>
                        {consentName?.substring(0, 50) || t('labels:untitled_policy')}
                    </Paragraph>
                </div>
                <div className='flex justify-end'>
                    <div className='flex items-center'>
                        <Dropdown
                            className='w-[96px]'
                            disabled={!(policyStatus === 2)}
                            menu={{
                                items: [
                                    {
                                        label: `${t('labels:view_version_history')}`,
                                        key: 'view_version_history',
                                        icon: <EyeOutlined />,
                                    },
                                ],
                                onClick: handleVersionHistory,
                            }}
                            placement='bottomRight'
                            arrow>
                            <Space>
                                {consentDetails?.version_name || 'Version 1.0'}
                                <DownOutlined className={!(policyStatus === 2) ? '!text-[#857e7e40]' : ''} />
                            </Space>
                        </Dropdown>
                    </div>
                    <div className='mx-2'>
                        <Button icon={<PlusOutlined />} disabled={!(policyStatus === 2)} onClick={addVersionHandler}>
                            {t('labels:add_version')}
                        </Button>
                    </div>
                    <div className={policyType !== 'CONTACT_POLICY' ? 'mr-2' : ''}>
                        <Button
                            className='flex items-center'
                            icon={<RiTranslate2 />}
                            disabled={!(policyStatus === 2)}
                            onClick={handleTranslateVersion}>
                            {t('labels:translate')}
                        </Button>
                    </div>
                    <div>
                        {policyType !== 'CONTACT_POLICY' && (
                            <div>
                                <Button
                                    danger
                                    className='flex items-center'
                                    icon={<RiDeleteBin6Fill />}
                                    onClick={() => handelDeletePolicy(consent?.id)}>
                                    {t('labels:delete_policy')}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div>
                {policyType !== 'CONTACT_POLICY' && (
                    <>
                        <label className='text-[13px] mb-3 input-label-color'>{t('labels:policy_title')}</label>
                        <div className=' flex items-center gap-x-5 max-w-[40%] w-full pb-3'>
                            <Input
                                disabled={policyStatus === 2}
                                placeholder={t('labels:untitled_policy')}
                                autoFocus={policyStatus === 2}
                                onChange={(e) => handelConsentNameChange(e.target?.value)}
                                value={consentName}
                            />
                        </div>
                    </>
                )}
                <label className='text-[13px] mb-3 input-label-color'>{t('labels:policy_description')}</label>
                <div
                    className=' rounded border-[1px] drop-shadow-sm shadow-[#D9D9D9] border-[#D9D9D9] overflow-hidden bg-white   w-full'
                    data-text-editor={'policyCard'}>
                    <ReactQuill
                        theme='snow'
                        value={description}
                        className={policyStatus === 2 ? 'opacity-40 bg-[#00000014]' : ''}
                        readOnly={policyStatus === 2}
                        onChange={(policyStatus === 1 || isNewPolicy) && handelDescriptionChange}
                        modules={modules}
                        formats={formats}
                        bounds={`[data-text-editor=policyCard]`}
                    />
                </div>
            </div>
            <div className=' mt-2 flex items-center text-[#000000] text-opacity-50'>
                <Tooltip
                    overlayStyle={{ position: 'fixed', maxWidth: '2000px' }}
                    placement='right'
                    title={<span className='whitespace-nowrap'>{t('messages:last_update_info')}</span>}>
                    <RiInformationFill className=' text-base mr-1 cursor-pointer' />
                </Tooltip>
                {t('labels:last_updated')} :{' '}
                {!(policyStatus === 2) ? <>{t('messages:not_updated_yet')}</> : getDate(consent?.updated_on) || ''}
            </div>
            {policyStatus !== 2 ? (
                <div className=' space-x-2 mt-6'>
                    <Tooltip
                        overlayStyle={{ position: 'fixed', maxWidth: '2000px' }}
                        placement='right'
                        title={
                            !descriptionText?.trim() && consentName?.trim() ? (
                                <span className='whitespace-nowrap'>{t('messages:please_add_description')}</span>
                            ) : (
                                ''
                            )
                        }>
                        <Button
                            className='app-btn-primary '
                            disabled={!(consentName?.trim() && descriptionText?.trim())}
                            onClick={
                                policyStatus === 1 && !isConsentNameChanged && !descriptionModified
                                    ? handlePublishModelConfirmation
                                    : handelSaveConsent
                            }
                            loading={createNewUserConsentStatus === 'pending' || UpdateUserConsentStatus === 'pending'}>
                            {policyStatus === 1 && !isConsentNameChanged && !descriptionModified
                                ? t('labels:publish')
                                : t('labels:save')}
                        </Button>
                    </Tooltip>
                    {(policyStatus !== 1 || isConsentNameChanged || descriptionModified) && (
                        <Button
                            onClick={policyStatus === 1 ? handlePolicyChangeWarningModal : handelCancelDescription}
                            disabled={
                                createNewUserConsentStatus === 'pending' ||
                                UpdateUserConsentStatus === 'pending' ||
                                !(consentName?.trim() && descriptionText?.trim())
                            }>
                            {t('labels:cancel')}
                        </Button>
                    )}
                </div>
            ) : null}
            <StoreModal
                isVisible={versionHistory}
                removePadding={true}
                title={
                    <div>
                        <div className='px-4 py-3'>{t('labels:version_history')}</div>
                        <Divider style={{ margin: 0, width: '100%' }} type='horizontal' />
                    </div>
                }
                isSpin={false}
                cancelCallback={() => setVersionHistory(false)}
                width={900}
                destroyOnClose={true}>
                <VersionHistory
                    userConsentId={consent?.id}
                    refetchUserConsent={refetchUserConsent}
                    setVersionHistory={setVersionHistory}></VersionHistory>
            </StoreModal>
            <StoreModal
                isVisible={addVersion}
                title={t('labels:add_version')}
                isSpin={false}
                cancelCallback={() => setAddVersion(false)}
                width={400}
                destroyOnClose={true}>
                <AddVersion
                    versionNumber={consentDetails?.version_number}
                    storeId={storeId}
                    consentId={consent?.id}
                    refetchUserConsent={refetchUserConsent}
                    setAddVersion={setAddVersion}></AddVersion>
            </StoreModal>
            <StoreModal
                isVisible={translatePolicy}
                title={t('labels:translate')}
                isSpin={false}
                cancelCallback={() => setTranslatePolicy(false)}
                width={1088}
                destroyOnClose={true}>
                <TranslatePolicy
                    userConsentVersionId={consentDetails?.id}
                    userConsentBaseName={consentDetails?.consent_name}
                    userConsentBaseDescription={consentDetails?.consent_description}
                    storeId={storeId}
                    setTranslatePolicy={setTranslatePolicy}></TranslatePolicy>
            </StoreModal>
            <StoreModal
                isVisible={policyConfirmation}
                title={t('labels:publish_policy_confirmation')}
                isSpin={publishUserConsentStatus === 'pending'}
                cancelCallback={() => setPolicyConfirmation(false)}
                width={500}
                okButtonText={t('labels:publish')}
                cancelButtonText={t('labels:cancel')}
                okCallback={() => handelPublishConsent()}
                destroyOnClose={true}>
                <div className='pt-4'>
                    <p>{t('messages:policy_confirmation_message')}</p>
                    <p>{t('messages:policy_confirmation_note')}</p>
                </div>
            </StoreModal>
            <StoreModal
                isVisible={policyChangeWarning}
                title={
                    <div className='flex items-center'>
                        <RiInformationLine className='text-2xl mr-2' />
                        {t('labels:confirm')}
                    </div>
                }
                isSpin={false}
                cancelCallback={() => setPolicyChangeWarning(false)}
                okCallback={() => handelCancelDescription()}
                width={400}
                okButtonText={t('labels:proceed')}
                cancelButtonText={t('labels:cancel')}
                destroyOnClose={true}
                hideCloseButton={false}>
                <div className='pl-[30px]'>
                    <p>
                        {t('messages:policy_change_warning_info', {
                            version,
                        })}
                        <br />
                        {t('messages:policy_change_warning_message')}
                    </p>
                </div>
            </StoreModal>
        </div>
    )
}
export default PolicyCard
