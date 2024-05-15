import { Empty, Layout, Skeleton, Anchor, Row, Col } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useGetStoreAdminConsent from '../../hooks/useGetStoreAdminConsent'
import { useLocation } from 'react-router-dom'
import util from '../../util/common'
import ReactQuill from 'react-quill'
import './DisplayPolicy.css'
import { getGenerateDateAndTime } from '../../util/util'
import { usePageTitle } from '../../hooks/usePageTitle'
const { Content } = Layout

const ListPolicies = ({ searchParams, setSearchParams }) => {
    const { t } = useTranslation()
    usePageTitle(t('labels:policies'))
    const search = useLocation().search
    const subTabData = new URLSearchParams(search).get('subtab')
    const [policiesTab, setPoliciesTab] = useState([])
    const { data: storeAdminConsent, status: storeAdminStatus } = useGetStoreAdminConsent()
    const [policyLink, setPolicyLink] = useState('')

    useEffect(() => {
        if (searchParams.get('subtab')) window.scrollTo(0, 0)
    }, [searchParams])

    useEffect(() => {
        if (storeAdminStatus === 'success') {
            const tempTabData = []
            storeAdminConsent?.forEach((consent) => {
                if (consent?.version_details?.consent_display_name) {
                    tempTabData.push({
                        key: `${String(consent?.id)}`,
                        // title: (
                        //     <div className=' max-w-[130px]'>
                        //         <Text
                        //             ellipsis={{
                        //                 tooltip: {
                        //                     title: consent?.version_details?.consent_display_name,
                        //                     mouseLeaveDelay: 0,
                        //                     mouseEnterDelay: 0.5,
                        //                     zIndex: 1,
                        //                 },
                        //             }}
                        //             className=' '>
                        //             {consent?.version_details?.consent_display_name}
                        //         </Text>
                        //     </div>
                        // ),
                        title: consent?.version_details?.consent_display_name,
                        href: `#${String(consent?.id)}`,
                    })
                }
            })
            if (tempTabData?.length > 0) setPoliciesTab(tempTabData)
        }
    }, [storeAdminConsent, storeAdminStatus])

    const getCurrentAnchor = (link) => {
        if (link !== '' && link !== null && link !== undefined) {
            return link
        } else {
            return policyLink
        }
    }

    const handleClick = (e, link) => {
        e.preventDefault()
        setPolicyLink(link.href)
        const hashValue = link.href.slice(1)
        setSearchParams({
            tab: searchParams.get('tab'),
            subtab: hashValue,
        })
    }

    useEffect(() => {
        if (subTabData !== undefined && subTabData !== null) {
            setPolicyLink(`#${String(subTabData)}`)
        } else {
            setPolicyLink(`#${String(storeAdminConsent && storeAdminConsent.length > 0 && storeAdminConsent[0].id)}`)
        }
    }, [subTabData, storeAdminConsent])
    return (
        <Content className=' w-full h-full '>
            {storeAdminStatus === 'pending' && (
                <Skeleton
                    active
                    paragraph={{
                        rows: 6,
                    }}
                    className='p-3 w-full'></Skeleton>
            )}
            {storeAdminStatus === 'success' && (
                <>
                    <div
                        className={`${
                            util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? 'mr-4' : ''
                        } !text-xl !font-medium !mt-4 mb-4  `}>
                        {t('labels:policies')}
                    </div>
                    {policiesTab?.length > 0 && (
                        <Row className=''>
                            <Col className='' span={19}>
                                <div className=' '>
                                    {storeAdminConsent && storeAdminConsent.length > 0
                                        ? storeAdminConsent?.map((data, index) => {
                                              console.log('data', data)
                                              return (
                                                  <Content id={String(data && data?.id)} className={''}>
                                                      <div className={` !text-lg !font-semibold mb-3 `}>
                                                          {data?.version_details?.consent_display_name}:
                                                      </div>
                                                      <div className={` !text-sm !font-semibold mb-2`}>
                                                          {t('labels:last_updated')}:{' '}
                                                          {getGenerateDateAndTime(data?.updated_on, 'D MMMM YYYY')}
                                                      </div>
                                                      <ReactQuill
                                                          value={data?.version_details?.consent_display_description}
                                                          modules={{ toolbar: false }}
                                                          readOnly
                                                          className='mb-3 mr-2 text-base editor quill'
                                                      />
                                                  </Content>
                                              )
                                          })
                                        : null}
                                </div>
                            </Col>
                            <Col span={5} className='py-4   px-2 '>
                                <div
                                    style={{
                                        position: 'sticky',
                                        top: `${storeAdminConsent && storeAdminConsent.length > 10 ? '120px' : '60px'}`,
                                    }}>
                                    <Anchor
                                        affix={false}
                                        className='!no-underline'
                                        showInkInFixed={true}
                                        targetOffset={130}
                                        items={policiesTab}
                                        getCurrentAnchor={getCurrentAnchor}
                                        onClick={handleClick}
                                    />
                                </div>
                            </Col>
                        </Row>
                    )}
                    {policiesTab?.length === 0 && (
                        <div className='  flex justify-center mb-3'>
                            <Empty description={t('messages:no_policies_available')} />
                        </div>
                    )}
                </>
            )}
            {storeAdminStatus === 'error' && (
                <p className=' !text-black !text-opacity-80 pt-5 text-center'>{t('messages:network_error')}</p>
            )}
        </Content>
    )
}
export default ListPolicies
