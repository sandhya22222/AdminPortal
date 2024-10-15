import { Button } from '../../../shadcnComponents/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '../../../shadcnComponents/ui/card'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../../../shadcnComponents/ui/dropdownMenu'
import { Input } from '../../../shadcnComponents/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../shadcnComponents/ui/tooltip'
import { ChevronDown, Eye, Info, Plus, Trash2 } from 'lucide-react'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RiTranslate2 } from 'react-icons/ri'
import ReactQuill from 'react-quill'
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

const Link = ReactQuill.Quill.import('formats/link')
Link.sanitize = function (url) {
    const trimmedURL = url?.trim()
    if (!trimmedURL.startsWith('http://') && !trimmedURL.startsWith('https://')) {
        return `https://${trimmedURL}`
    }
    return trimmedURL
}

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote'],
        ['link'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ color: [] }, { background: [] }],
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

export default function PolicyCard({
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
}) {
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
            setConsentName(consentDetails.consent_name)
            setDescription(consentDetails.consent_description)
        }
    }, [consentDetails])

    useEffect(() => {
        if (policyStatus === 2) {
            setConsentDisplayName(consentDetails?.consent_display_name)
            setConsentDiscriptionDisplayName(consentDetails?.consent_display_description)
        }
    }, [consentDetails, policyStatus])

    const addVersionHandler = () => setAddVersion(true)
    const handleVersionHistory = () => setVersionHistory(true)
    const handleTranslateVersion = () => setTranslatePolicy(true)
    const handelConsentNameChange = (name) => setConsentName(name)
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
        const body = { status: 2 }
        publishUserConsent(
            { body, userConsentVersionId: consentDetails?.id },
            {
                onSuccess: (response) => {
                    refetchUserConsent()
                    MarketplaceToaster.showToast(response)
                    setPolicyConfirmation(false)
                    setTimeout(() => {
                        setDescriptionModified(false)
                    }, 300)
                },
                onError: (err) => {
                    MarketplaceToaster.showToast(err.response)
                },
            }
        )
    }

    const handelSaveConsent = () => {
        const body = { store: Number(storeId) }
        if (isConsentNameChanged) body.consent_name = consentName?.trim()
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
                        }, 100)
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
                        refetchUserConsent()
                        toast(response?.response_message, { type: 'success' })
                        setTimeout(() => {
                            setDescriptionModified(false)
                        }, 300)
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

    const handlePublishModelConfirmation = () => setPolicyConfirmation(true)
    const handlePolicyChangeWarningModal = () => setPolicyChangeWarning(true)

    const getDate = (date) => {
        try {
            return moment(date).format('D MMM YYYY, h:mm:ss')
        } catch (error) {
            return ''
        }
    }

    return (
        <Card className='w-full mb-5 '>
            <CardHeader className='flex flex-row items-center justify-between py-4'>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <h3 className='text-lg font-medium truncate max-w-[360px]'>
                                {consentName?.substring(0, 50) || t('labels:untitled_policy')}
                            </h3>
                        </TooltipTrigger>
                        <TooltipContent>{consentName}</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <div className='flex items-center space-x-2'>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className='flex flex-row '>
                                <Button
                                    variant='outline'
                                    className='w-[87px] border-none   text-sm'
                                    disabled={policyStatus !== 2}>
                                    <span>
                                        {t('labels:version') +
                                            (consentDetails?.version_number === 1
                                                ? '1.0'
                                                : consentDetails?.version_number || '1.0')}
                                    </span>
                                </Button>
                                <ChevronDown
                                    className={`ml-0 mt-2 ${policyStatus !== 2 ? 'text-muted-foreground' : ''}`}
                                />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onSelect={handleVersionHistory}>
                                <Eye className='mr-2 h-4 w-4' />
                                <span>{t('labels:view_version_history')}</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant='outline' onClick={addVersionHandler} disabled={policyStatus !== 2}>
                        <Plus className='mr-2 h-4 w-4' />
                        {t('labels:add_version')}
                    </Button>
                    <Button
                        variant='outline'
                        onClick={handleTranslateVersion}
                        disabled={
                            !(policyStatus === 1 || policyStatus === 2) || isConsentNameChanged || descriptionModified
                        }>
                        <RiTranslate2 className='mr-2 h-4 w-4' />
                        {t('labels:translate')}
                    </Button>
                    {policyType !== 'CONTACT_POLICY' && (
                        <Button variant='destructive' onClick={() => handelDeletePolicy(consent?.id)}>
                            <Trash2 className='mr-2 h-4 w-4' />
                            {t('labels:delete_policy')}
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {policyType !== 'CONTACT_POLICY' && (
                    <div className='mb-4'>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                            {t('labels:policy_title')}
                            <span className='text-red-500 ml-1'>*</span>
                        </label>
                        <Input
                            disabled={policyStatus === 2}
                            placeholder={t('labels:untitled_policy')}
                            onChange={(e) => handelConsentNameChange(e.target.value)}
                            maxLength={CONSENT_NAME_LENGTH}
                            onBlur={(e) => {
                                if (e.target.value) {
                                    handelConsentNameChange(e.target.value.trim().replace(/\s+/g, ' '))
                                }
                            }}
                            value={policyStatus === 2 ? consentDisplayName : consentName}
                            className='max-w-[40%] ml-4'
                        />
                    </div>
                )}
                <div className='mb-4 '>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                        {t('labels:policy_description')}
                        <span className='text-red-500 ml-1'>*</span>
                    </label>

                    <ReactQuill
                        theme='snow'
                        value={description}
                        readOnly={policyStatus === 2}
                        onChange={handelDescriptionChange}
                        modules={modules}
                        formats={formats}
                        placeholder={t('labels:enter_policy_description')}
                        className={`w-[600px] min-h-[100px] h-auto px-3 py-1.5 overflow-hidden ${policyStatus === 2 ? 'opacity-40 bg-gray-100' : ''}`}
                    />
                </div>
                <div className='flex items-center text-sm text-gray-500'>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className='mr-1 h-4 w-4' />
                            </TooltipTrigger>
                            <TooltipContent>{t('messages:last_update_info')}</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <span>{t('labels:last_updated')}</span>
                    {policyStatus !== 2 ? (
                        <span className='ml-1'>{t('messages:not_updated_yet')}</span>
                    ) : (
                        <span className='font-semibold ml-1'>
                            {getDate(consent?.version_details[0]?.updated_on) || ''}
                        </span>
                    )}
                </div>
            </CardContent>
            {policyStatus !== 2 && (
                <CardFooter className='flex justify-start space-x-2'>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    disabled={!(consentName?.trim() && descriptionText?.trim())}
                                    onClick={
                                        policyStatus === 1 && !isConsentNameChanged && !descriptionModified
                                            ? handlePublishModelConfirmation
                                            : handelSaveConsent
                                    }
                                    loading={
                                        createNewUserConsentStatus === 'pending' ||
                                        UpdateUserConsentStatus === 'pending'
                                    }>
                                    {policyStatus === 1 && !isConsentNameChanged && !descriptionModified
                                        ? t('labels:publish')
                                        : t('labels:save')}
                                </Button>
                            </TooltipTrigger>
                            {!descriptionText?.trim() && consentName?.trim() && (
                                <TooltipContent>{t('messages:please_add_description')}</TooltipContent>
                            )}
                        </Tooltip>
                    </TooltipProvider>
                    {(policyStatus !== 1 || isConsentNameChanged || descriptionModified) && (
                        <Button
                            variant='outline'
                            onClick={policyStatus === 1 ? handlePolicyChangeWarningModal : handelCancelDescription}
                            disabled={
                                createNewUserConsentStatus === 'pending' ||
                                UpdateUserConsentStatus === 'pending' ||
                                !(consentName?.trim() && descriptionText?.trim())
                            }>
                            {t('labels:cancel')}
                        </Button>
                    )}
                </CardFooter>
            )}
            <StoreModal
                isVisible={versionHistory}
                removePadding={true}
                title={
                    <div>
                        <div className='px-4 py-3'>{t('labels:version_history')}</div>
                        <hr className='border-t border-gray-200' />
                    </div>
                }
                isSpin={false}
                cancelCallback={() => setVersionHistory(false)}
                width={940}
                destroyOnClose={true}>
                <VersionHistory
                    userConsentId={consent?.id}
                    refetchUserConsent={refetchUserConsent}
                    setVersionHistory={setVersionHistory}
                />
            </StoreModal>
            <StoreModal
                isVisible={addVersion}
                title={<h2 className='text-xl font-bold text-gray-900'>{t('labels:add_version')}</h2>}
                isSpin={false}
                cancelCallback={() => setAddVersion(false)}
                width={400}
                destroyOnClose={true}>
                <AddVersion
                    versionNumber={consentDetails?.version_number}
                    storeId={storeId}
                    consentId={consent?.id}
                    refetchUserConsent={refetchUserConsent}
                    setAddVersion={setAddVersion}
                />
            </StoreModal>
            <StoreModal
                isVisible={translatePolicy}
                title={<h2 className='text-xl font-bold text-gray-900'>{t('labels:translate')}</h2>}
                isSpin={false}
                cancelCallback={() => setTranslatePolicy(false)}
                width={1000}
                height={550}
                destroyOnClose={true}>
                <TranslatePolicy
                    userConsentVersionId={consentDetails?.id}
                    userConsentBaseName={consentDetails?.consent_name}
                    userConsentBaseDescription={consentDetails?.consent_description}
                    storeId={storeId}
                    setTranslatePolicy={setTranslatePolicy}
                    storeUUID={storeUUID}
                    refetchUserConsent={refetchUserConsent}
                    policyStatus={policyStatus}
                />
            </StoreModal>
            <StoreModal
                isVisible={policyConfirmation}
                title={<h2 className='text-xl font-bold text-gray-900'>{t('labels:publish_policy_confirmation')}</h2>}
                isSpin={publishUserConsentStatus === 'pending'}
                cancelCallback={() => setPolicyConfirmation(false)}
                width={500}
                okButtonText={t('labels:publish')}
                cancelButtonText={t('labels:cancel')}
                okCallback={() => handelPublishConsent()}
                destroyOnClose={true}>
                <div className='text-gray-600'>
                    <p>{t('messages:policy_confirmation_message')}</p>
                    <p>{t('messages:policy_confirmation_note')}</p>
                </div>
            </StoreModal>
            <StoreModal
                isVisible={policyChangeWarning}
                title={<h2 className='text-xl font-bold text-gray-900'>{t('labels:confirm')}</h2>}
                isSpin={false}
                cancelCallback={() => setPolicyChangeWarning(false)}
                width={380}
                destroyOnClose={true}>
                <div className='text-gray-600'>
                    <p>
                        {t('messages:policy_change_warning_info', { version })}
                        <br />
                        {t('messages:policy_change_warning_message')}
                    </p>
                </div>
                <div className='flex justify-end mt-4'>
                    <Button onClick={() => handelCancelDescription()}>{t('labels:proceed')}</Button>
                </div>
            </StoreModal>
        </Card>
    )
}
