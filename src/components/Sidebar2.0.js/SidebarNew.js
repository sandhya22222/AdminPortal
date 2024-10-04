//! Import libraries
import { LoadingOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import NewFooter from './../footer/Footer'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../../shadcnComponents/ui/resizable'
import { TooltipProvider, Tooltip } from '../../shadcnComponents/ui/tooltip'
import { cn } from '../../lib/utils'
import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md'
//! Import CSS libraries

//! Import user defined functions

//! Import user defined CSS
import { useAuth } from 'react-oidc-context'
import util from '../../util/common'
import './SidebarNewUpdated.css'
import { DashboardSVG } from './components/DashboardSVG'
import { StoresSVG } from './components/StoresSVG'
import { SettingsSVG } from './components/SettingsSVG'
import ShadCNTooltip from '../../shadcnComponents/customComponents/ShadCNTooltip'

const antIcon = <LoadingOutlined className='text-[10px] hidden' spin />
const pageLimitFromENV = process.env.REACT_APP_ITEM_PER_PAGE

//! Global Variables

const SidebarNew = ({ permissionValue, collapsed, setCollapsed }) => {
    const { t } = useTranslation()
    const [selectedItem, setSelectedItem] = useState([])
    const [openedItem, setOpenedItem] = useState([])
    const [isHovering, setIsHovering] = useState(false)

    // get permissions from storage

    const auth = useAuth()
    // console.log("Permission value...", permissionValue)

    const { pathname } = useLocation()

    const navigate = useNavigate()

    const [myData, setMyData] = useState([])

    useEffect(() => {
        switch (pathname.split('/')[2]) {
            case 'platformadmin':
                setSelectedItem('7')
                break
            case 'userprofile':
                setSelectedItem('6')
                break
            case 'paymenttype':
                setSelectedItem('5')
                break
            case 'storesetting':
                setSelectedItem('4')
                break
            case 'language':
                setSelectedItem('3')
                break
            case 'store':
                setSelectedItem('2')
                break
            case 'currency':
                setSelectedItem('13')
                break
            case 'user-access-control':
                setSelectedItem('12')
                break
            default:
                setSelectedItem('1')
                break
        }
    }, [pathname])

    useEffect(() => {
        if (permissionValue && permissionValue.length > 0) {
            setMyData([
                {
                    key: '1',
                    icon: <DashboardSVG />,
                    label: ` ${t('labels:dashboard')}`,
                    navigate_to: '/dashboard',
                    show_in_menu: true,
                },
                {
                    key: '2',
                    icon: <StoresSVG />,
                    label: ` ${t('labels:stores')}`,
                    navigate_to: '/dashboard/store?m_t=1',
                    show_in_menu: true,
                },
                {
                    key: '15',
                    icon: <SettingsSVG />,
                    label: `${t('labels:settings')}`,
                    navigate_to: '/dashboard/',
                    show_in_menu: true,
                    childrenKeys: ['3', '13', '5', '6', '7', '12'],
                    children: [
                        {
                            key: '3',
                            label: `${t('labels:language_settings')}`,
                            navigate_to: '/dashboard/language',
                            show_in_menu:
                                !auth.isAuthenticated ||
                                (auth.isAuthenticated && permissionValue.includes('UI-product-admin'))
                                    ? false
                                    : true,
                        },
                        {
                            key: '13',
                            label: ` ${t('labels:currency')}`,
                            navigate_to: '/dashboard/currency',
                            show_in_menu: true,
                        },
                        {
                            key: '5',
                            label: ` ${t('labels:payment_settings')}`,
                            navigate_to: '/dashboard/paymenttype',
                            show_in_menu: true,
                        },
                        {
                            key: '12',
                            label: `${t('labels:user_access_control')}`,
                            navigate_to: `/dashboard/user-access-control/list-user-roles?tab=0&page=1&limit=${pageLimitFromENV}`,
                            show_in_menu:
                                !auth.isAuthenticated ||
                                (auth.isAuthenticated && permissionValue.includes('UI-user-access-control'))
                                    ? true
                                    : false,
                        },
                        {
                            key: '7',
                            label: ` ${t('labels:platform_admin')}`,
                            navigate_to: '/dashboard/platformadmin',
                            show_in_menu:
                                !auth.isAuthenticated ||
                                (auth.isAuthenticated && permissionValue.includes('UI-user-access-control'))
                                    ? false
                                    : true,
                        },
                        {
                            key: '6',
                            label: ` ${t('labels:profile')}`,
                            navigate_to: '/dashboard/userprofile',
                            show_in_menu: true,
                        },
                    ],
                },
            ])
        }
    }, [permissionValue])
    const handleClick = (key, navigateTo) => {
        setSelectedItem(key)
        navigate(navigateTo)
    }

    const toggleSubMenu = (key) => {
        setOpenedItem((prev) => (prev === key ? null : key))
    }
    console.log('collapsed', collapsed)
    return (
        <TooltipProvider delayDuration={0}>
            <ResizablePanelGroup
                direction='horizontal'
                className='h-full min-h-screen bg-white '
                style={{ transition: 'width 0.3s ease' }}>
                <ResizablePanel
                    onCollapse={() => setCollapsed(true)}
                    collapsible={true}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    onResize={() => {
                        setCollapsed(false)
                    }}
                    style={{
                        height: '100vh',
                        width: collapsed ? 50 : 252,
                        maxWidth: 252,
                        minWidth: 50,
                        transition: 'all 0.3s ease-in-out',
                        position: 'fixed',
                        top: 0, // Stick it to the top of the viewport
                        left: 0, // Stick it to the left of the viewport
                        zIndex: 10, // Keep it above other content
                    }}
                    className={'overflow-hidden'}>
                    {/* <Spin spinning={myData.length > 0 ? false : true} indicator={antIcon} tip=''> */}

                    <div
                        className={`${collapsed ? 'w-[50px] p-[6px] !ml-1' : 'w-[252px] p-2'} min-h-screen relative `}
                        style={{ top: '72px' }}>
                        {myData.map((item) =>
                            item.show_in_menu ? (
                                <Tooltip key={item.key} content={collapsed ? item.label : ''}>
                                    <div key={item.key}>
                                        {item.children ? (
                                            <div>
                                                {/* Parent Menu Item */}
                                                <div
                                                    className={cn(
                                                        'cursor-pointer flex items-center py-2 px-4',
                                                        selectedItem === item.key
                                                            ? 'font-medium text-brandPrimaryColor bg-slate-100 rounded-md'
                                                            : 'opacity-80'
                                                    )}
                                                    onClick={() => toggleSubMenu(item.key)}>
                                                    {item.icon && (
                                                        <span className={`${collapsed ? 'ml-[-6px]' : ''} mr-3`}>
                                                            {item.icon}
                                                        </span>
                                                    )}
                                                    <div className='!flex items-center space-x-24'>
                                                        <span>{item.label}</span>
                                                        <span className='!text-lg'>
                                                            {openedItem === null ? (
                                                                <MdArrowDropDown />
                                                            ) : (
                                                                <MdArrowDropUp />
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* SubMenu Items */}
                                                {openedItem === item.key && (
                                                    <div className='ml-4'>
                                                        {item.children.map((child) =>
                                                            child.show_in_menu ? (
                                                                <div
                                                                    key={child.key}
                                                                    className={cn(
                                                                        'cursor-pointer py-2 px-7',
                                                                        selectedItem === child.key
                                                                            ? `font-medium text-brandPrimaryColor  rounded-md ${collapsed === false ? 'bg-slate-100 ' : ''}`
                                                                            : 'opacity-80'
                                                                    )}
                                                                    onClick={() =>
                                                                        handleClick(child.key, child.navigate_to)
                                                                    }>
                                                                    {child.label}
                                                                </div>
                                                            ) : null
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div
                                                className={cn(
                                                    'cursor-pointer flex items-center py-2 px-4',
                                                    selectedItem === item.key
                                                        ? 'font-medium text-brandPrimaryColor bg-slate-100 rounded-md'
                                                        : 'opacity-80'
                                                )}
                                                onClick={() => handleClick(item.key, item.navigate_to)}>
                                                {item.icon && (
                                                    <span className={`${collapsed ? 'ml-[-6px]' : ''} mr-3`}>
                                                        {item.icon}
                                                    </span>
                                                )}
                                                <span>{item.label}</span>
                                            </div>
                                        )}
                                    </div>
                                </Tooltip>
                            ) : null
                        )}
                    </div>
                    {/* </Spin> */}
                </ResizablePanel>
                <ResizableHandle
                    withHandle
                    style={{
                        position: 'fixed', // Keep it fixed relative to the viewport
                        left: collapsed ? 50 : 252, // Align with the sidebar based on collapse state
                        top: 0, // Align to the top of the viewport
                        height: '100vh', // Make it span the full height
                        zIndex: 11, // Ensure it's above sidebar content but below other elements
                        cursor: 'col-resize', // Show resize cursor
                        transition: 'left 0.2s ease',
                    }}
                />
                <ResizablePanel>
                    <div
                        className={`flex flex-col min-h-screen transition-all `}
                        style={{ marginLeft: collapsed ? 50 : 252 }}>
                        <div className='!bg-[#F4F4F4]  flex-grow '>
                            <Outlet />
                        </div>
                        <div className='flex-grow-0  !w-[100%] '>
                            <NewFooter />
                        </div>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </TooltipProvider>
    )
}
export default SidebarNew
