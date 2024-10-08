import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { CheckCircle, Trash2 } from 'lucide-react'
import { Button } from '../../shadcnComponents/ui/button'
import { Checkbox } from '../../shadcnComponents/ui/checkbox'
import { Switch } from '../../shadcnComponents/ui/switch'
import StoreModal from '../../components/storeModal/StoreModal'
import MarketplaceServices from '../../services/axios/MarketplaceServices'
import MarketplaceToaster from '../../util/marketplaceToaster'
import { fnStoreLanguage, fnSelectedLanguage } from '../../services/redux/actions/ActionStoreLanguage'
import util from '../../util/common'

const languageAPI = process.env.REACT_APP_STORE_LANGUAGE_API
const languageEditStatusAPI = process.env.REACT_APP_STORE_LANGUAGE_STATUS_API

export default function LanguageHeaderAction({
    languageId,
    languageCode,
    languageName,
    languageStatus,
    languageDefault,
}) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { t } = useTranslation()

    const availableLanguages = useSelector((state) => state.reducerStoreLanguage.storeLanguage)
    const selectedLanguage = useSelector((state) => state.reducerSelectedLanguage.selectedLanguage)

    const [isDeleteLanguageModalOpen, setIsDeleteLanguageModalOpen] = useState(false)
    const [islanguageDeleting, setIslanguageDeleting] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [switchStatus, setSwitchStatus] = useState(parseInt(languageStatus) === 2 ? false : true)
    const [changeSwitchStatus, setChangeSwitchStatus] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isMakeAsDefault, setIsMakeAsDefault] = useState(String(languageDefault) === '1')
    const [defaultChecked, setDefaultChecked] = useState(false)
    const [warningLanguageDefaultModal, setWarningLanguageDefaultModal] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()
    const [languageReload, setLanguageReload] = useState()

    useEffect(() => {
        setSwitchStatus(parseInt(languageStatus) === 2 ? false : true)
    }, [languageStatus])

    useEffect(() => {
        setIsMakeAsDefault(String(languageDefault) === '1')
    }, [languageDefault])

    const updateLanguageStatus = async () => {
        const reqBody = {
            status: changeSwitchStatus ? 1 : 2,
        }
        setIsLoading(true)
        MarketplaceServices.update(languageEditStatusAPI, reqBody, {
            language_id: languageId,
        })
            .then((response) => {
                MarketplaceToaster.showToast(response)
                if (response.data && response.data.response_body) {
                    if (parseInt(response.data.response_body[0].status) === 1) {
                        availableLanguages.push(response.data.response_body[0])
                        dispatch(fnStoreLanguage(availableLanguages))
                    } else if (parseInt(response.data.response_body[0].status) === 2) {
                        dispatch(
                            fnStoreLanguage(
                                availableLanguages.filter(
                                    (ele) => parseInt(ele.id) !== parseInt(response.data.response_body[0].id)
                                )
                            )
                        )
                        if (
                            selectedLanguage &&
                            selectedLanguage.language_code === response.data.response_body[0].language_code
                        ) {
                            const defaultLanguage = availableLanguages.find((ele) => ele.is_default)
                            dispatch(fnSelectedLanguage(defaultLanguage))
                            util.setUserSelectedLngCode(defaultLanguage.language_code)
                            setTimeout(() => navigate(0), 2000)
                        }
                    }
                }
                setSwitchStatus(changeSwitchStatus)
                setIsModalOpen(false)
                setIsLoading(false)
                setSearchParams({
                    k: searchParams.get('k'),
                    n: searchParams.get('n'),
                    c: searchParams.get('c'),
                    s: changeSwitchStatus ? 1 : 2,
                    d: searchParams.get('d'),
                })
            })
            .catch((error) => {
                MarketplaceToaster.showToast(error.response)
                setIsLoading(false)
                setIsModalOpen(false)
            })
    }

    const makeAsDefaultLanguage = () => {
        setIsLoading(true)
        const reqBody = {
            is_default: defaultChecked,
        }
        MarketplaceServices.update(languageEditStatusAPI, reqBody, {
            language_id: languageId,
        })
            .then((response) => {
                MarketplaceToaster.showToast(response)
                setIsMakeAsDefault(defaultChecked)
                setWarningLanguageDefaultModal(false)
                setIsLoading(false)
                setSearchParams({
                    k: searchParams.get('k'),
                    n: searchParams.get('n'),
                    c: searchParams.get('c'),
                    s: searchParams.get('s'),
                    d: defaultChecked ? 1 : 0,
                })
            })
            .catch((error) => {
                setIsLoading(false)
                MarketplaceToaster.showToast(error.response)
            })
    }

    const removeLanguage = () => {
        setIslanguageDeleting(true)
        MarketplaceServices.remove(languageAPI, { _id: languageId })
            .then((response) => {
                if (response.status === 200 || response.status === 201) {
                    setIsDeleteLanguageModalOpen(false)
                }
                setShowSuccessModal(true)
                let filteredDeleteData = availableLanguages.filter((ele) => parseInt(ele.id) !== parseInt(languageId))
                dispatch(fnStoreLanguage(filteredDeleteData))
                let defaultData = filteredDeleteData.find((ele) => ele.is_default)
                if (selectedLanguage && selectedLanguage.id === parseInt(languageId)) {
                    setLanguageReload(defaultData.id)
                    dispatch(fnSelectedLanguage(defaultData))
                    util.setUserSelectedLngCode(defaultData.language_code)
                }
                setIslanguageDeleting(false)
            })
            .catch((error) => {
                setIslanguageDeleting(false)
                MarketplaceToaster.showToast(error.response)
            })
    }

    return (
        <div>
            <div className='flex items-center space-x-4'>
                <div className='flex items-center space-x-2'>
                    <span>Status:</span>
                    <span>{switchStatus ? 'Active' : 'Inactive'}</span>
                    <Switch
                        checked={switchStatus}
                        onCheckedChange={(checked) => {
                            setChangeSwitchStatus(checked)
                            setIsModalOpen(true)
                        }}
                        disabled={isMakeAsDefault}
                    />
                </div>
                <div className='flex items-center space-x-2'>
                    <Checkbox
                        id='default-language'
                        checked={isMakeAsDefault}
                        onCheckedChange={(checked) => {
                            setDefaultChecked(checked)
                            setWarningLanguageDefaultModal(true)
                        }}
                        disabled={!switchStatus || isMakeAsDefault}
                    />
                    <label htmlFor='default-language'>Make this the Default Language</label>
                </div>
                <div>
                    <Button
                        className='w-44 h-8'
                        variant='destructive'
                        onClick={() => setIsDeleteLanguageModalOpen(true)}
                        disabled={isMakeAsDefault}>
                        <Trash2 size={20} strokeWidth={2} className='mr-2 w-4 h-4 ' />
                        Delete Language
                    </Button>
                </div>
            </div>

            <StoreModal
                isVisible={isDeleteLanguageModalOpen}
                okButtonText={t('labels:delete')}
                cancelButtonText={t('labels:cancel')}
                title={<div>{t('labels:delete_language')}</div>}
                okCallback={removeLanguage}
                cancelCallback={() => setIsDeleteLanguageModalOpen(false)}
                isSpin={islanguageDeleting}
                hideCloseButton={false}>
                <div>
                    <p>{t('messages:remove_language_confirmation_message')}</p>
                </div>
            </StoreModal>

            <StoreModal
                isVisible={showSuccessModal}
                okButtonText={null}
                hideCloseButton={false}
                cancelButtonText={null}
                isSpin={false}>
                <div className='flex flex-col items-center justify-center'>
                    <CheckCircle className=' w-16 h-16' />
                    <h2 className='mt-4 text-xl font-semibold'>{t('messages:language_deleted_successfully')}</h2>
                    <Button
                        className='mt-4'
                        onClick={() => {
                            if (selectedLanguage && selectedLanguage.id === parseInt(languageReload)) {
                                window.location.href = '/dashboard/language'
                            } else {
                                navigate(`/dashboard/language`)
                            }
                        }}>
                        {t('labels:close')}
                    </Button>
                </div>
            </StoreModal>

            <StoreModal
                isVisible={isModalOpen}
                okButtonText={t('labels:proceed')}
                title={
                    <div>
                        {changeSwitchStatus
                            ? t('messages:language_activation_confirmation')
                            : t('messages:language_deactivation_confirmation')}
                    </div>
                }
                cancelButtonText={t('labels:cancel')}
                okCallback={updateLanguageStatus}
                cancelCallback={() => setIsModalOpen(false)}
                isSpin={isLoading}
                hideCloseButton={false}>
                <div>
                    <p>
                        {changeSwitchStatus
                            ? t('messages:language_activation_confirmation_message')
                            : t('messages:language_deactivation_confirmation_message')}
                    </p>
                </div>
            </StoreModal>

            <StoreModal
                isVisible={warningLanguageDefaultModal}
                okButtonText={t('labels:proceed')}
                cancelButtonText={t('labels:cancel')}
                title={t('labels:default_language')}
                okCallback={makeAsDefaultLanguage}
                cancelCallback={() => {
                    setWarningLanguageDefaultModal(false)
                    setIsMakeAsDefault(false)
                }}
                isSpin={isLoading}
                hideCloseButton={false}>
                <div>
                    <p>{t('messages:default_language_warning_msg')}</p>
                </div>
            </StoreModal>
        </div>
    )
}
