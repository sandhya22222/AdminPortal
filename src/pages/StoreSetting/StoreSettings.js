import React, { useEffect, useState } from 'react'
import {
    Button,
    Col,
    Divider,
    Input,
    InputNumber,
    Layout,
    Progress,
    Row,
    Select,
    Skeleton,
    Space,
    Spin,
    Tooltip,
    Typography,
} from 'antd'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { EyeOutlined, UndoOutlined } from '@ant-design/icons'

import HeaderForTitle from '../../components/header/HeaderForTitle'
import StoreModal from '../../components/storeModal/StoreModal'
import { usePageTitle } from '../../hooks/usePageTitle'
import MarketplaceServices from '../../services/axios/MarketplaceServices'
import util from '../../util/common'
import MarketplaceToaster from '../../util/marketplaceToaster'
import Status from '../Stores/Status'
import Preview from './Preview'
import StoreImages from './StoreImages'
import { useAuth } from 'react-oidc-context'
import axios from 'axios'
import DynamicTable from '../../components/DynamicTable/DynamicTable'
import { validatePositiveNumber } from '../../util/validation'
import PoliciesSettings from '../PoliciesSettings/PoliciesSettings'

const { Content } = Layout
const { Title, Text } = Typography

const storeSettingAPI = process.env.REACT_APP_STORE_FRONT_SETTINGS_API
const storeAPI = process.env.REACT_APP_STORE_API
const storeImagesAPI = process.env.REACT_APP_STORE_IMAGES_API
const storeBannerImageAPI = process.env.REACT_APP_STORE_BANNER_IMAGES_API
const storeLimitAPI = process.env.REACT_APP_STORE_LIMIT
const storePlatformAPI = process.env.REACT_APP_STORE_PLATFORM_LIMIT_API
const dm4sightDataLimitAnalysisDetailsCountAPI = process.env.REACT_APP_4SIGHT_GET_DATA_ANALYSISDETAIL_API
const dm4sightClientID = process.env.REACT_APP_4SIGHT_CLIENT_ID
const dm4sightBaseURL = process.env.REACT_APP_4SIGHT_BASE_URL
const maxDataLimit = process.env.REACT_APP_MAX_DATA_LIMIT
const storeSettingsRestoreFactorAPI = process.env.REACT_APP_STORE_FRONT_SETTINGS_RESTORE_FACTOR_API
const storeCurrencyAPI = process.env.REACT_APP_STORE_CURRENCY_API
const currencyAPI = process.env.REACT_APP_CHANGE_CURRENCY_API

