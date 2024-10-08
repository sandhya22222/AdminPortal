import { useTranslation } from 'react-i18next'  


const Spin = () =>{ 
    const { t } = useTranslation()
    
    return (
    
    <div className='absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center'>
        <div className='flex flex-col items-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-brandPrimaryColor'></div>
            <p className='mt-4 text-lg font-semibold text-brandPrimaryColor'>{t('labels:please_wait')}</p>
        </div>
    </div>
)
} 


export default Spin;