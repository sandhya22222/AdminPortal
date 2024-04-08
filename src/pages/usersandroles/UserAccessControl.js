import React, { useEffect, useState } from 'react'
import { Layout, Typography, Skeleton, Table, Button, Switch, Tooltip } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
// import { MdEdit } from "react-icons/md";
import { useTranslation } from 'react-i18next'
import { useSearchParams, useNavigate } from 'react-router-dom'

import MarketplaceServices from '../../services/axios/MarketplaceServices'
import HeaderForTitle from '../../components/header/HeaderForTitle'
import DmTabAntDesign from '../../components/DmTabAntDesign/DmTabAntDesign'
import DmPagination from '../../components/DmPagination/DmPagination'
import CreateGroup from './CreateGroup'
import StoreModal from '../../components/storeModal/StoreModal'
import MarketplaceToaster from '../../util/marketplaceToaster'
import { usePageTitle } from '../../hooks/usePageTitle'
import { MdEdit } from 'react-icons/md'

const { Content } = Layout
const { Title, Paragraph } = Typography

const itemsPerPageFromEnv = process.env.REACT_APP_ITEM_PER_PAGE
const groupsAPI = process.env.REACT_APP_GROUPS_API
const usersAllAPI = process.env.REACT_APP_USERS_ALL_API
const userAPI = process.env.REACT_APP_USERS_API
const updateUserStatusAPI = process.env.REACT_APP_USER_STATUS_API
const currentUserDetailsAPI = process.env.REACT_APP_USER_PROFILE_API

