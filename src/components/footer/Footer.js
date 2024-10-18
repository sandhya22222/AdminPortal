import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import useGetStoreAdminConsent from '../../hooks/useGetStoreAdminConsent'

const portalInfo = JSON.parse(process.env.REACT_APP_PORTAL_INFO)

const NewFooter = () => {
    const { t, i18n } = useTranslation()
    const { data: userConsentData } = useGetStoreAdminConsent()

    // Determine if the current language is RTL
    const isRTL = i18n.dir() === 'rtl'

    return (
        <div
            className={`bg-white py-6 max-h-[96px] text-center p-[2px] flex flex-col gap-2 items-center justify-center ${isRTL ? 'text-right' : 'text-left'}`}>
            {userConsentData && userConsentData.length > 0 ? (
                <div
                    className={`text-xs gap-x-6 flex max-h-[45px] overflow-y-auto items-center flex-wrap justify-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                    {userConsentData.map((data, index) =>
                        index <= 3 ? (
                            <React.Fragment key={data.id}>
                                <Link
                                    to={`/dashboard/userprofile?tab=policies&subtab=${data.id}`}
                                    title={
                                        data?.version_details?.consent_name ||
                                        data?.version_details?.consent_display_name
                                    }>
                                    <div className='max-w-[280px] text-gray-500'>
                                        {data?.version_details?.consent_name ||
                                            data?.version_details?.consent_display_name}
                                    </div>
                                </Link>
                                {index !== userConsentData.length - 1 && <span className='text-gray-200'>|</span>}
                            </React.Fragment>
                        ) : null
                    )}
                    {userConsentData.length > 4 && (
                        <Link to={`/dashboard/userprofile?tab=policies&subtab=${userConsentData[0].id}`}>
                            <span className='text-gray-500'>{t('labels:show_more')}</span>
                        </Link>
                    )}
                </div>
            ) : null}
            {t('messages:footer_content') !== 'Not Applicable' && (
                <p className='text-gray-500 text-xs mb-0'>{t('messages:footer_content')}</p>
            )}
        </div>
    )
}

export default NewFooter
