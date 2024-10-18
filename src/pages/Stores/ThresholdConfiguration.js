import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { useAuth } from 'react-oidc-context'

//! Import user defined components
import util from '../../util/common'
import MarketplaceToaster from '../../util/marketplaceToaster'
import MarketplaceServices from '../../services/axios/MarketplaceServices'
import { Info } from 'lucide-react'
import { validatePositiveNumber } from '../../util/validation'

//! Import ShadCN components
import ShadCNDataTable from '../../shadcnComponents/customComponents/ShadCNDataTable'
import ShadCNTooltip from '../../shadcnComponents/customComponents/ShadCNTooltip'
import { Progress } from '../../shadcnComponents/ui/progress'
import Spin from '../../shadcnComponents/customComponents/Spin'
import { Button } from '../../shadcnComponents/ui/button'
import { Input } from '../../shadcnComponents/ui/input'

//! Get all required details from .env file
const storeLimitApi = process.env.REACT_APP_STORE_PLATFORM_LIMIT_API
const maxDataLimit = process.env.REACT_APP_MAX_DATA_LIMIT
const dm4sightAnalysisCountAPI = process.env.REACT_APP_4SIGHT_GETANALYSISCOUNT_API
const dm4sightClientID = process.env.REACT_APP_4SIGHT_CLIENT_ID
const dm4sightBaseURL = process.env.REACT_APP_4SIGHT_BASE_URL
const currentUserDetailsAPI = process.env.REACT_APP_USER_PROFILE_API

