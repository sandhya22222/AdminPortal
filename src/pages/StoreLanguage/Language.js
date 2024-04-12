//! Import libraries
import { Badge, Button, Col, Image, Layout, Tag, Tooltip, Typography, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
//! Import user defined components
import DmPagination from '../../components/DmPagination/DmPagination'
import SkeletonComponent from '../../components/Skeleton/SkeletonComponent'
import HeaderForTitle from '../../components/header/HeaderForTitle'
import util from '../../util/common'
import { DownloadIcon, EditIcon, plusIcon, starIcon } from '../../constants/media'
import { usePageTitle } from '../../hooks/usePageTitle'
import MarketplaceServices from '../../services/axios/MarketplaceServices'

import LanguageBanner from './LanguageBanner'
const { Title, Text } = Typography
const { Content } = Layout

const languageAPI = process.env.REACT_APP_STORE_LANGUAGE_API
const pageLimit = parseInt(process.env.REACT_APP_ITEM_PER_PAGE)
const LanguageDownloadAPI = process.env.REACT_APP_DOWNLOAD_LANGUAGE_TRANSLATION_CSV

const Language = () => {
    const { t } = useTranslation()

    usePageTitle(t('labels:language_settings'))
    const navigate = useNavigate()

    //! declaring useState variables here
    const [languagePaginationData, setLanguagePaginationData] = useState({
        pageNumber: 1,
        pageSize: pageLimit,
    })

    const StarIcon = () => {
        return (
            <>
                <Image src={starIcon} className='mr-1 flex !items-center' preview={false} />
            </>
        )
    }

    const columns = [
        {
            title: `${t('labels:language')}`,
            dataIndex: 'language',
            key: 'language',
            width: '20%',
            ellipsis: true,
            render: (text, record) => {
                return (
                    <Content className='inline-block'>
                        <Tooltip
                            title={record.language}
                            overlayStyle={{ zIndex: 1 }}
                            placement={util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? 'left' : 'right'}>
                            <Text
                                className={`mx-1 ${record.is_default ? '!max-w-[80px]' : '!max-w-[150px]'} `}
                                ellipsis={true}>
                                {record.language}
                            </Text>
                        </Tooltip>
                        {record.is_default ? (
                            <Tag icon={<StarIcon />} className='inline-flex items-center gap-1' color='#FB8500'>
                                {t('labels:default')}
                            </Tag>
                        ) : (
                            ''
                        )}
                    </Content>
                )
            },
        },
        {
            title: `${t('labels:code')}`,
            dataIndex: 'language_code',
            key: 'language_code',
            width: '12%',
            render: (text, record) => {
                return (
                    <>
                        <Tooltip title={record.language_code}>
                            <Text className='max-w-xs' ellipsis={{ tooltip: record.language_code }}>
                                {record.language_code}
                            </Text>
                        </Tooltip>
                    </>
                )
            },
        },
        {
            title: `${t('labels:script_direction')}`,
            dataIndex: 'writing_script_direction',
            key: 'writing_script_direction',
            ellipsis: true,
            width: '20%',
            render: (text, record) => {
                return (
                    <>
                        {record.writing_script_direction === 'LTR' ? (
                            <Tag color='success'>{t('labels:left_to_right')}</Tag>
                        ) : (
                            <Tag color='warning'>{t('labels:right_to_left')}</Tag>
                        )}
                    </>
                )
            },
        },
        {
            title: `${t('labels:status')}`,
            dataIndex: 'status',
            key: 'status',
            width: '12%',
            render: (text, record) => {
                return (
                    <>
                        <Text>
                            {String(record.status) === '2' ? (
                                <Badge status='default' text={t('labels:inactive')} />
                            ) : (
                                <Badge status='success' text={t('labels:active')} />
                            )}
                        </Text>
                    </>
                )
            },
        },
        {
            title: `${t('labels:support_document')}`,
            dataIndex: 'lang_support_docs',
            key: 'lang_support_docs',
            width: '28%',
            render: (text, record) => {
                return (
                    <Button
                        type='text'
                        className='app-btn-text gap-1'
                        onClick={() => {
                            findAllSupportDocumentTemplateDownload(2, record.language_code)
                        }}>
                        <Image src={DownloadIcon} className='!text-xs !w-[10px]  !items-center' preview={false} />
                        {t('labels:download_document')}
                    </Button>
                )
            },
        },
        {
            title: `${t('labels:action')}`,
            dataIndex: '',
            key: '',
            width: '8%',
            align: 'center',
            render: (text, record) => {
                return (
                    <Col className='whitespace-nowrap !text-center'>
                        <Tooltip title={t('labels:edit_language')}>
                            <Button
                                type='text'
                                className='app-btn-icon'
                                onClick={() => {
                                    navigate(
                                        `/dashboard/language/language-settings?k=${record.id}&n=${
                                            record.language
                                        }&c=${record.language_code}&s=${record.status}&d=${
                                            record.is_default === false ? 0 : 1
                                        }`
                                    )
                                }}>
                                <Content className=' flex justify-center align-items-center'>
                                    <img
                                        src={EditIcon}
                                        alt='Edit Icon'
                                        className=' !w-[12px] !text-center !text-sm cursor-pointer'
                                    />
                                </Content>
                            </Button>
                        </Tooltip>
                    </Col>
                )
            },
        },
    ]

    const findByPageLanguageData = async (page, limit) => {
        // Fetcher function
        const res = await MarketplaceServices.findByPage(languageAPI, null, page, limit, false)
        return res?.data?.response_body
    }

    //! Using the useQuery hook to fetch the currency Data
    const {
        data: languageData,
        isLoading,
        isError: isNetworkErrorLanguage,
    } = useQuery({
        queryKey: ['language'],
        queryFn: () => findByPageLanguageData(languagePaginationData.pageNumber, languagePaginationData.pageSize),
        refetchOnWindowFocus: false,
        retry: false,
    })

    //! get call of get document template API
    const findAllSupportDocumentTemplateDownload = (formatOption, langCode) => {
        MarketplaceServices.findMedia(LanguageDownloadAPI, {
            'is-format': formatOption,
            language_code: langCode,
        })
            .then(function (response) {
                console.log('Server Response from DocumentTemplateDownload Function: ', response.data)
                const fileURL = window.URL.createObjectURL(response.data)
                let alink = document.createElement('a')
                alink.href = fileURL
                alink.download = 'frontend_keys_document.csv'
                alink.click()
            })
            .catch((error) => {
                console.log('Server error from DocumentTemplateDownload Function ', error.response)
            })
    }

    const handlePageNumberChange = (page, pageSize) => {
        setLanguagePaginationData({
            pageNumber: page,
            pageSize: pageSize,
        })
    }

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <Content>
            <HeaderForTitle
                title={
                    <Content className=''>
                        <Title level={3} className='!font-normal'>
                            {t('labels:languages')}
                        </Title>
                    </Content>
                }
                titleContent={
                    <Content className=' !flex items-center !justify-end gap-3'>
                        <Button
                            className='app-btn-primary flex align-items-center'
                            onClick={() => navigate('/dashboard/language/language-settings')}>
                            <img src={plusIcon} alt='plusIconWithAddLanguage' className=' !w-3 mr-2 items-center' />
                            <div className='mr-[10px]'>{t('labels:add_language')}</div>
                        </Button>
                    </Content>
                }
            />
            <Content className='!p-3 mt-[7.0rem]'>
                {isLoading ? (
                    <Content className=' bg-white p-3 '>
                        <SkeletonComponent />
                    </Content>
                ) : isNetworkErrorLanguage ? (
                    <Content className='p-3 text-center mb-3 bg-[#F4F4F4]'>
                        <p>{t('messages:network_error')}</p>
                    </Content>
                ) : (
                    <>
                        <Content className='bg-white p-2'>
                            <Table dataSource={languageData?.data} columns={columns} pagination={false} />
                            {languageData?.count >= pageLimit ? (
                                <Content className=' grid justify-items-end'>
                                    <DmPagination
                                        currentPage={languagePaginationData.pageNumber}
                                        totalItemsCount={languageData?.count}
                                        pageLimit={pageLimit}
                                        pageSize={languagePaginationData.pageSize}
                                        handlePageNumberChange={handlePageNumberChange}
                                        showSizeChanger={true}
                                        showTotal={true}
                                    />
                                </Content>
                            ) : null}
                        </Content>
                        {languageData &&
                        languageData?.data.length === 1 &&
                        languageData?.data[0].language_code &&
                        languageData?.count <= pageLimit ? (
                            <Content className='bg-white mt-4 p-2'>
                                <LanguageBanner></LanguageBanner>
                            </Content>
                        ) : null}
                    </>
                )}
            </Content>
        </Content>
    )
}

export default Language
