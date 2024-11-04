import * as React from 'react'
import { ChevronRight, Spin } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Collapsible, CollapsibleContent } from '../shadcnComponents/ui/collapsible'
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
    SidebarProvider,
} from '../shadcnComponents/ui/sidebar'

import { DashboardSVG } from '../components/Sidebar2.0.js/components/DashboardSVG'
import { StoresSVG } from '../components/Sidebar2.0.js/components/StoresSVG'
import { SettingsSVG } from '../components/Sidebar2.0.js/components/SettingsSVG'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../shadcnComponents/ui/tooltip'
import { cn } from '../lib/utils'
import { useAuth } from 'react-oidc-context'

const pageLimitFromENV = process.env.REACT_APP_ITEM_PER_PAGE || '10'

export const AppSidebar = ({ permissionValue = [], collapsed = false, setCollapsed, ...props }) => {
    const { t } = useTranslation()
    const [selectedItem, setSelectedItem] = React.useState('')
    const [openedItem, setOpenedItem] = React.useState(null)
    const [isHovering, setIsHovering] = React.useState(false)
    const [hoveredItem, setHoveredItem] = React.useState(null)

    const auth = useAuth()
    const location = useLocation()
    const navigate = useNavigate()

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
                    path: '/dashboard/store',
                    show_in_menu: true,
                },
                {
                    key: '15',
                    icon: <SettingsSVG />,
                    title: t('labels:settings'),
                    path: '/dashboard/settings',
                    show_in_menu: true,
                    items: [
                        {
                            key: '3',
                            title: t('labels:language_settings'),
                            path: '/dashboard/language',
                            show_in_menu:
                                auth.isAuthenticated &&
                                (permissionValue.includes('UI-product-admin') || permissionValue.length === 0),
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
                            key: '12',
                            title: t('labels:user_access_control'),
                            path: `/dashboard/user-access-control/list-user-roles`,
                            queryParams: { tab: 0, page: 1, limit: pageLimitFromENV },
                            show_in_menu:
                                auth.isAuthenticated &&
                                (permissionValue.includes('UI-user-access-control') || permissionValue.length === 0),
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
        [t, auth.isAuthenticated, permissionValue]
    )

    React.useEffect(() => {
        const currentPath = location.pathname

        const findMatchingItem = (items) => {
            for (const item of items) {
                if (currentPath === item.path) {
                    return item.key
                }
                if (item.items) {
                    const subItem = item.items.find((sub) => currentPath === sub.path)
                    if (subItem) {
                        setOpenedItem(item.key)
                        return subItem.key
                    }
                }
            }
            return '1' // Default to dashboard if no match
        }

        setSelectedItem(findMatchingItem(data.navMain))
    }, [location.pathname, data.navMain])

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
        <div className='flex'>
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
                                                                'text-[#0F172A]', 
                                                                selectedItem === item.key
                                                                    ? 'bg-accent text-regal-orange'
                                                                    : '',
                                                                hoveredItem === item.key ? 'bg-accent/50' : ''
                                                            )}
                                                            onMouseEnter={() => setHoveredItem(item.key)}
                                                            onMouseLeave={() => setHoveredItem(null)}>
                                                            {item.icon}
                                                            {!collapsed && <span>{item.title}</span>}
                                                            {item.items && (
                                                                <ChevronRight
                                                                    className={cn(
                                                                        'ml-auto h-4 w-4 transition-transform duration-200',
                                                                        openedItem === item.key && 'rotate-90'
                                                                    )}
                                                                />
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
                                                        <SidebarMenuSub>
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
                                                                                    'text-[#0F172A]', // Explicitly set text color to #0F172A
                                                                                    selectedItem === subItem.key
                                                                                        ? 'bg-accent text-regal-orange'
                                                                                        : '',
                                                                                    hoveredItem === subItem.key
                                                                                        ? 'bg-accent/50'
                                                                                        : ''
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
                                </SidebarMenu>
                            </SidebarGroup>
                        </SidebarContent>
                        <SidebarRail />
                    </Sidebar>
                </SidebarProvider>
            </TooltipProvider>

            <div className='w-full'>
                <Outlet />
            </div>
        </div>
    )
}
