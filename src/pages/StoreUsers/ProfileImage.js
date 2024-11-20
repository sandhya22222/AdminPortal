import { MdOutlineFileUpload, MdRemoveRedEye, MdClose } from 'react-icons/md'
import Spin from '../../shadcnComponents/customComponents/Spin'
import React, { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { profileFallBackImage } from '../../constants/media'
import MarketplaceToaster from '../../util/marketplaceToaster'
import useDeleteProfileImage from './hooks/useDeleteProfileImage'
import useGetProfileImage from './hooks/useGetProfileImage'
import useUploadProfileImage from './hooks/useUploadProfileImage'
import { Button } from '../../shadcnComponents/ui/button'
import StoreModal from '../../components/storeModal/StoreModal'
import './UserProfile.css'
import util from '../../util/common'

const supportedFileExtensions = process.env.REACT_APP_IMAGES_EXTENSIONS
const supportedFileTypes = ['image/png', 'image/jpeg']
const MAX_FILE_SIZE_MB = 2

const ProfileImage = ({ imagePath, refetchUserData }) => {
    const { t } = useTranslation()
    const fileInputRef = useRef(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [fileError, setFileError] = useState(null)
    const [isImageModalVisible, setIsImageModalVisible] = useState(false)
    const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    const {
        data: profileImage,
        status: profileImageStatus,
        refetch: refetchProfileImage,
        isFetching: isProfileImageFetching,
    } = useGetProfileImage(imagePath)
    const { mutate: uploadImageMutation, status: uploadImageStatus, reset: resetUploadImage } = useUploadProfileImage()
    const { mutate: deleteImageMutation, status: deleteImageStatus } = useDeleteProfileImage()

    const resetFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleCloseImageModal = () => {
        resetUploadImage()
        setIsImageModalVisible(false)
        setFileError(null)
        setSelectedFile(null)
        resetFileInput()
    }

    const bytesToMegabytes = (bytes) => {
        return bytes / 1048576
    }

    const validateFile = (file) => {
        if (!file) {
            setFileError(t('messages:please_select_file'))
            return false
        }

        if (!supportedFileTypes.includes(file.type)) {
            setFileError(t('messages:upload_valid_image'))
            resetFileInput()
            return false
        }

        if (bytesToMegabytes(file.size) > MAX_FILE_SIZE_MB) {
            setFileError(t('messages:image_size_error'))
            resetFileInput()
            return false
        }

        return true
    }

    const handleFileSelect = (event) => {
        const file = event.target.files[0]
        setFileError(null)

        if (validateFile(file)) {
            setSelectedFile(file)
        } else {
            setSelectedFile(null)
        }
    }

    const handleUploadClick = () => {
        resetFileInput()
        fileInputRef.current?.click()
    }

    const handleImageUpload = () => {
        if (!selectedFile) return

        const imageFormData = new FormData()
        imageFormData.append('profile_image', selectedFile)

        uploadImageMutation(
            { data: imageFormData, imagePath: imagePath },
            {
                onSuccess: (response) => {
                    refetchProfileImage()
                    refetchUserData()
                    MarketplaceToaster.showToast(response)
                    handleCloseImageModal()
                },
                onError: (err) => {
                    refetchProfileImage()
                    MarketplaceToaster.showToast(err.response)
                    handleCloseImageModal()
                },
            }
        )
    }

    const handleDeleteClick = () => {
        setDeleteModalOpen(true)
    }

    const handlePreviewClick = () => {
        setIsPreviewModalVisible(true)
    }

    const handleDeleteProfileImage = (imagePath) => {
        deleteImageMutation(
            { data: imagePath },
            {
                onSuccess: (response) => {
                    refetchUserData()
                    MarketplaceToaster.showToast(response)
                    setDeleteModalOpen(false)
                },
                onError: (err) => {
                    refetchUserData()
                    MarketplaceToaster.showToast(err.response)
                    setDeleteModalOpen(false)
                },
            }
        )
    }

    const getCurrentImage = () => {
        if (profileImageStatus === 'success' && profileImage) return profileImage
        return profileFallBackImage
    }

    return (
        <div>
            <div className='flex gap-[16px]'>
                {profileImageStatus === 'pending' && isProfileImageFetching ? (
                    <Spin />
                ) : (
                    <div
                        className='relative group'
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}>
                        {imagePath ? (
                            <>
                                {profileImageStatus === 'pending' && <Spin className='w-36 h-36' />}
                                {profileImageStatus === 'success' && profileImage && (
                                    <img
                                        src={profileImage}
                                        fallback={profileFallBackImage}
                                        width={140}
                                        preview={t('user_profile:preview')}
                                    />
                                )}
                            </>
                        ) : (
                            <img src={profileFallBackImage} width={140} preview={t('user_profile:preview')} />
                        )}
                        <Button
                            variant='secondary'
                            size='sm'
                            className={`absolute  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-opacityy duration-200 ${
                                isHovered ? 'opacity-100' : 'opacity-0'
                            }`}
                            onClick={handlePreviewClick}>
                            <MdRemoveRedEye className='w-4 h-4' />
                        </Button>
                    </div>
                )}
                <div className='self-end flex gap-[16px]'>
                    <Button
                        className='flex items-center gap-2'
                        variant='default'
                        onClick={() => setIsImageModalVisible(true)}>
                        <svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
                            <path
                                d='M15.3 3.2502C14.5 2.4002 13.65 1.5502 12.8 0.725195C12.625 0.550195 12.425 0.450195 12.2 0.450195C11.975 0.450195 11.75 0.525195 11.6 0.700195L2.17495 10.0502C2.02495 10.2002 1.92495 10.3752 1.84995 10.5502L0.474954 14.7502C0.399954 14.9502 0.449954 15.1502 0.549954 15.3002C0.674954 15.4502 0.849954 15.5502 1.07495 15.5502H1.17495L5.44995 14.1252C5.64995 14.0502 5.82495 13.9502 5.94995 13.8002L15.325 4.4502C15.475 4.3002 15.575 4.0752 15.575 3.8502C15.575 3.6252 15.475 3.4252 15.3 3.2502ZM5.14995 13.0252C5.12495 13.0502 5.09995 13.0502 5.07495 13.0752L1.84995 14.1502L2.92495 10.9252C2.92495 10.9002 2.94995 10.8752 2.97495 10.8502L9.84995 4.0002L12.025 6.1752L5.14995 13.0252ZM12.8 5.3752L10.625 3.2002L12.15 1.6752C12.875 2.3752 13.6 3.1252 14.3 3.8502L12.8 5.3752Z'
                                fill='white'
                            />
                        </svg>
                        {t('labels:change_profile_picture')}
                    </Button>
                    <Button
                        onClick={handleDeleteClick}
                        disabled={!imagePath}
                        variant='secondary'
                        className='delete-profile-btn flex items-center justify-center gap-2'>
                        <svg width='12' height='16' viewBox='0 0 12 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
                            <path
                                d='M10.225 2.1998H8.29999V1.7748C8.29999 1.0248 7.69999 0.424805 6.94999 0.424805H5.02499C4.27499 0.424805 3.67499 1.0248 3.67499 1.7748V2.1998H1.74999C1.02499 2.1998 0.424988 2.7998 0.424988 3.5248V4.2748C0.424988 4.8248 0.749988 5.2748 1.22499 5.4748L1.62499 14.1248C1.67499 14.9498 2.32499 15.5748 3.14999 15.5748H8.77499C9.59999 15.5748 10.275 14.9248 10.3 14.1248L10.75 5.4498C11.225 5.2498 11.55 4.7748 11.55 4.2498V3.4998C11.55 2.7998 10.95 2.1998 10.225 2.1998ZM4.82499 1.7748C4.82499 1.6498 4.92499 1.5498 5.04999 1.5498H6.97499C7.09999 1.5498 7.19999 1.6498 7.19999 1.7748V2.1998H4.84999V1.7748H4.82499ZM1.57499 3.5248C1.57499 3.4248 1.64999 3.3248 1.77499 3.3248H10.225C10.325 3.3248 10.425 3.3998 10.425 3.5248V4.2748C10.425 4.3748 10.35 4.4748 10.225 4.4748H1.77499C1.67499 4.4748 1.57499 4.3998 1.57499 4.2748V3.5248ZM8.79999 14.4498H3.19999C2.97499 14.4498 2.79999 14.2748 2.79999 14.0748L2.39999 5.5998H9.62499L9.22499 14.0748C9.19999 14.2748 9.02499 14.4498 8.79999 14.4498Z'
                                fill='#023047'
                            />
                        </svg>
                        {t('labels:delete_profile_picture')}
                    </Button>
                </div>
            </div>

            {isImageModalVisible && (
                <StoreModal
                    isVisible={isImageModalVisible}
                    cancelCallback={handleCloseImageModal}
                    okCallback={handleImageUpload}
                    isSpin={uploadImageStatus === 'pending'}
                    okButtonText={t('labels:save')}
                    cancelButtonText={t('labels:cancel')}
                    isOkButtonDisabled={!selectedFile || uploadImageStatus === 'pending'}
                    title={
                        <h2
                            className={`${
                                util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL'
                                    ? 'text-right pr-5' // Add padding-right for spacing
                                    : 'text-left'
                            }`}>
                            {t('labels:add_new_file')}
                        </h2>
                    }>
                    <div className='space-y-4'>
                        <input
                            ref={fileInputRef}
                            type='file'
                            accept={supportedFileExtensions}
                            onChange={handleFileSelect}
                            className='hidden'
                            id='file-upload'
                        />

                        <Button
                            className='flex items-center mt-6 hover:text-brandPrimaryColor w-auto justify-center'
                            variant='outline'
                            onClick={handleUploadClick}>
                            <MdOutlineFileUpload
                                className={`w-4 h-4 ${
                                    util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? 'ml-2' : 'mr-2'
                                }`}
                            />
                            <span
                                className={`${
                                    util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? 'ml-2' : 'mr-2'
                                }`}>
                                {t('labels:click_to_upload')}
                            </span>
                        </Button>

                        {selectedFile && (
                            <div className='w-auto mt-4 p-4'>
                                <div className='flex items-center gap-[30px]'>
                                    <div>
                                        <p className='text-sm font-medium'>{selectedFile.name}</p>
                                        <p className='text-xs text-gray-500'>
                                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                    <Button
                                        variant='ghost'
                                        size='sm'
                                        onClick={() => {
                                            setSelectedFile(null)
                                            resetFileInput()
                                        }}
                                        className='text-gray-500'>
                                        <MdClose className='w-4 h-4' />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {fileError && <p className='text-sm text-red-500'>{fileError}</p>}
                        <p className='text-sm text-gray-500'>{t('messages:accepted_image_formats')}</p>
                    </div>
                </StoreModal>
            )}

            {/* Preview Modal */}
            {isPreviewModalVisible && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75'>
                    <div className='relative w-full max-w-4xl'>
                        <div className='flex justify-end mb-4'>
                            <Button
                                variant='ghost'
                                size='sm'
                                onClick={() => setIsPreviewModalVisible(false)}
                                className='text-white hover:bg-white/10'>
                                <MdClose className='w-6 h-6' />
                            </Button>
                        </div>
                        <div className='p-4'>
                            <img
                                src={getCurrentImage()}
                                alt='Preview'
                                className='max-w-full max-h-[80vh] object-contain mx-auto'
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <StoreModal
                isVisible={deleteModalOpen}
                okButtonText={t('labels:delete')}
                cancelButtonText={null}
                width='420px'
                title={t('labels:delete_profile_picture')}
                okCallback={() => handleDeleteProfileImage(imagePath)}
                cancelCallback={() => setDeleteModalOpen(false)}
                isSpin={deleteImageStatus === 'pending'}>
                <div className='mb-6'>
                    <p>{t('messages:delete_profile_picture_confirmation')}</p>
                </div>
            </StoreModal>
        </div>
    )
}

export default ProfileImage
