import { DownOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Divider, Dropdown, Input, Tooltip, Typography } from 'antd'
import moment from 'moment/moment'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RiDeleteBin6Fill, RiInformationFill, RiTranslate2 } from 'react-icons/ri'
import ReactQuill, { Quill } from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { toast } from 'react-toastify'
import StoreModal from '../../../components/storeModal/StoreModal'
import MarketplaceToaster from '../../../util/marketplaceToaster'
import useCreateUserConsent from '../hooks/useCreateUserConsent'
import usePublishUserConsent from '../hooks/usePublishUserConsent'
import useUpdateUserConsent from '../hooks/useUpdateUserConsent'
import AddVersion from './AddVersion'
import TranslatePolicy from './TranslatePolicy'
import VersionHistory from './VersionHistory'
const { Text } = Typography
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
    storeUUID,
}) => {
    const { t } = useTranslation()
    const { mutate: UpdateUserConsent, status: UpdateUserConsentStatus } = useUpdateUserConsent()
    const { mutate: createNewUserConsent, status: createNewUserConsentStatus } = useCreateUserConsent()
    const { mutate: publishUserConsent, status: publishUserConsentStatus } = usePublishUserConsent()
    const [consentDisplayName, setConsentDisplayName] = useState('')
    const [consentDiscriptionDisplayName, setConsentDiscriptionDisplayName] = useState('')
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

    useEffect(() => {
        if (policyStatus === 2) {
            setConsentDisplayName(consentDetails?.consent_display_name)
            setConsentDiscriptionDisplayName(consentDetails?.consent_display_description)
        }
    }, [consentDetails, policyStatus])

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
        setConsentName(name)
    }
    const handelCancelPolicyName = () => {
        if (policyType !== 'CONTACT_POLICY') {
            setConsentName(consentDetails?.consent_name || '')
        }
        setPolicyChangeWarning(false)
    }

    const handelDescriptionChange = (content, delta, source, editor) => {
        if ((policyStatus === 1 || isNewPolicy) && source === 'user') {
            setDescription(content)
            setDescriptionText(editor.getText(content)?.trim())
            if (!descriptionModified) setDescriptionModified(true)
        }
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
                    setPolicyConfirmation(false)
                    setTimeout(() => {
                        setDescriptionModified(false)
                    }, [300])
                },
                onError: (err) => {
                    MarketplaceToaster.showToast(err.response)
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
                        setTimeout(() => {
                            setAddNewPolicy(false)
                        }, [100])
                    },
                    onError: (err) => {
                        MarketplaceToaster.showToast(err?.response)
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
            const formattedDate = moment(date).format('D MMM YYYY, h:mm:ss')
            return formattedDate
        } catch (error) {
            return ''
        }
    }

    return (
        <div
            key={consent?.id}
            className=' bg-white pb-6 policy-card w-full mb-3 px-4 mt-2'
            style={{ boxShadow: 'rgb(217, 217, 217) 0px 0px 10px', borderRadius: '10px' }}>
            <div className=' h-[64px] flex justify-between items-center  w-full'>
                <div
                    className={`gap-x-2 cursor-default `}
                    style={{
                        maxWidth: '360px',
                        display: 'inline-block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}>
                    <Text
                        className=' !font-medium text-base !mb-0 '
                        ellipsis={{
                            tooltip: {
                                title: consentName,
                                mouseLeaveDelay: 0,
                                mouseEnterDelay: 0.5,
                                placement: 'right',
                            },
                        }}>
                        {consentName?.substring(0, 50) || t('labels:untitled_policy')}
                    </Text>
                </div>
                <div className='flex justify-end '>
                    <div className='flex items-center  !pl-3'>
                        <Dropdown
                            className='w-[87px] cursor-pointer'
                            disabled={policyStatus !== 2}
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
                            <Text>
                                {t('labels:version') +
                                    (consentDetails?.version_number === 1
                                        ? '1.0'
                                        : consentDetails?.version_number || '1.0') || t('labels:version') + '1.0'}
                                <DownOutlined className={policyStatus !== 2 ? '!text-[#857e7e40] mx-1' : 'mx-1'} />
                            </Text>
                        </Dropdown>
                    </div>
                    <div className='!mx-2'>
                        <Button
                            icon={<PlusOutlined />}
                            disabled={policyStatus !== 2}
                            onClick={addVersionHandler}
                            className='app-btn-secondary'>
                            {t('labels:add_version')}
                        </Button>
                    </div>
                    <div className={policyType !== 'CONTACT_POLICY' ? 'mr-2' : ''}>
                        <Button
                            className='flex items-center app-btn-secondary'
                            icon={<RiTranslate2 />}
                            disabled={
                                !(
                                    (policyStatus === 1 || policyStatus === 2) &&
                                    !isConsentNameChanged &&
                                    !descriptionModified
                                )
                            }
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
                        <label className='text-[13px] mb-3 flex  input-label-color'>
                            {t('labels:policy_title')}
                            <p className={`mandatory-symbol-color text-sm mx-1 mt-[2px] font-medium`}>*</p>
                        </label>
                        <div className=' flex items-center gap-x-5 max-w-[40%] w-full pb-3'>
                            <Input
                                disabled={policyStatus === 2}
                                placeholder={t('labels:untitled_policy')}
                                autoFocus={policyStatus === 2}
                                onChange={(e) => handelConsentNameChange(e.target?.value)}
                                maxLength={CONSENT_NAME_LENGTH}
                                onBlur={(e) => {
                                    if (e.target?.value) {
                                        handelConsentNameChange(e.target.value.trim().replace(/\s+/g, ' '))
                                    }
                                }}
                                value={policyStatus === 2 ? consentDisplayName : consentName}
                            />
                        </div>
                    </>
                )}
                <label className='text-[13px] flex  mb-3 input-label-color'>
                    {t('labels:policy_description')}
                    <p className={`mandatory-symbol-color text-sm mx-1 mt-[2px] font-medium`}>*</p>
                </label>
                <div
                    className=' rounded border-[1px] drop-shadow-sm shadow-[#D9D9D9] border-[#D9D9D9] overflow-hidden bg-white   w-full'
                    data-text-editor={'policyCard'}>
                    <ReactQuill
                        theme='snow'
                        value={description}
                        className={policyStatus === 2 ? 'opacity-40 bg-[#00000014]' : ''}
                        readOnly={policyStatus === 2}
                        onChange={handelDescriptionChange}
                        modules={modules}
                        formats={formats}
                        placeholder={t('labels:enter_policy_description')}
                        bounds={`[data-text-editor=policyCard]`}
                    />
                </div>
            </div>
            <div className=' mt-2 flex items-center '>
                <Tooltip
                    overlayStyle={{ position: 'fixed', maxWidth: '2000px' }}
                    placement='right'
                    title={<span className='whitespace-nowrap'>{t('messages:last_update_info')}</span>}>
                    <RiInformationFill className=' text-base mr-1 cursor-pointer text-[#000000] text-opacity-50' />
                </Tooltip>
                <span className='text-[#000000] text-opacity-50'>{t('labels:last_updated')}</span>
                {policyStatus !== 2 ? (
                    <>{' : ' + t('messages:not_updated_yet')}</>
                ) : (
                    <span className='font-semibold'>
                        {' : ' + getDate(consent?.version_details[0]?.updated_on) || ''}
                    </span>
                )}
            </div>
            {policyStatus !== 2 ? (
                <div className='gap-2 mt-6 flex'>
                    <div>
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
                                loading={
                                    createNewUserConsentStatus === 'pending' || UpdateUserConsentStatus === 'pending'
                                }>
                                {policyStatus === 1 && !isConsentNameChanged && !descriptionModified
                                    ? t('labels:publish')
                                    : t('labels:save')}
                            </Button>
                        </Tooltip>
                    </div>
                    {(policyStatus !== 1 || isConsentNameChanged || descriptionModified) && (
                        <div>
                            <Button
                                className='app-btn-secondary'
                                onClick={policyStatus === 1 ? handlePolicyChangeWarningModal : handelCancelDescription}
                                disabled={
                                    createNewUserConsentStatus === 'pending' ||
                                    UpdateUserConsentStatus === 'pending' ||
                                    !(consentName?.trim() && descriptionText?.trim())
                                }>
                                {t('labels:cancel')}
                            </Button>
                        </div>
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
                width={940}
                destroyOnClose={true}>
                <VersionHistory
                    userConsentId={consent?.id}
                    refetchUserConsent={refetchUserConsent}
                    setVersionHistory={setVersionHistory}></VersionHistory>
            </StoreModal>
            <StoreModal
                isVisible={addVersion}
                title={
                    <div className='text-regal-blue font-bold text-[18px] leading-[26px]'>
                        {t('labels:add_version')}
                    </div>
                }
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
                title={
                    <div className='text-regal-blue font-bold text-[18px] leading-[26px]'>{t('labels:translate')}</div>
                }
                isSpin={false}
                cancelCallback={() => setTranslatePolicy(false)}
                width={1088}
                destroyOnClose={true}>
                <TranslatePolicy
                    userConsentVersionId={consentDetails?.id}
                    userConsentBaseName={consentDetails?.consent_name}
                    userConsentBaseDescription={consentDetails?.consent_description}
                    storeId={storeId}
                    setTranslatePolicy={setTranslatePolicy}
                    storeUUID={storeUUID}
                    refetchUserConsent={refetchUserConsent}
                    policyStatus={policyStatus}></TranslatePolicy>
            </StoreModal>
            <StoreModal
                isVisible={policyConfirmation}
                title={
                    <div className='text-regal-blue font-bold text-[18px] leading-[26px]'>
                        {t('labels:publish_policy_confirmation')}
                    </div>
                }
                isSpin={publishUserConsentStatus === 'pending'}
                cancelCallback={() => setPolicyConfirmation(false)}
                width={500}
                okButtonText={t('labels:publish')}
                cancelButtonText={t('labels:cancel')}
                okCallback={() => handelPublishConsent()}
                destroyOnClose={true}>
                <div className='pt-[6px] text-brandGray1'>
                    <p className='!mb-0'>{t('messages:policy_confirmation_message')}</p>
                    <p>{t('messages:policy_confirmation_note')}</p>
                </div>
            </StoreModal>
            <StoreModal
                isVisible={policyChangeWarning}
                title={
                    <div className='text-regal-blue font-bold text-[18px] leading-[26px]'>{t('labels:confirm')}</div>
                }
                isSpin={false}
                cancelCallback={() => setPolicyChangeWarning(false)}
                width={380}
                destroyOnClose={true}>
                <div className='text-brandGray1'>
                    <p>
                        {t('messages:policy_change_warning_info', {
                            version,
                        })}
                        <br />
                        {t('messages:policy_change_warning_message')}
                    </p>
                </div>
                <div className='flex justify-end'>
                    <Button className='app-btn-primary' onClick={() => handelCancelDescription()}>
                        {t('labels:proceed')}
                    </Button>
                </div>
            </StoreModal>
        </div>
    )
}
export default PolicyCard
