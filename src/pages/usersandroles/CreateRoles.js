import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import HeaderForTitle from '../../components/header/HeaderForTitle'
import { Button } from '../../shadcnComponents/ui/button'
import { Textarea } from '../../shadcnComponents/ui/textarea'
import { Input } from '../../shadcnComponents/ui/input'
import ShadCNTooltip from '../../shadcnComponents/customComponents/ShadCNTooltip'
import Spin from '../../shadcnComponents/customComponents/Spin'
//! Import CSS libraries

const titleMaxLength = parseInt(process.env.REACT_APP_TITLE_MAX_LENGTH)

const CreateRoles = () => {
    const { t } = useTranslation()
    const { pathname } = useLocation()
    const [isLoading] = useState(false)
    const [pageAction, setPageAction] = useState()

    const roleFormValidation = () => {}

    useEffect(() => {
        var pathnameString = pathname.substring(pathname.lastIndexOf('/') + 1, pathname.length).split('-')
        setPageAction(pathnameString[0])

        window.scrollTo(0, 0)
    }, [])

    return (
        <div className=''>
            <HeaderForTitle
                title={
                    <ShadCNTooltip content={pageAction !== 'add' ? 'Edit' : 'Add'} zIndex={11} position='bottom'>
                        <label className='!font-normal max-w-[800px] text-2xl ' ellipsis>
                            {pageAction === 'add' ? `${t('labels:add_role')} ` : 'Edit Roles'}
                        </label>
                    </ShadCNTooltip>
                }
                type={'categories'}
                action={pageAction === 'add' ? 'add' : 'edit'}
                showArrowIcon={true}
                saveFunction={roleFormValidation}
                isVisible={pageAction === 'edit' ? false : true}
                showButtons={pageAction === 'edit' ? true : false}
            />
            <div className='!min-h-screen mt-[4.5rem] p-3'>
                {isLoading ? (
                    <Spin />
                ) : (
                    <div className='bg-white p-3'>
                        <div>
                            <div className='w-[58.33%]'>
                                <div className='my-3'>
                                    <p className='input-label-color mb-2 flex gap-1'>
                                        {t('labels:role_name')}
                                        <span className='mandatory-symbol-color text-sm '>*</span>
                                    </p>
                                    <div className='flex'>
                                        <div className=''>
                                            <Input
                                                disabled={pageAction === 'add' ? false : true}
                                                maxLength={titleMaxLength}
                                                placeholder={t('placeholders:role_name_placeholder')}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='my-3'>
                                    <p className='input-label-color mb-2 flex gap-1'>
                                        {t('common:description')}
                                        <span className='mandatory-symbol-color text-sm '>*</span>
                                    </p>
                                    <div className={`flex ${pageAction === 'edit' ? ' relative' : ''}`}>
                                        <Textarea
                                            disabled={pageAction === 'add' ? false : true}
                                            placeholder={t('placeholders:role_description_placeholder')}
                                            autoSize={true}
                                            rows={1}
                                        />
                                    </div>
                                </div>
                                {pageAction === 'add' ? (
                                    <div className='my-2'>
                                        <Button
                                            onClick={roleFormValidation}
                                            className={`app-btn-primary ml-1
                       `}>
                                            {pageAction === 'edit' ? t('labels:update') : t('labels:save')}
                                        </Button>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CreateRoles
