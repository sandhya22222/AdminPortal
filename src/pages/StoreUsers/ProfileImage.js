import { UploadOutlined } from '@ant-design/icons'
import { Button, Image, Spin, Typography, Upload } from 'antd'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { profileFallBackImage } from '../../constants/media'
import MarketplaceToaster from '../../util/marketplaceToaster'
import useDeleteProfileImage from './hooks/useDeleteProfileImage'
import useGetProfileImage from './hooks/useGetProfileImage'
import useUploadProfileImage from './hooks/useUploadProfileImage'

import './UserProfile.css'
import StoreModal from '../../components/storeModal/StoreModal'
const supportedFileExtensions = process.env.REACT_APP_IMAGES_EXTENSIONS
const supportedFileTypes = ['image/png', 'image/jpeg']

const ProfileImage = ({ imagePath, refetchUserData }) => {
    const { t } = useTranslation()
    const { Text } = Typography

    const [fileList, setFileList] = useState([])
    const [fileError, setFileError] = useState(null)
    const [isImageModalVisible, setIsImageModalVisible] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)

    const {
        data: profileImage,
        status: profileImageStatus,
        refetch: refetchProfileImage,
        isFetching: isProfileImageFetching,
    } = useGetProfileImage(imagePath)
    const { mutate: uploadImageMutation, status: uploadImageStatus, reset: resetUploadImage } = useUploadProfileImage()
    const { mutate: deleteImageMutation, status: deleteImageStatus } = useDeleteProfileImage()

    const handleCloseImageModal = () => {
        resetUploadImage()
        setIsImageModalVisible(false)
        setFileError(null)
        setFileList([])
    }
    function bytesToMegabytes(bytes) {
        // There are 1,048,576 bytes in a megabyte (1024 * 1024)
        const megabytes = bytes / 1048576
        return megabytes
    }
    const handleDeleteClick = () => {
        setDeleteModalOpen(true)
    }
    const handelFileSelect = (e) => {
        const file = e.fileList?.[0]
        if (e.fileList?.length <= 0 || supportedFileTypes?.includes(file?.type)) {
            if (bytesToMegabytes(file?.size) > 2) {
                setFileList([])
                setFileError(t('profile:image_size_error'))
            } else {
                setFileList(e.fileList)
                setFileError(null)
            }
        } else {
            setFileError(t('profile:upload_valid_image'))
        }
    }
    const handleImageUpload = () => {
        const file = fileList?.[0]
        const fileType = file?.type
        if (supportedFileTypes.includes(fileType)) {
            let imageFormData = new FormData()
            imageFormData.append('profile_image ', file?.originFileObj)

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
        } else {
            MarketplaceToaster.showToast('error')
        }
    }
    const handleDeleteProfileImage = (imagePath) => {
        deleteImageMutation(
            { data: imagePath },
            {
                onSuccess: (response) => {
                    refetchUserData()
                    refetchProfileImage()
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

    return (
        <div>
            <div className='flex gap-[16px]'>
                {imagePath ? (
                    <>
                        {profileImageStatus === 'pending' && isProfileImageFetching && <Spin />}
                        {profileImageStatus === 'success' && profileImage && (
                            <Image
                                src={profileImage}
                                fallback={profileFallBackImage}
                                width={140}
                                preview={{ mask: t('user_profile:preview') }}
                            />
                        )}
                    </>
                ) : (
                    <Image src={profileFallBackImage} width={140} preview={{ mask: t('user_profile:preview') }} />
                )}
                <div className='self-end flex gap-[16px]'>
                    <Button
                        className=' app-btn-primary flex items-center gap-2'
                        type='link'
                        onClick={() => setIsImageModalVisible(true)}>
                        <svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
                            <path
                                d='M15.3 3.2502C14.5 2.4002 13.65 1.5502 12.8 0.725195C12.625 0.550195 12.425 0.450195 12.2 0.450195C11.975 0.450195 11.75 0.525195 11.6 0.700195L2.17495 10.0502C2.02495 10.2002 1.92495 10.3752 1.84995 10.5502L0.474954 14.7502C0.399954 14.9502 0.449954 15.1502 0.549954 15.3002C0.674954 15.4502 0.849954 15.5502 1.07495 15.5502H1.17495L5.44995 14.1252C5.64995 14.0502 5.82495 13.9502 5.94995 13.8002L15.325 4.4502C15.475 4.3002 15.575 4.0752 15.575 3.8502C15.575 3.6252 15.475 3.4252 15.3 3.2502ZM5.14995 13.0252C5.12495 13.0502 5.09995 13.0502 5.07495 13.0752L1.84995 14.1502L2.92495 10.9252C2.92495 10.9002 2.94995 10.8752 2.97495 10.8502L9.84995 4.0002L12.025 6.1752L5.14995 13.0252ZM12.8 5.3752L10.625 3.2002L12.15 1.6752C12.875 2.3752 13.6 3.1252 14.3 3.8502L12.8 5.3752Z'
                                fill='white'
                            />
                        </svg>
                        {t('profile:change_profile_picture')}
                    </Button>
                    <Button
                        onClick={() => handleDeleteClick()}
                        disabled={!imagePath}
                        className='app-btn-secondary delete-profile-btn flex items-center justify-center gap-2'>
                        <svg width='12' height='16' viewBox='0 0 12 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
                            <path
                                d='M10.225 2.1998H8.29999V1.7748C8.29999 1.0248 7.69999 0.424805 6.94999 0.424805H5.02499C4.27499 0.424805 3.67499 1.0248 3.67499 1.7748V2.1998H1.74999C1.02499 2.1998 0.424988 2.7998 0.424988 3.5248V4.2748C0.424988 4.8248 0.749988 5.2748 1.22499 5.4748L1.62499 14.1248C1.67499 14.9498 2.32499 15.5748 3.14999 15.5748H8.77499C9.59999 15.5748 10.275 14.9248 10.3 14.1248L10.75 5.4498C11.225 5.2498 11.55 4.7748 11.55 4.2498V3.4998C11.55 2.7998 10.95 2.1998 10.225 2.1998ZM4.82499 1.7748C4.82499 1.6498 4.92499 1.5498 5.04999 1.5498H6.97499C7.09999 1.5498 7.19999 1.6498 7.19999 1.7748V2.1998H4.84999V1.7748H4.82499ZM1.57499 3.5248C1.57499 3.4248 1.64999 3.3248 1.77499 3.3248H10.225C10.325 3.3248 10.425 3.3998 10.425 3.5248V4.2748C10.425 4.3748 10.35 4.4748 10.225 4.4748H1.77499C1.67499 4.4748 1.57499 4.3998 1.57499 4.2748V3.5248ZM8.79999 14.4498H3.19999C2.97499 14.4498 2.79999 14.2748 2.79999 14.0748L2.39999 5.5998H9.62499L9.22499 14.0748C9.19999 14.2748 9.02499 14.4498 8.79999 14.4498Z'
                                fill='#023047'
                            />
                        </svg>
                        {t('profile:delete_profile_picture')}
                    </Button>
                </div>
            </div>
            {isImageModalVisible && (
                <StoreModal
                    isVisible={isImageModalVisible}
                    cancelCallback={() => handleCloseImageModal()}
                    okCallback={() => handleImageUpload()}
                    isSpin={uploadImageStatus === 'pending'}
                    okButtonText={t('common:save')}
                    cancelButtonText={t('common:cancel')}
                    isOkButtonDisabled={fileList?.length === 0 || uploadImageStatus === 'pending'}
                    title={t('profile:add_new_file')}>
                    <Upload
                        fileList={fileList}
                        accept={supportedFileExtensions}
                        maxCount={1}
                        showUploadList={true}
                        beforeUpload={() => {
                            return false
                        }}
                        onChange={(e) => handelFileSelect(e)}>
                        <Button className={'app-btn-secondary flex items-center mt-6'} icon={<UploadOutlined />}>
                            {t('common:click_to_upload')}
                        </Button>
                    </Upload>
                    {fileError && <p className='text-sm !mb-0 text-brandRed mt-2'>{fileError}</p>}
                    <p className='mb-6 !mt-2'>{t('profile:accepted_image_formats')}</p>
                </StoreModal>
            )}
            <StoreModal
                isVisible={deleteModalOpen}
                okButtonText={t('common:delete')}
                cancelButtonText={null}
                width='420px'
                title={t('profile:delete_profile_picture')}
                okCallback={() => handleDeleteProfileImage(imagePath)}
                cancelCallback={() => setDeleteModalOpen(false)}
                isSpin={deleteImageStatus === 'pending'}>
                {
                    <div className='mb-6'>
                        <>
                            <p>{t('profile:delete_profile_picture_confirmation')}</p>
                        </>
                    </div>
                }
            </StoreModal>
        </div>
    )
}

export default ProfileImage
