import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import './header2.css'
import MarketplaceServices from '../../services/axios/MarketplaceServices'
import { RiArrowDropDownLine, RiUserLine, RiLogoutCircleRLine } from 'react-icons/ri'
import { Button } from '../../shadcnComponents/ui/button'
//! Import user defined services
import {
    fnSelectedLanguage,
    fnStoreLanguage,
    fnDefaultLanguage,
} from '../../services/redux/actions/ActionStoreLanguage'
import { fnUserProfileInfo } from '../../services/redux/actions/ActionUserProfile'
import { marketPlaceLogo, BackIcon } from '../../constants/media'

import util from '../../util/common'
import { useAuth } from 'react-oidc-context'
import useGetStoreUserData from '../../hooks/useGetStoreUsersData'
import useGetProfileImage from '../../pages/StoreUsers/hooks/useGetProfileImage'
import { Badge } from '../../shadcnComponents/ui/badge'
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '../../shadcnComponents/ui/select'
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '../../shadcnComponents/ui/dropdownMenu'
import { Avatar, AvatarImage, AvatarFallback } from '../../shadcnComponents/ui/avatar'

const multilingualFunctionalityEnabled = process.env.REACT_APP_IS_MULTILINGUAL_ENABLED
const languageAPI = process.env.REACT_APP_STORE_LANGUAGE_API
const storeUsersAPI = process.env.REACT_APP_USERS_API
const portalInfo = JSON.parse(process.env.REACT_APP_PORTAL_INFO)

const Header2 = ({ setIsLanguageSelected }) => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const auth = useAuth()
    const navigate = useNavigate()

    const [userName, setUserName] = useState()
    const [userRole, setUserRole] = useState('')

    const storeLanguages = useSelector((state) => state.reducerStoreLanguage.storeLanguage)
    const selectedLanguage = useSelector((state) => state.reducerSelectedLanguage.selectedLanguage)

    const [defaultLanguageCode, setDefaultLanguageCode] = useState(selectedLanguage && selectedLanguage.language_code)

    const [storeSelectedLngCode, setStoreSelectedLngCode] = useState(selectedLanguage && selectedLanguage.language_code)
    const userProfileInfo = useSelector((state) => state.reducerUserProfileInfo.userProfileInfo)
    const languageItems = []
    if (storeLanguages && storeLanguages.length > 0) {
        storeLanguages.forEach((element) => {
            const languageItem = {}
            languageItem['value'] = element.language_code
            languageItem['label'] = element.language
            languageItems.push(languageItem)
        })
    }

    const userItems = [
        {
            label: `${t('labels:logout')}`,
            key: 'logout',
            icon: <RiLogoutCircleRLine />,
            danger: true,
        },
    ]

    const handleMenuClick = (e) => {
        if (e.key === 'logout') {
            util.removeIsAuthorized()
            void auth.signoutRedirect()
        }
        if (e.key === 'profile') {
            navigate('dashboard/userprofile')
        }
    }

    const handleLanguageClick = (value) => {
        util.setUserSelectedLngCode(value)
        setStoreSelectedLngCode(value)
        dispatch(fnSelectedLanguage(storeLanguages.find((item) => item.language_code === value)))
        document.body.style.direction = util.getSelectedLanguageDirection()?.toLowerCase()
        setIsLanguageSelected(true)
        setTimeout(() => {
            navigate(0)
        }, 500)
    }

    const findAllLanguages = () => {
        MarketplaceServices.findAll(languageAPI, { 'language-status': 1 }, false)
            .then((response) => {
                console.log('Server response from findAllStoreLanguages', response.data.response_body)
                const storeLanguages = response.data.response_body
                const defaultLanguage = storeLanguages.find((item) => item.is_default)

                const userSelectedLanguageCode = util.getUserSelectedLngCode()
                if (userSelectedLanguageCode === undefined) {
                    const userSelectedLanguage = defaultLanguage
                    dispatch(fnSelectedLanguage(userSelectedLanguage))
                    document.body.style.direction =
                        userSelectedLanguage && userSelectedLanguage.writing_script_direction?.toLowerCase()
                }
                if (util.getUserSelectedLngCode()) {
                    let selectedLanguagePresentOrNot =
                        storeLanguages &&
                        storeLanguages.length > 0 &&
                        storeLanguages.filter((ele) => ele.language_code === util.getUserSelectedLngCode())
                    if (selectedLanguagePresentOrNot && selectedLanguagePresentOrNot.length > 0) {
                        const alreadySelectedLanguage = storeLanguages.find(
                            (item) => item.language_code === util.getUserSelectedLngCode()
                        )
                        dispatch(fnSelectedLanguage(alreadySelectedLanguage))
                        document.body.style.direction =
                            alreadySelectedLanguage && alreadySelectedLanguage.writing_script_direction?.toLowerCase()
                    } else {
                        const defaultLanguageSelectedLanguage = defaultLanguage
                        console.log('testInDahsboardSelectedLangInHeader#', defaultLanguageSelectedLanguage)
                        dispatch(fnSelectedLanguage(defaultLanguageSelectedLanguage))
                        util.setUserSelectedLngCode(defaultLanguageSelectedLanguage.language_code)
                        document.body.style.direction =
                            defaultLanguageSelectedLanguage &&
                            defaultLanguageSelectedLanguage.writing_script_direction?.toLowerCase()
                        setTimeout(function () {
                            navigate(0)
                        }, 2000)
                    }
                }

                dispatch(fnStoreLanguage(storeLanguages))
                dispatch(fnDefaultLanguage(defaultLanguage))
            })
            .catch((error) => {
                console.log('error-->', error.response)
            })
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
        findAllLanguages()
        findAllWithoutPageStoreUsers()
    }, [])
    useEffect(() => {
        setStoreSelectedLngCode(selectedLanguage && selectedLanguage.language_code)
        setDefaultLanguageCode(util.getUserSelectedLngCode())
    }, [selectedLanguage])

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
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className='cursor-pointer'>
                                            <p className='text-xs text-[#8899A8] !leading-[20px] font-normal whitespace-nowrap flex flex-row items-center'>
                                                {userRole ? userRole.replace(/-/g, ' ') : ''}
                                                <RiArrowDropDownLine className='text-2xl mx-1' />
                                            </p>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            {userItems.map((item) => (
                                                <DropdownMenuItem key={item.key} onClick={handleMenuClick}>
                                                    {item.icon}
                                                    {item.label}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
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

                        {multilingualFunctionalityEnabled && (
                            <div
                                className={`flex items-center ${
                                    util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL'
                                        ? 'mr-[5px]'
                                        : 'ml-[5px]'
                                }`}>
                                <Select value={storeSelectedLngCode} onValueChange={handleLanguageClick}>
                                    <SelectTrigger className='min-w-[100px] border-none'>
                                        <SelectValue placeholder='Select Language' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {languageItems &&
                                            languageItems.map((item) => (
                                                <SelectItem key={item.value} value={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header2
