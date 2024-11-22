import React, { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { Info } from 'lucide-react'
import { Link, useLocation, useSearchParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { saveStoreConfirmationImage, ExclamationCircle, storeDefaultImage } from '../../constants/media'
//! Import user defined components
import HeaderForTitle from '../../components/header/HeaderForTitle'
import StoreModal from '../../components/storeModal/StoreModal'
import { usePageTitle } from '../../hooks/usePageTitle'
import MarketplaceServices from '../../services/axios/MarketplaceServices'
import Status from './Status'
import MarketplaceToaster from '../../util/marketplaceToaster'
import util from '../../util/common'
import AddStores from './AddStores'

import { Toggle } from '../../shadcnComponents/ui/toggle'
import { useAuth } from 'react-oidc-context'
import { Alert, AlertTitle, AlertDescription } from '../../shadcnComponents/ui/alert'
import ShadCNDataTable from '../../shadcnComponents/customComponents/ShadCNDataTable'
import { Plus, Star } from 'lucide-react'
import { Badge } from '../../shadcnComponents/ui/badge'
import ShadCNPagination from '../../shadcnComponents/customComponents/ShadCNPagination'
import ShadCNTooltip from '../../shadcnComponents/customComponents/ShadCNTooltip'
import { Button } from '../../shadcnComponents/ui/button'
import SearchInput from './SearchInput'
import { PAGE_NUMBER_TO_SEARCH } from '../../constants/constants'
import { Avatar, AvatarFallback, AvatarImage } from '../../shadcnComponents/ui/avatar'
import { ShadCNTabs, ShadCNTabsTrigger } from '../../shadcnComponents/customComponents/ShadCNTabs'
import { Skeleton } from '../../shadcnComponents/ui/skeleton'
import Spin from '../../shadcnComponents/customComponents/Spin'
import ThresholdConfiguration from './ThresholdConfiguration'

//! Get all required details from .env file
const storeAPI = process.env.REACT_APP_STORE_API
const pageLimit = parseInt(process.env.REACT_APP_ITEM_PER_PAGE)

const emailRegexPattern = process.env.REACT_APP_REGEX_PATTERN_EMAIL
const searchMaxLength = process.env.REACT_APP_SEARCH_MAX_LENGTH
const domainName = process.env.REACT_APP_DOMAIN_NAME

const Stores = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    usePageTitle(t('labels:stores'))
    const search = useLocation().search
    const m_tab_id = new URLSearchParams(search).get('m_t')
    const tab = new URLSearchParams(search).get('tab')
    const [searchParams, setSearchParams] = useSearchParams()
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isUpLoading, setIsUpLoading] = useState(false)
    const [isNetworkError, setIsNetworkError] = useState(false)
    const [storeApiData, setStoreApiData] = useState([])
    const [name, setName] = useState('')
    const [inValidName, setInValidName] = useState('')
    const [drawerAction, setDrawerAction] = useState()
    const [postData, setPostData] = useState(null)
    const [selectedTabTableContent, setSelectedTabTableContent] = useState([])
    const [storeEmail, setStoreEmail] = useState('')
    const [storeUserName, setStoreUserName] = useState('')
    const [inValidEmail, setInValidEmail] = useState(false)
    const [inValidUserName, setInValidUserName] = useState(false)
    const [isDeleteStoreModalOpen, setIsDeleteStoreModalOpen] = useState(false)
    const [deleteStoreID, setDeleteStoreID] = useState('')
    const [activeCount, setActiveCount] = useState('')
    const [onChangeValues, setOnChangeValues] = useState(false)
    const [currentTab, setCurrentTab] = useState(1)
    const [countForStore, setCountForStore] = useState()
    const [isStoreDeleting, setIsStoreDeleting] = useState(false)
    const [hideAddStoreButton, setHideAddStoreButton] = useState(false)
    const [saveStoreModalOpen, setSaveStoreModalOpen] = useState(false)
    const [storeStatusLoading, setStoreStatusLoading] = useState(false)
    const [storeId, setStoreId] = useState()
    const [statusInprogressData, setStatusInprogressData] = useState([])
    const [value, setValue] = useState(0)
    const [previousStatus, setPreviousStatus] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const [isSearchTriggered, setIsSearchTriggered] = useState(false)
    const [storeType, setStoreType] = useState('partner')
    const [isDistributor, setIsDistributor] = useState(false)
    const [isOpenModalForMakingDistributor, setIsOpenModalForMakingDistributor] = useState(false)
    const [inValidEmailFormat, setInValidEmailFormat] = useState(false)
    const [isDistributorStoreActive, setIsDistributorStoreActive] = useState(false)

    const auth = useAuth()
    const permissionValue = util.getPermissionData() || []

    const handleToggleChange = (selectedValue) => {
        console.log('Toggle changed to:', selectedValue)
        setSearchValue('')
        setValue(selectedValue)
        setSearchParams({
            m_t: m_tab_id !== null ? m_tab_id : 1,
            tab: selectedValue,
            page: 1,
            limit: parseInt(searchParams.get('limit')) || pageLimit,
        })
    }

    useEffect(() => {
        setHideAddStoreButton(
            !auth.isAuthenticated ||
                (auth.isAuthenticated &&
                    permissionValue &&
                    permissionValue.length > 0 &&
                    permissionValue.includes('UI-product-admin'))
                ? true
                : false
        )
    }, [auth, permissionValue])

    //! table columns
    const StoreTableColumn = [
        {
            header: `${t('labels:store_name')}`,
            value: 'name',
            ellipsis: true,
            render: (text, record) => {
                return (
                    <>
                        <div className='flex items-center'>
                            <div className=''>
                                <Avatar className='mx-2'>
                                    <AvatarImage src={storeDefaultImage} alt='Avatar' className />
                                    <AvatarFallback>Avatar</AvatarFallback>
                                </Avatar>
                                {/* <img src={storeDefaultImage} alt='storeDefaultImage' className='aspect-square mt-1' /> */}
                            </div>
                            <div className='ml-0 space-y-1'>
                                <div>
                                    <p
                                        className=' !max-w-[150px]'
                                        ellipsis={{ tooltip: record.name }}
                                        disabled={record.status === 3 ? true : false}>
                                        {record.name}
                                    </p>
                                </div>
                                <div>
                                    {record.isDistributor ? (
                                        <Badge className='bg-[#E6F4FF] border-[#91CAFF] text-[#0958D9] rounded-[5px] flex items-center'>
                                            <Star className='w-3 h-3 mr-1' fill='#0958D9' strokeWidth={0} />{' '}
                                            {t('labels:distributor')}
                                        </Badge>
                                    ) : (
                                        <Badge className='bg-[#E6FFFB] border-[#87E8DE] text-[#08979C] rounded-[5px]'>
                                            {t('labels:partner')}
                                        </Badge>
                                    )}{' '}
                                    {!isDistributor && (
                                        <ShadCNTooltip content={t('messages:store_type_info')}>
                                            <img
                                                src={ExclamationCircle}
                                                alt='ExclamationCircleIcon'
                                                width={15}
                                                height={15}
                                            />
                                        </ShadCNTooltip>
                                    )}
                                </div>
                                {record.status === 3 ? (
                                    <div className='flex items-center space-x-1'>
                                        {storeStatusLoading && (
                                            <div className='w-4 h-4 border-2 border-blue-500 border-t-transparent border-solid rounded-full animate-spin'></div>
                                        )}
                                        <div className='h-1.5 w-1.5 rounded-full bg-blue-500'></div>
                                        <p>{t('labels:processing')}</p>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </>
                )
            },
        },
        {
            header: `${t('labels:status')}`,
            value: 'status',
            key: 'status',
            render: (text, record) => {
                return (
                    <Status
                        storeId={record.id}
                        storeStatus={record.status === 1 ? true : false}
                        tabId={value}
                        storeApiData={storeApiData}
                        setSelectedTabTableContent={setSelectedTabTableContent}
                        selectedTabTableContent={selectedTabTableContent}
                        setStoreApiData={setStoreApiData}
                        activeCount={activeCount}
                        setActiveCount={setActiveCount}
                        disableStatus={hideAddStoreButton}
                        statusInprogress={record.status}
                        setStatusInprogressData={setStatusInprogressData}
                        statusInprogressData={statusInprogressData}
                        setPreviousStatus={setPreviousStatus}
                        previousStatus={previousStatus}
                        isDistributor={record.isDistributor}
                    />
                )
            },
        },
        {
            header: `${t('labels:created_date_and_time')}`,
            value: 'updated_on',
            key: 'updated_on',
            render: (text, record) => {
                return (
                    // <p disabled={record.status === 3 ? true : false} className=''>
                    new Date(record.updated_on).toLocaleString()
                    // {/* </p> */}
                )
            },
        },
        {
            header: `${t('labels:action')}`,
            value: '',
            render: (text, record) => {
                return (
                    <>
                        {hideAddStoreButton ? (
                            <Link
                                to={{
                                    pathname: 'storesetting',
                                    search: `?id=${record.id}&page=${
                                        searchParams.get('page') ? searchParams.get('page') : 1
                                    }&limit=${
                                        searchParams.get('limit') ? searchParams.get('limit') : pageLimit
                                    }&storeId=${record.storeId}`,
                                }}
                                style={{ textDecoration: 'none' }}
                                // className=" pl-[10px] font-semibold app-table-data-title"
                            >
                                <ShadCNTooltip content={t('labels:view_details')}>
                                    {t('labels:view_details')}
                                </ShadCNTooltip>
                            </Link>
                        ) : (
                            <Button
                                type='text'
                                className='app-btn-icon'
                                variant='ghost'
                                disabled={record.status === 3 ? true : false}
                                onClick={() => {
                                    navigate(
                                        `/dashboard/store/storesetting?id=${record.id}&page=${
                                            searchParams.get('page') ? searchParams.get('page') : 1
                                        }&limit=${
                                            searchParams.get('limit') ? searchParams.get('limit') : pageLimit
                                        }&storeId=${record.storeId}&rmn=${record.realmName}&storeType=${record.isDistributor ? 'distributor' : 'partner'}&isDistributor=${record.isDistributor}`
                                    )
                                }}>
                                <svg
                                    width='14'
                                    height='14'
                                    viewBox='0 0 14 14'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'>
                                    <path
                                        d='M3.02644 10.75C3.05769 10.75 3.08894 10.7469 3.12019 10.7422L5.74832 10.2813C5.77957 10.275 5.80925 10.261 5.83113 10.2375L12.4546 3.61411C12.4691 3.59965 12.4805 3.58248 12.4884 3.56358C12.4962 3.54468 12.5003 3.52442 12.5003 3.50395C12.5003 3.48349 12.4962 3.46323 12.4884 3.44432C12.4805 3.42542 12.4691 3.40825 12.4546 3.3938L9.85769 0.795358C9.828 0.765671 9.78894 0.750046 9.74675 0.750046C9.70457 0.750046 9.6655 0.765671 9.63582 0.795358L3.01238 7.4188C2.98894 7.44223 2.97488 7.47036 2.96863 7.50161L2.50769 10.1297C2.49249 10.2134 2.49792 10.2996 2.52351 10.3807C2.54911 10.4619 2.59409 10.5355 2.65457 10.5954C2.75769 10.6954 2.88738 10.75 3.02644 10.75ZM4.07957 8.02505L9.74675 2.35942L10.8921 3.50473L5.22488 9.17036L3.83582 9.41567L4.07957 8.02505ZM12.7499 12.0625H1.24988C0.973315 12.0625 0.749878 12.286 0.749878 12.5625V13.125C0.749878 13.1938 0.806128 13.25 0.874878 13.25H13.1249C13.1936 13.25 13.2499 13.1938 13.2499 13.125V12.5625C13.2499 12.286 13.0264 12.0625 12.7499 12.0625Z'
                                        fill='#023047'
                                    />
                                </svg>
                            </Button>
                        )}
                    </>
                )
            },
        },
    ]

    //!storeData to get the table data
    const tableStoreData = (filteredData) => {
        const tempArray = []
        filteredData &&
            filteredData.length > 0 &&
            filteredData.map((element, index) => {
                var storeActualId = element.id
                var storeId = element.store_uuid
                var storeName = element.name
                var createdOn = element.created_on
                var updatedOn = element.updated_on
                var storeStatus = element.status
                var realmName = element.realmname
                var isDistributor = element.distributor_store
                tempArray &&
                    tempArray.push({
                        key: index,
                        name: storeName,
                        id: storeId,
                        created_on: createdOn,
                        updated_on: updatedOn,
                        status: storeStatus,
                        storeId: storeActualId,
                        realmName: realmName,
                        isDistributor: isDistributor,
                    })
            })
        setSelectedTabTableContent(tempArray)
    }

    //!this useEffect for tab(initial rendering)
    useEffect(() => {
        if (storeApiData && storeApiData.length > 0 && !isLoading) {
            setIsLoading(false)
            tableStoreData(storeApiData)
        } else {
            setSelectedTabTableContent([])
        }
    }, [storeApiData])

    //! add drawer
    const showAddDrawer = () => {
        setOpen(true)
        setDrawerAction('post')
        setInValidName(false)
        setInValidEmail(false)
        setInValidUserName(false)
        setOnChangeValues(false)
    }

    const onClose = () => {
        setOpen(false)
        setName('')
        setStoreEmail('')
        setStoreUserName('')
        setStoreType('partner')
        setOnChangeValues(false)
    }

    //! closing the delete popup model
    const closeDeleteModal = () => {
        setIsDeleteStoreModalOpen(false)
    }

    //!get call for stores
    const findByPageStoreApi = (pageNumber, pageLimit, storeStatus, searchKey) => {
        setIsLoading(true)
        let params = {}
        params['status'] = storeStatus ? storeStatus : null
        if (searchKey) {
            params['search'] = String(searchKey)
            setIsSearchTriggered(true)
        }
        MarketplaceServices.findByPage(
            storeAPI,
            params,
            searchKey ? PAGE_NUMBER_TO_SEARCH : pageNumber,
            pageLimit,
            false
        )
            .then(function (response) {
                setActiveCount({
                    totalStores:
                        response.data.response_body.active_stores + response.data.response_body.inactive_stores,
                    activeStores: response.data.response_body.active_stores,
                    inactiveStores: response.data.response_body.inactive_stores,
                })
                const filteredData =
                    response &&
                    response.data.response_body &&
                    response.data.response_body.data.filter(
                        (ele) => ele.status === 3 || ele.status === 4 || ele.status === 5
                    )
                setStatusInprogressData(filteredData)
                console.log('filteredData', filteredData)
                setIsNetworkError(false)
                setIsLoading(false)
                console.log('Server Response from findByPageStoreApi Function: ', response.data.response_body)
                setStoreApiData(response.data.response_body.data)
                setCountForStore(response.data.response_body.count)
                setIsDistributor(response?.data?.response_body?.distributor_store)
                setIsDistributorStoreActive(response?.data?.response_body?.distributor_store_active)
            })
            .catch((error) => {
                setIsLoading(false)
                setIsNetworkError(true)
                console.log('Server error from findByPageStoreApi Function ', error.response)
                if (error && error.response && error.response.status === 401) {
                    MarketplaceToaster.showToast(util.getToastObject(`${t('messages:session_expired')}`, 'error'))
                } else {
                    if (error && error.response === undefined) {
                        setSearchParams({
                            m_t: parseInt(searchParams.get('m_t')),
                        })
                    }
                    if (error.response.data.message === 'That page contains no results') {
                        setSearchParams({
                            m_t: parseInt(searchParams.get('m_t')),
                        })
                    }
                }
            })
    }

    //!useEffect for getting the table in table without refreshing
    useEffect(() => {
        if (postData != null) {
            if (storeApiData.length < pageLimit) {
                const temp = [...storeApiData]
                temp.push(postData)
                setStoreApiData(temp)
            }
            let totalStoresCount = { ...activeCount }
            totalStoresCount['totalStores'] = activeCount.totalStores + 1
            totalStoresCount['inactiveStores'] = activeCount.inactiveStores + 1
            setActiveCount(totalStoresCount)
        }
    }, [postData])

    //! another get call for stores for particular store_uuid
    const findAllStoreData = (statusUUid, id) => {
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

                setSaveStoreModalOpen(false)

                let temp = [...storeApiData]
                let index = temp.findIndex((ele) => ele.id === id)
                temp[index]['status'] = response.data.response_body.data[0].status
                setStoreApiData(temp)

                setInterval(() => {
                    setStoreStatusLoading(false)
                }, 1000)

                if (
                    response.data.response_body.data[0].status === 2 ||
                    response.data.response_body.data[0].status === 1
                ) {
                    let duplicateData = [...statusInprogressData]
                    let temp = duplicateData.filter((ele) => ele.id !== id)
                    if (temp && temp.length > 0) {
                        setStatusInprogressData(temp)
                    } else {
                        setStatusInprogressData([])
                    }
                    const filteredStatusData = previousStatus.filter((ele) => ele.store_id === statusUUid)
                    console.log('filteredStatusData', filteredStatusData)
                    if (response.data.response_body.data[0].status === 1) {
                        // if(previousStatus.filter((ele) => ele.store_id === statusUUid))
                        if (filteredStatusData?.[0]?.status === 4) {
                            MarketplaceToaster.showToast(
                                util.getToastObject(
                                    `${t('messages:your_store_has_been_successfully_activated')}`,
                                    'success'
                                )
                            )
                            let filterStatus = previousStatus.filter((ele) => ele.store_id !== statusUUid)
                            setPreviousStatus(filterStatus)
                            if (parseInt(tab) === 1 || parseInt(tab) === 2) {
                                let filterDataBasedOnStatus = storeApiData.filter((ele) => ele.id !== id)
                                if (filterDataBasedOnStatus && filterDataBasedOnStatus.length > 0) {
                                    setStoreApiData(filterDataBasedOnStatus)
                                } else {
                                    setStoreApiData([])
                                }
                            }
                        }
                    } else if (response.data.response_body.data[0].status === 2) {
                        if (filteredStatusData?.[0]?.status === 5) {
                            MarketplaceToaster.showToast(
                                util.getToastObject(
                                    `${t('messages:your_store_has_been_successfully_deactivated')}`,
                                    'success'
                                )
                            )
                            let filterStatus = previousStatus.filter((ele) => ele.store_id !== statusUUid)
                            setPreviousStatus(filterStatus)
                            if (parseInt(tab) === 1 || parseInt(tab) === 2) {
                                let filterDataBasedOnStatus = storeApiData.filter((ele) => ele.id !== id)
                                if (filterDataBasedOnStatus && filterDataBasedOnStatus.length > 0) {
                                    setStoreApiData(filterDataBasedOnStatus)
                                } else {
                                    setStoreApiData([])
                                }
                            }
                        } else if (filteredStatusData?.length === 0) {
                            MarketplaceToaster.showToast(
                                util.getToastObject(
                                    `${t('messages:your_store_has_been_successfully_created')}`,
                                    'success'
                                )
                            )
                        }
                    }
                }
            })
            .catch((error) => {
                setStoreStatusLoading(false)
                console.log('Server error from findByPageStoreApi Function ', error.response)
            })
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (statusInprogressData && statusInprogressData.length > 0) {
                for (var i = 0; i < statusInprogressData.length; i++) {
                    setStoreId(statusInprogressData[i].id)
                    setStoreStatusLoading(true)
                    findAllStoreData(statusInprogressData[i].store_uuid, statusInprogressData[i].id)
                }
            }
        }, 30000)
        return () => clearInterval(intervalId)
    }, [statusInprogressData, storeApiData])

    const validateStorePostField = () => {
        const emailRegex = new RegExp(emailRegexPattern)
        let count = 3
        if (!name || name.length < 3) {
            setInValidName(true)
            count--
        }

        if (!storeEmail || emailRegex.test(storeEmail) === false) {
            setInValidEmail(true)
            if (storeEmail && !emailRegex.test(storeEmail)) {
                setInValidEmailFormat(true)
            }
            count--
        }

        if (!storeUserName || storeUserName.length < 3) {
            setInValidUserName(true)
            count--
        }
        if (count === 3) {
            saveStoreData()
        }
    }

    //! post call for stores
    const saveStoreData = () => {
        const postBody = {
            name: name.trim(),
            username: storeUserName.trim(),
            email: storeEmail.trim(),
            distributor_store: storeType === 'partner' ? false : true,
        }
        setIsUpLoading(true)
        MarketplaceServices.save(storeAPI, postBody)
            .then((response) => {
                setSaveStoreModalOpen(true)
                setIsUpLoading(false)
                onClose()
                setName('')
                setStoreEmail('')
                setStoreUserName('')
                console.log('Server Success Response From stores', response.data.response_body)
                const postFilteredData = [...statusInprogressData]
                postFilteredData.push(response.data.response_body)
                setStatusInprogressData(postFilteredData)
                console.log('postFilteredData', postFilteredData)
                setPostData(response.data.response_body)
            })
            .catch((error) => {
                setIsUpLoading(false)
                MarketplaceToaster.showToast(error.response)
                if (Number(error.response.data.status_code) === 409) {
                    setInValidName(true)
                }

                console.log('Error response from the store post call', error.response)
            })
    }

    useEffect(() => {
        findByPageStoreApi(
            searchParams.get('page') ? parseInt(searchParams.get('page')) : 1,
            searchParams.get('limit') ? parseInt(searchParams.get('limit')) : pageLimit,
            parseInt(searchParams.get('tab')) && parseInt(searchParams.get('tab')) <= 2
                ? parseInt(searchParams.get('tab'))
                : ''
        )
        let mainTab = searchParams.get('m_t')
        if (mainTab === undefined || mainTab === null) {
            setCurrentTab(1)
        } else {
            setCurrentTab(mainTab)
        }
        if (searchParams.get('tab') == null || searchParams.get('tab') == undefined) {
            setValue(0)
        } else {
            setValue(parseInt(searchParams.get('tab')))
        }
        window.scrollTo(0, 0)
    }, [searchParams])

    const handlePageNumberChange = (page, pageSize) => {
        setSearchParams({
            m_t: m_tab_id !== null ? m_tab_id : 1,
            tab: tab === null || tab === '' ? '0' : tab,
            page: parseInt(page) ? parseInt(page) : 1,
            limit: parseInt(pageSize) ? parseInt(pageSize) : pageLimit,
        })
    }
    //!delete function of language
    const removeStore = () => {
        setIsStoreDeleting(true)
        MarketplaceServices.remove(storeAPI, { store_id: deleteStoreID })
            .then((response) => {
                console.log('response from delete===>', response, deleteStoreID)
                MarketplaceToaster.showToast(response)
                setIsDeleteStoreModalOpen(false)
                let removedData = storeApiData.filter(({ store_uuid }) => store_uuid !== deleteStoreID)
                let storeStatus = storeApiData.filter(({ store_uuid }) => store_uuid === deleteStoreID)
                if (storeStatus && storeStatus.length > 0) {
                    let totalStoresCounts = { ...activeCount }
                    if (storeStatus && storeStatus.status === 1) {
                        totalStoresCounts['activeStores'] = activeCount.activeCount - 1
                        totalStoresCounts['totalStores'] = activeCount.totalStores - 1
                        setActiveCount(totalStoresCounts)
                    } else {
                        totalStoresCounts['inactiveStores'] = activeCount.inactiveStores - 1
                        totalStoresCounts['totalStores'] = activeCount.totalStores - 1
                        setActiveCount(totalStoresCounts)
                    }
                }
                setStoreApiData(removedData)
                setCountForStore(countForStore - 1)

                // disabling spinner
                setIsStoreDeleting(false)
            })
            .catch((error) => {
                // disabling spinner
                setIsStoreDeleting(false)
                console.log('response from delete===>', error.response.data)
                MarketplaceToaster.showToast(error.response)
            })
    }
    const handleSearchChange = (searchKey) => {
        setSearchValue(searchKey)
        if (searchKey?.trim()) {
            findByPageStoreApi(
                searchParams.get('page') ? parseInt(searchParams.get('page')) : 1,
                searchParams.get('limit') ? parseInt(searchParams.get('limit')) : pageLimit,
                parseInt(searchParams.get('tab')) && parseInt(searchParams.get('tab')) <= 2
                    ? parseInt(searchParams.get('tab'))
                    : '',
                searchKey?.trimStart()
            )
        } else {
            if (isSearchTriggered) {
                findByPageStoreApi(
                    searchParams.get('page') ? parseInt(searchParams.get('page')) : 1,
                    searchParams.get('limit') ? parseInt(searchParams.get('limit')) : pageLimit,
                    parseInt(searchParams.get('tab')) && parseInt(searchParams.get('tab')) <= 2
                        ? parseInt(searchParams.get('tab'))
                        : '',
                    undefined
                )
                setIsSearchTriggered(false)
            }
        }
    }

    const handleInputChange = (event) => {
        const trimmed = String(event.target.value.trimStart())
        const trimmedUpdate = trimmed.replace(/\s+/g, ' ')
        setSearchValue(trimmedUpdate)
        if (event.target.value == '') {
            if (isSearchTriggered) {
                findByPageStoreApi(
                    searchParams.get('page') ? parseInt(searchParams.get('page')) : 1,
                    searchParams.get('limit') ? parseInt(searchParams.get('limit')) : pageLimit,
                    parseInt(searchParams.get('tab')) && parseInt(searchParams.get('tab')) <= 2
                        ? parseInt(searchParams.get('tab'))
                        : '',
                    undefined
                )
                setIsSearchTriggered(false)
            }
        }
    }

    // const handleStoreTypeChange = (val) => {
    //     if (storeType === 'partner') {
    //         setIsOpenModalForMakingDistributor(true)
    //     } else {
    //         setStoreType(val)
    //     }
    // }
    const handleStoreTypeChangeConfirmation = () => {
        setStoreType('distributor')
        setIsOpenModalForMakingDistributor(false)
    }
    const onCloseStoreTypeChangeModal = () => {
        setIsOpenModalForMakingDistributor(false)
    }

    const customButton = (
        <Button disabled={searchValue?.trim() === ''}>
            <Search className='text-foreground' /> {/* Using Lucide icon */}
        </Button>
    )
    useEffect(() => {
        const tab = searchParams.get('m_t') || '1'
        setCurrentTab(tab)
    }, [searchParams])

    const handleTabChange = (value) => {
        setCurrentTab(value)
        setSearchParams({ m_t: value })
    }

    return (
        <div className=''>
            <HeaderForTitle
                title={
                    <>
                        <h1 className='font-semibold text-2xl mb-4 text-regal-blue'>{t('labels:stores')}</h1>
                        <p className='text-brandGray1 font-normal'>{t('messages:store_desc')}</p>
                    </>
                }
                titleContent={
                    parseInt(currentTab) === 1 &&
                    !hideAddStoreButton && (
                        <Button className='mt-2 h-8 flex items-center' onClick={showAddDrawer}>
                            <Plus className='mr-2 h-4 w-4' />
                            {t('labels:add_store')}
                        </Button>
                    )
                }
                headerContent={
                    <div className='mt-24'>
                        <ShadCNTabs
                            value={currentTab}
                            onValueChange={handleTabChange}
                            direction={util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? 'rtl' : 'ltr'}>
                            <ShadCNTabsTrigger value='1' borderPosition='bottom'>
                                {t('labels:my_stores')}
                            </ShadCNTabsTrigger>
                            <ShadCNTabsTrigger value='2' borderPosition='bottom'>
                                {t('labels:threshold_configuration')}
                            </ShadCNTabsTrigger>
                        </ShadCNTabs>
                    </div>
                }
            />
            <div className='!p-5'>
                <div className=''>
                    {isLoading ? (
                        <div className='bg-white p-3 space-y-4 w-full'>
                            {Array(6)
                                .fill(null)
                                .map((_, index) => (
                                    <Skeleton key={index} className='h-4' />
                                ))}
                        </div>
                    ) : isNetworkError ? (
                        <div className='!mt-[1.7rem] !text-center bg-white p-3 !rounded-md'>
                            {t('messages:store_network_error')}
                        </div>
                    ) : (
                        <>
                            <div className=''>
                                {parseInt(currentTab) === 1 ? (
                                    <div className='bg-white p-3 shadow-brandShadow rounded-md '>
                                        <div className='flex w-full justify-between items-center py-3 px-3'>
                                            <div className='text-base font-semibold text-regal-blue'>
                                                {t('labels:my_stores')}
                                            </div>
                                            <div className='flex items-center justify-end flex-row gap-3 flex-grow'>
                                                <div className='flex flex-row'>
                                                    <Toggle
                                                        className={`${
                                                            util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL'
                                                                ? 'rounded-r-[7px]'
                                                                : 'rounded-l-[7px]'
                                                        } ${value === 0 ? 'border-brandOrange text-brandOrange' : 'border-defaultColor text-defaultColor'}`}
                                                        variant={value === 0 ? 'active' : 'default'}
                                                        checked={value === 0}
                                                        onClick={() => handleToggleChange(0)}>
                                                        {t('labels:all')}
                                                    </Toggle>

                                                    <Toggle
                                                        className={`${value === 1 ? 'border-brandOrange text-brandOrange' : ''}`}
                                                        variant={value === 1 ? 'active' : 'default'}
                                                        checked={value === 1}
                                                        onClick={() => handleToggleChange(1)}>
                                                        {t('labels:active')}
                                                    </Toggle>
                                                    <Toggle
                                                        className={`${
                                                            util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL'
                                                                ? 'rounded-l-[7px]'
                                                                : 'rounded-r-[7px]'
                                                        } ${value === 2 ? 'border-brandOrange text-brandOrange' : ''}`}
                                                        variant={value === 2 ? 'active' : 'default'}
                                                        checked={value === 2}
                                                        onClick={() => handleToggleChange(2)}>
                                                        {t('labels:inactive')}
                                                    </Toggle>
                                                </div>

                                                <SearchInput
                                                    placeholder={t('placeholders:please_enter_search_text_here')}
                                                    onSearch={handleSearchChange}
                                                    onChange={handleInputChange}
                                                    value={searchValue}
                                                    suffix={null}
                                                    maxLength={searchMaxLength}
                                                    enterButton={customButton}
                                                    allowClear
                                                    className={`${
                                                        util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL'
                                                            ? 'text-left'
                                                            : 'text-right'
                                                    } `}
                                                />
                                            </div>
                                        </div>
                                        {selectedTabTableContent?.length === 0 &&
                                        isSearchTriggered &&
                                        searchValue?.length > 0 ? (
                                            <div className='text-center font-semibold ml-2 mt-3 '>
                                                <p>{t('placeholders:not_able_to_find_searched_details')}</p>
                                            </div>
                                        ) : (
                                            <>
                                                {selectedTabTableContent?.length > 0 ? (
                                                    <div className=''>
                                                        {!isDistributor && (
                                                            <div className='px-3 my-2'>
                                                                {/* Distributor Alert 1 */}
                                                                <div className='px-3 my-2'>
                                                                    <Alert
                                                                        variant='default'
                                                                        className='flex items-center !w-full'>
                                                                        <Info className='text-foreground w-4' />{' '}
                                                                        {/* Icon */}
                                                                        <div className='ml-2'>
                                                                            <AlertTitle>
                                                                                <p className='text-brandGray1'>
                                                                                    {t(
                                                                                        'messages:no_distributor_store_present_info'
                                                                                    )}
                                                                                </p>
                                                                            </AlertTitle>
                                                                        </div>
                                                                    </Alert>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {isDistributor === true &&
                                                            isDistributorStoreActive === false && (
                                                                <div className='px-3 my-2'>
                                                                    {/* Alert 2  */}
                                                                    <div className='px-3 my-2'>
                                                                        <Alert
                                                                            variant='default'
                                                                            className='flex items-center !w-full'>
                                                                            <Info className='text-foreground w-4' />{' '}
                                                                            {/* Icon */}
                                                                            <div className='ml-2'>
                                                                                <AlertTitle>
                                                                                    {t(
                                                                                        'messages:distributor_store_inactive_msg'
                                                                                    )}
                                                                                </AlertTitle>
                                                                                <AlertDescription>
                                                                                    <p className='text-brandGray1'>
                                                                                        {t(
                                                                                            'messages:distributor_store_inactive_msg'
                                                                                        )}
                                                                                    </p>
                                                                                </AlertDescription>
                                                                            </div>
                                                                        </Alert>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        <ShadCNDataTable
                                                            columns={StoreTableColumn}
                                                            data={selectedTabTableContent}
                                                        />
                                                        {parseInt(m_tab_id) === 1 ? (
                                                            <div className=' grid justify-items-end mx-3 h-fit'>
                                                                {countForStore && countForStore >= pageLimit ? (
                                                                    <ShadCNPagination
                                                                        totalItemsCount={countForStore}
                                                                        handlePageNumberChange={handlePageNumberChange}
                                                                        currentPage={
                                                                            parseInt(searchParams.get('page'))
                                                                                ? parseInt(searchParams.get('page'))
                                                                                : 1
                                                                        }
                                                                        itemsPerPage={
                                                                            parseInt(searchParams.get('limit'))
                                                                                ? parseInt(searchParams.get('limit'))
                                                                                : pageLimit
                                                                        }
                                                                        showQuickJumper={true}
                                                                    />
                                                                ) : null}
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                ) : (
                                                    <div className='flex justify-center items center pb-4'>
                                                        <p>{t('messages:no_data_available')}</p>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                ) : parseInt(currentTab) === 2 ? (
                                    <>
                                        <ThresholdConfiguration
                                            currentTab={currentTab}
                                            setCurrentTab={setCurrentTab}
                                            hideAddStoreButton={hideAddStoreButton}
                                        />
                                    </>
                                ) : (
                                    <div className='!mt-[1.7rem] !text-center bg-white p-3 !rounded-md'>
                                        {t('messages:store_network_error')}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
            <StoreModal isVisible={saveStoreModalOpen} isSpin={false} hideCloseButton={false} width={800}>
                {
                    <div className='!text-center'>
                        <p className=' text-lg leading-[26px] font-bold text-regal-blue'>
                            {t('labels:building_store')}
                        </p>
                        <div className='mt-5 mb-3'>
                            <img
                                src={saveStoreConfirmationImage}
                                alt='saveStoreConfirmationImage'
                                className='ml-[220px]'
                            />
                        </div>
                        <div className='!text-brandGray1'>
                            <p className='!mb-0  '>{t('messages:hang_tight_as_we_conjure_up_store')}</p>
                            <p className='!mb-0'>{t('messages:swing_by_in_a_bit_to_witness_the_magic_unfolding')}</p>
                            <p>{t('messages:thanks_for_your_patience')}</p>
                        </div>
                        <Button
                            className='app-btn-primary'
                            onClick={() => {
                                setSaveStoreModalOpen(false)
                            }}>
                            {t('labels:close_message')}
                        </Button>
                    </div>
                }
            </StoreModal>
            <StoreModal
                isVisible={isDeleteStoreModalOpen}
                okButtonText={t('labels:yes')}
                cancelButtonText={t('labels:cancel')}
                title={t('labels:warning')}
                okCallback={() => removeStore()}
                cancelCallback={() => closeDeleteModal()}
                isSpin={isStoreDeleting}
                hideCloseButton={false}>
                {
                    <div>
                        <p>{t('messages:confirm_store_deletion')}</p>
                        <p>{t('messages:store_deletion_confirmation_message')}</p>
                    </div>
                }
            </StoreModal>
            <StoreModal
                title={t('labels:add_store')}
                isVisible={open}
                okButtonText={null}
                cancelButtonText={null}
                okCallback={() => validateStorePostField()}
                hideCloseButton={true}
                cancelCallback={() => onClose()}
                isSpin={isUpLoading}
                width={800}
                height={600}
                isScroll={false}>
                <div className='overflow-y-auto !h-auto'>
                    {drawerAction && drawerAction === 'post' ? (
                        <>
                            <AddStores
                                onClose={onClose}
                                validateStorePostField={validateStorePostField}
                                storeUserName={storeUserName}
                                setStoreUserName={setStoreUserName}
                                inValidUserName={inValidUserName}
                                setInValidUserName={setInValidUserName}
                                storeEmail={storeEmail}
                                setStoreEmail={setStoreEmail}
                                inValidEmail={inValidEmail}
                                setInValidEmail={setInValidEmail}
                                inValidEmailFormat={inValidEmailFormat}
                                onChangeValues={onChangeValues}
                                setOnChangeValues={setOnChangeValues}
                                isDistributor={isDistributor}
                                name={name}
                                setName={setName}
                                inValidName={inValidName}
                                setInValidName={setInValidName}
                                domainName={domainName}
                            />
                        </>
                    ) : null}
                </div>
            </StoreModal>
            <StoreModal
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img src={ExclamationCircle} alt='ExclamationCircleIcon' />
                        {t('labels:set_as_distributor_store')}
                    </div>
                }
                isVisible={isOpenModalForMakingDistributor}
                okButtonText={t('labels:set_as_distributor')}
                cancelButtonText={t('labels:cancel')}
                okCallback={() => handleStoreTypeChangeConfirmation()}
                hideCloseButton={true}
                cancelCallback={() => onCloseStoreTypeChangeModal()}
                isSpin={false}
                width={600}
                isScroll={false}>
                <div className='!px-7'>
                    <p>{t('messages:set_as_distributor_store_desc')}</p>
                </div>
            </StoreModal>
        </div>
    )
}
export default Stores
