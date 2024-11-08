import React from 'react'
import { globeIcon, plusIcon } from '../../constants/media'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../shadcnComponents/ui/button'
function LanguageBanner() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    return (
        <div className='flex items-center flex-col'>
            <img src={globeIcon} alt='' className='!my-2' />
            <label className='!mt-1 !mb-[1.25rem] text-xl'>
                {t('messages:connect_with_your_customers_in_their_preferred_language')}
            </label>
            <p className='w-[80%] text-center'>
                {t('messages:language_description')}{' '}
                {/* <a
                    href='https://docs.torryharrismarketplace.com/docs/2.8/Admin%20portal/Settings/Language%20Settings/'
                    target='blank'
                    className='!no-underline'>
                    <span className='font-semibold'>{t('labels:know_more')}</span>
                </a>{' '} */}
            </p>

            <Button
                size='sm'
                className='!my-[1.5rem] !flex !justify-items-center'
                onClick={() => navigate('/dashboard/language/language-settings')}>
                <img src={plusIcon} alt='plusIcon' className='!text-xs !w-3 my-1 mr-2 !items-center' />
                <div className='mr-[10px]'>{t('labels:add_language')}</div>
            </Button>
        </div>
    )
}

export default LanguageBanner
