import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Button } from "../../../shadcnComponents/ui/button"
import { Input } from "../../../shadcnComponents/ui/input"
import { Progress } from "../../../shadcnComponents/ui/progress"
import { Alert, AlertDescription } from "../../../shadcnComponents/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../shadcnComponents/ui/select"
import { Card, CardContent } from "../../../shadcnComponents/ui/card"
import { Skeleton } from "../../../shadcnComponents/ui/skeleton"
import util from '../../../util/common'

import useCreateVersionDisplayname from '../hooks/useCreateVersionDisplayname'
import useGetStoreLanguage from '../hooks/useGetStoreLanguage'
import useGetUserConsentVersionDisplayName from '../hooks/useGetUserConsentVersionDisplayName'
import useUpdateVersionDisplayname from '../hooks/useUpdateVersionDisplayname'

const CONSENT_NAME_LENGTH = 100

// Quill configuration
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
        ['blockquote', 'link'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ['clean'],
    ],
}

const formats = [
    'background', 'bold', 'color', 'font', 'code', 'italic', 'link', 'size', 'strike', 'underline',
    'blockquote', 'header', 'indent', 'list', 'align', 'direction', 'script',
]
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
export default function TranslatePolicy({
    userConsentVersionId,
    userConsentBaseName,
    userConsentBaseDescription,
    storeId,
    setTranslatePolicy,
    storeUUID,
    refetchUserConsent,
    policyStatus,
}) {
    const { t } = useTranslation()
    const [isContentDisplayNameChanged, setIsContentDisplayNameChanged] = useState(false)
    const [isContentDescriptionDisplayNameChanged, setIsContentDescriptionDisplayNameChanged] = useState(false)
    const [translateSuccessMessage, setTranslateSuccessMessage] = useState('')
    const [consentDisplayNameData, setConsentDisplayNameData] = useState([])
    const [selectedConsentDisplayNameData, setSelectedConsentDisplayNameData] = useState()
    const [languages, setLanguages] = useState([{ label: 'English', key: 'en' }])
    const [selectedLanguage, setSelectedLanguage] = useState({ label: 'English', key: 'en' })

    const { data: userConsentVersionDisplaynameData, status: userConsentVersionDisplaynameDataStatus } = useGetUserConsentVersionDisplayName({
        userConsentVersionId,
    })
    const { data: userConsentLanguageData, status: userConsentLanguageStatus } = useGetStoreLanguage({
        storeUUID,
    })
    const { mutate: updateVersionDisplayName, status: updateDisplayNameStatus } = useUpdateVersionDisplayname()
    const { mutate: createVersionDisplayName, status: createDisplayNameStatus } = useCreateVersionDisplayname()

    const selectedLanguageFromReduxState = useSelector((state) => state.reducerSelectedLanguage.selectedLanguage)

    useEffect(() => {
        if (userConsentVersionDisplaynameDataStatus === 'success' && userConsentLanguageStatus === 'success') {
            if (userConsentLanguageData?.data?.length > 0) {
                setLanguages(userConsentLanguageData.data.map(data => ({
                    label: data.language,
                    key: data.language_code
                })))
            }
            if (userConsentVersionDisplaynameData?.User_Consent_Version_Displaynames?.length > 0 && userConsentLanguageData?.data?.length > 0) {
                let storeLanguages = userconsentVersionDisplayNameProcessor(userConsentLanguageData)
                userConsentVersionDisplaynameData.User_Consent_Version_Displaynames.forEach((displayNames) => {
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
                let processedData = userconsentVersionDisplayNameProcessor(userConsentLanguageData)
                setConsentDisplayNameData(processedData)
                setSelectedConsentDisplayNameData(processedData[0])
            }
        }
    }, [userConsentVersionDisplaynameData, userConsentVersionDisplaynameDataStatus, userConsentLanguageData, userConsentLanguageStatus])

    const handleLanguageChange = (value) => {
        setSelectedLanguage(languages.find(lang => lang.key === value))
        setSelectedConsentDisplayNameData(consentDisplayNameData.find(data => data.language_code === value))
        setTranslateSuccessMessage('')
    }

    const handleSaveConsentDisplayName = () => {
        const body = {
            userconsentversion_displayname: [{
                store: Number(storeId),
                version: userConsentVersionId,
                language_code: selectedLanguage.key,
                display_name: selectedConsentDisplayNameData?.consentTitleDisplayName,
                version_display_name: 'Version_displayname',
                display_description: selectedConsentDisplayNameData?.consentDescriptionDisplayName,
            }],
        }

        const mutateFunction = selectedConsentDisplayNameData?.actionType === 'save' ? createVersionDisplayName : updateVersionDisplayName
        const mutateOptions = {
            onSuccess: (response) => {
                const responseData = response?.data?.response_body?.[0] || response?.response_body?.userconsentversions_displaynames?.[0]
                if (responseData) {
                    setTranslateSuccessMessage(response?.data?.response_message || response?.response_message)
                    setIsContentDescriptionDisplayNameChanged(false)
                    setIsContentDisplayNameChanged(false)
                    updateConsentDisplayNameData(responseData)
                }
            },
            onError: (err) => {
                // Implement your error handling here
                console.error("Error saving consent display name:", err)
            },
        }

        mutateFunction({ body, userConsentVersionId }, mutateOptions)
    }

    const updateConsentDisplayNameData = (responseData) => {
        let copyOfSelectedConsentDisplayNameData = { ...selectedConsentDisplayNameData }
        let copyOfConsentDisplayNameData = [...consentDisplayNameData]
        
        copyOfSelectedConsentDisplayNameData.copyOfConsentDisplayName = responseData.display_name
        copyOfSelectedConsentDisplayNameData.copyOfConsentDescriptionDisplayName = responseData.display_description
        copyOfSelectedConsentDisplayNameData.actionType = 'update'
        copyOfSelectedConsentDisplayNameData.translatedVersionId = responseData.id

        copyOfConsentDisplayNameData = copyOfConsentDisplayNameData.map(data => 
            data.language_code === responseData.language_code
                ? { ...data, ...copyOfSelectedConsentDisplayNameData }
                : data
        )

        setSelectedConsentDisplayNameData(copyOfSelectedConsentDisplayNameData)
        setConsentDisplayNameData(copyOfConsentDisplayNameData)
    }

    const consentNameHandler = (name) => {
        let copyOfSelectedConsentDisplayNameData = { ...selectedConsentDisplayNameData, consentTitleDisplayName: name }
        let copyOfConsentDisplayNameData = consentDisplayNameData.map(data => 
            data.language_code === copyOfSelectedConsentDisplayNameData.language_code
                ? { ...data, consentTitleDisplayName: name }
                : data
        )

        setConsentDisplayNameData(copyOfConsentDisplayNameData)
        setSelectedConsentDisplayNameData(copyOfSelectedConsentDisplayNameData)
        setTranslateSuccessMessage('')
        setIsContentDisplayNameChanged(
            selectedConsentDisplayNameData.actionType !== 'save' &&
            selectedConsentDisplayNameData.copyOfConsentDisplayName !== name
        )
    }

    const consentDescriptionHandler = (content, delta, source, editor) => {
        if (source === 'user') {
            let copyOfSelectedConsentDisplayNameData = { 
                ...selectedConsentDisplayNameData, 
                consentDescriptionDisplayName: content,
                consentDescriptionDisplayNameText: editor.getText(content)?.trim()
            }
            let copyOfConsentDisplayNameData = consentDisplayNameData.map(data => 
                data.language_code === copyOfSelectedConsentDisplayNameData.language_code
                    ? { ...data, ...copyOfSelectedConsentDisplayNameData }
                    : data
            )

            setConsentDisplayNameData(copyOfConsentDisplayNameData)
            setSelectedConsentDisplayNameData(copyOfSelectedConsentDisplayNameData)
            setTranslateSuccessMessage('')
            setIsContentDescriptionDisplayNameChanged(
                selectedConsentDisplayNameData.actionType !== 'save' &&
                selectedConsentDisplayNameData.copyOfConsentDescriptionDisplayName !== content?.trim()
            )
        }
    }

    const isLoading = userConsentVersionDisplaynameDataStatus === 'pending' || 
                      updateDisplayNameStatus === 'pending' || 
                      createDisplayNameStatus === 'pending' || 
                      userConsentLanguageStatus === 'pending'


    const language = "English";
    console.log(languages,'Languages')
    return (
        <div className="flex flex-col h-[520px] w-[980px] p-4 space-y-2">
            {translateSuccessMessage && (
                <Alert className="mb-2">
                    <AlertDescription>{translateSuccessMessage}</AlertDescription>
                </Alert>
            )}
            {isLoading ? (
                <Skeleton className="w-full h-[450px]" />
            ) : (
                <div className="grid grid-cols-5 gap-4 h-[440px]">
                    <div className="space-y-2 col-span-2">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{t('labels:translate_from')}</span>
                            <span className="font-bold">{selectedLanguage.label}</span>
                        </div>
                        <h3 className="text-base font-semibold truncate">{userConsentBaseName}</h3>
                        <div className="w-full h-[370px]  overflow-hidden">
                            <ReactQuill
                                value={userConsentBaseDescription}
                                modules={{ toolbar: false }}
                                readOnly={true}
                                className="h-[300px]"
                            />
                        </div>
                    </div>
                    <div className="space-y-2 col-span-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium whitespace-nowrap">{t('labels:translate_to')}</span>
                                <Select onValueChange={handleLanguageChange} value={selectedLanguage.key}>
                                    <SelectTrigger className="w-[120px] h-8">
                                        <SelectValue className="truncate" placeholder="Select language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {languages.map((lang) => (
                                            <SelectItem key={lang.key} value={lang.key}>
                                                {lang.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-row items-center gap-2">
                                <Progress 
                                    value={(consentDisplayNameData?.filter(data => data.translatedVersionId !== '').length / consentDisplayNameData?.length) * 100} 
                                    className="w-[80px] h-2"
                                />
                                <span className="text-xs">
                                    {`${consentDisplayNameData?.filter(data => data.translatedVersionId !== '').length}/${consentDisplayNameData?.length} ${t('labels:translated')}`}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">
                                {t('labels:policy_title')}
                                <span    className={`text-red-500 ${
        util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? 'mr-1' : 'ml-1'
    }`}
> *</span>
                     </label>
                            <Input
                                placeholder={t('labels:enter_policy_title')}
                                onChange={(e) => consentNameHandler(e.target.value)}
                                value={selectedConsentDisplayNameData?.consentTitleDisplayName}
                                disabled={policyStatus === 2}
                                maxLength={CONSENT_NAME_LENGTH}
                                onBlur={(e) => {
                                    if (e.target.value) {
                                        consentNameHandler(e.target.value.trim().replace(/\s+/g, ' '))
                                    }
                                }}
                                className="h-8 px-2"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium">
                                {t('labels:policy_description')}
                                <span className={`text-red-500 ${util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? 'mr-1' : 'ml-1'}`}>*</span>
                            </label>
                            <Card className={`w-full h-[200px] overflow-hidden ${policyStatus === 2 ? 'opacity-40 cursor-not-allowed' : ''}`}>
                                <CardContent className="p-0 h-full">
                                    <ReactQuill
                                        theme="snow"
                                        value={selectedConsentDisplayNameData?.consentDescriptionDisplayName}
                                        onChange={consentDescriptionHandler}
                                        modules={modules}
                                        formats={formats}
                                        placeholder={t('labels:enter_policy_description')}
                                        readOnly={policyStatus === 2}
                                        className="h-full"
                                    />
                                </CardContent>
                            </Card>
                        </div>
                        <div className="flex justify-end gap-2 pt-2 pb-1">
                <Button variant="outline" onClick={() => {
                    setTranslatePolicy(false)
                    
                    refetchUserConsent()
                }}>
                    {t('labels:cancel')}
                </Button>
                <Button
                    onClick={handleSaveConsentDisplayName}
                    disabled={
                        !(selectedConsentDisplayNameData?.consentTitleDisplayName?.trim() &&
                        selectedConsentDisplayNameData?.consentDescriptionDisplayNameText?.trim()) ||
                        (!isContentDisplayNameChanged &&
                        !isContentDescriptionDisplayNameChanged &&
                        selectedConsentDisplayNameData?.actionType !== 'save')
                    }
                >
                    {t('labels:save')}
                </Button>
            </div>
                    </div>
                </div>
            )}

        </div>
    )
}