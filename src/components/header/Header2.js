import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Layout, Tooltip, Dropdown, Typography, Tag, Button, Select, Avatar, Image } from 'antd'
import { DownOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import './header2.css'

import MarketplaceServices from '../../services/axios/MarketplaceServices'
//! Import user defined services
import {
    fnSelectedLanguage,
    fnStoreLanguage,
    fnDefaultLanguage,
} from '../../services/redux/actions/ActionStoreLanguage'
import { fnUserProfileInfo } from '../../services/redux/actions/ActionUserProfile'
import { marketPlaceLogo, BackBurgerIcon, Collapse, BackIcon } from '../../constants/media'

import util from '../../util/common'
import { useAuth } from 'react-oidc-context'

const { Header, Content } = Layout
const { Paragraph } = Typography
const { Option } = Select

const multilingualFunctionalityEnabled = process.env.REACT_APP_IS_MULTILINGUAL_ENABLED
const languageAPI = process.env.REACT_APP_STORE_LANGUAGE_API
const storeUsersAPI = process.env.REACT_APP_USERS_API
const portalInfo = JSON.parse(process.env.REACT_APP_PORTAL_INFO)

console.log('portalInfoTest', portalInfo)
const Header2 = ({ collapsed, setCollapsed }) => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const { Text } = Typography
    const auth = useAuth()
    const navigate = useNavigate()

    const [userName, setUserName] = useState()
    const [userRole, setUserRole] = useState('')

    // const isUserLoggedIn = sessionStorage.getItem("ap_is_logged_in");
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
        // Todo: Commenting for now, will implement once the details are ready
        // {
        //     label: `${t('labels:profile')}`,
        //     key: 'profile',
        //     icon: <UserOutlined />,
        //     // disabled: true,
        // },
        {
            label: `${t('labels:logout')}`,
            key: 'logout',
            icon: <LogoutOutlined />,
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
        navigate(0)
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

                        // setDependencyForPageRefreshForInvalidSelectedLanguage(true);
                        setTimeout(function () {
                            navigate(0)
                        }, 2000)
                    }
                }

                dispatch(fnStoreLanguage(storeLanguages))
                dispatch(fnDefaultLanguage(defaultLanguage))
                // dispatch(fnSelectedLanguage(defaultLanguage));
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

    useEffect(() => {
        findAllLanguages()
        findAllWithoutPageStoreUsers()
    }, [])
    useEffect(() => {
        setStoreSelectedLngCode(selectedLanguage && selectedLanguage.language_code)
        setDefaultLanguageCode(util.getUserSelectedLngCode())
    }, [selectedLanguage])

    const multilingualNameChanging = (value) => {
        let multilingualKey = value.toLowerCase()
        multilingualKey = multilingualKey.replace(/ /g, '_')
        console.log('multilingualKey------>', multilingualKey)

        return multilingualKey
    }

    return (
        <Content>
            <Header className='fixed z-20 top-0 p-0  !h-[72px] w-full header drop-shadow-md'>
                <Content className='px-3 !py-2 !h-[72px] flex flex-row !justify-between items-center '>
                    {/* Left content which displays brand logo and other stuffs */}
                    <div className='flex flex-row items-center'>
                        <div
                            className={`${
                                util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? 'ml-4 mr-2' : 'ml-2 mr-4'
                            } `}>
                            <Button
                                type='text'
                                icon={
                                    collapsed ? (
                                        <img src={Collapse} alt='Collapse' />
                                    ) : (
                                        <img
                                            className={`  ${
                                                util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL'
                                                    ? 'rotate-180'
                                                    : ''
                                            }`}
                                            src={BackIcon}
                                            alt='BackButton'
                                        />
                                    )
                                }
                                onClick={() => setCollapsed(!collapsed)}
                                // className="!bg-[var(--mp-brand-color)] hover:bg-[var(--mp-brand-color)]"
                                className='hover:none'
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    padding: '8 16 8 16',
                                    marginTop: '4px',
                                    color: 'white',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            />
                        </div>
                        <div className='flex items-center mx-2 '>
                            <Link href='/dashboard'>
                                <Image
                                    //width={180}
                                    alt='marketPlaceLogo'
                                    preview={false}
                                    src={marketPlaceLogo}
                                    className='cursor-pointer'
                                    height={32}
                                />
                            </Link>
                        </div>
                        <div className='mx-2 flex items-center'>
                            <Tag className='portalNameTag'>
                                <Text className='!px-2 text-[12px] font-medium leading-5'>
                                    {portalInfo && portalInfo.title.toUpperCase()}
                                </Text>
                            </Tag>
                        </div>
                    </div>

                    {/* Center content to display any item if required */}
                    <Content className='flex flex-1'></Content>
                    {/* Right content to display user menus, login icon, language icon and other stuffs */}
                    <Content className='!flex  !justify-end !items-center px-2'>
                        {/* Display user dropdown if user is logged in otherwise display login icon */}
                        {auth.isAuthenticated ? (
                            <div className='flex !self-end'>
                                <Avatar className='bg-gray-400 mx-1' size={48} icon={<UserOutlined />} />
                                <Text
                                    className={`${
                                        util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? 'ml-4' : 'mr-4'
                                    } !flex flex-col`}>
                                    <Text className='font-bold text-sm text-white leading-[22px] whitespace-nowrap'>
                                        {userName ? userName : userProfileInfo}{' '}
                                    </Text>
                                    <Dropdown
                                        menu={{
                                            items: userItems,
                                            onClick: handleMenuClick,
                                        }}
                                        placement='bottom'
                                        trigger={['click']}
                                        className='cursor-pointer'
                                        overlayStyle={{ position: 'fixed',overflow:'visible', zIndex: 20, top: 64 }}>
                                        <Text className='text-xs text-[#9BC8E3] !leading-[20px] font-normal whitespace-nowrap '>
                                            {userRole ? userRole.replace(/-/g, ' ') : ''}{' '}
                                            <DownOutlined className='text-xs' />
                                        </Text>
                                    </Dropdown>
                                </Text>
                            </div>
                        ) : null}
                        {/* Display language dropdown only if store has more than 1 language. */}

                        {multilingualFunctionalityEnabled === 'true' && languageItems.length > 0 ? (
                            <Select
                                // options={languageItems}
                                bordered={false}
                                placeholder='Select Language'
                                defaultValue={storeSelectedLngCode || defaultLanguageCode}
                                disabled={languageItems.length === 1 ? true : false}
                                onChange={(value) => handleLanguageClick(value)}
                                className='header-select'
                                dropdownStyle={{ position: 'fixed' }}
                                key={storeSelectedLngCode}>
                                {languageItems.map((option) => (
                                    <Option key={option.value} value={option.value} className='headerSelectOption'>
                                        <Tooltip
                                            title={option.label}
                                            overlayStyle={{ position: 'fixed' }}
                                            placement='left'>
                                            <span className='overflow-hidden whitespace-nowrap'>
                                                {option.label.toUpperCase().substring(0, 3)}
                                            </span>
                                        </Tooltip>
                                    </Option>
                                ))}
                            </Select>
                        ) : (
                            <></>
                        )}
                    </Content>
                </Content>
            </Header>
        </Content>
    )
}

export default Header2
