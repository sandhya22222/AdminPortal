import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from 'react-oidc-context'
import { Link, useNavigate } from 'react-router-dom'
import useGetStoreAdminConsent from '../../hooks/useGetStoreAdminConsent'
import MarketplaceServices from '../../services/axios/MarketplaceServices'
import util from '../../util/common'
import { Globe } from 'lucide-react'
import {
    fnSelectedLanguage,
    fnStoreLanguage,
    fnDefaultLanguage,
} from '../../services/redux/actions/ActionStoreLanguage'
import { Popover, PopoverContent, PopoverTrigger } from '../../shadcnComponents/ui/popover'

const portalInfo = JSON.parse(process.env.REACT_APP_PORTAL_INFO)
const multilingualFunctionalityEnabled = process.env.REACT_APP_IS_MULTILINGUAL_ENABLED
const languageAPI = process.env.REACT_APP_STORE_LANGUAGE_API

const NewFooter = ({ setIsLanguageSelected }) => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const auth = useAuth()
    const navigate = useNavigate()
    const { data: userConsentData } = useGetStoreAdminConsent()

    const storeLanguages = useSelector((state) => state.reducerStoreLanguage.storeLanguage)
    const selectedLanguage = useSelector((state) => state.reducerSelectedLanguage.selectedLanguage)

    const [defaultLanguageCode, setDefaultLanguageCode] = useState(selectedLanguage && selectedLanguage.language_code)
    const [storeSelectedLngCode, setStoreSelectedLngCode] = useState(selectedLanguage && selectedLanguage.language_code)

    const languageItems = []
    if (storeLanguages && storeLanguages.length > 0) {
        storeLanguages.forEach((element) => {
            const languageItem = {}
            languageItem['value'] = element.language_code
            languageItem['label'] = element.language
            languageItems.push(languageItem)
        })
    }

    const findAllLanguages = () => {
        MarketplaceServices.findAll(languageAPI, { 'language-status': 1 }, false)
            .then((response) => {
                console.log('Server response from findAllStoreLanguages', response.data.response_body)
                const storeLanguages = response.data.response_body
                const defaultLanguage = storeLanguages.find((item) => item.is_default)

                const userSelectedLanguageCode = util.getUserSelectedLngCode()
                if (userSelectedLanguageCode === undefined) {
                    const userSelectedLanguage = defaultLanguage
                    dispatch(fnSelectedLanguage(userSelectedLanguage))
                    document.body.style.direction =
                        userSelectedLanguage && userSelectedLanguage.writing_script_direction?.toLowerCase()
                }
                if (util.getUserSelectedLngCode()) {
                    let selectedLanguagePresentOrNot =
                        storeLanguages &&
                        storeLanguages.length > 0 &&
                        storeLanguages.filter((ele) => ele.language_code === util.getUserSelectedLngCode())
                    if (selectedLanguagePresentOrNot && selectedLanguagePresentOrNot.length > 0) {
                        const alreadySelectedLanguage = storeLanguages.find(
                            (item) => item.language_code === util.getUserSelectedLngCode()
                        )
                        dispatch(fnSelectedLanguage(alreadySelectedLanguage))
                        document.body.style.direction =
                            alreadySelectedLanguage && alreadySelectedLanguage.writing_script_direction?.toLowerCase()
                    } else {
                        const defaultLanguageSelectedLanguage = defaultLanguage
                        console.log('testInDahsboardSelectedLangInHeader#', defaultLanguageSelectedLanguage)
                        dispatch(fnSelectedLanguage(defaultLanguageSelectedLanguage))
                        util.setUserSelectedLngCode(defaultLanguageSelectedLanguage.language_code)
                        document.body.style.direction =
                            defaultLanguageSelectedLanguage &&
                            defaultLanguageSelectedLanguage.writing_script_direction?.toLowerCase()
                        setTimeout(function () {
                            navigate(0)
                        }, 2000)
                    }
                }

                dispatch(fnStoreLanguage(storeLanguages))
                dispatch(fnDefaultLanguage(defaultLanguage))
            })
            .catch((error) => {
                console.log('error-->', error.response)
            })
    }

    const handleLanguageClick = (value) => {
        util.setUserSelectedLngCode(value)
        setStoreSelectedLngCode(value)
        dispatch(fnSelectedLanguage(storeLanguages.find((item) => item.language_code === value)))
        document.body.style.direction = util.getSelectedLanguageDirection()?.toLowerCase()
        setIsLanguageSelected(true)
        setTimeout(() => {
            navigate(0)
        }, 500)
    }

    const getLanguageLabel = (languageCode) => {
        const languageItem = languageItems.find((item) => item.value?.toLowerCase() === languageCode?.toLowerCase())
        return languageItem?.label
    }

    useEffect(() => {
        findAllLanguages()
    }, [])

    useEffect(() => {
        setStoreSelectedLngCode(selectedLanguage && selectedLanguage.language_code)
        setDefaultLanguageCode(util.getUserSelectedLngCode())
    }, [selectedLanguage])
    return (
        <div className='flex'>
            <div className='bg-white !w-[85%] py-6 max-h-[96px]  p-[2px] !flex flex-col !text-center gap-2 !items-center !justify-center'>
                {userConsentData && userConsentData.length > 0 ? (
                    <div className='text-xs gap-x-6 flex max-h-[45px] overflow-y-auto items-center flex-wrap justify-center '>
                        {userConsentData.map((data, index) =>
                            index <= 3 ? (
                                <React.Fragment key={data.id}>
                                    <Link
                                        to={`/dashboard/userprofile?tab=policies&subtab=${data.id}`}
                                        // className='text-xs text-gray-600 hover:text-gray-800 no-underline'
                                        title={
                                            data?.version_details?.consent_name ||
                                            data?.version_details?.consent_display_name
                                        }>
                                        <div className='max-w-[280px] text-gray-500'>
                                            {data?.version_details?.consent_name ||
                                                data?.version_details?.consent_display_name}
                                        </div>
                                    </Link>
                                    {index !== userConsentData.length - 1 && <span className='text-gray-200'>|</span>}
                                </React.Fragment>
                            ) : null
                        )}
                        {userConsentData.length > 4 && (
                            <Link
                                // className='text-gray-500 hover:text-gray-800 no-underline'
                                to={`/dashboard/userprofile?tab=policies&subtab=${userConsentData[0].id}`}>
                                <span className='text-gray-500'>{t('labels:show_more')}</span>
                            </Link>
                        )}
                    </div>
                ) : null}
                {t('messages:footer_content') !== '-' && (
                    <p className='text-gray-500 text-xs mb-0'>{t('messages:footer_content')}</p>
                )}
            </div>
            <div className='bg-white !w-[15%] py-6 max-h-[96px] text-center p-[2px] flex flex-col gap-2 items-center justify-center'>
                {multilingualFunctionalityEnabled && (
                    <div
                        className={`mb-2  ${util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? '!mr-6' : '!ml-8'}`}>
                        <Popover>
                            <PopoverTrigger
                                className={`h-8 w-max ${languageItems && languageItems?.length === 1 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                disabled={languageItems && languageItems?.length === 1}>
                                <span className='flex flex-row items-center gap-1 gap-x-2  py-2 px-4 border-[1px] border-border cursor-pointer'>
                                    {<Globe size={18} />}
                                    {getLanguageLabel(
                                        storeSelectedLngCode?.toUpperCase() || defaultLanguageCode?.toUpperCase()
                                    )}
                                </span>
                            </PopoverTrigger>
                            <PopoverContent className='w-max cursor-pointer'>
                                {languageItems.map((option) => (
                                    <div
                                        key={option.value}
                                        className={`p-1 text-center ${option?.value === storeSelectedLngCode && 'text-brandPrimaryColor'}`}
                                        onClick={() => handleLanguageClick(option.value)}>
                                        {option.label}
                                    </div>
                                ))}
                            </PopoverContent>
                        </Popover>
                    </div>
                )}
            </div>
        </div>
    )
}

export default NewFooter
