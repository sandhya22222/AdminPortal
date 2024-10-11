import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Button } from '../../shadcnComponents/ui/button'

import './header2.css'

function HeaderForTitle({
    title,
    headerContent,
    titleContent,
    saveFunction,
    showArrowIcon,
    backNavigationPath,
    action,
    isVisible,
    showButtons,
    disableSave,
    disableDiscard,
}) {
    const { t } = useTranslation()
    const navigate = useNavigate()
    //! selected Language from Redux
    const selectedLanguageFromReduxState = useSelector((state) => state.reducerSelectedLanguage.selectedLanguage)

    const handleNavigationBack = () => {
        if (backNavigationPath !== undefined && backNavigationPath !== null && backNavigationPath !== '') {
            navigate(backNavigationPath)
        } else {
            navigate(-1)
        }
    }

    return (
        <div className='shadow-sm'>
            <div
                style={{ zIndex: '5' }}
                className={`${
                    headerContent === undefined
                        ? 'shadow-sm fixed !h-auto top-[72px] bg-white flex justify-between headerWidth !px-5 pt-3 pb-1'
                        : 'fixed !h-auto top-[72px] bg-white flex justify-between headerWidth !px-5 pt-3 pb-1'
                }`}>
                <div className={`${showArrowIcon ? 'flex !items-center gap-2 cursor-pointer' : ''}`}>
                    {showArrowIcon && (
                        <>
                            {selectedLanguageFromReduxState &&
                            Object(selectedLanguageFromReduxState).hasOwnProperty('writing_script_direction') &&
                            String(selectedLanguageFromReduxState?.writing_script_direction).toUpperCase() === 'RTL' ? (
                                <ArrowRight className='!text-xl ml-2' onClick={handleNavigationBack} />
                            ) : (
                                <ArrowLeft className='!text-xl mr-2' onClick={handleNavigationBack} />
                            )}
                        </>
                    )}
                </div>
                <div className='w-full flex justify-between'>
                    <div>{title}</div>
                    <div className='flex  justify-end'>{titleContent}</div>
                </div>
                {showArrowIcon && (
                    <>
                        {showButtons === false ? null : (
                            <div className='flex justify-end'>
                                {disableDiscard ? null : (
                                    <Button variant='secondary' className='mx-2' onClick={() => navigate(-1)}>
                                        {t('labels:discard')}
                                    </Button>
                                )}
                                {isVisible !== false && (
                                    <Button
                                        disabled={disableSave === true ? true : false}
                                        onClick={() => saveFunction()}
                                        className={`${disableSave ? 'app-btn-primary opacity-50' : 'app-btn-primary'}`}>
                                        {/* // !This Button Renders on Store Product Type */}

                                        {action === 'add' ? t('labels:save') : t('labels:update')}
                                    </Button>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
            {headerContent !== null && headerContent !== undefined ? (
                <div className='mt-[4.0rem] bg-white !px-5 !pt-3'>{headerContent}</div>
            ) : null}
        </div>
    )
}

export default HeaderForTitle
