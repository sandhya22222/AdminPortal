import React, { useEffect, useState } from 'react'
import { Layout, Spin, Row, Col, Divider, Button, Space, Input, Tooltip, Skeleton } from 'antd'
import { useTranslation } from 'react-i18next'
import StoreModal from '../../components/storeModal/StoreModal'
import MarketplaceToaster from '../../util/marketplaceToaster'
import MarketplaceServices from '../../services/axios/MarketplaceServices'
import { EyeOutlined, UndoOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import util from '../../util/common'
import Preview from './Preview'
const { Content } = Layout

const storeSettingAPI = process.env.REACT_APP_STORE_FRONT_SETTINGS_API
const storeSettingsRestoreFactorAPI = process.env.REACT_APP_STORE_FRONT_SETTINGS_RESTORE_FACTOR_API

const Theme = ({ id, getImageData }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [pageBackgroundColor, setPageBackgroundColor] = useState('#EBEBEB')
    const [pageBgColor, setPageBgColor] = useState('#EBEBEB')
    const [foreGroundColor, setForeGroundColor] = useState('#333333')
    const [pageFgColor, setPageFgColor] = useState('#333333')
    const [buttonPrimaryBackgroundColor, setButtonPrimaryBackgroundColor] = useState('#000000')
    const [btnPrimaryBgColor, setBtnPrimaryBgColor] = useState('#000000')
    const [buttonSecondaryBackgroundColor, setButtonSecondaryBackgroundColor] = useState('#000000')
    const [btnSecondaryBgColor, setBtnSecondaryBgColor] = useState('#000000')
    const [buttonTertiaryBackgroundColor, setButtonTertiaryBackgroundColor] = useState('#000000')
    const [btnTeritaryBgColor, setbtnTeritaryBgColor] = useState('#000000')
    const [buttonPrimaryForegroundColor, setButtonPrimaryForegroundColor] = useState('#000000')
    const [btnPrimaryFgColor, setBtnPrimaryFgColor] = useState('#000000')
    const [buttonSecondaryForegroundColor, setButtonSecondaryForegroundColor] = useState('#000000')
    const [btnSecondaryFgColor, setBtnSecondaryFgColor] = useState('#000000')
    const [buttonTeritaryForegroundColor, setButtonTeritaryForegroundColor] = useState('#000000')
    const [btnTertiaryFgColor, setBtnTertiaryFgColor] = useState('#000000')
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
    const [copyImageOfStoreSettingsPageTheme, setCopyImageOfStoreSettingsPageTheme] = useState()
    const [copyImageOfStoreHeaderSetting, setCopyImageOfStoreHeaderSetting] = useState()
    const [copyImageOfStoreFooterSetting, setCopyImageOfStoreFooterSetting] = useState()
    const [imageOfStoreSettingsPageTheme, setImageOfStoreSettingsPageTheme] = useState()
    const [imageOfStoreHeaderSettings, setImageOfStoreHeaderSettings] = useState()
    const [imageOfStoreFooterSettings, setImageOfStoreFooterSettings] = useState()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [resetModalOpen, setResetModalOpen] = useState(false)
    const [resetLoader, setResetLoader] = useState(false)
    const [onChangeValues, setOnChangeValues] = useState(false)

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
                setButtonTertiaryBackgroundColor(
                    response.data.response_body.store_settings_data[0].store_page_settings[0].btn_tertiary_bg_color
                )
                setbtnTeritaryBgColor(
                    response.data.response_body.store_settings_data[0].store_page_settings[0].btn_tertiary_bg_color
                )
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
                    setButtonTertiaryBackgroundColor('#000000')
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
                setButtonTertiaryBackgroundColor(
                    response.data.response_body.store_page_settings[0].btn_tertiary_bg_color
                )
                setbtnTeritaryBgColor(response.data.response_body.store_page_settings[0].btn_tertiary_bg_color)
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
                    btn_tertiary_bg_color: buttonTertiaryBackgroundColor,
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
                setButtonTertiaryBackgroundColor(
                    response.data.response_body.store_page_settings[0].btn_tertiary_bg_color
                )
                setbtnTeritaryBgColor(response.data.response_body.store_page_settings[0].btn_tertiary_bg_color)
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
                (copyImageOfStoreFooterSetting && copyImageOfStoreFooterSetting.fg_color)
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
        <Content>
            {themeLoading ? (
                <Content className='bg-white p-3 !rounded-md mt-[2.0rem]'>
                    <Skeleton
                        active
                        paragraph={{
                            rows: 6,
                        }}></Skeleton>
                </Content>
            ) : (
                <Spin tip='Please wait!' size='large' spinning={isLoading}>
                    <Content className='bg-white my-4 p-3 rounded-lg border'>
                        <Content className=''>
                            <Row className='!mb-4'>
                                <Content className='flex justify-between w-full'>
                                    <label className='text-lg  font-semibold'>{t('labels:themes')}</label>
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
                                        buttonTertiaryBackgroundColor={buttonTertiaryBackgroundColor}
                                        buttonPrimaryForegroundColor={buttonPrimaryForegroundColor}
                                        buttonSecondaryForegroundColor={buttonSecondaryForegroundColor}
                                        buttonTeritaryForegroundColor={buttonTeritaryForegroundColor}
                                        getImageData={getImageData}
                                    />
                                </StoreModal>
                            </Row>
                            <Divider className='!my-4 input-label-color' orientation='left'>
                                {t('labels:page_theme')}
                            </Divider>
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
                                                                setButtonPrimaryBackgroundColor(btnPrimaryBgColor)
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
                                                                setButtonSecondaryBackgroundColor(btnSecondaryBgColor)
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
                                            value={buttonTertiaryBackgroundColor}
                                            onChange={(e) => {
                                                const patternName = /^#([A-Fa-f0-9]{6})$/
                                                if (patternName.test(e.target.value) === false) {
                                                    let temp = { ...colorCodeValidation }
                                                    temp['tertiaryBgValidation'] = true
                                                    setColorCodeValidation(temp)
                                                    setButtonTertiaryBackgroundColor(e.target.value)
                                                    setOnChangeValues(true)
                                                } else {
                                                    let temp = { ...colorCodeValidation }
                                                    temp['tertiaryBgValidation'] = false
                                                    setColorCodeValidation(temp)
                                                    setButtonTertiaryBackgroundColor(e.target.value)
                                                    setOnChangeValues(true)
                                                }
                                                let temp = { ...copyImageOfStoreSettingsPageTheme }
                                                temp['btn_tertiary_bg_color'] = e.target.value
                                                setCopyImageOfStoreSettingsPageTheme(temp)
                                            }}
                                        />
                                        <Space.Compact className=''>
                                            <Input
                                                value={buttonTertiaryBackgroundColor}
                                                className='w-[150px]'
                                                maxLength={7}
                                                onChange={(e) => {
                                                    const inputValue = e.target.value
                                                    // Allow only numeric input
                                                    const numericValue = inputValue
                                                        .replace(/[^a-f0-9#]/gi, '')
                                                        .substring(0, 7)
                                                    setButtonTertiaryBackgroundColor(numericValue)
                                                    const patternName = /^#([A-Fa-f0-9]{6})$/
                                                    if (patternName.test(numericValue) === false) {
                                                        let temp = { ...colorCodeValidation }
                                                        temp['tertiaryBgValidation'] = true
                                                        setColorCodeValidation(temp)
                                                        setButtonTertiaryBackgroundColor(numericValue)
                                                        setOnChangeValues(true)
                                                    } else {
                                                        let temp = { ...colorCodeValidation }
                                                        temp['tertiaryBgValidation'] = false
                                                        setColorCodeValidation(temp)
                                                        setButtonTertiaryBackgroundColor(numericValue)
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
                                                                setButtonTertiaryBackgroundColor(btnTeritaryBgColor)
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
                                                                setButtonPrimaryForegroundColor(btnPrimaryFgColor)
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
                                                                setButtonSecondaryForegroundColor(btnSecondaryFgColor)
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
                                                                setButtonTeritaryForegroundColor(btnTertiaryFgColor)
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
                            <Divider className='!my-6 input-label-color' orientation='left'>
                                {t('labels:store_header_setting')}
                            </Divider>
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
                            <Divider className='!my-6 input-label-color' orientation='left'>
                                {t('labels:store_footer_setting')}
                            </Divider>
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
                                        className={onChangeValues === true ? 'app-btn-secondary ' : '!opacity-75'}
                                        disabled={!onChangeValues}
                                        onClick={() => {
                                            navigate('/dashboard/store?m_t=1')
                                        }}>
                                        {t('labels:discard')}
                                    </Button>
                                </Col>
                            </Row>
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
            )}
        </Content>
    )
}

export default Theme
