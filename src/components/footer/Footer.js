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
        <div className='bg-[#D9D9D9] !min-h-0 text-center p-[3px]'>
            <div className=' text-xs  gap-x-3  flex overflow-y-auto items-center flex-wrap justify-center'>
                {userConsentData && userConsentData.length > 0
                    ? userConsentData?.map((data, index) => {
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
                                                      className='!text-xs'>
                                                      {data?.version_details?.consent_name ||
                                                          data?.version_details?.consent_display_name}
                                                  </AntLink>
                                              </div>
                                          </Link>
                                          {index !== userConsentData?.length - 1 ? <Text>|</Text> : null}
                                      </>
                                  ) : null}
                              </>
                          )
                      })
                    : null}
                {userConsentData && userConsentData.length > 4 ? (
                    <Link to={`/dashboard/userprofile?tab=policies&subtab=${userConsentData && userConsentData[0].id}`}>
                        {t('labels:show_more')}
                    </Link>
                ) : null}
            </div>
            <Paragraph className='footer-text-color text-xs pt-1 !mb-0'>
                {t('labels:copyright')} - {t('labels:torry_harris_integration_solutions')} -{' '}
                {t('labels:torry_harris_marketplace')}{" - "}{t('labels:admin_portal')}{" - "}{t('labels:version')}{' '}
                {portalInfo.version} | {t('labels:credits')}
            </Paragraph>
        </div>
    )
}

export default NewFooter
