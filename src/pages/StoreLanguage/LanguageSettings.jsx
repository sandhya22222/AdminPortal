import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../shadcnComponents/ui/tooltip'
import HeaderForTitle from '../../components/header/HeaderForTitle'
import LanguageDocUpload from './LanguageDocUpload'
import LanguageForm from './LanguageForm'
import LanguageHeaderAction from './LanguageHederAction'
import util from '../../util/common'

export default function LanguageSettings() {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const [languageCode, setLanguageCode] = useState(null)
    const [languageStatus, setLanguageStatus] = useState(null)
    const [languageId, setLanguageId] = useState(null)
    const [languageName, setLanguageName] = useState(null)
    const [languageDefault, setLanguageDefault] = useState(null)
    const [searchParams] = useSearchParams()

    useEffect(() => {
        setLanguageCode(searchParams.get('c'))
        setLanguageStatus(searchParams.get('s'))
        setLanguageId(searchParams.get('k'))
        setLanguageName(searchParams.get('n'))
        setLanguageDefault(searchParams.get('d'))
    }, [searchParams])

    useEffect(() => {
        const handleBrowserBackButton = () => {
            navigate('/dashboard/language')
        }

        window.addEventListener('popstate', handleBrowserBackButton)

        return () => {
            window.removeEventListener('popstate', handleBrowserBackButton)
        }
    }, [navigate])

    return (
        <div className='flex flex-col min-h-screen pt-1'>
            <div className='z-20'>
                <HeaderForTitle
                    title={
                        <div className='w-full flex'>
                            <div
                                className={
                                    util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? 'w-[27%]' : 'w-[30%]'
                                }>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <h3 className='text-2xl font-normal max-w-[250px] mb-3 mt-2 truncate'>
                                                {languageName || t('labels:add_language')}
                                            </h3>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{languageName}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                    }
                    titleContent={
                        languageId && languageCode && languageStatus !== null ? (
                            <LanguageHeaderAction
                                languageId={languageId}
                                languageCode={languageCode}
                                languageStatus={languageStatus}
                                languageDefault={languageDefault}
                            />
                        ) : null
                    }
                    backNavigationPath='/dashboard/language'
                    showArrowIcon={true}
                    showButtons={false}
                />
            </div>
            <div className='p-4 mt-36 min-h-screen'>
                <div className='bg-white shadow-md rounded-md'>
                    <div className='p-3'>
                        <div className='my-2 mb-4'>
                            <LanguageForm
                                languageCode={languageCode}
                                languageId={languageId}
                                setLanguageName={setLanguageName}
                                languageStatus={languageStatus}
                                setLanguageStatus={setLanguageStatus}
                                languageName={languageName}
                            />
                        </div>
                        <LanguageDocUpload langCode={languageCode} />
                    </div>
                </div>
            </div>
        </div>
    )
}
