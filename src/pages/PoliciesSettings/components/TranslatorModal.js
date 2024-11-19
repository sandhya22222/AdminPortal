import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import validator from 'validator'
import MarketplaceServices from '../../../services/axios/MarketplaceServices'
import util from '../../../util/common'
import MarketplaceToaster from '../../../util/marketplaceToaster'
import useGetStoreLanguage from '../hooks/useGetStoreLanguage'
import { useLocation } from 'react-router-dom'
import { deepCopy } from '../../../util/util'
import { Button } from '../../../shadcnComponents/ui/button'
import { Progress } from '../../../shadcnComponents/ui/progress'
import Spin from '../../../shadcnComponents/customComponents/Spin'
import { Skeleton } from '../../../shadcnComponents/ui/skeleton'
import ShadCnTooltip from '../../../shadcnComponents/customComponents/ShadCNTooltip'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shadcnComponents/ui/select'
import StoreModal from '../../../components/storeModal/StoreModal'
import { Input } from '../../../shadcnComponents/ui/input'
import { Textarea } from '../../../shadcnComponents/ui/textarea'

const leadlineDisplayNameAPI = process.env.REACT_APP_LEADLINE_DISPLAYNAME

// ! input fields properties
const titleMaxLength = process.env.REACT_APP_TITLE_MAX_LENGTH
const descriptionMaxLength = process.env.REACT_APP_DESCRIPTION_MAX_LENGTH

