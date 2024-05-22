//! Import libraries
import { Badge, Button, Col, Image, Layout, Tag, Tooltip, Typography, Table, Dropdown, Space } from 'antd'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
//! Import user defined components
import DmPagination from '../../components/DmPagination/DmPagination'
import SkeletonComponent from '../../components/Skeleton/SkeletonComponent'
import HeaderForTitle from '../../components/header/HeaderForTitle'
import util from '../../util/common'
import { DownloadIcon, EditIconNew, plusIcon, starIcon } from '../../constants/media'
import { usePageTitle } from '../../hooks/usePageTitle'
import MarketplaceServices from '../../services/axios/MarketplaceServices'
import { DownOutlined } from '@ant-design/icons'

import LanguageBanner from './LanguageBanner'
const { Title, Text } = Typography
const { Content } = Layout

const languageAPI = process.env.REACT_APP_STORE_LANGUAGE_API
const pageLimit = parseInt(process.env.REACT_APP_ITEM_PER_PAGE)
const LanguageDownloadAPI = process.env.REACT_APP_DOWNLOAD_LANGUAGE_TRANSLATION_CSV
const downloadBackendKeysAPI = process.env.REACT_APP_DOWNLOAD_ADMIN_BACKEND_MESSAGE_DETAILS

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
            title: <Text className='text-regal-blue text-sm font-medium leading-[22px]'>{t('labels:language')}</Text>,
            dataIndex: 'language',
            key: 'language',
            width: '21%',
            ellipsis: true,
            render: (text, record) => {
                return (
                    <Content className='inline-block'>
                        <Tooltip title={record.language} overlayStyle={{ zIndex: 1 }} placement={'bottom'}>
                            <Text
                                className={`text-brandGray1 mx-1 ${record.is_default ? '!max-w-[50px]' : '!max-w-[150px]'} `}
                                ellipsis={true}>
                                {record.language}
                            </Text>
                        </Tooltip>
                        {record.is_default ? (
                            <Tag className='inline-flex items-center gap-1 rounded-2xl' color='#FB8500'>
                                {t('labels:default_language')}
                            </Tag>
                        ) : (
                            ''
                        )}
                    </Content>
                )
            },
        },
        {
            title: <Text className='text-regal-blue text-sm font-medium leading-[22px]'>{t('labels:code')}</Text>,
            dataIndex: 'language_code',
            key: 'language_code',
            width: '11%',
            render: (text, record) => {
                return (
                    <>
                        <Tooltip title={record.language_code}>
                            <Text className='max-w-xs text-brandGray1' ellipsis={{ tooltip: record.language_code }}>
                                {record.language_code}
                            </Text>
                        </Tooltip>
                    </>
                )
            },
        },
        {
            title: (
                <Text className='text-regal-blue text-sm font-medium leading-[22px]'>
                    {t('labels:script_direction')}
                </Text>
            ),
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
                            <Tag color='blue'>{t('labels:right_to_left')}</Tag>
                        )}
                    </>
                )
            },
        },
        {
            title: <Text className='text-regal-blue text-sm font-medium leading-[22px]'>{t('labels:status')}</Text>,
            dataIndex: 'status',
            key: 'status',
            width: '11%',
            render: (text, record) => {
                return (
                    <>
                        <Text className=''>
                            {String(record.status) === '2' ? (
                                <Badge
                                    status='default'
                                    text={<Text className='!text-brandGray1'>{t('labels:inactive')}</Text>}
                                />
                            ) : (
                                <Badge
                                    status='success'
                                    text={<Text className='!text-brandGray1'>{t('labels:active')}</Text>}
                                />
                            )}
                        </Text>
                    </>
                )
            },
        },
        {
            title: (
                <Text className='text-regal-blue text-sm font-medium leading-[22px]'>
                    {t('labels:support_document')}
                </Text>
            ),
            dataIndex: 'lang_support_docs',
            key: 'lang_support_docs',
            width: '25%',
            render: (text, record) => {
                return (
                    <Button
                        type='text'
                        className='app-btn-text gap-1'
                        onClick={() => {
                            findAllSupportDocumentTemplateDownload(2, record.language_code)
                        }}>
                        <Image src={DownloadIcon} className='!text-xs  !items-center' preview={false} />
                        <Text className='text-brandPrimaryColor text-sm font-medium leading-[22px]'>
                            {t('labels:download_document')}
                        </Text>
                    </Button>
                )
            },
        },
        {
            title: <Text className='text-regal-blue text-sm font-medium leading-[22px]'>{t('labels:action')}</Text>,
            dataIndex: '',
            key: '',
            width: '10%',
            align: 'center',
            render: (text, record) => {
                return (
                    <div className='!flex !justify-center'>
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
                                <img src={EditIconNew} className='!min-w-[14px] !aspect-square' alt='editIcon' />
                            </Button>
                        </Tooltip>
                    </div>
                )
            },
        },
    ]
    const items = [
        {
            key: 1,
            label: `${t('labels:get_frontend_support_template')}`,
        },
        {
            key: 2,
            label: `${t('labels:get_backend_support_template')}`,
        },
    ]

    const findByPageLanguageData = async (page, limit) => {
        // Fetcher function
        const res = await MarketplaceServices.findByPage(languageAPI, null, page, limit, false)
        return res?.data?.response_body
    }

    //! Using the useQuery hook to fetch the language Data
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

    const downloadBEKeysFile = () => {
        MarketplaceServices.findMedia(downloadBackendKeysAPI, {
            'is-format': 1,
        })
            .then(function (response) {
                console.log('Server Response from DocumentTemplateDownload Function: ', response.data)
                const fileURL = window.URL.createObjectURL(response.data)
                let alink = document.createElement('a')
                alink.href = fileURL
                alink.download = 'message_format.csv'
                alink.click()
            })
            .catch((error) => {
                console.log('Server error from DocumentTemplateDownload Function ', error.response)
            })
    }

    const handleOnclickForDownloadDocument = (e) => {
        parseInt(e.key) === 1 ? findAllSupportDocumentTemplateDownload(1, null) : downloadBEKeysFile()
    }

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <Content>
            <HeaderForTitle
                title={
                    <Content className=''>
                        <div className='flex flex-row justify-between items-center h-[42px]'>
                            <Text level={3} className='!font-semibold text-regal-blue text-2xl'>
                                {t('labels:languages')}
                            </Text>
                            <Content className='!flex gap-2 items-center !justify-end'>
                                <Dropdown
                                    className='app-btn-link'
                                    placement='bottomRight'
                                    arrow
                                    menu={{
                                        items,
                                        onClick: handleOnclickForDownloadDocument,
                                    }}>
                                    <a onClick={(e) => e.preventDefault()}>
                                        <Space>
                                            {t('labels:download_support_document_template')}
                                            <DownOutlined className='!ml-[4px]' />
                                        </Space>
                                    </a>
                                </Dropdown>
                                <Button
                                    className='app-btn-primary flex align-items-center'
                                    onClick={() => navigate('/dashboard/language/language-settings')}>
                                    <img
                                        src={plusIcon}
                                        alt='plusIconWithAddLanguage'
                                        className=' !w-3 mr-2 items-center'
                                    />
                                    <div className='mr-[10px]'>{t('labels:add_language')}</div>
                                </Button>
                            </Content>
                        </div>
                        <p className='!font-semibold !text-slate-400 !mt-2 !mb-6'>{t('labels:languages_note')}</p>
                    </Content>
                }
                titleContent={<Content className=' !flex !justify-end'></Content>}
            />
            <Content className='!p-3 mt-[195px]'>
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
                        <Content className='bg-white p-3 shadow-brandShadow rounded-md'>
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
                                        showQuickJumper={true}
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
