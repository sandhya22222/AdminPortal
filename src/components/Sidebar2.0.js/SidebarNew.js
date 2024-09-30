//! Import libraries
import { LoadingOutlined } from '@ant-design/icons'
import { Layout, Menu, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import NewFooter from './../footer/Footer'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../../shadcnComponents/ui/resizable'
//! Import CSS libraries

//! Import user defined functions

//! Import user defined CSS
import { useAuth } from 'react-oidc-context'
import util from '../../util/common'
import './SidebarNewUpdated.css'
import { DashboardSVG } from './components/DashboardSVG'
import { StoresSVG } from './components/StoresSVG'
import { SettingsSVG } from './components/SettingsSVG'

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
                            // icon: <img src={TranslateIcon} alt='TranslateIcon' />,
                            // inactive_icon: <img src={TranslateIcon} alt='TranslateIcon' />,
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
                            // icon: <img src={ProfileIcon} alt='profileIcon' width={'15px'} height={'15px'} />,
                            // inactive_icon: <img src={ProfileIcon} alt='profileIcon' width={'15px'} height={'15px'} />,
                            label: ` ${t('labels:profile')}`,
                            navigate_to: '/dashboard/userprofile',
                            show_in_menu: true,
                        },
                    ],
                },
            ])
        }
    }, [permissionValue])

    return (
        // <Layout className=''>
        //     {/* <div className='' style={{ width: '252px' }}> */}
        //     {/* <Affix offsetTop={48}> */}
        //     <Sider
        //         trigger={null}
        //         collapsible
        //         collapsed={collapsed}
        //         onCollapse={(value) => setCollapsed(value)}
        //         width={252}
        //         onMouseEnter={() => {
        //             handleMouseEnter()
        //         }}
        //         onMouseLeave={() => {
        //             handleMouseLeave()
        //         }}
        //         style={{
        //             overflow: isHovering ? 'auto' : 'hidden',
        //             height: '100vh',
        //             position: 'fixed',
        //             top: 72,
        //             left: `${util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? null : 0}`,
        //             right: `${util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? 0 : null}`,
        //         }}>
        //         <Spin spinning={myData.length > 0 ? false : true} indicator={antIcon} tip=''>
        //             <Menu
        //                 mode='inline'
        //                 className='h-full !text-base !transition-all'
        //                 selectedKeys={selectedItem}
        //                 openKeys={openedItem}
        //                 onOpenChange={(e) => {
        //                     setOpenedItem(e)
        //                 }}
        //                 theme={'light'}
        //                 style={{
        //                     height: 'calc(100vh)',
        //                     overflow: isHovering ? 'auto' : 'hidden',
        //                 }}>
        //                 {myData.map((item) =>
        //                     item.show_in_menu && item.children ? (
        //                         <Menu.SubMenu
        //                             icon={item?.icon}
        //                             // icon={item.icon}
        //                             key={item.key}
        //                             title={item.label}
        //                             style={{
        //                                 opacity: item.childrenKeys.includes(selectedItem) ? 1 : 0.8,
        //                             }}>
        //                             {item.children.map((child) =>
        //                                 child.show_in_menu ? (
        //                                     <Menu.Item
        //                                         // icon={child.icon}
        //                                         key={child.key}
        //                                         // style={{ color: "black" }}
        //                                         onClick={() => {
        //                                             navigate(child.navigate_to)
        //                                         }}
        //                                         style={{
        //                                             opacity: !item.childrenKeys.includes(selectedItem)
        //                                                 ? 1
        //                                                 : selectedItem === child.key
        //                                                   ? 1
        //                                                   : 0.8,
        //                                         }}>
        //                                         {selectedItem === child.key ? (
        //                                             <span className='font-semibold'>{child.label}</span>
        //                                         ) : (
        //                                             child.label
        //                                         )}
        //                                     </Menu.Item>
        //                                 ) : null
        //                             )}
        //                         </Menu.SubMenu>
        //                     ) : item.show_in_menu ? (
        //                         <Menu.Item
        //                             icon={item?.icon}
        //                             // icon={item.icon}
        //                             key={item.key}
        //                             disabled={!item.show_in_menu}
        //                             onClick={() => {
        //                                 navigate(item.navigate_to)
        //                             }}
        //                             style={{
        //                                 opacity: selectedItem === item.key ? 1 : 0.8,
        //                             }}>
        //                             {selectedItem === item.key ? (
        //                                 <span className='font-semibold '>{item.label}</span>
        //                             ) : (
        //                                 item.label
        //                             )}
        //                         </Menu.Item>
        //                     ) : null
        //                 )}
        //             </Menu>
        //         </Spin>
        //     </Sider>
        //     {/* </Affix> */}
        //     {/* </div> */}
        //     <Content
        //         className={`flex flex-col min-h-screen transition-all ${
        //             util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL'
        //                 ? `${collapsed ? 'mr-[80px]' : 'mr-[252px]'}`
        //                 : `${collapsed ? 'ml-[80px]' : 'ml-[252px]'}`
        //         }`}>
        //         <Content className='!bg-[#F4F4F4]  flex-grow'>
        //             <Outlet />
        //         </Content>
        //         <Content className='flex-grow-0  !w-[100%]'>
        //             <NewFooter />
        //         </Content>
        //     </Content>
        <ResizablePanelGroup direction='horizontal' className=''>
            <ResizablePanel
                onCollapse={(value) => setCollapsed(value)}
                collapsible={collapsed}
                onMouseEnter={() => {
                    handleMouseEnter()
                }}
                onMouseLeave={() => {
                    handleMouseLeave()
                }}
                style={{
                    overflow: isHovering ? 'auto' : 'hidden',
                    height: '100vh',
                    position: 'fixed',
                    top: 72,
                    width: collapsed ? 70 : 252,
                    left: `${util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? null : 0}`,
                    right: `${util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? 0 : null}`,
                }}>
                <Spin spinning={myData.length > 0 ? false : true} indicator={antIcon} tip=''>
                    <Menu
                        mode='inline'
                        className='h-full !text-base !transition-all'
                        selectedKeys={selectedItem}
                        openKeys={openedItem}
                        onOpenChange={(e) => {
                            setOpenedItem(e)
                        }}
                        theme={'light'}
                        style={{
                            height: 'calc(100vh)',
                            overflow: isHovering ? 'auto' : 'hidden',
                        }}>
                        {myData.map((item) =>
                            item.show_in_menu && item.children ? (
                                <Menu.SubMenu
                                    icon={item?.icon}
                                    // icon={item.icon}
                                    key={item.key}
                                    title={item.label}
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
                                                }}
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
                                    icon={item?.icon}
                                    // icon={item.icon}
                                    key={item.key}
                                    disabled={!item.show_in_menu}
                                    onClick={() => {
                                        navigate(item.navigate_to)
                                    }}
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
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel>
                <div
                    className={`flex flex-col min-h-screen transition-all ${
                        util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL'
                            ? `${collapsed ? 'mr-[80px]' : 'mr-[252px]'}`
                            : `${collapsed ? 'ml-[80px]' : 'ml-[252px]'}`
                    }`}>
                    <div className='!bg-[#F4F4F4]  flex-grow'>
                        <Outlet />
                    </div>
                    <div className='flex-grow-0  !w-[100%]'>
                        <NewFooter />
                    </div>
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
        // </Layout>
    )
}
export default SidebarNew
