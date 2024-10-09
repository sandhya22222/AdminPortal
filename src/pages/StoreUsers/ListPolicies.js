import React, { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import useGetStoreAdminConsent from '../../hooks/useGetStoreAdminConsent'
import { useLocation, useNavigate } from 'react-router-dom'
import ReactQuill from 'react-quill'
import { Separator } from '../../shadcnComponents/ui/separator'
import { ScrollArea } from '../../shadcnComponents/ui/scroll-area'
import { Skeleton } from '../../shadcnComponents/ui/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../shadcnComponents/ui/tooltip'
import './DisplayPolicy.css'
import { getGenerateDateAndTime } from '../../util/util'
import { usePageTitle } from '../../hooks/usePageTitle'
import { EmptySVG } from '../../constants/media'

const ListPolicies = ({ searchParams, setSearchParams }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    usePageTitle(t('labels:policies'))
    const search = useLocation().search
    const subTabData = new URLSearchParams(search).get('subtab')
    const [policiesTab, setPoliciesTab] = useState([])
    const { data: storeAdminConsent, status: storeAdminStatus } = useGetStoreAdminConsent()
    const [policyLink, setPolicyLink] = useState('')
    const [indicatorPosition, setIndicatorPosition] = useState(0)

    const policyRefs = useRef([])
    const navRef = useRef(null)
    const scrollbarRef = useRef(null)

    useEffect(() => {
        if (storeAdminStatus === 'success') {
            const tempTabData =
                storeAdminConsent?.map((consent) => ({
                    key: `${String(consent?.id)}`,
                    title: consent?.version_details?.consent_display_name,
                    href: `#${String(consent?.id)}`,
                })) || []
            setPoliciesTab(tempTabData)
        }
    }, [storeAdminConsent, storeAdminStatus])

    const handleClick = (e, href) => {
        e.preventDefault()
        setPolicyLink(href)
        const hashValue = href.slice(1)
        setSearchParams({
            tab: searchParams.get('tab'),
            subtab: hashValue,
        })
        scrollToElement(hashValue)
        updateIndicatorPosition(href)
    }

    const scrollToElement = (id) => {
        const element = policyRefs.current[id]

        if (element) {
            const offset = 140
            const elementPosition = element.getBoundingClientRect().top + window.scrollY
            const offsetPosition = elementPosition - offset

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            })
        } else {
            console.log('No element found for ID:', id)
        }
    }

    const updateIndicatorPosition = (href) => {
        if (navRef.current && scrollbarRef.current) {
            const navLinks = navRef.current.querySelectorAll('a')
            const clickedLink = Array.from(navLinks).find((link) => link.getAttribute('href') === href)
            if (clickedLink) {
                const linkRect = clickedLink.getBoundingClientRect()
                const navRect = navRef.current.getBoundingClientRect()
                const scrollbarRect = scrollbarRef.current.getBoundingClientRect()
                const relativePosition = linkRect.top - navRect.top
                const percentage = (relativePosition / scrollbarRect.height) * 100
                setIndicatorPosition(percentage)
            }
        }
    }

    useEffect(() => {
        if (subTabData && policiesTab.length > 0) {
            const href = `#${subTabData}`
            setPolicyLink(href)
            scrollToElement(subTabData)
            updateIndicatorPosition(href)
        }
    }, [subTabData, policiesTab])

    useEffect(() => {
        const updateScrollbarHeight = () => {
            if (navRef.current && scrollbarRef.current) {
                const navHeight = navRef.current.getBoundingClientRect().height
                scrollbarRef.current.style.height = `${navHeight}px`
            }
        }

        updateScrollbarHeight()
        window.addEventListener('resize', updateScrollbarHeight)

        return () => {
            window.removeEventListener('resize', updateScrollbarHeight)
        }
    }, [policiesTab])

    return (
        <div className='w-full h-full p-4'>
            {storeAdminStatus === 'pending' && (
                <div className='p-4 w-full'>
                    <Skeleton className='w-full h-12 mb-4' />
                    <Skeleton className='w-full h-64' />
                </div>
            )}
            {storeAdminStatus === 'success' && (
                <div className='border rounded'>
                    <div className='text-xl font-medium p-3 text-regal-blue'>{t('labels:policies')}</div>
                    <Separator className='my-0' />
                    {policiesTab.length > 0 && (
                        <div className='flex p-3'>
                            <div className='flex-1'>
                                <ScrollArea className='overflow-auto'>
                                    <div className='flex flex-col'>
                                        {storeAdminConsent.map((data) => (
                                            <div
                                                id={String(data.id)}
                                                key={data.id}
                                                className='mb-4'
                                                ref={(el) => (policyRefs.current[data.id] = el)}>
                                                <div className='text-lg font-semibold mb-3 text-brandGray1'>
                                                    {data?.version_details?.consent_display_name}:
                                                </div>
                                                <div className='text-sm font-semibold mb-2 text-brandGray1'>
                                                    {t('labels:last_updated')}:{' '}
                                                    {getGenerateDateAndTime(data?.updated_on, 'D MMMM YYYY')}
                                                </div>
                                                <ReactQuill
                                                    value={data?.version_details?.consent_display_description}
                                                    modules={{ toolbar: false }}
                                                    readOnly
                                                    className='mb-3 mr-2 text-base editor quill text-brandGray2'
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>

                            <div className='col-span-1 relative'>
                                <div className='sticky top-0 right-0 p-3 flex'>
                                    <ScrollArea className='h-[calc(100vh-200px)] pr-6'>
                                        <TooltipProvider>
                                            <nav className='flex flex-col space-y-1' ref={navRef}>
                                                {policiesTab.map((item) => (
                                                    <Tooltip key={item.key}>
                                                        <TooltipTrigger asChild>
                                                            <a
                                                                href={item.href}
                                                                onClick={(e) => handleClick(e, item.href)}
                                                                className={`text-sm px-2 py-1.5 rounded-md !text-[#637381] !hover:text-regal-orange ${
                                                                    policyLink === item.href ? 'font-medium' : ''
                                                                }`}>
                                                                {item.title}
                                                            </a>
                                                        </TooltipTrigger>
                                                        <TooltipContent
                                                            side='right'
                                                            className='w-[20] p-2 text-xs bg-white text-black shadow-lg'
                                                            sideOffset={5}>
                                                            <p>{item.title}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                ))}
                                            </nav>
                                        </TooltipProvider>
                                    </ScrollArea>
                                    <div
                                        ref={scrollbarRef}
                                        className='w-1 bg-gray-200 rounded-full  ml-2 sticky top-0'>
                                        <div
                                            className='w-3 h-3 bg-regal-orange rounded-full absolute -left-1'
                                            style={{ top: `${indicatorPosition}%` }}
                                            aria-hidden='true'
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {policiesTab.length === 0 && (
                        <div className='flex flex-col items-center justify-center gap-4 my-6'>
                            <img src={EmptySVG} alt='no_policies_available' />
                            {t('messages:no_policies_available')}
                        </div>
                    )}
                </div>
            )}
            {storeAdminStatus === 'error' && (
                <p className='text-black text-opacity-80 pt-5 text-center'>{t('messages:network_error')}</p>
            )}
        </div>
    )
}

export default ListPolicies
