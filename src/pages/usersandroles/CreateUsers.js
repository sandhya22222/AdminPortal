import React, { useState, useEffect } from 'react'
import { Layout, Typography, Button, Input, Row, Col, Spin, Tooltip, Select, Switch, Skeleton } from 'antd'

import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import HeaderForTitle from '../../components/header/HeaderForTitle'
import MarketplaceServices from '../../services/axios/MarketplaceServices'
import MarketplaceToaster from '../../util/marketplaceToaster'
import util from '../../util/common'
import validator from 'validator'

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

const { Title } = Typography
const { Content } = Layout

const CreateUsers = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { pathname } = useLocation()
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
        var roleObject = {}
        var roleDropdownArray = []
        groupsServerData &&
            groupsServerData.length > 0 &&
            groupsServerData.map((element) => {
                roleObject = {}
                roleObject.label = String(element.name).replaceAll('-', ' ')
                roleObject.value = element.name
                roleDropdownArray.push(roleObject)
            })
        console.log('roleDropDownArray', roleDropdownArray)
        setRoleSelectData(roleDropdownArray)
    }, [groupsServerData])

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
                    }
                }
            })
            .catch(function (error) {
                setIsUserDetailFetching(false)
                console.log('userslist get error call response-->', error)
            })
    }

    //UseEffect to set page action edit or save
    useEffect(() => {
        var pathnameString = pathname.substring(pathname.lastIndexOf('/') + 1, pathname.length).split('-')
        setPageAction(pathnameString[0])
        if (pathnameString[0] !== 'add') {
            findAllUsersLists(searchParams.get('id'))
            setCurrentUser(searchParams.get('uname'))
        }
        findAllGroupLists()
        window.scrollTo(0, 0)
    }, [])

    return (
        <Content className=''>
            <HeaderForTitle
                title={
                    <Tooltip
                        title={pageAction !== 'add' ? t('labels:edit_user') : t('labels:add_user')}
                        zIndex={11}
                        placement='bottom'>
                        <Title level={3} className='!font-normal max-w-[800px]' ellipsis>
                            {pageAction === 'add' ? `${t('labels:add_user')} ` : `${t('labels:edit_user')} `}
                        </Title>
                    </Tooltip>
                }
                type={'categories'}
                action={pageAction === 'add' ? 'add' : 'edit'}
                showArrowIcon={true}
                saveFunction={userFormValidation}
                isVisible={pageAction === 'edit' ? false : true}
                showButtons={false}
            />
            <Content className='!min-h-screen mt-[8.5rem] p-3'>
                {isUserDetailFetching ? (
                    <Content className='bg-white'>
                        <Skeleton
                            active
                            paragraph={{
                                rows: 10,
                            }}
                            className='p-3'></Skeleton>
                    </Content>
                ) : (
                    <Spin tip={t('labels:please_wait')} size='large' spinning={isLoading}>
                        <Content className='bg-white p-3 rounded-md shadow-brandShadow'>
                            <Row>
                                <Col span={10} className=''>
                                    <Content className='my-3'>
                                        <Typography className='input-label-color mb-2 flex gap-1'>
                                            {t('labels:user_name')}
                                            <span className='mandatory-symbol-color text-sm '>*</span>
                                        </Typography>
                                        <Content>
                                            <Input
                                                className={`${
                                                    invalidUserName
                                                        ? 'border-red-400  border-[1px] rounded-lg border-solid focus:border-red-400 hover:border-red-400'
                                                        : ' border-solid border-[#C6C6C6]'
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
                                        </Content>
                                    </Content>
                                    {/* <Content className='flex my-3 gap-3'> */}
                                    <Content className='my-3'>
                                        <Typography className='input-label-color mb-2 flex gap-1'>
                                            {t('labels:first_name')}
                                        </Typography>
                                        <Content>
                                            <Input
                                                autoComplete='off'
                                                value={firstName}
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
                                        </Content>
                                    </Content>
                                    <Content className='my-3'>
                                        <Typography className='input-label-color mb-2 flex gap-1'>
                                            {t('labels:last_name')}
                                        </Typography>
                                        <Content>
                                            <Input
                                                autoComplete='off'
                                                value={lastName}
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
                                        </Content>
                                    </Content>
                                    {/* </Content> */}
                                    <Content className='my-3'>
                                        <Typography className='input-label-color mb-2 flex gap-1'>
                                            {t('labels:email')}
                                            <span className='mandatory-symbol-color text-sm '>*</span>
                                        </Typography>

                                        <Content>
                                            <Input
                                                className={`${
                                                    invalidEmailId
                                                        ? 'border-red-400  border-[1px] rounded-lg border-solid focus:border-red-400 hover:border-red-400'
                                                        : ' border-solid border-[#C6C6C6]'
                                                }`}
                                                value={emailId}
                                                onChange={(e) => {
                                                    setEmailId(e.target.value.toLowerCase())
                                                    setInvalidEmailId(false)
                                                    setIsUserDetailsEditted(true)
                                                }}
                                                onBlur={(e) => {
                                                    setEmailId(e.target.value.trim().replace(/\s+/g, ' '))
                                                }}
                                                autocomplete='off'
                                                maxLength={emailMaxLength}
                                                placeholder={t('placeholders:enter_email')}
                                            />
                                        </Content>
                                    </Content>

                                    <Content className='flex my-3'>
                                        <Content className=''>
                                            <Typography className='input-label-color mb-2 flex gap-1'>
                                                {t('labels:role')}
                                                <span className='mandatory-symbol-color text-sm '>*</span>
                                            </Typography>
                                            <Content>
                                                <Select
                                                    disabled={pageAction === 'edit' ? userName == currentUser : false}
                                                    style={{
                                                        width: 430,
                                                    }}
                                                    allowClear
                                                    status={invalidRole ? 'error' : ''}
                                                    placeholder={t('labels:select_a_role')}
                                                    value={selectRole}
                                                    onChange={handleChangeRole}
                                                    options={roleSelectData}
                                                />
                                            </Content>
                                        </Content>
                                    </Content>

                                    <Content className='!mb-3 pt-3 flex gap-2'>
                                        <Button
                                            onClick={pageAction != 'add' ? userFormValidationEdit : userFormValidation}
                                            className={`app-btn-primary 
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
                                        <Button className='app-btn-secondary' onClick={() => navigate(-1)}>
                                            {t('labels:discard')}
                                        </Button>
                                    </Content>
                                </Col>
                            </Row>
                        </Content>
                    </Spin>
                )}
            </Content>
        </Content>
    )
}

export default CreateUsers
