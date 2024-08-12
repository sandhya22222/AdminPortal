import { CheckCircleFilled, UploadOutlined } from '@ant-design/icons'
import { Button, Card, Divider, Layout, Spin, Typography, Upload } from 'antd'
import React, { useState } from 'react'
import MarketplaceServices from '../../services/axios/MarketplaceServices'
import { CloseOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import StoreModal from '../../components/storeModal/StoreModal'
import { DownloadIcon, codeJsonIcon, tableIcon, DownloadIconDisable } from '../../constants/media'
import util from '../../util/common'
import MarketplaceToaster from '../../util/marketplaceToaster'
import { DownloadIconSVG } from './DownloadIconSVG'

const storeLanguageKeysUploadAPI = process.env.REACT_APP_UPLOAD_LANGUAGE_TRANSLATION_CSV
const LanguageDownloadApiCsv = process.env.REACT_APP_DOWNLOAD_LANGUAGE_TRANSLATION_CSV
const LanguageDownloadApiZip = process.env.REACT_APP_DOWNLOAD_LANGUAGE_TRANSLATION_ZIP
const AdminBackendKeyUploadAPI = process.env.REACT_APP_UPLOAD_ADMIN_BACKEND_MESSAGE_DETAILS
const downloadBackendKeysAPI = process.env.REACT_APP_DOWNLOAD_ADMIN_BACKEND_MESSAGE_DETAILS
const LanguageDownloadAPI = process.env.REACT_APP_DOWNLOAD_LANGUAGE_TRANSLATION_CSV
function LanguageDocUpload({ langCode }) {
    const [chooseDownloadModalVisible, setChooseDownloadModalVisible] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [isSpinning, setIsSpinning] = useState(false)
    const [isBEKeysUploadModalOpen, setIsBEKeysUploadModalOpen] = useState(false)
    const [isSpinningForBEUpload, setIsSpinningForBEUpload] = useState(false)

    const { t } = useTranslation()
    const { Content } = Layout
    const { Title, Text } = Typography

    const uploadStoreLanguageKeys = (languageFile) => {
        setIsSpinning(true)
        const formData = new FormData()
        if (languageFile) {
            formData.append('language_file', languageFile)
            formData.append('language_code', langCode)
        }
        for (var key of formData.entries()) {
            console.log(key[0] + ', ' + key[1])
        }
        let storeLanguageKeysPOSTBody = {
            language_code: langCode,
            language_file: languageFile,
        }
        console.log('postBody', storeLanguageKeysPOSTBody)
        MarketplaceServices.save(storeLanguageKeysUploadAPI, formData, null, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(function (response) {
                setIsSpinning(false)
                setShowSuccessModal(true)
            })
            .catch((error) => {
                setIsSpinning(false)
                MarketplaceToaster.showToast(error.response)
            })
    }

    const uploadStoreBackendKeys = (languageFile) => {
        setIsSpinningForBEUpload(true)
        const formData = new FormData()
        if (languageFile) {
            formData.append('language_file', languageFile)
            formData.append('language_code', langCode)
        }
        console.log('formBody', formData)
        for (var key of formData.entries()) {
            console.log(key[0] + ', ' + key[1])
        }
        let storeLanguageKeysPOSTBody = {
            language_code: langCode,
            language_file: languageFile,
        }
        console.log('postBody', storeLanguageKeysPOSTBody)
        MarketplaceServices.save(AdminBackendKeyUploadAPI, formData, null, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(function (response) {
                console.log('success response for backend keys upload', response)
                setIsSpinningForBEUpload(false)
                setIsBEKeysUploadModalOpen(true)
            })
            .catch((error) => {
                setIsSpinningForBEUpload(false)
                MarketplaceToaster.showToast(error.response)
            })
    }

    const handleFileChange = (file) => {
        if (file.status !== 'removed') {
            uploadStoreLanguageKeys(file)
        }
    }

    const closeSuccessModal = () => {
        setShowSuccessModal(false)
    }

    const downloadBEKeysFile = (isFormat, languageCode) => {
        // setIsSpinningForBEUpload(true);
        MarketplaceServices.findMedia(downloadBackendKeysAPI, {
            'is-format': isFormat,
            language_code: languageCode,
        })
            .then(function (response) {
                console.log('Server Response from DocumentTemplateDownload Function: ', response.data)
                const fileURL = window.URL.createObjectURL(response.data)
                let alink = document.createElement('a')
                alink.href = fileURL
                alink.download = 'backend_keys_document.csv'
                alink.click()

                MarketplaceToaster.showToast(util.getToastObject(t('messages:download_successful'), 'success'))
            })
            .catch((error) => {
                MarketplaceToaster.showToast(util.getToastObject(t('messages:unable_to_download_this_format'), 'error'))
                console.log('Server error from DocumentTemplateDownload Function ', error.response)
            })
    }

    const downloadCSV = () => {
        setIsSpinning(true)
        MarketplaceServices.findMedia(LanguageDownloadApiCsv, {
            'is-format': 2,
            language_code: langCode,
        })
            .then(function (response) {
                setIsSpinning(false)
                console.log(
                    'Server Response from DocumentTemplateDownload Function: ',
                    LanguageDownloadApiCsv,
                    response.data
                )
                const fileURL = window.URL.createObjectURL(response.data)
                let alink = document.createElement('a')
                alink.href = fileURL
                alink.download = 'key_value_format.csv'
                alink.click()
                setChooseDownloadModalVisible(false)
                MarketplaceToaster.showToast(util.getToastObject(t('messages:download_successful'), 'success'))
            })
            .catch((error) => {
                setIsSpinning(false)
                console.log(
                    'Error server Response from DocumentTemplateDownload Function:  ',
                    LanguageDownloadApiCsv,
                    error
                )
                MarketplaceToaster.showToast(util.getToastObject(t('messages:unable_to_download_this_format'), 'error'))
            })
    }

    const downloadZIP = () => {
        setIsSpinning(true)
        MarketplaceServices.findMedia(LanguageDownloadApiZip, {
            language_code: langCode,
        })
            .then(function (response) {
                setIsSpinning(false)
                console.log('Server Response from DocumentTemplateDownload Function: ', response.data)
                const fileURL = window.URL.createObjectURL(response.data)
                let alink = document.createElement('a')
                alink.href = fileURL
                alink.download = 'key_value_format.zip'
                alink.click()
                setChooseDownloadModalVisible(false)
                MarketplaceToaster.showToast(util.getToastObject(t('messages:download_successful'), 'success'))
            })
            .catch((error) => {
                console.log('Server error from DocumentTemplateDownload Function ', error)
                MarketplaceToaster.showToast(util.getToastObject(t('messages:unable_to_download_this_format'), 'error'))
                setIsSpinning(false)
            })
    }

    const closeKeysUploadModal = () => {
        setIsBEKeysUploadModalOpen(false)
    }

    //! get call of get document template API
    const findAllSupportDocumentTemplateDownload = (isFormat, languageCode) => {
        MarketplaceServices.findMedia(LanguageDownloadAPI, {
            'is-format': isFormat,
            language_code: languageCode,
        })
            .then(function (response) {
                setIsSpinning(false)
                console.log('Server Response from DocumentTemplateDownload Function: ', response.data)
                const fileURL = window.URL.createObjectURL(response.data)
                let alink = document.createElement('a')
                alink.href = fileURL
                alink.download = 'frontend_keys_document.csv'
                alink.click()

                MarketplaceToaster.showToast(util.getToastObject(t('messages:download_successful'), 'success'))
            })
            .catch((error) => {
                setIsSpinning(false)
                console.log('Server error from DocumentTemplateDownload Function ', error.response)
                MarketplaceToaster.showToast(
                    util.getToastObject(`${t('messages:unable_to_download_this_format')}`, 'error')
                )
            })
    }

    const handleChangeForBackendKeysUpload = (file) => {
        if (file.status !== 'removed') {
            uploadStoreBackendKeys(file)
        }
    }

    return (
        <Content className='!w-[750px]'>
            <div className='font-semibold text-lg leading-[26px] text-regal-blue mb-2 px-1'>
                {t('labels:support_document')}
            </div>
            <p className='text-brandGray2 px-1'>{t('messages:language_document_data')}</p>
            <Content className='!flex gap-4'>
                <Content className='border rounded-md '>
                    <Spin spinning={isSpinning} tip='Please wait'>
                        <Content className='flex p-3 justify-between'>
                            <Content>
                                <Text className='text-base font-semibold !text-regal-blue'>
                                    {t('labels:frontend_keys')}
                                </Text>
                            </Content>
                            <Button
                                className='app-btn-secondary flex gap-2 !items-center mb-1 customClass text-regal-blue font-medium text-sm'
                                onClick={() => findAllSupportDocumentTemplateDownload(1, null)}>
                                <DownloadIconSVG />

                                {t('labels:get_frontend_support_template')}
                            </Button>
                        </Content>

                        <Divider className='my-0 ' />
                        <p className='!p-4 !pb-0 text-brandGray2'>{t('messages:frontend_document')}</p>
                        <Content className='flex p-3 gap-4'>
                            <Upload
                                beforeUpload={() => {
                                    return false
                                }}
                                afterUpload={() => {
                                    return false
                                }}
                                showUploadList={false}
                                accept='.csv'
                                maxCount={1}
                                onChange={(e) => handleFileChange(e.file)}
                                className='app-btn-secondary'
                                openFileDialogOnClick={langCode !== undefined && langCode !== null ? true : false}>
                                <Button
                                    className={'app-btn-secondary font-medium text-sm flex items-center'}
                                    icon={<UploadOutlined />}
                                    disabled={langCode !== undefined && langCode !== null ? false : true}>
                                    {t('labels:click_to_upload')}
                                </Button>
                            </Upload>
                            <Button
                                type='text'
                                className={` app-btn-text flex items-center cursor-pointer gap-1 ${
                                    langCode !== undefined && langCode !== null ? '' : '!opacity-25'
                                }`}
                                onClick={() => setChooseDownloadModalVisible(true)}
                                disabled={langCode !== undefined && langCode !== null ? false : true}>
                                <img src={DownloadIcon} alt='download icon' className='!text-xs  !items-center' />
                                {t('messages:download_current_document')}
                            </Button>
                        </Content>
                    </Spin>
                </Content>
            </Content>
            <Content className=' mt-4 !flex gap-4'>
                <Content className='border rounded-md'>
                    <Spin spinning={isSpinningForBEUpload} tip='Please wait'>
                        <Content className='flex justify-between p-3'>
                            <Content>
                                <Text className='text-base font-semibold !text-regal-blue'>
                                    {t('labels:backend_keys')}
                                </Text>
                            </Content>
                            <Button
                                className='app-btn-secondary font-medium text-sm flex gap-2 !items-center !mb-1 customClass text-regal-blue'
                                onClick={() => downloadBEKeysFile(1, null)}>
                                <DownloadIconSVG />
                                {t('labels:get_backend_support_template')}
                            </Button>
                        </Content>
                        <Divider className='my-0 ' />

                        <p className='!p-4 !pb-0 text-brandGray2'>{t('messages:backend_document')}</p>
                        <Content className='flex p-3 gap-4'>
                            <Upload
                                beforeUpload={() => {
                                    return false
                                }}
                                afterUpload={() => {
                                    return false
                                }}
                                showUploadList={false}
                                openFileDialogOnClick={langCode !== undefined && langCode !== null ? true : false}
                                accept='.csv'
                                maxCount={1}
                                onChange={(e) => handleChangeForBackendKeysUpload(e.file)}
                                className='app-btn-secondary'>
                                <Button
                                    className={'app-btn-secondary font-medium text-sm flex items-center'}
                                    icon={<UploadOutlined />}
                                    disabled={langCode !== undefined && langCode !== null ? false : true}>
                                    {t('labels:click_to_upload')}
                                </Button>
                            </Upload>
                            <Button
                                type='text'
                                className={` app-btn-text cursor-pointer gap-1 ${
                                    langCode !== undefined && langCode !== null ? '' : '!opacity-25'
                                }`}
                                onClick={() => downloadBEKeysFile(2, langCode)}
                                disabled={langCode !== undefined && langCode !== null ? false : true}>
                                <img src={DownloadIcon} alt='download icon' className='!text-xs  flex items-center' />
                                {t('messages:download_current_document')}
                            </Button>
                        </Content>
                    </Spin>
                </Content>
            </Content>
            <StoreModal
                isVisible={showSuccessModal}
                // title={t("approvals:Approval-Request-Submission")}
                okButtonText={null}
                hideCloseButton={false}
                cancelButtonText={null}
                isSpin={false}>
                <Content className='flex flex-col justify-center items-center'>
                    <CheckCircleFilled className=' text-[#52c41a] text-[80px]' />
                    <Title level={3} className='!mt-5 !mb-0'>
                        {t('messages:upload_success')}
                    </Title>
                    <Text>{t('messages:upload_success_message')}</Text>
                    <Content className='mt-3 flex gap-2'>
                        <Button className='app-btn-primary' onClick={() => closeSuccessModal()}>
                            {t('labels:close')}
                        </Button>
                        <Upload
                            showUploadList={false}
                            maxCount={1}
                            accept='.csv'
                            beforeUpload={() => {
                                return false
                            }}
                            afterUpload={() => {
                                return false
                            }}
                            onChange={(e) => {
                                setShowSuccessModal(false)
                                handleFileChange(e.file)
                            }}>
                            <Button className={'flex items-center app-btn-secondary'} icon={<UploadOutlined />}>
                                {t('labels:upload_again')}
                            </Button>
                        </Upload>
                    </Content>
                </Content>
            </StoreModal>
            <StoreModal
                isVisible={isBEKeysUploadModalOpen}
                // title={t("approvals:Approval-Request-Submission")}
                okButtonText={null}
                hideCloseButton={false}
                cancelButtonText={null}
                isSpin={false}>
                <Content className='flex flex-col justify-center items-center'>
                    <CheckCircleFilled className=' text-[#52c41a] text-[80px]' />
                    <Title level={3} className='!mt-5 !mb-0'>
                        {t('messages:upload_success')}
                    </Title>
                    <Text>{t('messages:upload_success_message')}</Text>
                    <Content className='mt-3'>
                        <Button className='app-btn-primary mr-2' onClick={() => closeKeysUploadModal()}>
                            {t('labels:close')}
                        </Button>
                        <Upload
                            showUploadList={false}
                            maxCount={1}
                            accept='.csv'
                            beforeUpload={() => {
                                return false
                            }}
                            afterUpload={() => {
                                return false
                            }}
                            onChange={(e) => {
                                setIsBEKeysUploadModalOpen(false)
                                handleChangeForBackendKeysUpload(e.file)
                            }}>
                            <Button className={'flex items-center app-btn-secondary'} icon={<UploadOutlined />}>
                                {t('labels:upload_again')}
                            </Button>
                        </Upload>
                    </Content>
                </Content>
            </StoreModal>
            <StoreModal
                isVisible={chooseDownloadModalVisible}
                // title={t("messages:download_current_document")}
                okButtonText={null}
                hideCloseButton={false}
                cancelButtonText={null}
                cancelCallback={() => setChooseDownloadModalVisible(false)}
                isSpin={false}>
                <Spin spinning={isSpinning} tip='Please wait'>
                    <Content className='flex justify-between items-center'>
                        {/* <Title level={4}>{t('messages:download_current_document')}</Title> */}
                        <div className='font-semibold text-lg'>{t('messages:choose_download_format')}</div>
                        <CloseOutlined
                            role={'button'}
                            className='mb-[5px]'
                            onClick={() => setChooseDownloadModalVisible(false)}></CloseOutlined>
                    </Content>
                    <Content className='my-2'>
                        <Content className='mt-3 flex gap-3'>
                            <Card onClick={() => downloadCSV()} className='w-[147px] cursor-pointer'>
                                <Content className='flex flex-col items-center'>
                                    <img alt='table icon mb-2' src={tableIcon} />
                                    <p>{t('labels:csv_format')}</p>
                                </Content>
                            </Card>
                            <Card onClick={() => downloadZIP()} className='w-[147px]  cursor-pointer'>
                                <Content className='flex flex-col items-center'>
                                    <img src={codeJsonIcon} alt='json icon mb-2' />
                                    <p>{t('labels:json_format')}</p>
                                </Content>
                            </Card>
                        </Content>
                    </Content>
                </Spin>
            </StoreModal>
        </Content>
    )
}

export default LanguageDocUpload
