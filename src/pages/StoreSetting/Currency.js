import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import util from '../../util/common'
import MarketplaceServices from '../../services/axios/MarketplaceServices'
import MarketplaceToaster from '../../util/marketplaceToaster'
import StoreModal from '../../components/storeModal/StoreModal'
import { Card, CardContent, CardHeader, CardTitle } from '../../shadcnComponents/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../shadcnComponents/ui/select'
import { Button } from '../../shadcnComponents/ui/button'
import { Alert, AlertDescription } from '../../shadcnComponents/ui/alert'
import { Skeleton } from '../../shadcnComponents/ui/skeleton'
import { MdInfo } from 'react-icons/md'

const storeCurrencyAPI = process.env.REACT_APP_STORE_CURRENCY_API
const currencyAPI = process.env.REACT_APP_CHANGE_CURRENCY_API
const storeSettingAPI = process.env.REACT_APP_STORE_FRONT_SETTINGS_API

const Currency = ({ storeUUId }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [isCurrencyLoading, setIsCurrencyLoading] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [currencyOnChange, setCurrencyOnChange] = useState(false)
    const [filteredCurrencyData, setFilteredCurrencyData] = useState([])
    const [currencyData, setCurrencyData] = useState(null)
    const [currencySymbol, setCurrencySymbol] = useState('')
    const [currencyIsoCode, setCurrencyIsoCode] = useState('')
    const [isVendorsOnBoarded, setIsVendorsOnBoarded] = useState(false)
    const [currencyChangeFLag, setCurrencyChangeFlag] = useState(false)
    const [selectedCurrency, setSelectedCurrency] = useState(null)

    //!get call of list currency
    const findByPageCurrencyData = () => {
        MarketplaceServices.findAllWithoutPage(currencyAPI, null, false)
            .then(function (response) {
                console.log('server Success response from currency API call', response.data.response_body.data)
                if (response && response.data && response.data.response_body.data.length > 0) {
                    currencyDataProcessor(response.data.response_body.data)
                }
            })
            .catch((error) => {
                console.log('server error response from currency API call', error.response)
            })
    }

    //! get call of  getStoreSettingApi
    const findAllWithoutPageStoreSettingApi = () => {
        setIsLoading(true)

        MarketplaceServices.findAllWithoutPage(storeSettingAPI, {
            store_id: storeUUId,
        })
            .then(function (response) {
                console.log('Get response of Store setting--->', response.data.response_body.store_settings_data[0])
                setIsLoading(false)
                setIsVendorsOnBoarded(response?.data?.response_body?.store_settings_data[0]?.is_vendor_created)

                setCurrencySymbol(response?.data?.response_body?.store_settings_data[0]?.store_currency[0]?.symbol)
                setCurrencyIsoCode(response?.data?.response_body?.store_settings_data[0]?.store_currency[0]?.iso_code)
            })
            .catch((error) => {
                setIsLoading(false)
                console.log('error response from store settings API', error)
            })
    }
    //!get call of list currency
    const findAllWithoutCurrencyDataByChange = (value) => {
        setIsCurrencyLoading(true)
        setIsLoading(true)
        MarketplaceServices.findAllWithoutPage(currencyAPI, { currency_code: value }, false)
            .then(function (response) {
                setIsCurrencyLoading(false)
                setIsLoading(false)
                console.log('server Success response from currency API call', response.data.response_body.data)
                if (response && response.data && response.data.response_body.data.length > 0) {
                    setCurrencyData(response.data.response_body.data[0])
                    setCurrencySymbol(response.data.response_body.data[0].symbol)
                }
            })
            .catch((error) => {
                setIsCurrencyLoading(false)
                setIsLoading(false)
                console.log('server error response from currency API call', error.response)
            })
    }

    //! put call for store currency  API
    const updateStoreCurrencyApi = () => {
        setIsCurrencyLoading(true)
        MarketplaceServices.update(
            storeCurrencyAPI,
            {
                store_id: storeUUId,
                currency_id: currencyData && currencyData.length > 0 && currencyData[0].id,
            },
            null
        )
            .then((response) => {
                setIsCurrencyLoading(false)
                setCurrencyOnChange(false)
                setCurrencyIsoCode(response?.data?.response_body?.iso_code)

                console.log(
                    'success response  for Store Settings Restore Factory ',
                    storeCurrencyAPI,
                    response.data.response_body
                )
                MarketplaceToaster.showToast(response)
            })
            .catch((error) => {
                setIsCurrencyLoading(false)
                MarketplaceToaster.showToast(error.response)
                console.log('ERROR response  for Store Settings Restore Factory ', storeCurrencyAPI, error)
            })
    }

    const currencyChangeConsent = (val) => {
        setCurrencyChangeFlag(true)
        setSelectedCurrency(val)
    }

    const handleCurrencyChange = () => {
        setCurrencyChangeFlag(false)
        findAllWithoutCurrencyDataByChange(selectedCurrency)

        if (selectedCurrency !== currencyIsoCode) {
            setCurrencyOnChange(true)
        } else {
            setCurrencyOnChange(false)
        }
    }
    const closeCurrencyChangeConsentModal = () => {
        setCurrencyChangeFlag(false)
        setSelectedCurrency(null)
    }

    const currencyDataProcessor = (currencyProcessorData) => {
        let localCurrencyData = []
        if (currencyProcessorData && currencyProcessorData.length > 0) {
            for (let i = 0; i < currencyProcessorData.length; i++) {
                const temp = {}
                temp['label'] = currencyProcessorData[i].currency_name
                temp['value'] = currencyProcessorData[i].iso_currency_code
                temp['id'] = currencyProcessorData[i].id
                temp['no_of_decimal'] = currencyProcessorData[i].no_of_decimal
                temp['minimum_amount'] = currencyProcessorData[i].minimum_amount
                temp['unit_price_name'] = currencyProcessorData[i].unit_price_name
                temp['symbol'] = currencyProcessorData[i].symbol
                temp['unit_conversion'] = currencyProcessorData[i].unit_conversion
                temp['iso_currency_code'] = currencyProcessorData[i].iso_currency_code
                temp['currency_name'] = currencyProcessorData[i].currency_name
                localCurrencyData.push(temp)
                setFilteredCurrencyData(localCurrencyData)
            }
            return localCurrencyData
        } else {
            return localCurrencyData
        }
    }

    useEffect(() => {
        const currencyDisplayData =
            filteredCurrencyData &&
            filteredCurrencyData.length > 0 &&
            filteredCurrencyData.filter((ele) => ele.symbol === currencySymbol)
        if (currencyDisplayData && currencyDisplayData.length > 0) {
            setCurrencyData(currencyDisplayData[0])
        }
    }, [filteredCurrencyData, currencySymbol])

    useEffect(() => {
        findByPageCurrencyData()
        findAllWithoutPageStoreSettingApi()
    }, [])

    return (
        <>
            {isVendorsOnBoarded && (
                <Alert className='my-4 px-4 !w-full bg-[#E6F7FF] border border-[#1677ff]'>
                    <AlertDescription>
                        <div
                            className={`flex items-center space-x-2 ${util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? 'space-x-reverse' : ''}`}>
                            <MdInfo className='font-bold' color='#1677ff' size={25} />
                            <span className='font-medium'>{t('labels:currency_info')}</span>
                        </div>
                        <div
                            className={`px-3 mt-1 text-sm ${util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? 'text-right' : 'text-left'}`}>
                            <ul style={{ listStyleType: 'disc' }}>
                                <li>{t('messages:currency_info_note_one')}</li>
                                <li>{t('messages:currency_info_note_two')}</li>
                            </ul>
                        </div>
                    </AlertDescription>
                </Alert>
            )}
            <Card
                className='w-full my-4
        '>
                {isLoading ? (
                    <CardContent className='p-6'>
                        <Skeleton className='h-4 w-[250px] mb-4' />
                        <Skeleton className='h-10 w-[300px] mb-6' />
                        <Skeleton className='h-4 w-[200px] mb-2' />
                        <Skeleton className='h-4 w-[150px] mb-2' />
                        <Skeleton className='h-4 w-[150px] mb-2' />
                        <Skeleton className='h-4 w-[150px] mb-2' />
                        <Skeleton className='h-4 w-[150px] mb-2' />
                        <Skeleton className='h-4 w-[150px] mb-6' />
                        <div className='flex gap-2'>
                            <Skeleton className='h-10 w-[100px]' />
                            <Skeleton className='h-10 w-[100px]' />
                        </div>
                    </CardContent>
                ) : (
                    <div className='flex flex-col '>
                        <CardContent className='px-4 py-4'>
                            <CardHeader className='px-0 pt-0'>
                                <CardTitle className='text-[19px] font-semibold  text-regal-blue'>
                                    {t('labels:currency')}
                                </CardTitle>
                            </CardHeader>
                            <div className='mb-6'>
                                <label className='text-[14px] mb-3 ml-1 input-label-color'>
                                    {t('labels:choose_store_currency')}
                                </label>
                                <Select
                                    disabled={isVendorsOnBoarded}
                                    value={currencyData?.iso_currency_code || ''}
                                    onValueChange={(e) => currencyChangeConsent(e)}>
                                    <SelectTrigger className='w-[300px] text-[14px] my-2 '>
                                        <SelectValue placeholder={t('messages:please_choose_a_store_currency')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredCurrencyData.map((currency) => (
                                            <SelectItem key={currency.id} value={currency.value}>
                                                {currency.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            {currencyData && (
                                <div className='mb-6'>
                                    <h3 className='text-md font-semibold mb-4'>{t('labels:currency_details')}</h3>
                                    <div className='space-y-2'>
                                        <div className='flex items-center'>
                                            <div className='w-1/5 text-sm text-muted-foreground'>
                                                {t('labels:currency_code')}
                                            </div>
                                            <div className='w-4 text-center text-muted-foreground mr-3'>:</div>
                                            <div className='flex-1 text-sm font-medium'>
                                                {currencyData.iso_currency_code || t('labels:not_available')}
                                            </div>
                                        </div>
                                        <div className='flex items-center'>
                                            <div className='w-1/5 text-sm text-muted-foreground'>
                                                {t('labels:conversion')}
                                            </div>
                                            <div className='w-4 text-center text-muted-foreground mr-3'>:</div>
                                            <div className='flex-1 text-sm font-medium'>
                                                {currencyData.unit_conversion || t('labels:not_available')}
                                            </div>
                                        </div>
                                        <div className='flex items-center'>
                                            <div className='w-1/5 text-sm text-muted-foreground'>
                                                {t('labels:unit_price_name')}
                                            </div>
                                            <div className='w-4 text-center text-muted-foreground mr-3'>:</div>
                                            <div className='flex-1 text-sm font-medium'>
                                                {currencyData.unit_price_name || t('labels:not_available')}
                                            </div>
                                        </div>
                                        <div className='flex items-center'>
                                            <div className='w-1/5 text-sm text-muted-foreground'>
                                                {t('labels:min_amount')}
                                            </div>
                                            <div className='w-4 text-center text-muted-foreground mr-3'>:</div>
                                            <div className='flex-1 text-sm font-medium'>
                                                {currencyData.minimum_amount || t('labels:not_available')}
                                            </div>
                                        </div>
                                        <div className='flex items-center'>
                                            <div className='w-1/5 text-sm text-muted-foreground'>
                                                {t('labels:currency_symbol')}
                                            </div>
                                            <div className='w-4 text-center text-muted-foreground mr-3'>:</div>
                                            <div className='flex-1 text-sm font-medium'>
                                                {currencyData.symbol || t('labels:not_available')}
                                            </div>
                                        </div>
                                        <div className='flex items-center'>
                                            <div className='w-1/5 text-sm text-muted-foreground'>
                                                {t('labels:no_of_decimals')}
                                            </div>
                                            <div className='w-4 text-center text-muted-foreground mr-3'>:</div>
                                            <div className='flex-1 text-sm font-medium'>
                                                {currencyData.no_of_decimal || t('labels:not_available')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {!isVendorsOnBoarded && (
                                <div className='flex gap-2'>
                                    <Button
                                        className='app-btn-primary '
                                        onClick={() => updateStoreCurrencyApi()}
                                        disabled={!currencyOnChange}>
                                        {t('labels:save')}
                                    </Button>
                                    <Button
                                        className=' app-btn-secondary'
                                        variant='outline'
                                        disabled={!currencyOnChange}
                                        onClick={() => navigate('/dashboard/store?m_t=1')}>
                                        {t('labels:discard')}
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </div>
                )}
                <StoreModal
                    isVisible={currencyChangeFLag}
                    okButtonText={t('labels:yes')}
                    title={
                        <span
                            className={`text-regal-blue font-bold text-[18px] leading-[26px] ${
                                util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL'
                                    ? 'text-right w-full block pr-5'
                                    : ''
                            }`}>
                            {t('labels:change_currency_details')}
                        </span>
                    }
                    okCallback={() => handleCurrencyChange()}
                    cancelCallback={() => closeCurrencyChangeConsentModal()}
                    isSpin={isCurrencyLoading}
                    width={'450px'}
                    hideCloseButton={true}>
                    <div className='text-muted-foreground'>
                        <p
                            className={`${
                                util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL'
                                    ? 'ml-2 text-right'
                                    : 'mr-2 text-left'
                            } mb-2`}>
                            {util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL'
                                ? t('messages:currency_warning_message').replace('?', '') + '?'
                                : t('messages:currency_warning_message')}
                        </p>
                        <p
                            className={`${
                                util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL'
                                    ? 'ml-2 text-right'
                                    : 'mr-2 text-left'
                            }`}>
                            {util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL'
                                ? t('messages:currency_message').replace('.', '') + '.'
                                : t('messages:currency_message')}
                        </p>
                    </div>
                </StoreModal>
            </Card>
        </>
    )
}

export default Currency
