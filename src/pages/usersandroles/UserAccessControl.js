import React, { useEffect, useState } from 'react'
import { Layout, Typography, Skeleton, Table, Button, Switch, Tooltip, Divider } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
// import { MdEdit } from "react-icons/md";
import { useTranslation } from 'react-i18next'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import MarketplaceServices from '../../services/axios/MarketplaceServices'
import HeaderForTitle from '../../components/header/HeaderForTitle'
import DmTabAntDesign from '../../components/DmTabAntDesign/DmTabAntDesign'
import DmPagination from '../../components/DmPagination/DmPagination'
import CreateGroup from './CreateGroup'
import StoreModal from '../../components/storeModal/StoreModal'
import MarketplaceToaster from '../../util/marketplaceToaster'
import { usePageTitle } from '../../hooks/usePageTitle'

const { Content } = Layout
const { Text } = Typography

const itemsPerPageFromEnv = process.env.REACT_APP_ITEM_PER_PAGE
const groupsAPI = process.env.REACT_APP_GROUPS_API
const usersAllAPI = process.env.REACT_APP_USERS_ALL_API
const userAPI = process.env.REACT_APP_USERS_API
const updateUserStatusAPI = process.env.REACT_APP_USER_STATUS_API
const currentUserDetailsAPI = process.env.REACT_APP_USER_PROFILE_API

