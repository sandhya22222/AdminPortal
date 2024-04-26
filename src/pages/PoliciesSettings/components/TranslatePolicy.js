import { DownOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { Button, Dropdown, Input, Progress, Skeleton, Space, Tag, Typography } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactQuill, { Quill } from 'react-quill'
import useGetUserConsentVersionDisplayName from '../hooks/useGetUserConsentVersionDisplayName'
import useUpdateVersionDisplayname from '../hooks/useUpdateVersionDisplayname'
import useCreateVersionDisplayname from '../hooks/useCreateVersionDisplayname'
import MarketplaceToaster from '../../../util/marketplaceToaster'

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

const languages = [
    { label: 'French', key: 'en' },
    { label: 'Hindi', key: 'en' },
    { label: 'Germany', key: 'en' },
]
function TranslatePolicy({
    userConsentVersionId,
    userConsentBaseName,
    userConsentBaseDescription,
    storeId,
    setTranslatePolicy,
}) {
    const { t } = useTranslation()
    const {
        data: userConsentVersionDisplaynameData,
        status: userConsentVersionDisplaynameDataStatus,
        isFetched: isUserConsentVersionDisplayNameFetched,
    } = useGetUserConsentVersionDisplayName({
        userConsentVersionId,
    })
    const [actionType, setActionType] = useState('save')
    const [consentDisplayNameData, setConsentDisplayNameData] = useState([])
    const [isContentDisplayNameChanged, setIsContentDisplayNameChanged] = useState(false)
    const [isContentDescriptionDisplayNameChanged, setIsContentDescriptionDisplayNameChanged] = useState(false)
    const [consentTitleDisplayName, setConsentTitleDisplayName] = useState('')
    const [consentDescriptionDisplayName, setConsentDescriptionDisplayName] = useState('')
    const [consentDescriptionDisplayNameText, setConsentDescriptionDisplayNameText] = useState('')
    const [translatedVersionId, setTranslatedVersionId] = useState()

    const { mutate: updateVersionDisplayName, status: updateDisplayNameStatus } = useUpdateVersionDisplayname()
    const { mutate: createVersionDisplayName, status: createDisplayNameStatus } = useCreateVersionDisplayname()

    useEffect(() => {
        if (userConsentVersionDisplaynameDataStatus === 'success' || isUserConsentVersionDisplayNameFetched) {
            console.log('displayNameData...', userConsentVersionDisplaynameData)
            if (userConsentVersionDisplaynameData?.User_Consent_Version_Displaynames?.length > 0) {
                setActionType(
                    userConsentVersionDisplaynameData?.User_Consent_Version_Displaynames?.length <= 0
                        ? 'save'
                        : 'update'
                )
                setConsentTitleDisplayName(
                    userConsentVersionDisplaynameData?.User_Consent_Version_Displaynames?.[0]?.display_name
                )
                setConsentDescriptionDisplayName(
                    userConsentVersionDisplaynameData?.User_Consent_Version_Displaynames?.[0]?.display_description
                )
                setTranslatedVersionId(userConsentVersionDisplaynameData?.User_Consent_Version_Displaynames?.[0].id)
            }
        }
    }, [
        userConsentVersionDisplaynameData,
        userConsentVersionDisplaynameDataStatus,
        isUserConsentVersionDisplayNameFetched,
    ])

    const handelSaveConsentDisplayName = () => {
        const postbody = {
            userconsentversion_displayname: [
                {
                    store: Number(storeId),
                    version: userConsentVersionId,
                    language_code: 'en',
                    display_name: consentTitleDisplayName,
                    version_display_name: consentDescriptionDisplayNameText,
                    display_description: consentDescriptionDisplayName,
                },
            ],
        }

        const putbody = {
            userconsentversion_displayname: [
                {
                    id: translatedVersionId,
                    language_code: 'en',
                    display_name: consentTitleDisplayName,
                    version_display_name: consentDescriptionDisplayNameText,
                    display_description: consentDescriptionDisplayName,
                },
            ],
        }

        if (actionType === 'save') {
            createVersionDisplayName(
                { body: postbody },
                {
                    onSuccess: (response) => {
                        // refetchUserConsent()
                        MarketplaceToaster.showToast(response)
                        setTranslatePolicy(false)
                        // toast(t('messages:policy_saved_successfully'), {
                        //     type: 'success',
                        // })
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
            updateVersionDisplayName(
                { body: putbody, userConsentVersionId: userConsentVersionId },
                {
                    onSuccess: (response) => {
                        MarketplaceToaster.showToast(response)
                        // toast(response?.response_message, {
                        //     type: 'success',
                        // })
                        setTranslatePolicy(false)
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

    const consentNameHandler = (name) => {
        setConsentTitleDisplayName(name)
    }

    const consentDescriptionHandler = (content, delta, source, editor) => {
        setConsentDescriptionDisplayName(content)
        setConsentDescriptionDisplayNameText(editor.getText(content)?.trim())
    }

    const language = 'English'

    return (
        <div>
            {/* <Tag className='mb-2 w-full' icon={<CheckCircleOutlined />} color='success'>
                {'BE MESSAGE'}
            </Tag> */}
            <div className=' mt-3'>
                <Skeleton
                    loading={
                        userConsentVersionDisplaynameDataStatus === 'pending' ||
                        updateDisplayNameStatus === 'pending' ||
                        createDisplayNameStatus === 'pending'
                    }
                    active
                />
            </div>
            {userConsentVersionDisplaynameDataStatus === 'success' && (
                <>
                    <div className='flex justify-between space-x-8'>
                        <div>
                            <div className='flex mb-4'>
                                <label className='input-label-color'>{t('labels:translate_from')}</label>
                                <Typography className='font-bold px-2'>{language}</Typography>
                            </div>
                            <div>
                                <Typography.Title level={5}>{userConsentBaseName}</Typography.Title>
                            </div>
                            <div className='!w-[400px] '>
                                <ReactQuill
                                    value={userConsentBaseDescription}
                                    modules={{ toolbar: false }}
                                    readOnly={true}
                                    style={{ width: '100%', height: '390px' }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className='mb-4 flex justify-between'>
                                <div className='flex'>
                                    <label className='input-label-color'>{t('labels:translate_to')}</label>
                                    <div className='flex items-center mx-2'>
                                        <Dropdown
                                            className='w-[90px]'
                                            menu={{
                                                items: languages,
                                            }}>
                                            <Space>
                                                <span className='font-bold'>{'Select'}</span>
                                                <DownOutlined />
                                            </Space>
                                        </Dropdown>
                                    </div>
                                </div>
                            </div>
                            <label className='text-[14px] mb-3 input-label-color'>{t('labels:policy_title')}</label>
                            <div className=' flex items-center gap-x-5 max-w-[40%] w-full pb-3'>
                                <Input
                                    placeholder={'Enter policy title here'}
                                    onChange={(e) => consentNameHandler(e.target?.value)}
                                    value={consentTitleDisplayName}
                                />
                            </div>
                            <label className='text-[14px] mb-3 input-label-color'>
                                {t('labels:policy_description')}
                            </label>
                            <div
                                className=' rounded border-[1px] drop-shadow-sm shadow-[#D9D9D9] border-[#D9D9D9] overflow-hidden bg-white w-[600px]'
                                data-text-editor={'versiontranslate'}>
                                <ReactQuill
                                    theme='snow'
                                    style={{ width: '100%', height: '270px' }}
                                    value={consentDescriptionDisplayName}
                                    onChange={consentDescriptionHandler}
                                    modules={modules}
                                    formats={formats}
                                    bounds={`[data-text-editor=versiontranslate]`}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-end'>
                        <Button onClick={() => setTranslatePolicy(false)} disabled={''} className='mx-2'>
                            {t('labels:cancel')}
                        </Button>
                        <Button className='app-btn-primary ' onClick={handelSaveConsentDisplayName}>
                            {t('labels:save')}
                        </Button>
                    </div>
                </>
            )}
        </div>
    )
}

export default TranslatePolicy
