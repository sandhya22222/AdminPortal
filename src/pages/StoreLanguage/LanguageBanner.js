import React from 'react'
import { Button, Layout, Typography } from 'antd'
import { globeIcon, plusIcon } from '../../constants/media'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
const { Content } = Layout
const { Title } = Typography
function LanguageBanner() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    return (
        <Content className='flex items-center flex-col'>
            <img src={globeIcon} className='!my-2' />
            <Title level={3} className='!mt-1 !mb-[1.25rem]'>
                {t('messages:connect_with_your_customers_in_their_preferred_language')}
            </Title>
            <p className='w-[80%] text-center'>{t('messages:language_description')}</p>
            <Button
                className='app-btn-primary !my-[1.5rem] !flex !justify-items-center'
                onClick={() => navigate('/dashboard/language/language-settings')}>
                <img src={plusIcon} className='!text-xs !w-3 my-1 mr-2 !items-center' />
                <div className='mr-[10px]'>{t('labels:add_language')}</div>
            </Button>
        </Content>
    )
}

export default LanguageBanner