const UserAccessControl = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const [searchParams, setSearchParams] = useSearchParams()
    // const [isLoading, setIsLoading] = useState(false)
    // const [isNetworkError, setIsNetworkError] = useState(false)
    // const [serverDataCount, setServerDataCount] = useState()
    // const [usersServerData, setUsersServerData] = useState([])
    // const [groupServerData, setGroupServerData] = useState([])
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
            tabTitle: <p className='!mb-0 !mr-4'>{t('labels:roles')}</p>,
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
            title: <Text className='text-regal-blue text-sm font-medium leading-[22px]'>{t('labels:username')}</Text>,
            dataIndex: 'userName',
            key: 'userName',
            ellipsis: true,
            width: '17%',
            render: (text, record) => {
                return <Content className='text-brandGray1'>{record.username}</Content>
            },
        },

        {
            title: <Text className='text-regal-blue text-sm font-medium leading-[22px]'>{t('labels:email')}</Text>,
            dataIndex: 'emailId',
            key: 'emailId',
            width: '25%',
            render: (text, record) => {
                return <Content className='text-brandGray1'>{record.email}</Content>
            },
        },
        {
            title: <Text className='text-regal-blue text-sm font-medium leading-[22px]'>{t('labels:status')}</Text>,
            dataIndex: 'status',
            key: 'status',
            width: '10%',
            render: (text, record) => {
                return (
                    <Content>
                        <Switch
                            disabled={
                                (currentUserDetailsAPIData?.preferred_username === record?.username &&
                                    currentUserDetailsAPIData?.email === record?.email) ||
                                record.attributes?.is_default_owner[0] === 'True'
                                    ? true
                                    : false
                            }
                            // className={record.enabled === true ? '!bg-green-500' : '!bg-gray-400'}
                            checked={record.enabled}
                            onChange={() => openUserEnableDisableModal(record.enabled, record.username)}
                        />
                    </Content>
                )
            },
        },
        {
            title: <Text className='text-regal-blue text-sm font-medium leading-[22px]'>{t('labels:role')}</Text>,
            dataIndex: 'role',
            key: 'role',
            width: '25%',
            ellipsis: true,
            render: (text, record) => {
                return (
                    <Content className='flex gap-2'>
                        <div className='text-brandGray1'>
                            {record.groups[0]?.name
                                ? String(record.groups[0]?.name).replaceAll('-', ' ')
                                : t('labels:not_available')}
                        </div>
                        <div className=''>
                            {record.attributes?.is_default_owner[0] === 'True' ? (
                                <div className='bg-black text-white border px-1'>{t('labels:primary_account')}</div>
                            ) : (
                                ''
                            )}
                        </div>
                    </Content>
                )
            },
        },
        {
            title: <Text className='text-regal-blue text-sm font-medium leading-[22px]'>{t('labels:action')}</Text>,
            dataIndex: '',
            key: '',
            width: '15%',
            render: (text, record) => {
                return (
                    <Content className='flex items-center'>
                        {currentUserDetailsAPIData?.preferred_username === record?.username ||
                        record.attributes?.is_default_owner[0] === 'True' ||
                        currentUserDetailsAPIData?.email === record?.email ? (
                            <div className='text-[#cbd5e1] !ml-[10px] whitespace-nowrap  cursor-not-allowed'>
                                {t('labels:delete')}
                            </div>
                        ) : (
                            <div
                                className='text-[15px] text-dangerColor hover:text-dangerColor font-medium ml-2 cursor-pointer'
                                onClick={() => openUserDeleteModal(record.username)}>
                                {t('labels:delete')}
                            </div>
                        )}
                        <Divider type='vertical' className='h-6 !border-r-1 ' />

                        <div
                            className='text-[15px] text-[#FB8500] hover:text-[#FB8500] font-medium ml-2 cursor-pointer'
                            onClick={() => {
                                navigate(
                                    `/dashboard/user-access-control/edit-user?id=${record.id}&Loginuname=${currentUserDetailsAPIData?.preferred_username}&default=${record.attributes?.is_default_owner[0]}`
                                )
                            }}>
                            {t('labels:edit')}
                        </div>
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
            title: <Text className='text-regal-blue text-sm font-medium leading-[22px]'>{t('labels:role_name')}</Text>,
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,

            render: (text, record) => {
                return <Content className='text-brandGray1'>{String(record.name).replaceAll('-', ' ')}</Content>
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

                // setIsLoading(true)
                if (parseInt(presentTab) === 0) {
                    queryClient.invalidateQueries('userData')
                } else if (parseInt(presentTab) === 2) {
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
    const findAllGroupLists = async (page, limit) => {
        // Fetcher function
        const res = await MarketplaceServices.findByPage(groupsAPI, null, page, limit, false)
        return res?.data?.response_body
    }

    //! Using the useQuery hook to fetch the group list server Data
    const {
        data: groupServerData,
        isLoading,
        isError: isNetworkError,
    } = useQuery({
        queryKey: ['groupList'],
        queryFn: () =>
            findAllGroupLists(
                searchParams.get('page') ? searchParams.get('page') : 1,
                searchParams.get('limit') ? searchParams.get('limit') : itemsPerPageFromEnv
            ),
        refetchOnWindowFocus: false,
        retry: false,
    })

    //Get call of groups
    const findAllUsersLists = async (page, limit) => {
        // Fetcher function
        const res = await MarketplaceServices.findByPage(usersAllAPI, null, page, limit, false)
        return res?.data?.response_body?.users
    }

    //! Using the useQuery hook to fetch the group list server Data
    const { data: usersServerData } = useQuery({
        queryKey: ['userData'],
        queryFn: () =>
            findAllUsersLists(
                searchParams.get('page') ? searchParams.get('page') : 1,
                searchParams.get('limit') ? searchParams.get('limit') : itemsPerPageFromEnv
            ),
        refetchOnWindowFocus: false,
        retry: false,
    })

    //Delete call of user frm server
    const removeUser = () => {
        setDeleteModalLoading(true)
        MarketplaceServices.remove(userAPI, {
            'user-name': userName,
        })
            .then(function (response) {
                console.log('delete response of user', response)
                // Invalidate the query to trigger a refetch
                queryClient.invalidateQueries('userData')

                setDeleteModalLoading(false)
                MarketplaceToaster.showToast(response)
                // findAllUsersLists()
                setShowDeleteUserModal(false)
            })
            .catch(function (error) {
                console.log('delete error response of user', error)
                MarketplaceToaster.showToast(error.response)
                setDeleteModalLoading(false)
            })
    }

    console.log('usersServerData', usersServerData)
    return (
        <Content>
            <HeaderForTitle
                title={
                    <Content>
                        <div className='flex flex-row justify-between items-center h-[42px]'>
                            <Text level={3} className='!font-semibold text-regal-blue text-2xl'>
                                {t('labels:user_access_control')}
                            </Text>
                            {searchParams.get('tab') === '0' ? (
                                <Button
                                    className='app-btn-primary !h-8 hover:!h-8'
                                    onClick={() => navigate('/dashboard/user-access-control/add-user?')}>
                                    {t('labels:add_user')}
                                </Button>
                            ) : null}
                        </div>
                        <p className='!font-normal !text-brandGray1 mt-2'>{t('labels:user_access_control_note')}</p>
                    </Content>
                }
                headerContent={
                    <Content className='mt-[5.5rem]'>
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
                    <Content className=' bg-white rounded-md shadow-brandShadow p-3'>
                        <div className='mx-1 mb-3 text-base font-semibold text-regal-blue'>
                            {parseInt(searchParams.get('tab')) === 0 ? `${t('labels:users')}` : `${t('labels:roles')}`}
                        </div>
                        {parseInt(searchParams.get('tab')) === 1 ? (
                            <>
                                <Table dataSource={groupServerData} columns={groupColumns} pagination={false} />
                                {groupServerData?.length > itemsPerPageFromEnv ? (
                                    <Content className='!grid !justify-items-end'>
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
                                            totalItemsCount={groupServerData?.length}
                                            defaultPageSize={itemsPerPageFromEnv}
                                            pageSize={
                                                parseInt(searchParams.get('limit'))
                                                    ? parseInt(searchParams.get('limit'))
                                                    : itemsPerPageFromEnv
                                            }
                                            handlePageNumberChange={handlePageNumberChange}
                                            showSizeChanger={true}
                                            showTotal={true}
                                            showQuickJumper={true}
                                        />
                                    </Content>
                                ) : null}
                            </>
                        ) : parseInt(searchParams.get('tab')) === 2 ? null : (
                            <>
                                <Table dataSource={usersServerData} columns={usersColumns} pagination={false} />
                                {usersServerData?.length > itemsPerPageFromEnv ? (
                                    <Content className='!grid !justify-items-end'>
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
                                            totalItemsCount={usersServerData?.length}
                                            defaultPageSize={itemsPerPageFromEnv}
                                            pageSize={
                                                parseInt(searchParams.get('limit'))
                                                    ? parseInt(searchParams.get('limit'))
                                                    : itemsPerPageFromEnv
                                            }
                                            handlePageNumberChange={handlePageNumberChange}
                                            showSizeChanger={true}
                                            showTotal={true}
                                            showQuickJumper={true}
                                        />
                                    </Content>
                                ) : null}
                            </>
                        )}
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
                            <p>{t('messages:are_you_sure_you_want_disable_status')}</p>
                        ) : (
                            <p>{t('messages:are_you_sure_you_want_enable_status')}</p>
                        )}
                    </div>
                }
            </StoreModal>
        </Content>
    )
}

export default UserAccessControl