const UserAccessControl = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    const [isNetworkError, setIsNetworkError] = useState(false)
    const [serverDataCount, setServerDataCount] = useState()
    const [usersServerData, setUsersServerData] = useState([])
    const [groupServerData, setGroupServerData] = useState([])
    const [showGroupModal, setShowGroupModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [groupId, setShowGroupId] = useState()
    const [groupName, setGroupName] = useState('')
    const [deleteModalLoading, setDeleteModalLoading] = useState(false)
    const [showDeleteUserModal, setShowDeleteUserModal] = useState(false)
    const [userName, setUserName] = useState()
    const [showUserEnableDisableModal, setShowUserEnableDisableModal] = useState(false)
    const [selectedUserData, setSelectedUserData] = useState({})
    const [currentUserDetailsAPIData, setCurrentUserDetailsAPIData] = useState()
    usePageTitle(`${t('labels:user_access_control')}`)

    //!json data displaying for tabs
    const mainTabData = [
        {
            tabId: 0,
            tabTitle: <p className=' !mb-0'>{t('labels:users')}</p>,
        },
        {
            tabId: 1,
            tabTitle: <p className='!mb-0 !mr-2'>{t('labels:roles')}</p>,
        },
    ]

    //! changing the tab
    const handleMainTabChange = (tabId) => {
        setSearchParams({
            tab: tabId,
            page: 1,
            limit: itemsPerPageFromEnv,
        })
    }
    const getCurrentUserDetails = () => {
        MarketplaceServices.findAll(currentUserDetailsAPI, null, false)
            .then((res) => {
                console.log('get access token res', res)
                setCurrentUserDetailsAPIData(res.data.response_body)
            })
            .catch((err) => {
                console.log('get access token err', err)
            })
    }

    useEffect(() => {
        window.scroll(0, 0)
        getCurrentUserDetails()
        setSearchParams({
            tab: searchParams.get('tab') ? searchParams.get('tab') : 0,
            page: searchParams.get('page') ? searchParams.get('page') : 1,
            limit: searchParams.get('limit') ? searchParams.get('limit') : itemsPerPageFromEnv,
        })
    }, [])

    //!user table columns
    const usersColumns = [
        {
            title: <Content>{t('labels:username')}</Content>,
            dataIndex: 'userName',
            key: 'userName',
            ellipsis: true,
            width: '17%',
            render: (text, record) => {
                return <Content>{record.username}</Content>
            },
        },

        {
            title: <Content>{t('labels:email')}</Content>,
            dataIndex: 'emailId',
            key: 'emailId',
            width: '35%',
            render: (text, record) => {
                return <Content>{record.email}</Content>
            },
        },
        {
            title: <Content>{t('labels:status')}</Content>,
            dataIndex: 'status',
            key: 'status',
            width: '10%',
            render: (text, record) => {
                return (
                    <Content>
                        <Switch
                            disabled={
                                currentUserDetailsAPIData?.preferred_username === record?.username &&
                                currentUserDetailsAPIData?.email === record?.email
                                    ? true
                                    : false
                            }
                            className={record.enabled == true ? '!bg-green-500' : '!bg-gray-400'}
                            checked={record.enabled}
                            onChange={() => openUserEnableDisableModal(record.enabled, record.username)}
                        />
                    </Content>
                )
            },
        },
        {
            title: <Content>{t('labels:role')}</Content>,
            dataIndex: 'role',
            key: 'role',
            width: '15%',
            ellipsis: true,
            render: (text, record) => {
                return (
                    <Content>
                        {record.groups[0]?.name ? String(record.groups[0]?.name).replaceAll('-', ' ') : 'NA'}
                    </Content>
                )
            },
        },
        {
            title: `${t('labels:action')}`,
            dataIndex: '',
            key: '',
            width: '15%',
            render: (text, record) => {
                return (
                    <Content className='flex items-center'>
                        {currentUserDetailsAPIData?.preferred_username === record?.username &&
                        currentUserDetailsAPIData?.email === record?.email ? null : (
                            <Button className='app-btn-icon app-delete-icon' type='text'>
                                <Tooltip
                                    placement='bottom'
                                    title={`${t('labels:delete_user')}`}
                                    overlayStyle={{ zIndex: 1 }}>
                                    <DeleteOutlined onClick={() => openUserDeleteModal(record.username)} />
                                </Tooltip>
                            </Button>
                        )}
                        <Tooltip
                            title={t('labels:edit_user')}
                            className='ml-1'
                            placement='bottom'
                            overlayStyle={{ zIndex: 1 }}>
                            <Button
                                type='text'
                                className='app-btn-icon app-edit-icon'
                                onClick={() => {
                                    navigate(
                                        `/dashboard/user-access-control/edit-user?id=${record.id}&uname=${currentUserDetailsAPIData?.preferred_username}`
                                    )
                                }}>
                                <MdEdit />
                            </Button>
                        </Tooltip>
                    </Content>
                )
            },
        },
    ]

    //! pagination handle change
    const handlePageNumberChange = (page, pageSize) => {
        setSearchParams({
            tab: searchParams.get('tab'),
            page: parseInt(page) ? parseInt(page) : 1,
            limit: parseInt(pageSize) ? parseInt(pageSize) : itemsPerPageFromEnv,
        })
    }

    //! group table column
    const groupColumns = [
        {
            title: <Content>{t('labels:role_name')}</Content>,
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,

            render: (text, record) => {
                return <Content>{String(record.name).replaceAll('-', ' ')}</Content>
            },
        },
    ]

    //User Delete modal open function
    const openUserDeleteModal = (userName) => {
        setShowDeleteUserModal(true)
        setUserName(userName)
    }

    //User enable modal open function
    const openUserEnableDisableModal = (userStatus, userName) => {
        let dataObject = {
            status: userStatus,
            username: userName,
        }
        setSelectedUserData(dataObject)
        setShowUserEnableDisableModal(true)
    }

    //Delete call of group from server
    const removeGroup = () => {
        setDeleteModalLoading(true)
        MarketplaceServices.remove(groupsAPI, {
            group_name: groupId,
        })
            .then(function (response) {
                console.log('delete response of group', response)
                setDeleteModalLoading(false)
                MarketplaceToaster.showToast(response)
                findAllGroupLists()
                setShowDeleteModal(false)
            })
            .catch(function (error) {
                console.log('delete error response of group', error)
                MarketplaceToaster.showToast(error.response)
                setDeleteModalLoading(false)
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
                findAllUsersLists()
                setShowDeleteUserModal(false)
            })
            .catch(function (error) {
                console.log('delete error response of user', error)
                MarketplaceToaster.showToast(error.response)
                setDeleteModalLoading(false)
            })
    }

    //Enable ad disable user from server
    const enableDisableUserFromServer = () => {
        setDeleteModalLoading(true)
        MarketplaceServices.update(
            updateUserStatusAPI,
            {
                status: selectedUserData.status === false ? true : false,
            },
            { user_name: selectedUserData.username }
        )
            .then(function (response) {
                console.log('update server response of user enable', response)
                MarketplaceToaster.showToast(response)
                setDeleteModalLoading(false)
                setShowUserEnableDisableModal(false)
                // window.location.reload();
                var presentTab = searchParams.get('tab')
                var pageNumber = searchParams.get('page') ? searchParams.get('page') : 1
                var pageLimit = searchParams.get('limit') ? searchParams.get('limit') : itemsPerPageFromEnv

                setIsLoading(true)
                if (parseInt(presentTab) === '1') {
                    findAllGroupLists(parseInt(pageNumber), parseInt(pageLimit))
                } else if (parseInt(presentTab) === '2') {
                } else {
                    findAllUsersLists(parseInt(pageNumber), parseInt(pageLimit))
                }
            })
            .catch((error) => {
                console.log('update server response of user enable')
                MarketplaceToaster.showToast(error.response)
                setDeleteModalLoading(false)
            })
    }

    //Get call of groups
    const findAllGroupLists = (pageNumber, pageLimit) => {
        MarketplaceServices.findByPage(groupsAPI, null, pageNumber, pageLimit, true)

            .then(function (response) {
                console.log('grouplist get call response-->', response.data.response_body)
                setServerDataCount(response.data.response_body && response.data.response_body.length)
                setGroupServerData(response.data.response_body)
                setIsLoading(false)
                setIsNetworkError(false)
            })
            .catch(function (error) {
                console.log('grouplist get error call response-->', error)
                setIsLoading(false)
                setIsNetworkError(true)
            })
    }

    //Get call of users
    const findAllUsersLists = (pageNumber, pageLimit) => {
        MarketplaceServices.findByPage(usersAllAPI, null, pageNumber, pageLimit, true)
            .then(function (response) {
                console.log('userslist get call response-->', response.data.response_body.users)
                setServerDataCount(response.data.response_body && response.data.response_body.count)

                setUsersServerData(response.data.response_body.users)
                setIsLoading(false)
                setIsNetworkError(false)
            })
            .catch(function (error) {
                console.log('userslist get error call response-->', error)
                setIsLoading(false)
                setIsNetworkError(true)
            })
    }

    //Useeffect to call get calls
    useEffect(() => {
        var presentTab = searchParams.get('tab')
        var pageNumber = searchParams.get('page') ? searchParams.get('page') : 1
        var pageLimit = searchParams.get('limit') ? searchParams.get('limit') : itemsPerPageFromEnv

        setIsLoading(true)
        if (parseInt(presentTab) === '1') {
            findAllGroupLists(parseInt(pageNumber), parseInt(pageLimit))
        } else if (parseInt(presentTab) === '2') {
        } else {
            findAllUsersLists(parseInt(pageNumber), parseInt(pageLimit))
        }
    }, [searchParams])

    useEffect(() => {
        setSearchParams({
            tab: searchParams.get('tab') ? searchParams.get('tab') : 0,
            page: searchParams.get('page') ? searchParams.get('page') : 1,
            limit: searchParams.get('limit') ? searchParams.get('limit') : itemsPerPageFromEnv,
        })
    }, [])

    return (
        <Content>
            <HeaderForTitle
                title={
                    <Title level={3} className='!font-normal'>
                        {t('labels:user_access_control')}
                    </Title>
                }
                headerContent={
                    <Content className='mt-[3rem]'>
                        <Paragraph className='!font-semibold !text-slate-400 !m-0'>
                            {t('labels:user_access_control_note')}
                        </Paragraph>

                        <Content className='!h-10 mt-3 flex'>
                            <Content className='!w-[80%]'>
                                <DmTabAntDesign
                                    tabData={mainTabData}
                                    defaultSelectedTabKey={0}
                                    activeKey={
                                        searchParams.get('tab') === '0'
                                            ? '0'
                                            : searchParams.get('tab') === '1'
                                              ? '1'
                                              : searchParams.get('tab') === '2'
                                                ? '2'
                                                : '0'
                                    }
                                    handleTabChangeFunction={handleMainTabChange}
                                    tabType={'line'}
                                    tabBarPosition={'top'}
                                />
                            </Content>

                            <>
                                {searchParams.get('tab') === '0' ? (
                                    <Button
                                        className='app-btn-primary !h-8 hover:!h-8'
                                        onClick={() => navigate('/dashboard/user-access-control/add-user?')}>
                                        {t('labels:add_user')}
                                    </Button>
                                ) : null}
                            </>
                        </Content>
                    </Content>
                }
            />
            <Content className='p-3'>
                {isLoading ? (
                    <Content className='bg-white'>
                        <Skeleton
                            active
                            paragraph={{
                                rows: 6,
                            }}
                            className='p-3'></Skeleton>
                    </Content>
                ) : isNetworkError ? (
                    <Content className='bg-white m-4'>
                        <p className='p-4 text-center'>{t('messages:network_error')}</p>
                    </Content>
                ) : (
                    <Content className=' bg-white'>
                        {searchParams.get('tab') === '1' ? (
                            <Table dataSource={groupServerData} columns={groupColumns} pagination={false} />
                        ) : searchParams.get('tab') === '2' ? null : (
                            <Table dataSource={usersServerData} columns={usersColumns} pagination={false} />
                        )}

                        {serverDataCount > itemsPerPageFromEnv ? (
                            <Content className='!grid !justify-items-end'>
                                <DmPagination
                                    currentPage={
                                        parseInt(searchParams.get('page')) ? parseInt(searchParams.get('page')) : 1
                                    }
                                    presentPage={
                                        parseInt(searchParams.get('page')) ? parseInt(searchParams.get('page')) : 1
                                    }
                                    totalItemsCount={serverDataCount}
                                    defaultPageSize={itemsPerPageFromEnv}
                                    pageSize={
                                        parseInt(searchParams.get('limit'))
                                            ? parseInt(searchParams.get('limit'))
                                            : itemsPerPageFromEnv
                                    }
                                    handlePageNumberChange={handlePageNumberChange}
                                    showSizeChanger={true}
                                    showTotal={true}
                                />
                            </Content>
                        ) : null}
                    </Content>
                )}
            </Content>
            <StoreModal
                isVisible={showGroupModal}
                okButtonText={null}
                title={t('labels:warning')}
                cancelButtonText={null}
                cancelCallback={() => setShowGroupModal(false)}
                width={700}
                isSpin={false}
                hideCloseButton={false}>
                <CreateGroup groupNameProps={groupName} setShowGroupModal={setShowGroupModal} />
            </StoreModal>
            <StoreModal
                isVisible={showDeleteModal}
                okButtonText={`${t('labels:yes')}`}
                cancelButtonText={`${t('labels:cancel')}`}
                title={t('labels:warning')}
                okCallback={() => removeGroup()}
                cancelCallback={() => setShowDeleteModal(false)}
                isSpin={deleteModalLoading}>
                {<div> {t('messages:are_you_sure_you_want_delete_the_group')}?</div>}
            </StoreModal>
            <StoreModal
                isVisible={showDeleteUserModal}
                okButtonText={`${t('labels:yes')}`}
                cancelButtonText={`${t('labels:cancel')}`}
                title={t('labels:warning')}
                okCallback={() => removeUser()}
                cancelCallback={() => setShowDeleteUserModal(false)}
                isSpin={deleteModalLoading}>
                {<div> {t('messages:are_you_sure_you_want_delete_the_user')}?</div>}
            </StoreModal>
            <StoreModal
                isVisible={showUserEnableDisableModal}
                okButtonText={`${t('labels:yes')}`}
                cancelButtonText={`${t('labels:cancel')}`}
                title={t('labels:warning')}
                okCallback={() => enableDisableUserFromServer()}
                cancelCallback={() => setShowUserEnableDisableModal(false)}
                isSpin={deleteModalLoading}>
                {
                    <div>
                        {selectedUserData.status === true ? (
                            <p>{t('messages:are_you_sure_you_want_disable_status')}?</p>
                        ) : (
                            <p>{t('messages:are_you_sure_you_want_enable_status')}?</p>
                        )}
                    </div>
                }
            </StoreModal>
        </Content>
    )
}

export default UserAccessControl
