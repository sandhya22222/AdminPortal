import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Separator } from '../../shadcnComponents/ui/separator'
import { Button } from '../../shadcnComponents/ui/button'
import { Badge } from '../../shadcnComponents/ui/badge'
import { Smartphone, LaptopIcon, Monitor, Tablet } from 'lucide-react'
import { Alert, AlertTitle, AlertDescription } from '../../shadcnComponents/ui/alert'
import StoreModal from '../../components/storeModal/StoreModal'
import './LoginSessions.css'
import { useSession } from './useSession'
import { Skeleton } from '../../shadcnComponents/ui/skeleton'
import { XCircle } from 'lucide-react'
import util from '../../util/common'

const SessionsDisplay = () => {
    const { t } = useTranslation()
    const [openRemoveHandler, setOpenRemoveHandler] = useState(false)
    const { data: sessions, isError, error, isLoading } = useSession()
    console.log(sessions)
    if (isError) {
        const errorMessage = error?.message || 'Something went wrong. Please try again.' // Extract the error message or use a default

        return (
            <Alert variant='destructive' className='mt-4'>
                <XCircle className='h-5 w-5 text-red-600' />
                <div className='flex flex-col ml-2'>
                    <AlertTitle className='text-red-600'>Error</AlertTitle>
                    <AlertDescription>{errorMessage}</AlertDescription>
                </div>
            </Alert>
        )
    }

    if (isLoading || sessions == null || sessions == undefined) {
        return (
            <div className='flex flex-col gap-2 space-y-1'>
                <Skeleton className='w-full h-6 ' />
                <Skeleton className='w-full h-6 ' />
                <Skeleton className='w-full h-6 ' />
                <Skeleton className='w-full h-6 ' />
            </div>
        )
    }
    // Helper to transform and sort session data
    const groupSessionsByDeviceType = (sessions) => {
        const groupedDevices = {
            'Phones and tablets': [],
            'Desktops and laptops': [],
            'Other Devices': [],
        }

        sessions?.forEach((session) => {
            const isMobileOrTablet = session.mobile
            let deviceType = isMobileOrTablet ? 'Phones and tablets' : 'Desktops and laptops'
            deviceType = session.os === 'Other' ? 'Other Devices' : deviceType
            session?.sessions.forEach((deviceSession) => {
                const name = `${deviceSession.browser} (${session.os} ${session.osVersion}) - ${session.device}`

                groupedDevices[deviceType].push({
                    name: name,
                    location: deviceSession.location,
                    lastLogged: new Date(deviceSession.lastAccess * 1000).toLocaleString(),
                    isCurrentSession: deviceSession?.current || false,
                    deviceType: deviceType === 'Phones and tablets' ? 'smartphone' : 'laptop',
                })
            })
        })

        // Sort devices in each category by current session
        Object.keys(groupedDevices).forEach((category) => {
            groupedDevices[category] = groupedDevices[category]?.sort((a, b) => b.isCurrentSession - a.isCurrentSession)
        })

        return groupedDevices
    }

    const prioritizeCurrentSessionCategory = (groupedDevices) => {
        const categoryOrder = Object.keys(groupedDevices).sort((a, b) => {
            const aHasCurrentSession = groupedDevices[a]?.some((device) => device.isCurrentSession)
            const bHasCurrentSession = groupedDevices[b]?.some((device) => device.isCurrentSession)
            return bHasCurrentSession - aHasCurrentSession // Prioritize category with current session
        })

        return categoryOrder?.map((category) => ({ name: category, devices: groupedDevices[category] }))
    }

    const groupedDevices = sessions && groupSessionsByDeviceType(sessions || [])
    const prioritizedCategories = sessions && prioritizeCurrentSessionCategory(groupedDevices)
    const direction = util.getSelectedLanguageDirection().toUpperCase()
    // Helper to return the appropriate icon
    const getDeviceIcon = (deviceType) => {
        switch (deviceType) {
            case 'smartphone':
                return <Smartphone className='h-8 w-8' />
            case 'tablet':
                return <Tablet className='h-8 w-8' />
            case 'laptop':
                return <LaptopIcon className='h-8 w-8' />
            case 'computer':
                return <Monitor className='h-8 w-8' />
            default:
                return <Smartphone className='h-8 w-8' />
        }
    }

    return (
        <div className='h-[100vh] overflow-auto bg-white border m-5 rounded-lg  custom-scrollbar'>
            <div className='p-4'>
                <p className='!text-xl font-bold'>{t('profile:logged_in_devices')}</p>
            </div>
            <Separator className='my-0' />

            <div className='p-4 space-y-6'>
                {prioritizedCategories
                    .filter(({ devices }) => devices.length > 0) // Exclude categories with no devices
                    .map(({ name: category, devices }) => (
                        <div key={category}>
                            <h3 className='text-lg font-semibold'>{category}</h3>
                            <div className='space-y-4'>
                                {devices.length > 0 ? (
                                    devices.map((device, idx) => (
                                        <div
                                            key={idx}
                                            className='flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 border-b'>
                                            <div className='flex items-start sm:items-center space-x-3'>
                                                <div className={`text-gray-500 ${direction === 'RTL' ? 'ml-4' : ''}`}>
                                                    {getDeviceIcon(device.deviceType)}
                                                </div>{' '}
                                                <div className='space-y-1'>
                                                    <p className='font-semibold'>{device.name}</p>
                                                    <div className='flex flex-col sm:flex-row gap-2 !sm:space-y-0'>
                                                        <p className='text-sm text-gray-500'>{device.location}</p>
                                                        <p className='text-sm text-gray-500 sm:ml-2'>
                                                            <span className='hidden sm:inline'>{'\u2022'} </span>
                                                            {t('profile:last_logged_in_at')} {device.lastLogged}
                                                        </p>
                                                    </div>
                                                    {device.isCurrentSession ? (
                                                        <div className='flex flex-row items-center gap-2'>
                                                            <Badge
                                                                variant='outline'
                                                                className={`w-2 h-2 p-0 rounded-full bg-green-500`}
                                                            />
                                                            <p className='text-green-500'>
                                                                {t('profile:current_session')}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div className='flex flex-row items-center gap-2'>
                                                            <Badge
                                                                variant='outline'
                                                                className={`w-2 h-2 p-0 rounded-full bg-brandPrimaryColor`}
                                                            />
                                                            <p className='text-brandPrimaryColor'>
                                                                {t('profile:last_logged')}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {!device.isCurrentSession && (
                                                <>
                                                    {/* Wrapper for small devices */}
                                                    <div className='flex items-end justify-end w-full sm:hidden'>
                                                        <Button
                                                            onClick={() => setOpenRemoveHandler(true)}
                                                            size='sm'
                                                            className='mt-2'>
                                                            {t('profile:remove')}
                                                        </Button>
                                                    </div>

                                                    {/* Button for medium and larger devices */}
                                                    <Button
                                                        onClick={() => setOpenRemoveHandler(true)}
                                                        size='sm'
                                                        className='hidden sm:inline mt-2 sm:mt-0'>
                                                        {t('profile:remove')}
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className='text-sm text-gray-500'>{t('profile:device_not_found')}</p>
                                )}
                            </div>
                        </div>
                    ))}
            </div>
            <StoreModal
                title={t('profile:logged_out_confirmation_title')}
                isVisible={openRemoveHandler}
                cancelCallback={() => setOpenRemoveHandler(false)}
                isSpin={false}
                width={600}>
                <div className='!pb-0'>
                    <p>{t('profile:logged_out_confirmation_description')}</p>
                    <div className='flex items-end justify-end mt-4'>
                        <Button className='ml-auto'>{t('profile:remove')}</Button>
                    </div>
                </div>
            </StoreModal>
        </div>
    )
}

export default SessionsDisplay