const StoreSettings = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const search = useLocation().search
    usePageTitle(t('labels:store_settings'))

    const id = new URLSearchParams(search).get('id')
    const storeIdFromUrl = new URLSearchParams(search).get('storeId')

    const [storeData, setStoreData] = useState()
    const [storeName, setStoreName] = useState()
    const [currencySymbol, setCurrencySymbol] = useState('')
    const [pageBackgroundColor, setPageBackgroundColor] = useState('#EBEBEB')
    const [pageBgColor, setPageBgColor] = useState('#EBEBEB')
    const [foreGroundColor, setForeGroundColor] = useState('#333333')
    const [pageFgColor, setPageFgColor] = useState('#333333')
    const [buttonPrimaryBackgroundColor, setButtonPrimaryBackgroundColor] = useState('#000000')
    const [btnPrimaryBgColor, setBtnPrimaryBgColor] = useState('#000000')
    const [buttonSecondaryBackgroundColor, setButtonSecondaryBackgroundColor] = useState('#000000')
    const [btnSecondaryBgColor, setbtnSecondaryBgColor] = useState('#000000')
    const [buttonTeritaryBackgroundColor, setButtonTeritaryBackgroundColor] = useState('#000000')
    const [btnTeritaryBgColor, setbtnTeritaryBgColor] = useState('#000000')
    const [buttonPrimaryForegroundColor, setButtonPrimaryForegroundColor] = useState('#000000')
    const [btnPrimaryFgColor, setbtnPrimaryFgColor] = useState('#000000')
    const [buttonSecondaryForegroundColor, setButtonSecondaryForegroundColor] = useState('#000000')
    const [btnSecondaryFgColor, setbtnSecondaryFgColor] = useState('#000000')
    const [buttonTeritaryForegroundColor, setButtonTeritaryForegroundColor] = useState('#000000')
    const [btnTeritaryFgColor, setbtnTeritaryFgColor] = useState('#000000')
    const [footerBackgroundColor, setFooterBackgroundColor] = useState('#000000')
    const [footerBgColor, setFooterBgColor] = useState('#000000')
    const [footerForegroundColor, setFooterForegroundColor] = useState('#000000')
    const [footerFgColor, setFooterFgColor] = useState('#000000')
    const [headerBackgroundColor, setHeaderBackgroundColor] = useState('#000000')
    const [headerBgColor, setHeaderBgColor] = useState('#000000')
    const [headerForegroundColor, setHeaderForegroundColor] = useState('#000000')
    const [headerFgColor, setHeaderFgColor] = useState('#000000')
    const [isLoading, setIsLoading] = useState(false)
    const [isStoreLimitDataLoading, setIsStoreLimitDataLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [imagesUpload, setImagesUpload] = useState([])
    const [getImageData, setGetImageData] = useState([])
    const [validStoreLogo, setValidStoreLogo] = useState(false)
    const [changeSwitchStatus, setChangeSwitchStatus] = useState()
    const [isUpLoading, setIsUpLoading] = useState(false)
    const [isCurrencyLoading, setIsCurrencyLoading] = useState(false)
    const [currencyOnChange, setCurrencyOnChange] = useState(false)
    const [copyImageOfStoreSettingsPageTheme, setCopyImageOfStoreSettingsPageTheme] = useState()
    const [copyImageOfStoreHeaderSetting, setCopyImageOfStoreHeaderSetting] = useState()
    const [copyImageOfStoreFooterSetting, setCopyImageOfStoreFooterSetting] = useState()
    const [imageOfStoreSettingsPageTheme, setImageOfStoreSettingsPageTheme] = useState()
    const [imageOfStoreHeaderSettings, setImageOfStoreHeaderSettings] = useState()
    const [imageOfStoreFooterSettings, setImageOfStoreFooterSettings] = useState()
    const [bannerAbsoluteImage, setBannerAbsoluteImage] = useState([])
    const [duplicateStoreStatus, setDuplicateStoreStatus] = useState()
    const instance = axios.create()

    const [colorCodeValidation, setColorCodeValidation] = useState({
        pageBgColorValidation: false,
        pageTextColorValidation: false,
        primaryBgValidation: false,
        secondaryBgValidation: false,
        tertiaryBgValidation: false,
        primaryTextValidation: false,
        secondaryTextValidation: false,
        tertiaryTextValidation: false,
        headerBgValidation: false,
        headerTextValidation: false,
        footerBgValidation: false,
        footerTextValidation: false,
    })
    const [onChangeValues, setOnChangeValues] = useState(false)
    const [imageChangeValues, setImageChangeValues] = useState(false)
    const [filteredCurrencyData, setFilteredCurrencyData] = useState([])
    const [resetModalOpen, setResetModalOpen] = useState(false)
    const [resetLoader, setResetLoader] = useState(false)
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
    const [isStoreDataLimitChanged, setIsStoreDataLimitChanged] = useState(false)
    const [isStoreDataLimitSaving, setIsStoreDataLimitSaving] = useState(false)
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
    const [hideActionButton, setHideActionButton] = useState(false)
    const [disableMediaButton, setDisableMediaButton] = useState(false)
    const [disableStatus, setDisableStatus] = useState(false)
    const auth = useAuth()
    const permissionValue = util.getPermissionData() || []
    const [storeLimitValues, setStoreLimitValues] = useState()
    const [analysisCount, setAnalysisCount] = useState()
    const [previousStatus, setPreviousStatus] = useState(null)
    const [currencyData, setCurrencyData] = useState([])
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
        params: {
            id: storeIdFromUrl,
        },
    }

    //! get call of  getStoreSettingApi
    const findAllWithoutPageStoreSettingApi = (storeId) => {
        MarketplaceServices.findAllWithoutPage(storeSettingAPI, {
            store_id: storeId,
        })
            .then(function (response) {
                console.log('Get response of Store setting--->', response.data.response_body.store_settings_data[0])
                setCopyImageOfStoreSettingsPageTheme(
                    response.data.response_body.store_settings_data[0].store_page_settings[0]
                )
                setImageOfStoreSettingsPageTheme(
                    response.data.response_body.store_settings_data[0].store_page_settings[0]
                )
                setCopyImageOfStoreHeaderSetting(
                    response.data.response_body.store_settings_data[0].store_header_settings[0]
                )
                setImageOfStoreHeaderSettings(
                    response.data.response_body.store_settings_data[0].store_header_settings[0]
                )
                setCopyImageOfStoreFooterSetting(
                    response.data.response_body.store_settings_data[0].store_footer_settings[0]
                )
                setImageOfStoreFooterSettings(
                    response.data.response_body.store_settings_data[0].store_footer_settings[0]
                )
                setCurrencySymbol(response.data.response_body.store_settings_data[0].store_currency[0].symbol)

                setPageBackgroundColor(
                    response.data.response_body.store_settings_data[0].store_page_settings[0].bg_color
                )
                setPageBgColor(response.data.response_body.store_settings_data[0].store_page_settings[0].bg_color)
                setForeGroundColor(response.data.response_body.store_settings_data[0].store_page_settings[0].fg_color)
                setPageFgColor(response.data.response_body.store_settings_data[0].store_page_settings[0].fg_color)
                setButtonPrimaryBackgroundColor(
                    response.data.response_body.store_settings_data[0].store_page_settings[0].btn_primary_bg_color
                )
                setBtnPrimaryBgColor(
                    response.data.response_body.store_settings_data[0].store_page_settings[0].btn_primary_bg_color
                )
                setButtonPrimaryForegroundColor(
                    response.data.response_body.store_settings_data[0].store_page_settings[0].btn_primary_fg_color
                )
                setbtnPrimaryFgColor(
                    response.data.response_body.store_settings_data[0].store_page_settings[0].btn_primary_fg_color
                )
                setButtonSecondaryBackgroundColor(
                    response.data.response_body.store_settings_data[0].store_page_settings[0].btn_secondary_bg_color
                )
                setbtnSecondaryBgColor(
                    response.data.response_body.store_settings_data[0].store_page_settings[0].btn_secondary_bg_color
                )
                setButtonSecondaryForegroundColor(
                    response.data.response_body.store_settings_data[0].store_page_settings[0].btn_secondary_fg_color
                )
                setbtnSecondaryFgColor(
                    response.data.response_body.store_settings_data[0].store_page_settings[0].btn_secondary_fg_color
                )
                setButtonTeritaryBackgroundColor(
                    response.data.response_body.store_settings_data[0].store_page_settings[0].btn_tertiary_bg_color
                )
                setbtnTeritaryBgColor(
                    response.data.response_body.store_settings_data[0].store_page_settings[0].btn_tertiary_bg_color
                )
                setButtonTeritaryForegroundColor(
                    response.data.response_body.store_settings_data[0].store_page_settings[0].btn_tertiary_fg_color
                )
                setbtnTeritaryFgColor(
                    response.data.response_body.store_settings_data[0].store_page_settings[0].btn_tertiary_fg_color
                )
                setHeaderBackgroundColor(
                    response.data.response_body.store_settings_data[0].store_header_settings[0].bg_color
                )
                setHeaderBgColor(response.data.response_body.store_settings_data[0].store_header_settings[0].bg_color)
                setHeaderForegroundColor(
                    response.data.response_body.store_settings_data[0].store_header_settings[0].fg_color
                )
                setHeaderFgColor(response.data.response_body.store_settings_data[0].store_header_settings[0].fg_color)
                setFooterBackgroundColor(
                    response.data.response_body.store_settings_data[0].store_footer_settings[0].bg_color
                )
                setFooterBgColor(response.data.response_body.store_settings_data[0].store_footer_settings[0].bg_color)
                setFooterForegroundColor(
                    response.data.response_body.store_settings_data[0].store_footer_settings[0].fg_color
                )
                setFooterFgColor(response.data.response_body.store_settings_data[0].store_footer_settings[0].fg_color)
            })
            .catch((error) => {
                console.log('error response from store settings API', error)
                if (error.response === undefined) {
                    setPageBackgroundColor('#EBEBEB')
                    setButtonPrimaryBackgroundColor('#000000')
                    setButtonSecondaryBackgroundColor('#000000')
                    setButtonTeritaryBackgroundColor('#000000')
                    setButtonPrimaryForegroundColor('#000000')
                    setButtonSecondaryForegroundColor('#000000')
                    setButtonTeritaryForegroundColor('#000000')
                    setForeGroundColor('#333333')
                    setFooterBackgroundColor('#000000')
                    setFooterForegroundColor('#000000')
                    setHeaderForegroundColor('#000000')
                    setHeaderBackgroundColor('#000000')
                }
            })
    }

    //! get call for store Settings Restore Factor API
    const updateStoreSettingsRestoreApi = () => {
        setResetLoader(true)
        MarketplaceServices.update(
            storeSettingsRestoreFactorAPI,
            {},
            {
                store_uuid: id,
            }
        )
            .then((response) => {
                setOnChangeValues(false)
                setResetModalOpen(false)
                setResetLoader(false)
                console.log(
                    'success response  for Store Settings Restore Factory ',
                    storeSettingsRestoreFactorAPI,
                    response.data.response_body
                )
                MarketplaceToaster.showToast(response)
                setColorCodeValidation(false)
                setCopyImageOfStoreSettingsPageTheme(response.data.response_body.store_page_settings[0])
                setImageOfStoreSettingsPageTheme(response.data.response_body.store_page_settings[0])
                setCopyImageOfStoreHeaderSetting(response.data.response_body.store_header_settings[0])
                setImageOfStoreHeaderSettings(response.data.response_body.store_header_settings[0])
                setCopyImageOfStoreFooterSetting(response.data.response_body.store_footer_settings[0])
                setImageOfStoreFooterSettings(response.data.response_body.store_footer_settings[0])
                setPageBackgroundColor(response.data.response_body.store_page_settings[0].bg_color)
                setPageBgColor(response.data.response_body.store_page_settings[0].bg_color)
                setForeGroundColor(response.data.response_body.store_page_settings[0].fg_color)
                setPageFgColor(response.data.response_body.store_page_settings[0].fg_color)
                setButtonPrimaryBackgroundColor(response.data.response_body.store_page_settings[0].btn_primary_bg_color)
                setBtnPrimaryBgColor(response.data.response_body.store_page_settings[0].btn_primary_bg_color)
                setButtonPrimaryForegroundColor(response.data.response_body.store_page_settings[0].btn_primary_fg_color)
                setbtnPrimaryFgColor(response.data.response_body.store_page_settings[0].btn_primary_fg_color)
                setButtonSecondaryBackgroundColor(
                    response.data.response_body.store_page_settings[0].btn_secondary_bg_color
                )
                setbtnSecondaryBgColor(response.data.response_body.store_page_settings[0].btn_secondary_bg_color)
                setButtonSecondaryForegroundColor(
                    response.data.response_body.store_page_settings[0].btn_secondary_fg_color
                )
                setbtnSecondaryFgColor(response.data.response_body.store_page_settings[0].btn_secondary_fg_color)
                setButtonTeritaryBackgroundColor(
                    response.data.response_body.store_page_settings[0].btn_tertiary_bg_color
                )
                setbtnTeritaryBgColor(response.data.response_body.store_page_settings[0].btn_tertiary_bg_color)
                setButtonTeritaryForegroundColor(
                    response.data.response_body.store_page_settings[0].btn_tertiary_fg_color
                )
                setbtnTeritaryFgColor(response.data.response_body.store_page_settings[0].btn_tertiary_fg_color)
                setHeaderBackgroundColor(response.data.response_body.store_header_settings[0].bg_color)
                setHeaderBgColor(response.data.response_body.store_header_settings[0].bg_color)
                setHeaderForegroundColor(response.data.response_body.store_header_settings[0].fg_color)
                setHeaderFgColor(response.data.response_body.store_header_settings[0].fg_color)
                setFooterBackgroundColor(response.data.response_body.store_footer_settings[0].bg_color)
                setFooterBgColor(response.data.response_body.store_footer_settings[0].bg_color)
                setFooterForegroundColor(response.data.response_body.store_footer_settings[0].fg_color)
                setFooterFgColor(response.data.response_body.store_footer_settings[0].fg_color)
            })
            .catch((error) => {
                setResetLoader(false)
                console.log('ERROR response  for Store Settings Restore Factory ', storeSettingsRestoreFactorAPI, error)
            })
    }

    const storeLimitValidation = () => {
        const maxLimit = maxDataLimit
        let count = 10
        let copyofStoreDataLimitValue = { ...storeDataLimitValues }
        if (copyofStoreDataLimitValue.vendor_limit !== '' && copyofStoreDataLimitValue.vendor_limit > maxLimit) {
            count--
            setInvalidVendorLimit(true)
            MarketplaceToaster.showToast(util.getToastObject(`${t('messages:vendor_limit_error_message')}`, 'error'))
        } else if (
            copyofStoreDataLimitValue.customer_limit !== '' &&
            parseInt(copyofStoreDataLimitValue.customer_limit) > maxLimit
        ) {
            count--
            setInvalidCustomerLimit(true)
            MarketplaceToaster.showToast(util.getToastObject(`${t('messages:customer_limit_error_message')}`, 'error'))
        } else if (
            copyofStoreDataLimitValue.product_limit !== '' &&
            parseInt(copyofStoreDataLimitValue.product_limit) > maxLimit
        ) {
            count--
            setInvalidProductLimit(true)
            MarketplaceToaster.showToast(util.getToastObject(`${t('messages:product_limit_error_message')}`, 'error'))
        } else if (
            copyofStoreDataLimitValue.order_limit_per_day !== '' &&
            parseInt(copyofStoreDataLimitValue.order_limit_per_day) > maxLimit
        ) {
            count--
            setInvalidOrderLimit(true)
            MarketplaceToaster.showToast(util.getToastObject(`${t('messages:order_limit_error_message')}`, 'error'))
        } else if (
            copyofStoreDataLimitValue.langauge_limit !== '' &&
            parseInt(copyofStoreDataLimitValue.langauge_limit) > maxLimit
        ) {
            count--
            setInvalidLanguageLimit(true)
            MarketplaceToaster.showToast(util.getToastObject(`${t('messages:language_limit_error_message')}`, 'error'))
        } else if (
            copyofStoreDataLimitValue.product_template_limit !== '' &&
            parseInt(copyofStoreDataLimitValue.product_template_limit) > maxLimit
        ) {
            count--
            setInvalidProductTemplateLimit(true)
            MarketplaceToaster.showToast(
                util.getToastObject(`${t('messages:product_template_limit_error_message')}`, 'error')
            )
        } else if (
            copyofStoreDataLimitValue.store_users_limit !== '' &&
            parseInt(copyofStoreDataLimitValue.store_users_limit) > maxLimit
        ) {
            count--
            setInvalidStoreUserLimit(true)
            MarketplaceToaster.showToast(
                util.getToastObject(`${t('messages:store_user_limit_error_message')}`, 'error')
            )
        } else if (
            copyofStoreDataLimitValue.vendor_users_limit !== '' &&
            parseInt(copyofStoreDataLimitValue.vendor_users_limit) > maxLimit
        ) {
            count--
            setInvalidVendorUserLimit(true)
            MarketplaceToaster.showToast(
                util.getToastObject(`${t('messages:vendor_user_limit_error_message')}`, 'error')
            )
        } else if (
            copyofStoreDataLimitValue.max_products_per_vendor !== '' &&
            parseInt(copyofStoreDataLimitValue.max_products_per_vendor) > maxLimit
        ) {
            count--
            setInvalidMaxProductLimit(true)
            MarketplaceToaster.showToast(
                util.getToastObject(`${t('messages:max_product_limit_error_message')}`, 'error')
            )
        } else if (
            copyofStoreDataLimitValue.max_templates_per_vendor !== '' &&
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

    //! get call of store API
    const findAllStoreApi = () => {
        MarketplaceServices.findAll(storeAPI)
            .then(function (response) {
                console.log('Server Response from getStoreApi Function: ', response.data.response_body)
                setStoreData(response.data.response_body.data)
                if (response && response.data.response_body && response.data.response_body.data.length > 0) {
                    let selectedStore = response.data.response_body.data.filter((element) => element.store_uuid === id)
                    if (selectedStore.length > 0) {
                        setStoreName(selectedStore[0].name)
                        setChangeSwitchStatus(selectedStore[0].status)
                        setDuplicateStoreStatus(selectedStore[0].status)
                    }
                }
            })
            .catch((error) => {
                console.log('Server error from getStoreApi Function ', error.response)
            })
    }

    //! another get call for stores for particular store_uuid
    const findAllStoreData = (statusUUid) => {
        MarketplaceServices.findAll(
            storeAPI,
            {
                store_id: statusUUid,
            },
            false
        )
            .then(function (response) {
                console.log(
                    'Server Response from findByPageStoreApi Function for store uuid: ',
                    response.data.response_body
                )
                setDuplicateStoreStatus(response.data.response_body.data[0].status)
                if (response.data.response_body.data[0].status === 1) {
                    MarketplaceToaster.showToast(
                        util.getToastObject(`${t('messages:your_store_has_been_successfully_activated')}`, 'success')
                    )
                } else if (response.data.response_body.data[0].status === 2) {
                    if (previousStatus === 5) {
                        MarketplaceToaster.showToast(
                            util.getToastObject(
                                `${t('messages:your_store_has_been_successfully_deactivated')}`,
                                'success'
                            )
                        )
                    }
                }
            })
            .catch((error) => {
                console.log('Server error from findByPageStoreApi Function ', error.response)
            })
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (duplicateStoreStatus !== 1 && duplicateStoreStatus !== 2) {
                findAllStoreData(id)
            }
        }, 30000)

        return () => clearInterval(intervalId)
    }, [duplicateStoreStatus])

    //! post call for store settings
    const saveStoreSettingsCall = () => {
        const postBody = {
            store_id: id,
            store_page_settings: [
                {
                    bg_color: pageBackgroundColor,
                    fg_color: foreGroundColor,
                    btn_primary_bg_color: buttonPrimaryBackgroundColor,
                    btn_secondary_bg_color: buttonSecondaryBackgroundColor,
                    btn_tertiary_bg_color: buttonTeritaryBackgroundColor,
                    btn_primary_fg_color: buttonPrimaryForegroundColor,
                    btn_secondary_fg_color: buttonSecondaryForegroundColor,
                    btn_tertiary_fg_color: buttonTeritaryForegroundColor,
                },
            ],
            store_header_settings: [
                {
                    bg_color: headerBackgroundColor,
                    fg_color: headerForegroundColor,
                },
            ],
            store_footer_settings: [
                {
                    bg_color: footerBackgroundColor,
                    fg_color: footerForegroundColor,
                },
            ],
        }
        setIsLoading(true)
        MarketplaceServices.save(storeSettingAPI, postBody)
            .then((response) => {
                console.log('Server Success Response From storeSettingPostCall', response.data.response_body)
                MarketplaceToaster.showToast(response)
                setOnChangeValues(false)
                setIsLoading(false)
                setCopyImageOfStoreSettingsPageTheme(response.data.response_body.store_page_settings[0])
                setImageOfStoreSettingsPageTheme(response.data.response_body.store_page_settings[0])
                setCopyImageOfStoreHeaderSetting(response.data.response_body.store_header_settings[0])
                setImageOfStoreHeaderSettings(response.data.response_body.store_header_settings[0])
                setCopyImageOfStoreFooterSetting(response.data.response_body.store_footer_settings[0])
                setImageOfStoreFooterSettings(response.data.response_body.store_footer_settings[0])
                setPageBackgroundColor(response.data.response_body.store_page_settings[0].bg_color)
                setPageBgColor(response.data.response_body.store_page_settings[0].bg_color)
                setForeGroundColor(response.data.response_body.store_page_settings[0].fg_color)
                setPageFgColor(response.data.response_body.store_page_settings[0].fg_color)
                setButtonPrimaryBackgroundColor(response.data.response_body.store_page_settings[0].btn_primary_bg_color)
                setBtnPrimaryBgColor(response.data.response_body.store_page_settings[0].btn_primary_bg_color)
                setButtonPrimaryForegroundColor(response.data.response_body.store_page_settings[0].btn_primary_fg_color)
                setbtnPrimaryFgColor(response.data.response_body.store_page_settings[0].btn_primary_fg_color)
                setButtonSecondaryBackgroundColor(
                    response.data.response_body.store_page_settings[0].btn_secondary_bg_color
                )
                setbtnSecondaryBgColor(response.data.response_body.store_page_settings[0].btn_secondary_bg_color)
                setButtonSecondaryForegroundColor(
                    response.data.response_body.store_page_settings[0].btn_secondary_fg_color
                )
                setbtnSecondaryFgColor(response.data.response_body.store_page_settings[0].btn_secondary_fg_color)
                setButtonTeritaryBackgroundColor(
                    response.data.response_body.store_page_settings[0].btn_tertiary_bg_color
                )
                setbtnTeritaryBgColor(response.data.response_body.store_page_settings[0].btn_tertiary_bg_color)
                setButtonTeritaryForegroundColor(
                    response.data.response_body.store_page_settings[0].btn_tertiary_fg_color
                )
                setbtnTeritaryFgColor(response.data.response_body.store_page_settings[0].btn_tertiary_fg_color)
                setHeaderBackgroundColor(response.data.response_body.store_header_settings[0].bg_color)
                setHeaderBgColor(response.data.response_body.store_header_settings[0].bg_color)
                setHeaderForegroundColor(response.data.response_body.store_header_settings[0].fg_color)
                setHeaderFgColor(response.data.response_body.store_header_settings[0].fg_color)
                setFooterBackgroundColor(response.data.response_body.store_footer_settings[0].bg_color)
                setFooterBgColor(response.data.response_body.store_footer_settings[0].bg_color)
                setFooterForegroundColor(response.data.response_body.store_footer_settings[0].fg_color)
                setFooterFgColor(response.data.response_body.store_footer_settings[0].fg_color)
            })
            .catch((error) => {
                console.log('Error Response From storeSettingPostCall', error.response)
                setIsLoading(false)
                MarketplaceToaster.showToast(error.response)
            })
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
            vendor_limit: storeDataLimitValues.vendor_limit === '' ? 0 : storeDataLimitValues.vendor_limit,
            customer_limit: storeDataLimitValues.customer_limit === '' ? 0 : storeDataLimitValues.customer_limit,
            product_limit: storeDataLimitValues.product_limit === '' ? 0 : storeDataLimitValues.product_limit,
            order_limit_per_day:
                storeDataLimitValues.order_limit_per_day === '' ? 0 : storeDataLimitValues.order_limit_per_day,
            langauge_limit: storeDataLimitValues.langauge_limit === '' ? 0 : storeDataLimitValues.langauge_limit,
            product_template_limit:
                storeDataLimitValues.product_template_limit === '' ? 0 : storeDataLimitValues.product_template_limit,
            store_users_limit:
                storeDataLimitValues.store_users_limit === '' ? 0 : storeDataLimitValues.store_users_limit,
            vendor_users_limit:
                storeDataLimitValues.vendor_users_limit === '' ? 0 : storeDataLimitValues.vendor_users_limit,
            max_products_per_vendor:
                storeDataLimitValues.max_products_per_vendor === '' ? 0 : storeDataLimitValues.max_products_per_vendor,
            max_templates_per_vendor:
                storeDataLimitValues.max_templates_per_vendor === ''
                    ? 0
                    : storeDataLimitValues.max_templates_per_vendor,
            default_store_commission:
                storeDataLimitValues.default_store_commission === ''
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

    //! validations of store settings API
    const validatePostStoreSetting = () => {
        let count = 2
        if (
            (imageOfStoreSettingsPageTheme && imageOfStoreSettingsPageTheme.bg_color) ===
                (copyImageOfStoreSettingsPageTheme && copyImageOfStoreSettingsPageTheme.bg_color) &&
            (imageOfStoreSettingsPageTheme && imageOfStoreSettingsPageTheme.btn_primary_bg_color) ===
                (copyImageOfStoreSettingsPageTheme && copyImageOfStoreSettingsPageTheme.btn_primary_bg_color) &&
            (imageOfStoreSettingsPageTheme && imageOfStoreSettingsPageTheme.btn_primary_fg_color) ===
                (copyImageOfStoreSettingsPageTheme && copyImageOfStoreSettingsPageTheme.btn_primary_fg_color) &&
            (imageOfStoreSettingsPageTheme && imageOfStoreSettingsPageTheme.btn_secondary_bg_color) ===
                (copyImageOfStoreSettingsPageTheme && copyImageOfStoreSettingsPageTheme.btn_secondary_bg_color) &&
            (imageOfStoreSettingsPageTheme && imageOfStoreSettingsPageTheme.btn_secondary_fg_color) ===
                (copyImageOfStoreSettingsPageTheme && copyImageOfStoreSettingsPageTheme.btn_secondary_fg_color) &&
            (imageOfStoreSettingsPageTheme && imageOfStoreSettingsPageTheme.btn_tertiary_bg_color) ===
                (copyImageOfStoreSettingsPageTheme && copyImageOfStoreSettingsPageTheme.btn_tertiary_bg_color) &&
            (imageOfStoreSettingsPageTheme && imageOfStoreSettingsPageTheme.btn_tertiary_fg_color) ===
                (copyImageOfStoreSettingsPageTheme && copyImageOfStoreSettingsPageTheme.btn_tertiary_fg_color) &&
            (imageOfStoreSettingsPageTheme && imageOfStoreSettingsPageTheme.fg_color) ===
                (copyImageOfStoreSettingsPageTheme && copyImageOfStoreSettingsPageTheme.fg_color) &&
            (imageOfStoreHeaderSettings && imageOfStoreHeaderSettings.bg_color) ===
                (copyImageOfStoreHeaderSetting && copyImageOfStoreHeaderSetting.bg_color) &&
            (imageOfStoreHeaderSettings && imageOfStoreHeaderSettings.fg_color) ===
                (copyImageOfStoreHeaderSetting && copyImageOfStoreHeaderSetting.fg_color) &&
            (imageOfStoreFooterSettings && imageOfStoreFooterSettings.bg_color) ===
                (copyImageOfStoreFooterSetting && copyImageOfStoreFooterSetting.bg_color) &&
            (imageOfStoreFooterSettings && imageOfStoreFooterSettings.fg_color) ===
                (copyImageOfStoreFooterSetting && copyImageOfStoreFooterSetting.fg_color) &&
            imagesUpload.length === 0
        ) {
            count--
            MarketplaceToaster.showToast(util.getToastObject(`${t('messages:no_changes_were_detected')}`, 'info'))
        } else if (
            colorCodeValidation.pageBgColorValidation === true ||
            colorCodeValidation.pageTextColorValidation === true ||
            colorCodeValidation.primaryBgValidation === true ||
            colorCodeValidation.secondaryBgValidation === true ||
            colorCodeValidation.tertiaryBgValidation === true ||
            colorCodeValidation.primaryTextValidation === true ||
            colorCodeValidation.secondaryTextValidation === true ||
            colorCodeValidation.tertiaryTextValidation === true ||
            colorCodeValidation.headerBgValidation === true ||
            colorCodeValidation.headerTextValidation === true ||
            colorCodeValidation.footerBgValidation === true ||
            colorCodeValidation.footerTextValidation === true
        ) {
            count--
            MarketplaceToaster.showToast(util.getToastObject(`${t('messages:color_validation')}`, 'error'))
        } else if (count === 2) {
            saveStoreSettingsCall()
        }
    }

    const openModal = () => {
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }

    //! get call of store images
    const findAllWithoutPageStoreImagesApi = (storeId) => {
        MarketplaceServices.findAllWithoutPage(storeImagesAPI, {
            store_id: storeId,
        })
            .then(function (response) {
                console.log('Get response of Store setting Images--->', response.data.response_body)
                let data = []
                data.push(response.data.response_body)
                setGetImageData(data)
            })
            .catch((error) => {
                console.log('error response from images--->', error)
                setGetImageData([])
            })
    }

    //! post call of store images
    const saveStoreLogoImageCall = () => {
        const formData = new FormData()
        if (imagesUpload && imagesUpload.length > 0) {
            for (var i = 0; i < imagesUpload.length; i++) {
                if (imagesUpload[i].type === 'store_logo') {
                    formData.append('store_logo', imagesUpload[i].imageValue)
                } else if (imagesUpload[i].type === 'banner_images') {
                    let localBannerImagesUpload = imagesUpload[i].imageValue
                    for (var j = 0; j < localBannerImagesUpload.length; j++) {
                        formData.append('banner_images', localBannerImagesUpload[j])
                    }
                } else if (imagesUpload[i].type === 'search_logo') {
                    formData.append('search_logo', imagesUpload[i].imageValue)
                } else if (imagesUpload[i].type === 'customer_logo') {
                    formData.append('customer_logo', imagesUpload[i].imageValue)
                } else if (imagesUpload[i].type === 'cart_logo') {
                    formData.append('cart_logo', imagesUpload[i].imageValue)
                } else if (imagesUpload[i].type === 'wishlist_logo') {
                    formData.append('wishlist_logo', imagesUpload[i].imageValue)
                }
            }
            formData.append('store_id', id)
        }
        setIsUpLoading(true)
        MarketplaceServices.save(storeImagesAPI, formData)
            .then((response) => {
                console.log('Server Success Response From storeImagePostCall', response.data.response_body)
                MarketplaceToaster.showToast(response)
                setIsUpLoading(false)
                setIsLoading(false)
                setGetImageData([response.data.response_body])
                setImagesUpload([])
            })
            .catch((error) => {
                console.log('Error response from store images post call', error)
                setIsUpLoading(false)
                MarketplaceToaster.showToast(error.response)
                setIsLoading(false)
            })
    }

    useEffect(() => {
        if (getImageData && getImageData.length > 0) {
            findAllWithoutPageStoreBannerImageApi(id)
        }
    }, [getImageData])

    //!put call of store images
    const updateStoreLogoImageCall = () => {
        const formData = new FormData()
        if (imagesUpload && imagesUpload.length > 0) {
            for (var i = 0; i < imagesUpload.length; i++) {
                if (imagesUpload[i].type === 'store_logo') {
                    formData.append('store_logo', imagesUpload[i].imageValue)
                } else if (imagesUpload[i].type === 'banner_images') {
                    let localBannerImagesUpload = imagesUpload[i].imageValue
                    for (var j = 0; j < localBannerImagesUpload.length; j++) {
                        formData.append('banner_images', localBannerImagesUpload[j])
                    }
                } else if (imagesUpload[i].type === 'search_logo') {
                    formData.append('search_logo', imagesUpload[i].imageValue)
                } else if (imagesUpload[i].type === 'customer_logo') {
                    formData.append('customer_logo', imagesUpload[i].imageValue)
                } else if (imagesUpload[i].type === 'cart_logo') {
                    formData.append('cart_logo', imagesUpload[i].imageValue)
                } else if (imagesUpload[i].type === 'wishlist_logo') {
                    formData.append('wishlist_logo', imagesUpload[i].imageValue)
                }
            }
            formData.append('store_id', id)
        }
        setIsUpLoading(true)
        MarketplaceServices.update(storeImagesAPI, formData)
            .then((response) => {
                console.log('API endpoint', storeImagesAPI, 'Server Success Response From storeImagePutCall', response)
                MarketplaceToaster.showToast(response)
                setGetImageData([response.data.response_body])
                setImagesUpload([])
                setIsUpLoading(false)
                setIsLoading(false)
                setImageChangeValues(false)
            })
            .catch((error) => {
                console.log('error response from the store images put call', error)
                MarketplaceToaster.showToast(error.response)
                setIsUpLoading(false)
                setIsLoading(false)
            })
    }

    const postImageOnClickSave = () => {
        if (Object.keys(getImageData[0]).length > 0) {
            updateStoreLogoImageCall()
        } else {
            saveStoreLogoImageCall()
        }
    }

    //! get call for store banner images
    const findAllWithoutPageStoreBannerImageApi = (storeId) => {
        MarketplaceServices.findAllWithoutPage(storeBannerImageAPI, {
            store_id: storeId,
        })
            .then(function (response) {
                console.log('Server Response from getstoreBannerImageApi Function: ', response.data.response_body)
                setBannerAbsoluteImage(response.data.response_body)
            })
            .catch((error) => {
                console.log('Server error from banner images  Function ', error.response)
            })
    }

    useEffect(() => {
        let isScopeAvailable =
            !auth.isAuthenticated ||
            (auth.isAuthenticated &&
                permissionValue &&
                permissionValue.length > 0 &&
                permissionValue.includes('UI-product-admin'))
                ? true
                : false
        setHideActionButton(isScopeAvailable)
        setDisableMediaButton(isScopeAvailable)
        setDisableStatus(isScopeAvailable)
    }, [auth])

    useEffect(() => {
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
                            validatePositiveNumber(e, /[0-9]/)
                        }}
                        onPaste={(e) => {
                            validatePositiveNumber(e, /[0-9]/)
                        }}
                        className={'w-28'}
                        max={maxDataLimit}
                        maxLength={10}
                        onChange={(value) => {
                            let copyofStoreDataLimitValue = { ...storeDataLimitValues }
                            copyofStoreDataLimitValue.vendor_limit = value
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
                            validatePositiveNumber(e, /[0-9]/)
                        }}
                        onPaste={(e) => {
                            validatePositiveNumber(e, /[0-9]/)
                        }}
                        className={'w-28'}
                        max={maxDataLimit}
                        maxLength={10}
                        onChange={(value) => {
                            let copyofStoreDataLimitValue = { ...storeDataLimitValues }
                            copyofStoreDataLimitValue.customer_limit = value
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
                            validatePositiveNumber(e, /[0-9]/)
                        }}
                        onPaste={(e) => {
                            validatePositiveNumber(e, /[0-9]/)
                        }}
                        className={'w-28'}
                        max={maxDataLimit}
                        maxLength={10}
                        onChange={(value) => {
                            let copyofStoreDataLimitValue = { ...storeDataLimitValues }
                            copyofStoreDataLimitValue.product_limit = value
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
                            validatePositiveNumber(e, /[0-9]/)
                        }}
                        onPaste={(e) => {
                            validatePositiveNumber(e, /[0-9]/)
                        }}
                        className={'w-28'}
                        max={maxDataLimit}
                        maxLength={10}
                        onChange={(value) => {
                            let copyofStoreDataLimitValue = { ...storeDataLimitValues }
                            copyofStoreDataLimitValue.order_limit_per_day = value
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
                            validatePositiveNumber(e, /[0-9]/)
                        }}
                        onPaste={(e) => {
                            validatePositiveNumber(e, /[0-9]/)
                        }}
                        className={'w-28'}
                        max={maxDataLimit}
                        maxLength={10}
                        onChange={(value) => {
                            let copyofStoreDataLimitValue = { ...storeDataLimitValues }
                            copyofStoreDataLimitValue.langauge_limit = value
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
                            validatePositiveNumber(e, /[0-9]/)
                        }}
                        onPaste={(e) => {
                            validatePositiveNumber(e, /[0-9]/)
                        }}
                        className={'w-28'}
                        max={maxDataLimit}
                        maxLength={10}
                        onChange={(value) => {
                            let copyofStoreDataLimitValue = { ...storeDataLimitValues }
                            copyofStoreDataLimitValue.product_template_limit = value
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
                            validatePositiveNumber(e, /[0-9]/)
                        }}
                        onPaste={(e) => {
                            validatePositiveNumber(e, /[0-9]/)
                        }}
                        className={'w-28'}
                        max={maxDataLimit}
                        maxLength={10}
                        onChange={(value) => {
                            let copyofStoreDataLimitValue = { ...storeDataLimitValues }
                            copyofStoreDataLimitValue.store_users_limit = value
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
                            validatePositiveNumber(e, /[0-9]/)
                        }}
                        onPaste={(e) => {
                            validatePositiveNumber(e, /[0-9]/)
                        }}
                        className={'w-28'}
                        max={maxDataLimit}
                        maxLength={10}
                        onChange={(value) => {
                            let copyofStoreDataLimitValue = { ...storeDataLimitValues }
                            copyofStoreDataLimitValue.vendor_users_limit = value
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
                            validatePositiveNumber(e, /[0-9]/)
                        }}
                        onPaste={(e) => {
                            validatePositiveNumber(e, /[0-9]/)
                        }}
                        className={'w-28'}
                        max={maxDataLimit}
                        maxLength={10}
                        onChange={(value) => {
                            let copyofStoreDataLimitValue = { ...storeDataLimitValues }
                            copyofStoreDataLimitValue.max_products_per_vendor = value
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
                            validatePositiveNumber(e, /[0-9]/)
                        }}
                        onPaste={(e) => {
                            validatePositiveNumber(e, /[0-9]/)
                        }}
                        className={'w-28'}
                        max={maxDataLimit}
                        maxLength={10}
                        onChange={(value) => {
                            setIsStoreDataLimitChanged(true)
                            let copyofStoreDataLimitValue = { ...storeDataLimitValues }
                            copyofStoreDataLimitValue.max_templates_per_vendor = value
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
                            validatePositiveNumber(e, /[0-9]/)
                        }}
                        onPaste={(e) => {
                            validatePositiveNumber(e, /[0-9]/)
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
                                        strokeColor={'#4A2D73'}
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

    //!get call of list currency
    const findAllWithoutCurrencyDataByChange = (value) => {
        setIsCurrencyLoading(true)
        MarketplaceServices.findAllWithoutPage(currencyAPI, { currency_code: value }, false)
            .then(function (response) {
                setIsCurrencyLoading(false)
                console.log('server Success response from currency API call', response.data.response_body.data)
                if (response && response.data && response.data.response_body.data.length > 0) {
                    setCurrencyData(response.data.response_body.data)
                    setCurrencySymbol(response.data.response_body.data[0].symbol)
                }
            })
            .catch((error) => {
                setIsCurrencyLoading(false)
                console.log('server error response from currency API call', error.response)
            })
    }

    //! put call for store currency  API
    const updateStoreCurrencyApi = () => {
        setIsCurrencyLoading(true)
        MarketplaceServices.update(
            storeCurrencyAPI,
            {
                store_id: id,
                currency_id: currencyData && currencyData.length > 0 && currencyData[0].id,
            },
            null
        )
            .then((response) => {
                setIsCurrencyLoading(false)
                setCurrencyOnChange(false)

                console.log(
                    'success response  for Store Settings Restore Factory ',
                    storeSettingsRestoreFactorAPI,
                    response.data.response_body
                )
                MarketplaceToaster.showToast(response)
            })
            .catch((error) => {
                setIsCurrencyLoading(false)
                MarketplaceToaster.showToast(error.response)
                console.log('ERROR response  for Store Settings Restore Factory ', storeSettingsRestoreFactorAPI, error)
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

    const closeResetWaringModal = () => {
        setResetModalOpen(false)
    }

    useEffect(() => {
        findAllStoreApi()
        findAllStoreLimit()
        findByPageCurrencyData()
        window.scroll(0, 0)
        if (id) {
            findAllWithoutPageStoreSettingApi(id)
            findAllWithoutPageStoreImagesApi(id)
        }
    }, [id])

    useEffect(() => {
        const currencyDisplayData =
            filteredCurrencyData &&
            filteredCurrencyData.length > 0 &&
            filteredCurrencyData.filter((ele) => ele.symbol === currencySymbol)
        if (currencyDisplayData !== false && currencyDisplayData && currencyDisplayData.length > 0) {
            setCurrencyData(currencyDisplayData)
        }
    }, [filteredCurrencyData, currencySymbol])

    return (
        <Content>
            <HeaderForTitle
                title={
                    <Content className='flex !w-[80vw]'>
                        <Content className='!w-[80%]'>
                            <Title level={3} className='!font-normal !mb-0'>
                                {storeName}
                            </Title>
                        </Content>
                        <Content className='!w-[20%] flex !gap-2'>
                            <Text>{t('labels:status')} : </Text>

                            <Status
                                storeId={id}
                                storeStatus={changeSwitchStatus === 1 ? true : false}
                                storeApiData={storeData}
                                setStoreApiData={setStoreData}
                                className='!inline-block '
                                disableStatus={disableStatus}
                                statusInprogress={duplicateStoreStatus}
                                setDuplicateStoreStatus={setDuplicateStoreStatus}
                                setPreviousStatus={setPreviousStatus}
                            />
                        </Content>
                    </Content>
                }
                backNavigationPath={`/dashboard/store?m_t=1`}
                showArrowIcon={true}
                showButtons={false}
            />
            <Content className='p-3 mt-[6.2rem]'>
                {disableMediaButton ? (
                    ''
                ) : (
                    <Spin tip='Please wait!' size='large' spinning={isUpLoading}>
                        <Content className='bg-white p-3 !rounded-md'>
                            <label className='text-[20px] mb-2 font-bold'>{t('labels:media')}</label>
                            <Row class='flex space-x-4'>
                                <Col>
                                    <StoreImages
                                        title={`${t('labels:store_logo')}`}
                                        type={'store_logo'}
                                        storeId={id}
                                        imagesUpload={imagesUpload}
                                        setImagesUpload={setImagesUpload}
                                        getImageData={getImageData && getImageData[0]}
                                        isSingleUpload={true}
                                        validStoreLogo={validStoreLogo}
                                        setValidStoreLogo={setValidStoreLogo}
                                        InfoCircleText={`${t('messages:store_logo_info')}`}
                                        setImageChangeValues={setImageChangeValues}
                                        disabelMediaButton={disableMediaButton}
                                    />
                                </Col>
                            </Row>
                            <StoreImages
                                title={`${t('labels:banner_logo')}`}
                                type={'banner_images'}
                                storeId={id}
                                imagesUpload={imagesUpload}
                                bannerAbsoluteImage={bannerAbsoluteImage}
                                setImagesUpload={setImagesUpload}
                                isSingleUpload={false}
                                InfoCircleText={`${t('messages:banner_logo_info')}`}
                                setImageChangeValues={setImageChangeValues}
                                disabelMediaButton={disableMediaButton}
                            />
                            <Content className='mt-4'>
                                <Row className='gap-2'>
                                    <Col>
                                        <Button
                                            className={'app-btn-primary'}
                                            disabled={imagesUpload && imagesUpload.length > 0 ? false : true}
                                            onClick={() => {
                                                if (imagesUpload && imagesUpload.length > 0) {
                                                    postImageOnClickSave()
                                                } else {
                                                    toast(`${t('messages:no_changes_were_detected')}`, {
                                                        position: toast.POSITION.TOP_RIGHT,
                                                        type: 'info',
                                                        autoClose: 10000,
                                                    })
                                                    MarketplaceToaster.showToast(
                                                        util.getToastObject(
                                                            `${t('messages:no_changes_were_detected')}`,
                                                            'info'
                                                        )
                                                    )
                                                }
                                            }}>
                                            {t('labels:save')}
                                        </Button>
                                    </Col>
                                    <Col className=''>
                                        <Button
                                            className={'app-btn-secondary'}
                                            disabled={imagesUpload && imagesUpload.length > 0 ? false : true}
                                            onClick={() => {
                                                navigate('/dashboard/store?m_t=1')
                                            }}>
                                            {t('labels:discard')}
                                        </Button>
                                    </Col>
                                </Row>
                            </Content>
                        </Content>
                    </Spin>
                )}
                {isStoreLimitDataLoading ? (
                    <Content className='bg-white p-3 !rounded-md mt-[2.0rem]'>
                        <Skeleton
                            active
                            paragraph={{
                                rows: 6,
                            }}></Skeleton>
                    </Content>
                ) : (
                    <Spin tip='Please wait!' size='large' spinning={isStoreDataLimitSaving}>
                        <Content className='bg-white !rounded-md'>
                            <Content className='p-3'>
                                <label className='text-[20px] mb-2 font-bold'>{t('labels:thershold_limit')}</label>
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
                                                className={
                                                    isStoreDataLimitChanged ? 'app-btn-secondary' : '!opacity-75'
                                                }
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
                {hideActionButton ? (
                    ''
                ) : (
                    <>
                        <Spin tip='Please wait!' size='large' spinning={isCurrencyLoading}>
                            <Content className='bg-white mt-3 p-3 rounded-lg'>
                                <label className='text-[20px] font-bold !text-center mb-4'>
                                    {t('labels:currency')}
                                </label>
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
                                            value={
                                                currencyData && currencyData.length > 0 && currencyData[0].currency_name
                                            }
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
                                            <p className='!text-gray-500 my-3 flex'>
                                                {t('labels:currency_code')} <span className='ml-11'>:</span>
                                            </p>
                                            <p className='!text-gray-500 my-3 flex'>
                                                {t('labels:unit_conversation')}
                                                <span className='ml-6'>:</span>
                                            </p>
                                            <p className='!text-gray-500 my-3 flex'>
                                                {t('labels:unit_price_name')}
                                                <span className='ml-9'>:</span>
                                            </p>
                                            <p className='!text-gray-500 my-3 flex'>
                                                {t('labels:min_amount')}
                                                <span className='ml-[60px]'>:</span>
                                            </p>
                                            <p className='!text-gray-500 my-3 flex'>
                                                {t('labels:currency_symbol')}
                                                <span className='ml-8'>:</span>
                                            </p>
                                            <p className='!text-gray-500 my-3 flex'>
                                                {t('labels:no_of_decimals')}
                                                <span className='ml-10'>:</span>
                                            </p>
                                        </div>
                                        <div className='w-[50%] !inline-block ml-8'>
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
                        <Spin tip='Please wait!' size='large' spinning={isLoading}>
                            <Content className='bg-white mt-3 p-3 rounded-lg'>
                                <Content className=''>
                                    <Row className='!mb-4'>
                                        <Content className='flex justify-between w-full'>
                                            <label className='text-[20px]  mt-2 font-bold select-none'>
                                                {t('labels:page_theme')}
                                            </label>
                                            <div className='flex gap-3'>
                                                <Button
                                                    className='app-btn-secondary !text-end'
                                                    onClick={() => setResetModalOpen(true)}>
                                                    {t('labels:reset')}
                                                </Button>
                                                <Button
                                                    className='app-btn-secondary flex justify-center items-center'
                                                    onClick={() => openModal()}>
                                                    <EyeOutlined className='' /> {t('labels:preview')}
                                                </Button>
                                            </div>
                                        </Content>
                                        <StoreModal
                                            isVisible={isModalOpen}
                                            title={`${t('labels:sample_preview_page_for_store_front')}`}
                                            width={1000}
                                            cancelCallback={() => closeModal()}
                                            isSpin={false}
                                            className='!h-96'>
                                            <Preview
                                                headerBackgroundColor={headerBackgroundColor}
                                                headerForegroundColor={headerForegroundColor}
                                                footerBackgroundColor={footerBackgroundColor}
                                                footerForegroundColor={footerForegroundColor}
                                                pageBackgroundColor={pageBackgroundColor}
                                                foreGroundColor={foreGroundColor}
                                                buttonPrimaryBackgroundColor={buttonPrimaryBackgroundColor}
                                                buttonSecondaryBackgroundColor={buttonSecondaryBackgroundColor}
                                                buttonTeritaryBackgroundColor={buttonTeritaryBackgroundColor}
                                                buttonPrimaryForegroundColor={buttonPrimaryForegroundColor}
                                                buttonSecondaryForegroundColor={buttonSecondaryForegroundColor}
                                                buttonTeritaryForegroundColor={buttonTeritaryForegroundColor}
                                                getImageData={getImageData}
                                            />
                                        </StoreModal>
                                    </Row>
                                    <Divider className='!my-4' />
                                    <Row className='mt-2'>
                                        <Col span={8} className='mr-2 '>
                                            <label className='text-[13px] mb-2 ml-1 select-none input-label-color'>
                                                {t('labels:background_color')}
                                            </label>
                                            <Content className='flex gap-2'>
                                                <Input
                                                    type='color'
                                                    value={pageBackgroundColor}
                                                    onChange={(e) => {
                                                        const patternName = /^#([A-Fa-f0-9]{6})$/
                                                        if (patternName.test(e.target.value) === false) {
                                                            let temp = { ...colorCodeValidation }
                                                            temp['pageBgColorValidation'] = true
                                                            setColorCodeValidation(temp)
                                                            setPageBackgroundColor(e.target.value)
                                                            setOnChangeValues(true)
                                                        } else {
                                                            let temp = { ...colorCodeValidation }
                                                            temp['pageBgColorValidation'] = false
                                                            setColorCodeValidation(temp)
                                                            setPageBackgroundColor(e.target.value)
                                                            setOnChangeValues(true)
                                                        }
                                                        let temp = { ...copyImageOfStoreSettingsPageTheme }
                                                        temp['bg_color'] = e.target.value
                                                        setCopyImageOfStoreSettingsPageTheme(temp)
                                                    }}
                                                    className='w-9 p-0'
                                                />
                                                <Space.Compact className=''>
                                                    <Input
                                                        value={pageBackgroundColor}
                                                        maxLength={7}
                                                        className='w-[150px]'
                                                        onChange={(e) => {
                                                            const inputValue = e.target.value
                                                            // Allow only numeric input
                                                            const numericValue = inputValue
                                                                .replace(/[^a-f0-9#]/gi, '')
                                                                .substring(0, 7)
                                                            setPageBackgroundColor(numericValue)
                                                            const patternName = /^#([A-Fa-f0-9]{6})$/
                                                            if (patternName.test(numericValue) === false) {
                                                                let temp = { ...colorCodeValidation }
                                                                temp['pageBgColorValidation'] = true
                                                                setColorCodeValidation(temp)
                                                                setPageBackgroundColor(numericValue)
                                                                setOnChangeValues(true)
                                                            } else {
                                                                let temp = { ...colorCodeValidation }
                                                                temp['pageBgColorValidation'] = false
                                                                setColorCodeValidation(temp)
                                                                setPageBackgroundColor(numericValue)
                                                                setOnChangeValues(true)
                                                            }
                                                            let temp = {
                                                                ...copyImageOfStoreSettingsPageTheme,
                                                            }
                                                            temp['bg_color'] = numericValue
                                                            setCopyImageOfStoreSettingsPageTheme(temp)
                                                        }}
                                                        addonAfter={
                                                            <Tooltip title={t('messages:reset_to_the_original_value')}>
                                                                <UndoOutlined
                                                                    onClick={() => {
                                                                        setPageBackgroundColor(pageBgColor)
                                                                        let temp = { ...colorCodeValidation }
                                                                        temp['pageBgColorValidation'] = false
                                                                        setColorCodeValidation(temp)
                                                                    }}
                                                                />
                                                            </Tooltip>
                                                        }
                                                    />
                                                </Space.Compact>
                                            </Content>
                                            {colorCodeValidation.pageBgColorValidation === true ? (
                                                <p className='text-red-600 text-sm'>
                                                    {t('messages:please_enter_valid_hexadecimal_code')} <br />
                                                    {t('messages:ex_ffffff_for_white_000000_for_black')}
                                                </p>
                                            ) : null}
                                        </Col>
                                        <Col span={8} className='ml-1'>
                                            <label className='text-[13px] mb-2 ml-1 select-none input-label-color'>
                                                {t('labels:text_color')}
                                            </label>
                                            <Content className='flex gap-2'>
                                                <Input
                                                    type='color'
                                                    value={foreGroundColor}
                                                    onChange={(e) => {
                                                        const patternName = /^#([A-Fa-f0-9]{6})$/
                                                        if (patternName.test(e.target.value) === false) {
                                                            let temp = { ...colorCodeValidation }
                                                            temp['pageTextColorValidation'] = true
                                                            setColorCodeValidation(temp)
                                                            setForeGroundColor(e.target.value)
                                                            setOnChangeValues(true)
                                                        } else {
                                                            let temp = { ...colorCodeValidation }
                                                            temp['pageTextColorValidation'] = false
                                                            setColorCodeValidation(temp)
                                                            setForeGroundColor(e.target.value)
                                                            setOnChangeValues(true)
                                                        }
                                                        let temp = { ...copyImageOfStoreSettingsPageTheme }
                                                        temp['fg_color'] = e.target.value
                                                        setCopyImageOfStoreSettingsPageTheme(temp)
                                                    }}
                                                    className='w-9 p-0'
                                                />
                                                <Space.Compact className=''>
                                                    <Input
                                                        value={foreGroundColor}
                                                        maxLength={7}
                                                        className='w-[150px]'
                                                        onChange={(e) => {
                                                            const inputValue = e.target.value
                                                            // Allow only numeric input
                                                            const numericValue = inputValue
                                                                .replace(/[^a-f0-9#]/gi, '')
                                                                .substring(0, 7)
                                                            setForeGroundColor(numericValue)
                                                            const patternName = /^#([A-Fa-f0-9]{6})$/
                                                            if (patternName.test(numericValue) === false) {
                                                                let temp = { ...colorCodeValidation }
                                                                temp['pageTextColorValidation'] = true
                                                                setColorCodeValidation(temp)
                                                                setForeGroundColor(numericValue)
                                                                setOnChangeValues(true)
                                                            } else {
                                                                let temp = { ...colorCodeValidation }
                                                                temp['pageTextColorValidation'] = false
                                                                setColorCodeValidation(temp)
                                                                setForeGroundColor(numericValue)
                                                                setOnChangeValues(true)
                                                            }
                                                            let temp = {
                                                                ...copyImageOfStoreSettingsPageTheme,
                                                            }
                                                            temp['fg_color'] = numericValue
                                                            setCopyImageOfStoreSettingsPageTheme(temp)
                                                        }}
                                                        addonAfter={
                                                            <Tooltip title={t('messages:reset_to_the_original_value')}>
                                                                <UndoOutlined
                                                                    onClick={() => {
                                                                        let temp = { ...colorCodeValidation }
                                                                        temp['pageTextColorValidation'] = false
                                                                        setColorCodeValidation(temp)
                                                                        setForeGroundColor(pageFgColor)
                                                                    }}
                                                                />
                                                            </Tooltip>
                                                        }
                                                    />
                                                </Space.Compact>
                                            </Content>
                                            {colorCodeValidation.pageTextColorValidation === true ? (
                                                <p className='text-red-600 text-sm'>
                                                    {t('messages:please_enter_valid_hexadecimal_code')} <br />
                                                    {t('messages:ex_ffffff_for_white_000000_for_black')}
                                                </p>
                                            ) : null}
                                        </Col>
                                    </Row>
                                    <Row className='mt-4'>
                                        <Col span={8} className='mr-2 '>
                                            <label className='text-[13px] mb-2 ml-1 select-none input-label-color'>
                                                {t('labels:primary_button_background_color')}
                                            </label>
                                            <Content className='flex gap-2'>
                                                <Input
                                                    type='color'
                                                    className='w-9 p-0'
                                                    value={buttonPrimaryBackgroundColor}
                                                    onChange={(e) => {
                                                        const patternName = /^#([A-Fa-f0-9]{6})$/
                                                        if (patternName.test(e.target.value) === false) {
                                                            let temp = { ...colorCodeValidation }
                                                            temp['primaryBgValidation'] = true
                                                            setColorCodeValidation(temp)
                                                            setButtonPrimaryBackgroundColor(e.target.value)
                                                            setOnChangeValues(true)
                                                        } else {
                                                            let temp = { ...colorCodeValidation }
                                                            temp['primaryBgValidation'] = false
                                                            setColorCodeValidation(temp)
                                                            setButtonPrimaryBackgroundColor(e.target.value)
                                                            setOnChangeValues(true)
                                                        }
                                                        let temp = { ...copyImageOfStoreSettingsPageTheme }
                                                        temp['btn_primary_bg_color'] = e.target.value
                                                        setCopyImageOfStoreSettingsPageTheme(temp)
                                                    }}
                                                />
                                                <Space.Compact className=''>
                                                    <Input
                                                        value={buttonPrimaryBackgroundColor}
                                                        maxLength={7}
                                                        className='w-[150px]'
                                                        onChange={(e) => {
                                                            const inputValue = e.target.value
                                                            // Allow only numeric input
                                                            const numericValue = inputValue
                                                                .replace(/[^a-f0-9#]/gi, '')
                                                                .substring(0, 7)
                                                            setButtonPrimaryBackgroundColor(numericValue)
                                                            const patternName = /^#([A-Fa-f0-9]{6})$/
                                                            if (patternName.test(numericValue) === false) {
                                                                let temp = { ...colorCodeValidation }
                                                                temp['primaryBgValidation'] = true
                                                                setColorCodeValidation(temp)
                                                                setButtonPrimaryBackgroundColor(numericValue)
                                                                setOnChangeValues(true)
                                                            } else {
                                                                let temp = { ...colorCodeValidation }
                                                                temp['primaryBgValidation'] = false
                                                                setColorCodeValidation(temp)
                                                                setButtonPrimaryBackgroundColor(numericValue)
                                                                setOnChangeValues(true)
                                                            }
                                                            let temp = {
                                                                ...copyImageOfStoreSettingsPageTheme,
                                                            }
                                                            temp['btn_primary_bg_color'] = numericValue
                                                            setCopyImageOfStoreSettingsPageTheme(temp)
                                                        }}
                                                        addonAfter={
                                                            <Tooltip title={t('messages:reset_to_the_original_value')}>
                                                                <UndoOutlined
                                                                    onClick={() => {
                                                                        setButtonPrimaryBackgroundColor(
                                                                            btnPrimaryBgColor
                                                                        )
                                                                        let temp = { ...colorCodeValidation }
                                                                        temp['primaryBgValidation'] = false
                                                                        setColorCodeValidation(temp)
                                                                    }}
                                                                />
                                                            </Tooltip>
                                                        }
                                                    />
                                                </Space.Compact>
                                            </Content>
                                            {colorCodeValidation.primaryBgValidation === true ? (
                                                <p className='text-red-600 text-sm'>
                                                    {t('messages:please_enter_valid_hexadecimal_code')} <br />
                                                    {t('messages:ex_ffffff_for_white_000000_for_black')}
                                                </p>
                                            ) : null}
                                        </Col>
                                        <Col span={8} className='ml-1'>
                                            <label className='text-[13px] mb-2 ml-1 select-none input-label-color'>
                                                {t('labels:secondary_button_background_color')}
                                            </label>
                                            <Content className='flex gap-2'>
                                                <Input
                                                    type='color'
                                                    className='w-9 p-0'
                                                    value={buttonSecondaryBackgroundColor}
                                                    onChange={(e) => {
                                                        const patternName = /^#([A-Fa-f0-9]{6})$/
                                                        if (patternName.test(e.target.value) === false) {
                                                            let temp = { ...colorCodeValidation }
                                                            temp['secondaryBgValidation'] = true
                                                            setColorCodeValidation(temp)
                                                            setButtonSecondaryBackgroundColor(e.target.value)
                                                            setOnChangeValues(true)
                                                        } else {
                                                            let temp = { ...colorCodeValidation }
                                                            temp['secondaryBgValidation'] = false
                                                            setColorCodeValidation(temp)
                                                            setButtonSecondaryBackgroundColor(e.target.value)
                                                            setOnChangeValues(true)
                                                        }
                                                        let temp = { ...copyImageOfStoreSettingsPageTheme }
                                                        temp['btn_secondary_bg_color'] = e.target.value
                                                        setCopyImageOfStoreSettingsPageTheme(temp)
                                                    }}
                                                />
                                                <Space.Compact className=''>
                                                    <Input
                                                        value={buttonSecondaryBackgroundColor}
                                                        className='w-[150px]'
                                                        maxLength={7}
                                                        onChange={(e) => {
                                                            const inputValue = e.target.value
                                                            // Allow only numeric input
                                                            const numericValue = inputValue
                                                                .replace(/[^a-f0-9#]/gi, '')
                                                                .substring(0, 7)
                                                            setButtonSecondaryBackgroundColor(numericValue)
                                                            const patternName = /^#([A-Fa-f0-9]{6})$/
                                                            if (patternName.test(numericValue) === false) {
                                                                let temp = { ...colorCodeValidation }
                                                                temp['secondaryBgValidation'] = true
                                                                setColorCodeValidation(temp)
                                                                setButtonSecondaryBackgroundColor(numericValue)
                                                                setOnChangeValues(true)
                                                            } else {
                                                                let temp = { ...colorCodeValidation }
                                                                temp['secondaryBgValidation'] = false
                                                                setColorCodeValidation(temp)
                                                                setButtonSecondaryBackgroundColor(numericValue)
                                                                setOnChangeValues(true)
                                                            }
                                                            let temp = {
                                                                ...copyImageOfStoreSettingsPageTheme,
                                                            }
                                                            temp['btn_secondary_bg_color'] = numericValue
                                                            setCopyImageOfStoreSettingsPageTheme(temp)
                                                        }}
                                                        addonAfter={
                                                            <Tooltip title={t('messages:reset_to_the_original_value')}>
                                                                <UndoOutlined
                                                                    onClick={() => {
                                                                        setButtonSecondaryBackgroundColor(
                                                                            btnSecondaryBgColor
                                                                        )
                                                                        let temp = { ...colorCodeValidation }
                                                                        temp['secondaryBgValidation'] = false
                                                                        setColorCodeValidation(temp)
                                                                    }}
                                                                />
                                                            </Tooltip>
                                                        }
                                                    />
                                                </Space.Compact>
                                            </Content>
                                            {colorCodeValidation.secondaryBgValidation === true ? (
                                                <p className='text-red-600 text-sm'>
                                                    {t('messages:please_enter_valid_hexadecimal_code')} <br />
                                                    {t('messages:ex_ffffff_for_white_000000_for_black')}
                                                </p>
                                            ) : null}
                                        </Col>
                                        <Col span={7} className='ml-2'>
                                            <label className='text-[13px] mb-2 ml-1 select-none input-label-color'>
                                                {t('labels:tertiary_button_background_color')}
                                            </label>
                                            <Content className='flex gap-2'>
                                                <Input
                                                    type='color'
                                                    className='w-9 p-0'
                                                    value={buttonTeritaryBackgroundColor}
                                                    onChange={(e) => {
                                                        const patternName = /^#([A-Fa-f0-9]{6})$/
                                                        if (patternName.test(e.target.value) === false) {
                                                            let temp = { ...colorCodeValidation }
                                                            temp['tertiaryBgValidation'] = true
                                                            setColorCodeValidation(temp)
                                                            setButtonTeritaryBackgroundColor(e.target.value)
                                                            setOnChangeValues(true)
                                                        } else {
                                                            let temp = { ...colorCodeValidation }
                                                            temp['tertiaryBgValidation'] = false
                                                            setColorCodeValidation(temp)
                                                            setButtonTeritaryBackgroundColor(e.target.value)
                                                            setOnChangeValues(true)
                                                        }
                                                        let temp = { ...copyImageOfStoreSettingsPageTheme }
                                                        temp['btn_tertiary_bg_color'] = e.target.value
                                                        setCopyImageOfStoreSettingsPageTheme(temp)
                                                    }}
                                                />
                                                <Space.Compact className=''>
                                                    <Input
                                                        value={buttonTeritaryBackgroundColor}
                                                        className='w-[150px]'
                                                        maxLength={7}
                                                        onChange={(e) => {
                                                            const inputValue = e.target.value
                                                            // Allow only numeric input
                                                            const numericValue = inputValue
                                                                .replace(/[^a-f0-9#]/gi, '')
                                                                .substring(0, 7)
                                                            setButtonTeritaryBackgroundColor(numericValue)
                                                            const patternName = /^#([A-Fa-f0-9]{6})$/
                                                            if (patternName.test(numericValue) === false) {
                                                                let temp = { ...colorCodeValidation }
                                                                temp['tertiaryBgValidation'] = true
                                                                setColorCodeValidation(temp)
                                                                setButtonTeritaryBackgroundColor(numericValue)
                                                                setOnChangeValues(true)
                                                            } else {
                                                                let temp = { ...colorCodeValidation }
                                                                temp['tertiaryBgValidation'] = false
                                                                setColorCodeValidation(temp)
                                                                setButtonTeritaryBackgroundColor(numericValue)
                                                                setOnChangeValues(true)
                                                            }
                                                            let temp = {
                                                                ...copyImageOfStoreSettingsPageTheme,
                                                            }
                                                            temp['btn_tertiary_bg_color'] = numericValue
                                                            setCopyImageOfStoreSettingsPageTheme(temp)
                                                        }}
                                                        addonAfter={
                                                            <Tooltip title={t('messages:reset_to_the_original_value')}>
                                                                <UndoOutlined
                                                                    onClick={() => {
                                                                        setButtonTeritaryBackgroundColor(
                                                                            btnTeritaryBgColor
                                                                        )
                                                                        let temp = { ...colorCodeValidation }
                                                                        temp['tertiaryBgValidation'] = false
                                                                        setColorCodeValidation(temp)
                                                                    }}
                                                                />
                                                            </Tooltip>
                                                        }
                                                    />
                                                </Space.Compact>
                                            </Content>
                                            {colorCodeValidation.tertiaryBgValidation === true ? (
                                                <p className='text-red-600 text-sm'>
                                                    {t('messages:please_enter_valid_hexadecimal_code')} <br />
                                                    {t('messages:ex_ffffff_for_white_000000_for_black')}
                                                </p>
                                            ) : null}
                                        </Col>
                                    </Row>
                                    <Row className='mt-4'>
                                        <Col span={8} className='mr-2 '>
                                            <label className='text-[13px] mb-2 ml-1 select-none input-label-color'>
                                                {t('labels:primary_button_text_color')}
                                            </label>
                                            <Content className='flex gap-2'>
                                                <Input
                                                    type='color'
                                                    className='w-9 p-0'
                                                    value={buttonPrimaryForegroundColor}
                                                    onChange={(e) => {
                                                        const patternName = /^#([A-Fa-f0-9]{6})$/
                                                        if (patternName.test(e.target.value) === false) {
                                                            let temp = { ...colorCodeValidation }
                                                            temp['primaryTextValidation'] = true
                                                            setColorCodeValidation(temp)
                                                            setButtonPrimaryForegroundColor(e.target.value)
                                                            setOnChangeValues(true)
                                                        } else {
                                                            let temp = { ...colorCodeValidation }
                                                            temp['primaryTextValidation'] = false
                                                            setColorCodeValidation(temp)
                                                            setButtonPrimaryForegroundColor(e.target.value)
                                                            setOnChangeValues(true)
                                                        }
                                                        let temp = { ...copyImageOfStoreSettingsPageTheme }
                                                        temp['btn_primary_fg_color'] = e.target.value
                                                        setCopyImageOfStoreSettingsPageTheme(temp)
                                                    }}
                                                />
                                                <Space.Compact className=''>
                                                    <Input
                                                        value={buttonPrimaryForegroundColor}
                                                        maxLength={7}
                                                        className='w-[150px]'
                                                        onChange={(e) => {
                                                            const inputValue = e.target.value
                                                            // Allow only numeric input
                                                            const numericValue = inputValue
                                                                .replace(/[^a-f0-9#]/gi, '')
                                                                .substring(0, 7)
                                                            setButtonPrimaryForegroundColor(numericValue)
                                                            const patternName = /^#([A-Fa-f0-9]{6})$/
                                                            if (patternName.test(numericValue) === false) {
                                                                let temp = { ...colorCodeValidation }
                                                                temp['primaryTextValidation'] = true
                                                                setColorCodeValidation(temp)
                                                                setButtonPrimaryForegroundColor(numericValue)
                                                                setOnChangeValues(true)
                                                            } else {
                                                                let temp = { ...colorCodeValidation }
                                                                temp['primaryTextValidation'] = false
                                                                setColorCodeValidation(temp)
                                                                setButtonPrimaryForegroundColor(numericValue)
                                                                setOnChangeValues(true)
                                                            }
                                                            let temp = {
                                                                ...copyImageOfStoreSettingsPageTheme,
                                                            }
                                                            temp['btn_primary_fg_color'] = numericValue
                                                            setCopyImageOfStoreSettingsPageTheme(temp)
                                                        }}
                                                        addonAfter={
                                                            <Tooltip title={t('messages:reset_to_the_original_value')}>
                                                                <UndoOutlined
                                                                    onClick={() => {
                                                                        setButtonPrimaryForegroundColor(
                                                                            btnPrimaryFgColor
                                                                        )
                                                                        let temp = { ...colorCodeValidation }
                                                                        temp['primaryTextValidation'] = false
                                                                        setColorCodeValidation(temp)
                                                                    }}
                                                                />
                                                            </Tooltip>
                                                        }
                                                    />
                                                </Space.Compact>
                                            </Content>
                                            {colorCodeValidation.primaryTextValidation === true ? (
                                                <p className='text-red-600 text-sm'>
                                                    {t('messages:please_enter_valid_hexadecimal_code')} <br />
                                                    {t('messages:ex_ffffff_for_white_000000_for_black')}
                                                </p>
                                            ) : null}
                                        </Col>
                                        <Col span={8} className='ml-1'>
                                            <label className='text-[13px] mb-2 ml-1 select-none input-label-color'>
                                                {t('labels:secondary_button_text_color')}
                                            </label>
                                            <Content className='flex gap-2'>
                                                <Input
                                                    type='color'
                                                    className='w-9 p-0'
                                                    value={buttonSecondaryForegroundColor}
                                                    onChange={(e) => {
                                                        const patternName = /^#([A-Fa-f0-9]{6})$/
                                                        if (patternName.test(e.target.value) === false) {
                                                            let temp = { ...colorCodeValidation }
                                                            temp['secondaryTextValidation'] = true
                                                            setColorCodeValidation(temp)
                                                            setButtonSecondaryForegroundColor(e.target.value)
                                                            setOnChangeValues(true)
                                                        } else {
                                                            let temp = { ...colorCodeValidation }
                                                            temp['secondaryTextValidation'] = false
                                                            setColorCodeValidation(temp)
                                                            setButtonSecondaryForegroundColor(e.target.value)
                                                            setOnChangeValues(true)
                                                        }
                                                        let temp = { ...copyImageOfStoreSettingsPageTheme }
                                                        temp['btn_secondary_fg_color'] = e.target.value
                                                        setCopyImageOfStoreSettingsPageTheme(temp)
                                                    }}
                                                />
                                                <Space.Compact className=''>
                                                    <Input
                                                        value={buttonSecondaryForegroundColor}
                                                        maxLength={7}
                                                        className='w-[150px]'
                                                        onChange={(e) => {
                                                            const inputValue = e.target.value
                                                            // Allow only numeric input
                                                            const numericValue = inputValue
                                                                .replace(/[^a-f0-9#]/gi, '')
                                                                .substring(0, 7)
                                                            setButtonSecondaryForegroundColor(numericValue)
                                                            const patternName = /^#([A-Fa-f0-9]{6})$/
                                                            if (patternName.test(numericValue) === false) {
                                                                let temp = { ...colorCodeValidation }
                                                                temp['secondaryTextValidation'] = true
                                                                setColorCodeValidation(temp)
                                                                setButtonSecondaryForegroundColor(numericValue)
                                                                setOnChangeValues(true)
                                                            } else {
                                                                let temp = { ...colorCodeValidation }
                                                                temp['secondaryTextValidation'] = false
                                                                setColorCodeValidation(temp)
                                                                setButtonSecondaryForegroundColor(numericValue)
                                                                setOnChangeValues(true)
                                                            }
                                                            let temp = {
                                                                ...copyImageOfStoreSettingsPageTheme,
                                                            }
                                                            temp['btn_secondary_fg_color'] = numericValue
                                                            setCopyImageOfStoreSettingsPageTheme(temp)
                                                        }}
                                                        addonAfter={
                                                            <Tooltip title={t('messages:reset_to_the_original_value')}>
                                                                <UndoOutlined
                                                                    onClick={() => {
                                                                        setButtonSecondaryForegroundColor(
                                                                            btnSecondaryFgColor
                                                                        )
                                                                        let temp = { ...colorCodeValidation }
                                                                        temp['secondaryTextValidation'] = false
                                                                        setColorCodeValidation(temp)
                                                                    }}
                                                                />
                                                            </Tooltip>
                                                        }
                                                    />
                                                </Space.Compact>
                                            </Content>
                                            {colorCodeValidation.secondaryTextValidation === true ? (
                                                <p className='text-red-600 text-sm'>
                                                    {t('messages:please_enter_valid_hexadecimal_code')} <br />
                                                    {t('messages:ex_ffffff_for_white_000000_for_black')}
                                                </p>
                                            ) : null}
                                        </Col>
                                        <Col span={7} className='ml-2'>
                                            <label className='text-[13px] mb-2 ml-1 select-none input-label-color'>
                                                {t('labels:tertiary_button_text_color')}
                                            </label>
                                            <Content className='flex gap-2'>
                                                <Input
                                                    type='color'
                                                    className='w-9 p-0'
                                                    value={buttonTeritaryForegroundColor}
                                                    onChange={(e) => {
                                                        const patternName = /^#([A-Fa-f0-9]{6})$/
                                                        if (patternName.test(e.target.value) === false) {
                                                            let temp = { ...colorCodeValidation }
                                                            temp['tertiaryTextValidation'] = true
                                                            setColorCodeValidation(temp)
                                                            setButtonTeritaryForegroundColor(e.target.value)
                                                            setOnChangeValues(true)
                                                        } else {
                                                            let temp = { ...colorCodeValidation }
                                                            temp['tertiaryTextValidation'] = false
                                                            setColorCodeValidation(temp)
                                                            setButtonTeritaryForegroundColor(e.target.value)
                                                            setOnChangeValues(true)
                                                        }
                                                        let temp = { ...copyImageOfStoreSettingsPageTheme }
                                                        temp['btn_tertiary_fg_color'] = e.target.value
                                                        setCopyImageOfStoreSettingsPageTheme(temp)
                                                    }}
                                                />
                                                <Space.Compact className=''>
                                                    <Input
                                                        value={buttonTeritaryForegroundColor}
                                                        maxLength={7}
                                                        className='w-[150px]'
                                                        onChange={(e) => {
                                                            const inputValue = e.target.value
                                                            // Allow only numeric input
                                                            const numericValue = inputValue
                                                                .replace(/[^a-f0-9#]/gi, '')
                                                                .substring(0, 7)
                                                            setButtonTeritaryForegroundColor(numericValue)
                                                            const patternName = /^#([A-Fa-f0-9]{6})$/
                                                            if (patternName.test(numericValue) === false) {
                                                                let temp = { ...colorCodeValidation }
                                                                temp['tertiaryTextValidation'] = true
                                                                setColorCodeValidation(temp)
                                                                setButtonTeritaryForegroundColor(numericValue)
                                                                setOnChangeValues(true)
                                                            } else {
                                                                let temp = { ...colorCodeValidation }
                                                                temp['tertiaryTextValidation'] = false
                                                                setColorCodeValidation(temp)
                                                                setButtonTeritaryForegroundColor(numericValue)
                                                                setOnChangeValues(true)
                                                            }
                                                            let temp = {
                                                                ...copyImageOfStoreSettingsPageTheme,
                                                            }
                                                            temp['btn_tertiary_fg_color'] = numericValue
                                                            setCopyImageOfStoreSettingsPageTheme(temp)
                                                        }}
                                                        addonAfter={
                                                            <Tooltip title={t('messages:reset_to_the_original_value')}>
                                                                <UndoOutlined
                                                                    onClick={() => {
                                                                        setButtonTeritaryForegroundColor(
                                                                            btnTeritaryFgColor
                                                                        )
                                                                        let temp = { ...colorCodeValidation }
                                                                        temp['tertiaryTextValidation'] = false
                                                                        setColorCodeValidation(temp)
                                                                    }}
                                                                />
                                                            </Tooltip>
                                                        }
                                                    />
                                                </Space.Compact>
                                            </Content>
                                            {colorCodeValidation.tertiaryTextValidation === true ? (
                                                <p className='text-red-600 text-sm'>
                                                    {t('messages:please_enter_valid_hexadecimal_code')} <br />
                                                    {t('messages:ex_ffffff_for_white_000000_for_black')}
                                                </p>
                                            ) : null}
                                        </Col>
                                    </Row>
                                </Content>
                                <Content>
                                    <label className='text-[20px] mb-2 mt-4 font-bold select-none'>
                                        {t('labels:store_header_setting')}
                                    </label>
                                    <Row className='mt-2'>
                                        <Col span={8} className='mr-2 '>
                                            <label className='text-[13px] mb-2 ml-1 select-none input-label-color'>
                                                {t('labels:background_color')}
                                            </label>
                                            <Content className='flex gap-2'>
                                                <Input
                                                    type='color'
                                                    className='w-9 p-0'
                                                    value={headerBackgroundColor}
                                                    onChange={(e) => {
                                                        const patternName = /^#([A-Fa-f0-9]{6})$/
                                                        if (patternName.test(e.target.value) === false) {
                                                            let temp = { ...colorCodeValidation }
                                                            temp['headerBgValidation'] = true
                                                            setColorCodeValidation(temp)
                                                            setHeaderBackgroundColor(e.target.value)
                                                            setOnChangeValues(true)
                                                        } else {
                                                            let temp = { ...colorCodeValidation }
                                                            temp['headerBgValidation'] = false
                                                            setColorCodeValidation(temp)
                                                            setHeaderBackgroundColor(e.target.value)
                                                            setOnChangeValues(true)
                                                        }
                                                        let temp = { ...copyImageOfStoreHeaderSetting }
                                                        temp['bg_color'] = e.target.value
                                                        setCopyImageOfStoreHeaderSetting(temp)
                                                    }}
                                                />
                                                <Space.Compact className=''>
                                                    <Input
                                                        value={headerBackgroundColor}
                                                        maxLength={7}
                                                        className='w-[150px]'
                                                        onChange={(e) => {
                                                            const inputValue = e.target.value
                                                            // Allow only numeric input
                                                            const numericValue = inputValue
                                                                .replace(/[^a-f0-9#]/gi, '')
                                                                .substring(0, 7)
                                                            setHeaderBackgroundColor(numericValue)
                                                            const patternName = /^#([A-Fa-f0-9]{6})$/
                                                            if (patternName.test(numericValue) === false) {
                                                                let temp = { ...colorCodeValidation }
                                                                temp['headerBgValidation'] = true
                                                                setColorCodeValidation(temp)
                                                                setHeaderBackgroundColor(numericValue)
                                                                setOnChangeValues(true)
                                                            } else {
                                                                let temp = { ...colorCodeValidation }
                                                                temp['headerBgValidation'] = false
                                                                setColorCodeValidation(temp)
                                                                setHeaderBackgroundColor(numericValue)
                                                                setOnChangeValues(true)
                                                            }
                                                            let temp = { ...copyImageOfStoreHeaderSetting }
                                                            temp['bg_color'] = numericValue
                                                            setCopyImageOfStoreHeaderSetting(temp)
                                                        }}
                                                        addonAfter={
                                                            <Tooltip title={t('messages:reset_to_the_original_value')}>
                                                                <UndoOutlined
                                                                    onClick={() => {
                                                                        setHeaderBackgroundColor(headerBgColor)
                                                                        let temp = { ...colorCodeValidation }
                                                                        temp['headerBgValidation'] = false
                                                                        setColorCodeValidation(temp)
                                                                    }}
                                                                />
                                                            </Tooltip>
                                                        }
                                                    />
                                                </Space.Compact>
                                            </Content>
                                            {colorCodeValidation.headerBgValidation === true ? (
                                                <p className='text-red-600 text-sm'>
                                                    {t('messages:please_enter_valid_hexadecimal_code')} <br />
                                                    {t('messages:ex_ffffff_for_white_000000_for_black')}
                                                </p>
                                            ) : null}
                                        </Col>
                                        <Col span={8} className='ml-1'>
                                            <label className='text-[13px] mb-2 ml-1 select-none input-label-color'>
                                                {' '}
                                                {t('labels:text_color')}
                                            </label>
                                            <Content className='flex gap-2'>
                                                <Input
                                                    type='color'
                                                    className='w-9 p-0'
                                                    value={headerForegroundColor}
                                                    onChange={(e) => {
                                                        const patternName = /^#([A-Fa-f0-9]{6})$/
                                                        if (patternName.test(e.target.value) === false) {
                                                            let temp = { ...colorCodeValidation }
                                                            temp['headerTextValidation'] = true
                                                            setColorCodeValidation(temp)
                                                            setHeaderForegroundColor(e.target.value)
                                                            setOnChangeValues(true)
                                                        } else {
                                                            let temp = { ...colorCodeValidation }
                                                            temp['headerTextValidation'] = false
                                                            setColorCodeValidation(temp)
                                                            setHeaderForegroundColor(e.target.value)
                                                            setOnChangeValues(true)
                                                        }
                                                        let temp = { ...copyImageOfStoreHeaderSetting }
                                                        temp['fg_color'] = e.target.value
                                                        setCopyImageOfStoreHeaderSetting(temp)
                                                    }}
                                                />
                                                <Space.Compact className=''>
                                                    <Input
                                                        value={headerForegroundColor}
                                                        className='w-[150px]'
                                                        maxLength={7}
                                                        onChange={(e) => {
                                                            const inputValue = e.target.value
                                                            // Allow only numeric input
                                                            const numericValue = inputValue
                                                                .replace(/[^a-f0-9#]/gi, '')
                                                                .substring(0, 7)
                                                            setHeaderForegroundColor(numericValue)
                                                            const patternName = /^#([A-Fa-f0-9]{6})$/
                                                            if (patternName.test(numericValue) === false) {
                                                                let temp = { ...colorCodeValidation }
                                                                temp['headerTextValidation'] = true
                                                                setColorCodeValidation(temp)
                                                                setHeaderForegroundColor(numericValue)
                                                                setOnChangeValues(true)
                                                            } else {
                                                                let temp = { ...colorCodeValidation }
                                                                temp['headerTextValidation'] = false
                                                                setColorCodeValidation(temp)
                                                                setHeaderForegroundColor(numericValue)
                                                                setOnChangeValues(true)
                                                            }
                                                            let temp = { ...copyImageOfStoreHeaderSetting }
                                                            temp['fg_color'] = numericValue
                                                            setCopyImageOfStoreHeaderSetting(temp)
                                                        }}
                                                        addonAfter={
                                                            <Tooltip title={t('messages:reset_to_the_original_value')}>
                                                                <UndoOutlined
                                                                    onClick={() => {
                                                                        setHeaderForegroundColor(headerFgColor)
                                                                        let temp = { ...colorCodeValidation }
                                                                        temp['headerTextValidation'] = false
                                                                        setColorCodeValidation(temp)
                                                                    }}
                                                                />
                                                            </Tooltip>
                                                        }
                                                    />
                                                </Space.Compact>
                                            </Content>
                                            {colorCodeValidation.headerTextValidation === true ? (
                                                <p className='text-red-600 text-sm'>
                                                    {t('messages:please_enter_valid_hexadecimal_code')} <br />
                                                    {t('messages:ex_ffffff_for_white_000000_for_black')}
                                                </p>
                                            ) : null}
                                        </Col>
                                    </Row>
                                </Content>
                                <Content>
                                    <label className='text-[20px] mb-2 mt-4 font-bold select-none'>
                                        {t('labels:store_footer_setting')}
                                    </label>
                                    <Row className='mt-2'>
                                        <Col span={8} className='mr-2 '>
                                            <label className='text-[13px] mb-2 ml-1 select-none input-label-color'>
                                                {t('labels:background_color')}
                                            </label>
                                            <Content className='flex gap-2'>
                                                <Input
                                                    type='color'
                                                    className='w-9 p-0'
                                                    value={footerBackgroundColor}
                                                    onChange={(e) => {
                                                        const patternName = /^#([A-Fa-f0-9]{6})$/
                                                        if (patternName.test(e.target.value) === false) {
                                                            let temp = { ...colorCodeValidation }
                                                            temp['footerBgValidation'] = true
                                                            setColorCodeValidation(temp)
                                                            setFooterBackgroundColor(e.target.value)
                                                            setOnChangeValues(true)
                                                        } else {
                                                            let temp = { ...colorCodeValidation }
                                                            temp['footerBgValidation'] = false
                                                            setColorCodeValidation(temp)
                                                            setFooterBackgroundColor(e.target.value)
                                                            setOnChangeValues(true)
                                                        }
                                                        let temp = { ...copyImageOfStoreFooterSetting }
                                                        temp['bg_color'] = e.target.value
                                                        setCopyImageOfStoreFooterSetting(temp)
                                                    }}
                                                />
                                                <Space.Compact className=''>
                                                    <Input
                                                        value={footerBackgroundColor}
                                                        className='w-[150px]'
                                                        maxLength={7}
                                                        onChange={(e) => {
                                                            const inputValue = e.target.value
                                                            // Allow only numeric input
                                                            const numericValue = inputValue
                                                                .replace(/[^a-f0-9#]/gi, '')
                                                                .substring(0, 7)
                                                            setFooterBackgroundColor(numericValue)
                                                            const patternName = /^#([A-Fa-f0-9]{6})$/
                                                            if (patternName.test(numericValue) === false) {
                                                                let temp = { ...colorCodeValidation }
                                                                temp['footerBgValidation'] = true
                                                                setColorCodeValidation(temp)
                                                                setFooterBackgroundColor(numericValue)
                                                                setOnChangeValues(true)
                                                            } else {
                                                                let temp = { ...colorCodeValidation }
                                                                temp['footerBgValidation'] = false
                                                                setColorCodeValidation(temp)
                                                                setFooterBackgroundColor(numericValue)
                                                                setOnChangeValues(true)
                                                            }
                                                            // setFooterBackgroundColor(e.target.value);
                                                            let temp = { ...copyImageOfStoreFooterSetting }
                                                            temp['bg_color'] = numericValue
                                                            setCopyImageOfStoreFooterSetting(temp)
                                                        }}
                                                        addonAfter={
                                                            <Tooltip title={t('messages:reset_to_the_original_value')}>
                                                                <UndoOutlined
                                                                    onClick={() => {
                                                                        setFooterBackgroundColor(footerBgColor)
                                                                        let temp = { ...colorCodeValidation }
                                                                        temp['footerBgValidation'] = false
                                                                        setColorCodeValidation(temp)
                                                                    }}
                                                                />
                                                            </Tooltip>
                                                        }
                                                    />
                                                </Space.Compact>
                                            </Content>
                                            {colorCodeValidation.footerBgValidation === true ? (
                                                <p className='text-red-600 text-sm'>
                                                    {t('messages:please_enter_valid_hexadecimal_code')} <br />
                                                    {t('messages:ex_ffffff_for_white_000000_for_black')}
                                                </p>
                                            ) : null}
                                        </Col>
                                        <Col span={8} className='ml-1'>
                                            <label className='text-[13px] mb-2 ml-1 select-none input-label-color'>
                                                {t('labels:text_color')}
                                            </label>
                                            <Content className='flex gap-2'>
                                                <Input
                                                    type='color'
                                                    className='w-9 p-0'
                                                    value={footerForegroundColor}
                                                    onChange={(e) => {
                                                        const patternName = /^#([A-Fa-f0-9]{6})$/
                                                        if (patternName.test(e.target.value) === false) {
                                                            let temp = { ...colorCodeValidation }
                                                            temp['footerTextValidation'] = true
                                                            setColorCodeValidation(temp)
                                                            setFooterForegroundColor(e.target.value)
                                                            setOnChangeValues(true)
                                                        } else {
                                                            let temp = { ...colorCodeValidation }
                                                            temp['footerTextValidation'] = false
                                                            setColorCodeValidation(temp)
                                                            setFooterForegroundColor(e.target.value)
                                                            setOnChangeValues(true)
                                                        }
                                                        let temp = { ...copyImageOfStoreFooterSetting }
                                                        temp['fg_color'] = e.target.value
                                                        setCopyImageOfStoreFooterSetting(temp)
                                                    }}
                                                />
                                                <Space.Compact className=''>
                                                    <Input
                                                        value={footerForegroundColor}
                                                        className='w-[150px]'
                                                        maxLength={7}
                                                        onChange={(e) => {
                                                            const inputValue = e.target.value
                                                            // Allow only numeric input
                                                            const numericValue = inputValue
                                                                .replace(/[^a-f0-9#]/gi, '')
                                                                .substring(0, 7)
                                                            setFooterForegroundColor(numericValue)
                                                            const patternName = /^#([A-Fa-f0-9]{6})$/
                                                            if (patternName.test(numericValue) === false) {
                                                                let temp = { ...colorCodeValidation }
                                                                temp['footerTextValidation'] = true
                                                                setColorCodeValidation(temp)
                                                                setFooterForegroundColor(numericValue)
                                                                setOnChangeValues(true)
                                                            } else {
                                                                let temp = { ...colorCodeValidation }
                                                                temp['footerTextValidation'] = false
                                                                setColorCodeValidation(temp)
                                                                setFooterForegroundColor(numericValue)
                                                                setOnChangeValues(true)
                                                            }
                                                            // setFooterForegroundColor(e.target.value);
                                                            let temp = { ...copyImageOfStoreFooterSetting }
                                                            temp['fg_color'] = numericValue
                                                            setCopyImageOfStoreFooterSetting(temp)
                                                        }}
                                                        addonAfter={
                                                            <Tooltip title={t('messages:reset_to_the_original_value')}>
                                                                <UndoOutlined
                                                                    onClick={() => {
                                                                        setFooterForegroundColor(footerFgColor)
                                                                        let temp = { ...colorCodeValidation }
                                                                        temp['footerTextValidation'] = false
                                                                        setColorCodeValidation(temp)
                                                                    }}
                                                                />
                                                            </Tooltip>
                                                        }
                                                    />
                                                </Space.Compact>
                                            </Content>
                                            {colorCodeValidation.footerTextValidation === true ? (
                                                <p className='text-red-600 text-sm'>
                                                    {t('messages:please_enter_valid_hexadecimal_code')} <br />
                                                    {t('messages:ex_ffffff_for_white_000000_for_black')}
                                                </p>
                                            ) : null}
                                        </Col>
                                    </Row>
                                </Content>
                                <Content className='mt-4'>
                                    {hideActionButton ? (
                                        ''
                                    ) : (
                                        <Row className='gap-2'>
                                            <Col>
                                                <Button
                                                    className={onChangeValues ? 'app-btn-primary ' : '!opacity-75'}
                                                    disabled={!onChangeValues}
                                                    onClick={() => {
                                                        validatePostStoreSetting()
                                                    }}>
                                                    {t('labels:save')}
                                                </Button>
                                            </Col>
                                            <Col className=''>
                                                <Button
                                                    className={
                                                        onChangeValues === true ? 'app-btn-secondary ' : '!opacity-75'
                                                    }
                                                    disabled={!onChangeValues}
                                                    onClick={() => {
                                                        navigate('/dashboard/store?m_t=1')
                                                    }}>
                                                    {t('labels:discard')}
                                                </Button>
                                            </Col>
                                        </Row>
                                    )}
                                </Content>
                                <StoreModal
                                    isVisible={resetModalOpen}
                                    okButtonText={t('labels:yes')}
                                    cancelButtonText={t('labels:cancel')}
                                    title={t('labels:reset_default')}
                                    okCallback={() => updateStoreSettingsRestoreApi()}
                                    cancelCallback={() => {
                                        closeResetWaringModal()
                                    }}
                                    isSpin={resetLoader}
                                    hideCloseButton={false}>
                                    {
                                        <div>
                                            <p className='!mb-0'>{t('messages:restore_settings_warning_msg')}</p>
                                            <p>{t('messages:restore_settings_modal_msg')}</p>
                                        </div>
                                    }
                                </StoreModal>
                            </Content>
                        </Spin>
                    </>
                )}
            </Content>
            {auth.isAuthenticated && permissionValue?.includes('UI-user-access-control') ? (
                <PoliciesSettings storeName={storeName} />
            ) : null}
        </Content>
    )
}

export default StoreSettings
