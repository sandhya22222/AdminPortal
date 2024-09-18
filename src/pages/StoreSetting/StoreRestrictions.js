import React, { useState, useEffect } from 'react'
import { Layout, Row, Col, Button, Skeleton, Spin, Progress, InputNumber } from 'antd'
import DynamicTable from '../../components/DynamicTable/DynamicTable'
import MarketplaceServices from '../../services/axios/MarketplaceServices'
import MarketplaceToaster from '../../util/marketplaceToaster'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import util from '../../util/common'
import { useAuth } from 'react-oidc-context'
import { validatePositiveNumber } from '../../util/validation'
import axios from 'axios'

const { Content } = Layout

const dm4sightDataLimitAnalysisDetailsCountAPI = process.env.REACT_APP_4SIGHT_GET_DATA_ANALYSISDETAIL_API
const dm4sightClientID = process.env.REACT_APP_4SIGHT_CLIENT_ID
const dm4sightBaseURL = process.env.REACT_APP_4SIGHT_BASE_URL
const maxDataLimit = process.env.REACT_APP_MAX_DATA_LIMIT
const storeLimitAPI = process.env.REACT_APP_STORE_LIMIT
const storePlatformAPI = process.env.REACT_APP_STORE_PLATFORM_LIMIT_API

const StoreRestrictions = ({ hideActionButton, storeIdFromUrl }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const auth = useAuth()

    const [isStoreLimitDataLoading, setIsStoreLimitDataLoading] = useState(false)
    const [isStoreDataLimitSaving, setIsStoreDataLimitSaving] = useState(false)
    const [storeLimitValues, setStoreLimitValues] = useState()
    const [analysisCount, setAnalysisCount] = useState()
    const [isStoreDataLimitChanged, setIsStoreDataLimitChanged] = useState(false)
    const [invalidVendorLimit, setInvalidVendorLimit] = useState(false)
    const [invalidCustomerLimit, setInvalidCustomerLimit] = useState(false)
    const [invalidProductLimit, setInvalidProductLimit] = useState(false)
    const [invalidOrderLimit, setInvalidOrderLimit] = useState(false)
    const [invalidLanguageLimit, setInvalidLanguageLimit] = useState(false)
    const [invalidProductTemplateLimit, setInvalidProductTemplateLimit] = useState(false)
    const [invalidStoreUserLimit, setInvalidStoreUserLimit] = useState(false)
    const [invalidVendorUserLimit, setInvalidVendorUserLimit] = useState(false)
    const [invalidMaxProductLimit, setInvalidMaxProductLimit] = useState(false)
    const [invalidMaxTemplateLimit, setInvalidMaxTemplateLimit] = useState(false)
    let defaultDataLimitValues = {
        vendor_limit: 0,
        customer_limit: 0,
        product_limit: 0,
        order_limit_per_day: 0,
        langauge_limit: 0,
        product_template_limit: 0,
        store_users_limit: 0,
        vendor_users_limit: 0,
        max_products_per_vendor: 0,
        max_templates_per_vendor: 0,
        default_store_commission: 0,
    }
    const [storeDataLimitValues, setStoreDataLimitValues] = useState(defaultDataLimitValues)

    let keyCLoak = sessionStorage.getItem('keycloakData')
    keyCLoak = JSON.parse(keyCLoak)
    let realmName = keyCLoak.clientId.replace(/-client$/, '')

    const instance = axios.create()

    const dm4sightHeaders = {
        headers: {
            token: auth.user && auth.user?.access_token,
            realmname: realmName,
            dmClientId: dm4sightClientID,
            client: 'admin',
        },
        params: {
            id: storeIdFromUrl,
        },
    }

    const dataLimitErrorHandling = (errorResponseCode) => {
        switch (errorResponseCode) {
            case 'AMS-000028-04':
                setInvalidVendorLimit(true)
                break
            case 'AMS-000028-05':
                setInvalidCustomerLimit(true)
                break
            case 'AMS-000028-06':
                setInvalidProductLimit(true)
                break
            case 'AMS-000028-08':
                setInvalidOrderLimit(true)
                break
            case 'AMS-000028-07':
                setInvalidLanguageLimit(true)
                break
            case 'AMS-000028-09':
                setInvalidProductTemplateLimit(true)
                break
            case 'AMS-000028-12':
                setInvalidVendorLimit(true)
                setInvalidVendorUserLimit(true)
                break
            case 'AMS-000028-13':
                setInvalidProductLimit(true)
                break
            case 'AMS-000028-14':
                setInvalidProductTemplateLimit(true)
                break
            case 'AMS-000028-15':
                setInvalidLanguageLimit(true)
                break
            case 'AMS-000028-16':
                setInvalidCustomerLimit(true)
                break
            case 'AMS-000028-17':
                break
            case 'AMS-000028-18':
                break
            case 'AMS-000028-19':
                break
            case 'AMS-000028-20':
            case 'AMS-000028-21':
                setInvalidMaxProductLimit(true)
                break
            case 'AMS-000028-22':
            case 'AMS-000028-23':
                setInvalidMaxTemplateLimit(true)
                break
            default:
                return ''
        }
    }

    const getStoreRestrictionControl = (key) => {
        switch (key) {
            case 'vendor_limit':
                return (
                    <InputNumber
                        placeholder={t('labels:placeholder_unlimited')}
                        value={storeDataLimitValues.vendor_limit > 0 ? storeDataLimitValues.vendor_limit : ''}
                        disabled={hideActionButton}
                        onKeyPress={(e) => {
                            validatePositiveNumber(e, /\d/)
                        }}
                        onPaste={(e) => {
                            validatePositiveNumber(e, /\d/)
                        }}
                        className={'w-28'}
                        max={9999999999}
                        maxLength={10}
                        onChange={(value) => {
                            let copyofStoreDataLimitValue = { ...storeDataLimitValues }
                            copyofStoreDataLimitValue.vendor_limit = value
                            setStoreDataLimitValues(copyofStoreDataLimitValue)
                            setIsStoreDataLimitChanged(true)
                            setInvalidVendorLimit(false)
                        }}
                        onBlur={(e) => {
                            let copyofStoreDataLimitValue = { ...storeDataLimitValues }
                            copyofStoreDataLimitValue.vendor_limit =
                                parseInt(e.target.value) > parseInt(maxDataLimit) ? maxDataLimit : e.target.value
                            setStoreDataLimitValues(copyofStoreDataLimitValue)
                            setIsStoreDataLimitChanged(true)
                            setInvalidVendorLimit(false)
                        }}
                        status={invalidVendorLimit ? 'error' : ''}
                    />
                )
            case 'customer_limit':
                return (
                    <InputNumber
                        placeholder={t('labels:placeholder_unlimited')}
                        disabled={hideActionButton}
                        value={storeDataLimitValues.customer_limit > 0 ? storeDataLimitValues.customer_limit : ''}
                        status={invalidCustomerLimit ? 'error' : ''}
                        onKeyPress={(e) => {
                            validatePositiveNumber(e, /\d/)
                        }}
                        onPaste={(e) => {
                            validatePositiveNumber(e, /\d/)
                        }}
                        className={'w-28'}
                        max={9999999999}
                        maxLength={10}
                        onChange={(value) => {
                            let copyofStoreDataLimitValue = { ...storeDataLimitValues }
                            copyofStoreDataLimitValue.customer_limit = value
                            setStoreDataLimitValues(copyofStoreDataLimitValue)
                            setIsStoreDataLimitChanged(true)
                            setInvalidCustomerLimit(false)
                        }}
                        onBlur={(e) => {
                            let copyofStoreDataLimitValue = { ...storeDataLimitValues }
                            copyofStoreDataLimitValue.customer_limit =
                                parseInt(e.target.value) > parseInt(maxDataLimit) ? maxDataLimit : e.target.value

                            setStoreDataLimitValues(copyofStoreDataLimitValue)
                            setIsStoreDataLimitChanged(true)
                            setInvalidCustomerLimit(false)
                        }}
                    />
                )
            case 'product_limit':
                return (
                    <InputNumber
                        disabled={hideActionButton}
                        placeholder={t('labels:placeholder_unlimited')}
                        value={storeDataLimitValues.product_limit > 0 ? storeDataLimitValues.product_limit : ''}
                        status={invalidProductLimit ? 'error' : ''}
                        onKeyPress={(e) => {
                            validatePositiveNumber(e, /\d/)
                        }}
                        onPaste={(e) => {
                            validatePositiveNumber(e, /\d/)
                        }}
                        className={'w-28'}
                        max={9999999999}
                        maxLength={10}
                        onChange={(value) => {
                            let copyofStoreDataLimitValue = { ...storeDataLimitValues }
                            copyofStoreDataLimitValue.product_limit = value
                            setStoreDataLimitValues(copyofStoreDataLimitValue)
                            setIsStoreDataLimitChanged(true)
                            setInvalidProductLimit(false)
                        }}
                        onBlur={(e) => {
                            let copyofStoreDataLimitValue = { ...storeDataLimitValues }
                            copyofStoreDataLimitValue.product_limit =
                                parseInt(e.target.value) > parseInt(maxDataLimit) ? maxDataLimit : e.target.value

                            setStoreDataLimitValues(copyofStoreDataLimitValue)
                            setIsStoreDataLimitChanged(true)
                            setInvalidProductLimit(false)
                        }}
                    />
                )
            case 'order_limit_per_day':
                return (
                    <InputNumber
                        disabled={hideActionButton}
                        placeholder={t('labels:placeholder_unlimited')}
                        value={
                            storeDataLimitValues.order_limit_per_day > 0 ? storeDataLimitValues.order_limit_per_day : ''
                        }
                        status={invalidOrderLimit ? 'error' : ''}
                        onKeyPress={(e) => {
                            validatePositiveNumber(e, /\d/)
                        }}
                        onPaste={(e) => {
                            validatePositiveNumber(e, /\d/)
                        }}
                        className={'w-28'}
                        max={9999999999}
                        maxLength={10}
                        onChange={(value) => {
                            let copyofStoreDataLimitValue = { ...storeDataLimitValues }
                            copyofStoreDataLimitValue.order_limit_per_day = value
                            setStoreDataLimitValues(copyofStoreDataLimitValue)
                            setIsStoreDataLimitChanged(true)
                            setInvalidOrderLimit(false)
                        }}
                        onBlur={(e) => {
                            let copyofStoreDataLimitValue = { ...storeDataLimitValues }
                            copyofStoreDataLimitValue.order_limit_per_day =
                                parseInt(e.target.value) > parseInt(maxDataLimit) ? maxDataLimit : e.target.value

                            setStoreDataLimitValues(copyofStoreDataLimitValue)
                            setIsStoreDataLimitChanged(true)
                            setInvalidOrderLimit(false)
                        }}
                    />
                )
            case 'langauge_limit':
                return (
                    <InputNumber
                        disabled={hideActionButton}
                        placeholder={t('labels:placeholder_unlimited')}
                        value={storeDataLimitValues.langauge_limit > 0 ? storeDataLimitValues.langauge_limit : ''}
                        status={invalidLanguageLimit ? 'error' : ''}
                        onKeyPress={(e) => {
                            validatePositiveNumber(e, /\d/)
                        }}
                        onPaste={(e) => {
                            validatePositiveNumber(e, /\d/)
                        }}
                        className={'w-28'}
                        max={9999999999}
                        maxLength={10}
                        onChange={(value) => {
                            let copyofStoreDataLimitValue = { ...storeDataLimitValues }
                            copyofStoreDataLimitValue.langauge_limit = value
                            setStoreDataLimitValues(copyofStoreDataLimitValue)
                            setIsStoreDataLimitChanged(true)
                            setInvalidLanguageLimit(false)
                        }}
                        onBlur={(e) => {
                            let copyofStoreDataLimitValue = { ...storeDataLimitValues }
                            copyofStoreDataLimitValue.langauge_limit =
                                parseInt(e.target.value) > parseInt(maxDataLimit) ? maxDataLimit : e.target.value

                            setStoreDataLimitValues(copyofStoreDataLimitValue)
                            setIsStoreDataLimitChanged(true)
                            setInvalidLanguageLimit(false)
                        }}
                    />
                )
            case 'product_template_limit':
                return (
                    <InputNumber
                        disabled={hideActionButton}
                        placeholder={t('labels:placeholder_unlimited')}
                        value={
                            storeDataLimitValues.product_template_limit > 0
                                ? storeDataLimitValues.product_template_limit
                                : ''
                        }
                        status={invalidProductTemplateLimit ? 'error' : ''}
                        onKeyPress={(e) => {
                            validatePositiveNumber(e, /\d/)
                        }}
                        onPaste={(e) => {
                            validatePositiveNumber(e, /\d/)
                        }}
                        className={'w-28'}
                        max={9999999999}
                        maxLength={10}
                        onChange={(value) => {
                            let copyofStoreDataLimitValue = { ...storeDataLimitValues }
                            copyofStoreDataLimitValue.product_template_limit = value
                            setStoreDataLimitValues(copyofStoreDataLimitValue)
                            setIsStoreDataLimitChanged(true)
                            setInvalidProductTemplateLimit(false)
                        }}
                        onBlur={(e) => {
                            let copyofStoreDataLimitValue = { ...storeDataLimitValues }
                            copyofStoreDataLimitValue.product_template_limit =
                                parseInt(e.target.value) > parseInt(maxDataLimit) ? maxDataLimit : e.target.value

                            setStoreDataLimitValues(copyofStoreDataLimitValue)
                            setIsStoreDataLimitChanged(true)
                            setInvalidProductTemplateLimit(false)
                        }}
                    />
                )
            case 'store_users_limit':
                return (
                    <InputNumber
                        placeholder={t('labels:placeholder_unlimited')}
                        disabled={hideActionButton}
                        value={storeDataLimitValues.store_users_limit > 0 ? storeDataLimitValues.store_users_limit : ''}
                        status={invalidStoreUserLimit ? 'error' : ''}
                        onKeyPress={(e) => {
                            validatePositiveNumber(e, /\d/)
                        }}
                        onPaste={(e) => {
                            validatePositiveNumber(e, /\d/)
                        }}
                        className={'w-28'}
                        max={9999999999}
                        maxLength={10}
                        onChange={(value) => {
                            let copyofStoreDataLimitValue = { ...storeDataLimitValues }
                            copyofStoreDataLimitValue.store_users_limit = value
                            setStoreDataLimitValues(copyofStoreDataLimitValue)
                            setIsStoreDataLimitChanged(true)
                            setInvalidStoreUserLimit(false)
                        }}
                        onBlur={(e) => {
                            let copyofStoreDataLimitValue = { ...storeDataLimitValues }
                            copyofStoreDataLimitValue.store_users_limit =
                                parseInt(e.target.value) > parseInt(maxDataLimit) ? maxDataLimit : e.target.value

                            setStoreDataLimitValues(copyofStoreDataLimitValue)
                            setIsStoreDataLimitChanged(true)
                            setInvalidStoreUserLimit(false)
                        }}
                    />
                )
            case 'vendor_users_limit':
                return (
                    <InputNumber
                        disabled={hideActionButton}
                        placeholder={t('labels:placeholder_unlimited')}
                        value={
                            storeDataLimitValues.vendor_users_limit > 0 ? storeDataLimitValues.vendor_users_limit : ''
                        }
                        status={invalidVendorUserLimit ? 'error' : ''}
                        onKeyPress={(e) => {
                            validatePositiveNumber(e, /\d/)
                        }}
                        onPaste={(e) => {
                            validatePositiveNumber(e, /\d/)
                        }}
                        className={'w-28'}
                        max={9999999999}
                        maxLength={10}
                        onChange={(value) => {
                            let copyofStoreDataLimitValue = { ...storeDataLimitValues }
                            copyofStoreDataLimitValue.vendor_users_limit = value
                            setStoreDataLimitValues(copyofStoreDataLimitValue)
                            setIsStoreDataLimitChanged(true)
                            setInvalidVendorUserLimit(false)
                        }}
                        onBlur={(e) => {
                            let copyofStoreDataLimitValue = { ...storeDataLimitValues }
                            copyofStoreDataLimitValue.vendor_users_limit =
                                parseInt(e.target.value) > parseInt(maxDataLimit) ? maxDataLimit : e.target.value

                            setStoreDataLimitValues(copyofStoreDataLimitValue)
                            setIsStoreDataLimitChanged(true)
                            setInvalidVendorUserLimit(false)
                        }}
                    />
                )
            case 'maximum_vendor_product_limit':
                return (
                    <InputNumber
                        disabled={hideActionButton}
                        placeholder={t('labels:placeholder_unlimited')}
                        value={
                            storeDataLimitValues.max_products_per_vendor > 0
                                ? storeDataLimitValues.max_products_per_vendor
                                : ''
                        }
                        status={invalidMaxProductLimit ? 'error' : ''}
                        onKeyPress={(e) => {
                            validatePositiveNumber(e, /\d/)
                        }}
                        onPaste={(e) => {
                            validatePositiveNumber(e, /\d/)
                        }}
                        className={'w-28'}
                        max={9999999999}
                        maxLength={10}
                        onChange={(value) => {
                            let copyofStoreDataLimitValue = { ...storeDataLimitValues }
                            copyofStoreDataLimitValue.max_products_per_vendor = value
                            setStoreDataLimitValues(copyofStoreDataLimitValue)
                            setIsStoreDataLimitChanged(true)
                            setInvalidMaxProductLimit(false)
                        }}
                        onBlur={(e) => {
                            let copyofStoreDataLimitValue = { ...storeDataLimitValues }
                            copyofStoreDataLimitValue.max_products_per_vendor =
                                parseInt(e.target.value) > parseInt(maxDataLimit) ? maxDataLimit : e.target.value

                            setStoreDataLimitValues(copyofStoreDataLimitValue)
                            setIsStoreDataLimitChanged(true)
                            setInvalidMaxProductLimit(false)
                        }}
                    />
                )
            case 'maximum_vendor_product_template_limit':
                return (
                    <InputNumber
                        disabled={hideActionButton}
                        placeholder={t('labels:placeholder_unlimited')}
                        value={
                            storeDataLimitValues.max_templates_per_vendor > 0
                                ? storeDataLimitValues.max_templates_per_vendor
                                : ''
                        }
                        status={invalidMaxTemplateLimit ? 'error' : ''}
                        onKeyPress={(e) => {
                            validatePositiveNumber(e, /\d/)
                        }}
                        onPaste={(e) => {
                            validatePositiveNumber(e, /\d/)
                        }}
                        className={'w-28'}
                        max={9999999999}
                        maxLength={10}
                        onChange={(value) => {
                            let copyofStoreDataLimitValue = { ...storeDataLimitValues }
                            copyofStoreDataLimitValue.max_templates_per_vendor = value
                            setStoreDataLimitValues(copyofStoreDataLimitValue)
                            setIsStoreDataLimitChanged(true)
                            setInvalidMaxTemplateLimit(false)
                        }}
                        onBlur={(e) => {
                            let copyofStoreDataLimitValue = { ...storeDataLimitValues }
                            copyofStoreDataLimitValue.max_templates_per_vendor =
                                parseInt(e.target.value) > parseInt(maxDataLimit) ? maxDataLimit : e.target.value
                            setStoreDataLimitValues(copyofStoreDataLimitValue)
                            setIsStoreDataLimitChanged(true)
                            setInvalidMaxTemplateLimit(false)
                        }}
                    />
                )
            case 'default_vendor_commission':
                return (
                    <InputNumber
                        disabled={hideActionButton}
                        value={
                            storeDataLimitValues.default_store_commission
                                ? storeDataLimitValues.default_store_commission
                                : 0
                        }
                        min={0}
                        max={100}
                        maxLength={3}
                        // step='0.1'
                        addonAfter='%'
                        // formatter={(value) => (value ? `${value}%` : '')}
                        // parser={(value) => (value ? value.replace('%', '') : '')}
                        onKeyPress={(e) => {
                            validatePositiveNumber(e, /\d/)
                        }}
                        onPaste={(e) => {
                            validatePositiveNumber(e, /\d/)
                        }}
                        className={'w-28'}
                        onChange={(value) => {
                            let copyofStoreDataLimitValue = { ...storeDataLimitValues }
                            copyofStoreDataLimitValue.default_store_commission = value
                            setStoreDataLimitValues(copyofStoreDataLimitValue)
                            setIsStoreDataLimitChanged(true)
                        }}
                    />
                )
            default:
                return null
        }
    }

    const StoreTableColumnThreshold = [
        {
            title: `${t('labels:limit_set_by_admin_name')}`,
            dataIndex: 'limits',
            key: 'limits',
            width: '30%',
            render: (text) => {
                if (text != null) {
                    const [limitName, value] = text.split(',')
                    return (
                        <Content className='flex flex-col gap-2'>
                            <label className='text-[13px] mb-2 ml-1 input-label-color'>{limitName}</label>
                            <InputNumber
                                value={value > 0 ? value : ''}
                                disabled={true}
                                className={'w-28'}
                                placeholder={t('labels:placeholder_unlimited')}
                            />
                        </Content>
                    )
                } else {
                    return null
                }
            },
        },
        {
            title: `${t('labels:override_limit_name')}`,
            dataIndex: 'limitfields',
            key: 'limitfields',
            width: '30%',
            render: (text) => {
                const [labelname, value, key] = text.split(',')
                return (
                    <Content className='flex flex-col'>
                        <label className='text-[13px] mb-3 input-label-color'>{labelname}</label>
                        {getStoreRestrictionControl(key)}
                    </Content>
                )
            },
        },
        {
            title: `${t('labels:stats_name')}`,
            dataIndex: 'stats',
            key: 'stats',
            width: '30%',
            render: (text) => {
                if (text != null) {
                    const [count, total, keyName] = text.split(',')
                    const labelText =
                        keyName === 'vendor_limit'
                            ? t('labels:active_vendors')
                            : keyName === 'customer_limit'
                              ? t('labels:onboarded_customers')
                              : keyName === 'product_limit'
                                ? t('labels:published_products')
                                : keyName === 'order_limit_per_day'
                                  ? t('labels:orders')
                                  : keyName === 'langauge_limit'
                                    ? t('labels:active_languages')
                                    : keyName === 'product_template_limit'
                                      ? t('labels:active_templates')
                                      : keyName === 'store_users_limit'
                                        ? t('labels:store_users')
                                        : keyName === 'vendor_users_limit'
                                          ? t('labels:vendor_users')
                                          : null
                    return (
                        <Content className='flex !flex-col'>
                            <div
                                className={
                                    util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL'
                                        ? 'flex flex-row-reverse !justify-end !space-x-1'
                                        : 'flex !space-x-1'
                                }>
                                <p>{count}</p>
                                {total > 0 ? (
                                    <>
                                        <p>{t('labels:of')}</p>
                                        <p>{total}</p>
                                    </>
                                ) : (
                                    ''
                                )}
                                <p>{labelText !== null ? labelText : ''}</p>
                            </div>
                            <div>
                                {total > 0 ? (
                                    <Progress
                                        strokeColor={'#FB8500'}
                                        className='w-24'
                                        size='small'
                                        percent={(count / total) * 100}
                                        showInfo={false}
                                    />
                                ) : null}
                            </div>
                        </Content>
                    )
                } else {
                    return null
                }
            },
        },
    ]

    const pagination = [
        {
            defaultSize: 10,
            showPageSizeChanger: false,
            pageSizeOptions: ['5', '10'],
        },
    ]

    const tablePropsThreshold = {
        table_header: StoreTableColumnThreshold,
        table_content: [
            {
                key: '4',
                limitfields: `${t('labels:vendor_limit')},${
                    storeDataLimitValues.vendor_limit > 0 ? storeDataLimitValues.vendor_limit : ''
                },vendor_limit`,
                limits: `${t('labels:max_vendor_onboarding_limit')},${storeLimitValues?.vendor_limit}`,
                stats: analysisCount?.vendor_count + ',' + storeDataLimitValues?.vendor_limit + ',' + 'vendor_limit',
            },
            {
                key: '5',
                limitfields: `${t('labels:customer_limit')},${
                    storeDataLimitValues.customer_limit > 0 ? storeDataLimitValues.customer_limit : ''
                },customer_limit`,
                limits: `${t('labels:max_customer_onboarding_limit')},${storeLimitValues?.customer_limit}`,
                stats:
                    analysisCount?.customer_count + ',' + storeDataLimitValues?.customer_limit + ',' + 'customer_limit',
            },
            {
                key: '6',
                limitfields: `${t('labels:product_limit')},${
                    storeDataLimitValues.product_limit > 0 ? storeDataLimitValues.product_limit : ''
                },product_limit`,
                limits: `${t('labels:max_product_limit')},${storeLimitValues?.product_limit}`,
                stats: analysisCount?.product_count + ',' + storeDataLimitValues?.product_limit + ',' + 'product_limit',
            },
            {
                key: '7',
                limitfields: `${t('labels:order_limit_per_day')},${
                    storeDataLimitValues.order_limit_per_day > 0 ? storeDataLimitValues.order_limit_per_day : ''
                },order_limit_per_day`,
                limits: `${t('labels:max_order_limit')},${storeLimitValues?.order_limit_per_day}`,
                stats:
                    analysisCount?.order_count +
                    ',' +
                    storeDataLimitValues?.order_limit_per_day +
                    ',' +
                    'order_limit_per_day',
            },
            {
                key: '8',
                limitfields: `${t('labels:langauge_limit')},${
                    storeDataLimitValues.langauge_limit > 0 ? storeDataLimitValues.langauge_limit : ''
                },langauge_limit`,
                limits: `${t('labels:max_language_limit')},${storeLimitValues?.langauge_limit}`,
                stats: analysisCount?.lang_count + ',' + storeDataLimitValues?.langauge_limit + ',' + 'langauge_limit',
            },
            {
                key: '9',
                limitfields: `${t('labels:product_template_limit')},${
                    storeDataLimitValues.product_template_limit > 0 ? storeDataLimitValues.product_template_limit : ''
                },product_template_limit`,
                limits: `${t('labels:max_product_template_limit')},${storeLimitValues?.product_template_limit}`,
                stats:
                    analysisCount?.prod_temp_count +
                    ',' +
                    storeDataLimitValues?.product_template_limit +
                    ',' +
                    'product_template_limit',
            },
            {
                key: '12',
                limitfields: `${t('labels:maximum_vendor_product_limit')},${
                    storeDataLimitValues.max_products_per_vendor > 0 ? storeDataLimitValues.max_products_per_vendor : ''
                },maximum_vendor_product_limit`,
                limits: null,
                stats: null,
            },
            {
                key: '12',
                limitfields: `${t('labels:maximum_vendor_product_template_limit')},${
                    storeDataLimitValues.max_templates_per_vendor > 0
                        ? storeDataLimitValues.max_templates_per_vendor
                        : ''
                },maximum_vendor_product_template_limit`,
                limits: null,
                stats: null,
            },
            {
                key: '13',
                limitfields: `${t('labels:default_vendor_commission')},${
                    storeDataLimitValues.default_store_commission
                },default_vendor_commission`,
                limits: null,
                stats: null,
            },
        ],
        pagenationSettings: pagination,
        search_settings: {
            is_enabled: false,
            search_title: 'Search by name',
            search_data: ['name'],
        },
        filter_settings: {
            is_enabled: false,
            filter_title: "Filter's",
            filter_data: [],
        },
        sorting_settings: {
            is_enabled: false,
            sorting_title: 'Sorting by',
            sorting_data: [],
        },
    }

    //! get call of store limit API
    const findAllStoreLimit = () => {
        MarketplaceServices.findAll(storeLimitAPI)
            .then(function (response) {
                console.log('Server Response from store limit API: ', response.data.response_body)
                if (response && response.data.response_body && response.data.response_body.data.length > 0) {
                    let selectedStoreDataLimit = response.data.response_body.data.filter(
                        (element) => element.store == storeIdFromUrl
                    )
                    if (selectedStoreDataLimit.length > 0) {
                        let selectedDataLimit = selectedStoreDataLimit[0]
                        selectedDataLimit.default_store_commission =
                            selectedDataLimit.default_store_commission == null
                                ? 0
                                : selectedDataLimit.default_store_commission
                        selectedDataLimit.max_products_per_vendor =
                            selectedDataLimit.max_products_per_vendor == null
                                ? 0
                                : selectedDataLimit.max_products_per_vendor
                        selectedDataLimit.max_templates_per_vendor =
                            selectedDataLimit.max_templates_per_vendor == null
                                ? 0
                                : selectedDataLimit.max_templates_per_vendor
                        setStoreDataLimitValues(selectedDataLimit)
                    }
                }
            })
            .catch((error) => {
                console.log('Server error from store limit API ', error.response)
            })
    }

    //! Post call for the store data limit api
    const saveStoreDataLimit = () => {
        const postBody = {
            vendor_limit: storeDataLimitValues.vendor_limit == null ? 0 : parseInt(storeDataLimitValues.vendor_limit),
            customer_limit:
                storeDataLimitValues.customer_limit == null ? 0 : parseInt(storeDataLimitValues.customer_limit),
            product_limit:
                storeDataLimitValues.product_limit == null ? 0 : parseInt(storeDataLimitValues.product_limit),
            order_limit_per_day:
                storeDataLimitValues.order_limit_per_day == null
                    ? 0
                    : parseInt(storeDataLimitValues.order_limit_per_day),
            langauge_limit:
                storeDataLimitValues.langauge_limit == null ? 0 : parseInt(storeDataLimitValues.langauge_limit),
            product_template_limit:
                storeDataLimitValues.product_template_limit == null
                    ? 0
                    : parseInt(storeDataLimitValues.product_template_limit),
            store_users_limit:
                storeDataLimitValues.store_users_limit == null ? 0 : parseInt(storeDataLimitValues.store_users_limit),
            vendor_users_limit:
                storeDataLimitValues.vendor_users_limit == null ? 0 : parseInt(storeDataLimitValues.vendor_users_limit),
            max_products_per_vendor:
                storeDataLimitValues.max_products_per_vendor == null
                    ? 0
                    : parseInt(storeDataLimitValues.max_products_per_vendor),
            max_templates_per_vendor:
                storeDataLimitValues.max_templates_per_vendor == null
                    ? 0
                    : parseInt(storeDataLimitValues.max_templates_per_vendor),
            default_store_commission:
                storeDataLimitValues.default_store_commission == null
                    ? 0
                    : parseFloat(storeDataLimitValues.default_store_commission),
            store: storeIdFromUrl,
        }
        setIsStoreDataLimitSaving(true)
        MarketplaceServices.save(storeLimitAPI, postBody)
            .then((response) => {
                console.log('Server Success Response From store data limit', response.data.response_body)
                MarketplaceToaster.showToast(response)
                let responseData = response.data.response_body
                setIsStoreDataLimitSaving(false)
                let copyofStoreDataLimitValue = { ...storeDataLimitValues }
                copyofStoreDataLimitValue.vendor_limit = responseData.vendor_limit
                copyofStoreDataLimitValue.customer_limit = responseData.customer_limit
                copyofStoreDataLimitValue.product_limit = responseData.product_limit
                copyofStoreDataLimitValue.order_limit_per_day = responseData.order_limit_per_day
                copyofStoreDataLimitValue.langauge_limit = responseData.langauge_limit
                copyofStoreDataLimitValue.product_template_limit = responseData.product_template_limit
                copyofStoreDataLimitValue.store_users_limit = responseData.store_users_limit
                copyofStoreDataLimitValue.vendor_users_limit = responseData.vendor_users_limit
                copyofStoreDataLimitValue.max_products_per_vendor = responseData.max_products_per_vendor
                copyofStoreDataLimitValue.max_templates_per_vendor = responseData.max_templates_per_vendor
                copyofStoreDataLimitValue.default_store_commission = responseData.default_store_commission
                setStoreDataLimitValues(copyofStoreDataLimitValue)
                setIsStoreDataLimitChanged(false)
            })
            .catch((error) => {
                console.log('Error Response From storeSettingPostCall', error.response)
                dataLimitErrorHandling(error?.response?.data?.response_code)
                setIsStoreDataLimitSaving(false)
                MarketplaceToaster.showToast(error.response)
            })
    }

    const storeLimitValidation = () => {
        const maxLimit = maxDataLimit
        let count = 10
        let copyofStoreDataLimitValue = { ...storeDataLimitValues }
        if (
            copyofStoreDataLimitValue.vendor_limit != null &&
            parseInt(copyofStoreDataLimitValue.vendor_limit) > maxLimit
        ) {
            count--
            setInvalidVendorLimit(true)
            MarketplaceToaster.showToast(util.getToastObject(`${t('messages:vendor_limit_error_message')}`, 'error'))
        } else if (
            copyofStoreDataLimitValue.customer_limit != null &&
            parseInt(copyofStoreDataLimitValue.customer_limit) > maxLimit
        ) {
            count--
            setInvalidCustomerLimit(true)
            MarketplaceToaster.showToast(util.getToastObject(`${t('messages:customer_limit_error_message')}`, 'error'))
        } else if (
            copyofStoreDataLimitValue.product_limit != null &&
            parseInt(copyofStoreDataLimitValue.product_limit) > maxLimit
        ) {
            count--
            setInvalidProductLimit(true)
            MarketplaceToaster.showToast(util.getToastObject(`${t('messages:product_limit_error_message')}`, 'error'))
        } else if (
            copyofStoreDataLimitValue.order_limit_per_day != null &&
            parseInt(copyofStoreDataLimitValue.order_limit_per_day) > maxLimit
        ) {
            count--
            setInvalidOrderLimit(true)
            MarketplaceToaster.showToast(util.getToastObject(`${t('messages:order_limit_error_message')}`, 'error'))
        } else if (
            copyofStoreDataLimitValue.langauge_limit != null &&
            parseInt(copyofStoreDataLimitValue.langauge_limit) > maxLimit
        ) {
            count--
            setInvalidLanguageLimit(true)
            MarketplaceToaster.showToast(util.getToastObject(`${t('messages:language_limit_error_message')}`, 'error'))
        } else if (
            copyofStoreDataLimitValue.product_template_limit != null &&
            parseInt(copyofStoreDataLimitValue.product_template_limit) > maxLimit
        ) {
            count--
            setInvalidProductTemplateLimit(true)
            MarketplaceToaster.showToast(
                util.getToastObject(`${t('messages:product_template_limit_error_message')}`, 'error')
            )
        } else if (
            copyofStoreDataLimitValue.store_users_limit != null &&
            parseInt(copyofStoreDataLimitValue.store_users_limit) > maxLimit
        ) {
            count--
            setInvalidStoreUserLimit(true)
            MarketplaceToaster.showToast(
                util.getToastObject(`${t('messages:store_user_limit_error_message')}`, 'error')
            )
        } else if (
            copyofStoreDataLimitValue.vendor_users_limit != null &&
            parseInt(copyofStoreDataLimitValue.vendor_users_limit) > maxLimit
        ) {
            count--
            setInvalidVendorUserLimit(true)
            MarketplaceToaster.showToast(
                util.getToastObject(`${t('messages:vendor_user_limit_error_message')}`, 'error')
            )
        } else if (
            copyofStoreDataLimitValue.max_products_per_vendor != null &&
            parseInt(copyofStoreDataLimitValue.max_products_per_vendor) > maxLimit
        ) {
            count--
            setInvalidMaxProductLimit(true)
            MarketplaceToaster.showToast(
                util.getToastObject(`${t('messages:max_product_limit_error_message')}`, 'error')
            )
        } else if (
            copyofStoreDataLimitValue.max_templates_per_vendor != null &&
            parseInt(copyofStoreDataLimitValue.max_templates_per_vendor) > maxLimit
        ) {
            count--
            setInvalidMaxTemplateLimit(true)
            MarketplaceToaster.showToast(
                util.getToastObject(`${t('messages:max_product_template_limit_error_message')}`, 'error')
            )
        }

        if (count === 10) {
            saveStoreDataLimit()
        }
    }

    useEffect(() => {
        findAllStoreLimit()
        setIsStoreLimitDataLoading(true)
        MarketplaceServices.findAll(storePlatformAPI)
            .then(function (response) {
                console.log('Server Response from store limit API: ', response.data.response_body)
                setStoreLimitValues(response.data.response_body)
                instance
                    .get(dm4sightBaseURL + dm4sightDataLimitAnalysisDetailsCountAPI, dm4sightHeaders)
                    .then((res) => {
                        console.log('res analysis', res)
                        setIsStoreLimitDataLoading(false)
                        setAnalysisCount(res.data)
                    })
                    .catch((error) => {
                        setIsStoreLimitDataLoading(false)
                        console.log('Server error from 4sight api ', error.response)
                    })
            })
            .catch((error) => {
                setIsStoreLimitDataLoading(false)
                console.log('Server error from store limit API ', error.response)
            })
    }, [])

    return (
        <Content>
            {isStoreLimitDataLoading ? (
                <Content className='bg-white p-3 !rounded-md mt-[2.0rem]'>
                    <Skeleton
                        active
                        paragraph={{
                            rows: 6,
                        }}></Skeleton>
                </Content>
            ) : (
                <Spin tip={t('labels:please_wait')} size='large' spinning={isStoreDataLimitSaving}>
                    <Content className='bg-white !rounded-md border my-4'>
                        <Content className='p-3'>
                            <label className='text-lg font-semibold text-regal-blue'>
                                {t('labels:thershold_limit')}
                            </label>
                        </Content>
                        {storeLimitValues && analysisCount ? (
                            <DynamicTable tableComponentData={tablePropsThreshold} />
                        ) : (
                            ''
                        )}
                        <Content className='p-3'>
                            {hideActionButton ? (
                                ''
                            ) : (
                                <Row className='gap-2'>
                                    <Col>
                                        <Button
                                            className={isStoreDataLimitChanged ? 'app-btn-primary' : '!opacity-75'}
                                            disabled={!isStoreDataLimitChanged}
                                            onClick={() => {
                                                storeLimitValidation()
                                            }}>
                                            {t('labels:save')}
                                        </Button>
                                    </Col>
                                    <Col className=''>
                                        <Button
                                            className={isStoreDataLimitChanged ? 'app-btn-secondary' : '!opacity-75'}
                                            disabled={!isStoreDataLimitChanged}
                                            onClick={() => {
                                                navigate('/dashboard/store?m_t=1')
                                            }}>
                                            {t('labels:discard')}
                                        </Button>
                                    </Col>
                                </Row>
                            )}
                        </Content>
                    </Content>
                </Spin>
            )}
        </Content>
    )
}

export default StoreRestrictions
