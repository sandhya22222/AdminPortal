import React, { useState, useEffect } from 'react'
import ImgCrop from 'antd-img-crop'
import { Typography, Upload, Layout, Modal, Radio } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import useAuthorization from '../../hooks/useAuthorization'

const { Title } = Typography
const { Content } = Layout
const storeImagesAPI = process.env.REACT_APP_STORE_IMAGES_API

const StoreImages = ({ title, type, isSingleUpload, storeId, imagesUpload, setImagesUpload, getImageData }) => {
    const authorizationHeader = useAuthorization()

    const [fileList, setFileList] = useState([])
    const [previewOpen, setPreviewOpen] = useState(false)
    const [previewImage, setPreviewImage] = useState('')
    const [previewTitle, setPreviewTitle] = useState('')
    const [value, setValue] = useState('Basic Upload')
    const [isLoading, setIsLoading] = useState(true)

    const options = [
        {
            label: 'Basic Upload',
            value: 'Basic Upload',
        },
        {
            label: 'Crop and Upload',
            value: 'Crop and Upload',
        },
    ]

    const onChange = ({ target: { value } }) => {
        setValue(value)
    }

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}>
                Upload
            </div>
        </div>
    )

    const handleChange = (e) => {
        setFileList(e.fileList)
        console.log('test', e.fileList)

        if (type === 'store_logo') {
            let copyimageData = [...imagesUpload]
            copyimageData.push({ type: 'store_logo', imageValue: e.file })
            console.log('copyimageData', copyimageData)
            setImagesUpload(copyimageData)
        }
        if (type === 'banner_images') {
            let copyimageData = [...imagesUpload]
            copyimageData.push({ type: 'banner_images', imageValue: e.file })
            setImagesUpload(copyimageData)
        }
        if (type === 'search_logo') {
            let copyimageData = [...imagesUpload]
            copyimageData.push({ type: 'search_logo', imageValue: e.file })
            setImagesUpload(copyimageData)
        }
        if (type === 'customer_logo') {
            let copyimageData = [...imagesUpload]
            copyimageData.push({ type: 'customer_logo', imageValue: e.file })
            setImagesUpload(copyimageData)
        }
        if (type === 'cart_logo') {
            let copyimageData = [...imagesUpload]
            copyimageData.push({ type: 'cart_logo', imageValue: e.file })
            setImagesUpload(copyimageData)
        }
        if (type === 'wishlist_logo') {
            let copyimageData = [...imagesUpload]
            copyimageData.push({ type: 'wishlist_logo', imageValue: e.file })
            setImagesUpload(copyimageData)
        }
        // setImagesUpload(e.file)

        // setImagesUpload({ type: "store_logo", imageValue: e.file });
        // setImagesUpload({ type: "banner_images", imageValue: e.file });
        // setImagesUpload({ type: "search_logo", imageValue: e.file });
        // setImagesUpload({ type: "customer_logo", imageValue: e.file });
        // setImagesUpload({ type: "cart_logo", imageValue: e.file });
        // setImagesUpload({ type: "wishlist_logo", imageValue: e.file });

        // if (e.file.status !== "removed") {
        //   storeLogoImagePostCall(e.file, parseInt(storeId));
        // }
    }

    useEffect(() => {
        if (type === 'store_logo') {
            // if (getImageData && getImageData.length !== 0) {
            // setFileList(getImageData && getImageData.store_logo);
            // console.log("getImageData",getImageData.store_logo);
            // }
        }
    }, [getImageData])

    const getBase64 = (file) => {
        console.log('file', file)
        new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result)
            reader.onerror = (error) => reject(error)
        })
    }

    const handleCancel = () => setPreviewOpen(false)

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj)
        }
        setPreviewImage(file.url || file.preview)
        setPreviewOpen(true)
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
    }

    const onPreview = async (file) => {
        let src = file.url
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader()
                reader.readAsDataURL(file.originFileObj)
                reader.onload = () => resolve(reader.result)
            })
        }

        const image = new Image()
        image.src = src
        const imgWindow = window.open(src)
        imgWindow?.document.write(image.outerHTML)
    }
    return (
        <Content>
            <Content className='float-right'>
                <Radio.Group options={options} onChange={onChange} value={value} optionType='button' />
            </Content>
            {value === 'Basic Upload' ? (
                <Content>
                    <Title level={5}>{title}</Title>
                    {isSingleUpload && isSingleUpload === true ? (
                        <Upload
                            // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            listType='picture-card'
                            fileList={fileList}
                            name='file'
                            onPreview={handlePreview}
                            onChange={(e) => handleChange(e)}
                            beforeUpload={() => {
                                return false
                            }}
                            afterUpload={() => {
                                return false
                            }}
                            accept='.png, .jpg, .jpeg'>
                            {fileList.length >= 1 ? null : uploadButton}
                        </Upload>
                    ) : (
                        <Upload
                            listType='picture-card'
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChange}
                            name='file'
                            beforeUpload={() => {
                                return false
                            }}
                            afterUpload={() => {
                                return false
                            }}
                            accept='.png, .jpg, .jpeg'>
                            {uploadButton}
                        </Upload>
                    )}
                    <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                        <img
                            alt='example'
                            style={{
                                width: '100%',
                            }}
                            src={previewImage}
                        />
                    </Modal>
                </Content>
            ) : (
                <Content>
                    <ImgCrop rotationSlider>
                        <Title level={5}>{title}</Title>
                        <Upload
                            action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
                            listType='picture-card'
                            fileList={fileList}
                            onChange={handleChange}
                            onPreview={onPreview}
                            accept='.png, .jpg, .jpeg'>
                            {fileList.length < 5 && '+ Upload'}
                        </Upload>
                    </ImgCrop>
                </Content>
            )}
        </Content>
    )
}

export default StoreImages
