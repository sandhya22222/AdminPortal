import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import validator from 'validator'
import { useNavigate } from 'react-router-dom'
import { fnStoreLanguage, fnSelectedLanguage } from '../../services/redux/actions/ActionStoreLanguage'
import MarketplaceServices from '../../services/axios/MarketplaceServices'
import MarketplaceToaster from '../../util/marketplaceToaster'
import util from '../../util/common'
import { Button } from '../../shadcnComponents/ui/button'
import { Input } from '../../shadcnComponents/ui/input'
import { Label } from '../../shadcnComponents/ui/label'
import { Tabs, TabsList, TabsTrigger } from '../../shadcnComponents/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '../../shadcnComponents/ui/card'
import { Loader2 } from 'lucide-react'
import { Separator } from '@radix-ui/react-dropdown-menu'

const titleMinLength = process.env.REACT_APP_TITLE_MIN_LENGTH
const titleMaxLength = process.env.REACT_APP_TITLE_MAX_LENGTH
const languageCodeMinLength = process.env.REACT_APP_LANGUAGE_CODE_MIN_LENGTH
const languageCodeMaxLength = process.env.REACT_APP_LANGUAGE_CODE_MAX_LENGTH
const languageAPI = process.env.REACT_APP_STORE_LANGUAGE_API

