import React, { useState, useRef } from 'react'
import { Button } from '../../shadcnComponents/ui/button'
import { Card, CardContent } from '../../shadcnComponents/ui/card'
import { Separator } from '../../shadcnComponents/ui/separator'
import { CircleCheck, Download, Upload as UploadIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import MarketplaceServices from '../../services/axios/MarketplaceServices'
import MarketplaceToaster from '../../util/marketplaceToaster'
import util from '../../util/common'
import { DownloadIconSVG } from './DownloadIconSVG'
import { codeJsonIcon, tableIcon } from '../../constants/media'
import StoreModal from '../../components/storeModal/StoreModal'
import Spin from '../../shadcnComponents/customComponents/Spin'

const storeLanguageKeysUploadAPI = process.env.REACT_APP_UPLOAD_LANGUAGE_TRANSLATION_CSV
const LanguageDownloadApiCsv = process.env.REACT_APP_DOWNLOAD_LANGUAGE_TRANSLATION_CSV
const LanguageDownloadApiZip = process.env.REACT_APP_DOWNLOAD_LANGUAGE_TRANSLATION_ZIP
const AdminBackendKeyUploadAPI = process.env.REACT_APP_UPLOAD_ADMIN_BACKEND_MESSAGE_DETAILS
const downloadBackendKeysAPI = process.env.REACT_APP_DOWNLOAD_ADMIN_BACKEND_MESSAGE_DETAILS
const LanguageDownloadAPI = process.env.REACT_APP_DOWNLOAD_LANGUAGE_TRANSLATION_CSV

export default function LanguageDocUpload({ langCode }) {
    const [chooseDownloadModalVisible, setChooseDownloadModalVisible] = useState(false)
    const [showSuccessFModal, setShowSuccessFModal] = useState(false)
    const [showSuccessBModal, setShowSuccessBModal] = useState(false)
    const [isFrontendLoading, setIsFrontendLoading] = useState(false)
    const [isBackendLoading, setIsBackendLoading] = useState(false)
    const [isCSVLoading, setIsCSVLoading] = useState(false)
    const [isZIPLoading, setIsZIPLoading] = useState(false)
    const frontendFileInputRef = useRef(null)
    const backendFileInputRef = useRef(null)

    const { t } = useTranslation()

    const uploadStoreLanguageKeys = (languageFile) => {
        // console.log('Uploading StoreLanguageKeys')
        setIsFrontendLoading(true)
        const formData = new FormData()
        if (languageFile) {
            formData.append('language_file', languageFile)
            formData.append('language_code', langCode)
        }

        MarketplaceServices.save(storeLanguageKeysUploadAPI, formData, null, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(function (response) {
                setIsFrontendLoading(false)
                setShowSuccessFModal(true)
            })
            .catch((error) => {
                setIsFrontendLoading(false)
                MarketplaceToaster.showToast(error.response)
            })
    }

    const uploadStoreBackendKeys = (languageFile) => {
        console.log('Uploading StoreBackendKeys')
        setIsBackendLoading(true)
        const formData = new FormData()
        if (languageFile) {
            formData.append('language_file', languageFile)
            formData.append('language_code', langCode)
        }

        MarketplaceServices.save(AdminBackendKeyUploadAPI, formData, null, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(function (response) {
                setIsBackendLoading(false)
                setShowSuccessBModal(true)
            })
            .catch((error) => {
                setIsBackendLoading(false)
                MarketplaceToaster.showToast(error.response)
            })
    }

    const handleFileChange = (event, uploadFunction) => {
        const file = event.target.files[0]
        if (file) {
            uploadFunction(file)
        }
    }
    const handleUploadClick = (inputRef) => {
        if (inputRef.current) {
            inputRef.current.click()
        }
    }

    const triggerNewUpload = (inputRef, uploadFunction) => {
        const fileInput = inputRef.current
        if (fileInput) {
            fileInput.value = '' // Clear the previous file selection
            fileInput.onchange = (event) => {
                handleFileChange(event, uploadFunction)
            }
            fileInput.click()
        }
    }

    const downloadBEKeysFile = (isFormat, languageCode) => {
        setIsBackendLoading(true)
        MarketplaceServices.findMedia(downloadBackendKeysAPI, {
            'is-format': isFormat,
            language_code: languageCode,
        })
            .then(function (response) {
                setIsBackendLoading(false)
                const fileURL = window.URL.createObjectURL(response.data)
                let alink = document.createElement('a')
                alink.href = fileURL
                alink.download = 'backend_keys_document.csv'
                alink.click()

                MarketplaceToaster.showToast(util.getToastObject(t('messages:download_successful'), 'success'))
            })
            .catch((error) => {
                setIsBackendLoading(false)
                MarketplaceToaster.showToast(util.getToastObject(t('messages:unable_to_download_this_format'), 'error'))
            })
    }

    const downloadCSV = () => {
        setIsCSVLoading(true)
        MarketplaceServices.findMedia(LanguageDownloadApiCsv, {
            'is-format': 2,
            language_code: langCode,
        })
            .then(function (response) {
                setIsCSVLoading(false)
                const fileURL = window.URL.createObjectURL(response.data)
                let alink = document.createElement('a')
                alink.href = fileURL
                alink.download = 'key_value_format.csv'
                alink.click()
                setChooseDownloadModalVisible(false)
                MarketplaceToaster.showToast(util.getToastObject(t('messages:download_successful'), 'success'))
            })
            .catch((error) => {
                setIsCSVLoading(false)
                MarketplaceToaster.showToast(util.getToastObject(t('messages:unable_to_download_this_format'), 'error'))
            })
    }

    const downloadZIP = () => {
        setIsZIPLoading(true)
        MarketplaceServices.findMedia(LanguageDownloadApiZip, {
            language_code: langCode,
        })
            .then(function (response) {
                setIsZIPLoading(false)
                const fileURL = window.URL.createObjectURL(response.data)
                let alink = document.createElement('a')
                alink.href = fileURL
                alink.download = 'key_value_format.zip'
                alink.click()
                setChooseDownloadModalVisible(false)
                MarketplaceToaster.showToast(util.getToastObject(t('messages:download_successful'), 'success'))
            })
            .catch((error) => {
                setIsZIPLoading(false)
                MarketplaceToaster.showToast(util.getToastObject(t('messages:unable_to_download_this_format'), 'error'))
            })
    }

    const findAllSupportDocumentTemplateDownload = (isFormat, languageCode) => {
        setIsFrontendLoading(true)
        MarketplaceServices.findMedia(LanguageDownloadAPI, {
            'is-format': isFormat,
            language_code: languageCode,
        })
            .then(function (response) {
                setIsFrontendLoading(false)
                const fileURL = window.URL.createObjectURL(response.data)
                let alink = document.createElement('a')
                alink.href = fileURL
                alink.download = 'frontend_keys_document.csv'
                alink.click()

                MarketplaceToaster.showToast(util.getToastObject(t('messages:download_successful'), 'success'))
            })
            .catch((error) => {
                setIsFrontendLoading(false)
                MarketplaceToaster.showToast(
                    util.getToastObject(`${t('messages:unable_to_download_this_format')}`, 'error')
                )
            })
    }

    return (
        <div className='w-full max-w-3xl'>
            <label className='font-semibold text-2xl !mb-2 text-regal-blue'>{t('labels:support_document')}</label>
            <p className='text-muted-foreground mb-4'>{t('messages:language_document_data')}</p>
            <div className='space-y-4'>
                <Card>
                    <CardContent className='relative p-4'>
                        {isFrontendLoading && <Spin />}
                        <div className='flex justify-between items-center mb-4'>
                            <h3 className='text-base font-semibold '>{t('labels:frontend_keys')}</h3>
                            <Button
                                variant='outline'
                                className='flex gap-2 items-center'
                                onClick={() => findAllSupportDocumentTemplateDownload(1, null)}
                                disabled={isFrontendLoading}>
                                <Download className='h-4 w-4' />
                                {t('labels:get_frontend_support_template')}
                            </Button>
                        </div>
                        <Separator className='absolute left-0 right-0 my-3' />
                        <p className='text-muted-foreground mb-4 mt-12'>{t('messages:frontend_document')}</p>
                        <div className='flex gap-4'>
                            <input
                                type='file'
                                accept='.csv'
                                ref={frontendFileInputRef}
                                className='hidden'
                                onChange={(e) => handleFileChange(e, uploadStoreLanguageKeys)}
                                disabled={!langCode || isFrontendLoading}
                            />
                            <Button
                                variant='outline'
                                disabled={!langCode || isFrontendLoading}
                                onClick={() => handleUploadClick(frontendFileInputRef)}>
                                <UploadIcon
                                    className={`${util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? 'ml-1' : 'mr-1'}  h-4 w-4`}
                                />
                                {t('labels:click_to_upload')}
                            </Button>
                            <Button
                                variant='ghost'
                                className='flex items-center gap-1'
                                onClick={() => setChooseDownloadModalVisible(true)}
                                disabled={!langCode || isFrontendLoading}>
                                <Download className='h-4 w-4' />
                                {t('messages:download_current_document')}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className='relative p-4'>
                        {isBackendLoading && <Spin />}
                        <div className='flex justify-between items-center mb-4'>
                            <h3 className='text-base font-semibold'>{t('labels:backend_keys')}</h3>
                            <Button
                                variant='outline'
                                className='flex gap-2 items-center'
                                onClick={() => downloadBEKeysFile(1, null)}
                                disabled={isBackendLoading}>
                                <Download className='h-4 w-4' />
                                {t('labels:get_backend_support_template')}
                            </Button>
                        </div>
                        <Separator className='absolute left-0 right-0 my-3' />
                        <p className='text-muted-foreground mb-4 mt-12'>{t('messages:backend_document')}</p>
                        <div className='flex gap-4'>
                            <input
                                type='file'
                                accept='.csv'
                                ref={backendFileInputRef}
                                className='hidden'
                                onChange={(e) => handleFileChange(e, uploadStoreBackendKeys)}
                                disabled={!langCode || isBackendLoading}
                            />
                            <Button
                                variant='outline'
                                disabled={!langCode || isBackendLoading}
                                onClick={() => handleUploadClick(backendFileInputRef)}>
                                <UploadIcon
                                    className={` ${util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? 'ml-1' : 'mr-1'} h-4 w-4`}
                                />
                                {t('labels:click_to_upload')}
                            </Button>
                            <Button
                                variant='ghost'
                                className='flex items-center gap-1'
                                onClick={() => setChooseDownloadModalVisible(true)}
                                disabled={!langCode || isBackendLoading}>
                                <Download className='h-4 w-4' />
                                {t('messages:download_current_document')}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <StoreModal
                isVisible={chooseDownloadModalVisible}
                okCallback={() => {}}
                cancelCallback={() => setChooseDownloadModalVisible(false)}
                title={t('messages:choose_download_format')}
                hideCloseButton={false}>
                <div className='grid grid-cols-2 gap-4 mt-6'>
                    <div className='relative'>
                        {isCSVLoading && <Spin />}
                        <Button
                            variant='ghost'
                            className='flex flex-col items-center gap-1 border border-gray-300 rounded-md p-16 w-full h-full'
                            onClick={downloadCSV}
                            disabled={isCSVLoading || isZIPLoading}>
                            <img alt='table icon' src={tableIcon} className='mb-2' />
                            <span>{t('labels:csv_format')}</span>
                        </Button>
                    </div>

                    <div className='relative'>
                        {isZIPLoading && <Spin />}
                        <Button
                            variant='ghost'
                            className='flex flex-col items-center gap-1 border border-gray-300 rounded-md p-16 w-full h-full'
                            onClick={downloadZIP}
                            disabled={isCSVLoading || isZIPLoading}>
                            <img src={codeJsonIcon} alt='json icon' className='mb-2' />
                            <span>{t('labels:zip_format')}</span>
                        </Button>
                    </div>
                </div>
            </StoreModal>

            <StoreModal
                isVisible={showSuccessFModal}
                okCallback={() => setShowSuccessFModal(false)}
                cancelCallback={() => setShowSuccessFModal(false)}
                title={null}
                hideCloseButton={true}>
                <div className='flex flex-col items-center py-6'>
                    <CircleCheck className='w-16 h-16 text-green-500 mb-4' />
                    <p className='text-center text-xl font-semibold mb-2'>{t('messages:upload_success')}</p>
                    <p className='text-center text-gray-600 mb-6'>{t('messages:upload_success_message')}</p>
                    <div className='flex space-x-4'>
                        <Button onClick={() => setShowSuccessFModal(false)}>{t('labels:close')}</Button>
                        <Button
                            variant='outline'
                            disabled={!langCode}
                            onClick={() => {
                                setShowSuccessFModal(false)
                                triggerNewUpload(frontendFileInputRef, uploadStoreLanguageKeys)
                            }}>
                            <UploadIcon className='mr-2 h-4 w-4' />
                            {t('labels:click_to_upload')}
                        </Button>
                    </div>
                </div>
            </StoreModal>

            <StoreModal
                isVisible={showSuccessBModal}
                okCallback={() => setShowSuccessBModal(false)}
                cancelCallback={() => setShowSuccessBModal(false)}
                title={null}
                hideCloseButton={true}>
                <div className='flex flex-col items-center py-6'>
                    <CircleCheck className='w-16 h-16 text-green-500 mb-4' />
                    <p className='text-center text-xl font-semibold mb-2'>{t('messages:upload_success')}</p>
                    <p className='text-center text-gray-600 mb-6'>{t('messages:upload_success_message')}</p>
                    <div className='flex space-x-4'>
                        <Button onClick={() => setShowSuccessBModal(false)}>{t('labels:close')}</Button>
                        <Button
                            variant='outline'
                            disabled={!langCode}
                            onClick={() => {
                                setShowSuccessBModal(false)
                                triggerNewUpload(backendFileInputRef, uploadStoreBackendKeys)
                            }}>
                            <UploadIcon className='mr-2 h-4 w-4' />
                            {t('labels:click_to_upload')}
                        </Button>
                    </div>
                </div>
            </StoreModal>
        </div>
    )
}
