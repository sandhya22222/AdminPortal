import React, { useState, useEffect } from 'react'

import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import HeaderForTitle from '../../components/header/HeaderForTitle'
import MarketplaceServices from '../../services/axios/MarketplaceServices'
import MarketplaceToaster from '../../util/marketplaceToaster'
import util from '../../util/common'
import validator from 'validator'
import { InfoIcon } from '../../constants/media'
import StoreModal from '../../components/storeModal/StoreModal'
import { usePageTitle } from '../../hooks/usePageTitle'
import { Button } from '../../shadcnComponents/ui/button'
import { Input } from '../../shadcnComponents/ui/input'
import { Skeleton } from '../../shadcnComponents/ui/skeleton'
import ShadCNTooltip from '../../shadcnComponents/customComponents/ShadCNTooltip'
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from '../../shadcnComponents/ui/select'
import { Switch } from '../../shadcnComponents/ui/switch'
import Spin from '../../shadcnComponents/customComponents/Spin'
//! Import CSS libraries

const userAPI = process.env.REACT_APP_USERS_API

const groupsAPI = process.env.REACT_APP_GROUPS_API
const userNameMinLength = process.env.REACT_APP_USERNAME_MIN_LENGTH
const userNameMaxLength = process.env.REACT_APP_USERNAME_MAX_LENGTH
const nameMinLength = process.env.REACT_APP_NAME_MIN_LENGTH
const nameMaxLength = process.env.REACT_APP_NAME_MAX_LENGTH
const emailMaxLength = process.env.REACT_APP_EMAIL_MAX_LENGTH
const usersAllAPI = process.env.REACT_APP_USERS_ALL_API
const emailRegexPattern = process.env.REACT_APP_REGEX_PATTERN_EMAIL
const updateUserPreferenceAPI = process.env.REACT_APP_UPDATE_OWNER_PREFERENCE
const updateUserStatusAPI = process.env.REACT_APP_USER_STATUS_API
const useInfoAPI = process.env.REACT_APP_USER_PROFILE_API

