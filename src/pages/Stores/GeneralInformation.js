import React from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../shadcnComponents/ui/collapsible'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const GeneralInformation = () => {
    const { t } = useTranslation()
    const [isCollapseOpen, setIsCollapseOpen] = React.useState(false)

    return (
        <div className='bg-white p-3 shadow-brandShadow rounded-md'>
            <label className='text-base font-medium text-regal-blue p-3'>{t('labels:distributor_store')}</label>
            <Collapsible open={isCollapseOpen} onOpenChange={setIsCollapseOpen} className='mx-2 my-4'>
                <CollapsibleTrigger className='w-full !flex !justify-between !items-center p-3 bg-gray-100 border border-gray-200'>
                    <div className='flex items-center gap-2'>
                        {isCollapseOpen ? <ChevronDown className='h-4 w-4' /> : <ChevronRight className='h-4 w-4' />}

                        <div className='flex flex-row justify-between '>
                            <p className=' text-base  text-brandGray1 '>{t('messages:What_is_a_distributor_store')}</p>
                        </div>
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent className='p-4 border border-gray-200 text-brandGray1 text-sm'>
                    <p>{t('messages:distributor_content')}</p>
                    <p>{t('messages:distributor_content1')}</p>
                </CollapsibleContent>
            </Collapsible>
        </div>
    )
}

export default GeneralInformation
