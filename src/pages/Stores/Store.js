import { UserOutlined, InfoCircleOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import {
    Button,
    Col,
    Divider,
    Drawer,
    Input,
    Layout,
    Row,
    Skeleton,
    Spin,
    Tooltip,
    Typography,
    Radio,
    Tabs,
    Progress,
    InputNumber,
    Alert,
    Badge,
    Empty,
    Table,
} from 'antd'
import React, { useEffect, useState } from 'react'
import validator from 'validator'
import { MdInfo, MdSettings } from 'react-icons/md'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { saveStoreConfirmationImage } from '../../constants/media'
//! Import user defined components
import DmPagination from '../../components/DmPagination/DmPagination'
import DynamicTable from '../../components/DynamicTable/DynamicTable'
import HeaderForTitle from '../../components/header/HeaderForTitle'
import StoreModal from '../../components/storeModal/StoreModal'
import { usePageTitle } from '../../hooks/usePageTitle'
import MarketplaceServices from '../../services/axios/MarketplaceServices'
import Status from './Status'
import MarketplaceToaster from '../../util/marketplaceToaster'
import util from '../../util/common'

import axios from 'axios'
import { useAuth } from 'react-oidc-context'
import { validatePositiveNumber } from '../../util/validation'

const { Content } = Layout
const { Title, Text } = Typography
const { Search } = Input
//! Get all required details from .env file
const storeAPI = process.env.REACT_APP_STORE_API
const pageLimit = parseInt(process.env.REACT_APP_ITEM_PER_PAGE)
const emailMinLength = process.env.REACT_APP_EMAIL_MIN_LENGTH
const emailMaxLength = process.env.REACT_APP_EMAIL_MAX_LENGTH
const storeNameMinLength = process.env.REACT_APP_STORE_NAME_MIN_LENGTH
const storeNameMaxLength = process.env.REACT_APP_STORE_NAME_MAX_LENGTH
const userNameMinLength = process.env.REACT_APP_USERNAME_MIN_LENGTH
const userNameMaxLength = process.env.REACT_APP_USERNAME_MAX_LENGTH
const storeLimitApi = process.env.REACT_APP_STORE_PLATFORM_LIMIT_API
const dm4sightAnalysisCountAPI = process.env.REACT_APP_4SIGHT_GETANALYSISCOUNT_API
const dm4sightClientID = process.env.REACT_APP_4SIGHT_CLIENT_ID
const dm4sightBaseURL = process.env.REACT_APP_4SIGHT_BASE_URL
const currentUserDetailsAPI = process.env.REACT_APP_USER_PROFILE_API
const maxDataLimit = process.env.REACT_APP_MAX_DATA_LIMIT
const emailRegexPattern = process.env.REACT_APP_REGEX_PATTERN_EMAIL
const searchMaxLength = process.env.REACT_APP_SEARCH_MAX_LENGTH

const Stores = () => {
    const { t } = useTranslation()
    usePageTitle(t('labels:stores'))
    const instance = axios.create()
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
    const [storeLimitValues, setStoreLimitValues] = useState()
    const [duplicateStoreLimitValues, setDuplicateStoreLimitValues] = useState([])
    const [analysisCount, setAnalysisCount] = useState()
    const [countForStore, setCountForStore] = useState()
    const [isStoreDeleting, setIsStoreDeleting] = useState(false)
    const [superAdmin, setSuperAdmin] = useState(false)
    const [hideAddStoreButton, setHideAddStoreButton] = useState(false)
    const [saveStoreModalOpen, setSaveStoreModalOpen] = useState(false)
    const [storeStatusLoading, setStoreStatusLoading] = useState(false)
    const [storeId, setStoreId] = useState()
    const [statusInprogressData, setStatusInprogressData] = useState([])
    const [value, setValue] = useState(0)
    const [previousStatus, setPreviousStatus] = useState([])
    const [errorField, setErrorField] = useState('')
    const [searchValue, setSearchValue] = useState('')
    const [isSearchTriggered, setIsSearchTriggered] = useState(false)
    const auth = useAuth()
    const permissionValue = util.getPermissionData() || []
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

    const handleRadioChange = (e) => {
        setSearchValue('')
        setValue(e.target.value)
        setSearchParams({
            m_t: m_tab_id,
            tab: e.target.value,
            page: 1,
            limit: parseInt(searchParams.get('limit')) ? parseInt(searchParams.get('limit')) : pageLimit,
        })
        console.log('object status', e.target.value)
    }

    useEffect(() => {
        setErrorField('')
    }, [currentTab])

    useEffect(() => {
        getCurrentUserDetails()
    }, [])

    useEffect(() => {
        if (parseInt(currentTab) === 2) {
            console.log('storeLimitApi', storeLimitApi)
            MarketplaceServices.findAll(storeLimitApi)
                .then(function (response) {
                    console.log('Server Response from store limit API: ', response.data.response_body)
                    setStoreLimitValues(response.data.response_body)
                    setDuplicateStoreLimitValues(response.data.response_body)
                })
                .catch((error) => {
                    // setIsLoading(false);
                    console.log('Server error from store limit API ', error.response)
                })

            instance.get(dm4sightBaseURL + dm4sightAnalysisCountAPI, dm4sightHeaders).then((res) => {
                setAnalysisCount(res.data)
                console.log('redddd', res)
            })
        }
        // setValue(0);
    }, [currentTab])

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

    const StoreTableColumnThreshold1 = [
        {
            title: `${t('labels:limits')}`,
            dataIndex: 'limits',
            key: 'limits',
            width: '30%',
            render: (text) => {
                const [limitName, limitValue, keyName, tooltip] = text.split(',')
                return (
                    <Content className='flex flex-col gap-2'>
                        <div className='flex gap-2 items-center text-[#8899A8]'>
                            {limitName}
                            <Tooltip
                                overlayStyle={{ zIndex: 1 }}
                                title={tooltip}
                                placement={
                                    util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? 'left' : 'right'
                                }>
                                <InfoCircleOutlined />
                            </Tooltip>
                        </div>

                        <InputNumber
                            value={storeLimitValues?.[keyName] > 0 ? storeLimitValues?.[keyName] : ''}
                            min={0}
                            max={maxDataLimit}
                            maxLength={10}
                            onKeyDown={(e) => {
                                validatePositiveNumber(e, /[0-9]/)
                            }}
                            status={keyName === errorField ? 'error' : ''}
                            onFocus={() => {
                                setErrorField('')
                            }}
                            onChange={(value) => {
                                let copyofStoreLimitValues = { ...storeLimitValues }
                                copyofStoreLimitValues[keyName] = value
                                setStoreLimitValues(copyofStoreLimitValues)
                            }}
                            onPaste={(e) => {
                                e.preventDefault()
                                setErrorField('')

                                const pastedText = e.clipboardData.getData('text/plain')
                                const numericValue = pastedText.replace(/[^0-9]/g, '')
                                const truncatedValue = numericValue.substring(0, 12)

                                // Check if the resulting value is a positive number
                                if (/^[0-9]+$/.test(truncatedValue)) {
                                    let copyOfStoreLimitValues = { ...storeLimitValues }
                                    copyOfStoreLimitValues[keyName] = truncatedValue
                                    setStoreLimitValues(copyOfStoreLimitValues)
                                }
                            }}
                            disabled={!superAdmin}
                            className='w-28'
                            placeholder={t('labels:placeholder_unlimited')}
                        />
                    </Content>
                )
            },
        },

        {
            title: `${t('labels:stats_name')}`,
            dataIndex: 'stats',
            key: 'stats',
            width: '20%',

            render: (text) => {
                const [count, total, keyName] = text.split(',')
                return (
                    <Content>
                        {count === 'undefined' || total === 'undefined' ? null : count !== 'undefined' && total ? (
                            <Content className='flex flex-col'>
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
                                    <Progress
                                        strokeColor={'#FA8C16'}
                                        className='w-24'
                                        size='small'
                                        percent={(count / total) * 100}
                                        showInfo={false}
                                    />
                                ) : null}
                            </Content>
                        ) : (
                            <Spin tip='Loading'></Spin>
                        )}
                    </Content>
                )
            },
        },
    ]

    const StoreTableColumnThreshold2 = [
        {
            title: `${t('labels:limits')}`,
            dataIndex: 'limits',
            key: 'limits',
            width: '30%',
            render: (text) => {
                const [limitName, limitValue, keyName, tooltip] = text.split(',')
                return (
                    <Content className='flex flex-col gap-2'>
                        <div className='flex gap-2 items-center text-[#8899A8]'>
                            {limitName}
                            <Tooltip
                                overlayStyle={{ zIndex: 1 }}
                                title={tooltip}
                                placement={
                                    util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? 'left' : 'right'
                                }>
                                <InfoCircleOutlined />
                            </Tooltip>
                        </div>
                        <Content>
                            <InputNumber
                                value={storeLimitValues?.[keyName] > 0 ? storeLimitValues?.[keyName] : ''}
                                status={keyName === errorField ? 'error' : ''}
                                min={0}
                                max={maxDataLimit}
                                maxLength={10}
                                onFocus={() => {
                                    setErrorField('')
                                }}
                                onKeyDown={(e) => {
                                    validatePositiveNumber(e, /[0-9]/)
                                }}
                                onChange={(value) => {
                                    let copyofStoreimitValues = { ...storeLimitValues }
                                    copyofStoreimitValues[keyName] = value
                                    setStoreLimitValues(copyofStoreimitValues)
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
                                className={'w-28'}
                                placeholder={t('labels:placeholder_unlimited')}
                            />
                        </Content>
                    </Content>
                )
            },
        },
    ]

    //! table columns
    const StoreTableColumn = [
        {
            title: `${t('labels:name')}`,
            dataIndex: 'name',
            key: 'name',
            width: '30%',
            ellipsis: true,
            render: (text, record) => {
                return (
                    <>
                        <Row>
                            <Tooltip title={record.name} placement='bottom'>
                                <Text
                                    className='max-w-xs text-brandGray1'
                                    ellipsis={{ tooltip: record.name }}
                                    disabled={record.status === 3 ? true : false}>
                                    {record.name}
                                </Text>
                            </Tooltip>
                        </Row>
                        {record.status === 3 ? (
                            <Spin spinning={storeStatusLoading}>
                                {console.log('storeId === record.storeId', storeId, record.storeId)}
                                <div
                                    className='flex space-x-2'
                                    // onLoad={handleStoreDataStore(record.id, record.storeId)}
                                >
                                    <Badge status='processing' />
                                    <Text>{t('labels:processing')}</Text>
                                </div>
                            </Spin>
                        ) : null}
                    </>
                )
            },
        },
        {
            title: `${t('labels:status')}`,
            dataIndex: 'status',
            key: 'status',
            width: '20%',
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
                    />
                )
            },
        },
        {
            title: `${t('labels:created_date_and_time')}`,
            dataIndex: 'created_on',
            key: 'created_on',
            width: '30%',
            render: (text, record) => {
                return (
                    <Text disabled={record.status === 3 ? true : false} className='text-brandGray1'>
                        {new Date(record.created_on).toLocaleString()}
                    </Text>
                )
            },
        },
        {
            title: `${t('labels:action')}`,
            dataIndex: '',
            key: '',
            width: '12%',
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
                                <Tooltip
                                    title={t('labels:view_details').length > 20 ? t('labels:view_details') : undefined}>
                                    {t('labels:view_details')}
                                </Tooltip>
                            </Link>
                        ) : (
                            <Button type='text' className='app-btn-text' disabled={record.status === 3 ? true : false}>
                                <Link
                                    to={{
                                        pathname: 'storesetting',
                                        search: `?id=${record.id}&page=${
                                            searchParams.get('page') ? searchParams.get('page') : 1
                                        }&limit=${
                                            searchParams.get('limit') ? searchParams.get('limit') : pageLimit
                                        }&storeId=${record.storeId}&rmn=${record.realmName}`,
                                    }}
                                    className=' !no-underline'>
                                    {/* <Tooltip
                                            overlayStyle={{ zIndex: 1 }}
                                            title={t('labels:store_settings')}
                                            placement='bottom'>
                                            <MdSettings className='text-[var(--mp-primary-border-color)] hover:text-[var(--mp-primary-border-color-h)] !text-xl' /> */}
                                    {/* </Tooltip> */}
                                    <Text
                                        className='text-brandPrimaryColor text-sm font-medium leading-[22px]'
                                        disabled={record.status === 3 ? true : false}>
                                        {t('labels:edit')}
                                    </Text>
                                </Link>
                            </Button>
                        )}
                    </>
                )
            },
        },
    ]

    //!pagination
    const pagination = [
        {
            defaultSize: 10,
            showPageSizeChanger: false,
            pageSizeOptions: ['5', '10'],
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
                var storeStatus = element.status
                var realmName = element.realmname
                tempArray &&
                    tempArray.push({
                        key: index,
                        name: storeName,
                        id: storeId,
                        created_on: createdOn,
                        status: storeStatus,
                        storeId: storeActualId,
                        realmName: realmName,
                    })
            })
        setSelectedTabTableContent(tempArray)
    }

    const tablePropsThreshold1 = {
        table_header: StoreTableColumnThreshold1,
        table_content: [
            {
                key: '1',
                limits: `${t('labels:maximum_store_creation_limit')},${storeLimitValues?.store_limit},store_limit,
        ${t('labels:store_limit_tooltip')}`,
                stats: analysisCount?.store_count + ',' + storeLimitValues?.store_limit + ',' + 'store_limit',
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

    //!this useEffect for tab(initial rendering)
    useEffect(() => {
        if (storeApiData && storeApiData.length > 0 && !isLoading) {
            setIsLoading(false)
            tableStoreData(storeApiData)
        } else {
            setSelectedTabTableContent([])
        }
    }, [storeApiData])

    const storeTableData = {
        table_header: StoreTableColumn,
        table_content: selectedTabTableContent,
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

    const tablePropsThreshold2 = {
        table_header: StoreTableColumnThreshold2,
        table_content: [
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
        MarketplaceServices.findByPage(storeAPI, params, pageNumber, pageLimit, false)
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
        console.log('statusUUid', statusUUid, id)

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

    //! validation for post call
    const validateStorePostField = () => {
        const emailRegex = new RegExp(emailRegexPattern)
        let count = 3
        if (storeEmail === '' && storeUserName === '' && name === '') {
            setInValidEmail(true)
            setInValidUserName(true)
            setInValidName(true)
            count--
            MarketplaceToaster.showToast(
                util.getToastObject(`${t('messages:please_provide_values_for_the_mandatory_fields')}`, 'error')
            )
        } else if (storeEmail === '' && storeUserName === '' && name !== '') {
            setInValidEmail(true)
            setInValidUserName(true)
            count--
            MarketplaceToaster.showToast(
                util.getToastObject(`${t('messages:please_provide_values_for_the_mandatory_fields')}`, 'error')
            )
        } else if (storeEmail !== '' && storeUserName === '' && name === '') {
            setInValidUserName(true)
            setInValidName(true)
            count--
            MarketplaceToaster.showToast(
                util.getToastObject(`${t('messages:please_provide_values_for_the_mandatory_fields')}`, 'error')
            )
        } else if (storeEmail === '' && storeUserName !== '' && name === '') {
            setInValidEmail(true)
            setInValidName(true)
            count--
            MarketplaceToaster.showToast(
                util.getToastObject(`${t('messages:please_provide_values_for_the_mandatory_fields')}`, 'error')
            )
        } else if (storeEmail === '' && storeUserName !== '' && name !== '') {
            setInValidEmail(true)
            count--
            MarketplaceToaster.showToast(
                util.getToastObject(`${t('messages:please_provide_values_for_the_mandatory_fields')}`, 'error')
            )
        } else if (storeEmail !== '' && storeUserName === '' && name !== '') {
            setInValidUserName(true)
            count--
            MarketplaceToaster.showToast(
                util.getToastObject(`${t('messages:please_provide_values_for_the_mandatory_fields')}`, 'error')
            )
        } else if (storeEmail !== '' && storeUserName !== '' && name === '') {
            setInValidName(true)
            count--
            MarketplaceToaster.showToast(
                util.getToastObject(`${t('messages:please_provide_values_for_the_mandatory_fields')}`, 'error')
            )
        } else if (
            name &&
            validator.isLength(name.trim(), {
                min: storeNameMinLength,
                max: storeNameMaxLength,
            }) === false
        ) {
            setInValidName(true)
            count--
            MarketplaceToaster.showToast(
                util.getToastObject(
                    `${t('messages:store_name_must_contain_minimum_of')} ${storeNameMinLength}, ${t(
                        'messages:maximum_of'
                    )} ${storeNameMaxLength} ${t('messages:characters')}`,
                    'error'
                )
            )
        } else if (storeEmail && emailRegex.test(storeEmail) === false) {
            setInValidEmail(true)
            count--
            MarketplaceToaster.showToast(
                util.getToastObject(`${t('messages:please_enter_the_valid_email_address')}`, 'error')
            )
        } else if (
            storeUserName &&
            validator.isLength(storeUserName.trim(), {
                min: userNameMinLength,
                max: userNameMaxLength,
            }) === false
        ) {
            setInValidUserName(true)
            count--
            MarketplaceToaster.showToast(
                util.getToastObject(
                    `${t('messages:username_must_contain_minimum_of')} ${userNameMinLength}, ${t(
                        'messages:maximum_of'
                    )} ${userNameMaxLength} ${t('messages:characters')}`,
                    'error'
                )
            )
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
                    // setName('')
                    setOnChangeValues(false)
                }
                console.log('Error response from the store post call', error.response)
            })
    }

    //! Post call for the store store limit api
    const saveStoreLimit = () => {
        const postBody = storeLimitValues
        MarketplaceServices.save(storeLimitApi, postBody)
            .then((response) => {
                setDuplicateStoreLimitValues(response.data.response_body)
                console.log('response meeeeeeeeee', response)
                setErrorField('')
                MarketplaceToaster.showToast(response)
            })
            .catch((error) => {
                console.log('Error Response From storelimit', error.response)
                console.log('errory', error.response.data.response_body.message)
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
            MarketplaceToaster.showToast(util.getToastObject(`${t('messages:no_changes_were_detected')}`, 'info'))
        } else {
            saveStoreLimit()
        }
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
            m_t: m_tab_id,
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
                findByPageStoreApi()
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
                findByPageStoreApi()
                setIsSearchTriggered(false)
            }
        }
    }
    const customButton = (
        <Button type='primary' disabled={searchValue?.trim() === '' ? true : false} icon={<SearchOutlined />} />
    )

    return (
        <Content className=''>
            <HeaderForTitle
                title={<div className='!font-semibold text-2xl mb-4 !text-regal-blue'>{t('labels:stores')}</div>}
                titleContent={
                    parseInt(currentTab) === 1 ? (
                        hideAddStoreButton ? (
                            ''
                        ) : (
                            <Button
                                className='app-btn-primary mt-2 !h-[32px] flex items-center'
                                onClick={showAddDrawer}>
                                <PlusOutlined />
                                {t('labels:add_store')}
                            </Button>
                        )
                    ) : null
                }
                headerContent={
                    <Content className='!h-10 !mt-16'>
                        <Tabs
                            activeKey={currentTab}
                            defaultActiveKey='1'
                            items={[
                                {
                                    key: '1',
                                    label: <span className=''>{t('labels:my_stores')}</span>,
                                },
                                {
                                    key: '2',
                                    label: <span className='!mr-3 '>{t('labels:threshold_configuration')}</span>,
                                },
                            ]}
                            onChange={(key) => {
                                setCurrentTab(key)
                                setSearchParams({
                                    m_t: key,
                                })
                            }}
                        />
                    </Content>
                }
            />
            <Drawer
                title={
                    drawerAction && drawerAction === 'post' ? (
                        <div className='text-regal-blue leading-[26px] text-[18px] font-bold'>
                            {t('labels:add_store')}
                        </div>
                    ) : (
                        `${t('labels:edit_store')}`
                    )
                }
                placement={util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? 'left' : 'right'}
                onClose={onClose}
                open={open}
                width={'40%'}>
                {drawerAction && drawerAction === 'post' ? (
                    <>
                        {/* <Row>
                            <Col span={1} className='flex items-start mt-[3px]'>
                                <MdInfo className='!text-[var(--mp-brand-color-h)] text-[16px]' />
                            </Col>
                            <Col span={23} className='align-center mb-3'>
                                <Text className=' mr-1 font-bold'> {t('labels:note')}: </Text>
                                <Text>{t('messages:add_store_description')}</Text>
                            </Col>
                        </Row> */}
                        <Spin tip={t('labels:please_wait')} size='large' spinning={isUpLoading}>
                            <label
                                className='text-[14px] leading-[22px] font-normal text-brandGray2 mb-2 ml-1 '
                                id='labStNam'>
                                {t('labels:store_name')}
                            </label>
                            <span className='mandatory-symbol-color text-sm ml-1'>*</span>
                            <Input
                                placeholder={t('placeholders:enter_store_name')}
                                value={name}
                                minLength={storeNameMinLength}
                                maxLength={storeNameMaxLength}
                                className={`${
                                    inValidName
                                        ? 'border-red-400 border-solid focus:border-red-400 hover:border-red-400 mb-[0.5rem]'
                                        : 'mb-[0.5rem]'
                                }`}
                                onChange={(e) => {
                                    const alphaWithoutSpaces = /^[a-zA-Z0-9]+$/
                                    if (
                                        e.target.value !== '' &&
                                        validator.matches(e.target.value, alphaWithoutSpaces)
                                    ) {
                                        setName(e.target.value)
                                        setOnChangeValues(true)
                                    } else if (e.target.value === '') {
                                        setName(e.target.value)
                                        setOnChangeValues(false)
                                    }
                                    setInValidName(false)
                                }}
                                onBlur={() => {
                                    const trimmed = name.trim()
                                    const trimmedUpdate = trimmed.replace(/\s+/g, ' ')
                                    setName(trimmedUpdate)
                                }}
                            />
                            <div className='font-semibold my-2 text-[18px] leading-[26px] text-regal-blue'>
                                {t('labels:store_administrator_details')}
                            </div>
                            <Alert
                                icon={<MdInfo className='font-bold !text-center' />}
                                message={
                                    <div className=''>
                                        <Text className=' mr-1 text-brandGray1'> {t('labels:note')}:</Text>
                                        <Text className='text-brandGray1'>{t('messages:add_store_description')}</Text>
                                    </div>
                                }
                                type='info'
                                showIcon
                                className='my-3'
                            />
                            <label
                                className='mb-2 ml-1 text-[14px] leading-[22px] font-normal text-brandGray2'
                                id='labStEmail'>
                                {t('labels:email')}
                            </label>
                            <span className='mandatory-symbol-color text-sm ml-1'>*</span>
                            <Input
                                placeholder={t('placeholders:enter_email')}
                                value={storeEmail}
                                minLength={emailMinLength}
                                maxLength={emailMaxLength}
                                className={`${
                                    inValidEmail
                                        ? 'border-red-400 border-solid focus:border-red-400 hover:border-red-400 mb-6'
                                        : 'mb-6'
                                }`}
                                onChange={(e) => {
                                    setInValidEmail(false)
                                    if (e.target.value === '') {
                                        setOnChangeValues(false)
                                        setStoreEmail(e.target.value)
                                    } else {
                                        setOnChangeValues(true)
                                        setStoreEmail(e.target.value.trim())
                                    }
                                }}
                                onBlur={() => {
                                    const trimmed = storeEmail.trim()
                                    const trimmedUpdate = trimmed.replace(/\s+/g, ' ')
                                    setStoreEmail(trimmedUpdate)
                                }}
                            />

                            <label
                                className=' mb-2 ml-1 text-[14px] leading-[22px] font-normal text-brandGray2'
                                id='labStUseName'>
                                {t('labels:username')}
                            </label>
                            <span className='mandatory-symbol-color text-sm ml-1'>*</span>
                            <Input
                                placeholder={t('placeholders:enter_username')}
                                value={storeUserName}
                                minLength={userNameMinLength}
                                maxLength={userNameMaxLength}
                                className={`${
                                    inValidUserName
                                        ? 'border-red-400 border-solid focus:border-red-400 hover:border-red-400 mb-10'
                                        : 'mb-10'
                                }`}
                                prefix={<UserOutlined className='site-form-item-icon' />}
                                onChange={(e) => {
                                    const regex = /^[A-Za-z0-9_\- ]+$/
                                    if (e.target.value !== '' && validator.matches(e.target.value, regex)) {
                                        setInValidUserName(false)
                                        setStoreUserName(String(e.target.value).toLowerCase().trim())
                                        setOnChangeValues(true)
                                    } else if (e.target.value === '') {
                                        setStoreUserName(e.target.value)
                                        setOnChangeValues(false)
                                    }
                                }}
                                onBlur={() => {
                                    const trimmed = storeUserName.trim()
                                    const trimmedUpdate = trimmed.replace(/\s+/g, ' ')
                                    setStoreUserName(trimmedUpdate)
                                }}
                            />
                            <Content className='flex space-x-3 !justify-end'>
                                <Button
                                    className={onChangeValues ? 'app-btn-secondary' : '!opacity-75'}
                                    disabled={!onChangeValues}
                                    onClick={() => {
                                        onClose()
                                    }}>
                                    {t('labels:cancel')}
                                </Button>
                                <Button
                                    className={onChangeValues ? 'app-btn-primary' : '!opacity-75'}
                                    disabled={!onChangeValues}
                                    onClick={() => {
                                        validateStorePostField()
                                    }}>
                                    {t('labels:save')}
                                </Button>
                            </Content>
                        </Spin>
                    </>
                ) : null}
            </Drawer>
            <div className='!p-5'>
                <Content className=''>
                    {isLoading ? (
                        <Skeleton
                            className='px-3 w-full'
                            active
                            paragraph={{
                                rows: 6,
                            }}></Skeleton>
                    ) : isNetworkError ? (
                        <Content className='!mt-[1.7rem] !text-center bg-white p-3 !rounded-md'>
                            {t('messages:store_network_error')}
                        </Content>
                    ) : (
                        <>
                            <Content className=''>
                                {parseInt(currentTab) === 1 ? (
                                    <Content className='bg-white p-3 shadow-brandShadow rounded-md '>
                                        <div className='flex w-full justify-between items-center py-3 px-3'>
                                            <div className='text-base font-semibold text-regal-blue'>
                                                {t('labels:my_stores')}
                                            </div>
                                            <div className='flex items-center justify-end gap-2 flex-row flex-grow'>
                                                <Radio.Group
                                                    className={`min-w-min`}
                                                    optionType='button'
                                                    onChange={handleRadioChange}
                                                    value={value}>
                                                    <Radio value={0}>{t('labels:all')}</Radio>
                                                    <Radio value={1}>{t('labels:active')}</Radio>
                                                    <Radio value={2}>{t('labels:inactive')}</Radio>
                                                </Radio.Group>
                                                <Search
                                                    placeholder={t(
                                                        'placeholders:please_enter_search_text_here'
                                                    )}
                                                    onSearch={handleSearchChange}
                                                    onChange={handleInputChange}
                                                    value={searchValue}
                                                    suffix={null}
                                                    maxLength={searchMaxLength}
                                                    enterButton={customButton}
                                                    allowClear
                                                    className='w-[250px]'
                                                />
                                            </div>
                                        </div>
                                        {selectedTabTableContent?.length === 0 &&
                                        isSearchTriggered &&
                                        searchValue?.length > 0 ? (
                                            <Content className='text-center font-semibold ml-2 mt-3 '>
                                                <Text>{t('placeholders:not_able_to_find_searched_details')}</Text>
                                            </Content>
                                        ) : (
                                            <>
                                                {selectedTabTableContent?.length > 0 ? (
                                                    <Content className='shadow-brandShadow rounded-md bg-white'>
                                                        <div className='flex w-full justify-between items-center py-3 px-3'>
                                                            <div className='text-base font-semibold text-regal-blue'>
                                                                {t('labels:my_stores')}
                                                            </div>
                                                            <div className='flex items-center justify-end gap-2 flex-row flex-grow'>
                                                                <Radio.Group
                                                                    className={`min-w-min`}
                                                                    optionType='button'
                                                                    onChange={handleRadioChange}
                                                                    value={value}>
                                                                    <Radio value={0}>{t('labels:all')}</Radio>
                                                                    <Radio value={1}>{t('labels:active')}</Radio>
                                                                    <Radio value={2}>{t('labels:inactive')}</Radio>
                                                                </Radio.Group>
                                                                <Search
                                                                    placeholder={t(
                                                                        'placeholders:please_enter_search_text_here'
                                                                    )}
                                                                    onSearch={handleSearchChange}
                                                                    onChange={handleInputChange}
                                                                    value={searchValue}
                                                                    suffix={null}
                                                                    maxLength={searchMaxLength}
                                                                    enterButton={customButton}
                                                                    allowClear
                                                                    className='w-[250px]'
                                                                />
                                                            </div>
                                                        </div>
                                                        <DynamicTable tableComponentData={storeTableData} />
                                                        {parseInt(m_tab_id) === 1 ? (
                                                            <Content className=' grid justify-items-end mx-3 h-fit'>
                                                                {countForStore && countForStore >= pageLimit ? (
                                                                    <DmPagination
                                                                        currentPage={
                                                                            parseInt(searchParams.get('page'))
                                                                                ? parseInt(searchParams.get('page'))
                                                                                : 1
                                                                        }
                                                                        presentPage={
                                                                            parseInt(searchParams.get('page'))
                                                                                ? parseInt(searchParams.get('page'))
                                                                                : 1
                                                                        }
                                                                        totalItemsCount={countForStore}
                                                                        defaultPageSize={pageLimit}
                                                                        pageSize={
                                                                            parseInt(searchParams.get('limit'))
                                                                                ? parseInt(searchParams.get('limit'))
                                                                                : pageLimit
                                                                        }
                                                                        handlePageNumberChange={handlePageNumberChange}
                                                                        showSizeChanger={true}
                                                                        showTotal={true}
                                                                        showQuickJumper={true}
                                                                    />
                                                                ) : null}
                                                            </Content>
                                                        ) : null}
                                                    </Content>
                                                ) : (
                                                    <Content className='pb-4'>
                                                        <Empty description={t('messages:no_data_available')} />
                                                    </Content>
                                                )}
                                            </>
                                        )}
                                    </Content>
                                ) : parseInt(currentTab) === 2 ? (
                                    <>
                                        <Content className='shadow-brandShadow rounded-md bg-white mb-3'>
                                            <Title className='!text-regal-blue pt-3 ml-6' level={4}>
                                                {t('labels:account_restrictions')}
                                            </Title>
                                            <Divider className='w-full mt-2 mb-2' />
                                            <DynamicTable tableComponentData={tablePropsThreshold1} />
                                        </Content>
                                        <Content className='shadow-brandShadow rounded-md bg-white'>
                                            <Title className='!text-regal-blue  pt-3 ml-6' level={4}>
                                                {t('labels:store_restrictions')}
                                            </Title>
                                            <Divider className='w-full mt-2 mb-2' />
                                            <DynamicTable tableComponentData={tablePropsThreshold2} />
                                        </Content>
                                        {hideAddStoreButton ? (
                                            <Content className='flex gap-2 !ml-6 !pb-6'>
                                                <Button
                                                    className={'app-btn-primary'}
                                                    onClick={() => validationForSaveStoreLimit()}>
                                                    {t('labels:save')}
                                                </Button>
                                                <Button
                                                    className='app-btn-secondary'
                                                    onClick={() => {
                                                        setCurrentTab(1)
                                                        sessionStorage.setItem('currentStoretab', 1)
                                                    }}>
                                                    {t('labels:discard')}
                                                </Button>
                                            </Content>
                                        ) : (
                                            ''
                                        )}
                                    </>
                                ) : (
                                    <Content className='!mt-[1.7rem] !text-center bg-white p-3 !rounded-md'>
                                        {t('messages:store_network_error')}
                                    </Content>
                                )}
                            </Content>
                        </>
                    )}
                </Content>
            </div>
            <StoreModal isVisible={saveStoreModalOpen} isSpin={false} hideCloseButton={false} width={800}>
                {
                    <Content className='!text-center'>
                        <Text className=' text-lg leading-[26px] font-bold text-regal-blue'>
                            {t('labels:building_store')}
                        </Text>
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
                    </Content>
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
        </Content>
    )
}
export default Stores
