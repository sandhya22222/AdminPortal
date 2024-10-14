import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import StoreModal from '../../components/storeModal/StoreModal'
import MarketplaceToaster from '../../util/marketplaceToaster'
import MarketplaceServices from '../../services/axios/MarketplaceServices'

import { useNavigate } from 'react-router-dom'
import { Undo } from 'lucide-react'
import { Eye } from 'lucide-react'
import { SketchPicker } from 'react-color'
import util from '../../util/common'
import Preview from './Preview'

//shadcn
import Spin from '../../shadcnComponents/customComponents/Spin'
import { Button } from '../../shadcnComponents/ui/button'
import { Label } from '../../shadcnComponents/ui/label'
import { Skeleton } from '../../shadcnComponents/ui/skeleton'
import { Input } from '../../shadcnComponents/ui/input'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../../shadcnComponents/ui/tooltip'

const storeSettingAPI = process.env.REACT_APP_STORE_FRONT_SETTINGS_API
const storeSettingsRestoreFactorAPI = process.env.REACT_APP_STORE_FRONT_SETTINGS_RESTORE_FACTOR_API

const Theme = ({ id, getImageData }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [pageBackgroundColor, setPageBackgroundColor] = useState('#EBEBEB')
    const [pageBgColor, setPageBgColor] = useState('#EBEBEB')
    const [foreGroundColor, setForeGroundColor] = useState('#333333')
    const [pageFgColor, setPageFgColor] = useState('#333333')
    // const [buttonPrimaryBackgroundColor, setButtonPrimaryBackgroundColor] = useState('#000000')
    // const [btnPrimaryBgColor, setBtnPrimaryBgColor] = useState('#000000')
    // const [buttonSecondaryBackgroundColor, setButtonSecondaryBackgroundColor] = useState('#000000')
    // const [btnSecondaryBgColor, setBtnSecondaryBgColor] = useState('#000000')
    // const [buttonTertiaryBackgroundColor, setButtonTertiaryBackgroundColor] = useState('#000000')
    const [btnTeritaryBgColor, setbtnTeritaryBgColor] = useState('#000000')
    // const [buttonPrimaryForegroundColor, setButtonPrimaryForegroundColor] = useState('#000000')
    const [btnPrimaryFgColor, setBtnPrimaryFgColor] = useState('#000000')
    const [buttonSecondaryForegroundColor, setButtonSecondaryForegroundColor] = useState('#000000')
    const [btnSecondaryFgColor, setBtnSecondaryFgColor] = useState('#000000')
    // const [buttonTeritaryForegroundColor, setButtonTeritaryForegroundColor] = useState('#000000')
    // const [btnTertiaryFgColor, setBtnTertiaryFgColor] = useState('#000000')
    const [footerBackgroundColor, setFooterBackgroundColor] = useState('#000000')
    const [footerBgColor, setFooterBgColor] = useState('#000000')
    const [footerForegroundColor, setFooterForegroundColor] = useState('#000000')
    const [footerFgColor, setFooterFgColor] = useState('#000000')
    const [headerBackgroundColor, setHeaderBackgroundColor] = useState('#000000')
    const [headerBgColor, setHeaderBgColor] = useState('#000000')
    const [headerForegroundColor, setHeaderForegroundColor] = useState('#000000')
    const [headerFgColor, setHeaderFgColor] = useState('#000000')
    const [isLoading, setIsLoading] = useState(false)
    const [themeLoading, setThemeLoading] = useState(false)
    // const [copyImageOfStoreSettingsPageTheme, setCopyImageOfStoreSettingsPageTheme] = useState()
    const [copyImageOfStoreHeaderSetting, setCopyImageOfStoreHeaderSetting] = useState()
    const [copyImageOfStoreFooterSetting, setCopyImageOfStoreFooterSetting] = useState()
    const [imageOfStoreSettingsPageTheme, setImageOfStoreSettingsPageTheme] = useState()
    const [imageOfStoreHeaderSettings, setImageOfStoreHeaderSettings] = useState()
    const [imageOfStoreFooterSettings, setImageOfStoreFooterSettings] = useState()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [resetModalOpen, setResetModalOpen] = useState(false)
    const [resetLoader, setResetLoader] = useState(false)
    const [onChangeValues, setOnChangeValues] = useState(false)

    const [buttonPrimaryBackgroundColor, setButtonPrimaryBackgroundColor] = useState('#ffffff')
    const [btnPrimaryBgColor, setBtnPrimaryBgColor] = useState('#ffffff') // Initialize your original color state
    const [showColorPicker, setShowColorPicker] = useState(false)
    const [buttonSecondaryBackgroundColor, setButtonSecondaryBackgroundColor] = useState('#ffffff')
    const [btnSecondaryBgColor, setBtnSecondaryBgColor] = useState('#ffffff') // Original color for undo
    const [showSecondaryColorPicker, setShowSecondaryColorPicker] = useState(false) // State for showing the color picker
    const [buttonTeritaryForegroundColor, setButtonTeritaryForegroundColor] = useState('#000000') // Default color
    const [btnTertiaryFgColor, setBtnTertiaryFgColor] = useState('#000000') // Original color for undo
    const [showTertiaryColorPicker, setShowTertiaryColorPicker] = useState(false) // State for showing the color picker
    const [buttonPrimaryForegroundColor, setButtonPrimaryForegroundColor] = useState('#000000') // default value
    const [copyImageOfStoreSettingsPageTheme, setCopyImageOfStoreSettingsPageTheme] = useState({})
    const [showPrimaryColorPicker, setShowPrimaryColorPicker] = useState(false) // State to toggle the color picker
    const [showSecondaryButtonColorPicker, setShowSecondaryButtonColorPicker] = useState(false) // For secondary button
    const [showSecondaryTextColorPicker, setShowSecondaryTextColorPicker] = useState(false) // For secondary text
    const [colorCodeValidation, setColorCodeValidation] = useState({
        pageBgColorValidation: false,
        pageTextColorValidation: false,
        primaryBgValidation: false,
        secondaryBgValidation: false,
        primaryTextValidation: false,
        secondaryTextValidation: false,
        tertiaryTextValidation: false,
        headerBgValidation: false,
        headerTextValidation: false,
        footerBgValidation: false,
        footerTextValidation: false,
    })
    //! get call of  getStoreSettingApi
    const findAllWithoutPageStoreSettingApi = () => {
        setThemeLoading(true)
        MarketplaceServices.findAllWithoutPage(storeSettingAPI, {
            store_id: id,
        })
            .then(function (response) {
                setThemeLoading(false)
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
                setBtnPrimaryFgColor(
                    response.data.response_body.store_settings_data[0].store_page_settings[0].btn_primary_fg_color
                )
                setButtonSecondaryBackgroundColor(
                    response.data.response_body.store_settings_data[0].store_page_settings[0].btn_secondary_bg_color
                )
                setBtnSecondaryBgColor(
                    response.data.response_body.store_settings_data[0].store_page_settings[0].btn_secondary_bg_color
                )
                setButtonSecondaryForegroundColor(
                    response.data.response_body.store_settings_data[0].store_page_settings[0].btn_secondary_fg_color
                )
                setBtnSecondaryFgColor(
                    response.data.response_body.store_settings_data[0].store_page_settings[0].btn_secondary_fg_color
                )
                // setButtonTertiaryBackgroundColor(
                //     response.data.response_body.store_settings_data[0].store_page_settings[0].btn_tertiary_bg_color
                // )
                // setbtnTeritaryBgColor(
                //     response.data.response_body.store_settings_data[0].store_page_settings[0].btn_tertiary_bg_color
                // )
                setButtonTeritaryForegroundColor(
                    response.data.response_body.store_settings_data[0].store_page_settings[0].btn_tertiary_fg_color
                )
                setBtnTertiaryFgColor(
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
                setThemeLoading(false)
                if (error.response === undefined) {
                    setPageBackgroundColor('#EBEBEB')
                    setButtonPrimaryBackgroundColor('#000000')
                    setButtonSecondaryBackgroundColor('#000000')
                    // setButtonTertiaryBackgroundColor('#000000')
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

    //!update for restore store settings
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
                setBtnPrimaryFgColor(response.data.response_body.store_page_settings[0].btn_primary_fg_color)
                setButtonSecondaryBackgroundColor(
                    response.data.response_body.store_page_settings[0].btn_secondary_bg_color
                )
                setBtnSecondaryBgColor(response.data.response_body.store_page_settings[0].btn_secondary_bg_color)
                setButtonSecondaryForegroundColor(
                    response.data.response_body.store_page_settings[0].btn_secondary_fg_color
                )
                setBtnSecondaryFgColor(response.data.response_body.store_page_settings[0].btn_secondary_fg_color)
                // setButtonTertiaryBackgroundColor(
                //     response.data.response_body.store_page_settings[0].btn_tertiary_bg_color
                // )
                // setbtnTeritaryBgColor(response.data.response_body.store_page_settings[0].btn_tertiary_bg_color)
                setButtonTeritaryForegroundColor(
                    response.data.response_body.store_page_settings[0].btn_tertiary_fg_color
                )
                setBtnTertiaryFgColor(response.data.response_body.store_page_settings[0].btn_tertiary_fg_color)
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
                setBtnPrimaryFgColor(response.data.response_body.store_page_settings[0].btn_primary_fg_color)
                setButtonSecondaryBackgroundColor(
                    response.data.response_body.store_page_settings[0].btn_secondary_bg_color
                )
                setBtnSecondaryBgColor(response.data.response_body.store_page_settings[0].btn_secondary_bg_color)
                setButtonSecondaryForegroundColor(
                    response.data.response_body.store_page_settings[0].btn_secondary_fg_color
                )
                setBtnSecondaryFgColor(response.data.response_body.store_page_settings[0].btn_secondary_fg_color)
                // setButtonTertiaryBackgroundColor(
                //     response.data.response_body.store_page_settings[0].btn_tertiary_bg_color
                // )
                // setbtnTeritaryBgColor(response.data.response_body.store_page_settings[0].btn_tertiary_bg_color)
                setButtonTeritaryForegroundColor(
                    response.data.response_body.store_page_settings[0].btn_tertiary_fg_color
                )
                setBtnTertiaryFgColor(response.data.response_body.store_page_settings[0].btn_tertiary_fg_color)
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

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

    const validatePostStoreSetting = async () => {
        setIsLoading(true)

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
                (copyImageOfStoreFooterSetting && copyImageOfStoreFooterSetting.fg_color)
        ) {
            count--
            MarketplaceToaster.showToast(util.getToastObject(`${t('messages:no_changes_were_detected')}`, 'info'))
        } else if (
            colorCodeValidation.pageBgColorValidation ||
            colorCodeValidation.pageTextColorValidation ||
            colorCodeValidation.primaryBgValidation ||
            colorCodeValidation.secondaryBgValidation ||
            colorCodeValidation.primaryTextValidation ||
            colorCodeValidation.secondaryTextValidation ||
            colorCodeValidation.tertiaryTextValidation ||
            colorCodeValidation.headerBgValidation ||
            colorCodeValidation.headerTextValidation ||
            colorCodeValidation.footerBgValidation ||
            colorCodeValidation.footerTextValidation
        ) {
            count--
            MarketplaceToaster.showToast(util.getToastObject(`${t('messages:color_validation')}`, 'error'))
        } else if (count === 2) {
            await saveStoreSettingsCall()
        }

        await delay(2000)

        setIsLoading(false)
    }

    // const validatePostStoreSetting = () => {
    //     let count = 2
    //     if (
    //         (imageOfStoreSettingsPageTheme && imageOfStoreSettingsPageTheme.bg_color) ===
    //             (copyImageOfStoreSettingsPageTheme && copyImageOfStoreSettingsPageTheme.bg_color) &&
    //         (imageOfStoreSettingsPageTheme && imageOfStoreSettingsPageTheme.btn_primary_bg_color) ===
    //             (copyImageOfStoreSettingsPageTheme && copyImageOfStoreSettingsPageTheme.btn_primary_bg_color) &&
    //         (imageOfStoreSettingsPageTheme && imageOfStoreSettingsPageTheme.btn_primary_fg_color) ===
    //             (copyImageOfStoreSettingsPageTheme && copyImageOfStoreSettingsPageTheme.btn_primary_fg_color) &&
    //         (imageOfStoreSettingsPageTheme && imageOfStoreSettingsPageTheme.btn_secondary_bg_color) ===
    //             (copyImageOfStoreSettingsPageTheme && copyImageOfStoreSettingsPageTheme.btn_secondary_bg_color) &&
    //         (imageOfStoreSettingsPageTheme && imageOfStoreSettingsPageTheme.btn_secondary_fg_color) ===
    //             (copyImageOfStoreSettingsPageTheme && copyImageOfStoreSettingsPageTheme.btn_secondary_fg_color) &&
    //         (imageOfStoreSettingsPageTheme && imageOfStoreSettingsPageTheme.btn_tertiary_fg_color) ===
    //             (copyImageOfStoreSettingsPageTheme && copyImageOfStoreSettingsPageTheme.btn_tertiary_fg_color) &&
    //         (imageOfStoreSettingsPageTheme && imageOfStoreSettingsPageTheme.fg_color) ===
    //             (copyImageOfStoreSettingsPageTheme && copyImageOfStoreSettingsPageTheme.fg_color) &&
    //         (imageOfStoreHeaderSettings && imageOfStoreHeaderSettings.bg_color) ===
    //             (copyImageOfStoreHeaderSetting && copyImageOfStoreHeaderSetting.bg_color) &&
    //         (imageOfStoreHeaderSettings && imageOfStoreHeaderSettings.fg_color) ===
    //             (copyImageOfStoreHeaderSetting && copyImageOfStoreHeaderSetting.fg_color) &&
    //         (imageOfStoreFooterSettings && imageOfStoreFooterSettings.bg_color) ===
    //             (copyImageOfStoreFooterSetting && copyImageOfStoreFooterSetting.bg_color) &&
    //         (imageOfStoreFooterSettings && imageOfStoreFooterSettings.fg_color) ===
    //             (copyImageOfStoreFooterSetting && copyImageOfStoreFooterSetting.fg_color)
    //     ) {
    //         count--
    //         MarketplaceToaster.showToast(util.getToastObject(`${t('messages:no_changes_were_detected')}`, 'info'))
    //     } else if (
    //         colorCodeValidation.pageBgColorValidation === true ||
    //         colorCodeValidation.pageTextColorValidation === true ||
    //         colorCodeValidation.primaryBgValidation === true ||
    //         colorCodeValidation.secondaryBgValidation === true ||
    //         colorCodeValidation.primaryTextValidation === true ||
    //         colorCodeValidation.secondaryTextValidation === true ||
    //         colorCodeValidation.tertiaryTextValidation === true ||
    //         colorCodeValidation.headerBgValidation === true ||
    //         colorCodeValidation.headerTextValidation === true ||
    //         colorCodeValidation.footerBgValidation === true ||
    //         colorCodeValidation.footerTextValidation === true
    //     ) {
    //         count--
    //         MarketplaceToaster.showToast(util.getToastObject(`${t('messages:color_validation')}`, 'error'))
    //     } else if (count === 2) {
    //         saveStoreSettingsCall()
    //     }
    // }

    const closeResetWaringModal = () => {
        setResetModalOpen(false)
    }

    const openModal = () => {
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
    }
    useEffect(() => {
        findAllWithoutPageStoreSettingApi()
    }, [])
    return (
        <div>
            {themeLoading ? (
                <div className='bg-white p-3 !rounded-md mt-[2.0rem]'>
                    <Skeleton className='space-y-4'>
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className='h-4 bg-gray-200 rounded'></div>
                        ))}
                    </Skeleton>
                </div>
            ) : (
                <div className='bg-white my-4 p-4 rounded-lg border w-auto'>
                    <div className=''>
                        {/* firstchange - DONE*/}
                        <div className='!mb-4'>
                            <div className='flex justify-between w-full'>
                                <Label className='text-lg font-semibold text-regal-blue'>{t('labels:themes')}</Label>
                                <div className='flex gap-3'>
                                    <Button
                                        variant='outline'
                                        className='app-btn-secondary !text-end'
                                        onClick={() => setResetModalOpen(true)}>
                                        {t('labels:reset')}
                                    </Button>
                                    <Button
                                        variant='outline'
                                        className='app-btn-secondary flex justify-center items-center'
                                        onClick={() => openModal()}>
                                        <Eye className='mr-2 w-4 h-4' /> {t('labels:preview')}
                                    </Button>
                                </div>
                            </div>
                            <StoreModal
                                isVisible={isModalOpen}
                                title={`${t('labels:sample_preview_page_for_store_front')}`}
                                cancelCallback={() => closeModal()}
                                isSpin={false}>
                                <Preview
                                    headerBackgroundColor={headerBackgroundColor}
                                    headerForegroundColor={headerForegroundColor}
                                    footerBackgroundColor={footerBackgroundColor}
                                    footerForegroundColor={footerForegroundColor}
                                    pageBackgroundColor={pageBackgroundColor}
                                    foreGroundColor={foreGroundColor}
                                    buttonPrimaryBackgroundColor={buttonPrimaryBackgroundColor}
                                    buttonSecondaryBackgroundColor={buttonSecondaryBackgroundColor}
                                    buttonPrimaryForegroundColor={buttonPrimaryForegroundColor}
                                    buttonSecondaryForegroundColor={buttonSecondaryForegroundColor}
                                    buttonTeritaryForegroundColor={buttonTeritaryForegroundColor}
                                    getImageData={getImageData}
                                />
                            </StoreModal>
                        </div>

                        <div className='text-regal-blue font-medium text-base'>{t('labels:page_theme')}</div>
                        {/* fourthchanges-top rows*/}
                        <div className='flex flex-row flex-wrap mt-4 gap-10'>
                            {/* rowONe */}
                            <TooltipProvider>
                                <div className=''>
                                    <Label>{t('labels:primary_button_background_color')}</Label>
                                    <div className='flex gap-2 mt-1 items-center'>
                                        <div
                                            className='w-9 h-9 rounded border cursor-pointer'
                                            style={{ backgroundColor: buttonPrimaryBackgroundColor }}
                                            onClick={() => setShowColorPicker(!showColorPicker)}></div>

                                        <div className='relative flex items-center'>
                                            <Input
                                                value={buttonPrimaryBackgroundColor}
                                                maxLength={7}
                                                className='w-[150px]'
                                                onChange={(e) => {
                                                    const newColor = e.target.value
                                                    setButtonPrimaryBackgroundColor(newColor)

                                                    const isValidHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(
                                                        newColor
                                                    )
                                                    setColorCodeValidation((prev) => ({
                                                        ...prev,
                                                        primaryBgValidation: !isValidHex,
                                                    }))

                                                    const hasChanged = newColor !== btnPrimaryBgColor
                                                    console.log('New Color:', newColor, 'Has Changed:', hasChanged)
                                                    setOnChangeValues(hasChanged)
                                                }}
                                            />

                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Undo
                                                        className='cursor-pointer ml-2'
                                                        onClick={() => {
                                                            setButtonPrimaryBackgroundColor(btnPrimaryBgColor)
                                                            setColorCodeValidation((prev) => ({
                                                                ...prev,
                                                                primaryBgValidation: false,
                                                            }))
                                                            setOnChangeValues(false)
                                                            console.log('Reset to original value:', btnPrimaryBgColor)
                                                        }}
                                                        size={14}
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    {t('messages:reset_to_the_original_value')}
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </div>

                                    {showColorPicker && (
                                        <div className='absolute mt-2 z-10'>
                                            <SketchPicker
                                                color={buttonPrimaryBackgroundColor}
                                                onChangeComplete={(color) => {
                                                    setButtonPrimaryBackgroundColor(color.hex)

                                                    setColorCodeValidation((prev) => ({
                                                        ...prev,
                                                        primaryBgValidation: false,
                                                    }))
                                                    setOnChangeValues(color.hex !== btnPrimaryBgColor)
                                                    console.log('Color changed to:', color.hex)
                                                }}
                                            />
                                        </div>
                                    )}

                                    {colorCodeValidation.primaryBgValidation && (
                                        <p className='text-red-600 text-sm'>
                                            {t('messages:please_enter_valid_hexadecimal_code')} <br />
                                            {t('messages:ex_ffffff_for_white_000000_for_black')}
                                        </p>
                                    )}
                                </div>
                            </TooltipProvider>

                            {/* row2 */}
                            <TooltipProvider>
                                <div className=''>
                                    <Label>{t('labels:secondary_button_background_color')}</Label>
                                    <div className='flex gap-2 mt-1 items-center'>
                                        <div
                                            className='w-9 h-9 rounded border cursor-pointer'
                                            style={{ backgroundColor: buttonSecondaryBackgroundColor }}
                                            onClick={() => setShowSecondaryColorPicker(!showSecondaryColorPicker)} // Toggle the color picker
                                        ></div>

                                        <div className='relative flex items-center'>
                                            <Input
                                                value={buttonSecondaryBackgroundColor}
                                                maxLength={7}
                                                className='w-[150px]'
                                                onChange={(e) => {
                                                    const newColor = e.target.value
                                                    setButtonSecondaryBackgroundColor(newColor)
                                                    const patternName = /^#([A-Fa-f0-9]{6})$/

                                                    const isValidHex = patternName.test(newColor)
                                                    setColorCodeValidation({ secondaryBgValidation: !isValidHex })

                                                    const themeUpdate = { ...copyImageOfStoreSettingsPageTheme }
                                                    themeUpdate['btn_secondary_bg_color'] = newColor
                                                    setCopyImageOfStoreSettingsPageTheme(themeUpdate)

                                                    const hasChanged = newColor !== btnSecondaryBgColor
                                                    console.log(
                                                        'Secondary Color Changed:',
                                                        newColor,
                                                        'Has Changed:',
                                                        hasChanged
                                                    )
                                                    setOnChangeValues(hasChanged)
                                                }}
                                            />

                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Undo
                                                        className='cursor-pointer ml-2'
                                                        onClick={() => {
                                                            setButtonSecondaryBackgroundColor(btnSecondaryBgColor)
                                                            setColorCodeValidation((prev) => ({
                                                                ...prev,
                                                                secondaryBgValidation: false,
                                                            }))
                                                            setOnChangeValues(false)
                                                            console.log(
                                                                'Secondary Color Reset to original value:',
                                                                btnSecondaryBgColor
                                                            )
                                                        }}
                                                        size={14}
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    {t('messages:reset_to_the_original_value')}
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </div>

                                    {showSecondaryColorPicker && (
                                        <div className='absolute mt-2 z-10'>
                                            <SketchPicker
                                                color={buttonSecondaryBackgroundColor}
                                                onChangeComplete={(color) => {
                                                    setButtonSecondaryBackgroundColor(color.hex)
                                                    setColorCodeValidation({ secondaryBgValidation: false }) // Reset validation

                                                    const themeUpdate = { ...copyImageOfStoreSettingsPageTheme }
                                                    themeUpdate['btn_secondary_bg_color'] = color.hex
                                                    setCopyImageOfStoreSettingsPageTheme(themeUpdate)

                                                    const hasChanged = color.hex !== btnSecondaryBgColor
                                                    setOnChangeValues(hasChanged)
                                                    console.log('Secondary Color Changed:', color.hex)
                                                }}
                                            />
                                        </div>
                                    )}

                                    {colorCodeValidation.secondaryBgValidation && (
                                        <p className='text-red-600 text-sm'>
                                            {t('messages:please_enter_valid_hexadecimal_code')} <br />
                                            {t('messages:ex_ffffff_for_white_000000_for_black')}
                                        </p>
                                    )}
                                </div>
                            </TooltipProvider>

                            {/* row3 */}
                            <div className=''>
                                <Label>{t('labels:tertiary_button_text_color')}</Label>
                                <div className='flex gap-2 mt-1'>
                                    <div
                                        className='w-9 h-9 rounded border cursor-pointer'
                                        style={{ backgroundColor: buttonTeritaryForegroundColor }}
                                        onClick={() => setShowTertiaryColorPicker(!showTertiaryColorPicker)}></div>

                                    <div className='relative flex items-center'>
                                        <Input
                                            value={buttonTeritaryForegroundColor}
                                            maxLength={7}
                                            className='w-[150px]'
                                            onChange={(e) => {
                                                const newColor = e.target.value
                                                setButtonTeritaryForegroundColor(newColor)
                                                const patternName = /^#([A-Fa-f0-9]{6})$/

                                                const isValidHex = patternName.test(newColor)
                                                setColorCodeValidation({ tertiaryTextValidation: !isValidHex })

                                                const themeUpdate = { ...copyImageOfStoreSettingsPageTheme }
                                                themeUpdate['btn_tertiary_fg_color'] = newColor
                                                setCopyImageOfStoreSettingsPageTheme(themeUpdate)

                                                const hasChanged = newColor !== btnTertiaryFgColor
                                                console.log(
                                                    'Tertiary Color Changed:',
                                                    newColor,
                                                    'Has Changed:',
                                                    hasChanged
                                                )
                                                setOnChangeValues(hasChanged)
                                            }}
                                        />

                                        {/* Undo button */}
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Undo
                                                    className='cursor-pointer ml-2'
                                                    onClick={() => {
                                                        setButtonTeritaryForegroundColor(btnTertiaryFgColor)
                                                        setColorCodeValidation((prev) => ({
                                                            ...prev,
                                                            tertiaryTextValidation: false,
                                                        }))
                                                        setOnChangeValues(false)
                                                        console.log(
                                                            'Tertiary Color Reset to original value:',
                                                            btnTertiaryFgColor
                                                        )
                                                    }}
                                                    size={14}
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent>{t('messages:reset_to_the_original_value')}</TooltipContent>
                                        </Tooltip>
                                    </div>
                                </div>

                                {showTertiaryColorPicker && (
                                    <div className='absolute mt-2 z-10'>
                                        <SketchPicker
                                            color={buttonTeritaryForegroundColor}
                                            onChangeComplete={(color) => {
                                                setButtonTeritaryForegroundColor(color.hex)
                                                setColorCodeValidation({ tertiaryTextValidation: false }) // Reset validation

                                                const themeUpdate = { ...copyImageOfStoreSettingsPageTheme }
                                                themeUpdate['btn_tertiary_fg_color'] = color.hex
                                                setCopyImageOfStoreSettingsPageTheme(themeUpdate)

                                                const hasChanged = color.hex !== btnTertiaryFgColor
                                                setOnChangeValues(hasChanged)
                                                console.log('Tertiary Color Changed:', color.hex)
                                            }}
                                        />
                                    </div>
                                )}

                                {/* Validation message */}
                                {colorCodeValidation.tertiaryTextValidation && (
                                    <p className='text-red-600 text-sm'>
                                        {t('messages:please_enter_valid_hexadecimal_code')} <br />
                                        {t('messages:ex_ffffff_for_white_000000_for_black')}
                                    </p>
                                )}
                            </div>
                        </div>
                        {/*bottom row */}
                        <div className=' mt-4 flex flex-wrap gap-10'>
                            {/* Primary Button Text Color Section */}
                            <div className='mr-2 '>
                                <Label>{t('labels:primary_button_text_color')}</Label>
                                <div className='flex gap-2 mt-1 items-center'>
                                    {/* Color box that shows the current primary text color */}
                                    <div
                                        className='w-9 h-9 rounded border cursor-pointer'
                                        style={{ backgroundColor: buttonPrimaryForegroundColor }} // Primary foreground color
                                        onClick={() => setShowPrimaryColorPicker(!showPrimaryColorPicker)} // Toggle primary text color picker
                                    ></div>

                                    {/* Text input for hex code */}
                                    <div className='relative flex items-center'>
                                        <Input
                                            value={buttonPrimaryForegroundColor} // Use the primary foreground color
                                            maxLength={7}
                                            className='w-[150px]'
                                            onChange={(e) => {
                                                const newColor = e.target.value
                                                console.log('Primary Color Input Changed:', newColor) // Log new color value
                                                setButtonPrimaryForegroundColor(newColor) // Update the primary foreground color

                                                // Validate hex color
                                                const patternName = /^#([A-Fa-f0-9]{6})$/
                                                const isValidColor = patternName.test(newColor)
                                                console.log('Is Primary Color Valid:', isValidColor) // Log validation result
                                                setColorCodeValidation({ primaryTextValidation: !isValidColor })

                                                // Set onChangeValues if color is valid
                                                if (isValidColor) {
                                                    setOnChangeValues(true)
                                                } else {
                                                    setOnChangeValues(false)
                                                }

                                                // Update theme settings if valid
                                                if (isValidColor) {
                                                    const themeUpdate = { ...copyImageOfStoreSettingsPageTheme }
                                                    themeUpdate['btn_primary_fg_color'] = newColor // Set the primary button foreground color
                                                    setCopyImageOfStoreSettingsPageTheme(themeUpdate)
                                                }
                                            }}
                                        />
                                        {/* Undo button */}
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Undo
                                                    className='cursor-pointer ml-2'
                                                    onClick={() => {
                                                        setButtonPrimaryForegroundColor(btnPrimaryFgColor) // Reset to original foreground color
                                                        setColorCodeValidation((prev) => ({
                                                            ...prev,
                                                            primaryTextValidation: false,
                                                        }))
                                                        setOnChangeValues(false) // Reset onChangeValues
                                                    }}
                                                    size={14}
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent>{t('messages:reset_to_the_original_value')}</TooltipContent>
                                        </Tooltip>
                                    </div>
                                </div>

                                {/* Show the color picker for primary button text color */}
                                {showPrimaryColorPicker && (
                                    <div className='absolute mt-2 z-10'>
                                        <SketchPicker
                                            color={buttonPrimaryForegroundColor} // Use the primary foreground color for the picker
                                            onChangeComplete={(color) => {
                                                console.log('Primary Color Picker Changed:', color.hex) // Log selected color
                                                setButtonPrimaryForegroundColor(color.hex) // Set the primary foreground color
                                                setColorCodeValidation({ primaryTextValidation: false }) // Reset validation
                                                setOnChangeValues(true) // Set onChangeValues to true

                                                const themeUpdate = { ...copyImageOfStoreSettingsPageTheme }
                                                themeUpdate['btn_primary_fg_color'] = color.hex // Update primary button foreground color
                                                setCopyImageOfStoreSettingsPageTheme(themeUpdate)
                                            }}
                                        />
                                    </div>
                                )}

                                {/* Validation message */}
                                {colorCodeValidation.primaryTextValidation && (
                                    <p className='text-red-600 text-sm'>
                                        {t('messages:please_enter_valid_hexadecimal_code')} <br />
                                        {t('messages:ex_ffffff_for_white_000000_for_black')}
                                    </p>
                                )}
                            </div>

                            {/* Secondary Button Text Color Section */}
                            <TooltipProvider>
                                <div className='mr-2'>
                                    <Label>{t('labels:secondary_button_text_color')}</Label>
                                    <div className='flex gap-2 mt-1 items-center'>
                                        <div
                                            className='w-9 h-9 rounded border cursor-pointer'
                                            style={{ backgroundColor: buttonSecondaryForegroundColor }} // Secondary text color
                                            onClick={() =>
                                                setShowSecondaryTextColorPicker(!showSecondaryTextColorPicker)
                                            }></div>

                                        <div className='relative flex items-center'>
                                            <Input
                                                value={buttonSecondaryForegroundColor}
                                                maxLength={7}
                                                className='w-[150px]'
                                                onChange={(e) => {
                                                    const newColor = e.target.value
                                                    console.log('Secondary Color Input Changed:', newColor)
                                                    setButtonSecondaryForegroundColor(newColor)

                                                    const patternName = /^#([A-Fa-f0-9]{6})$/
                                                    const isValidColor = patternName.test(newColor)
                                                    console.log('Is Secondary Color Valid:', isValidColor)
                                                    setColorCodeValidation({
                                                        secondaryTextValidation: !isValidColor,
                                                    })

                                                    if (isValidColor) {
                                                        setOnChangeValues(true)
                                                    } else {
                                                        setOnChangeValues(false)
                                                    }

                                                    if (isValidColor) {
                                                        const themeUpdate = { ...copyImageOfStoreSettingsPageTheme }
                                                        themeUpdate['btn_secondary_fg_color'] = newColor
                                                        setCopyImageOfStoreSettingsPageTheme(themeUpdate)
                                                    }
                                                }}
                                            />

                                            {/* Undo button */}
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Undo
                                                        className='cursor-pointer ml-2'
                                                        onClick={() => {
                                                            setButtonSecondaryForegroundColor(btnSecondaryFgColor)
                                                            setColorCodeValidation((prev) => ({
                                                                ...prev,
                                                                secondaryTextValidation: false,
                                                            }))
                                                            setOnChangeValues(false)
                                                        }}
                                                        size={14}
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    {t('messages:reset_to_the_original_value')}
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </div>

                                    {showSecondaryTextColorPicker && (
                                        <div className='absolute mt-2 z-10'>
                                            <SketchPicker
                                                color={buttonSecondaryForegroundColor}
                                                onChangeComplete={(color) => {
                                                    console.log('Secondary Color Picker Changed:', color.hex)
                                                    setButtonSecondaryForegroundColor(color.hex)
                                                    setColorCodeValidation({ secondaryTextValidation: false })
                                                    setOnChangeValues(true)

                                                    const themeUpdate = { ...copyImageOfStoreSettingsPageTheme }
                                                    themeUpdate['btn_secondary_fg_color'] = color.hex
                                                    setCopyImageOfStoreSettingsPageTheme(themeUpdate)
                                                }}
                                            />
                                        </div>
                                    )}

                                    {colorCodeValidation.secondaryTextValidation && (
                                        <p className='text-red-600 text-sm'>
                                            {t('messages:please_enter_valid_hexadecimal_code')} <br />
                                            {t('messages:ex_ffffff_for_white_000000_for_black')}
                                        </p>
                                    )}
                                </div>
                            </TooltipProvider>
                        </div>
                    </div>
                    {/* sixthchanges buttons */}
                    {/* <div className='mt-4 flex gap-2'>
                            <div>
                                <Button
                                    variant='outline'
                                    className={`app-btn-primary ${!onChangeValues ? '!opacity-75 cursor-not-allowed' : ''}`}
                                    disabled={!onChangeValues}
                                    onClick={() => {
                                        if (onChangeValues) {
                                            validatePostStoreSetting()
                                            console.log('Save button clicked')
                                        }
                                    }}>
                                    {t('labels:save')}
                                </Button>
                            </div>
                            <div>
                                <Button
                                    variant='outline'
                                    className={`app-btn-secondary ${!onChangeValues ? '!opacity-75 cursor-not-allowed' : ''}`}
                                    disabled={!onChangeValues}
                                    onClick={() => {
                                        if (onChangeValues) {
                                            navigate('/dashboard/store?m_t=1')
                                            console.log('Discard button clicked')
                                        }
                                    }}>
                                    {t('labels:discard')}
                                </Button>
                            </div>
                        </div> */}
                    <div className='mt-4 flex gap-2'>
                        {isLoading ? (
                            <Spin />
                        ) : (
                            <>
                                <div>
                                    <Button
                                        variant='outline'
                                        className={`app-btn-primary ${!onChangeValues ? '!opacity-75 cursor-not-allowed' : ''}`}
                                        disabled={!onChangeValues}
                                        onClick={() => {
                                            if (onChangeValues) {
                                                validatePostStoreSetting()
                                                console.log('Save button clicked')
                                            }
                                        }}>
                                        {t('labels:save')}
                                    </Button>
                                </div>
                                <div>
                                    <Button
                                        variant='outline'
                                        className={`app-btn-secondary ${!onChangeValues ? '!opacity-75 cursor-not-allowed' : ''}`}
                                        disabled={!onChangeValues}
                                        onClick={() => {
                                            if (onChangeValues) {
                                                navigate('/dashboard/store?m_t=1')
                                                console.log('Discard button clicked')
                                            }
                                        }}>
                                        {t('labels:discard')}
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>

                    <StoreModal
                        isVisible={resetModalOpen}
                        okButtonText={t('labels:yes')}
                        // cancelButtonText={t('labels:cancel')}
                        title={
                            <p className='text-regal-blue font-bold text-[18px] leading-[26px]'>
                                {t('labels:reset_default')}
                            </p>
                        }
                        okCallback={() => updateStoreSettingsRestoreApi()}
                        cancelCallback={() => {
                            closeResetWaringModal()
                        }}
                        isSpin={resetLoader}
                        hideCloseButton={true}>
                        {
                            <div className='!text-brandGray1'>
                                <p className='!mb-0'>{t('messages:restore_settings_warning_msg')}</p>
                                <p>{t('messages:restore_settings_modal_msg')}</p>
                            </div>
                        }
                    </StoreModal>
                </div>
            )}
        </div>
    )
}

export default Theme
