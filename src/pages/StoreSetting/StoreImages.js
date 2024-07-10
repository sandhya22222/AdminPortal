import React, { useState, useEffect } from 'react'
import { Typography, Upload, Layout, Modal, Button, Tooltip, Image, Alert } from 'antd'
import { PlusOutlined, UploadOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { fnAbsoluteStoreImageInfo } from '../../services/redux/actions/ActionStoreImages'
import { useTranslation } from 'react-i18next'
import { MdInfo } from 'react-icons/md'
import StoreModal from '../../components/storeModal/StoreModal'
import { TiDelete } from 'react-icons/ti'
import MarketplaceServices from '../../services/axios/MarketplaceServices'
import './StoreImages.css'
import MarketplaceToaster from '../../util/marketplaceToaster'
import util from '../../util/common'
const { Title } = Typography
const { Content } = Layout

const storeDeleteImagesAPI = process.env.REACT_APP_STORE_DELETE_IMAGES_API
const baseURL = process.env.REACT_APP_BASE_URL
const BannerImagesUploadLength = process.env.REACT_APP_BANNER_IMAGES_MAX_LENGTH
const supportedFileExtensions = process.env.REACT_APP_IMAGES_EXTENSIONS

const StoreImages = ({
    title,
    type,
    storeId,
    imagesUpload,
    setImagesUpload,
    isSingleUpload,
    getImageData,
    bannerAbsoluteImage,
    disabelMediaButton,
}) => {
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const absoluteStoreImageInfo = useSelector((state) => state.reducerAbsoluteStoreImageInfo.absoluteStoreImageInfo)

    const [fileList, setFileList] = useState([])
    const [previewOpen, setPreviewOpen] = useState(false)
    const [previewImage, setPreviewImage] = useState('')
    const [previewTitle, setPreviewTitle] = useState('')
    const [imagePathShow, setImagePathShow] = useState()
    const [allImageUrl, setAllImageUrl] = useState([])
    const [imageIndex, setImageIndex] = useState()
    const [imageElement, setImageElement] = useState()
    const [isImageDeleting, setIsImageDeleting] = useState(false)
    const [isDeleteImageModalOpen, setIsDeleteImageModalOpen] = useState(false)
    const [bannerImagesLength, setBannerImagesLength] = useState(0)
    var selectedImageArrayOfObject = []
    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}>
                {t('labels:upload')}
            </div>
        </div>
    )

    const handleChange = (e) => {
        setFileList(e.fileList)
        if (type === 'store_logo') {
            if (e.fileList.length === 0) {
                let temp = imagesUpload.filter((e) => e.type !== 'store_logo')
                setImagesUpload(temp)
            } else {
                let copyImageData = [...imagesUpload]
                copyImageData.push({ type: 'store_logo', imageValue: e.file })
                setImagesUpload(copyImageData)
            }
        }
        if (type === 'banner_images') {
            setBannerImagesLength(
                parseInt(allImageUrl && allImageUrl.length) + parseInt(e && e.fileList && e.fileList.length)
            )
            selectedImageArrayOfObject.push(e.file)
            var sampleBannerImagesLength =
                parseInt(allImageUrl && allImageUrl.length) + parseInt(e && e.fileList && e.fileList.length)

            if (e.fileList.length === 0) {
                let temp = imagesUpload.filter((e) => e.type !== 'banner_images')
                setImagesUpload(temp)
            } else {
                let totalSelectLength = e.fileList.length
                if (sampleBannerImagesLength > BannerImagesUploadLength) {
                    let imagesUploadLength = sampleBannerImagesLength - BannerImagesUploadLength
                    let imagesSelect = sampleBannerImagesLength - imagesUploadLength
                    totalSelectLength = imagesSelect - allImageUrl.length
                    e.fileList.splice(totalSelectLength) // Limit the fileList to eight files
                }
                let copyImageData = [...imagesUpload]
                selectedImageArrayOfObject.splice(totalSelectLength)
                let index = copyImageData.findIndex((item) => item.type === 'banner_images')
                console.log('index', index)
                if (index === -1) {
                    if (e.fileList.length === 0) {
                        copyImageData.push({
                            type: 'banner_images',
                            imageValue: [e.file],
                        })
                    } else {
                        copyImageData.push({
                            type: 'banner_images',
                            imageValue: selectedImageArrayOfObject,
                        })
                    }
                } else {
                    let bannerImagesData = copyImageData[index]
                    let duplicateValues = [...bannerImagesData.imageValue]
                    if (e.file.status === 'removed') {
                        let filteredDuplicateValues = duplicateValues.filter((ele) => ele.uid !== e.file.uid)
                        bannerImagesData['imageValue'] = filteredDuplicateValues
                    } else {
                        duplicateValues.push(e.file)
                        bannerImagesData['imageValue'] = duplicateValues
                    }
                    copyImageData[index] = bannerImagesData
                    console.log('bannerImagesData', bannerImagesData)
                }
                console.log('copyImageData', copyImageData)
                setImagesUpload(copyImageData)
            }
        }
        if (type === 'search_logo') {
            if (e.fileList.length == 0) {
                let temp = imagesUpload.filter((e) => e.type !== 'search_logo')
                setImagesUpload(temp)
            } else {
                let copyImageData = [...imagesUpload]
                copyImageData.push({ type: 'search_logo', imageValue: e.file })
                setImagesUpload(copyImageData)
            }
        }
        if (type === 'customer_logo') {
            if (e.fileList.length == 0) {
                let temp = imagesUpload.filter((e) => e.type !== 'customer_logo')
                setImagesUpload(temp)
            } else {
                let copyImageData = [...imagesUpload]
                copyImageData.push({ type: 'customer_logo', imageValue: e.file })
                setImagesUpload(copyImageData)
            }
        }
        if (type === 'cart_logo') {
            if (e.fileList.length == 0) {
                let temp = imagesUpload.filter((e) => e.type !== 'cart_logo')
                setImagesUpload(temp)
            } else {
                let copyImageData = [...imagesUpload]
                copyImageData.push({ type: 'cart_logo', imageValue: e.file })
                setImagesUpload(copyImageData)
            }
        }
        if (type === 'wishlist_logo') {
            if (e.fileList.length == 0) {
                let temp = imagesUpload.filter((e) => e.type !== 'wishlist_logo')
                setImagesUpload(temp)
            } else {
                let copyImageData = [...imagesUpload]
                copyImageData.push({ type: 'wishlist_logo', imageValue: e.file })
                setImagesUpload(copyImageData)
            }
        }
    }
    console.log('getImageData', getImageData)
    useEffect(() => {
        if (getImageData && getImageData !== undefined) {
            if (type === 'store_logo') {
                let temp = getImageData && getImageData.store_logo_path
                console.log('temp', temp)
                if (temp !== '' && temp !== null && temp !== undefined) {
                    findAllWithoutPageStoreAbsoluteImagesApi(temp)
                } else {
                    setImagePathShow()
                }
            }
            if (type === 'banner_images') {
            }
            if (type === 'customer_logo') {
                let temp = getImageData && getImageData.customer_logo_path
                if (temp !== null) {
                    findAllWithoutPageStoreAbsoluteImagesApi(temp)
                } else {
                    setImagePathShow()
                }
            }
            if (type === 'cart_logo') {
                let temp = getImageData && getImageData.cart_logo_path
                if (temp !== null) {
                    findAllWithoutPageStoreAbsoluteImagesApi(temp)
                } else {
                    setImagePathShow()
                }
            }
            if (type === 'search_logo') {
                let temp = getImageData && getImageData.search_logo_path
                if (temp !== null) {
                    findAllWithoutPageStoreAbsoluteImagesApi(temp)
                } else {
                    setImagePathShow()
                }
            }
            if (type === 'wishlist_logo') {
                let temp = getImageData && getImageData.wishlist_logo_path
                if (temp !== null) {
                    findAllWithoutPageStoreAbsoluteImagesApi(temp)
                } else {
                    setImagePathShow()
                }
            }
        }
        selectedImageArrayOfObject = []
    }, [getImageData])

    useEffect(() => {
        setImagePathShow()
    }, [])

    useEffect(() => {
        if (bannerAbsoluteImage && bannerAbsoluteImage.length > 0) {
            let temp = []
            for (var i = 0; i < bannerAbsoluteImage.length; i++) {
                if (type === 'banner_images') {
                    temp.push(baseURL + bannerAbsoluteImage[i].image_fullpath)
                }
            }
            setAllImageUrl(temp)
            setImagePathShow(temp)
        }
    }, [bannerAbsoluteImage])

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result)
            reader.onerror = (error) => reject(error)
        })

    const handleCancel = () => setPreviewOpen(false)

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj)
        }
        setPreviewImage(file.url || file.preview)
        setPreviewOpen(true)
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
    }

    const findAllWithoutPageStoreAbsoluteImagesApi = (imagePath) => {
        let url = baseURL + imagePath
        let temp = []
        temp.push(url)
        console.log('temp', temp)
        setAllImageUrl(temp)
        if (absoluteStoreImageInfo && absoluteStoreImageInfo.length > 0) {
            let imageData = [...absoluteStoreImageInfo]
            let imageType = { type: type, value: url }
            imageData.push(imageType)
            dispatch(fnAbsoluteStoreImageInfo(ImageData))
        } else {
            let imageType = { type: type, value: url }
            dispatch(fnAbsoluteStoreImageInfo(imageType))
        }
        setImagePathShow(url)
    }

    console.log('allImageUrl', allImageUrl)

    // closing the delete popup model
    const closeDeleteModal = () => {
        setIsDeleteImageModalOpen(false)
    }

    //!delete function of language
    const removeMedia = (index) => {
        setIsImageDeleting(true)
        console.log('index', index)
        let dataObject = {}
        dataObject['store_id'] = storeId
        dataObject['image-type'] = type
        if (type === 'banner_images') {
            let temp = bannerAbsoluteImage[imageIndex]
            dataObject['image-path'] = temp.path
        } else {
            dataObject['image-path'] = getImageData[type]
        }
        MarketplaceServices.remove(storeDeleteImagesAPI, dataObject)
            .then((response) => {
                console.log('response from delete===>', response)
                MarketplaceToaster.showToast(response)
                if (type === 'banner_images') {
                    //remove from setBannerAbsoluteImage
                    bannerAbsoluteImage.splice(imageIndex, 1)

                    setBannerImagesLength(bannerImagesLength - 1)

                    let temp = allImageUrl.filter((item) => item !== imageElement)
                    if (temp && temp.length > 0) {
                        setAllImageUrl(temp)
                    } else {
                        setAllImageUrl([])
                        setImagePathShow()
                    }
                } else {
                    setImagePathShow()
                }
                setIsDeleteImageModalOpen(false)
                // disabling spinner
                setIsImageDeleting(false)
            })
            .catch((error) => {
                // disabling spinner
                setIsImageDeleting(false)
                MarketplaceToaster.showToast(error.response)
            })
    }

    useEffect(() => {
        if (imagesUpload && imagesUpload.length === 0) {
            setFileList([])
        }
    }, [imagesUpload])

    useEffect(() => {
        setBannerImagesLength(bannerAbsoluteImage && bannerAbsoluteImage.length)
    }, [bannerAbsoluteImage])

    return (
        <Content className=' mb-2'>
            <Content className='flex !mb-3 gap-1'>
                <div className='font-semibold  text-base mb-1 mt-2 text-brandGray1'>{title}</div>
            </Content>
            {imagePathShow === undefined ? (
                <Content>
                    {isSingleUpload && isSingleUpload === true ? (
                        <Content className='flex gap-4 mb-2'>
                            <div>
                                <Upload
                                    className={
                                        'hover:border-[var(--mp-primary-border-color)] hover:text-[var(--mp-brand-color-h)]'
                                    }
                                    listType='picture-card'
                                    fileList={fileList}
                                    name='file'
                                    onPreview={handlePreview}
                                    onChange={(e) => {
                                        handleChange(e)
                                    }}
                                    beforeUpload={() => {
                                        return false
                                    }}
                                    afterUpload={() => {
                                        return false
                                    }}
                                    accept={supportedFileExtensions}
                                    disabled={disabelMediaButton}>
                                    {fileList.length >= 1 ? null : uploadButton}
                                </Upload>
                            </div>
                            <div className='mt-4 text-[#a8a8a8]'>
                                <ul className='list-disc '>
                                    <li className='!mb-0 '>{t('messages:store_logo_info')}</li>
                                    <li>{t('messages:store_logo_resolution')}</li>
                                    <li className='!mb-0 '>{t('messages:upload_image_content')}</li>
                                </ul>
                            </div>
                        </Content>
                    ) : (
                        <>
                            <Upload
                                maxCount={BannerImagesUploadLength}
                                listType='picture-card'
                                multiple={true}
                                className={
                                    'hover:border-[var(--mp-primary-border-color)] hover:text-[var(--mp-brand-color-h)]'
                                }
                                beforeUpload={() => {
                                    return false
                                }}
                                afterUpload={() => {
                                    return false
                                }}
                                fileList={fileList}
                                onPreview={handlePreview}
                                accept={supportedFileExtensions}
                                onChange={(e) => {
                                    handleChange(e)
                                }}
                                openFileDialogOnClick={bannerImagesLength < BannerImagesUploadLength ? true : false}
                                disabled={disabelMediaButton}>
                                {bannerImagesLength < BannerImagesUploadLength ? uploadButton : null}
                            </Upload>
                            <div className='mt-3'>
                                <Alert
                                    icon={<MdInfo className='font-bold !text-center' />}
                                    message={t('messages:image_requirements')}
                                    description={
                                        <div>
                                            <ul className='list-disc pl-[17px]'>
                                                <li className='mb-0'>{t('messages:banner_logo_info')}</li>
                                                <li className='mb-0'>{t('messages:banner_logo_resolution')}</li>
                                                <li className='!mb-0 '>{t('messages:upload_image_content')}</li>
                                                <li className='!mb-2'>
                                                    {t('messages:please_ensure_that_upload_only_eight_images', {
                                                        BannerImagesUploadLength,
                                                    })}
                                                </li>
                                            </ul>
                                        </div>
                                    }
                                    type='info'
                                    showIcon
                                />
                            </div>
                        </>
                    )}
                    <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                        <img
                            alt='previewImage'
                            style={{
                                width: '100%',
                            }}
                            src={previewImage}
                        />
                    </Modal>
                </Content>
            ) : (
                <>
                    <Content className=' flex !space-x-4 !w-full'>
                        {allImageUrl &&
                            allImageUrl.length > 0 &&
                            allImageUrl.map((ele, index) => {
                                return (
                                    <div
                                        className={
                                            util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL'
                                                ? '!relative !ml-6'
                                                : '!relative '
                                        }>
                                        <Image src={ele} className='!w-[140px] !h-[102px] ' />
                                        <TiDelete
                                            className='!absolute !cursor-pointer !right-[-5px] !z-5  !top-[-10px] !text-2xl !text-red-600 !shadow-lg  hover:translate-'
                                            onClick={() => {
                                                setIsDeleteImageModalOpen(true)
                                                setImageIndex(index)
                                                setImageElement(ele)
                                            }}
                                        />
                                    </div>
                                )
                            })}
                        {type === 'banner_images' && (
                            <Upload
                                maxCount={BannerImagesUploadLength}
                                multiple={true}
                                className={
                                    'hover:border-[var(--mp-primary-border-color)] hover:text-[var(--mp-brand-color-h)]'
                                }
                                listType='picture-card'
                                onPreview={handlePreview}
                                beforeUpload={() => {
                                    return false
                                }}
                                afterUpload={() => {
                                    return false
                                }}
                                fileList={fileList}
                                accept={supportedFileExtensions}
                                onChange={(e) => {
                                    handleChange(e)
                                }}
                                openFileDialogOnClick={bannerImagesLength < BannerImagesUploadLength ? true : false}
                                disabled={disabelMediaButton}>
                                {bannerImagesLength < BannerImagesUploadLength ? uploadButton : null}
                            </Upload>
                        )}
                    </Content>
                    <Content className='!mt-4'>
                        {type === 'banner_images' ? (
                            <>
                                <div className='mt-2'>
                                    <Alert
                                        icon={<MdInfo className='font-bold !text-center' />}
                                        message={t('messages:image_requirements')}
                                        description={
                                            <div>
                                                <ul className='list-disc pl-[17px]'>
                                                    <li className='mb-0'>{t('messages:banner_logo_info')}</li>
                                                    <li className='mb-0'>{t('messages:banner_logo_resolution')}</li>
                                                    <li className='!mb-0 '>{t('messages:upload_image_content')}</li>
                                                    <li className='!mb-2'>
                                                        {t('messages:please_ensure_that_upload_only_eight_images', {
                                                            BannerImagesUploadLength,
                                                        })}
                                                    </li>
                                                </ul>
                                            </div>
                                        }
                                        type='info'
                                        showIcon
                                    />
                                </div>
                                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                                    <img
                                        alt='previewImage'
                                        style={{
                                            width: '100%',
                                        }}
                                        src={previewImage}
                                    />
                                </Modal>
                            </>
                        ) : null}
                    </Content>
                </>
            )}
            <StoreModal
                isVisible={isDeleteImageModalOpen}
                okButtonText={t('labels:yes')}
                cancelButtonText={t('labels:cancel')}
                title={
                    <div className='text-regal-blue font-bold text-[18px] leading-[26px]'>{t('labels:warning')}</div>
                }
                okCallback={() => removeMedia()}
                cancelCallback={() => closeDeleteModal()}
                isSpin={isImageDeleting}
                hideCloseButton={false}>
                {
                    <div className='text-brandGray1'>
                        <p className='!mb-0'>{t('messages:confirm_image_deletion')}</p>
                        <p>{t('messages:delete_confirmation_message')}</p>
                    </div>
                }
            </StoreModal>
        </Content>
    )
}

export default StoreImages