const ThresholdConfiguration = ({ currentTab, setCurrentTab, hideAddStoreButton }) => {
    const { t } = useTranslation()
    const instance = axios.create()

    const [storeLimitValues, setStoreLimitValues] = useState()
    const [errorField, setErrorField] = useState('')
    const [superAdmin, setSuperAdmin] = useState(false)
    const [duplicateStoreLimitValues, setDuplicateStoreLimitValues] = useState([])
    const [analysisCount, setAnalysisCount] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [onChangeValues, setOnChangeValues] = useState(true)
    const auth = useAuth()

    let keyCLoak = sessionStorage.getItem('keycloakData')
    keyCLoak = JSON.parse(keyCLoak)
    let realmName = keyCLoak.clientId.replace(/-client$/, '')

    const dm4sightHeaders = {
        headers: {
            token: auth.user && auth.user?.access_token,
            realmname: realmName,
            dmClientId: dm4sightClientID,
            client: 'admin',
        },
    }

    //! column for account restrictions
    const accountRestrictionsColumn = [
        {
            header: `${t('labels:limits')}`,
            value: 'limits',
            key: 'limits',
            width: '30%',
            render: (text) => {
                const [limitName, limitValue, keyName, tooltip] = text.split(',')
                return (
                    <div className='flex flex-col gap-2'>
                        <div className='flex gap-2 items-center'>
                            {limitName}
                            <ShadCNTooltip
                                content={tooltip}
                                position={
                                    util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? 'left' : 'right'
                                }>
                                <Info className='text-foreground w-4' />
                            </ShadCNTooltip>
                        </div>
                        <Input
                            type='number'
                            className={`w-28 ${keyName === errorField ? 'error' : ''}`} // Add error border class
                            placeholder={t('labels:placeholder_unlimited')}
                            value={storeLimitValues?.[keyName] > 0 ? storeLimitValues?.[keyName] : ''}
                            min={0}
                            max={maxDataLimit}
                            onChange={(e) => {
                                console.log('e.target.value', typeof e.target.value)
                                let copyofStoreLimitValues = { ...storeLimitValues }
                                copyofStoreLimitValues[keyName] = parseInt(e.target.value) // Access value from event
                                setStoreLimitValues(copyofStoreLimitValues)
                                setOnChangeValues(false)
                            }}
                            onKeyDown={(e) => {
                                validatePositiveNumber(e, /[0-9]/)
                            }}
                            onFocus={() => {
                                setErrorField('')
                            }}
                            onPaste={(e) => {
                                e.preventDefault()
                                setErrorField('')

                                const pastedText = e.clipboardData.getData('text/plain')
                                const numericValue = pastedText.replace(/[^0-9]/g, '')
                                const truncatedValue = numericValue.substring(0, 12)

                                if (/^[0-9]+$/.test(truncatedValue)) {
                                    let copyOfStoreLimitValues = { ...storeLimitValues }
                                    copyOfStoreLimitValues[keyName] = truncatedValue
                                    setStoreLimitValues(copyOfStoreLimitValues)
                                }
                            }}
                            disabled={!superAdmin}
                        />
                    </div>
                )
            },
        },

        {
            header: `${t('labels:stats_name')}`,
            value: 'stats',
            key: 'stats',
            width: '20%',

            render: (text) => {
                const [count, total, keyName] = text.split(',')
                return (
                    <div>
                        {count === 'undefined' || total === 'undefined' ? null : count !== 'undefined' && total ? (
                            <div className='flex flex-col'>
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
                                    <p>{keyName === 'store_limit' ? t('labels:active_stores') : null}</p>
                                </div>
                                {total > 0 ? (
                                    <Progress className='w-24 h-[6px] mt-2' value={(count / total) * 100} />
                                ) : null}
                            </div>
                        ) : (
                            <Spin />
                        )}
                    </div>
                )
            },
        },
    ]

    //! column for store restrictions
    const storeRestrictionsColumn = [
        {
            header: `${t('labels:limits')}`,
            key: 'limits',
            value: 'limits',
            width: '30%',
            render: (text) => {
                const [limitName, limitValue, keyName, tooltip] = text.split(',')
                return (
                    <div className='flex flex-col gap-2'>
                        <div className='flex gap-2 items-center'>
                            {limitName}
                            <ShadCNTooltip
                                content={tooltip}
                                position={
                                    util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? 'left' : 'right'
                                }>
                                <Info className='text-foreground w-4' />
                            </ShadCNTooltip>
                        </div>
                        <div>
                            <Input
                                type='number'
                                value={storeLimitValues?.[keyName] > 0 ? storeLimitValues?.[keyName] : ''}
                                min={0}
                                max={maxDataLimit}
                                onFocus={() => {
                                    setErrorField('')
                                }}
                                onKeyDown={(e) => {
                                    validatePositiveNumber(e, /[0-9]/)
                                }}
                                onChange={(e) => {
                                    let copyOfStoreLimitValues = { ...storeLimitValues }
                                    copyOfStoreLimitValues[keyName] = parseInt(e.target.value)
                                    setStoreLimitValues(copyOfStoreLimitValues)
                                    setOnChangeValues(false)
                                }}
                                onPaste={(e) => {
                                    setErrorField('')
                                    // Prevent pasting non-numeric characters and limit to 12 characters
                                    e.preventDefault()
                                    const pastedValue = e.clipboardData
                                        .getData('text/plain')
                                        .replace(/[^0-9]/g, '')
                                        .substring(0, 12)
                                    document.execCommand('insertText', false, pastedValue)
                                }}
                                disabled={!superAdmin}
                                className={`w-28 ${keyName === errorField ? 'error' : ''}`}
                                placeholder={t('labels:placeholder_unlimited')}
                            />
                        </div>
                    </div>
                )
            },
        },
    ]

    //! Data for store restrictions
    const storeRestrictionsData = [
        {
            key: '1',

            limits: `${t('labels:max_vendor_onboarding_limit')},${
                storeLimitValues?.vendor_limit
            },vendor_limit, ${t('labels:vendor_limit_tooltip')}`,
        },
        {
            key: '2',
            limits: `${t('labels:max_customer_onboarding_limit')},${
                storeLimitValues?.customer_limit
            },customer_limit, ${t('labels:customer_limit_tooltip')}`,
        },
        {
            key: '3',
            limits: `${t('labels:max_product_limit')},${
                storeLimitValues?.product_limit
            },product_limit, ${t('labels:product_limit_tooltip')}`,
        },
        {
            key: '4',
            limits: `${t('labels:max_order_limit')} ,${
                storeLimitValues?.order_limit_per_day
            },order_limit_per_day, ${t('labels:order_limit_tooltip')}`,
        },
        {
            key: '5',
            limits: `${t('labels:max_language_limit')} ,${
                storeLimitValues?.langauge_limit
            },langauge_limit, ${t('labels:language_limit_tooltip')}`,
        },
        {
            key: '6',
            limits: `${t('labels:max_product_template_limit')},${
                storeLimitValues?.product_template_limit
            },product_template_limit, ${t('labels:product_template_limit_tooltip')}`,
        },
    ]
    //! Data for account restrictions
    const accountRestrictionsData = [
        {
            key: '1',
            limits: `${t('labels:maximum_store_creation_limit')},${storeLimitValues?.store_limit},store_limit,
                      ${t('labels:store_limit_tooltip')}`,
            stats: analysisCount?.store_count + ',' + storeLimitValues?.store_limit + ',' + 'store_limit',
        },
    ]

    //!Get call to get the current user details
    const getCurrentUserDetails = () => {
        MarketplaceServices.findAll(currentUserDetailsAPI, null, false)
            .then((res) => {
                console.log('get access token res', res)
                if (res.data.response_body.resource_access['dmadmin-client'].roles.includes('UI-product-admin')) {
                    setSuperAdmin(true)
                }
                console.log(
                    'response',
                    res.data.response_body.resource_access['dmadmin-client'].roles.includes('UI-product-admin')
                )
            })
            .catch((err) => {
                console.log('get access token err', err)
            })
    }

    useEffect(() => {
        getCurrentUserDetails()
    }, [])

    useEffect(() => {
        MarketplaceServices.findAll(storeLimitApi)
            .then(function (response) {
                console.log('Server Response from store limit API: ', response.data.response_body)
                setStoreLimitValues(response.data.response_body)
                setDuplicateStoreLimitValues(response.data.response_body)
            })
            .catch((error) => {
                console.log('Server error from store limit API ', error.response)
            })

        instance.get(dm4sightBaseURL + dm4sightAnalysisCountAPI, dm4sightHeaders).then((res) => {
            setAnalysisCount(res.data)
        })
    }, [])

    //! Post call for the store store limit api
    const saveStoreLimit = () => {
        const postBody = storeLimitValues
        setIsLoading(true)
        MarketplaceServices.save(storeLimitApi, postBody)
            .then((response) => {
                setIsLoading(false)
                setOnChangeValues(true)
                setDuplicateStoreLimitValues(response.data.response_body)
                console.log('response meeeeeeeeee', response)
                setErrorField('')
                MarketplaceToaster.showToast(response)
            })
            .catch((error) => {
                console.log('Error Response From storelimit', error.response)
                setIsLoading(false)

                let errField = error.response.data.response_body.message.split(' ')?.[0]
                if (errField === 'language_limit') {
                    setErrorField('langauge_limit')
                } else if (errField === 'Store') {
                    setErrorField('store_limit')
                } else {
                    setErrorField(errField)
                }
                console.log('errorField', errField)
                MarketplaceToaster.showToast(error.response)
            })
    }

    const validationForSaveStoreLimit = () => {
        if (
            duplicateStoreLimitValues?.customer_limit === storeLimitValues?.customer_limit &&
            duplicateStoreLimitValues?.dm_language_limit === storeLimitValues?.dm_language_limit &&
            duplicateStoreLimitValues?.dm_user_limit === storeLimitValues?.dm_user_limit &&
            duplicateStoreLimitValues?.order_limit_per_day === storeLimitValues?.order_limit_per_day &&
            duplicateStoreLimitValues?.product_limit === storeLimitValues?.product_limit &&
            duplicateStoreLimitValues?.product_template_limit === storeLimitValues?.product_template_limit &&
            duplicateStoreLimitValues?.store_limit === storeLimitValues?.store_limit &&
            duplicateStoreLimitValues?.store_users_limit === storeLimitValues?.store_users_limit &&
            duplicateStoreLimitValues?.vendor_limit === storeLimitValues?.vendor_limit &&
            duplicateStoreLimitValues?.vendor_users_limit === storeLimitValues?.vendor_users_limit &&
            duplicateStoreLimitValues?.langauge_limit === storeLimitValues?.langauge_limit
        ) {
            setErrorField('')
            setOnChangeValues(true)
            MarketplaceToaster.showToast(util.getToastObject(`${t('messages:no_changes_were_detected')}`, 'info'))
        } else {
            saveStoreLimit()
        }
    }

    useEffect(() => {
        setErrorField('')
    }, [currentTab])

    return (
        <div>
            {isLoading ? (
                <Spin />
            ) : (
                <>
                    <div className='shadow-brandShadow rounded-md bg-white mb-4'>
                        <p className={`!text-regal-blue p-4 font-semibold text-lg`}>
                            {t('labels:account_restrictions')}
                        </p>
                        <p className='w-full my-2 bg-brandGray h-[1px]' />
                        <div className='!p-3'>
                            <ShadCNDataTable columns={accountRestrictionsColumn} data={accountRestrictionsData} />
                        </div>
                    </div>
                    <div className='shadow-brandShadow rounded-md bg-white'>
                        <p className='!text-regal-blue  p-4 font-semibold text-lg'>{t('labels:store_restrictions')}</p>
                        <p className='w-full my-2 !bg-brandGray !h-[1px] ' />
                        <div className='!p-3'>
                            <ShadCNDataTable columns={storeRestrictionsColumn} data={storeRestrictionsData} />
                        </div>
                    </div>
                    {hideAddStoreButton ? (
                        <div className='flex gap-2 !ml-6 !py-4'>
                            <Button size='sm' onClick={() => validationForSaveStoreLimit()} disabled={onChangeValues}>
                                {t('labels:save')}
                            </Button>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() => {
                                    setCurrentTab(1)
                                    sessionStorage.setItem('currentStoretab', 1)
                                }}
                                disabled={onChangeValues}>
                                {t('labels:discard')}
                            </Button>
                        </div>
                    ) : (
                        ''
                    )}
                </>
            )}
        </div>
    )
}
export default ThresholdConfiguration
