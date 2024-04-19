import { DownOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { Button, Dropdown, Input, Progress, Space, Tag, Typography } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ReactQuill, { Quill } from 'react-quill'

const Link = Quill.import('formats/link')
Link.sanitize = function (url) {
    const trimmedURL = url?.trim()
    // quill by default creates relative links if scheme is missing.
    if (!trimmedURL.startsWith('http://') && !trimmedURL.startsWith('https://')) {
        return `https://${trimmedURL}`
    }
    return trimmedURL
}
const modules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        // [{ size: ["small", false, "large", "huge"] }], // custom dropdown
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        ['blockquote'],
        ['link'],
        // [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
        // [{ direction: "rtl" }], // text direction
        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ align: [] }],
        ['clean'],
    ],
}

const formats = [
    'background',
    'bold',
    'color',
    'font',
    'code',
    'italic',
    'link',
    'size',
    'strike',
    'underline',
    'blockquote',
    'header',
    'indent',
    'list',
    'align',
    'direction',
    // 'code-block',
    // 'formula',
    // 'image'
    // 'video',
    'script',
]

const languages = [
    { label: 'French', key: 'French' },
    { label: 'Hindi', key: 'Hindi' },
    { label: 'Germany', key: 'Germany' },
]
function TranslatePolicy() {
    const language = 'English'
    const policyTitle = 'Terms of Service'
    const policyDescription =
        'BHSBhdbhdbhbhdbhbdhbdhbbbbbsssssssssssssssssssssssssssssssssssssssssssssssssssbdhbhbfhbhbsahdbhbdhasbhdbhbdbhbshabdhdnjsanjdnjdnssssssssssssssssssssssssssssssssssssssssssssssssssbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbbhbbbbbbbbbbbbbbbbbbbb'
    const { t } = useTranslation()
    return (
        <div>
            <Tag className='mb-2 w-full' icon={<CheckCircleOutlined />} color='success'>
                {'BE MESSAGE'}
            </Tag>
            <div className='flex justify-between space-x-8'>
                <div>
                    <div className='flex mb-4'>
                        <label className='input-label-color'>{t('labels:translate_from')}</label>
                        <Typography className='font-bold px-2'>{language}</Typography>
                    </div>
                    <div>
                        <Typography.Title level={5}>{policyTitle}</Typography.Title>
                    </div>
                    <TextArea
                        className='!w-[380px] !h-[450px]'
                        placeholder={'Enter offer description here'}
                        value={policyDescription}
                    />
                </div>
                <div>
                    <div className='mb-4 flex justify-between'>
                        <div className='flex'>
                            <label className='input-label-color'>{t('labels:translate_to')}</label>
                            <div className='flex items-center mx-2'>
                                <Dropdown
                                    className='w-[90px]'
                                    menu={{
                                        items: languages,
                                    }}>
                                    <Space>
                                        <span className='font-bold'>{'Select'}</span>
                                        <DownOutlined />
                                    </Space>
                                </Dropdown>
                            </div>
                            {/* <div>
                                <Progress percent={100} size='small' showInfo={true} />
                            </div> */}
                        </div>
                    </div>
                    <label className='text-[14px] mb-3 input-label-color'>{t('labels:policy_title')}</label>
                    <div className=' flex items-center gap-x-5 max-w-[40%] w-full pb-3'>
                        <Input placeholder={t('labels:untitled_policy')} onChange={''} />
                    </div>
                    <label className='text-[14px] mb-3 input-label-color'>{t('labels:policy_description')}</label>
                    <div
                        className=' rounded border-[1px] drop-shadow-sm shadow-[#D9D9D9] border-[#D9D9D9] overflow-hidden bg-white w-[600px]'
                        data-text-editor={'versiontranslate'}>
                        <ReactQuill
                            theme='snow'
                            style={{ width: '100%', height: '320px' }}
                            value={''}
                            onChange={''}
                            modules={modules}
                            formats={formats}
                            bounds={`[data-text-editor=versiontranslate]`}
                        />
                    </div>
                </div>
            </div>
            <div className='flex justify-end'>
                <Button onClick={''} disabled={''} className='mx-2'>
                    {t('labels:cancel')}
                </Button>
                <Button className='app-btn-primary ' onClick={''}>
                    {t('labels:save')}
                </Button>
            </div>
        </div>
    )
}

export default TranslatePolicy
