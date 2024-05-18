import React, { useState, useEffect } from 'react'
import { Layout, Spin, Col, Select, Divider, Typography, Row, Button, Skeleton } from 'antd'
import util from '../../util/common'
import { useTranslation } from 'react-i18next'
import MarketplaceServices from '../../services/axios/MarketplaceServices'
import MarketplaceToaster from '../../util/marketplaceToaster'
import { useNavigate } from 'react-router-dom'
const { Content } = Layout
const { Title } = Typography

const storeCurrencyAPI = process.env.REACT_APP_STORE_CURRENCY_API
const currencyAPI = process.env.REACT_APP_CHANGE_CURRENCY_API
const storeSettingAPI = process.env.REACT_APP_STORE_FRONT_SETTINGS_API

const Currency = ({ storeUUId }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [isCurrencyLoading, setIsCurrencyLoading] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [currencyOnChange, setCurrencyOnChange] = useState(false)
    const [filteredCurrencyData, setFilteredCurrencyData] = useState([])
    const [currencyData, setCurrencyData] = useState([])
    const [currencySymbol, setCurrencySymbol] = useState('')

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
                setCurrencySymbol(response?.data?.response_body?.store_settings_data[0]?.store_currency[0]?.symbol)
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
                    setCurrencyData(response.data.response_body.data)
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

    const handleCurrencyChange = (value) => {
        findAllWithoutCurrencyDataByChange(value)
        setCurrencyOnChange(true)
    }

    const currencyDataProcessor = (currencyProcessorData) => {
        let localCurrencyData = []
        if (currencyProcessorData && currencyProcessorData.length > 0) {
            for (var i = 0; i < currencyProcessorData.length; i++) {
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
        if (currencyDisplayData !== false && currencyDisplayData && currencyDisplayData.length > 0) {
            setCurrencyData(currencyDisplayData)
        }
    }, [filteredCurrencyData, currencySymbol])

    useEffect(() => {
        findByPageCurrencyData()
        findAllWithoutPageStoreSettingApi()
    }, [])
    return (
        <Content>
            {isLoading ? (
                <Content className='bg-white p-3 !rounded-md mt-[2.0rem]'>
                    <Skeleton
                        active
                        paragraph={{
                            rows: 6,
                        }}></Skeleton>
                </Content>
            ) : (
                <Spin tip='Please wait!' size='large' spinning={isCurrencyLoading}>
                    <Content className='bg-white  p-3 rounded-lg border my-4'>
                        <label className='text-lg  font-semibold mb-4 text-regal-blue'>{t('labels:currency')}</label>
                        <Content>
                            <Col span={8}>
                                <label className='text-[14px] mb-2 ml-1 input-label-color'>
                                    {t('labels:choose_store_currency')}
                                </label>
                                <Select
                                    showSearch={false}
                                    className='w-100'
                                    dropdownStyle={{ zIndex: 1 }}
                                    placeholder={t('messages:please_choose_a_store_currency')}
                                    value={currencyData && currencyData.length > 0 && currencyData[0].currency_name}
                                    onChange={(e) => {
                                        handleCurrencyChange(e)
                                    }}
                                    options={filteredCurrencyData}
                                />
                            </Col>
                        </Content>
                        <Divider className='!my-4' />
                        <Title level={4} className='font-normal mb-2'>
                            {t('labels:currency_details')}
                        </Title>
                        {currencyData && currencyData.length > 0 ? (
                            <div className='w-[100%] !flex-col !gap-2 !justify-start'>
                                <div
                                    className={`justify-items-start  !inline-block   ${
                                        util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL'
                                            ? 'text-left ml-2'
                                            : 'text-right mr-2 '
                                    }`}>
                                    <p className='!text-brandGray1 my-3 flex'>
                                        {t('labels:currency_code')}{' '}
                                        <span
                                            className={
                                                util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL'
                                                    ? 'mr-11'
                                                    : 'ml-11'
                                            }>
                                            :
                                        </span>
                                    </p>
                                    <p className='!text-brandGray1 my-3 flex'>
                                        {t('labels:unit_conversation')}
                                        <span
                                            className={
                                                util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL'
                                                    ? 'mr-6'
                                                    : 'ml-6'
                                            }>
                                            :
                                        </span>
                                    </p>
                                    <p className='!text-brandGray1  my-3 flex'>
                                        {t('labels:unit_price_name')}
                                        <span
                                            className={
                                                util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL'
                                                    ? 'mr-9'
                                                    : 'ml-9'
                                            }>
                                            :
                                        </span>
                                    </p>
                                    <p className='text-brandGray1  my-3 flex'>
                                        {t('labels:min_amount')}
                                        <span
                                            className={
                                                util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL'
                                                    ? 'mr-[60px]'
                                                    : 'ml-[60px]'
                                            }>
                                            :
                                        </span>
                                    </p>
                                    <p className='text-brandGray1  my-3 flex'>
                                        {t('labels:currency_symbol')}
                                        <span
                                            className={
                                                util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL'
                                                    ? 'mr-8'
                                                    : 'ml-8'
                                            }>
                                            :
                                        </span>
                                    </p>
                                    <p className='text-brandGray1  my-3 flex'>
                                        {t('labels:no_of_decimals')}
                                        <span
                                            className={
                                                util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL'
                                                    ? 'mr-10'
                                                    : 'ml-10'
                                            }>
                                            :
                                        </span>
                                    </p>
                                </div>
                                <div
                                    className={`${
                                        util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL'
                                            ? 'mr-8 w-[50%] !inline-block '
                                            : 'ml-8 w-[50%] !inline-block '
                                    }`}>
                                    <p className='!font-semibold my-3'>
                                        {currencyData[0].iso_currency_code !== null
                                            ? currencyData[0].iso_currency_code
                                            : `${t('labels:not_available')}`}
                                    </p>
                                    <p className='!font-semibold my-3'>
                                        {currencyData[0].unit_conversion !== null
                                            ? currencyData[0].unit_conversion
                                            : `${t('labels:not_available')}`}
                                    </p>
                                    <p className='!font-semibold my-3'>
                                        {currencyData[0].unit_price_name !== null
                                            ? currencyData[0].unit_price_name
                                            : `${t('labels:not_available')}`}
                                    </p>
                                    <p className='!font-semibold my-3'>
                                        {currencyData[0].minimum_amount !== null
                                            ? currencyData[0].minimum_amount
                                            : `${t('labels:not_available')}`}
                                    </p>
                                    <p className='!font-semibold my-3'>
                                        {currencyData[0].symbol
                                            ? currencyData[0].symbol
                                            : `${t('labels:not_available')}`}
                                    </p>
                                    <p className='!font-semibold my-3'>
                                        {currencyData[0].no_of_decimal
                                            ? currencyData[0].no_of_decimal
                                            : `${t('labels:not_available')}`}
                                    </p>
                                </div>
                            </div>
                        ) : null}
                        <div>
                            <Row className='gap-2 !mt-2'>
                                <Col>
                                    <Button
                                        className='app-btn-primary '
                                        onClick={() => updateStoreCurrencyApi()}
                                        disabled={!currencyOnChange}>
                                        {t('labels:save')}
                                    </Button>
                                </Col>
                                <Col className=''>
                                    <Button
                                        className=' app-btn-secondary'
                                        disabled={!currencyOnChange}
                                        onClick={() => {
                                            navigate('/dashboard/store?m_t=1')
                                        }}>
                                        {t('labels:discard')}
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    </Content>
                </Spin>
            )}
        </Content>
    )
}

export default Currency
