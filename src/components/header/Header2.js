import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import './header2.css'
import MarketplaceServices from '../../services/axios/MarketplaceServices'
import {RiUserLine} from 'react-icons/ri'
import { ChevronDown ,LogOut } from 'lucide-react'

import { Button } from '../../shadcnComponents/ui/button'
//! Import user defined services
import { fnUserProfileInfo } from '../../services/redux/actions/ActionUserProfile'
import { marketPlaceLogo, BackIcon } from '../../constants/media'

import util from '../../util/common'
import { useAuth } from 'react-oidc-context'
import useGetStoreUserData from '../../hooks/useGetStoreUsersData'
import useGetProfileImage from '../../pages/StoreUsers/hooks/useGetProfileImage'
import { Badge } from '../../shadcnComponents/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '../../shadcnComponents/ui/popover'
import { Avatar, AvatarImage, AvatarFallback } from '../../shadcnComponents/ui/avatar'

const storeUsersAPI = process.env.REACT_APP_USERS_API
const portalInfo = JSON.parse(process.env.REACT_APP_PORTAL_INFO)

const Header2 = ({ setIsLanguageSelected }) => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const auth = useAuth()
    const navigate = useNavigate()

    const [userName, setUserName] = useState()
    const [userRole, setUserRole] = useState('')

    const userProfileInfo = useSelector((state) => state.reducerUserProfileInfo.userProfileInfo)


    const userItems = [
        {
            label: <p className='text-dangerColor'> {t('common:logout')} </p>,
            key: 'logout',
            icon: <LogOut size={16} color='red' />,
            danger: true,
        },
    ]

    const handleMenuClick = (e) => {
        if (e === 'logout') {
            util.removeIsAuthorized()
            void auth.signoutRedirect()
        }
        if (e === 'profile') {
            navigate('dashboard/userprofile')
        }
    }
    const findAllWithoutPageStoreUsers = () => {
        MarketplaceServices.findAllWithoutPage(storeUsersAPI, null, false)
            .then(function (response) {
                console.log('get from  store user server response-----> ', response.data)
                setUserName(response.data.response_body.username)
                setUserRole(response.data.response_body.groups[0]?.name)
                const userName = response.data.response_body.username
                dispatch(fnUserProfileInfo(userName))
            })
            .catch((error) => {
                console.log('error from store all users API ====>', error.response)
            })
    }

    const { data: storeUsersData } = useGetStoreUserData()
    const { data: profileImage } = useGetProfileImage(storeUsersData?.attributes?.profile_image_path?.[0])
    useEffect(() => {
        findAllWithoutPageStoreUsers()
    }, [])

    return (
        <div>
            <div className='fixed z-20 top-0 p-0 !h-[72px] w-full header'>
                <div className='px-3 border-b-[1px] !h-[72px] flex flex-row !justify-between items-center '>
                    {/* Left content which displays brand logo and other stuffs */}
                    <div className='flex flex-row items-center'>
                        <div className='flex items-center mx-2 '>
                            <Link to='/dashboard'>
                                <img
                                    alt='marketPlaceLogo'
                                    src={marketPlaceLogo}
                                    className='cursor-pointer'
                                    height={40}
                                />
                            </Link>
                        </div>
                        <div className='mx-2 flex items-center'>
                            <Badge className='portalNameTag'>
                                <p className='!px-2 text-[12px] text-white font-medium leading-5'>
                                    {portalInfo && portalInfo.title.toUpperCase()}
                                </p>
                            </Badge>
                        </div>
                    </div>

                    {/* Center content to display any item if required */}
                    <div className='flex flex-1'></div>
                    {/* Right content to display user menus, login icon, language icon and other stuffs */}
                    <div className='!flex  !justify-end !items-center px-2'>
                        {/* Display user dropdown if user is logged in otherwise display login icon */}
                        {auth.isAuthenticated ? (
                            <div
                                className={`flex !self-end ${
                                    util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL'
                                        ? 'ml-[5px]'
                                        : 'mr-[5px]'
                                }`}>
                                <Avatar
                                    className={`bg-gray-400 mx-1 !leading-10 ${profileImage && 'custom-avatar'}`}
                                    style={{ width: 48, height: 48 }}>
                                    {storeUsersData?.attributes?.profile_image_path?.[0] ? (
                                        <AvatarImage src={profileImage} alt='Profile Image' />
                                    ) : (
                                        <AvatarFallback className='bg-gray-400 '>
                                            <RiUserLine className='text-white ' />
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                                <div className={`!flex flex-col`}>
                                    <span className='font-normal text-sm text-[#637381] leading-[22px] whitespace-nowrap *:'>
                                        {userName ? userName : userProfileInfo}{' '}
                                    </span>
                                    {/* <DropdownMenu>
                                        <DropdownMenuTrigger className='cursor-pointer'>
                                            <p className='text-xs text-[#8899A8] !leading-[20px] font-normal whitespace-nowrap flex flex-row items-center'>
                                                {userRole ? userRole.replace(/-/g, ' ') : ''}
                                                <RiArrowDropDownLine className='text-2xl mx-1' />
                                            </p>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent className='fixed overflow-visible z-20'>
                                            {userItems.map((item) => (
                                                <DropdownMenuItem
                                                    key={item.key}
                                                    onClick={() => handleMenuClick(item)}
                                                    className='whitespace-nowrap cursor-pointer gap-2 hover:bg-dangerColor hover:text-white text-dangerColor '>
                                                    {item.icon} {item.label}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu> */}
                                    <Popover className='cursor-pointer'>
                                        <PopoverTrigger className='flex flex-row items-center whitespace-nowrap text-xs font-normal !leading-[20px] text-[#8899A8]'>
                                            {userRole ? userRole.replace(/-/g, ' ') : ''} <ChevronDown size={16} />
                                        </PopoverTrigger>
                                        {userItems?.map((item) => (
                                            <PopoverContent
                                                key={item.key}
                                                onClick={() => handleMenuClick(item.key)}
                                                className='w-max cursor-pointer p-2'>
                                                <div className='flex flex-row items-center justify-center gap-2'>
                                                    <div>{item.icon}</div>
                                                    <span>{item.label}</span>
                                                </div>
                                            </PopoverContent>
                                        ))}
                                    </Popover>
                                </div>
                            </div>
                        ) : (
                            <Button
                                className={`!p-0 !ml-[5px] ${
                                    util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? 'ml-[5px]' : ''
                                }`}>
                                <RiUserLine className='text-[24px] text-[#637381]' />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header2