const CreateUsers = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const search = useLocation().search
    const id = new URLSearchParams(search).get('id')
    const defaultStatus = new URLSearchParams(search).get('default')
    const [isLoading, setIsLoading] = useState(false)
    const [pageAction, setPageAction] = useState()
    const [selectRole, setSelectRole] = useState()
    const [groupsServerData, setGroupsServerData] = useState([])
    const [userName, setUserName] = useState('')
    const [emailId, setEmailId] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [userStatus, setUserStatus] = useState(false)
    const [invalidUserName, setInvalidUserName] = useState(false)
    const [invalidEmailId, setInvalidEmailId] = useState(false)
    const [invalidRole, setInvalidRole] = useState(false)
    const [roleSelectData, setRoleSelectData] = useState([])
    const [searchParams, setSearchParams] = useSearchParams()
    const [isUserDetailFetching, setIsUserDetailFetching] = useState(false)
    const [isUserDetailsEditted, setIsUserDetailsEditted] = useState(false)
    const [currentFirstName, setCurrentFirstName] = useState('')
    const [currentLastName, setCurrentLastName] = useState('')
    const [currentRole, setCurrentRole] = useState('')
    const [currentEmailId, setCurrentEmailId] = useState('')
    const [currentUser, setCurrentUser] = useState('')
    const [isDefault, setIsDefault] = useState('')
    const [showUserEnableDisableModal, setShowUserEnableDisableModal] = useState(false)
    const [showDeleteUserModal, setShowDeleteUserModal] = useState(false)
    const [deleteModalLoading, setDeleteModalLoading] = useState(false)
    const [changeSwitchStatus, setChangeSwitchStatus] = useState()
    const [userInfoName, setUserInfoName] = useState('')
    const [primaryStatusModalOpen, setPrimaryStatusModalOpen] = useState(false)
    const [userPrimaryStatus, setUserPrimaryStatus] = useState()
    const [primaryStatusUpdateLoading, setPrimaryStatusUpdateLoading] = useState(false)
    usePageTitle(`${t('labels:user_access_control')}`)
    //Get call of groups
    const findAllGroupLists = () => {
        MarketplaceServices.findAll(groupsAPI, { is_marketplace_role: true }, true)

            .then(function (response) {
                console.log('Groups get call response-->', response.data.response_body)
                setGroupsServerData(response.data.response_body)
            })
            .catch(function (error) {
                console.log('grouplist get error call response-->', error)
            })
    }

    const getCurrentUserDetails = () => {
        MarketplaceServices.findAll(useInfoAPI, null, false)
            .then((res) => {
                console.log('get access token res', res?.data?.response_body)
                setUserInfoName(res?.data?.response_body?.preferred_username)
            })
            .catch((err) => {
                console.log('get access token err', err)
            })
    }

    //!Post call of user to server
    const handlePostUsers = () => {
        setIsLoading(true)
        let dataObject = {}
        dataObject['username'] = userName
        dataObject['email'] = emailId
        dataObject['status'] = true
        if (firstName !== '') {
            dataObject['firstname'] = firstName
        }
        if (lastName !== '') {
            dataObject['lastname'] = lastName
        }
        if (selectRole !== undefined && selectRole !== '') {
            dataObject['groups_mapping'] = selectRole
        }
        MarketplaceServices.save(userAPI, dataObject, null)
            .then(function (response) {
                console.log('server response of user post call', response)
                MarketplaceToaster.showToast(response)
                setIsLoading(false)
                navigate(-1)
            })
            .catch((error) => {
                console.log('server error response of user post call')
                MarketplaceToaster.showToast(error.response)
                setIsLoading(false)
                if (error.response?.status === 400) {
                    if (error.response?.data?.response_code === 'UMS-000002-04') {
                        setInvalidEmailId(true)
                        setInvalidUserName(true)
                    } else if (error.response?.data?.response_code === 'UMS-000002-16') {
                        // userName
                        setInvalidUserName(true)
                        setInvalidEmailId(false)
                    } else if (error.response?.data?.response_code === 'UMS-000002-17') {
                        // email
                        setInvalidEmailId(true)
                        setInvalidUserName(false)
                    }
                }
            })
    }

    // validation of user form
    const userFormValidation = () => {
        const emailRegex = new RegExp(emailRegexPattern)
        const userNameRegex = /^[A-Za-z0-9_\- ]+$/
        let count = 3
        if (userName === '' || emailId === '' || selectRole === undefined) {
            count--

            if (emailId === '') {
                setInvalidEmailId(true)
            }
            if (userName === '') {
                setInvalidUserName(true)
            }
            if (selectRole === undefined) {
                setInvalidRole(true)
            }
            MarketplaceToaster.showToast(
                util.getToastObject(`${t('messages:please_enter_the_values_for_the_mandatory_fields')}`, 'error')
            )
        } else if (userNameRegex.test(userName) === false) {
            count--
            setInvalidUserName(true)
            MarketplaceToaster.showToast(util.getToastObject(`${t('messages:please_enter_valid_username')}`, 'error'))
        } else if (userNameRegex.test(userName) === true && userName.length < userNameMinLength) {
            count--
            setInvalidUserName(true)
            MarketplaceToaster.showToast(
                util.getToastObject(`${t('messages:username_must_contain_minimum_characters')}`, 'error')
            )
        } else if (emailRegex.test(emailId) === false) {
            count--
            setInvalidEmailId(true)

            MarketplaceToaster.showToast(
                util.getToastObject(`${t('messages:please_enter_the_valid_email_address')}`, 'error')
            )
        }

        if (count === 3) {
            handlePostUsers()
        }
    }

    //!Put call of user to server
    const handlePutUsers = () => {
        setIsLoading(true)
        let dataObject = {}
        dataObject['firstname'] = firstName

        dataObject['lastname'] = lastName
        dataObject['email'] = emailId

        if (selectRole && userName != currentUser) {
            dataObject['groups_mapping'] = [selectRole]
        }

        MarketplaceServices.update(userAPI, dataObject, {
            user_name: userName,
        })
            .then(function (response) {
                console.log('server response of user put call', response)
                MarketplaceToaster.showToast(response)
                setIsLoading(false)
                navigate(-1)
            })
            .catch((error) => {
                console.log('server error response of user put call')
                MarketplaceToaster.showToast(error.response)
                setIsLoading(false)
                if (error.response?.status === 400) {
                    if (error.response?.data?.response_code === 'UMS-000002-04') {
                        setInvalidEmailId(true)
                        setInvalidUserName(true)
                        console.log('working fineeeee')
                    } else if (error.response?.data?.response_code === 'UMS-000002-18') {
                        // userName
                        setInvalidUserName(true)
                        // setInvalidEmailId(false)
                    } else if (error.response?.data?.response_code === 'UMS-000002-19') {
                        // email
                        setInvalidEmailId(true)
                        // setInvalidUserName(false)
                    }
                }
            })
    }

    const userFormValidationEdit = () => {
        const emailRegex = new RegExp(emailRegexPattern)
        let count = 1
        if (emailId === '') {
            count--
            if (emailId === '') {
                setInvalidEmailId(true)
            }
            MarketplaceToaster.showToast(
                util.getToastObject(`${t('messages:please_enter_the_values_for_the_mandatory_fields')}`, 'error')
            )
        } else if (emailRegex.test(emailId) === false) {
            count--
            setInvalidEmailId(true)
            MarketplaceToaster.showToast(
                util.getToastObject(`${t('messages:please_enter_the_valid_email_address')}`, 'error')
            )
        } else if (selectRole === undefined) {
            count--
            setInvalidRole(true)
            MarketplaceToaster.showToast(
                util.getToastObject(`${t('messages:please_enter_the_values_for_the_mandatory_fields')}`, 'error')
            )
        }
        if (count === 1) {
            handlePutUsers()
        }
    }

    //handle change of role select
    const handleChangeRole = (value) => {
        setSelectRole(value)
        setInvalidRole(false)
        setIsUserDetailsEditted(true)
    }

    //useEffect to form the data for the role dropdown
    useEffect(() => {
        if (groupsServerData && groupsServerData.length > 0) {
            const roleDropdownArray = groupsServerData.map((element) => {
                return {
                    label: String(element.name).replaceAll('-', ' '),
                    value: element.name,
                }
            })
            console.log('roleDropDownArray', roleDropdownArray)
            setRoleSelectData(roleDropdownArray)
        }
    }, [groupsServerData])

    useEffect(() => {
        getCurrentUserDetails()
    }, [])

    //Get call of users
    const findAllUsersLists = (userId) => {
        setIsUserDetailFetching(true)
        MarketplaceServices.findAll(usersAllAPI, null, false)
            .then(function (response) {
                setIsUserDetailFetching(false)
                if (response.data && response.data.response_body && response.data.response_body.users) {
                    let selectedUserDetails = response.data.response_body.users.filter(({ id }) => id == userId)
                    console.log(
                        'userslist get call response-->',
                        response.data.response_body.users,
                        'userId',
                        userId,
                        selectedUserDetails
                    )
                    if (selectedUserDetails.length > 0) {
                        setUserName(selectedUserDetails[0].username)
                        setFirstName(selectedUserDetails[0].firstName)
                        setLastName(selectedUserDetails[0].lastName)
                        setEmailId(selectedUserDetails[0].email)
                        setSelectRole(selectedUserDetails[0].groups[0].name)
                        setCurrentFirstName(selectedUserDetails[0].firstName)
                        setCurrentLastName(selectedUserDetails[0].lastName)
                        setCurrentRole(selectedUserDetails[0].groups[0].name)
                        setCurrentEmailId(selectedUserDetails[0].email)
                        setUserStatus(selectedUserDetails[0].enabled)
                        setUserPrimaryStatus(selectedUserDetails[0]?.attributes?.is_default_owner[0])
                    }
                }
            })
            .catch(function (error) {
                setIsUserDetailFetching(false)
                console.log('userslist get error call response-->', error)
            })
    }

    //Get call of users
    const findUsersLists = (userInfoName) => {
        MarketplaceServices.findAll(usersAllAPI, { username: userInfoName }, false)
            .then(function (response) {
                console.log('usersList get success call responses', response)
                if (response?.data?.response_body?.users[0]?.attributes) {
                    let userInfo = response?.data?.response_body?.users[0]?.attributes?.is_default_owner[0]
                    console.log('userInfo', userInfo)
                    setIsDefault(userInfo)
                }
            })
            .catch(function (error) {
                console.log('usersList get error call response-->', error)
            })
    }

    //User enable modal open function
    const openUserEnableDisableModal = (checked) => {
        setShowUserEnableDisableModal(true)
        setChangeSwitchStatus(checked)
    }

    // primary user Modal function
    const openPrimaryUserModal = (checked) => {
        setPrimaryStatusModalOpen(true)
    }
    //Enable ad disable user from server
    const enableDisableUserFromServer = () => {
        setDeleteModalLoading(true)
        MarketplaceServices.update(
            updateUserStatusAPI,
            {
                status: changeSwitchStatus === false ? false : true,
            },
            { user_name: userName }
        )
            .then(function (response) {
                console.log('update server response of user enable', response)
                setUserStatus(changeSwitchStatus)
                MarketplaceToaster.showToast(response)
                setDeleteModalLoading(false)
                setShowUserEnableDisableModal(false)
            })
            .catch((error) => {
                console.log('update server response of user enable')
                MarketplaceToaster.showToast(error.response)
                setDeleteModalLoading(false)
            })
    }

    //Enable ad disable user from server
    const updatePrimaryUser = () => {
        setPrimaryStatusUpdateLoading(true)
        MarketplaceServices.update(updateUserPreferenceAPI, {
            user_id: id,
        })
            .then(function (response) {
                console.log('update server response of primary enable', response)
                setUserPrimaryStatus('True')
                MarketplaceToaster.showToast(response)
                setPrimaryStatusUpdateLoading(false)
                setPrimaryStatusModalOpen(false)
                setSearchParams({
                    id: searchParams.get('id'),
                    Loginuname: searchParams.get('Loginuname'),
                    default: 'True',
                })
            })
            .catch((error) => {
                console.log('update server response of primary enable', error)
                MarketplaceToaster.showToast(error.response)
                setPrimaryStatusUpdateLoading(false)
            })
    }

    //Delete call of user frm server
    const removeUser = () => {
        setDeleteModalLoading(true)
        MarketplaceServices.remove(userAPI, {
            'user-name': userName,
        })
            .then(function (response) {
                console.log('delete response of user', response)
                setDeleteModalLoading(false)
                MarketplaceToaster.showToast(response)
                // findAllUsersLists()
                navigate(-1)
                setShowDeleteUserModal(false)
            })
            .catch(function (error) {
                console.log('delete error response of user', error)
                MarketplaceToaster.showToast(error.response)
                setDeleteModalLoading(false)
            })
    }

    //User Delete modal open function
    const openUserDeleteModal = () => {
        setShowDeleteUserModal(true)
        // setUserName(userName)
    }

    //UseEffect to set page action edit or save
    useEffect(() => {
        var pathnameString = pathname.substring(pathname.lastIndexOf('/') + 1, pathname.length).split('-')
        setPageAction(pathnameString[0])
        if (pathnameString[0] !== 'add') {
            findAllUsersLists(searchParams.get('id'))
            setCurrentUser(searchParams.get('Loginuname'))
        }
        findAllGroupLists()
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        findUsersLists(userInfoName)
    }, [userInfoName])
    console.log('userStatus', userStatus)
    return (
        <div className=''>
            <HeaderForTitle
                title={
                    <ShadCNTooltip
                        content={pageAction !== 'add' ? userName : t('labels:add_user')}
                        zIndex={11}
                        position='bottom'>
                        <div className='!font-normal max-w-[800px]' ellipsis>
                            {pageAction === 'add' ? (
                                <label className='font-semibold text-2xl mb-2'>{t('labels:add_user')}</label>
                            ) : (
                                <div className='flex gap-2 '>
                                    <div className='font-semibold text-2xl mb-2'>{userName}</div>
                                    {defaultStatus === 'True' ? (
                                        <span className='bg-black text-white border px-1 !mb-3 mt-[6px]  '>
                                            {t('labels:primary_account')}
                                        </span>
                                    ) : (
                                        ''
                                    )}
                                </div>
                            )}
                        </div>
                    </ShadCNTooltip>
                }
                titleContent={
                    <div>
                        {pageAction !== 'add' ? (
                            <div className='flex gap-3'>
                                <div className='gap-1 flex  mt-1'>
                                    <label className='text-brandGray2 font-normal '>{t('labels:status')}</label>
                                    {defaultStatus === 'True' ? (
                                        <ShadCNTooltip
                                            position='bottom'
                                            content={
                                                <>
                                                    {isDefault === 'False' ? (
                                                        <div>{t('messages:standard_user_info')}</div>
                                                    ) : defaultStatus === 'True' && isDefault === 'True' ? (
                                                        <>
                                                            <div className='font-semibold text-sm mb-0'>
                                                                {t('messages:make_primary_account')}
                                                            </div>{' '}
                                                            <div>{t('messages:primary_content')}</div>
                                                        </>
                                                    ) : null}
                                                </>
                                            }
                                            className='!w-9'>
                                            <img
                                                src={InfoIcon}
                                                alt='InfoIcon'
                                                className='!w-[14px] !text-center mt-[-17px] !mb-0 cursor-pointer'
                                                preview={false}
                                            />{' '}
                                        </ShadCNTooltip>
                                    ) : null}
                                    :
                                    <Switch
                                        disabled={
                                            currentUser === userName ||
                                            // isDefault === 'False' ||
                                            defaultStatus === 'True'
                                                ? true
                                                : false
                                        }
                                        checked={userStatus}
                                        onCheckedChange={openUserEnableDisableModal}
                                    />
                                </div>
                                <div className='gap-1 flex mt-1'>
                                    <label className='text-brandGray2 font-normal '>{t('labels:primary_user')}</label>
                                    <ShadCNTooltip
                                        position='bottom'
                                        content={
                                            <>
                                                {isDefault === 'False' ? (
                                                    <div>{t('messages:non_primary_info')}</div>
                                                ) : defaultStatus === 'True' && isDefault === 'True' ? (
                                                    <div>{t('messages:primary_content_info')}</div>
                                                ) : isDefault === 'True' && defaultStatus === 'False' && !userStatus ? (
                                                    <div>{t('messages:deactive_status_primary_message')}</div>
                                                ) : isDefault === 'True' && defaultStatus === 'False' ? (
                                                    <div>{t('messages:primary_content_information')}</div>
                                                ) : null}
                                            </>
                                        }
                                        className=' '>
                                        <img
                                            src={InfoIcon}
                                            alt='InfoIcon'
                                            className='!w-[14px] !text-center mt-[-17px] cursor-pointer'
                                            preview={false}
                                        />{' '}
                                    </ShadCNTooltip>
                                    :
                                    <Switch
                                        disabled={
                                            currentUser === userName ||
                                            isDefault === 'False' ||
                                            defaultStatus === 'True' ||
                                            userStatus === false
                                                ? true
                                                : false
                                        }
                                        checked={userPrimaryStatus === 'True' ? true : false}
                                        onCheckedChange={openPrimaryUserModal}
                                    />
                                </div>
                                <Button
                                    variant='destructive'
                                    className=' mb-2'
                                    disabled={
                                        currentUser === userName ||
                                        //  isDefault === 'False'||
                                        defaultStatus === 'True'
                                            ? true
                                            : false
                                    }
                                    onClick={() => openUserDeleteModal()}>
                                    {t('labels:delete_user')}
                                </Button>
                            </div>
                        ) : null}
                    </div>
                }
                type={'categories'}
                action={pageAction === 'add' ? 'add' : 'edit'}
                showArrowIcon={true}
                saveFunction={userFormValidation}
                isVisible={pageAction === 'edit' ? false : true}
                showButtons={false}
                backNavigationPath={'/dashboard/user-access-control/list-user-roles'}
            />
            <div className='!min-h-screen mt-[8.5rem] p-3'>
                {
                    isUserDetailFetching ? (
                        <div className='bg-white p-3 space-y-4'>
                            <Skeleton className={'h-4 w-[350px] '} />
                            <Skeleton className={'h-4 w-[350px] '} />
                            <Skeleton className={'h-4 w-[350px] '} />
                            <Skeleton className={'h-4 w-[350px] '} />
                            <Skeleton className={'h-4 w-[350px] '} />
                            <Skeleton className={'h-4 w-[300px] '} />
                        </div>
                    ) : isLoading ? (
                        <Spin />
                    ) : (
                        // <Spin tip={t('labels:please_wait')} size='large' spinning={isLoading}>
                        <div className='bg-white p-3 rounded-md shadow-brandShadow'>
                            <div className='w-[400px]'>
                                <div className='my-3'>
                                    <p className='input-label-color mb-2 flex gap-1'>
                                        {t('labels:user_name')}
                                        <span className='mandatory-symbol-color text-sm '>*</span>
                                    </p>
                                    <div>
                                        <Input
                                            className={`${
                                                invalidUserName
                                                    ? 'border-red-400  border-[1px] rounded-lg border-solid focus:border-red-400 hover:border-red-400'
                                                    : ' border-solid border-[#C6C6C6] '
                                            }`}
                                            value={userName}
                                            disabled={pageAction !== 'add' ? true : false}
                                            onChange={(e) => {
                                                const alphaWithoutSpaces = /^[a-zA-Z0-9]+$/
                                                if (
                                                    e.target.value !== '' &&
                                                    validator.matches(e.target.value, alphaWithoutSpaces)
                                                ) {
                                                    setUserName(String(e.target.value).toLowerCase())
                                                    setInvalidUserName(false)
                                                    setIsUserDetailsEditted(true)
                                                } else if (e.target.value === '') {
                                                    setUserName(e.target.value)
                                                }
                                            }}
                                            onBlur={(e) => {
                                                setUserName(e.target.value.trim().replace(/\s+/g, ' '))
                                            }}
                                            maxLength={userNameMaxLength}
                                            placeholder={t('placeholders:user_name_placeholder')}
                                        />
                                    </div>
                                </div>
                                {/* <Content className='flex my-3 gap-3'> */}
                                <div className='my-3'>
                                    <p className='input-label-color mb-2 flex gap-1'>{t('labels:first_name')}</p>
                                    <div>
                                        <Input
                                            autoComplete='off'
                                            value={firstName}
                                            disabled={
                                                pageAction !== 'add'
                                                    ? userName === currentUser || defaultStatus === 'True'
                                                    : false
                                            }
                                            onChange={(e) => {
                                                const { value } = e.target
                                                const regex = /^[a-zA-Z]*$/ // only allow letters
                                                if (regex.test(value)) {
                                                    setFirstName(e.target.value)
                                                    setIsUserDetailsEditted(true)
                                                }
                                            }}
                                            minLength={nameMinLength}
                                            maxLength={nameMaxLength}
                                            placeholder={t('placeholders:enter_first_name')}
                                        />
                                    </div>
                                </div>
                                <div className='my-3'>
                                    <p className='input-label-color mb-2 flex gap-1'>{t('labels:last_name')}</p>
                                    <div>
                                        <Input
                                            autoComplete='off'
                                            value={lastName}
                                            disabled={
                                                pageAction !== 'add'
                                                    ? userName === currentUser || defaultStatus === 'True'
                                                    : false
                                            }
                                            onChange={(e) => {
                                                const { value } = e.target
                                                const regex = /^[a-zA-Z]*$/ // only allow letters
                                                if (regex.test(value)) {
                                                    setLastName(e.target.value)
                                                    setIsUserDetailsEditted(true)
                                                }
                                            }}
                                            minLength={nameMinLength}
                                            maxLength={nameMaxLength}
                                            placeholder={t('placeholders:enter_last_name')}
                                        />
                                    </div>
                                </div>
                                {/* </Content> */}
                                <div className='my-3'>
                                    <p className='input-label-color mb-2 flex gap-1'>
                                        {t('labels:email')}
                                        <span className='mandatory-symbol-color text-sm '>*</span>
                                    </p>

                                    <div>
                                        <Input
                                            className={`${
                                                invalidEmailId
                                                    ? 'border-red-400  border-[1px] rounded-lg border-solid focus:border-red-400 hover:border-red-400'
                                                    : ' border-solid border-[#C6C6C6]'
                                            }`}
                                            value={emailId}
                                            onChange={(e) => {
                                                if (
                                                    validator.matches(
                                                        e.target.value.trim(),
                                                        /^[a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};'`~:"\\|,.<>\/?]+$/
                                                    )
                                                ) {
                                                    setEmailId(e.target.value.toLowerCase())
                                                    setInvalidEmailId(false)
                                                    setIsUserDetailsEditted(true)
                                                } else if (e.target.value === '') {
                                                    setEmailId(e.target.value.toLowerCase())
                                                    setInvalidEmailId(false)
                                                    setIsUserDetailsEditted(true)
                                                }
                                            }}
                                            onBlur={(e) => {
                                                setEmailId(e.target.value.trim().replace(/\s+/g, ' '))
                                            }}
                                            disabled={
                                                pageAction !== 'add'
                                                    ? userName === currentUser || defaultStatus === 'True'
                                                    : false
                                            }
                                            autocomplete='off'
                                            maxLength={emailMaxLength}
                                            placeholder={t('placeholders:enter_email')}
                                        />
                                    </div>
                                </div>

                                <div className='flex my-3'>
                                    <div className=''>
                                        <p className='input-label-color mb-2 flex gap-1'>
                                            {t('labels:role')}
                                            <span className='mandatory-symbol-color text-sm '>*</span>
                                        </p>
                                        <div>
                                            {/* <Select
                                            disabled={
                                                pageAction === 'edit'
                                                    ? userName === currentUser || defaultStatus === 'True'
                                                    : false
                                            }
                                            style={{
                                                width: 390,
                                            }}
                                            allowClear
                                            status={invalidRole ? 'error' : ''}
                                            placeholder={t('labels:select_a_role')}
                                            value={selectRole}
                                            onValueChange={handleChangeRole}
                                            options={roleSelectData}
                                        /> */}
                                            <Select
                                                disabled={
                                                    pageAction === 'edit'
                                                        ? userName === currentUser || defaultStatus === 'True'
                                                        : false
                                                }
                                                onValueChange={handleChangeRole}
                                                value={selectRole}>
                                                <SelectTrigger
                                                    className={`w-[400px] ${invalidRole ? 'border-red-500' : ''}`}>
                                                    <SelectValue placeholder={t('labels:select_a_role')} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {roleSelectData.map((role) => (
                                                        <SelectItem key={role.value} value={role.value}>
                                                            {role.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                <div className='!mb-3 pt-3 flex gap-2'>
                                    <Button
                                        onClick={pageAction != 'add' ? userFormValidationEdit : userFormValidation}
                                        className={` 
                       `}
                                        disabled={
                                            pageAction === 'add'
                                                ? userName != '' ||
                                                  emailId != '' ||
                                                  firstName != '' ||
                                                  lastName != '' ||
                                                  userStatus ||
                                                  selectRole
                                                    ? false
                                                    : true
                                                : firstName != currentFirstName ||
                                                    lastName != currentLastName ||
                                                    emailId != currentEmailId ||
                                                    selectRole != currentRole
                                                  ? false
                                                  : true
                                        }>
                                        {pageAction === 'edit' ? t('labels:update') : t('labels:save')}
                                    </Button>
                                    <Button
                                        variant='outline'
                                        className=''
                                        onClick={() => navigate('/dashboard/user-access-control/list-user-roles')}>
                                        {t('labels:discard')}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )
                    // </Spin>
                }
            </div>
            <StoreModal
                isVisible={showDeleteUserModal}
                okButtonText={`${t('labels:yes')}`}
                cancelButtonText={`${t('labels:cancel')}`}
                title={
                    <div className='text-regal-blue font-bold text-[18px] leading-[26px]'>{t('labels:warning')}</div>
                }
                okCallback={() => removeUser()}
                cancelCallback={() => setShowDeleteUserModal(false)}
                isSpin={deleteModalLoading}>
                {<div className='text-brandGray1'> {t('messages:are_you_sure_you_want_delete_the_user')}?</div>}
            </StoreModal>
            <StoreModal
                isVisible={showUserEnableDisableModal}
                okButtonText={`${t('labels:yes')}`}
                cancelButtonText={`${t('labels:cancel')}`}
                title={
                    <div className='text-regal-blue font-bold text-[18px] leading-[26px]'>{t('labels:warning')}</div>
                }
                okCallback={() => enableDisableUserFromServer()}
                cancelCallback={() => setShowUserEnableDisableModal(false)}
                isSpin={deleteModalLoading}>
                {
                    <div className='text-brandGray1'>
                        {userStatus === true ? (
                            <p>{t('messages:are_you_sure_you_want_disable_status')}</p>
                        ) : (
                            <p>{t('messages:are_you_sure_you_want_enable_status')}</p>
                        )}
                    </div>
                }
            </StoreModal>
            <StoreModal
                isVisible={primaryStatusModalOpen}
                okButtonText={`${t('labels:yes')}`}
                cancelButtonText={`${t('labels:no')}`}
                title={
                    <div className='text-regal-blue font-bold text-[18px] leading-[26px]'>
                        {t('messages:warning_heading')}
                    </div>
                }
                okCallback={() => updatePrimaryUser()}
                cancelCallback={() => setPrimaryStatusModalOpen(false)}
                isSpin={primaryStatusUpdateLoading}>
                {
                    <div className='text-brandGray1'>
                        <p className='!mb-2'>
                            {t('labels:making')} {userName} {t('messages:primary_status_modal_confirmation')}
                        </p>
                        <p>{t('messages:policy_change_warning_message')}</p>
                    </div>
                }
            </StoreModal>
        </div>
    )
}

export default CreateUsers