const TranslatorModal = ({
    dataJson,
    componentType,
    respectiveId,
    setTranslateModalVisible,
    onChangeDisableFields,
    setOnChangeDisableFields,
    setLeadInLine,
    loadingSkelton,
    setLoadingSkelton,
    refetchUserConsents,
}) => {
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const search = useLocation().search

    const storeUUID = new URLSearchParams(search).get('id')
    const userSelectedLanguageCode = util.getUserSelectedLngCode()
    // const productTemplateSelectedInfo = useSelector((state) => state.reducerProducts.productTemplateSelectedInfo)
    const [displayNameDataJson, setDisplayNameDataJson] = useState(dataJson)
    const [storeLanguages, setStoreLanguages] = useState()
    const [defaultLanguageName, setDefaultLanguageName] = useState()
    const [allLanguages, setAllLanguages] = useState()

    const [isLoadingStoreLanguage, setIsLoadingStoreLanguage] = useState(true)
    const [selectedLanguageFromDropDown, setSelectedLanguageFromDropDown] = useState()
    const [allDisplayNameData, setAllDisplayNameData] = useState()
    const [commonDataContainingAllObject, setCommonDataContainingAllObject] = useState()
    let [putCallStatus, setPutCallStatus] = useState(1)

    const [languagesWithInvalidData, setLanguagesWithInvalidData] = useState()
    const [isInputFieldsValidationModalOpen, setIsInputFieldsValidationModalOpen] = useState(false)
    const [invalidName, setInvalidName] = useState(false)
    const [invalidDescription, setInvalidDescription] = useState(false)
    const [mainTitle, setMainTitle] = useState()
    const [title, setTitle] = useState()
    const [label, setLabel] = useState()
    const [objectForDetailsUpdate, setObjectForDetailsUpdate] = useState()
    const [displayNameApiData, setDisplayNameApiData] = useState([])
    const [alreadyTranslatedCount, setAlreadyTranslatedCount] = useState(0)
    const [languages, setLanguages] = useState([{ label: 'English', key: 'en' }])

    const { data: userConsentLanguageData, status: userConsentLanguageStatus } = useGetStoreLanguage({
        storeUUID,
    })

    const getStoreLanguageData = (getDisplayNameApiEndPoint) => {
        const StoreLanguageResponse = userConsentLanguageData?.data
        setStoreLanguages(StoreLanguageResponse)
        const defaultLanguageCode =
            StoreLanguageResponse &&
            StoreLanguageResponse.length > 0 &&
            StoreLanguageResponse.filter((element) => element.is_default)[0].language_code

        findAllDisplayNameData(StoreLanguageResponse, defaultLanguageCode, getDisplayNameApiEndPoint)
        setDefaultLanguageName(
            StoreLanguageResponse &&
                StoreLanguageResponse.length > 0 &&
                StoreLanguageResponse.filter((element) => element.is_default)
        )
        setAllLanguages(StoreLanguageResponse)
        setSelectedLanguageFromDropDown(defaultLanguageCode)
    }

    //! get call to display  names

    /*  here we are creating common array of objects.
      if storeLanguages are not added in display name then we are adding object in common array with 
      respective ID (with key as product , category, product type etc) otherwise we are adding same object what we are getting from displayName get call 
      with key as id 
  */

    const findAllDisplayNameData = (StoreLanguageResponse, defaultLanguageCode, getDisplayNameApiEndPoint) => {
        let getParams
        switch (componentType) {
            case 'leadline':
                getParams = { leadline_id: parseInt(respectiveId) }
                break
            default:
                return null
        }
        MarketplaceServices.findAll(getDisplayNameApiEndPoint, getParams, false)
            .then(function (response) {
                setIsLoadingStoreLanguage(false)
                console.log('edit selected get displayname response : ', response.data)
                let tempArray
                let displayNameData
                let updatedDisplayNameData
                if (response.data) {
                    switch (componentType) {
                        case 'leadline':
                            tempArray = deepCopy(response.data.response_body.User_Consent_leadline_Displaynames)
                            updatedDisplayNameData = tempArray.map((item) => {
                                const { language, ...rest } = item
                                return {
                                    ...rest,
                                    language_code: language,
                                }
                            })
                            setDisplayNameApiData(updatedDisplayNameData)
                            setAllDisplayNameData(updatedDisplayNameData)
                            displayNameData = updatedDisplayNameData
                            break

                        default:
                            return null
                    }
                    let finalObjectWithAllData = []
                    setCommonDataContainingAllObject(updatedDisplayNameData)
                    for (let i = 0; i < StoreLanguageResponse.length; i++) {
                        let storeLanguageDataIsAvailableInDisplayNameData =
                            updatedDisplayNameData &&
                            updatedDisplayNameData.length > 0 &&
                            updatedDisplayNameData.filter(
                                (ele) => ele.language_code === StoreLanguageResponse[i].language_code
                            )
                        if (
                            storeLanguageDataIsAvailableInDisplayNameData &&
                            storeLanguageDataIsAvailableInDisplayNameData.length > 0
                        ) {
                        } else {
                            switch (componentType) {
                                case 'leadline':
                                    finalObjectWithAllData.push({
                                        leadline: parseInt(respectiveId),
                                        language_code:
                                            StoreLanguageResponse[i] && StoreLanguageResponse[i].language_code,
                                        display_name: '',
                                        store: response.data.response_body?.store,
                                    })
                                    break
                                default:
                                    return null
                            }
                        }
                    }

                    setCommonDataContainingAllObject([...updatedDisplayNameData, ...finalObjectWithAllData])
                }
                setAlreadyTranslatedCount(response?.data?.response_body?.count)
                setLoadingSkelton(false)
            })
            .catch(function (error) {
                console.log('edit selected get displayname error response', error.response)
                setLoadingSkelton(false)
            })
        setIsLoadingStoreLanguage(false)
    }

    //! doing put call for  display name
    const updateMultilingualDetails = (putDisplayNameApiEndPoint, changedDataForPutCall, postApiStatus) => {
        let finalPutBody
        switch (componentType) {
            case 'leadline':
                finalPutBody = { userconsentleadline_displayname: changedDataForPutCall }
                break
            default:
                return null
        }

        let putParams
        switch (componentType) {
            case 'leadline':
                putParams = { leadline_id: parseInt(respectiveId) }
                break
            default:
                return null
        }
        MarketplaceServices.update(putDisplayNameApiEndPoint, finalPutBody, putParams)
            .then((response) => {
                console.log('put call for updateMultilingualDetails', response.data)
                setPutCallStatus(++putCallStatus)
                switch (componentType) {
                    case 'leadline':
                        if (response.data) {
                            refetchUserConsents()
                            const selectedLangDisplayAdded =
                                response.data &&
                                response.data.response_body &&
                                response.data.response_body.length > 0 &&
                                response.data.response_body.filter(
                                    (val) => val.language_code === userSelectedLanguageCode
                                )
                            if (selectedLangDisplayAdded && selectedLangDisplayAdded.length > 0) {
                                // setLeadInLine(selectedLangDisplayAdded[0]?.display_name.trim())
                            }
                        }
                        break

                    default:
                    // return null;
                }
                if (postApiStatus === 200) {
                    MarketplaceToaster.showToast(response)
                } else {
                    MarketplaceToaster.showToast(
                        util.getToastObject(`${t('common:multilingual_details_partially_saved')}`, 'warning')
                    )
                }
                setIsLoadingStoreLanguage(false)
                setTranslateModalVisible(false)
            })
            .catch((error) => {
                console.log('error in Display Put call', error.response.data)
                if (postApiStatus === 200) {
                    MarketplaceToaster.showToast(
                        util.getToastObject(`${t('common:multilingual_details_partially_saved')}`, 'warning')
                    )
                } else {
                    MarketplaceToaster.showToast(error.response)
                }
                setIsLoadingStoreLanguage(false)
            })
    }

    const handleLanguageChange = (val) => {
        setSelectedLanguageFromDropDown(val)
    }
    const validationOfDataForPutCall = (tempArrDataWithDisplayNameId) => {
        let finalPutBody = []
        console.log('displayNameApiDataaa', displayNameApiData)
        for (let i = 0; i < displayNameApiData.length; i++) {
            const id = displayNameApiData[i].id
            const localData =
                tempArrDataWithDisplayNameId &&
                tempArrDataWithDisplayNameId.find((element) => parseInt(element.id) === parseInt(id))
            let isChanged = false
            let obj = {}
            obj['id'] = displayNameApiData[i].id
            obj['language_code'] = displayNameApiData[i].language_code
            obj['store'] = displayNameApiData[i].store
            if (displayNameApiData[i].display_name !== localData.display_name) {
                obj['display_name'] = localData.display_name
                obj['description'] = localData.description
                isChanged = true
            }
            if (displayNameApiData[i].description !== localData.description) {
                obj['display_name'] = localData.display_name
                obj['description'] = localData.description
                isChanged = true
            }
            if (isChanged) {
                finalPutBody.push(obj)
            }
        }
        return finalPutBody
    }
    const saveDisplayName = (
        putDisplayNameApiEndPoint,
        finalDataForPostCall,
        putCallWillHappen,
        callWithDefaultDetails,
        changedDataForPutCall,
        finalDataForPutCall
    ) => {
        let finalPostBody
        switch (componentType) {
            case 'leadline':
                finalPostBody = { userconsentleadline_displayname: finalDataForPostCall }
                break
            default:
                return null
        }

        MarketplaceServices.save(putDisplayNameApiEndPoint, finalPostBody, null)
            .then((response) => {
                switch (componentType) {
                    case 'leadline':
                        if (response.data) {
                            refetchUserConsents()
                            const selectedLangDisplayAdded =
                                response.data &&
                                response.data.response_body.length > 0 &&
                                response.data.response_body.filter(
                                    (val) => val.language_code === userSelectedLanguageCode
                                )
                            if (selectedLangDisplayAdded && selectedLangDisplayAdded.length > 0) {
                                // setLeadInLine(selectedLangDisplayAdded[0]?.display_name.trim())
                            }
                        }
                        break

                    default:
                    // return null;
                }
                if (putCallWillHappen) {
                    if (callWithDefaultDetails) {
                        if (finalDataForPutCall && finalDataForPutCall.length > 0) {
                            updateMultilingualDetails(putDisplayNameApiEndPoint, finalDataForPutCall, 200)
                            setPutCallStatus(2)
                            setIsLoadingStoreLanguage(true)
                        }
                    } else if (changedDataForPutCall && changedDataForPutCall.length > 0) {
                        updateMultilingualDetails(putDisplayNameApiEndPoint, changedDataForPutCall, 200)
                        setPutCallStatus(2)
                        setIsLoadingStoreLanguage(true)
                    }
                } else {
                    MarketplaceToaster.showToast(response)
                    setIsLoadingStoreLanguage(false)
                    setTranslateModalVisible(false)
                }
            })
            .catch((error) => {
                setIsLoadingStoreLanguage(false)
                MarketplaceToaster.showToast(error.response)
            })
    }

    const InputValuesValidationFromAllLanguages = (
        commonDataContainingAllObject,
        callWithDefaultDetails,
        finalDataForPostCall,
        finalDataForPutCall
    ) => {
        const tempArrDataWithDisplayNameId =
            commonDataContainingAllObject &&
            commonDataContainingAllObject.filter(function (o) {
                return o.hasOwnProperty('id')
            })
        const tempArrDataWithCategoryId =
            commonDataContainingAllObject &&
            commonDataContainingAllObject.filter(function (o) {
                return !o.hasOwnProperty('id')
            })
        let changedDataForPutCall = validationOfDataForPutCall(tempArrDataWithDisplayNameId)
        let postCallWillHappen =
            ((finalDataForPostCall && finalDataForPostCall.length > 0) ||
                (tempArrDataWithCategoryId && tempArrDataWithCategoryId.length > 0)) === true
                ? true
                : false
        let putDisplayNameApiEndPoint
        switch (componentType) {
            case 'leadline':
                putDisplayNameApiEndPoint = leadlineDisplayNameAPI
                break
            default:
                return null
        }
        let putCallWillHappen =
            ((changedDataForPutCall && changedDataForPutCall.length > 0) ||
                (finalDataForPutCall && finalDataForPutCall.length > 0)) === true
                ? true
                : false
        if (!postCallWillHappen) {
            if (callWithDefaultDetails) {
                if (finalDataForPutCall && finalDataForPutCall.length > 0) {
                    updateMultilingualDetails(putDisplayNameApiEndPoint, finalDataForPutCall, 200)
                    setPutCallStatus(2)
                    setIsLoadingStoreLanguage(true)
                }
            } else if (changedDataForPutCall && changedDataForPutCall.length > 0) {
                updateMultilingualDetails(putDisplayNameApiEndPoint, changedDataForPutCall, 200)
                setPutCallStatus(2)
                setIsLoadingStoreLanguage(true)
            }
        } else {
            setIsLoadingStoreLanguage(true)
            let resultForInputFieldsValidationForApiCalls = inputFieldsValidationForApiCalls(
                tempArrDataWithDisplayNameId,
                tempArrDataWithCategoryId
            )
            if (resultForInputFieldsValidationForApiCalls && resultForInputFieldsValidationForApiCalls.length > 0) {
                saveDisplayName(
                    putDisplayNameApiEndPoint,
                    finalDataForPostCall,
                    putCallWillHappen,
                    callWithDefaultDetails,
                    putDisplayNameApiEndPoint,
                    changedDataForPutCall,
                    finalDataForPutCall
                )
            } else {
                saveDisplayName(
                    putDisplayNameApiEndPoint,
                    tempArrDataWithCategoryId,
                    putCallWillHappen,
                    callWithDefaultDetails,
                    putDisplayNameApiEndPoint,
                    changedDataForPutCall,
                    finalDataForPutCall
                )
            }
        }
        if (
            (tempArrDataWithCategoryId && tempArrDataWithCategoryId.length > 0) ||
            (changedDataForPutCall && changedDataForPutCall.length > 0)
        ) {
        } else {
            //! Now check for Default Details Changes
            if (componentType === 'onboardingVersion') {
                if (objectForDetailsUpdate.description === displayNameDataJson[0].value) {
                    MarketplaceToaster.showToast(util.getToastObject(`${t('common:no_change_detected')}`, 'info'))
                }
            } else {
                if (
                    objectForDetailsUpdate &&
                    objectForDetailsUpdate.name === displayNameDataJson[0].value &&
                    objectForDetailsUpdate &&
                    objectForDetailsUpdate.description === displayNameDataJson[1].value
                ) {
                    MarketplaceToaster.showToast(util.getToastObject(`${t('common:no_change_detected')}`, 'info'))
                }
            }
        }
    }

    const handleNameChangeFromAllLanguages = (val, byDefault) => {
        setInvalidName(false)
        let temp = deepCopy(commonDataContainingAllObject)
        if (byDefault) {
            let objIndex = temp.findIndex((obj) => obj.language_code === defaultLanguageName[0].language_code)
            temp[objIndex].display_name = val
            setCommonDataContainingAllObject(temp)
        } else {
            let objIndex = temp.findIndex((obj) => obj.language_code === selectedLanguageFromDropDown)
            temp[objIndex].display_name = val
            setCommonDataContainingAllObject(temp)
        }
    }
    const inputFieldsValidationForApiCalls = (tempArrDataWithDisplayNameId, tempArrDataWithCategoryId) => {
        let temp = []
        tempArrDataWithDisplayNameId &&
            tempArrDataWithDisplayNameId.length > 0 &&
            tempArrDataWithDisplayNameId.forEach((ele) => {
                if (ele.display_name === '' || ele.description === '') {
                    temp.push(ele.language_code)
                }
            })
        tempArrDataWithCategoryId &&
            tempArrDataWithCategoryId.length > 0 &&
            tempArrDataWithCategoryId.forEach((ele) => {
                if (ele.display_name === '' || ele.description === '') {
                    temp.push(ele.language_code)
                }
            })
        setLanguagesWithInvalidData(temp)
        return temp
    }
    const handleDescriptionChangeFromAllLanguages = (val, byDefault) => {
        setInvalidDescription(false)
        let temp = deepCopy(commonDataContainingAllObject)
        if (byDefault) {
            let objIndex = temp.findIndex((obj) => obj.language_code === defaultLanguageName[0].language_code)
            temp[objIndex].description = val
            setCommonDataContainingAllObject(temp)
        } else {
            let objIndex = temp.findIndex((obj) => obj.language_code === selectedLanguageFromDropDown)
            temp[objIndex].description = val
            setCommonDataContainingAllObject(temp)
        }
    }
    const handleObjectForDetailsUpdateName = (val) => {
        let tempObj = deepCopy(objectForDetailsUpdate)
        const updatedObj = { ...tempObj, name: val }
        setObjectForDetailsUpdate(updatedObj)
    }

    const handleObjectForDetailsUpdateDescription = (val) => {
        let tempObj = deepCopy(objectForDetailsUpdate)
        const updatedObj = { ...tempObj, description: val }
        setObjectForDetailsUpdate(updatedObj)
    }
    useEffect(() => {
        let getDisplayNameApiEndPoint
        switch (componentType) {
            case 'leadline':
                getDisplayNameApiEndPoint = leadlineDisplayNameAPI
                setLabel(`${t('labels:lead_in_line')}`)
                setObjectForDetailsUpdate({
                    name: dataJson[0]?.value,
                })
                break

            default:
                return null
        }
        if (onChangeDisableFields && loadingSkelton && userConsentLanguageStatus) {
            setCommonDataContainingAllObject([])
            setTimeout(function () {
                getStoreLanguageData(getDisplayNameApiEndPoint)
            }, 500)
        }
    }, [dataJson, userConsentLanguageData, userConsentLanguageStatus])

    useEffect(() => {
        setDisplayNameDataJson([
            {
                order: 1,
                label: `${t('labels:lead_in_line')}`,
                type: 'textbox',
                value: dataJson[0]?.value,
            },
        ])
    }, [dataJson])

    const handleSaveButton = () => {
        //!  checking commonObject is created or not
        if (commonDataContainingAllObject && commonDataContainingAllObject.length > 0) {
            //! checking weather default language is empty or not
            const defaultLanguageDisplayName =
                commonDataContainingAllObject &&
                commonDataContainingAllObject.length > 0 &&
                commonDataContainingAllObject.filter(
                    (value) => value.language_code === defaultLanguageName[0].language_code
                )[0].display_name

            const defaultLanguageDescription =
                commonDataContainingAllObject &&
                commonDataContainingAllObject.length > 0 &&
                commonDataContainingAllObject.filter(
                    (value) => value.language_code === defaultLanguageName[0].language_code
                )[0].description

            // if (defaultLanguageDisplayName !== '' && defaultLanguageDescription !== '') {
            const tempArrDataWithDisplayNameId =
                commonDataContainingAllObject &&
                commonDataContainingAllObject.filter(function (o) {
                    return o.hasOwnProperty('id')
                })

            const tempArrDataWithCategoryId =
                commonDataContainingAllObject &&
                commonDataContainingAllObject.filter(function (o) {
                    return !o.hasOwnProperty('id')
                })
            let resultForInputFieldsValidationForApiCalls = inputFieldsValidationForApiCalls(
                tempArrDataWithDisplayNameId,
                tempArrDataWithCategoryId
            )
            if (resultForInputFieldsValidationForApiCalls && resultForInputFieldsValidationForApiCalls.length > 0) {
                setIsInputFieldsValidationModalOpen(true)
            } else {
                let callWithDefaultDetails = false
                InputValuesValidationFromAllLanguages(commonDataContainingAllObject, callWithDefaultDetails)
            }
        } else {
            MarketplaceToaster.showToast(util.getToastObject(`${t('messages:something_went_wrong')}`, 'error'))
        }
    }

    const handleInputFieldsValidationModalSave = () => {
        setIsInputFieldsValidationModalOpen(false)
        let callWithDefaultDetails = true
        const tempArrDataWithCategoryId =
            commonDataContainingAllObject &&
            commonDataContainingAllObject.filter(function (o) {
                return !o.hasOwnProperty('id')
            })
        const tempArrDataWithDisplayNameId =
            commonDataContainingAllObject &&
            commonDataContainingAllObject.filter(function (o) {
                return o.hasOwnProperty('id')
            })
        let finalDataForPostCall = deepCopy(tempArrDataWithCategoryId)
        if (tempArrDataWithCategoryId && tempArrDataWithCategoryId.length > 0) {
            languagesWithInvalidData &&
                languagesWithInvalidData.length > 0 &&
                languagesWithInvalidData.forEach((element) => {
                    let objIndex = finalDataForPostCall.findIndex((obj) => obj.language_code === element)
                    if (element !== defaultLanguageName[0].language_code) {
                        if (finalDataForPostCall && finalDataForPostCall[objIndex].description === '') {
                            finalDataForPostCall[objIndex].description =
                                commonDataContainingAllObject &&
                                commonDataContainingAllObject.length > 0 &&
                                commonDataContainingAllObject.filter(
                                    (value) => value.language_code === defaultLanguageName[0].language_code
                                )[0].description
                        }
                        if (finalDataForPostCall && finalDataForPostCall[objIndex].display_name === '') {
                            finalDataForPostCall[objIndex].display_name =
                                commonDataContainingAllObject &&
                                commonDataContainingAllObject.length > 0 &&
                                commonDataContainingAllObject.filter(
                                    (value) => value.language_code === defaultLanguageName[0].language_code
                                )[0].display_name
                        }
                    }
                })
        }
        let finalDataForPutCall
        if (tempArrDataWithDisplayNameId && tempArrDataWithDisplayNameId.length > 0) {
            let changedDataForPutCall = validationOfDataForPutCall(tempArrDataWithDisplayNameId)
            finalDataForPutCall = deepCopy(changedDataForPutCall)
        }
        let dataWithDefaultLanguage =
            finalDataForPutCall &&
            finalDataForPutCall.length > 0 &&
            finalDataForPutCall.filter((ele) => ele.language_code === defaultLanguageName[0].language_code)
        let dataWithoutDefaultLanguage =
            finalDataForPutCall &&
            finalDataForPutCall.length > 0 &&
            finalDataForPutCall.filter((ele) => ele.language_code !== defaultLanguageName[0].language_code)

        if (
            dataWithoutDefaultLanguage &&
            dataWithoutDefaultLanguage.length > 0 &&
            dataWithDefaultLanguage &&
            dataWithDefaultLanguage.length > 0
        ) {
            finalDataForPutCall = [...dataWithoutDefaultLanguage, ...dataWithDefaultLanguage]
        } else if (dataWithoutDefaultLanguage && dataWithoutDefaultLanguage.length > 0) {
            finalDataForPutCall = [...dataWithoutDefaultLanguage]
        } else if (dataWithDefaultLanguage && dataWithDefaultLanguage.length > 0) {
            finalDataForPutCall = [...dataWithDefaultLanguage]
        }
        InputValuesValidationFromAllLanguages(
            commonDataContainingAllObject,
            callWithDefaultDetails,
            finalDataForPostCall,
            finalDataForPutCall
        )
    }

    const handleInputFieldsValidationModalClose = () => {
        setIsInputFieldsValidationModalOpen(false)
    }

    const handleTranslatorDiscard = () => {
        setTranslateModalVisible(false)
        setInvalidDescription(false)
        setInvalidName(false)
    }
    useEffect(() => {
        if (userConsentLanguageStatus === 'success') {
            if (userConsentLanguageData?.data?.length > 0) {
                setLanguages(
                    userConsentLanguageData.data.map((data) => ({
                        label: data.language,
                        key: data.language_code,
                    }))
                )
            }
        }
    }, [userConsentLanguageData, userConsentLanguageStatus])

    console.log('commonDataContainingAllObject#', commonDataContainingAllObject)

    return (
        <div>
            {loadingSkelton ? (
                <div className='p-3 space-y-2'>
                    {[...Array(6)].map((_, index) => (
                        <Skeleton key={index} className='h-4 w-full' />
                    ))}
                </div>
            ) : (
                <>
                    {isLoadingStoreLanguage ? (
                        <Spin />
                    ) : (
                        <>
                            <StoreModal
                                title={t('labels:language_with_invalid_inputs')}
                                isVisible={isInputFieldsValidationModalOpen}
                                okButtonText={null}
                                cancelButtonText={null}
                                okCallback={null}
                                cancelCallback={() => setIsInputFieldsValidationModalOpen(false)}
                                isSpin={false}
                                width={700}
                                hideCloseButton={false}>
                                <div>
                                    <div className=' mt-2 space-y-2'>
                                        <p className=''>{t('labels:the_multi_lingual_details_for')}</p>
                                        <ul
                                            className={
                                                languagesWithInvalidData && languagesWithInvalidData.length > 5
                                                    ? '!overflow-y-auto !h-24'
                                                    : ''
                                            }>
                                            {languagesWithInvalidData &&
                                                languagesWithInvalidData.length > 0 &&
                                                languagesWithInvalidData.map((ele, index) => {
                                                    return (
                                                        <>
                                                            {
                                                                <li className='!font-semibold'>
                                                                    {index + 1}
                                                                    {'. '}
                                                                    {storeLanguages &&
                                                                        storeLanguages.length > 0 &&
                                                                        storeLanguages.filter(
                                                                            (val) => val.language_code === ele
                                                                        )[0].language}
                                                                </li>
                                                            }
                                                        </>
                                                    )
                                                })}
                                        </ul>
                                        <p className=''>{t('labels:click_continue_to_save')}</p>
                                    </div>
                                    <div className={`p-2 -mb-3 w-full flex gap-2 justify-end`}>
                                        <Button
                                            variant='secondary'
                                            className={`w-6/12 md:w-auto`}
                                            onClick={() => handleInputFieldsValidationModalSave()}>
                                            {' '}
                                            {t('labels:proceed_without_translations')}
                                        </Button>
                                        <Button
                                            className='app-btn-primary w-6/12 md:w-auto'
                                            onClick={() => handleInputFieldsValidationModalClose()}>
                                            {t('labels:enter_translations')}
                                        </Button>
                                    </div>
                                </div>
                            </StoreModal>
                            <div className='flex flex-row gap-3 border-t border-b border-brandGray w-full'>
                                <div className='flex-grow-0 my-3 '>
                                    <p>
                                        <span className='font-normal opacity-40'>{t('labels:translate_from')}</span>{' '}
                                        <span className='font-medium'>{t('labels:base_language')}</span>
                                    </p>

                                    {displayNameDataJson &&
                                        displayNameDataJson.length > 0 &&
                                        displayNameDataJson.map((data) => (
                                            <div key={data.order}>
                                                {data.type === 'textbox' ? (
                                                    <div className='mt-8'>
                                                        <span className='input-label-color'>{label}</span>
                                                        <ShadCnTooltip
                                                            content={objectForDetailsUpdate?.name || ''}
                                                            position='bottom'>
                                                            <Input
                                                                disabled={true}
                                                                placeholder={t('labels:enter_title_here')}
                                                                className='w-full mt-2 border border-solid border-gray-300' // Adjust the border color as needed
                                                                value={objectForDetailsUpdate?.name || ''}
                                                                onChange={(e) =>
                                                                    handleObjectForDetailsUpdateName(e.target.value)
                                                                }
                                                                maxLength={100}
                                                            />
                                                        </ShadCnTooltip>
                                                    </div>
                                                ) : null}
                                                {data.type === 'textarea' ? (
                                                    <div className='my-3'>
                                                        <span className='input-label-color'>{data.label}</span>

                                                        <Textarea
                                                            disabled={true}
                                                            placeholder={t('common:enter_description_here')}
                                                            rows={1}
                                                            autoSize={true}
                                                            showCount
                                                            className='w-[100%] !pr-[3px] my-2 border-solid border-[#C6C6C6]'
                                                            value={
                                                                objectForDetailsUpdate &&
                                                                objectForDetailsUpdate.description
                                                            }
                                                            onChange={(e) =>
                                                                handleObjectForDetailsUpdateDescription(e.target.value)
                                                            }
                                                            maxLength={parseInt(descriptionMaxLength)}
                                                        />
                                                    </div>
                                                ) : null}
                                            </div>
                                        ))}
                                </div>
                                <div className='border-r !border-brandGray'></div>
                                <div className='flex-grow my-3'>
                                    <div className='flex gap-2 items-center justify-between'>
                                        <div className='flex items-center mb-2'>
                                            <p className='font-normal opacity-40 whitespace-nowrap mx-1'>
                                                {t('labels:translate_to')}
                                            </p>

                                            <Select
                                                value={selectedLanguageFromDropDown}
                                                onValueChange={handleLanguageChange}
                                                className='!mx-2 border-0 translator-select h-[22px] w-28'>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Select language' />{' '}
                                                </SelectTrigger>
                                                <SelectContent className='max-h-[138px] overflow-auto'>
                                                    {allLanguages &&
                                                        allLanguages.length > 0 &&
                                                        allLanguages.map((e) => (
                                                            <SelectItem
                                                                key={e.language_code}
                                                                value={e.language_code}
                                                                title={e.language}
                                                                className='translatorSelectOption'>
                                                                {e.language}
                                                            </SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>
                                            <>
                                                {defaultLanguageName &&
                                                defaultLanguageName.length > 0 &&
                                                selectedLanguageFromDropDown ===
                                                    defaultLanguageName[0].language_code ? (
                                                    <p className='!font-semibold text-[14px] whitespace-nowrap !ml-2 !opacity-60 hidden md:block min-w-[120px] visible'>
                                                        {t('labels:default_language')}
                                                    </p>
                                                ) : (
                                                    <p className='!font-semibold whitespace-nowrap !ml-2 !opacity-60 hidden md:block min-w-[120px] invisible'>
                                                        {' '}
                                                    </p>
                                                )}
                                            </>
                                        </div>
                                        <div className='flex'>
                                            <Progress
                                                className='w-[140px] !m-0 px-2'
                                                value={(alreadyTranslatedCount / allLanguages?.length) * 100}
                                                indicatorColor={'bg-orange-500'}
                                            />
                                            <p className='font-normal text-sm whitespace-nowrap'>
                                                {alreadyTranslatedCount} {t('common:of')} {allLanguages?.length}{' '}
                                                {t('labels:languages_translated')}
                                            </p>
                                        </div>
                                    </div>
                                    {displayNameDataJson &&
                                        displayNameDataJson.length > 0 &&
                                        displayNameDataJson.map((data) => (
                                            <>
                                                {data.type === 'textbox' ? (
                                                    <div className='my-2' key={data.order}>
                                                        <span className='input-label-color'>{label}</span>
                                                        <div className='mt-2'>
                                                            <Input
                                                                placeholder={t('labels:enter_title_here')}
                                                                className={`w-[100%] ${
                                                                    invalidName &&
                                                                    defaultLanguageName &&
                                                                    defaultLanguageName.length > 0 &&
                                                                    selectedLanguageFromDropDown ===
                                                                        defaultLanguageName[0].language_code
                                                                        ? 'border-red-400  border-[1px] border-solid focus:border-red-400 hover:border-red-400 '
                                                                        : ' border-[#C6C6C6] border-solid'
                                                                }`}
                                                                value={
                                                                    allLanguages && allLanguages.length > 0
                                                                        ? commonDataContainingAllObject &&
                                                                          commonDataContainingAllObject[0] &&
                                                                          commonDataContainingAllObject.length > 0 &&
                                                                          commonDataContainingAllObject.filter(
                                                                              (el) =>
                                                                                  el.language_code ===
                                                                                  selectedLanguageFromDropDown
                                                                          )[0].display_name
                                                                        : null
                                                                }
                                                                onChange={(e) => {
                                                                    if (
                                                                        validator.matches(
                                                                            e.target.value.trim(),
                                                                            /^\S.*$/
                                                                        )
                                                                    ) {
                                                                        handleNameChangeFromAllLanguages(
                                                                            e.target.value,
                                                                            false
                                                                        )
                                                                        setOnChangeDisableFields(false)
                                                                    } else if (e.target.value === '') {
                                                                        handleNameChangeFromAllLanguages(
                                                                            e.target.value,
                                                                            false
                                                                        )
                                                                        setOnChangeDisableFields(false)
                                                                    }
                                                                }}
                                                                onBlur={(e) => {
                                                                    let temp = deepCopy(commonDataContainingAllObject)
                                                                    let objIndex = temp.findIndex(
                                                                        (obj) =>
                                                                            obj.language_code ===
                                                                            selectedLanguageFromDropDown
                                                                    )
                                                                    temp[objIndex].display_name = e.target.value
                                                                        .trim()
                                                                        .replace(/\s+/g, ' ')
                                                                    setCommonDataContainingAllObject(temp)
                                                                }}
                                                                maxLength={parseInt(titleMaxLength)}
                                                            />
                                                        </div>
                                                    </div>
                                                ) : null}
                                                {data.type === 'textarea' ? (
                                                    <div className='my-3'>
                                                        <span className='input-label-color'>{data.label}</span>
                                                        <Textarea
                                                            placeholder={t('common:enter_description_here')}
                                                            autoSize={true}
                                                            showCount
                                                            rows={1}
                                                            className={`!pr-[3px] w-[100%] my-2 ${
                                                                invalidDescription &&
                                                                defaultLanguageName &&
                                                                defaultLanguageName.length > 0 &&
                                                                selectedLanguageFromDropDown ===
                                                                    defaultLanguageName[0].language_code
                                                                    ? 'border-red-400  border-[1px] border-solid focus:border-red-400 hover:border-red-400 '
                                                                    : ' border-[#C6C6C6] border-solid'
                                                            }`}
                                                            value={
                                                                allLanguages && allLanguages.length > 0
                                                                    ? commonDataContainingAllObject &&
                                                                      commonDataContainingAllObject.length > 0 &&
                                                                      commonDataContainingAllObject.filter(
                                                                          (el) =>
                                                                              el.language_code ===
                                                                              selectedLanguageFromDropDown
                                                                      )[0].description
                                                                    : null
                                                            }
                                                            onChange={(e) => {
                                                                if (
                                                                    validator.matches(
                                                                        e.target.value.trim(),
                                                                        /^\S.*$|^\s+\S.*$/gm
                                                                    )
                                                                ) {
                                                                    handleDescriptionChangeFromAllLanguages(
                                                                        e.target.value,
                                                                        false
                                                                    )
                                                                    setOnChangeDisableFields(false)
                                                                } else if (e.target.value === '') {
                                                                    handleDescriptionChangeFromAllLanguages(
                                                                        e.target.value,
                                                                        false
                                                                    )
                                                                    setOnChangeDisableFields(false)
                                                                }
                                                            }}
                                                            onBlur={(e) => {
                                                                const updatedValue = e.target.value
                                                                    ?.split('\n') // Split by newline characters
                                                                    .map((line) => line.trim().replace(/\s+/g, ' ')) // Remove leading whitespace and replace multiple spaces on each line
                                                                    .join('\n') // Join lines back together

                                                                let temp = deepCopy(commonDataContainingAllObject)
                                                                const objIndex = temp.findIndex(
                                                                    (obj) =>
                                                                        obj.language_code ===
                                                                        selectedLanguageFromDropDown
                                                                )
                                                                if (objIndex !== -1) {
                                                                    temp[objIndex].description = updatedValue
                                                                    setCommonDataContainingAllObject(temp)
                                                                }
                                                            }}
                                                            maxLength={parseInt(descriptionMaxLength)}
                                                        />
                                                    </div>
                                                ) : null}
                                            </>
                                        ))}
                                </div>
                            </div>
                            <div
                                className={`mt-3 -mb-3 !w-full ${
                                    util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL'
                                        ? 'text-left'
                                        : 'text-right'
                                }`}>
                                <Button
                                    variant='outline'
                                    className={`app-btn-secondary ${
                                        util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? '!ml-2' : '!mr-2'
                                    }`}
                                    onClick={() => handleTranslatorDiscard()}>
                                    {t('common:discard')}
                                </Button>
                                <Button
                                    variant='outline'
                                    className={`app-btn-primary`}
                                    onClick={() => handleSaveButton()}
                                    disabled={
                                        !onChangeDisableFields
                                            ? allLanguages && allLanguages.length > 0
                                                ? (commonDataContainingAllObject &&
                                                      commonDataContainingAllObject[0] &&
                                                      commonDataContainingAllObject.length > 0 &&
                                                      commonDataContainingAllObject.filter(
                                                          (el) => el.language_code === selectedLanguageFromDropDown
                                                      )[0].display_name === null) ||
                                                  (commonDataContainingAllObject &&
                                                      commonDataContainingAllObject[0] &&
                                                      commonDataContainingAllObject.length > 0 &&
                                                      commonDataContainingAllObject.filter(
                                                          (el) => el.language_code === selectedLanguageFromDropDown
                                                      )[0].display_name === '') ||
                                                  (commonDataContainingAllObject &&
                                                      commonDataContainingAllObject[0] &&
                                                      commonDataContainingAllObject.length > 0 &&
                                                      commonDataContainingAllObject.filter(
                                                          (el) => el.language_code === selectedLanguageFromDropDown
                                                      )[0].description === null) ||
                                                  (commonDataContainingAllObject &&
                                                      commonDataContainingAllObject[0] &&
                                                      commonDataContainingAllObject.length > 0 &&
                                                      commonDataContainingAllObject.filter(
                                                          (el) => el.language_code === selectedLanguageFromDropDown
                                                      )[0].description === '')
                                                    ? true
                                                    : false
                                                : true
                                            : true
                                    }>
                                    {t('common:save')}
                                </Button>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    )
}

export default TranslatorModal
