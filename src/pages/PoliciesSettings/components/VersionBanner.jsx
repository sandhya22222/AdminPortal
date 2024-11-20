import { Button } from '../../../shadcnComponents/ui/button'
import { useTranslation } from 'react-i18next'
import { PolicyBanner } from '../../../constants/media'

export default function VersionBanner({ addPolicyHandler }) {
    const { t } = useTranslation()

    return (
        <div className='flex flex-col items-center'>
            <img src={PolicyBanner} className='my-2' alt='Policy Banner' />
            <h2 className='mt-1  text-lg font-semibold'>{t('messages:policies')}</h2>
            <p className='w-4/5 text-center text-gray-600'>{t('messages:policy_banner_image_note')}</p>
            <Button className='my-2 flex items-center justify-center' onClick={addPolicyHandler}>
                <span className='mr-2'>{t('labels:add_new_policy')}</span>
            </Button>
        </div>
    )
}
