import React, { useEffect, useState } from 'react'
import { Layout, Tag, Typography, Tabs, Spin, Row, Col, Button } from 'antd'
import { useAuth } from 'react-oidc-context'
import HeaderForTitle from '../../components/header/HeaderForTitle'
import MarketplaceServices from '../../services/axios/MarketplaceServices'
import MarketplaceToaster from '../../util/marketplaceToaster'
import util from '../../util/common'
import { useTranslation } from 'react-i18next'
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom'
import Status from '../Stores/Status'
import StoreImages from './StoreImages'
import StoreRestrictions from './StoreRestrictions'
import Currency from './Currency'
import PoliciesSettings from '../PoliciesSettings/PoliciesSettings'
import Theme from './Theme'
import StoreOverview from './StoreOverview'
const { Content } = Layout
const { Text } = Typography

const storeAPI = process.env.REACT_APP_STORE_API
const storeImagesAPI = process.env.REACT_APP_STORE_IMAGES_API
const storeBannerImageAPI = process.env.REACT_APP_STORE_BANNER_IMAGES_API
const pageLimit = parseInt(process.env.REACT_APP_ITEM_PER_PAGE)

const StoreSettingsLayout = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const search = useLocation().search
    const id = new URLSearchParams(search).get('id')
    const storeIdFromUrl = new URLSearchParams(search).get('storeId')
    const mainTab = new URLSearchParams(search).get('tab')
    const realmName = new URLSearchParams(search).get('rmn')
    const [searchParams, setSearchParams] = useSearchParams()
    const [changeSwitchStatus, setChangeSwitchStatus] = useState()
    const [storeData, setStoreData] = useState()
    const [storeName, setStoreName] = useState()
    const [duplicateStoreStatus, setDuplicateStoreStatus] = useState()
    const [previousStatus, setPreviousStatus] = useState(null)
    const [disableStatus, setDisableStatus] = useState(false)
    const [disableMediaButton, setDisableMediaButton] = useState(false)
    const [imagesUpload, setImagesUpload] = useState([])
    const [getImageData, setGetImageData] = useState([])
    const [isUpLoading, setIsUpLoading] = useState(false)
    const [bannerAbsoluteImage, setBannerAbsoluteImage] = useState([])
    const [hideActionButton, setHideActionButton] = useState(false)

    const auth = useAuth()
    const permissionValue = util.getPermissionData() || []

    const STORE_SETTINGS_TABS_OPTIONS = {
        OVERVIEW: 'overview',
        MEDIA: 'media',
        STORE_RESTRICTIONS: 'store_restrictions',
        CURRENCY: 'currency',
        THEME: 'Theme',
        POLICIES: 'policies',
    }

    const storeSettingsTabData = [
        {
            key: STORE_SETTINGS_TABS_OPTIONS.OVERVIEW,
            label: `${t('labels:overview')}`,
            value: 0,
        },
        {
            key: STORE_SETTINGS_TABS_OPTIONS.MEDIA,
            label: `${t('labels:media')}`,
            value: 1,
        },
        {
            key: STORE_SETTINGS_TABS_OPTIONS.STORE_RESTRICTIONS,
            label: `${t('labels:store_restrictions')}`,
            value: 2,
        },
        {
            key: STORE_SETTINGS_TABS_OPTIONS.CURRENCY,
            label: `${t('labels:currency')}`,
            value: 3,
        },
        {
            key: STORE_SETTINGS_TABS_OPTIONS.THEME,
            label: `${t('labels:themes')}`,
            value: 4,
        },
        {
            key: STORE_SETTINGS_TABS_OPTIONS.POLICIES,
            label: `${t('labels:policies')}`,
            value: 5,
        },
    ]

    const hideStoreSettingsTabData = [
        {
            key: STORE_SETTINGS_TABS_OPTIONS.STORE_RESTRICTIONS,
            label: `${t('labels:store_restrictions')}`,
            value: 0,
        },
    ]
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
                setGetImageData([response.data.response_body])
                setImagesUpload([])
            })
            .catch((error) => {
                console.log('Error response from store images post call', error)
                setIsUpLoading(false)
                MarketplaceToaster.showToast(error.response)
            })
    }

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
            })
            .catch((error) => {
                console.log('error response from the store images put call', error)
                MarketplaceToaster.showToast(error.response)
                setIsUpLoading(false)
            })
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
        if (getImageData && getImageData.length > 0) {
            findAllWithoutPageStoreBannerImageApi(id)
        }
    }, [getImageData])

    const postImageOnClickSave = () => {
        if (Object.keys(getImageData[0]).length > 0) {
            updateStoreLogoImageCall()
        } else {
            saveStoreLogoImageCall()
        }
    }
    const handelMyProfileTabChange = (tabKey) => {
        setSearchParams({
            id: id,
            page: searchParams.get('page') ? searchParams.get('page') : 1,
            limit: searchParams.get('limit') ? searchParams.get('limit') : pageLimit,
            storeId: storeIdFromUrl,
            rmn: realmName,
            tab: tabKey,
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
        setDisableStatus(isScopeAvailable)
        setDisableMediaButton(isScopeAvailable)
    }, [auth])

    useEffect(() => {
        findAllStoreApi()
        if (mainTab === 'media') {
            if (id) {
                findAllWithoutPageStoreImagesApi(id)
            }
        }
        window.scroll(0, 0)
    }, [id, mainTab])

    useEffect(() => {
        if (!searchParams.get('tab')) {
            setSearchParams({
                id: id,
                page: searchParams.get('page') ? searchParams.get('page') : 1,
                limit: searchParams.get('limit') ? searchParams.get('limit') : pageLimit,
                storeId: storeIdFromUrl,
                rmn: realmName,
                tab: STORE_SETTINGS_TABS_OPTIONS.OVERVIEW,
            })
        }
    }, [searchParams, setSearchParams])

    useEffect(() => {
        if (!searchParams.get('tab')) {
            if (permissionValue?.includes('UI-product-admin')) {
                setSearchParams({
                    id: id,
                    page: searchParams.get('page') ? searchParams.get('page') : 1,
                    limit: searchParams.get('limit') ? searchParams.get('limit') : pageLimit,
                    storeId: storeIdFromUrl,
                    rmn: realmName,
                    tab: STORE_SETTINGS_TABS_OPTIONS.STORE_RESTRICTIONS,
                })
            }
        }
    }, [searchParams, setSearchParams, hideActionButton, permissionValue])

    return (
        <Content>
            <HeaderForTitle
                title={
                    <Content className='flex !w-[80vw]'>
                        <Content className='!w-[75%] flex gap-2 mb-3'>
                            <div className='!font-semibold  text-2xl mt-2 '>{storeName}</div>
                            <div className='mt-3'>
                                <Tag color='success' className=''>
                                    {changeSwitchStatus === 1 ? `${t('labels:active')}` : `${t('labels:inactive')}`}
                                </Tag>
                            </div>
                        </Content>
                        <Content className=' flex !gap-2 !mt-3'>
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
                className='!min-h-20'
            />

            <div className='!px-6 !pb-6  !mt-[10.6rem]'>
                <div className=' w-full bg-white rounded shadow-brandShadow flex  justify-start'>
                    <div className=' py-4 h-full '>
                        {hideActionButton ? (
                            <Tabs
                                items={hideStoreSettingsTabData}
                                tabPosition={'left'}
                                defaultActiveKey={STORE_SETTINGS_TABS_OPTIONS.STORE_RESTRICTIONS}
                                activeKey={searchParams.get('tab') || STORE_SETTINGS_TABS_OPTIONS.STORE_RESTRICTIONS}
                                onTabClick={handelMyProfileTabChange}
                                type='line'
                                className=' !h-full '
                            />
                        ) : (
                            <Tabs
                                items={storeSettingsTabData}
                                tabPosition={'left'}
                                defaultActiveKey={STORE_SETTINGS_TABS_OPTIONS.OVERVIEW}
                                activeKey={searchParams.get('tab') || STORE_SETTINGS_TABS_OPTIONS.OVERVIEW}
                                onTabClick={handelMyProfileTabChange}
                                type='line'
                                className=' !h-full '
                            />
                        )}
                    </div>
                    <div className='w-[80%]'>
                        {searchParams.get('tab') === STORE_SETTINGS_TABS_OPTIONS.OVERVIEW && (
                            <>{hideActionButton ? '' : <StoreOverview realmName={realmName} />}</>
                        )}
                        {searchParams.get('tab') === STORE_SETTINGS_TABS_OPTIONS.MEDIA && (
                            <>
                                {disableMediaButton ? (
                                    ''
                                ) : (
                                    <Spin tip='Please wait!' size='large' spinning={isUpLoading}>
                                        <Content className='bg-white p-3 !rounded-md border my-4'>
                                            <label className='text-lg mb-3 font-semibold text-regal-blue'>
                                                {t('labels:media')}
                                            </label>
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
                                                disabelMediaButton={disableMediaButton}
                                            />
                                            <Content className='mt-4'>
                                                <Row className='gap-2'>
                                                    <Col>
                                                        <Button
                                                            className={'app-btn-primary'}
                                                            disabled={
                                                                imagesUpload && imagesUpload.length > 0 ? false : true
                                                            }
                                                            onClick={() => {
                                                                if (imagesUpload && imagesUpload.length > 0) {
                                                                    postImageOnClickSave()
                                                                } else {
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
                                                            disabled={
                                                                imagesUpload && imagesUpload.length > 0 ? false : true
                                                            }
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
                            </>
                        )}
                        {searchParams.get('tab') === STORE_SETTINGS_TABS_OPTIONS.STORE_RESTRICTIONS && (
                            <StoreRestrictions hideActionButton={hideActionButton} storeIdFromUrl={storeIdFromUrl} />
                        )}
                        {searchParams.get('tab') === STORE_SETTINGS_TABS_OPTIONS.CURRENCY &&
                            (hideActionButton ? '' : <Currency storeUUId={id} />)}
                        {searchParams.get('tab') === STORE_SETTINGS_TABS_OPTIONS.POLICIES &&
                            (auth.isAuthenticated && permissionValue?.includes('UI-user-access-control') ? (
                                <PoliciesSettings storeName={storeName} />
                            ) : null)}
                        {searchParams.get('tab') === STORE_SETTINGS_TABS_OPTIONS.THEME &&
                            (hideActionButton ? '' : <Theme id={id} getImageData={getImageData} />)}
                    </div>
                </div>
            </div>
        </Content>
    )
}

export default StoreSettingsLayout
