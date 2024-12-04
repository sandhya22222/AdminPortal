import * as React from 'react'
import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Collapsible, CollapsibleContent } from '../ui/collapsible'
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
    SidebarProvider,
} from '../ui/sidebar'

import { DashboardSVG } from '../../components/Sidebar2.0.js/components/DashboardSVG'
import { StoresSVG } from '../../components/Sidebar2.0.js/components/StoresSVG'
import { SettingsSVG } from '../../components/Sidebar2.0.js/components/SettingsSVG'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { cn } from '../../lib/utils'
import { useAuth } from 'react-oidc-context'
import util from '../../util/common'
import Spin from '../../shadcnComponents/customComponents/Spin'
import { ScrollArea } from '../ui/scroll-area'

const pageLimitFromENV = process.env.REACT_APP_ITEM_PER_PAGE || '10'

export const AppSidebar = ({ permissionData = [], collapsed = false, setCollapsed, ...props }) => {
    const { t } = useTranslation()
    const location = useLocation()

    const [selectedItem, setSelectedItem] = React.useState('')
    const [openedItem, setOpenedItem] = React.useState(null)
    const [isHovering, setIsHovering] = React.useState(false)
    const [hoveredItem, setHoveredItem] = React.useState(null)

    const auth = useAuth()
    const navigate = useNavigate()
    console.log('permissionValue', permissionData)
    const permissionIncludesUIProductAdimin = React.useCallback(() => {
        return !auth.isAuthenticated || (auth.isAuthenticated && permissionData.includes('UI-product-admin'))
            ? false
            : true
    }, [auth.isAuthenticated, permissionData])

    const data = React.useMemo(
        () => ({
            navMain: [
                {
                    key: '1',
                    icon: <DashboardSVG />,
                    title: t('labels:dashboard'),
                    path: '/dashboard',
                    show_in_menu: true,
                },
                {
                    key: '2',
                    icon: <StoresSVG />,
                    title: t('labels:stores'),
                    path: '/dashboard/store?m_t=1',
                    // queryParams: { m_t: 1 },
                    show_in_menu: true,
                },
                {
                    key: '15',
                    icon: <SettingsSVG />,
                    title: t('labels:settings'),
                    path: '/dashboard/',
                    show_in_menu: true,
                    items: [
                        {
                            key: '3',
                            title: t('labels:language_settings'),
                            path: '/dashboard/language',
                            show_in_menu:
                                !auth.isAuthenticated ||
                                (auth.isAuthenticated && permissionData.includes('UI-product-admin'))
                                    ? false
                                    : true,
                        },
                        {
                            key: '13',
                            title: t('labels:currency'),
                            path: '/dashboard/currency',
                            show_in_menu: true,
                        },
                        {
                            key: '5',
                            title: t('labels:payment_settings'),
                            path: '/dashboard/paymenttype',
                            show_in_menu: true,
                        },
                        {
                            key: '7',
                            title: ` ${t('labels:platform_admin')}`,
                            path: '/dashboard/platformadmin',
                            show_in_menu: !permissionIncludesUIProductAdimin(),
                        },

                        {
                            key: '12',
                            title: t('labels:user_access_control'),
                            path: `/dashboard/user-access-control/list-user-roles`,
                            queryParams: { tab: 0, page: 1, limit: pageLimitFromENV },
                            show_in_menu: permissionIncludesUIProductAdimin(),
                        },
                        {
                            key: '6',
                            title: t('labels:profile'),
                            path: '/dashboard/userprofile',
                            show_in_menu: true,
                        },
                    ],
                },
            ],
        }),
        [t, auth.isAuthenticated, permissionData]
    )

    React.useEffect(() => {
        const currentPath = location.pathname

        const isPathMatch = (itemPath, currentPath) => {
            // Split the paths and queries
            let [itemPathBase, itemQuery] = itemPath.split('?')
            let [currentPathBase, currentQuery] = currentPath.split('?')
            if (itemPathBase === currentPathBase) return true
            if (itemPathBase.split('/').length > 2) {
                //dosent consider dashboard remove splice once dashbord path is removed
                return currentPathBase
                    .split('/')
                    .splice(2)
                    .join('/')
                    .startsWith(itemPathBase.split('/').splice(2).join('/'))
            } else {
                return false
            }
        }

        const findMatchingItem = (items) => {
            for (const item of items) {
                if (isPathMatch(item.path, currentPath)) {
                    if (!item.items) {
                        return item.key
                    }
                }

                if (item.items) {
                    // Recursively check for sub-items
                    const subItem = item.items.find((sub) => isPathMatch(sub.path, currentPath))

                    if (subItem) {
                        setOpenedItem(item.key)
                        return subItem.key
                    }
                }
            }
            return null // Fallback case if no match is found
        }

        // Find and set the selected item based on the current path
        setSelectedItem(findMatchingItem(data.navMain))
    }, [])

    const handleClick = (key, path, queryParams = {}) => {
        setSelectedItem(key)

        if (!data.navMain.find((item) => item.key === openedItem)?.items?.some((subItem) => subItem.key === key)) {
            setOpenedItem(null)
        }

        let url = path
        const params = new URLSearchParams(queryParams).toString()
        if (params) {
            url = `${path}?${params}`
        }

        navigate(url)
    }

    const toggleSubMenu = (key) => {
        setOpenedItem((prev) => (prev === key ? null : key))
    }

    return (
        <div className='flex '>
            <TooltipProvider delayDuration={0}>
                <SidebarProvider>
                    <Sidebar
                        collapsible='icon'
                        collapsed={collapsed}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        {...props}>
                        <SidebarContent>
                            <SidebarGroup>
                                <SidebarMenu className='mt-20'>
                                    <ScrollArea>
                                        {data.navMain.map((item) => (
                                            <React.Fragment key={item.key}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <SidebarMenuItem>
                                                            <SidebarMenuButton
                                                                tooltip={collapsed ? item.title : undefined}
                                                                onClick={() =>
                                                                    item.items
                                                                        ? toggleSubMenu(item.key)
                                                                        : handleClick(item.key, item.path)
                                                                }
                                                                className={cn(
                                                                    'relative flex items-center px-4',
                                                                    'text-[#0F172A]',
                                                                    selectedItem === item.key
                                                                        ? 'bg-accent text-regal-orange'
                                                                        : '',
                                                                    hoveredItem === item.key ? 'bg-accent/50' : '',
                                                                    util
                                                                        .getSelectedLanguageDirection()
                                                                        ?.toUpperCase() === 'RTL'
                                                                        ? 'justify-between flex-row-reverse'
                                                                        : 'justify-start'
                                                                )}
                                                                onMouseEnter={() => setHoveredItem(item.key)}
                                                                onMouseLeave={() => setHoveredItem(null)}>
                                                                {item.icon}
                                                                {!collapsed && (
                                                                    <span
                                                                        className={cn(
                                                                            util
                                                                                .getSelectedLanguageDirection()
                                                                                ?.toUpperCase() === 'RTL'
                                                                                ? 'ml-auto text-right'
                                                                                : 'ml-2'
                                                                        )}>
                                                                        {item.title}
                                                                    </span>
                                                                )}

                                                                {item.items && (
                                                                    <div>
                                                                        <ChevronRight
                                                                            className={cn(
                                                                                'h-4 w-4 text-gray-500 transition-transform duration-200',
                                                                                openedItem === item.key
                                                                                    ? 'rotate-90'
                                                                                    : '',
                                                                                util
                                                                                    .getSelectedLanguageDirection()
                                                                                    ?.toUpperCase() === 'RTL'
                                                                                    ? 'mr-0 ml-4'
                                                                                    : 'ml-8 mr-4'
                                                                            )}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </SidebarMenuButton>
                                                        </SidebarMenuItem>
                                                    </TooltipTrigger>
                                                    {collapsed && isHovering && (
                                                        <TooltipContent side='right' align='center' className='z-50'>
                                                            {item.title}
                                                        </TooltipContent>
                                                    )}
                                                </Tooltip>
                                                {item.items && (
                                                    <Collapsible
                                                        open={openedItem === item.key}
                                                        onOpenChange={() => toggleSubMenu(item.key)}>
                                                        <CollapsibleContent>
                                                            <SidebarMenuSub
                                                                className={`${
                                                                    util
                                                                        .getSelectedLanguageDirection()
                                                                        ?.toUpperCase() === 'RTL'
                                                                        ? 'mt-2'
                                                                        : ''
                                                                }`}>
                                                                {item.items.map(
                                                                    (subItem) =>
                                                                        subItem.show_in_menu && (
                                                                            <SidebarMenuSubItem key={subItem.key}>
                                                                                <SidebarMenuSubButton
                                                                                    onClick={() =>
                                                                                        handleClick(
                                                                                            subItem.key,
                                                                                            subItem.path,
                                                                                            subItem.queryParams
                                                                                        )
                                                                                    }
                                                                                    className={cn(
                                                                                        '!text-[#0F172A] cursor-pointer',
                                                                                        selectedItem === subItem.key
                                                                                            ? 'bg-accent !text-regal-orange'
                                                                                            : '',
                                                                                        hoveredItem === subItem.key
                                                                                            ? 'bg-accent/50'
                                                                                            : '',
                                                                                        util
                                                                                            .getSelectedLanguageDirection()
                                                                                            ?.toUpperCase() === 'RTL'
                                                                                            ? 'items-start'
                                                                                            : 'items-end'
                                                                                    )}
                                                                                    onMouseEnter={() =>
                                                                                        setHoveredItem(subItem.key)
                                                                                    }
                                                                                    onMouseLeave={() =>
                                                                                        setHoveredItem(null)
                                                                                    }>
                                                                                    {subItem.title}
                                                                                </SidebarMenuSubButton>
                                                                            </SidebarMenuSubItem>
                                                                        )
                                                                )}
                                                            </SidebarMenuSub>
                                                        </CollapsibleContent>
                                                    </Collapsible>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </ScrollArea>
                                </SidebarMenu>
                            </SidebarGroup>
                        </SidebarContent>
                        <SidebarRail />
                    </Sidebar>
                </SidebarProvider>
            </TooltipProvider>

            <div className='!bg-[#F4F4F4]  flex-grow '>
                <React.Suspense
                    fallback={
                        <div className='h-[100vh]'>
                            <div className='grid justify-items-center align-items-center h-full pt-[20%]'>
                                <Spin text={t('labels:please_wait')} />
                            </div>
                        </div>
                    }>
                    <Outlet />
                </React.Suspense>
            </div>
        </div>
    )
}
