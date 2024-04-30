import { CheckCircleOutlined, DownOutlined } from '@ant-design/icons'
import { Button, Dropdown, Input, Skeleton, Space, Tag, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactQuill, { Quill } from 'react-quill'
import MarketplaceToaster from '../../../util/marketplaceToaster'
import useCreateVersionDisplayname from '../hooks/useCreateVersionDisplayname'
import useGetUserConsentVersionDisplayName from '../hooks/useGetUserConsentVersionDisplayName'
import useUpdateVersionDisplayname from '../hooks/useUpdateVersionDisplayname'
import useGetStoreLanguage from '../hooks/useGetStoreLanguage'
import { useSelector } from 'react-redux'

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

function TranslatePolicy({
    userConsentVersionId,
    userConsentBaseName,
    userConsentBaseDescription,
    storeId,
    setTranslatePolicy,
    storeUUID,
    refetchUserConsent,
}) {
    const { t } = useTranslation()
    const {
        data: userConsentVersionDisplaynameData,
        status: userConsentVersionDisplaynameDataStatus,
        isFetched: isUserConsentVersionDisplayNameFetched,
    } = useGetUserConsentVersionDisplayName({
        userConsentVersionId,
    })
    const { data: userConsentLanguageData, status: userConsentLanguageStatus } = useGetStoreLanguage({
        storeUUID,
    })
    const [isContentDisplayNameChanged, setIsContentDisplayNameChanged] = useState(false)
    const [isContentDescriptionDisplayNameChanged, setIsContentDescriptionDisplayNameChanged] = useState(false)
    const [translateSuccessMessage, setTranslateSuccessMessage] = useState('')
    const [consentDisplayNameData, setConsentDisplayNameData] = useState([])
    const [selectedConsentDisplayNameData, setSelectedConsentDisplayNameData] = useState()
    const [languages, setlanguages] = useState([{ label: 'English', key: 'en' }])
    const [selectedLanguage, setSelectedLanguage] = useState({ label: 'English', key: 'en' })

    const { mutate: updateVersionDisplayName, status: updateDisplayNameStatus } = useUpdateVersionDisplayname()
    const { mutate: createVersionDisplayName, status: createDisplayNameStatus } = useCreateVersionDisplayname()
    //! selected Language from Redux
    const selectedLanguageFromReduxState = useSelector((state) => state.reducerSelectedLanguage.selectedLanguage)

    console.log('selected language from redux', selectedLanguageFromReduxState)

    const userconsentVersionDisplayNameProcessor = (userConsentLanguageData) => {
        return (userConsentLanguageData?.data || []).map((data) => ({
            language: data?.language || 'English',
            language_code: data?.language_code || 'en',
            actionType: 'save',
            consentTitleDisplayName: '',
            consentDescriptionDisplayName: '',
            consentDescriptionDisplayNameText: '',
            translatedVersionId: '',
            copyOfConsentDisplayName: '',
            copyOfConsentDescriptionDisplayName: '',
        }))
    }

    useEffect(() => {
        if (
            (userConsentVersionDisplaynameDataStatus === 'success' && userConsentLanguageStatus === 'success') ||
            isUserConsentVersionDisplayNameFetched
        ) {
            if (userConsentLanguageData?.data?.length > 0) {
                setlanguages(
                    userConsentLanguageData?.data?.map((data) => {
                        let obj = {}
                        obj['label'] = data.language
                        obj['key'] = data.language_code
                        return obj
                    })
                )
            }
            if (
                userConsentVersionDisplaynameData?.User_Consent_Version_Displaynames?.length > 0 &&
                userConsentLanguageData?.data?.length > 0
            ) {
                let storeLanguages = userconsentVersionDisplayNameProcessor(userConsentLanguageData)
                userConsentVersionDisplaynameData?.User_Consent_Version_Displaynames?.forEach((displayNames) => {
                    storeLanguages.forEach((data) => {
                        if (data.language_code === displayNames.language_code) {
                            data.language_code = displayNames.language_code
                            data.actionType = 'update'
                            data.consentDescriptionDisplayName = displayNames.display_description
                            data.consentTitleDisplayName = displayNames.display_name
                            data.consentDescriptionDisplayNameText = displayNames.display_description
                            data.copyOfConsentDescriptionDisplayName = displayNames.display_description
                            data.copyOfConsentDisplayName = displayNames.display_name
                            data.translatedVersionId = displayNames.id
                        }
                    })
                })
                setConsentDisplayNameData(storeLanguages)
                setSelectedConsentDisplayNameData(storeLanguages[0])
            } else {
                // For intially render of the translate pop up filled with default data
                let processedData = userconsentVersionDisplayNameProcessor(userConsentLanguageData)
                setConsentDisplayNameData(processedData)
                setSelectedConsentDisplayNameData(processedData[0])
            }
        }
    }, [
        userConsentVersionDisplaynameData,
        userConsentVersionDisplaynameDataStatus,
        isUserConsentVersionDisplayNameFetched,
        userConsentLanguageData,
    ])

    console.log(
        'displayNameData...',
        userConsentVersionDisplaynameData,
        userConsentLanguageData?.data,
        languages,
        consentDisplayNameData
    )

    const handleMenuClick = (e) => {
        setSelectedLanguage(languages?.filter((data) => data.key === e.key)?.[0])
        setSelectedConsentDisplayNameData(consentDisplayNameData?.filter((data) => data.language_code === e.key)?.[0])
        setTranslateSuccessMessage('')
    }

    const handelSaveConsentDisplayName = () => {
        const postbody = {
            userconsentversion_displayname: [
                {
                    store: Number(storeId),
                    version: userConsentVersionId,
                    language_code: selectedLanguage.key,
                    display_name: selectedConsentDisplayNameData.consentTitleDisplayName,
                    version_display_name: 'Version_displayname',
                    display_description: selectedConsentDisplayNameData.consentDescriptionDisplayName,
                },
            ],
        }

        const putbody = {
            userconsentversions_displayname: [
                {
                    id: selectedConsentDisplayNameData.translatedVersionId,
                    language_code: selectedLanguage.key,
                    display_name: selectedConsentDisplayNameData.consentTitleDisplayName,
                    version_display_name: 'Version_displayname',
                    display_description: selectedConsentDisplayNameData.consentDescriptionDisplayName,
                },
            ],
        }

        if (selectedConsentDisplayNameData.actionType === 'save') {
            createVersionDisplayName(
                { body: postbody },
                {
                    onSuccess: (response) => {
                        const responseData = response?.data?.response_body?.[0]
                        if (responseData) {
                            setTranslateSuccessMessage(response?.data?.response_message)
                            setIsContentDescriptionDisplayNameChanged(false)
                            setIsContentDisplayNameChanged(false)
                            let copyOfSelectedConsentDisplayNameData = { ...selectedConsentDisplayNameData }
                            let copyOfConsentDisplayNameData = [...consentDisplayNameData]
                            copyOfSelectedConsentDisplayNameData.copyOfConsentDisplayName = responseData?.display_name
                            copyOfSelectedConsentDisplayNameData.copyOfConsentDescriptionDisplayName =
                                responseData?.display_description
                            copyOfSelectedConsentDisplayNameData.actionType = 'update'
                            copyOfSelectedConsentDisplayNameData.translatedVersionId = responseData?.id
                            copyOfConsentDisplayNameData.forEach((data) => {
                                if (data.language_code === responseData?.language_code) {
                                    data.copyOfConsentDisplayName = responseData?.display_name
                                    data.copyOfConsentDescriptionDisplayName = responseData?.display_description
                                    data.actionType = 'update'
                                    data.translatedVersionId = responseData?.id
                                }
                            })
                            setSelectedConsentDisplayNameData(copyOfSelectedConsentDisplayNameData)
                            setConsentDisplayNameData(copyOfConsentDisplayNameData)
                        }
                    },
                    onError: (err) => {
                        MarketplaceToaster.showToast(err?.response)
                    },
                }
            )
        } else {
            updateVersionDisplayName(
                { body: putbody, userConsentVersionId: userConsentVersionId },
                {
                    onSuccess: (response) => {
                        const responseData = response?.response_body?.userconsentversions_displaynames?.[0]
                        if (responseData) {
                            setTranslateSuccessMessage(response?.response_message)
                            setIsContentDescriptionDisplayNameChanged(false)
                            setIsContentDisplayNameChanged(false)
                            let copyOfSelectedConsentDisplayNameData = { ...selectedConsentDisplayNameData }
                            let copyOfConsentDisplayNameData = [...consentDisplayNameData]
                            copyOfSelectedConsentDisplayNameData.copyOfConsentDisplayName = responseData?.display_name
                            copyOfSelectedConsentDisplayNameData.copyOfConsentDescriptionDisplayName =
                                responseData?.display_description
                            copyOfSelectedConsentDisplayNameData.actionType = 'update'
                            copyOfSelectedConsentDisplayNameData.translatedVersionId = responseData?.id
                            copyOfConsentDisplayNameData.forEach((data) => {
                                if (data.language_code === responseData?.language_code) {
                                    data.copyOfConsentDisplayName = responseData?.display_name
                                    data.copyOfConsentDescriptionDisplayName = responseData?.display_description
                                    data.actionType = 'update'
                                    data.translatedVersionId = responseData?.id
                                }
                            })
                            setSelectedConsentDisplayNameData(copyOfSelectedConsentDisplayNameData)
                            setConsentDisplayNameData(copyOfConsentDisplayNameData)
                        }
                    },
                    onError: (err) => {
                        MarketplaceToaster.showToast(err?.response)
                    },
                }
            )
        }
    }

    const consentNameHandler = (name) => {
        let copyOfSelectedConsentDisplayNameData = { ...selectedConsentDisplayNameData }
        let copyOfConsentDisplayNameData = [...consentDisplayNameData]
        copyOfConsentDisplayNameData.forEach((data) => {
            if (data.language_code === copyOfSelectedConsentDisplayNameData.language_code) {
                data.consentTitleDisplayName = name
            }
        })
        copyOfSelectedConsentDisplayNameData.consentTitleDisplayName = name
        setConsentDisplayNameData(copyOfConsentDisplayNameData)
        setSelectedConsentDisplayNameData(copyOfSelectedConsentDisplayNameData)
        setTranslateSuccessMessage('')
        if (
            selectedConsentDisplayNameData.actionType !== 'save' &&
            selectedConsentDisplayNameData.copyOfConsentDisplayName !== name
        ) {
            setIsContentDisplayNameChanged(true)
        } else {
            setIsContentDisplayNameChanged(false)
        }
    }

    const consentDescriptionHandler = (content, delta, source, editor) => {
        console.log('source...', source)
        if (source === 'user') {
            let copyOfSelectedConsentDisplayNameData = { ...selectedConsentDisplayNameData }
            let copyOfConsentDisplayNameData = [...consentDisplayNameData]
            copyOfConsentDisplayNameData.forEach((data) => {
                if (data.language_code === copyOfSelectedConsentDisplayNameData.language_code) {
                    data.consentDescriptionDisplayName = content
                    data.consentDescriptionDisplayNameText = editor.getText(content)?.trim()
                }
            })
            copyOfSelectedConsentDisplayNameData.consentDescriptionDisplayName = content
            copyOfSelectedConsentDisplayNameData.consentDescriptionDisplayNameText = editor.getText(content)?.trim()
            setSelectedConsentDisplayNameData(copyOfSelectedConsentDisplayNameData)
            setSelectedConsentDisplayNameData(copyOfSelectedConsentDisplayNameData)
            setTranslateSuccessMessage('')
            if (
                selectedConsentDisplayNameData.actionType !== 'save' &&
                selectedConsentDisplayNameData.copyOfConsentDescriptionDisplayName !== content?.trim()
            ) {
                setIsContentDescriptionDisplayNameChanged(true)
            } else {
                setIsContentDescriptionDisplayNameChanged(false)
            }
        }
    }
    const language = 'English'
    return (
        <div>
            {translateSuccessMessage && (
                <Tag
                    className='mb-2 w-full py-[7px] px-[9px] flex justify-between'
                    color='success'
                    closable
                    onClose={() => setTranslateSuccessMessage('')}>
                    <div className='flex items-center'>
                        <div className='pr-2'>
                            <CheckCircleOutlined className='text-[#52c41a] text-base' />
                        </div>
                        <span className='text-black'>{translateSuccessMessage}</span>
                    </div>
                </Tag>
            )}
            <div className='mt-3'>
                {userConsentVersionDisplaynameDataStatus === 'pending' ||
                updateDisplayNameStatus === 'pending' ||
                createDisplayNameStatus === 'pending' ||
                userConsentLanguageStatus === 'pending' ? (
                    <Skeleton active />
                ) : (
                    <>
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
                                                            onClick: handleMenuClick,
                                                        }}>
                                                        <Space>
                                                            <span className='font-bold'>{selectedLanguage.label}</span>
                                                            <DownOutlined />
                                                        </Space>
                                                    </Dropdown>
                                                </div>
                                            </div>
                                        </div>
                                        <label className='text-[14px] mb-3 input-label-color'>
                                            {t('labels:policy_title')}
                                        </label>
                                        <div className=' flex items-center gap-x-5 max-w-[40%] w-full pb-3'>
                                            <Input
                                                placeholder={'Enter policy title here'}
                                                onChange={(e) => consentNameHandler(e.target?.value)}
                                                value={selectedConsentDisplayNameData?.consentTitleDisplayName}
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
                                                value={selectedConsentDisplayNameData?.consentDescriptionDisplayName}
                                                onChange={consentDescriptionHandler}
                                                modules={modules}
                                                formats={formats}
                                                placeholder={'Enter policy text here'}
                                                bounds={`[data-text-editor=versiontranslate]`}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='flex justify-end'>
                                    <Button
                                        onClick={() => {
                                            setTranslatePolicy(false)
                                            refetchUserConsent()
                                        }}
                                        disabled={''}
                                        className='mx-2'>
                                        {t('labels:cancel')}
                                    </Button>
                                    <Button
                                        className='app-btn-primary '
                                        disabled={
                                            !(
                                                selectedConsentDisplayNameData?.consentTitleDisplayName?.trim() &&
                                                selectedConsentDisplayNameData?.consentDescriptionDisplayNameText?.trim()
                                            ) ||
                                            (!isContentDisplayNameChanged &&
                                                !isContentDescriptionDisplayNameChanged &&
                                                selectedConsentDisplayNameData?.actionType !== 'save')
                                        }
                                        onClick={handelSaveConsentDisplayName}>
                                        {t('labels:save')}
                                    </Button>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default TranslatePolicy
