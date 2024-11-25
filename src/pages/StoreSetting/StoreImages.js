import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fnAbsoluteStoreImageInfo } from '../../services/redux/actions/ActionStoreImages'
import { useTranslation } from 'react-i18next'
import { MdInfo } from 'react-icons/md'
import StoreModal from '../../components/storeModal/StoreModal'
import { TiDelete } from 'react-icons/ti'
import MarketplaceServices from '../../services/axios/MarketplaceServices'
import MarketplaceToaster from '../../util/marketplaceToaster'
import util from '../../util/common'
import API_ENDPOINTS from '../../services/API/apis'

import CustomImageUpload from '../../components/UploadImageLayout/CustomImageUpload'
import { MdRemoveRedEye } from 'react-icons/md'
import { Alert, AlertDescription } from '../../shadcnComponents/ui/alert'
const storeDeleteImagesAPI = API_ENDPOINTS.REACT_APP_STORE_DELETE_IMAGES_API
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
    const [removedFile, setRemovedFile] = useState()
    const [isHovered, setIsHovered] = useState(false)

    var selectedImageArrayOfObject = []

    const handleChange = (e) => {
        let files = Array.from(e.target.files) // Get the selected files as an array
        const validImages = files.filter((file) => file.type.startsWith('image/')) // Filter only images
        console.log('e.target.value', e.target.files)
        // Declare variables outside the if block
        let alreadyUploadedCount = allImageUrl?.length || 0
        let selectedImagesCount = validImages.length
        let totalBannerImagesCount = alreadyUploadedCount + selectedImagesCount
        let remainingSlots = 8 - alreadyUploadedCount // Calculate remaining slots
        if (validImages.length > 0) {
            // Restrict validImages to the available slots
            if (totalBannerImagesCount > 8) {
                validImages.splice(remainingSlots) // Keep only the allowed number of images
            }

            const newFilesWithUid = validImages.map((file) => ({
                uid: `${file.name}-${Date.now()}`,
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified,
                lastModifiedDate: file.lastModifiedDate,
                originFileObj: file,
                status: 'uploading', // Set initial status
            }))

            const newPreviews = validImages.map((file) => URL.createObjectURL(file))

            // Update the state with the new files and previews
            setFileList((prevFiles) => [...prevFiles, ...newFilesWithUid])
            setPreviewImage((prevPreviews) => [...prevPreviews, ...newPreviews])
        } else {
            console.error('No valid image files selected.')
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
            setBannerImagesLength(alreadyUploadedCount + validImages.length)

            // Add the valid images to `selectedImageArrayOfObject`
            validImages.forEach((file) => {
                selectedImageArrayOfObject.push(file)
            })
            if (e.target.files.length === 0) {
                let temp = imagesUpload.filter((e) => e.type !== 'banner_images')
                setImagesUpload(temp)
            } else {
                // If the total number of images exceeds the upload limit (8)
                let remainingSlots = 8 - alreadyUploadedCount

                // Restrict the selection to remaining available slots
                if (totalBannerImagesCount > 8) {
                    validImages.splice(remainingSlots)
                }

                // Limit `selectedImageArrayOfObject` based on available slots
                selectedImageArrayOfObject.splice(remainingSlots)

                let copyImageData = [...imagesUpload]
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
                    if (removedFile !== undefined && removedFile.status === 'removed') {
                        let filteredDuplicateValues = duplicateValues.filter(
                            (ele) => ele.name !== e.target.files[0].name
                        )
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

    const handleCancel = () => setPreviewOpen(false)

    const handlePreview = (file) => {
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
        if (fileList && fileList.length > 0) {
            const removedFile = fileList[index]

            // Step 1: Set status to 'removed' for the file being removed
            removedFile.status = 'removed'

            // Step 2: Filter out the removed file from the file list and preview image
            const updatedFileList = fileList.filter((file) => file.uid !== removedFile.uid)
            setFileList(updatedFileList)
            setRemovedFile(removedFile)
            const updatedPreviewImage = previewImage.filter((_, i) => i !== index)
            setPreviewImage(updatedPreviewImage)

            // Step 3: Update imagesUpload to remove the file from banner_images
            let updatedImagesUpload = imagesUpload.map((img) => {
                if (img.type === 'banner_images') {
                    img.imageValue = img.imageValue.filter((image) => image.name !== removedFile.name)
                }
                return img
            })

            // Step 4: Check if all imageValues are empty, and clear imagesUpload if so
            const hasImages = updatedImagesUpload.some((img) => img.imageValue.length > 0)

            if (!hasImages) {
                // If no images left in imageValue, clear imagesUpload state
                setImagesUpload([])
            } else {
                // Otherwise, set the updated imagesUpload state
                setImagesUpload(updatedImagesUpload)
            }
        }
    }

    const findAllWithoutPageStoreAbsoluteImagesApi = (imagePath) => {
        let url = baseURL + imagePath
        let temp = []
        temp.push(url)
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

    useEffect(() => {
        if (imagesUpload && imagesUpload.length === 0) {
            setFileList([])
        }
    }, [imagesUpload])

    useEffect(() => {
        setBannerImagesLength(bannerAbsoluteImage && bannerAbsoluteImage.length)
    }, [bannerAbsoluteImage])

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
                    <div className=' flex flex-wrap gap-x-4 gap-y-4 !w-full max-w-full'>
                        {allImageUrl &&
                            allImageUrl.length > 0 &&
                            allImageUrl.map((ele, index) => {
                                return (
                                    <div
                                        onMouseEnter={() => setIsHovered(true)}
                                        onMouseLeave={() => setIsHovered(false)}
                                        className={`
                                            ${
                                                util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL'
                                                    ? '!relative !ml-6'
                                                    : '!relative'
                                            }
                                             
                                        `}>
                                        <img
                                            src={ele}
                                            alt='ele'
                                            width={140}
                                            style={{ maxWidth: 140 }}
                                            className={`!h-[94px]`}
                                            // preview={{ mask: t('labels:preview') }}
                                        />

                                        <div className={`absolute top-9  flex justify-center items-center right-16`}>
                                            <button
                                                type='button'
                                                className={`transition-opacity duration-200 ${isHovered ? 'opacity-100 text-brandPrimaryColor' : 'opacity-0'} `}
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
                        <div>
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
