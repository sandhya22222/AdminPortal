import React, { useRef } from 'react'
import { MdAdd, MdRemoveRedEye, MdDelete } from 'react-icons/md'
import { useTranslation } from 'react-i18next'
import { Input } from '../../shadcnComponents/ui/input'

const supportedFileExtensions = process.env.REACT_APP_IMAGES_EXTENSIONS

const CustomImageUpload = ({
    selectedFile, // The selected files array
    preview, // Preview URLs array
    onFileSelect, // Function to handle file selection
    onRemove, // Function to handle image removal
    handlePreview, // Function to handle image preview
    disabled,
    multiple,
    maxImages,
    bannerImagesLength,
}) => {
    const { t } = useTranslation()
    const fileInputRef = useRef(null)

    // Handling file removal
    const handleRemove = (index) => {
        console.log('index', index)
        if (onRemove) {
            onRemove(index)
        }
    }
    console.log('bannerImagesLength', bannerImagesLength)
    let totalImages = []

    // Check if bannerImagesLength has data
    if (Array.isArray(bannerImagesLength) && bannerImagesLength.length > 0) {
        // Combine bannerImagesLength with selectedFile if bannerImagesLength has data
        totalImages = [...bannerImagesLength, ...selectedFile]
    } else {
        // If bannerImagesLength is empty, just use selectedFile
        totalImages = [...selectedFile]
    }

    // Handle adding more images
    const handleAddMore = () => {
        console.log('lengthhhhhhhhhhhhhhh', totalImages)
        if (!multiple || totalImages.length < maxImages) {
            fileInputRef.current.click() // Trigger input click if limit not reached
        }
    }

    return (
        <div className='w-full'>
            <div className='flex flex-row gap-4 flex-wrap'>
                {/* Image Upload Inputs and Previews */}
                {selectedFile?.map((file, index) => (
                    <div key={file.uid} className='relative w-24 h-24'>
                        {/* Image Preview */}
                        <img
                            src={preview[index]}
                            alt={`Preview ${index}`}
                            className='rounded-lg object-cover w-full h-full'
                            onClick={() => handlePreview(file)}
                        />
                        {/* View & Delete Icons */}
                        <div className='absolute top-8 right-6 flex space-x-1'>
                            <button
                                type='button'
                                className='p-1 bg-brandGray text-white rounded-full hover:bg-gray-600'
                                onClick={() => handlePreview(file)}>
                                <MdRemoveRedEye />
                            </button>
                            <button
                                type='button'
                                className='p-1 bg-red-300 text-white rounded-full hover:bg-red-500'
                                onClick={() => handleRemove(index)}>
                                <MdDelete />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Add More Images Button */}
                {totalImages.length < maxImages && (
                    <div className='w-24 h-24 border-dashed border-2 border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer hover:text-brandPrimaryColor relative'>
                        <div
                            className='flex flex-col items-center justify-center h-full text-gray-500 hover:text-brandPrimaryColor'
                            onClick={handleAddMore}>
                            <MdAdd className='mb-2' size={24} />
                            <span>{t('labels:upload')}</span>
                        </div>
                        <Input
                            ref={fileInputRef}
                            type='file'
                            accept={supportedFileExtensions}
                            onChange={onFileSelect}
                            className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer'
                            disabled={disabled}
                            multiple={multiple} // Allows selecting multiple images if enabled
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default CustomImageUpload
