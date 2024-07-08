import React from 'react'
import { useTranslation } from 'react-i18next'
import { Typography } from 'antd'
import { Link } from 'react-router-dom'
import useGetStoreAdminConsent from '../../hooks/useGetStoreAdminConsent'
const { Text, Paragraph, Link: AntLink } = Typography

const portalInfo = JSON.parse(process.env.REACT_APP_PORTAL_INFO)

const NewFooter = () => {
    const { t } = useTranslation()
    const { data: userConsentData } = useGetStoreAdminConsent()
    return (
        <div className=' bg-white py-6  max-h-[96px] text-center p-[2px] flex flex-col gap-2 items-center justify-center'>
            <>
                {userConsentData && userConsentData.length > 0 ? (
                    <div className='text-xs  gap-x-6  flex max-h-[45px] overflow-y-auto items-center flex-wrap justify-center'>
                        {userConsentData?.map((data, index) => {
                            return (
                                <>
                                    {index <= 3 ? (
                                        <>
                                            <Link to={`/dashboard/userprofile?tab=policies&subtab=${data?.id}`}>
                                                <div className=' max-w-[280px]'>
                                                    <AntLink
                                                        ellipsis={{
                                                            tooltip: {
                                                                title:
                                                                    data?.version_details?.consent_name ||
                                                                    data?.version_details?.consent_display_name,
                                                                mouseLeaveDelay: 0,
                                                                mouseEnterDelay: 0.5,
                                                            },
                                                        }}
                                                        className='!text-xs !text-brandGray1 hover:!text-brandGray1'>
                                                        {data?.version_details?.consent_name ||
                                                            data?.version_details?.consent_display_name}
                                                    </AntLink>
                                                </div>
                                            </Link>
                                            {index !== userConsentData?.length - 1 ? (
                                                <Text className='text-brandGray'>|</Text>
                                            ) : null}
                                        </>
                                    ) : null}
                                </>
                            )
                        })}
                        {userConsentData && userConsentData.length > 4 ? (
                            <Link
                                className=' !text-brandGray1 hover:!text-brandGray1 no-underline'
                                to={`/dashboard/userprofile?tab=policies&subtab=${userConsentData && userConsentData[0].id}`}>
                                {t('labels:show_more')}
                            </Link>
                        ) : null}
                    </div>
                ) : null}
            </>
            <Paragraph className='text-brandGray2 text-xs !mb-0'>
                {/* {t('labels:copyright')} - {t('labels:torry_harris_integration_solutions')} -{' '}
                {t('labels:torry_harris_marketplace')}{" - "}{t('labels:admin_portal')}{" - "}{t('labels:version')}{' '}
                {portalInfo.version} | {t('labels:credits')} */}
                {t('messages:footer_content')}
            </Paragraph>
        </div>
    )
}

export default NewFooter
