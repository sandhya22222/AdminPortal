import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import MarketplaceServices from '../../services/axios/MarketplaceServices'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import LanguageBanner from '../StoreLanguage/LanguageBanner-v2'
import { Button } from '../../shadcnComponents/ui/button'
import { DownloadIcon, EditIconNew, plusIcon } from '../../constants/media'
import { Badge } from '../../shadcnComponents/ui/badge'
import { Card } from '../../shadcnComponents/ui/card'

import { DotIconSVG } from './DotIconSVG'
import { Skeleton } from '../../shadcnComponents/ui/skeleton'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../../shadcnComponents/ui/dropdownMenu'
import { ChevronDown } from 'lucide-react'
import ShadCNTooltip from '../../shadcnComponents/customComponents/ShadCNTooltip'
import ShadCNDataTable from '../../shadcnComponents/customComponents/ShadCNDataTable'
import ShadCNPagination from '../../shadcnComponents/customComponents/ShadCNPagination'
import Ellipsis from '../../shadcnComponents/customComponents/Ellipsis'

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

    const totalItemsCount = languageData?.count
    // const totalItemsCount = 21

    // Columns for table data
    const languageColumn = [
        {
            header: <span>{t('labels:language')}</span>,
            value: 'language',
            width: '25%',
            ellipsis: true,
            render: (text, record) => (
                <div className='flex gap-2  items-center'>
                    {record.is_default ? (
                        <Ellipsis
                            text={record.language}
                            styles={{
                                maxWidth: '50px',
                                padding: '5px',
                                fontSize: '14px',
                            }}
                        />
                    ) : (
                        <div>{record.language}</div>
                    )}
                    {record.is_default && (
                        <Badge
                            variant='default'
                            className='inline-flex items-center gap-1 px-2  py-0.5 text-xs rounded-2xl'
                            color='#FB8500'>
                            {t('labels:default_language')}
                        </Badge>
                    )}
                </div>
            ),
        },
        {
            header: <span>{t('labels:code')}</span>,
            value: 'language_code',
            width: '10%',
        },
        {
            header: <span>{t('labels:script_direction')}</span>,
            value: 'writing_script_direction',
            width: '15%',
            render: (text, record) => (
                <div>
                    {record.writing_script_direction === 'LTR' ? (
                        <Badge
                            variant='success'
                            className='bg-[#f3ffea] text-[#74c32f] border border-[#d4ffb6] font-normal rounded-[5px] px-1 py-0.5 text-xs'>
                            {t('labels:left_to_right')}
                        </Badge>
                    ) : (
                        <Badge
                            variant='fail'
                            className='bg-[#e6f4ff] text-[#407ed4] border border-[#b5dcff] rounded-[5px] font-normal px-1 py-0.5 text-xs'>
                            {t('labels:right_to_left')}
                        </Badge>
                    )}
                </div>
            ),
        },
        {
            header: <span>{t('labels:status')}</span>,
            value: 'status',
            width: '15%',
            render: (text, record) => (
                <div>
                    {String(record.status) === '2' ? (
                        <div className=' w-fit flex items-center space-x-1'>
                            <DotIconSVG className={`w-2 h-2   `} fill={'#cbd5e1 '} />
                            <span>{t('labels:inactive')}</span>
                        </div>
                    ) : (
                        <div className='  w-fit flex items-center space-x-1'>
                            <DotIconSVG className={`w-2 h-2 `} fill={'#22C55E'} />
                            <span>{t('labels:active')}</span>
                        </div>
                    )}
                </div>
            ),
        },
        {
            header: <span>{t('labels:support_document')}</span>,
            value: 'status',
            width: '20%',
            render: (data, record) => (
                <Button
                    className='flex gap-2 hover:bg-gray-100 !p-0 '
                    variant='ghost'
                    size='default'
                    onClick={() => {
                        findAllSupportDocumentTemplateDownload(2, record.language_code)
                    }}>
                    <img src={DownloadIcon} alt='DownloadIcon' className='!text-xs !items-center' />
                    <span>{t('labels:download_document')}</span>
                </Button>
            ),
        },
        {
            header: <span>{t('labels:action')}</span>,
            value: 'action',
            width: '10%',
            render: (text, record) => (
                <ShadCNTooltip content={<span>Edit {record.language}</span>}>
                    <Button
                        className='hover:bg-gray-100'
                        variant='ghost'
                        onClick={() => {
                            navigate(
                                `/dashboard/language/language-settings?k=${record.id}&n=${
                                    record.language
                                }&c=${record.language_code}&s=${record.status}&d=${record.is_default === false ? 0 : 1}`
                            )
                        }}>
                        <img src={EditIconNew} className='!min-w-[14px] !aspect-square' alt='editIcon' />
                    </Button>
                </ShadCNTooltip>
            ),
        },
    ]
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

    const handlePageNumberChange = (page) => {
        setLanguagePaginationData((prev) => ({
            ...prev,
            pageNumber: page,
        }))
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
        <div>
            <div className='sticky bg-white shadow-md p-4 top-[72px] w-[100%] flex flex-col justify-between items-start h-fit z-20'>
                <div className='flex  w-[100%] justify-center items-center'>
                    <h1 className='!font-semibold w-2/5 text-2xl'>{t('labels:language_settings')}</h1>
                    <div className='w-3/5 flex items-center justify-end'>
                        <DropdownMenu>
                            <DropdownMenuTrigger className='app-btn-link flex items-center'>
                                <span className='flex items-center'>
                                    Download Support Document Template
                                    <ChevronDown
                                        className='!ml-[7px] !mr-[4px] '
                                        style={{ width: '1.6em', height: '1.6em', fontWeight: 'normal' }}
                                    />
                                </span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {items.map((item, index) => (
                                    <DropdownMenuItem
                                        key={index}
                                        onClick={() => handleOnclickForDownloadDocument(item)}>
                                        {item.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                            className=' flex w-fit items-center md:gap-1'
                            onClick={() => navigate('/dashboard/language/language-settings')}>
                            <img src={plusIcon} alt='plusIcon' className='text-xs w-3 my-1 mr-2' />
                            <div className='mr-[10px]'>{t('labels:add_language')}</div>
                        </Button>
                    </div>
                </div>
                <p className=' !mt-3 !mb-1'>{t('labels:languages_note')}</p>
            </div>

            <Card className='mb-10  ml-[1.25%] mt-[100px] mr-[1.25%]'>
                {isLoading ? (
                    <div className='w-full'>
                        <Skeleton className='h-10 w-[70%] mb-3' />
                        <Skeleton className='h-7 w-full mb-2' />
                        <Skeleton className='h-7 w-full mb-2' />
                        <Skeleton className='h-7 w-[50%] mb-2' />
                    </div>
                ) : isNetworkErrorLanguage ? (
                    <div className='w-full text-center '>{t('messages:fetch_error')}</div>
                ) : languageData === 0 ? (
                    <>
                        <LanguageBanner />
                    </>
                ) : (
                    <div className='  flex flex-col items-end justify-between w-full'>
                        <div className='w-full'>
                            <ShadCNDataTable columns={languageColumn} data={languageData?.data} />
                        </div>
                        {!totalItemsCount > languagePaginationData.pageSize && (
                            <div className='flex  mt-4 mb-2'>
                                <ShadCNPagination
                                    totalItemsCount={totalItemsCount}
                                    handlePageNumberChange={handlePageNumberChange}
                                    currentPage={languagePaginationData.pageNumber}
                                    itemsPerPage={languagePaginationData.pageSize}
                                    showQuickJumper={true}
                                />
                            </div>
                        )}
                    </div>
                )}
            </Card>
        </div>
    )
}

export default Language
