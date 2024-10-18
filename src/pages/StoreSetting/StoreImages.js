import React, { useState, useEffect } from 'react'
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
import CustomImageUpload from '../../components/UploadImageLayout/CustomImageUpload'
import { MdRemoveRedEye } from 'react-icons/md'
import { Alert, AlertDescription } from '../../shadcnComponents/ui/alert'
const storeDeleteImagesAPI = process.env.REACT_APP_STORE_DELETE_IMAGES_API
const baseURL = process.env.REACT_APP_BASE_URL
const BannerImagesUploadLength = process.env.REACT_APP_BANNER_IMAGES_MAX_LENGTH

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
    const [previewModalOpen, setPreviewModalOpen] = useState(false)
    const [previewUrl, setPreviewUrl] = useState('')
    var selectedImageArrayOfObject = []

    const handleChange = (e) => {
        const files = Array.from(e.target.files)
        console.log('firstttt', files)
        const validImages = files.filter((file) => file.type.startsWith('image/'))

        if (validImages.length > 0) {
            // Map through valid images and assign a unique `uid`
            const newFilesWithUid = validImages.map((file) => {
                // Create a new object with the original properties and add the uid
                return {
                    uid: `${file.name}-${Date.now()}`,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    lastModified: file.lastModified,
                    lastModifiedDate: file.lastModifiedDate,
                    originFileObj: file,
                    // Add any other properties you need
                }
            })
            // Generate preview URLs using the original validImages array
            const newPreviews = validImages.map((file) => {
                return URL.createObjectURL(file)
            })

            // Update state with new files and previews
            setFileList((prevFiles) => [...prevFiles, ...newFilesWithUid])
            setPreviewImage((prevPreviews) => [...prevPreviews, ...newPreviews])
        } else {
            console.error('No valid image files selected')
        }
        if (type === 'store_logo') {
            if (e.target.files.length === 0) {
                let temp = imagesUpload.filter((e) => e.type !== 'store_logo')
                setImagesUpload(temp)
            } else {
                let copyImageData = [...imagesUpload]
                copyImageData.push({ type: 'store_logo', imageValue: e.target.files[0] })
                setImagesUpload(copyImageData)
            }
        }
        if (type === 'banner_images') {
            setBannerImagesLength(parseInt(allImageUrl?.length) + parseInt(e.target.files?.length))
            files.forEach((obj) => {
                selectedImageArrayOfObject.push(obj)
            })

            console.log('selectedImageArrayOfObject', selectedImageArrayOfObject)
            let sampleBannerImagesLength = parseInt(allImageUrl?.length) + parseInt(e.target.files?.length)

            if (e.target.files.length === 0) {
                let temp = imagesUpload.filter((e) => e.type !== 'banner_images')
                setImagesUpload(temp)
            } else {
                let totalSelectLength = e.target.files.length
                if (sampleBannerImagesLength > parseInt(BannerImagesUploadLength)) {
                    let imagesUploadLength = sampleBannerImagesLength - parseInt(BannerImagesUploadLength)
                    let imagesSelect = sampleBannerImagesLength - imagesUploadLength
                    totalSelectLength = imagesSelect - allImageUrl.length
                    files.splice(totalSelectLength) // Limit the fileList to eight files
                }
                let copyImageData = [...imagesUpload]
                selectedImageArrayOfObject.splice(totalSelectLength)
                let index = copyImageData.findIndex((item) => item.type === 'banner_images')
                console.log('index', index)
                if (index === -1) {
                    if (e.target.files.length === 0) {
                        copyImageData.push({
                            type: 'banner_images',
                            imageValue: [e.target.files],
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
                    if (e.target.files[0].status === 'removed') {
                        let filteredDuplicateValues = duplicateValues.filter((ele) => ele.uid !== e.target.files[0].uid)
                        bannerImagesData['imageValue'] = filteredDuplicateValues
                    } else {
                        duplicateValues.push(e.target.files[0])
                        bannerImagesData['imageValue'] = duplicateValues
                    }
                    copyImageData[index] = bannerImagesData
                }
                setImagesUpload(copyImageData)
            }
        }
    }
    useEffect(() => {
        if (getImageData && getImageData !== undefined) {
            if (type === 'store_logo') {
                let temp = getImageData && getImageData.store_logo_path
                if (temp !== '' && temp !== null && temp !== undefined) {
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
            for (let i = 0; i < bannerAbsoluteImage.length; i++) {
                if (type === 'banner_images') {
                    temp.push(baseURL + bannerAbsoluteImage[i].image_fullpath)
                }
            }
            setAllImageUrl(temp)
            setImagePathShow(temp)
        }
    }, [bannerAbsoluteImage])

    const handleCancel = () => setPreviewOpen(false)

    const handlePreview = (file) => {
        console.log('filessssss', file)
        const originalFile = file.originFileObj // Access the original File object if it exists

        if (originalFile) {
            const previewUrl = URL.createObjectURL(originalFile) // Create preview for clicked image
            setPreviewModalOpen(true)
            setPreviewUrl(previewUrl)
        } else {
            console.error('No valid file object available for preview')
        }
    }

    const handlePreviewForImage = (url) => {
        setPreviewModalOpen(true)
        setPreviewUrl(url) // Set the preview URL directly
    }

    const onRemove = (index) => {
        // Ensure the file list exists and is not empty
        if (fileList && fileList.length > 0) {
            const removedFile = fileList[index]

            // Step 1: Remove from fileList by matching the `uid`
            const updatedFileList = fileList.filter((file) => file.uid !== removedFile.uid)
            setFileList(updatedFileList)

            // Step 2: Remove from preview images using the same index
            const updatedPreviewImage = previewImage.filter((_, i) => i !== index)
            setPreviewImage(updatedPreviewImage)

            // Step 3: Optionally, remove from any other related state (e.g., imagesUpload)
            const updatedImagesUpload = imagesUpload.filter((img) => img.imageValue.uid !== removedFile.uid)
            setImagesUpload(updatedImagesUpload)
        }
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

    const handlePreviewCancel = () => {
        setPreviewModalOpen(false)
    }

    useEffect(() => {
        if (imagesUpload && imagesUpload.length === 0) {
            setFileList([])
        }
    }, [imagesUpload])

    useEffect(() => {
        setBannerImagesLength(bannerAbsoluteImage && bannerAbsoluteImage.length)
    }, [bannerAbsoluteImage])

    console.log('bannerImagesLength', fileList.length)
    return (
        <div className=' mb-2'>
            <div className='flex !mb-3 gap-1'>
                <div className='font-semibold  text-base mb-1 mt-2 text-brandGray1'>{title}</div>
            </div>
            {imagePathShow === undefined ? (
                <div>
                    {isSingleUpload && isSingleUpload === true ? (
                        <div className='flex !gap-4 mb-2'>
                            <div>
                                <CustomImageUpload
                                    selectedFile={fileList}
                                    preview={previewImage}
                                    onFileSelect={handleChange}
                                    disabled={disabelMediaButton}
                                    multiple={false}
                                    handlePreview={handlePreview}
                                    onRemove={onRemove}
                                    maxImages={1}
                                />
                            </div>
                            <div className='mt-3 text-[#a8a8a8] mr-4'>
                                <ul
                                    className={`list-disc ${util.getSelectedLanguageCode()?.toUpperCase() === 'RTL' ? '!pr-4' : '!ml-4'}`}>
                                    <li className='!mb-0 '>{t('messages:store_logo_info')}</li>
                                    <li>{t('messages:store_logo_resolution')}</li>
                                    <li className='!mb-0 '>{t('messages:upload_image_content')}</li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div>
                                <CustomImageUpload
                                    selectedFile={fileList}
                                    preview={previewImage}
                                    onFileSelect={(e) => {
                                        handleChange(e)
                                    }}
                                    multiple={true}
                                    handlePreview={handlePreview}
                                    disabled={disabelMediaButton}
                                    onRemove={onRemove}
                                    maxImages={BannerImagesUploadLength}
                                    bannerImagesLength={allImageUrl}
                                />
                            </div>
                            <div className='mt-6'>
                                <Alert className='my-4 px-4 !w-full bg-[#E6F7FF] border border-[#1677ff]'>
                                    <div className='flex items-center gap-1'>
                                        <MdInfo className='font-bold !text-center' color='#1677ff' size={20} />
                                        <span className='font-medium text-regal-blue'>
                                            {t('messages:image_requirements')}
                                        </span>
                                    </div>
                                    <AlertDescription>
                                        <ul
                                            className={`list-disc text-brandGray1 ${util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? '!mr-[32px]' : '!ml-[32px]'}`}>
                                            <li className='mb-0'>{t('messages:banner_logo_info')}</li>
                                            <li className='mb-0'>{t('messages:banner_logo_resolution')}</li>
                                            <li className='!mb-0'>{t('messages:upload_image_content')}</li>
                                            <li className='!mb-2'>
                                                {t('messages:please_ensure_that_upload_only_eight_images', {
                                                    BannerImagesUploadLength,
                                                })}
                                            </li>
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <>
                    <div className=' flex !space-x-4 !w-full'>
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
                                        <img
                                            src={ele}
                                            alt='ele'
                                            className='!w-[140px] !h-[102px] hover:bg-brandGray'
                                            // preview={{ mask: t('labels:preview') }}
                                        />

                                        <div className='absolute inset-0 flex justify-center items-center'>
                                            <button
                                                type='button'
                                                className='p-1 bg-brandGray1 text-white rounded-full hover:bg-gray-600'
                                                onClick={() => handlePreviewForImage(ele)}>
                                                <MdRemoveRedEye />
                                            </button>
                                        </div>

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
                            <CustomImageUpload
                                selectedFile={fileList}
                                preview={previewImage}
                                onFileSelect={(e) => {
                                    handleChange(e)
                                }}
                                multiple={true}
                                handlePreview={handlePreview}
                                disabled={disabelMediaButton}
                                onRemove={onRemove}
                                maxImages={BannerImagesUploadLength}
                                bannerImagesLength={allImageUrl}
                            />
                        )}
                    </div>
                    <div className='!mt-4'>
                        {type === 'banner_images' ? (
                            <>
                                <div className='mt-2'>
                                    <Alert className='my-4 px-4 !w-full bg-[#E6F7FF] border border-[#1677ff]'>
                                        <div className='flex items-center gap-1'>
                                            <MdInfo className='font-bold !text-center' color='#1677ff' size={20} />
                                            <span className='font-medium text-regal-blue'>
                                                {t('messages:image_requirements')}
                                            </span>
                                        </div>
                                        <AlertDescription>
                                            <ul
                                                className={`list-disc text-brandGray1 ${util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? '!mr-[32px]' : '!ml-[32px]'}`}>
                                                <li className='mb-0'>{t('messages:banner_logo_info')}</li>
                                                <li className='mb-0'>{t('messages:banner_logo_resolution')}</li>
                                                <li className='!mb-0'>{t('messages:upload_image_content')}</li>
                                                <li className='!mb-2'>
                                                    {t('messages:please_ensure_that_upload_only_eight_images', {
                                                        BannerImagesUploadLength,
                                                    })}
                                                </li>
                                            </ul>
                                        </AlertDescription>
                                    </Alert>
                                </div>
                                <StoreModal isVisible={previewOpen} onCancel={handleCancel}>
                                    <img
                                        alt='previewImage'
                                        style={{
                                            width: '100%',
                                        }}
                                        src={previewImage}
                                    />
                                </StoreModal>
                            </>
                        ) : null}
                    </div>
                </>
            )}
            <StoreModal
                isVisible={isDeleteImageModalOpen}
                okButtonText={t('labels:yes')}
                cancelButtonText={t('labels:cancel')}
                title={
                    <div className='text-regal-blue font-bold text-[18px] leading-[26px]'>
                        {t('labels:delete_image')}
                    </div>
                }
                okCallback={() => removeMedia()}
                cancelCallback={() => closeDeleteModal()}
                isSpin={isImageDeleting}
                hideCloseButton={false}>
                {
                    <div className='text-brandGray1'>
                        <p>{t('messages:delete_confirmation_message')}</p>
                    </div>
                }
            </StoreModal>
            <StoreModal
                isVisible={previewModalOpen}
                okButtonText={''}
                cancelButtonText={''}
                hideCloseButton={true}
                cancelCallback={handlePreviewCancel}>
                <div className='flex justify-center'>
                    <img src={previewUrl} alt='previewUrl' />
                </div>
            </StoreModal>
        </div>
    )
}

export default StoreImages
