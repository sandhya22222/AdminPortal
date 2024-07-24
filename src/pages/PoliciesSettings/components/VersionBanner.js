import { Button, Layout, Typography } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { PolicyBanner } from '../../../constants/media'
const { Content } = Layout
const { Title } = Typography

function VersionBanner({ addPolicyHandler }) {
    const { t } = useTranslation()
    return (
        <Content className='flex items-center flex-col'>
            <img src={PolicyBanner} className='!my-2' alt='globeIcon' />
            <div className='!mt-1 !text-regal-blue text-lg font-semibold'>{t('messages:policies')}</div>
            <p className='w-[80%] text-center text-brandGray2'>{t('messages:policy_banner_image_note')}</p>
            <Button className='app-btn-primary my-2  !flex !justify-items-center' onClick={addPolicyHandler}>
                <div className='mr-[10px]'>{t('labels:add_new_policy')}</div>
            </Button>
        </Content>
    )
}

export default VersionBanner
