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
            <HeaderForTitle
                title={
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <h3 className='text-2xl font-normal truncate max-w-[250px] my-3'>
                                    {languageName || t('labels:add_language')}
                                </h3>
                            </TooltipTrigger>
                            <TooltipContent side='right'>
                                <p>{languageName}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
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

            <div className='flex-grow p-4 mt-[140px]'>
                <div className='bg-white shadow-md rounded-md'>
                    <div className='p-6'>
                        <LanguageForm
                            languageCode={languageCode}
                            languageId={languageId}
                            setLanguageName={setLanguageName}
                            languageStatus={languageStatus}
                            setLanguageStatus={setLanguageStatus}
                            languageName={languageName}
                        />
                        <div className='mt-7'>
                            <LanguageDocUpload langCode={languageCode} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
