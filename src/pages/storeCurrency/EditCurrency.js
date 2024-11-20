import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
//! Import user defined components
import HeaderForTitle from '../../components/header/HeaderForTitle'
import { useTranslation } from 'react-i18next'
import MarketplaceServices from '../../services/axios/MarketplaceServices'
import util from '../../util/common'
import StoreModal from '../../components/storeModal/StoreModal'
import MarketplaceToaster from '../../util/marketplaceToaster'
import { usePageTitle } from '../../hooks/usePageTitle'
import { Checkbox } from '../../shadcnComponents/ui/checkbox'
import { Skeleton } from '../../shadcnComponents/ui/skeleton'
import { Button } from '../../shadcnComponents/ui/button'
const currencyAPI = process.env.REACT_APP_CHANGE_CURRENCY_API
const defaultCurrencyAPI = process.env.REACT_APP_DEFAULT_CURRENCY_API

const EditCurrency = () => {
    const { t } = useTranslation()
    usePageTitle(t('labels:currency'))
    const search = useLocation().search
    const navigate = useNavigate()
    const cId = new URLSearchParams(search).get('k')

    const [isLoading, setIsLoading] = useState(false)
    const [isDeleteCurrencyModalOpen, setIsDeleteCurrencyModalOpen] = useState(false)
    const [isCurrencyDeleting, setIsCurrencyDeleting] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [defaultChecked, setDefaultChecked] = useState(false)
    const [warningCurrencyDefaultModal, setWarningCurrencyDefaultModal] = useState(false)
    const [onChangeDisable, setOnChangeDisable] = useState(false)
    const [currencyDetails, setCurrencyDetails] = useState({
        currency_name: '',
        symbol: '',
        iso_currency_code: '',
        unit_conversion: '',
        minimum_amount: 0,
        unit_price_name: '',
        no_of_decimal: 1,
        is_default: false,
    })
    const [defaultLoader, setDefaultLoader] = useState(false)
    //!get call of list language
    const findByPageCurrencyData = () => {
        // enabling spinner
        setIsLoading(true)
        MarketplaceServices.findAll(currencyAPI, null, false)
            .then(function (response) {
                setIsLoading(false)
                console.log('server Success response from currency API call', response.data.response_body.data)
                const currencyData = response.data.response_body.data

                const filteredCurrencyData =
                    currencyData && currencyData.length > 0 && currencyData.filter((ele) => ele.id === parseInt(cId))
                let copyOfCurrencyDetails = { ...currencyDetails }
                copyOfCurrencyDetails.currency_name = filteredCurrencyData[0].currency_name
                copyOfCurrencyDetails.symbol = filteredCurrencyData[0].symbol
                copyOfCurrencyDetails.iso_currency_code = filteredCurrencyData[0].iso_currency_code
                copyOfCurrencyDetails.unit_price_name = filteredCurrencyData[0].unit_price_name
                copyOfCurrencyDetails.unit_conversion = filteredCurrencyData[0].unit_conversion
                copyOfCurrencyDetails.minimum_amount = filteredCurrencyData[0].minimum_amount
                copyOfCurrencyDetails.no_of_decimal = filteredCurrencyData[0].no_of_decimal
                copyOfCurrencyDetails.is_default = filteredCurrencyData[0].is_default
                setCurrencyDetails(copyOfCurrencyDetails)
            })
            .catch((error) => {
                setIsLoading(false)
                console.log('server error response from currency API call', error.response)
            })
    }

    //!delete function of language
    const removeCurrency = () => {
        setIsCurrencyDeleting(true)
        MarketplaceServices.remove(currencyAPI, { _id: cId })
            .then((response) => {
                console.log('response from delete===>', response.data, cId)
                if (response.status === 200 || response.status === 201) {
                    setIsCurrencyDeleting(false)
                }
                setShowSuccessModal(true)
                // disabling spinner
                setIsCurrencyDeleting(false)
                // MarketplaceToaster.showToast(response);
            })
            .catch((error) => {
                // disabling spinner
                setIsCurrencyDeleting(false)
                // console.log("response from delete===>", error.response);
                MarketplaceToaster.showToast(error.response)
            })
    }

    const makeAsDefaultCurrency = () => {
        let reqBody = {}
        if (onChangeDisable === true) {
            setIsLoading(true)
            reqBody = {
                no_of_decimal: currencyDetails.no_of_decimal,
            }
        } else {
            setDefaultLoader(true)
            reqBody = {
                is_default: defaultChecked,
            }
        }
        MarketplaceServices.update(defaultCurrencyAPI, reqBody, {
            _id: cId,
        })
            .then((response) => {
                setIsLoading(false)
                console.log('Currency Default API success response', response.data.response_body)
                MarketplaceToaster.showToast(response)
                setOnChangeDisable(false)
                const copyOfCurrencyDetails = { ...currencyDetails }
                copyOfCurrencyDetails.is_default = response && response.data.response_body.is_default
                copyOfCurrencyDetails.no_of_decimal = response && response.data.response_body.no_of_decimal
                setCurrencyDetails(copyOfCurrencyDetails)
                setDefaultChecked(response && response.data.response_body.is_default)
                closeCurrencyDefaultWaringModal()
                setDefaultLoader(false)
            })
            .catch((error) => {
                console.log('Currency Default API error response', error)
                setIsLoading(false)
                setDefaultLoader(false)
                setOnChangeDisable(false)
                closeCurrencyDefaultWaringModal()
                MarketplaceToaster.showToast(error.response)
            })
    }

    const currencyHandler = (fieldName, value) => {
        const copyOfCurrencyDetails = { ...currencyDetails }
        if (fieldName === 'no_of_decimal') {
            copyOfCurrencyDetails.no_of_decimal = value
        }
        setCurrencyDetails(copyOfCurrencyDetails)
    }

    const openDeleteModal = () => {
        setIsDeleteCurrencyModalOpen(true)
    }

    const closeDeleteModal = () => {
        setIsDeleteCurrencyModalOpen(false)
    }

    // closing the default currency warning model pop up
    const closeCurrencyDefaultWaringModal = () => {
        setWarningCurrencyDefaultModal(false)
    }

    useEffect(() => {
        findByPageCurrencyData()
        window.scroll(0, 0)
    }, [cId])
    console.log('warningCurrencyDefaultModal', warningCurrencyDefaultModal)
    return (
        <div>
            <div className=''>
                <HeaderForTitle
                    title={
                        <div className='!mb-4'>
                            <div className='!font-semibold text-2xl items-center mt-2'>
                                {currencyDetails.currency_name}
                            </div>
                        </div>
                    }
                    titleContent={
                        <>
                            {/* This content is related to currency checkbox default currency */}
                            <div className='flex gap-2 items-center'>
                                <Checkbox
                                    className=''
                                    checked={currencyDetails.is_default}
                                    onCheckedChange={(e) => {
                                        console.log('iisChecked', e)
                                        setWarningCurrencyDefaultModal(true)
                                        setDefaultChecked(e)
                                    }}
                                    disabled={!currencyDetails.is_default ? false : true}
                                />
                                <label> {t('labels:make_currency_as_default')}</label>
                            </div>
                        </>
                    }
                    backNavigationPath={`/dashboard/currency`}
                    showArrowIcon={true}
                    showButtons={false}
                />
            </div>

            <div className='!p-3 !mt-[9.5rem] !min-h-screen '>
                {isLoading ? (
                    <div className='space-y-2 bg-white p-4'>
                        <Skeleton className={'h-4 w-[300px] '} />
                        <Skeleton className={'h-4 w-[350px] '} />
                        <Skeleton className={'h-4 w-[350px] '} />
                        <Skeleton className={'h-4 w-[350px] '} />
                    </div>
                ) : (
                    <div className=' !bg-white !p-4 shadow-brandShadow rounded'>
                        <div className='font-semibold  text-lg my-2 '>{t('labels:currency_details')}</div>
                        <div className='w-[100%]'>
                            <div
                                className={`justify-items-start  !inline-block font-normal text-sm  flex${
                                    util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL'
                                        ? 'text-left ml-2 '
                                        : 'text-right mr-2 '
                                }`}>
                                <p className='input-label-color my-4  '>{t('labels:currency_code')} </p>
                                <p className='input-label-color my-4  '>{t('labels:conversation')}</p>
                                <p className='input-label-color my-4 '>{t('labels:unit_price_name')}</p>
                                <p className='input-label-color my-4 '>{t('labels:min_amount')}</p>
                                <p className='input-label-color my-3  '>{t('labels:currency_symbol')}</p>
                                <p className='input-label-color my-4 '>{t('labels:no_of_decimals')}</p>
                            </div>
                            <div
                                className={`!inline-block !text-brandGray1 text-sm ${
                                    util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL'
                                        ? 'mr-6 w-[4%] '
                                        : 'ml-6 w-[4%] '
                                }`}>
                                <p className='!font-semibold my-4  '>
                                    <span>:</span>
                                </p>
                                <p className='!font-semibold my-4 '>
                                    <span>:</span>
                                </p>
                                <p className='!font-semibold my-4 '>
                                    <span>:</span>
                                </p>
                                <p className='!font-semibold my-4 '>
                                    <span>:</span>
                                </p>
                                <p className='!font-semibold my-4 '>
                                    <span>:</span>
                                </p>
                                <p className='!font-semibold my-4'>
                                    <span>:</span>
                                </p>
                            </div>
                            <div className='w-[50%] !inline-block text-sm !font-semibold'>
                                <p className=' my-4'>
                                    {currencyDetails?.iso_currency_code !== null
                                        ? currencyDetails?.iso_currency_code
                                        : `${t('labels:not_available')}`}
                                </p>
                                <p className=' my-4'>
                                    {currencyDetails?.unit_conversion !== null
                                        ? currencyDetails?.unit_conversion
                                        : `${t('labels:not_available')}`}
                                </p>
                                <p className=' my-4'>
                                    {currencyDetails?.unit_price_name !== null
                                        ? currencyDetails?.unit_price_name
                                        : `${t('labels:not_available')}`}
                                </p>
                                <p className=' my-4'>
                                    {currencyDetails?.minimum_amount !== null
                                        ? currencyDetails?.minimum_amount
                                        : `${t('labels:not_available')}`}
                                </p>
                                <p className='my-4'>
                                    {currencyDetails?.symbol ? currencyDetails?.symbol : `${t('labels:not_available')}`}
                                </p>
                                <p className='my-4'>
                                    {currencyDetails?.no_of_decimal
                                        ? currencyDetails?.no_of_decimal
                                        : `${t('labels:not_available')}`}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <StoreModal
                isVisible={isDeleteCurrencyModalOpen}
                okButtonText={t('labels:yes')}
                cancelButtonText={t('labels:cancel')}
                title={t('labels:warning')}
                okCallback={() => removeCurrency()}
                cancelCallback={() => closeDeleteModal()}
                isSpin={isCurrencyDeleting}
                hideCloseButton={false}>
                {
                    <div>
                        <p>{t('messages:remove_language_confirmation')}</p>
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
                <div className='flex flex-col justify-center items-center'>
                    {/* <CheckCircleFilled className=' text-[#52c41a] text-[30px]' /> */}
                    <div className='!mt-5 !mb-0'>{t('messages:language_deleted_successfully')}</div>
                    <div className='mt-3'>
                        <Button
                            onClick={() => {
                                navigate(`/dashboard/currency`)
                            }}>
                            {t('labels:close')}
                        </Button>
                    </div>
                </div>
            </StoreModal>
            <StoreModal
                isVisible={warningCurrencyDefaultModal}
                okButtonText={t('labels:proceed')}
                cancelButtonText={t('labels:cancel')}
                title={
                    <div className='text-regal-blue font-bold text-[18px] leading-[26px]'>
                        {t('labels:default_currency')}
                    </div>
                }
                okCallback={() => makeAsDefaultCurrency()}
                cancelCallback={() => {
                    closeCurrencyDefaultWaringModal()
                    // setIsMakeAsDefault(false);
                }}
                isSpin={defaultLoader}
                hideCloseButton={false}>
                {
                    <div className='text-brandGray1'>
                        <p>{t('messages:default_currency_warning_msg')}</p>
                    </div>
                }
            </StoreModal>
        </div>
    )
}

export default EditCurrency
