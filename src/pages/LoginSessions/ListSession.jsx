import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../../shadcnComponents/ui/button'
import { Badge } from '../../shadcnComponents/ui/badge'
import { Smartphone, LaptopIcon, Monitor, Tablet } from 'lucide-react'
import { useSession } from './useSession'
import util from '../../util/common'

const ListSession = ({ setSessionId, setOpenRemoveHandler }) => {
    const { t } = useTranslation()
    const { data: sessions } = useSession()

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
                    id: deviceSession.id,
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
                                                        <p className='text-green-500'>{t('profile:current_session')}</p>
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
                                                        onClick={() => {
                                                            setOpenRemoveHandler(true)
                                                            setSessionId(device.id)
                                                        }}
                                                        size='sm'
                                                        className='mt-2'>
                                                        {t('profile:remove')}
                                                    </Button>
                                                </div>

                                                {/* Button for medium and larger devices */}
                                                <Button
                                                    onClick={() => {
                                                        setOpenRemoveHandler(true)
                                                        setSessionId(device.id)
                                                    }}
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
    )
}

export default ListSession
