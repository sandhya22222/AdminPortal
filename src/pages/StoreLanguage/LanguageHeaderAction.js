import { CheckCircleFilled } from '@ant-design/icons'
import { Button, Checkbox, Layout, Space, Switch, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import StoreModal from '../../components/storeModal/StoreModal'
import { deleteIcon } from '../../constants/media'
import MarketplaceServices from '../../services/axios/MarketplaceServices'
import MarketplaceToaster from '../../util/marketplaceToaster'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { fnStoreLanguage, fnSelectedLanguage } from '../../services/redux/actions/ActionStoreLanguage'
import util from '../../util/common'
const { Content } = Layout
const { Title } = Typography
const languageAPI = process.env.REACT_APP_STORE_LANGUAGE_API
const languageEditStatusAPI = process.env.REACT_APP_STORE_LANGUAGE_STATUS_API

function LanguageHeaderAction({ languageId, languageCode, languageStatus, languageDefault }) {
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
    const [changeSwitchStatus, setChangeSwitchStatus] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isMakeAsDefault, setIsMakeAsDefault] = useState(String(languageDefault) === '1' ? true : false)
    const [defaultChecked, setDefaultChecked] = useState(false)
    const [warningLanguageDefaultModal, setWarningLanguageDefaultModal] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()
    const [languageReload, setLanguageReload] = useState()
    useEffect(() => {
        setSwitchStatus(parseInt(languageStatus) === 2 ? false : true)
    }, [languageStatus])

    useEffect(() => {
        setIsMakeAsDefault(String(languageDefault) === '1' ? true : false)
    }, [languageDefault])

    // closing the delete warning model pop up
    const closeModal = () => {
        setIsModalOpen(false)
    }

    // opening the delete warning model pop up
    const openModal = (e) => {
        setIsModalOpen(true)
    }

    // opening the default lang warning model pop up
    const openLanguageDefaultWaringModal = (e) => {
        setWarningLanguageDefaultModal(true)
        setDefaultChecked(e)
    }
    // closing the default lang warning model pop up
    const closeLanguageDefaultWaringModal = () => {
        setWarningLanguageDefaultModal(false)
    }

    const updateLanguageStatus = async () => {
        const reqBody = {
            status: changeSwitchStatus === true ? 1 : 2,
        }
        setIsLoading(true)
        MarketplaceServices.update(languageEditStatusAPI, reqBody, {
            language_id: languageId,
        })
            .then((response) => {
                MarketplaceToaster.showToast(response)
                console.log('success response from the status', response.data)
                if (response.data && response.data.response_body) {
                    if (parseInt(response.data && response.data.response_body[0].status) === 1) {
                        availableLanguages.push(response.data.response_body[0])
                        dispatch(fnStoreLanguage(availableLanguages))
                    } else if (parseInt(response.data && response.data.response_body[0].status) === 2) {
                        dispatch(
                            fnStoreLanguage(
                                availableLanguages &&
                                    availableLanguages.length > 0 &&
                                    availableLanguages.filter(
                                        (ele) =>
                                            parseInt(ele.id) !==
                                            parseInt(response.data && response.data.response_body[0].id)
                                    )
                            )
                        )
                        if (
                            selectedLanguage &&
                            selectedLanguage.language_code === response.data.response_body[0].language_code
                        ) {
                            dispatch(
                                fnSelectedLanguage(
                                    availableLanguages &&
                                        availableLanguages.length > 0 &&
                                        availableLanguages.filter((ele) => ele.is_default)[0]
                                )
                            )

                            util.setUserSelectedLngCode(
                                availableLanguages &&
                                    availableLanguages.length > 0 &&
                                    availableLanguages.filter((ele) => ele.is_default)[0].language_code
                            )
                            setTimeout(function () {
                                navigate(0)
                            }, 2000)
                        }
                    }
                }
                setSwitchStatus(changeSwitchStatus)
                closeModal()
                setIsLoading(false)
                setSearchParams({
                    k: searchParams.get('k'),
                    n: searchParams.get('n'),
                    c: searchParams.get('c'),
                    s: changeSwitchStatus === true ? 1 : 2,
                    d: searchParams.get('d'),
                })
            })
            .catch((error) => {
                console.log('error from the status', error)
                MarketplaceToaster.showToast(error.response)
                setIsLoading(false)
                closeModal()
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
                closeLanguageDefaultWaringModal()
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

    const onChange = (checked) => {
        setChangeSwitchStatus(checked)
        setIsModalOpen(true)
    }

    // closing the delete popup model
    const closeDeleteModal = () => {
        setIsDeleteLanguageModalOpen(false)
    }

    // opening the delete popup model
    const openDeleteModal = (id) => {
        setIsDeleteLanguageModalOpen(true)
    }

    //!delete function of language
    const removeLanguage = () => {
        setIslanguageDeleting(true)
        MarketplaceServices.remove(languageAPI, { _id: languageId })
            .then((response) => {
                console.log('response from delete===>', response.data, languageId)
                if (response.status === 200 || response.status === 201) {
                    setIsDeleteLanguageModalOpen(false)
                }
                setShowSuccessModal(true)
                console.log('availableLanguages', availableLanguages)
                let copyAvailableLanguage = [...availableLanguages]

                let filteredDeleteData =
                    copyAvailableLanguage &&
                    copyAvailableLanguage.length > 0 &&
                    copyAvailableLanguage.filter((ele) => parseInt(ele.id) !== parseInt(languageId))
                dispatch(fnStoreLanguage(filteredDeleteData))
                console.log('delete response', filteredDeleteData)
                let defaultData =
                    filteredDeleteData &&
                    filteredDeleteData.length > 0 &&
                    filteredDeleteData.filter((ele) => ele.is_default)[0]
                if (selectedLanguage && selectedLanguage.id === parseInt(languageId)) {
                    setLanguageReload(defaultData.id)
                    dispatch(fnSelectedLanguage(defaultData))
                    util.setUserSelectedLngCode(defaultData.language_code)
                }
                // disabling spinner
                setIslanguageDeleting(false)
            })
            .catch((error) => {
                // disabling spinner
                setIslanguageDeleting(false)
                console.log('response from delete===>', error.response)
                MarketplaceToaster.showToast(error.response)
            })
    }

    return (
        <Content className='!flex items-center'>
            {/* This content is related to language status */}
            <Content className=''>
                <Space direction='horizontal'>
                    <Typography className=' input-label-color font-semibold text-base whitespace-nowrap'>
                        {t('labels:status_label')}{' '}
                    </Typography>
                    <div className='input-label-color'>{t('labels:inactive')}</div>
                    <Switch
                        className={switchStatus === true ? '!bg-green-500' : '!bg-gray-400'}
                        checked={switchStatus}
                        onChange={onChange}
                        onClick={() => {
                            openModal(switchStatus)
                        }}
                        disabled={isMakeAsDefault}
                        // checkedChildren={t('labels:active')}
                        // unCheckedChildren={t('labels:inactive')}
                    />
                    <div className='input-label-color'>{t('labels:active')}</div>
                </Space>
            </Content>
            {/* This content is related to language checkbox default language */}
            <Content className=''>
                <Space direction='horizontal'>
                    <Checkbox
                        className=''
                        checked={isMakeAsDefault}
                        onChange={(e) => {
                            openLanguageDefaultWaringModal(e.target.checked)
                        }}
                        disabled={switchStatus && !isMakeAsDefault ? false : true}></Checkbox>
                    <Typography className='input-label-color'> {t('labels:default_language_label')}</Typography>
                </Space>
            </Content>
            {/* This content is related to language remove */}
            <Content>
                {!isMakeAsDefault ? (
                    <Button
                        className='app-btn-danger  flex gap-2 !justify-items-center !items-center'
                        onClick={() => {
                            openDeleteModal(languageId)
                        }}>
                        <img src={deleteIcon} alt='plusIconWithAddLanguage' className='' />
                        <div className=''>{t('labels:remove_language_label')}</div>
                    </Button>
                ) : null}
            </Content>

            <StoreModal
                isVisible={isDeleteLanguageModalOpen}
                okButtonText={t('labels:delete')}
                cancelButtonText={t('labels:cancel')}
                title={t('labels:delete_language')}
                okCallback={() => removeLanguage()}
                cancelCallback={() => closeDeleteModal()}
                isSpin={islanguageDeleting}
                hideCloseButton={false}>
                {
                    <div>
                        {/* <p>{t('messages:remove_language_confirmation')}</p> */}
                        <p>{t('messages:remove_language_confirmation_message')}</p>
                    </div>
                }
            </StoreModal>
            <StoreModal
                isVisible={showSuccessModal}
                // title={t("approvals:Approval-Request-Submission")}
                okButtonText={null}
                hideCloseButton={false}
                cancelButtonText={null}
                isSpin={false}>
                <Content className='flex flex-col justify-center items-center'>
                    <CheckCircleFilled className=' text-[#52c41a] text-[30px]' />
                    <Title level={4} className='!mt-5 !mb-0'>
                        {t('messages:language_deleted_successfully')}
                    </Title>
                    <Content className='mt-3'>
                        <Button
                            className='app-btn-primary'
                            onClick={() => {
                                if ((selectedLanguage && selectedLanguage.id) === parseInt(languageReload)) {
                                    window.location.href = '/dashboard/language'
                                } else {
                                    navigate(`/dashboard/language`)
                                }
                            }}>
                            {t('labels:close')}
                        </Button>
                    </Content>
                </Content>
            </StoreModal>
            <StoreModal
                isVisible={isModalOpen}
                okButtonText={t('labels:proceed')}
                title={
                    changeSwitchStatus
                        ? t('messages:language_activation_confirmation')
                        : t('messages:language_deactivation_confirmation')
                }
                cancelButtonText={t('labels:cancel')}
                okCallback={() => updateLanguageStatus()}
                cancelCallback={() => closeModal()}
                isSpin={isLoading}
                hideCloseButton={false}>
                {changeSwitchStatus ? (
                    <div>
                        <p className='!m-0 !p-0'>{t('messages:language_activation_confirmation_message')}</p>
                    </div>
                ) : (
                    <div>
                        <p>{t('messages:language_deactivation_confirmation_message')}</p>
                    </div>
                )}
            </StoreModal>
            <StoreModal
                isVisible={warningLanguageDefaultModal}
                okButtonText={t('labels:proceed')}
                cancelButtonText={t('labels:cancel')}
                title={t('labels:default_language')}
                okCallback={() => makeAsDefaultLanguage()}
                cancelCallback={() => {
                    closeLanguageDefaultWaringModal()
                    setIsMakeAsDefault(false)
                }}
                isSpin={isLoading}
                hideCloseButton={false}>
                {
                    <div>
                        <p>{t('messages:default_language_warning_msg')}</p>
                    </div>
                }
            </StoreModal>
        </Content>
    )
}

export default LanguageHeaderAction
