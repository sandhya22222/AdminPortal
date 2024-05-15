//! Import libraries
import { LoadingOutlined } from '@ant-design/icons'
import { Layout, Menu, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
    DashboardNotSelected,
    DashboardSelected,
    SettingsNotSelected,
    SettingsSelected,
    StoresNotSelected,
    StoresSelected,
} from '../../constants/media'
import NewFooter from './../footer/Footer'
//! Import CSS libraries

//! Import user defined functions

//! Import user defined CSS
import { useAuth } from 'react-oidc-context'
import util from '../../util/common'
import './sidebarnew.css'

//! Destructure the components
const { Sider, Content } = Layout

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

    const handlePageRefresh = (navigationPath) => {
        if (pathname !== navigationPath) {
            // navigate(0);
        }
    }

    // Function to handle mouse enter event on the sidebar
    const handleMouseEnter = () => {
        setIsHovering(true)
    }

    // Function to handle mouse leave event on the sidebar
    const handleMouseLeave = () => {
        setIsHovering(false)
    }
    useEffect(() => {
        switch (pathname.split('/')[2]) {
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
                    selectedIcon: <img src={DashboardSelected} alt='ViewDashboard' />,
                    notSelectedIcon: <img src={DashboardNotSelected} alt='ViewDashboard' />,
                    label: ` ${t('labels:dashboard')}`,
                    navigate_to: '/dashboard',
                    show_in_menu: true,
                },
                {
                    key: '2',
                    selectedIcon: <img src={StoresSelected} alt='StoresSelected' />,
                    notSelectedIcon: <img src={StoresNotSelected} alt='StoresNotSelected' />,
                    label: ` ${t('labels:stores')}`,
                    navigate_to: '/dashboard/store?m_t=1',
                    show_in_menu: true,
                },
                {
                    key: '15',
                    selectedIcon: <img src={SettingsSelected} alt='storeSettings' />,
                    notSelectedIcon: <img src={SettingsNotSelected} alt='StoreSettings' />,
                    label: `${t('labels:settings')}`,
                    navigate_to: '/dashboard/',
                    show_in_menu: true,
                    childrenKeys: ['3', '13', '5', '6', '12'],
                    children: [
                        {
                            key: '3',
                            // icon: <img src={TranslateIcon} alt='TranslateIcon' />,
                            // inactive_icon: <img src={TranslateIcon} alt='TranslateIcon' />,
                            label: `${t('labels:language_settings')}`,
                            navigate_to: '/dashboard/language',
                            show_in_menu:
                                !auth.isAuthenticated ||
                                (auth.isAuthenticated &&
                                    permissionValue &&
                                    permissionValue.length > 0 &&
                                    permissionValue.includes('UI-product-admin'))
                                    ? false
                                    : true,
                        },
                        {
                            key: '13',
                            // icon: <img src={currencyIcon} alt='currencyIcon' />,
                            // inactive_icon: <img src={currencyInActiveIcon} alt='currencyInActiveIcon' />,
                            label: ` ${t('labels:currency')}`,
                            navigate_to: '/dashboard/currency',
                            show_in_menu: true,
                        },
                        {
                            key: '5',
                            // icon: <img src={PaymentSettingsIcon} alt='PaymentSettingsIcon' />,
                            // inactive_icon: <img src={PaymentTypeIcon} alt='PaymentTypeIcon' />,
                            label: ` ${t('labels:payment_settings')}`,
                            navigate_to: '/dashboard/paymenttype',
                            show_in_menu: true,
                        },
                        {
                            key: '12',
                            // icon: (
                            //     <img src={UserAccessControl} alt='userAccessControl' width={'15px'} height={'15px'} />
                            // ),
                            // inactive_icon: (
                            //     <img src={UserAccessControl} alt='userAccessControl' width={'15px'} height={'15px'} />
                            // ),
                            label: `${t('labels:user_access_control')}`,
                            navigate_to: `/dashboard/user-access-control/list-user-roles?tab=0&page=1&limit=${pageLimitFromENV}`,
                            show_in_menu:
                                !auth.isAuthenticated ||
                                (auth.isAuthenticated &&
                                    permissionValue &&
                                    permissionValue.length > 0 &&
                                    permissionValue.includes('UI-user-access-control'))
                                    ? true
                                    : false,
                        },
                        {
                            key: '6',
                            // icon: <img src={ProfileIcon} alt='profileIcon' width={'15px'} height={'15px'} />,
                            // inactive_icon: <img src={ProfileIcon} alt='profileIcon' width={'15px'} height={'15px'} />,
                            label: ` ${t('labels:my_profile')}`,
                            navigate_to: '/dashboard/userprofile',
                            show_in_menu: true,
                        },
                    ],
                },
            ])
        }
    }, [permissionValue])

    return (
        <Layout className=''>
            {/* <div className='' style={{ width: '252px' }}> */}
            {/* <Affix offsetTop={48}> */}
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                width={252}
                onMouseEnter={() => {
                    handleMouseEnter()
                }}
                onMouseLeave={() => {
                    handleMouseLeave()
                }}
                className='!text-[var(--mp-sidebar-menu-not-selected)]'
                style={{
                    overflow: isHovering ? 'auto' : 'hidden',
                    height: '100vh',
                    position: 'fixed',
                    top: 48,
                    left: `${util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? null : 0}`,
                    right: `${util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? 0 : null}`,
                }}>
                <Spin spinning={myData.length > 0 ? false : true} indicator={antIcon} tip=''>
                    <Menu
                        mode='inline'
                        className='h-full !text-base !text-[var(--mp-sidebar-menu-not-selected)]  !transition-all'
                        selectedKeys={selectedItem}
                        openKeys={openedItem}
                        onOpenChange={(e) => {
                            setOpenedItem(e)
                        }}
                        theme={'dark'}
                        style={{
                            height: 'calc(100vh - 145px)',
                            overflow: isHovering ? 'auto' : 'hidden',
                        }}>
                        {myData.map((item) =>
                            item.show_in_menu && item.children ? (
                                <Menu.SubMenu
                                    icon={
                                        item?.childrenKeys?.includes(selectedItem)
                                            ? item.selectedIcon
                                            : item?.key === selectedItem
                                              ? item.selectedIcon
                                              : item.notSelectedIcon
                                    }
                                    key={item.key}
                                    title={item.label}
                                    className='text-[var(--mp-sidebar-menu-not-selected)]'
                                    style={{
                                        opacity: item.childrenKeys.includes(selectedItem) ? 1 : 0.8,
                                    }}>
                                    {item.children.map((child) =>
                                        child.show_in_menu ? (
                                            <Menu.Item
                                                // icon={child.icon}
                                                key={child.key}
                                                // style={{ color: "black" }}
                                                onClick={() => {
                                                    navigate(child.navigate_to)
                                                    handlePageRefresh(child.navigate_to)
                                                }}
                                                className='text-[var(--mp-sidebar-menu-not-selected)]'
                                                style={{
                                                    opacity: !item.childrenKeys.includes(selectedItem)
                                                        ? 1
                                                        : selectedItem === child.key
                                                          ? 1
                                                          : 0.8,
                                                }}>
                                                {selectedItem === child.key ? (
                                                    <span className='font-semibold'>{child.label}</span>
                                                ) : (
                                                    child.label
                                                )}
                                            </Menu.Item>
                                        ) : null
                                    )}
                                </Menu.SubMenu>
                            ) : item.show_in_menu ? (
                                <Menu.Item
                                    icon={
                                        item?.childrenKeys?.includes(selectedItem)
                                            ? item.selectedIcon
                                            : item?.key === selectedItem
                                              ? item.selectedIcon
                                              : item.notSelectedIcon
                                    }
                                    key={item.key}
                                    disabled={!item.show_in_menu}
                                    onClick={() => {
                                        navigate(item.navigate_to)
                                        handlePageRefresh(item.navigate_to)
                                    }}
                                    className='text-[var(--mp-sidebar-menu-not-selected)]'
                                    style={{
                                        opacity: selectedItem === item.key ? 1 : 0.8,
                                    }}>
                                    {selectedItem === item.key ? (
                                        <span className='font-semibold '>{item.label}</span>
                                    ) : (
                                        item.label
                                    )}
                                </Menu.Item>
                            ) : null
                        )}
                    </Menu>
                </Spin>
            </Sider>
            {/* </Affix> */}
            {/* </div> */}
            <Content
                className={`flex flex-col min-h-screen transition-all ${
                    util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL'
                        ? `${collapsed ? 'mr-[80px]' : 'mr-[252px]'}`
                        : `${collapsed ? 'ml-[80px]' : 'ml-[252px]'}`
                }`}>
                <Content className='!bg-[#F4F4F4]  flex-grow'>
                    <Outlet />
                </Content>
                <Content className='flex-grow-0  !w-[100%]'>
                    <NewFooter />
                </Content>
            </Content>
        </Layout>
    )
}
export default SidebarNew
