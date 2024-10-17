import React, { useEffect, useState } from 'react'
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
import { storeDefaultImage } from '../../constants/media'
import Theme from './Theme'
import StoreOverview from './StoreOverview'
import { usePageTitle } from '../../hooks/usePageTitle'
import { Star } from 'lucide-react'
import { Badge } from '../../shadcnComponents/ui/badge'
import { Tabs, TabsContent, TabsTrigger, TabsList } from '../../shadcnComponents/ui/tabs'
import Spin from '../../shadcnComponents/customComponents/Spin'
import { Button } from '../../shadcnComponents/ui/button'
const storeAPI = process.env.REACT_APP_STORE_API
const storeImagesAPI = process.env.REACT_APP_STORE_IMAGES_API
const storeBannerImageAPI = process.env.REACT_APP_STORE_BANNER_IMAGES_API
const pageLimit = parseInt(process.env.REACT_APP_ITEM_PER_PAGE)

const StoreSettingsLayout = () => {
    const { t } = useTranslation()
    usePageTitle(t('labels:stores'))
    const navigate = useNavigate()
    const search = useLocation().search
    const id = new URLSearchParams(search).get('id')
    const storeIdFromUrl = new URLSearchParams(search).get('storeId')
    const mainTab = new URLSearchParams(search).get('tab')
    const realmName = new URLSearchParams(search).get('rmn')
    const isDistributor = new URLSearchParams(search).get('isDistributor')
    const storeType = new URLSearchParams(search).get('storeType')
    const [searchParams, setSearchParams] = useSearchParams()
    const [changeSwitchStatus, setChangeSwitchStatus] = useState()
    const [storeData, setStoreData] = useState()
    const [storeName, setStoreName] = useState()
    const [duplicateStoreStatus, setDuplicateStoreStatus] = useState()
    const [previousStatus, setPreviousStatus] = useState([])
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
                const filteredStatusData = previousStatus.filter((ele) => ele.store_id === statusUUid)

                if (response.data.response_body.data[0].status === 1) {
                    if (filteredStatusData.filter((ele) => ele.status === 4)) {
                        MarketplaceToaster.showToast(
                            util.getToastObject(
                                `${t('messages:your_store_has_been_successfully_activated')}`,
                                'success'
                            )
                        )
                        setChangeSwitchStatus(1)
                    }
                } else if (response.data.response_body.data[0].status === 2) {
                    if (filteredStatusData.filter((ele) => ele.status === 5)) {
                        MarketplaceToaster.showToast(
                            util.getToastObject(
                                `${t('messages:your_store_has_been_successfully_deactivated')}`,
                                'success'
                            )
                        )
                        setChangeSwitchStatus(2)
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
            storeType: storeType,
            isDistributor: isDistributor,
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
    }, [auth, permissionValue])

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
            if (permissionValue?.includes('UI-product-admin') === true) {
                setSearchParams({
                    id: id,
                    page: searchParams.get('page') ? searchParams.get('page') : 1,
                    limit: searchParams.get('limit') ? searchParams.get('limit') : pageLimit,
                    storeId: storeIdFromUrl,
                    rmn: realmName,
                    tab: STORE_SETTINGS_TABS_OPTIONS.STORE_RESTRICTIONS,
                    storeType: storeType,
                    isDistributor: isDistributor,
                })
            } else {
                setSearchParams({
                    id: id,
                    page: searchParams.get('page') ? searchParams.get('page') : 1,
                    limit: searchParams.get('limit') ? searchParams.get('limit') : pageLimit,
                    storeId: storeIdFromUrl,
                    rmn: realmName,
                    tab: STORE_SETTINGS_TABS_OPTIONS.OVERVIEW,
                    storeType: storeType,
                    isDistributor: isDistributor,
                })
            }
        }
    }, [searchParams, hideActionButton, permissionValue])

    console.log('isDistributor---->', typeof isDistributor)

    return (
        <div>
            <HeaderForTitle
                title={
                    <div className='flex w-[85vw] my-3'>
                        <div className='w-[75%] gap-2 !mt-2 flex'>
                            <div>
                                <img src={storeDefaultImage} alt='storeDefaultImage' className='aspect-square !mt-2' />
                            </div>

                            <div className='flex flex-col gap-2'>
                                <div className='flex items-baseline gap-2'>
                                    <h2 className='font-semibold text-2xl'>{storeName}</h2>
                                    <Badge
                                        variant={changeSwitchStatus === 1 ? 'green' : 'secondary'}
                                        className='rounded-xl'>
                                        {changeSwitchStatus === 1 ? `${t('labels:active')}` : `${t('labels:inactive')}`}
                                    </Badge>
                                </div>
                                <div>
                                    {storeType === 'distributor' ? (
                                        <Badge className='bg-[#E6F4FF] border-[#91CAFF] text-[#0958D9] rounded-[5px] '>
                                            <Star className='w-3 h-3 mr-1' fill='#0958D9' strokeWidth={0} />{' '}
                                            {t('labels:distributor')}
                                        </Badge>
                                    ) : (
                                        <Badge className='mt-1 bg-[#E6FFFB] border-[#87E8DE] text-[#08979C] rounded-[5px]'>
                                            {t('labels:partner')}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className='flex items-center gap-2 mt-3 mx-2 justify-end'>
                            <h2 className='text-brandGray2'>{t('labels:status')} :</h2>
                            <Status
                                storeId={id}
                                storeStatus={changeSwitchStatus === 1}
                                storeApiData={storeData}
                                setStoreApiData={setStoreData}
                                className='inline-block'
                                disableStatus={disableStatus}
                                statusInprogress={duplicateStoreStatus}
                                setDuplicateStoreStatus={setDuplicateStoreStatus}
                                setPreviousStatus={setPreviousStatus}
                                previousStatus={previousStatus}
                                isDistributor={JSON.parse(isDistributor)}
                            />
                        </div>
                    </div>
                }
                backNavigationPath={`/dashboard/store?m_t=1`}
                showArrowIcon={true}
                showButtons={false}
                className='min-h-20'
            />

            <div className='!px-6 !pb-6  !mt-[12.5rem]'>
                <div className=' w-full bg-white rounded shadow-brandShadow flex p-3 justify-start'>
                    <div className=' py-5 h-full px-1 '>
                        {permissionValue?.length > 0 ? (
                            permissionValue?.includes('UI-product-admin') === true ? (
                                // <Tabs
                                //     items={hideStoreSettingsTabData}
                                //     tabPosition={'left'}
                                //     defaultActiveKey={STORE_SETTINGS_TABS_OPTIONS.STORE_RESTRICTIONS}
                                //     activeKey={
                                //         searchParams.get('tab') || STORE_SETTINGS_TABS_OPTIONS.STORE_RESTRICTIONS
                                //     }
                                //     onTabClick={handelMyProfileTabChange}
                                //     type='line'
                                //     className=' !h-full '
                                // />
                                <Tabs
                                    value={searchParams.get('tab') || STORE_SETTINGS_TABS_OPTIONS.STORE_RESTRICTIONS}
                                    onValueChange={handelMyProfileTabChange}
                                    className='h-full'
                                    orientation='vertical'>
                                    <TabsList className='!h-full px-3' orientation='vertical'>
                                        {hideStoreSettingsTabData.map((tab) => (
                                            <TabsTrigger key={tab.key} value={tab.key} borderPosition='right'>
                                                {tab.label}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>

                                    {hideStoreSettingsTabData.map((tab) => (
                                        <TabsContent key={tab.key} value={tab.key}>
                                            {tab.content}
                                        </TabsContent>
                                    ))}
                                </Tabs>
                            ) : (
                                // <Tabs
                                //     items={storeSettingsTabData}
                                //     tabPosition={'left'}
                                //     defaultActiveKey={STORE_SETTINGS_TABS_OPTIONS.OVERVIEW}
                                //     activeKey={searchParams.get('tab') || STORE_SETTINGS_TABS_OPTIONS.OVERVIEW}
                                //     onTabClick={handelMyProfileTabChange}
                                //     type='line'
                                //     className=' !h-full '
                                // />
                                <Tabs
                                    value={searchParams.get('tab') || STORE_SETTINGS_TABS_OPTIONS.OVERVIEW}
                                    onValueChange={handelMyProfileTabChange}
                                    className='h-full px-3'
                                    orientation='vertical'>
                                    <TabsList className=' flex flex-col !h-full space-y-3' orientation='vertical'>
                                        {storeSettingsTabData.map((tab) => (
                                            <TabsTrigger key={tab.key} value={tab.key} borderPosition='right'>
                                                {tab.label}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                    {/* Content Area */}
                                    <div className=''>
                                        {storeSettingsTabData.map((tab) => (
                                            <TabsContent key={tab.key} value={tab.key}>
                                                {tab.content}
                                            </TabsContent>
                                        ))}
                                    </div>
                                </Tabs>
                            )
                        ) : null}
                    </div>
                    <div className='w-full'>
                        {searchParams.get('tab') === STORE_SETTINGS_TABS_OPTIONS.OVERVIEW && (
                            <>{hideActionButton ? '' : <StoreOverview realmName={realmName} />}</>
                        )}
                        {searchParams.get('tab') === STORE_SETTINGS_TABS_OPTIONS.MEDIA && (
                            <>
                                {disableMediaButton ? (
                                    ''
                                ) : isUpLoading ? (
                                    <Spin />
                                ) : (
                                    <div className='bg-white p-3 !rounded-md border my-4'>
                                        <label className='text-lg mb-3 font-semibold text-regal-blue'>
                                            {t('labels:media')}
                                        </label>
                                        <div class='flex space-x-4'>
                                            <div className='my-3'>
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
                                            </div>
                                        </div>
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
                                        <div className='mt-4'>
                                            <div className='gap-2 flex'>
                                                <Button
                                                    disabled={imagesUpload && imagesUpload.length > 0 ? false : true}
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
                                                <Button
                                                    variant='outline'
                                                    disabled={imagesUpload && imagesUpload.length > 0 ? false : true}
                                                    onClick={() => {
                                                        navigate('/dashboard/store?m_t=1')
                                                    }}>
                                                    {t('labels:discard')}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
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
        </div>
    )
}

export default StoreSettingsLayout
