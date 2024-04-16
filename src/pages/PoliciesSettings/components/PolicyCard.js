import { Button, Typography, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import { useEffect, useMemo, useRef, useState } from 'react'
import ReactQuill, { Quill } from 'react-quill'
import moment from 'moment/moment'
import { toast } from 'react-toastify'
import { ConsentEditIcon } from '../../../constants/media'
import useUpdateUserConsent from '../hooks/useUpdateUserConsent'
import 'react-quill/dist/quill.snow.css'
import useCreateUserConsent from '../hooks/useCreateUserConsent'

const { Title, Paragraph } = Typography
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
}) => {
    const { t } = useTranslation()
    const { mutate: UpdateUserConsent, status: UpdateUserConsentStatus } = useUpdateUserConsent()
    const { mutate: createNewUserConsent, status: createNewUserConsentStatus } = useCreateUserConsent()

    const [consentName, setConsentName] = useState(consent?.name || policyName)
    const [description, setDescription] = useState(consent?.description)
    const [descriptionText, setDescriptionText] = useState(consent?.description)
    const [descriptionModified, setDescriptionModified] = useState(false)

    const isConsentNameChanged = isNewPolicy ? !!consentName : consentName?.trim() !== consent?.name?.trim()

    const handelConsentNameChange = (name) => {
        if (name?.length > CONSENT_NAME_LENGTH) return
        setConsentName(name)
    }
    const handelCancelPolicyName = () => {
        if (policyType !== 'CONTACT_POLICY') {
            setConsentName(consent?.name || '')
        }
    }

    const handelDescriptionChange = (content, delta, source, editor) => {
        setDescription(content)
        setDescriptionText(editor.getText(content)?.trim())
        if (!descriptionModified) setDescriptionModified(true)
    }

    const handelSaveConsent = () => {
        const body = {
            store: Number(storeId),
        }

        if (isConsentNameChanged) {
            body.name = consentName?.trim()
            body.display_name = consentName?.trim()
        }
        if (descriptionModified) body.description = description

        if (isNewPolicy) {
            createNewUserConsent(
                { body },
                {
                    onSuccess: () => {
                        refetchUserConsent()
                        toast(t('messages:policy_saved_successfully'), {
                            type: 'success',
                        })
                        setTimeout(() => {
                            setAddNewPolicy(false)
                        }, [100])
                    },
                    onError: (err) => {
                        toast(err?.response?.data?.response_message || t('messages:error_saving_policy'), {
                            type: 'error',
                        })
                    },
                }
            )
        } else {
            UpdateUserConsent(
                { body, userConsentId: consent?.id },
                {
                    onSuccess: () => {
                        refetchUserConsent()
                        toast(t('messages:policy_saved_successfully'), {
                            type: 'success',
                        })
                        setTimeout(() => {
                            setDescriptionModified(false)
                        }, [300])
                    },
                    onError: (err) => {
                        toast(err?.response?.data?.response_message || t('messages:error_saving_policy'), {
                            type: 'error',
                        })
                    },
                }
            )
        }
    }

    const handelCancelDescription = () => {
        setDescriptionModified(false)
        setDescription(consent?.description)
        setDescriptionText(consent?.description)
        handelCancelPolicyName()
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
        <div key={consent?.id} className=' bg-white  pb-6 policy-card max-w-[980px] w-full'>
            <div className=' h-[64px] flex justify-between items-center  w-full'>
                <div className=' flex items-center gap-x-5 max-w-[40%] w-full'>
                    {policyType === 'CONTACT_POLICY' ? (
                        <div className={`flex items-center gap-x-2 max-w-[60%] cursor-default `}>
                            <Paragraph className=' !font-medium text-base !mb-0  ' ellipsis={{ tooltip: consentName }}>
                                {consentName?.substring(0, 50) || t('labels:untitled_policy')}
                            </Paragraph>
                        </div>
                    ) : (
                        <Input
                            placeholder={t('labels:untitled_policy')}
                            autoFocus={isNewPolicy}
                            onChange={(e) => handelConsentNameChange(e.target?.value)}
                            value={consentName}
                        />
                    )}
                </div>
                {policyType !== 'CONTACT_POLICY' && (
                    <div className=' max-w-[40%] w-full flex justify-end'>
                        <Button danger onClick={() => handelDeletePolicy(consent?.id)}>
                            {t('labels:delete')}
                        </Button>
                    </div>
                )}
            </div>
            <div
                className=' rounded border-[1px] drop-shadow-sm shadow-[#D9D9D9] border-[#D9D9D9] overflow-hidden bg-white   w-full'
                data-text-editor={'policyCard'}>
                <ReactQuill
                    theme='snow'
                    value={description}
                    onChange={handelDescriptionChange}
                    modules={modules}
                    formats={formats}
                    bounds={`[data-text-editor=policyCard]`}
                />
            </div>
            <p className=' mt-2 text-[#000000] text-opacity-50'>
                {t('labels:last_updated')} : {isNewPolicy ? '' : getDate(consent?.updated_on) || ''}
            </p>
            {descriptionModified || isConsentNameChanged ? (
                <div className=' space-x-2 mt-6'>
                    <Button
                        className='app-btn-primary '
                        disabled={!(consentName?.trim() && descriptionText?.trim())}
                        onClick={handelSaveConsent}
                        loading={createNewUserConsentStatus === 'pending' || UpdateUserConsentStatus === 'pending'}>
                        {t('labels:save')}
                    </Button>
                    <Button
                        onClick={handelCancelDescription}
                        disabled={createNewUserConsentStatus === 'pending' || UpdateUserConsentStatus === 'pending'}>
                        {t('labels:cancel')}
                    </Button>
                </div>
            ) : null}
        </div>
    )
}
export default PolicyCard
