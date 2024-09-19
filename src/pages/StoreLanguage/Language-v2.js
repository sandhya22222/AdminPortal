import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import MarketplaceServices from '../../services/axios/MarketplaceServices'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../shadcnComponents/ui/table'
import LanguageBanner from '../StoreLanguage/LanguageBanner-v2'
import { Button } from '../../shadcnComponents/ui/button'
import { DownloadIcon, EditIconNew, plusIcon } from '../../constants/media'
import { Badge } from '../../shadcnComponents/ui/badge'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../../shadcnComponents/ui/tooltip'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '../../shadcnComponents/ui/pagination'

import { DotIconSVG } from './DotIconSVG'
import { Skeleton } from '../../shadcnComponents/ui/skeleton'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../../shadcnComponents/ui/dropdownMenu'
import { ChevronDown } from 'lucide-react'

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

    const totalItemsCount = languageData?.data?.length
    // const totalItemsCount = 21

    const totalPages = Math.ceil(totalItemsCount / languagePaginationData.pageSize)

    console.log('testing=======================')
    console.log(languagePaginationData.pageNumber)
    console.log(totalPages)

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
                <div className='flex font-family-sans w-[100%] justify-center items-center'>
                    <h1 className='!font-semibold w-2/5 text-regal-blue text-2xl'>{t('labels:language_settings')}</h1>
                    <div className='w-3/5 flex items-center justify-end'>
                        <DropdownMenu>
                            <DropdownMenuTrigger className='app-btn-link flex items-center'>
                                <span className='flex items-center'>
                                    Download Support Document Template
                                    <ChevronDown className='ml-1' />
                                </span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className='font-sans'>
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
                            className='app-btn-primary flex w-fit items-center md:gap-1'
                            onClick={() => navigate('/dashboard/language/language-settings')}>
                            <img src={plusIcon} alt='plusIcon' className='text-xs w-3 my-1 mr-2' />
                            <div className='mr-[10px]'>{t('labels:add_language')}</div>
                        </Button>
                    </div>
                </div>
                <p className='!font-normal !text-brandGray1 !mt-3 !mb-1'>{t('labels:languages_note')}</p>
            </div>

            <div className='bg-white shadow-md mb-10 rounded-lg p-4 w-[97%] flex flex-row ml-[1.25%] mt-[100px]'>
                {isLoading ? (
                    <div className='w-full'>
                        <Skeleton className='h-10 w-[70%] mb-3' />
                        <Skeleton className='h-7 w-full mb-2' />
                        <Skeleton className='h-7 w-full mb-2' />
                        <Skeleton className='h-7 w-[50%] mb-2' />
                    </div>
                ) : isNetworkErrorLanguage ? (
                    <div className='w-full text-center text-red-500'>{t('messages:fetch_error')}</div>
                ) : languageData === 0 ? (
                    <>
                        <LanguageBanner />
                    </>
                ) : (
                    <Table>
                        <TableHeader className='bg-gray-100'>
                            <TableRow>
                                <TableHead className='text-regal-blue bg-grey-200 text-sm font-medium leading-[22px] '>
                                    {t('labels:language')}
                                </TableHead>
                                <TableHead className='text-regal-blue text-sm font-medium leading-[22px] '>
                                    {t('labels:code')}
                                </TableHead>
                                <TableHead className='text-regal-blue text-sm font-medium leading-[22px] '>
                                    {t('labels:script_direction')}
                                </TableHead>
                                <TableHead className='text-regal-blue text-sm font-medium leading-[22px] '>
                                    {t('labels:status')}
                                </TableHead>
                                <TableHead className='text-regal-blue text-sm font-medium leading-[22px] '>
                                    {t('labels:support_document')}
                                </TableHead>
                                <TableHead className='text-regal-blue text-sm font-medium leading-[22px] '>
                                    {t('labels:action')}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {languageData?.data?.map((data) => (
                                <TableRow key={data.id}>
                                    <TooltipProvider>
                                        <TableCell className='flex gap-2'>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <span>{data.language}</span>
                                                </TooltipTrigger>
                                                <TooltipContent className='bg-black text-white'>
                                                    {data.language}
                                                </TooltipContent>
                                            </Tooltip>
                                            {data.is_default && (
                                                <Badge
                                                    variant='default'
                                                    className='inline-flex items-center gap-1 px-2 py-0 text-white text-xs rounded-2xl'
                                                    color='#FB8500'>
                                                    {t('labels:default_language')}
                                                </Badge>
                                            )}
                                        </TableCell>
                                    </TooltipProvider>
                                    <TooltipProvider>
                                        <TableCell>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <span>{data.language_code}</span>
                                                </TooltipTrigger>
                                                <TooltipContent className='bg-black text-white'>
                                                    {data.language_code}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TableCell>
                                    </TooltipProvider>

                                    <TableCell>
                                        {data.writing_script_direction === 'LTR' ? (
                                            <Badge
                                                variant='success'
                                                className='bg-green-50 text-green-500 border border-green-600 rounded-sm px-1 py-0.5 text-xs'>
                                                {t('labels:left_to_right')}
                                            </Badge>
                                        ) : (
                                            <Badge
                                                variant='fail'
                                                className='bg-blue-200 text-blue-800 border border-blue-600 rounded-sm px-1 py-0.5 text-xs'>
                                                {t('labels:right_to_left')}
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {String(data.status) === '2' ? (
                                            <div className='!text-brandGray1 w-fit flex items-center space-x-1'>
                                                <DotIconSVG className={`w-2 h-2 text-current  `} fill={'#cbd5e1 '} />
                                                <span>{t('labels:inactive')}</span>
                                            </div>
                                        ) : (
                                            <div className='!text-brandGray1  w-fit flex items-center space-x-1'>
                                                <DotIconSVG className={`w-2 h-2 text-current`} fill={'#22C55E'} />
                                                <span>{t('labels:active')}</span>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant='ghost'
                                            onClick={() => {
                                                findAllSupportDocumentTemplateDownload(2, data.language_code)
                                            }}>
                                            <div className='w-fit flex items-center gap-2'>
                                                {/* <DownloadIconSVG className='!text-xs  !items-center' /> */}
                                                <img
                                                    src={DownloadIcon}
                                                    alt='DownloadIcon'
                                                    className='!text-xs  !items-center'
                                                />
                                                <span className='text-brandPrimaryColor  text-sm font-medium leading-[22px]'>
                                                    {t('labels:download_document')}
                                                </span>
                                            </div>
                                        </Button>
                                    </TableCell>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TableCell>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Button
                                                            variant='ghost'
                                                            onClick={() => {
                                                                navigate(
                                                                    `/dashboard/language/language-settings?k=${data.id}&n=${
                                                                        data.language
                                                                    }&c=${data.language_code}&s=${data.status}&d=${
                                                                        data.is_default === false ? 0 : 1
                                                                    }`
                                                                )
                                                            }}>
                                                            <img
                                                                src={EditIconNew}
                                                                className='!min-w-[14px] !aspect-square'
                                                                alt='editIcon'
                                                            />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent className='bg-black text-white'>
                                                        <span>Edit {data.language}</span>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TableCell>
                                        </Tooltip>
                                    </TooltipProvider>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
            <div className='flex justify-center mb-4'>
                <Pagination className='mt-1'>
                    <PaginationContent>
                        <PaginationPrevious
                            onClick={() => handlePageNumberChange(languagePaginationData.pageNumber - 1)}
                            disabled={languagePaginationData.pageNumber === 1}
                        />
                        {languagePaginationData.pageNumber > 3 && (
                            <PaginationItem>
                                <PaginationLink onClick={() => handlePageNumberChange(1)}>1</PaginationLink>
                            </PaginationItem>
                        )}
                        {languagePaginationData.pageNumber > 4 && <PaginationEllipsis />}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    isActive={page === languagePaginationData.pageNumber}
                                    onClick={() => handlePageNumberChange(page)}>
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        {Pagination.currentPage < totalPages - 2 && <PaginationEllipsis />}
                        {totalPages > 1 && (
                            <PaginationNext
                                onClick={() => handlePageNumberChange(languagePaginationData.pageNumber + 1)}
                                disabled={languagePaginationData.pageNumber === totalPages}
                            />
                        )}
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    )
}

export default Language