const LanguageForm = ({
    languageCode,
    languageId,
    setLanguageName,
    languageStatus,
    setLanguageStatus,
    languageName,
}) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { t } = useTranslation()

    const selectedLanguage = useSelector((state) => state.reducerSelectedLanguage.selectedLanguage)

    const [txtLanguage, setTxtLanguage] = useState('')
    const [txtLanguageCode, setTxtLanguageCode] = useState('')
    const [scriptDirection, setScriptDirection] = useState('LTR')
    const [defaultTxtLanguage, setDefaultTxtLanguage] = useState('')
    const [defaultTxtLanguageCode, setDefaultTxtLanguageCode] = useState('')
    const [defaultScriptDirection, setDefaultScriptDirection] = useState('LTR')
    const [isEditLanguageFieldEmpty, setIsEditLanguageFieldEmpty] = useState(false)
    const [isEditLanguageCodeFieldEmpty, setIsEditLanguageCodeFieldEmpty] = useState(false)
    const [onChangeValues, setOnChangeValues] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isHelperTextVisible, setIsHelperTextVisible] = useState(false)

    const handleServerCall = () => {
        const postBody = {
            language: txtLanguage.trim(),
            language_code: txtLanguageCode.trim().toLowerCase(),
            writing_script_direction: scriptDirection,
        }
        setIsLoading(true)

        if (languageCode === undefined || languageCode === null) {
            MarketplaceServices.save(languageAPI, postBody)
                .then((res) => {
                    console.log('Language API post call response', res.data)
                    MarketplaceToaster.showToast(res)
                    if (res.status === 201) {
                        if (res.data) {
                            setOnChangeValues(false)
                            navigate(
                                `/dashboard/language/language-settings?k=${
                                    res.data.response_body[0].id
                                }&n=${res.data.response_body[0].language}&c=${
                                    res.data.response_body[0].language_code
                                }&s=${res.data.response_body[0].status}&d=${
                                    res.data.response_body[0].is_default === false ? 0 : 1
                                }`
                            )
                            setLanguageName(res.data.response_body[0].language)
                            setLanguageStatus(res.data.response_body[0].status)
                        }
                        setIsLoading(false)
                    }
                })
                .catch((error) => {
                    setIsLoading(false)
                    console.log('error response of post language API', error.response)
                    MarketplaceToaster.showToast(error.response)
                })
        } else {
            MarketplaceServices.update(languageAPI, postBody, { _id: languageId })
                .then((res) => {
                    console.log('Language API put call response', res.data.response_body[0])
                    if (res.status === 201) {
                        if (res.data) {
                            navigate(
                                `/dashboard/language/language-settings?k=${
                                    res.data.response_body[0].id
                                }&n=${res.data.response_body[0].language}&c=${
                                    res.data.response_body[0].language_code
                                }&s=${languageStatus}&d=${res.data.response_body[0].is_default === false ? 0 : 1}`
                            )
                            if (
                                selectedLanguage &&
                                selectedLanguage.language_code === res.data.response_body[0].language_code
                            ) {
                                let updatedScriptDirection = { ...selectedLanguage }
                                updatedScriptDirection.writing_script_direction =
                                    res.data.response_body[0].writing_script_direction
                                dispatch(fnSelectedLanguage(updatedScriptDirection))
                                if (
                                    selectedLanguage &&
                                    selectedLanguage.writing_script_direction !==
                                        res.data.response_body[0].writing_script_direction
                                ) {
                                    setTimeout(function () {
                                        navigate(0)
                                    }, 500)
                                }
                            }

                            setLanguageName(res.data.response_body[0].language)
                            setDefaultScriptDirection(res.data.response_body[0].writing_script_direction)
                            setDefaultTxtLanguage(res.data.response_body[0].language)
                            setDefaultTxtLanguageCode(res.data.response_body[0].language_code)
                            MarketplaceToaster.showToast(res)
                        }
                        setOnChangeValues(false)
                        setIsLoading(false)
                    }
                })
                .catch((error) => {
                    setIsLoading(false)
                    console.log('error response of put language API', error)
                    MarketplaceToaster.showToast(error.response)
                })
        }
    }

    const validateLanguageFieldEmptyOrNot = () => {
        let validValues = 2
        if (txtLanguage.trim() === '' && txtLanguageCode.trim() === '') {
            setIsEditLanguageFieldEmpty(true)
            setIsEditLanguageCodeFieldEmpty(true)
            validValues--
            MarketplaceToaster.showToast(
                util.getToastObject(`${t('messages:please_enter_the_values_for_the_mandatory_fields')}`, 'error')
            )
        } else if (txtLanguage.trim() === '' && txtLanguageCode.trim() !== '') {
            setIsEditLanguageFieldEmpty(true)
            validValues--
            MarketplaceToaster.showToast(
                util.getToastObject(`${t('messages:please_enter_the_values_for_the_mandatory_fields')}`, 'error')
            )
        } else if (txtLanguageCode.trim() === '' && txtLanguage.trim() !== '') {
            setIsEditLanguageCodeFieldEmpty(true)
            validValues--
            MarketplaceToaster.showToast(
                util.getToastObject(`${t('messages:please_enter_the_values_for_the_mandatory_fields')}`, 'error')
            )
        } else if (
            validator.isLength(txtLanguage.trim(), {
                min: titleMinLength,
                max: titleMaxLength,
            }) === false
        ) {
            validValues--
            setIsEditLanguageFieldEmpty(true)
            MarketplaceToaster.showToast(
                util.getToastObject(
                    `${t('messages:language_must_contain_minimum_of')} ${titleMinLength}, ${t(
                        'messages:maximum_of'
                    )} ${titleMaxLength} ${t('messages:characters')}`,
                    'error'
                )
            )
        } else if (
            validator.isLength(txtLanguageCode.trim(), {
                min: languageCodeMinLength,
                max: languageCodeMaxLength,
            }) === false
        ) {
            validValues--
            setIsEditLanguageCodeFieldEmpty(true)
            MarketplaceToaster.showToast(
                util.getToastObject(
                    `${t('messages:language_code_must_contain_minimum_of')} ${languageCodeMinLength}, ${t(
                        'messages:maximum_of'
                    )} ${languageCodeMaxLength} ${t('messages:characters')}`,
                    'error'
                )
            )
        }
        if (validValues === 2) {
            handleServerCall()
        }
    }
    const handleScriptDirectionChange = (value) => {
        setScriptDirection(value)
    }

    const findAllLanguageData = () => {
        setIsLoading(true)
        MarketplaceServices.findAll(languageAPI, null, false)
            .then(function (response) {
                setIsLoading(false)
                console.log('server Success response from language get API call', response.data)

                let serverLanguageData = response.data.response_body
                let filteredServerLangData =
                    serverLanguageData &&
                    serverLanguageData.length > 0 &&
                    serverLanguageData.filter((ele) => parseInt(ele.status) === 1)
                console.log('filteredServerLangData', filteredServerLangData)
                dispatch(fnStoreLanguage(filteredServerLangData))

                if (serverLanguageData && serverLanguageData.length > 0) {
                    const filteredLanguageData = serverLanguageData.filter((ele) => ele.language_code === languageCode)
                    console.log('filteredLanguageData', filteredLanguageData)
                    setTxtLanguage(filteredLanguageData[0].language)
                    setTxtLanguageCode(filteredLanguageData[0].language_code)
                    setScriptDirection(filteredLanguageData[0].writing_script_direction)
                    setDefaultTxtLanguage(filteredLanguageData[0].language)
                    setDefaultTxtLanguageCode(filteredLanguageData[0].language_code)
                    setDefaultScriptDirection(filteredLanguageData[0].writing_script_direction)
                }
            })
            .catch((error) => {
                setIsLoading(false)
                console.log('server error response from language API call', error.response)
            })
    }

    useEffect(() => {
        window.scrollTo(0, 0)
        if (languageCode !== undefined && languageCode !== null) {
            findAllLanguageData()
        }
        if (languageCode !== undefined && languageName !== undefined) {
            setIsEditLanguageCodeFieldEmpty(false)
            setIsEditLanguageFieldEmpty(false)
        }
    }, [languageCode, languageName])
    return (
        <Card className='w-[750px]'>
            <CardHeader>
                <CardTitle className='text-regal-blue '>{t('labels:language_details')}</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent>
                {isLoading && (
                    <div className='flex justify-center items-center h-full'>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        <span>{t('labels:please_wait')}</span>
                    </div>
                )}
                {!isLoading && (
                    <>
                        <div className='space-y-4'>
                            <div>
                                <Label htmlFor='language'>
                                    {t('labels:language')}
                                    <span className='text-destructive ml-1'>*</span>
                                </Label>
                                <Input
                                    id='language'
                                    placeholder={t('placeholders:enter_language_name')}
                                    value={txtLanguage}
                                    minLength={titleMinLength}
                                    maxLength={titleMaxLength}
                                    disabled={parseInt(languageStatus) === 1}
                                    className={`${isEditLanguageFieldEmpty ? 'border-destructive' : ''} w-4/6 mt-2`}
                                    onChange={(e) => {
                                        if (e.target.value !== '' && validator.isAlpha(e.target.value)) {
                                            setTxtLanguage(e.target.value)
                                            setOnChangeValues(true)
                                        } else if (e.target.value === '') {
                                            setTxtLanguage(e.target.value)
                                            setOnChangeValues(true)
                                        }
                                        setIsEditLanguageFieldEmpty(false)
                                    }}
                                    onBlur={() => {
                                        const trimmed = txtLanguage.trim()
                                        const trimmedUpdate = trimmed.replace(/\s+/g, ' ')
                                        setTxtLanguage(trimmedUpdate)
                                    }}
                                />
                            </div>

                            <div>
                                <Label htmlFor='languageCode'>
                                    {t('labels:language_code')}
                                    <span className='text-destructive ml-1'>*</span>
                                </Label>
                                <Input
                                    id='languageCode'
                                    placeholder={t('placeholders:enter_language_code')}
                                    value={txtLanguageCode}
                                    minLength={languageCodeMinLength}
                                    maxLength={languageCodeMaxLength}
                                    disabled={parseInt(languageStatus) === 1}
                                    onInput={(e) => {
                                        const lowerCaseLettersRegex = /^[a-z]+$/
                                        setIsHelperTextVisible(!lowerCaseLettersRegex.test(e.nativeEvent.data))
                                    }}
                                    className={`${isEditLanguageCodeFieldEmpty ? 'border-destructive' : ''} w-4/6 mt-2`}
                                    onChange={(e) => {
                                        const languageCodeRegex = /^[a-z\-]+$/
                                        if (
                                            e.target.value !== '' &&
                                            validator.matches(e.target.value, languageCodeRegex)
                                        ) {
                                            setTxtLanguageCode(e.target.value)
                                            setOnChangeValues(true)
                                        } else if (e.target.value === '') {
                                            setTxtLanguageCode(e.target.value)
                                            setOnChangeValues(true)
                                        }
                                        setIsEditLanguageCodeFieldEmpty(false)
                                    }}
                                    onBlur={() => {
                                        const trimmed = txtLanguageCode.trim()
                                        const trimmedUpdate = trimmed.replace(/\s+/g, ' ')
                                        setTxtLanguageCode(trimmedUpdate)
                                    }}
                                />
                                {isHelperTextVisible && (
                                    <p className='text-sm text-destructive mt-1'>
                                        {t('messages:language_code_helper_text')}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label>{t('labels:script_direction')}</Label>
                                <Tabs
                                    value={scriptDirection}
                                    className='w-4/6 mt-2'
                                    onValueChange={(value) => {
                                        if (value) {
                                            handleScriptDirectionChange(value)
                                            if (value !== defaultScriptDirection) {
                                                setOnChangeValues(true)
                                            }
                                        }
                                    }}
                                    disabled={parseInt(languageStatus) === 1}>
                                    <TabsList className='grid  grid-cols-2'>
                                        <TabsTrigger value='LTR'>{t('labels:left_to_right')}</TabsTrigger>
                                        <TabsTrigger value='RTL'>{t('labels:right_to_left')}</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                        </div>
                        {(txtLanguageCode !== '' || txtLanguage !== '') &&
                            onChangeValues &&
                            (txtLanguage !== defaultTxtLanguage ||
                                txtLanguageCode !== defaultTxtLanguageCode ||
                                scriptDirection !== defaultScriptDirection) && (
                                <div className='flex  mt-4 gap-5'>
                                    <Button
                                        onClick={() => {
                                            if (
                                                txtLanguage === defaultTxtLanguage &&
                                                txtLanguageCode === defaultTxtLanguageCode &&
                                                scriptDirection === defaultScriptDirection
                                            ) {
                                                MarketplaceToaster.showToast(
                                                    util.getToastObject(
                                                        `${t('messages:no_changes_were_detected')}`,
                                                        'warning'
                                                    )
                                                )
                                            } else {
                                                validateLanguageFieldEmptyOrNot()
                                            }
                                        }}>
                                        {languageCode !== undefined && languageCode !== null
                                            ? t('labels:update')
                                            : t('labels:save')}
                                    </Button>
                                    <Button
                                        variant='outline'
                                        onClick={() => {
                                            if (languageCode === undefined || languageCode === null) {
                                                setTxtLanguageCode('')
                                                setTxtLanguage('')
                                                setIsEditLanguageFieldEmpty(false)
                                                setIsEditLanguageCodeFieldEmpty(false)
                                            } else {
                                                setTxtLanguage(defaultTxtLanguage)
                                                setTxtLanguageCode(defaultTxtLanguageCode)
                                                setScriptDirection(defaultScriptDirection)
                                                setIsEditLanguageFieldEmpty(false)
                                                setIsEditLanguageCodeFieldEmpty(false)
                                            }
                                        }}>
                                        {t('labels:cancel')}
                                    </Button>
                                </div>
                            )}
                    </>
                )}
            </CardContent>
        </Card>
    )
}

export default LanguageForm
