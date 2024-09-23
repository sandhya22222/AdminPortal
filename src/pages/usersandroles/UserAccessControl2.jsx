import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import MarketplaceServices from '../../services/axios/MarketplaceServices'
import { usePageTitle } from '../../hooks/usePageTitle'
import { Button } from '../../shadcnComponents/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../shadcnComponents/ui/card'
import { Switch } from '../../shadcnComponents/ui/switch'
import { Badge } from '../../shadcnComponents/ui/badge'
import { Separator } from '../../shadcnComponents/ui/separator'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../../shadcnComponents/ui/dialog'
import { cn } from '../../lib/utils'
import ShadCNDataTable from '../../../src/shadcnComponents/customComponents/ShadCNDataTable'

const itemsPerPageFromEnv = process.env.REACT_APP_ITEM_PER_PAGE
const groupsAPI = process.env.REACT_APP_GROUPS_API
const usersAllAPI = process.env.REACT_APP_USERS_ALL_API
const userAPI = process.env.REACT_APP_USERS_API
const updateUserStatusAPI = process.env.REACT_APP_USER_STATUS_API
const currentUserDetailsAPI = process.env.REACT_APP_USER_PROFILE_API

export default function UserAccessControl() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const [searchParams, setSearchParams] = useSearchParams()
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [groupId, setShowGroupId] = useState()
    const [deleteModalLoading, setDeleteModalLoading] = useState(false)
    const [showDeleteUserModal, setShowDeleteUserModal] = useState(false)
    const [userName, setUserName] = useState()
    const [showUserEnableDisableModal, setShowUserEnableDisableModal] = useState(false)
    const [selectedUserData, setSelectedUserData] = useState({})
    const [currentUserDetailsAPIData, setCurrentUserDetailsAPIData] = useState()
    const [activeTab, setActiveTab] = useState('users')
    usePageTitle(`${t('labels:user_access_control')}`)

    const handleTabChange = (tab) => {
        setActiveTab(tab)
        setSearchParams({
            tab,
            page: '1',
            limit: itemsPerPageFromEnv,
        })
    }

    const getCurrentUserDetails = () => {
        MarketplaceServices.findAll(currentUserDetailsAPI, null, false)
            .then((res) => {
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
            tab: searchParams.get('tab') || 'users',
            page: searchParams.get('page') || '1',
            limit: searchParams.get('limit') || itemsPerPageFromEnv,
        })
    }, [])

    const usersColumns = [
        {
            key: 'username',
            header: t('labels:username'),
            value: 'username',
        },
        {
            key: 'email',
            header: t('labels:email'),
            value: 'email',
        },
        {
            key: 'status',
            header: t('labels:status'),
            render: (value, row) => (
                <Switch
                    disabled={
                        (currentUserDetailsAPIData?.preferred_username === row?.username &&
                            currentUserDetailsAPIData?.email === row?.email) ||
                        row?.attributes?.is_default_owner[0] === 'True'
                    }
                    checked={row?.enabled || false}
                    onCheckedChange={() => openUserEnableDisableModal(row?.enabled, row?.username)}
                />
            ),
        },
        {
            key: 'role',
            header: t('labels:role'),
            render: (value, row) => (
                <div className='flex gap-2'>
                    <span>
                        {row?.groups && row.groups[0]?.name
                            ? String(row.groups[0].name).replaceAll('-', ' ')
                            : t('labels:not_available')}
                    </span>
                    {row?.attributes?.is_default_owner[0] === 'True' && (
                        <Badge className='bg-black text-white border px-3 py-1  text-xs rounded-none'>
                            {t('labels:primary_account')}
                        </Badge>
                    )}
                </div>
            ),
        },
        {
            key: 'actions',
            header: t('labels:action'),
            render: (value, row) => {
                const isDeleteDisabled =
                    currentUserDetailsAPIData?.preferred_username === row?.username ||
                    row?.attributes?.is_default_owner[0] === 'True' ||
                    currentUserDetailsAPIData?.email === row?.email

                return (
                    <div className='flex items-center space-x-2'>
                        <Button
                            variant='ghost'
                            className={cn(
                                'text-sm font-medium px-2 py-1',
                                isDeleteDisabled
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-red-500 hover:text-red-700'
                            )}
                            onClick={() => !isDeleteDisabled && openUserDeleteModal(row?.username)}
                            disabled={isDeleteDisabled}>
                            {t('labels:delete')}
                        </Button>
                        <Separator orientation='vertical' className='h-6' />
                        <Button
                            variant='ghost'
                            className='text-sm text-orange-500 hover:text-orange-700 font-medium px-2 py-1'
                            onClick={() =>
                                navigate(
                                    `/dashboard/user-access-control/edit-user?id=${row?.id}&Loginuname=${currentUserDetailsAPIData?.preferred_username}&default=${row?.attributes?.is_default_owner[0]}`
                                )
                            }>
                            {t('labels:edit')}
                        </Button>
                    </div>
                )
            },
        },
    ]

    const groupColumns = [
        {
            key: 'name',
            header: t('labels:role_name'),
            value: 'name',
            render: (value) => String(value || '').replaceAll('-', ' '),
        },
    ]

    const handlePageNumberChange = (page, pageSize) => {
        setSearchParams({
            tab: searchParams.get('tab'),
            page: page.toString(),
            limit: pageSize.toString(),
        })
    }

    const openUserDeleteModal = (userName) => {
        setShowDeleteUserModal(true)
        setUserName(userName)
    }

    const openUserEnableDisableModal = (userStatus, userName) => {
        setSelectedUserData({ status: userStatus, username: userName })
        setShowUserEnableDisableModal(true)
    }

    const removeGroup = () => {
        setDeleteModalLoading(true)
        MarketplaceServices.remove(groupsAPI, { group_name: groupId })
            .then((response) => {
                setDeleteModalLoading(false)
                queryClient.invalidateQueries('groupList')
                setShowDeleteModal(false)
            })
            .catch((error) => {
                setDeleteModalLoading(false)
            })
    }

    const enableDisableUserFromServer = () => {
        setDeleteModalLoading(true)
        MarketplaceServices.update(
            updateUserStatusAPI,
            { status: !selectedUserData.status },
            { user_name: selectedUserData.username }
        )
            .then((response) => {
                setDeleteModalLoading(false)
                queryClient.invalidateQueries('userData')
                setShowUserEnableDisableModal(false)
            })
            .catch((error) => {
                setDeleteModalLoading(false)
            })
    }

    const findAllGroupLists = async (page, limit) => {
        const res = await MarketplaceServices.findByPage(groupsAPI, null, page, limit, false)
        return res?.data?.response_body
    }

    const findAllUsersLists = async (page, limit) => {
        const res = await MarketplaceServices.findByPage(usersAllAPI, null, page, limit, false)
        return res?.data?.response_body?.users
    }

    const {
        data: groupServerData,
        isLoading: isGroupLoading,
        isError: isGroupError,
    } = useQuery({
        queryKey: ['groupList', searchParams.get('page'), searchParams.get('limit')],
        queryFn: () => findAllGroupLists(searchParams.get('page'), searchParams.get('limit')),
        refetchOnWindowFocus: false,
        retry: false,
    })

    const {
        data: usersServerData,
        isLoading: isUsersLoading,
        isError: isUsersError,
    } = useQuery({
        queryKey: ['userData', searchParams.get('page'), searchParams.get('limit')],
        queryFn: () => findAllUsersLists(searchParams.get('page'), searchParams.get('limit')),
        refetchOnWindowFocus: false,
        retry: false,
    })

    const removeUser = () => {
        setDeleteModalLoading(true)
        MarketplaceServices.remove(userAPI, { 'user-name': userName })
            .then((response) => {
                queryClient.invalidateQueries('userData')
                setDeleteModalLoading(false)
                setShowDeleteUserModal(false)
            })
            .catch((error) => {
                setDeleteModalLoading(false)
            })
    }

    const Header = () => (
        <div className='flex flex-col justify-between items-start px-4 pt-4 w-full'>
            <div className='flex justify-between w-full items-center '>
                <div className='justify-between mb-5'>
                    <h1 className='text-2xl font-bold my-3'>{t('labels:user_access_control')}</h1>
                    <p className='text-muted-foreground'>{t('labels:user_access_control_note')}</p>
                </div>
                <div className=' mb-8 mr-80  '>
                    {activeTab === 'users' && (
                        <Button onClick={() => navigate('/dashboard/user-access-control/add-user')}>
                            {t('labels:add_user')}
                        </Button>
                    )}
                </div>
            </div>
            <TabNavigation />
        </div>
    )

    const TabNavigation = () => (
        <div className='flex border-b border-gray-200 '>
            <button
                className={cn(
                    'px-4 py-2 font-medium text-sm focus:outline-none',
                    activeTab === 'users'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-muted-foreground hover:text-primary'
                )}
                onClick={() => handleTabChange('users')}>
                Users
            </button>
            <button
                className={cn(
                    'px-4 py-2 font-medium text-sm focus:outline-none',
                    activeTab === 'roles'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-muted-foreground hover:text-primary'
                )}
                onClick={() => handleTabChange('roles')}>
                Roles
            </button>
        </div>
    )

    const renderContent = () => {
        if (activeTab === 'users') {
            return (
                <Card>
                    <CardHeader>
                        <CardTitle>{t('labels:users')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isUsersLoading ? (
                            <div className='w-full h-[200px] animate-pulse bg-gray-200' />
                        ) : isUsersError ? (
                            <p className='text-center text-red-500'>{t('messages:network_error')}</p>
                        ) : (
                            <ShadCNDataTable columns={usersColumns} data={usersServerData || []} />
                        )}
                    </CardContent>
                </Card>
            )
        } else {
            return (
                <Card>
                    <CardHeader>
                        <CardTitle>{t('labels:roles')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isGroupLoading ? (
                            <div className='w-full h-[200px] animate-pulse bg-gray-200' />
                        ) : isGroupError ? (
                            <p className='text-center text-red-500'>{t('messages:network_error')}</p>
                        ) : (
                            <ShadCNDataTable columns={groupColumns} data={groupServerData || []} />
                        )}
                    </CardContent>
                </Card>
            )
        }
    }

    return (
        <div className='w-full mt-12 py-6 '>
            <div className='mb-3 w-full bg-white fixed z-20 '>
                <Header />
            </div>
            <div className='mx-3 mt-40'>
                {renderContent()}

                <Dialog open={showDeleteUserModal} onOpenChange={setShowDeleteUserModal}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t('labels:warning')}</DialogTitle>
                            <DialogDescription>{t('messages:are_you_sure_you_want_delete_the_user')}</DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant='outline' onClick={() => setShowDeleteUserModal(false)}>
                                {t('labels:cancel')}
                            </Button>
                            <Button onClick={removeUser} disable={deleteModalLoading}>
                                {t('labels:yes')}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={showUserEnableDisableModal} onOpenChange={setShowUserEnableDisableModal}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t('labels:warning')}</DialogTitle>
                            <DialogDescription>
                                {selectedUserData.status
                                    ? t('messages:are_you_sure_you_want_disable_status')
                                    : t('messages:are_you_sure_you_want_enable_status')}
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant='outline' onClick={() => setShowUserEnableDisableModal(false)}>
                                {t('labels:cancel')}
                            </Button>
                            <Button onClick={enableDisableUserFromServer} disabled={deleteModalLoading}>
                                {t('labels:yes')}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
