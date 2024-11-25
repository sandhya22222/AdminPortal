import React, { useState } from 'react'
import { Button } from '../../shadcnComponents/ui/button'
import { Input } from '../../shadcnComponents/ui/input'
import util from '../../util/common'
import ShadCNTooltip from '../../shadcnComponents/customComponents/ShadCNTooltip'
import validator from 'validator'
import { useTranslation } from 'react-i18next'
import { Info } from 'lucide-react'
import { Alert, AlertTitle, AlertDescription } from '../../shadcnComponents/ui/alert'
import { Toggle } from '../../shadcnComponents/ui/toggle'

const AddStores = ({
    onClose,
    validateStorePostField,
    storeUserName,
    setStoreUserName,
    inValidUserName,
    setInValidUserName,
    storeEmail,
    setStoreEmail,
    inValidEmail,
    setInValidEmail,
    inValidEmailFormat,
    onChangeValues,
    setOnChangeValues,
    isDistributor,
    name,
    setName,
    inValidName,
    setInValidName,
    domainName,
}) => {
    const { t } = useTranslation()
    const emailMinLength = process.env.REACT_APP_EMAIL_MIN_LENGTH
    const emailMaxLength = process.env.REACT_APP_EMAIL_MAX_LENGTH
    const storeNameMinLength = process.env.REACT_APP_STORE_NAME_MIN_LENGTH
    const storeNameMaxLength = process.env.REACT_APP_STORE_NAME_MAX_LENGTH
    const userNameMinLength = process.env.REACT_APP_USERNAME_MIN_LENGTH
    const userNameMaxLength = process.env.REACT_APP_USERNAME_MAX_LENGTH
    const [storeType, setStoreType] = useState('partner')
    const [isOpenModalForMakingDistributor, setIsOpenModalForMakingDistributor] = useState(false)

    const handleStoreTypeChange = (val) => {
        console.log('Selected store type:', val)
        setStoreType(val)
    }

    return (
        <div className='p-2'>
            <div>
                <label className='text-[14px] leading-[22px] font-normal text-brandGray2 mb-2 ml-1 ' id='labStNam'>
                    {t('labels:store_domain_name')}
                </label>
                <span className='mandatory-symbol-color text-sm ml-1'>*</span>
            </div>
            <div className='flex'>
                <Input
                    placeholder={t('placeholders:enter_store_name')}
                    value={name}
                    minLength={storeNameMinLength}
                    maxLength={storeNameMaxLength}
                    className={`!w-[100%] mt-2 ${
                        inValidName ? 'border-red-400 border-solid focus:border-red-400 hover:border-red-400' : ''
                    }`}
                    onChange={(e) => {
                        const alphaWithoutSpaces = /^[a-zA-Z0-9]+$/
                        if (e.target.value !== '' && validator.matches(e.target.value, alphaWithoutSpaces)) {
                            setName(e.target.value)
                            setOnChangeValues(true)
                        } else if (e.target.value === '') {
                            setName(e.target.value)
                            setOnChangeValues(false)
                        }
                        setInValidName(false)
                    }}
                    onBlur={() => {
                        const trimmed = name.trim()
                        const trimmedUpdate = trimmed.replace(/\s+/g, ' ')
                        setName(trimmedUpdate)
                    }}
                />
                <span className='mx-3 mt-4 text-brandGray2'>{domainName}</span>
            </div>
            {inValidName && name === '' && (
                <div className='text-red-600 flex gap-1 mt-1 items-center'>
                    {t('messages:empty_store_name_message')}
                </div>
            )}
            {inValidName && name && name.length < 3 && (
                <div className='text-red-600 flex gap-1 mt-1'>{t('messages:enter_valid_store_name_message')}</div>
            )}
            <div className='flex !mt-5'>
                <label className='text-[14px] leading-[22px] font-normal text-brandGray2 mb-2 ml-1' id='labStNam'>
                    {t('labels:store_type')}
                </label>
                <span className='mandatory-symbol-color text-sm ml-1'>*</span>
                <span className='mt-1 ml-1'>
                    <ShadCNTooltip
                        content={
                            <ul style={{ listStyleType: 'disc', marginLeft: 0, paddingLeft: '20px' }}>
                                <li>{t('messages:store_type_info_partner')}</li>
                                <li>{t('messages:store_type_info_distributor')}</li>
                            </ul>
                        }
                        position={util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? 'left' : 'right'}
                        width='400px'>
                        <Info className='w-4 h-4 text-brandGray2' />
                    </ShadCNTooltip>
                </span>
            </div>

            <div className='flex mb-4'>
                <Toggle
                    pressed={storeType === 'partner'}
                    onPressedChange={() => handleStoreTypeChange('partner')}
                    className={`${isDistributor ? 'opacity-50 cursor-not-allowed' : ''} ${storeType === 'partner' ? 'border-2 border-primary text-primary' : 'border border-gray-300 text-gray-700 hover:border-gray-400'} transition-all`}
                    disabled={isDistributor}>
                    {t('labels:partner')}
                </Toggle>

                <Toggle
                    pressed={storeType === 'distributor'}
                    onPressedChange={() => handleStoreTypeChange('distributor')}
                    className={`${storeType === 'distributor' ? 'border-2 border-primary text-primary cursor' : 'border border-gray-300 text-gray-700 hover:border-gray-400'} 
                ${isDistributor ? 'opacity-50 cursor-not-allowed' : ''} transition-all`}
                    disabled={isDistributor}>
                    {t('labels:distributor')}
                </Toggle>
            </div>

            <div className='font-bold mt-[24px] text-[16px] leading-[24px] text-regal-blue'>
                {t('labels:store_administrator_details')}
            </div>
            <div className='my-4'>
                <Alert variant='default' className='flex !w-full'>
                    <Info className='text-foreground h-5 w-5 mt-0.5' />
                    <div className='ml-1 flex mt-1'>
                        <span className='mr-1 text-brandGray1 text-sm'>{t('labels:note')}:</span>
                        <span className='text-brandGray1 text-sm'>
                            {t('messages:add_store_description')}{' '}
                            <span className='font-bold'>{t('labels:store_management_portal')}</span>
                        </span>
                    </div>
                </Alert>
            </div>

            <div className='flex mt-3'>
                <label className='ml-1 text-[14px] leading-[22px] font-normal text-brandGray2' id='labStUseName'>
                    {t('labels:username')}
                </label>
                <span className='mandatory-symbol-color text-sm ml-1'>*</span>
                <span className='mt-1 ml-1'>
                    <ShadCNTooltip
                        content={
                            <div className='text-sm text-white'>
                                <p className='m-0 p-0'>
                                    {t('labels:your_username_can_include')}
                                    <span>:</span>
                                </p>
                                <ul className='list-disc !ml-3 space-y-1 mb-0'>
                                    <li>{t('messages:uppercase_letters')}</li>
                                    <li>{t('messages:lowercase_letters')}</li>
                                    <li>{t('messages:digits')}</li>
                                    <li>{t('messages:underscore')}</li>
                                    <li>{t('messages:hyphens')}</li>
                                </ul>
                                <p className='p-0 m-0'>{t('messages:username_acceptance_criteria_note')}</p>
                            </div>
                        }
                        position={util.getSelectedLanguageDirection()?.toUpperCase() === 'RTL' ? 'left' : 'right'}
                        width='400px'>
                        <Info className='w-4 h-4 text-brandGray2' />
                    </ShadCNTooltip>
                </span>
            </div>

            <Input
                placeholder={t('placeholders:enter_username')}
                value={storeUserName}
                minLength={userNameMinLength}
                maxLength={userNameMaxLength}
                className={`!w-[50%] mt-2 ${
                    inValidUserName ? 'border-red-400 border-solid focus:border-red-400 hover:border-red-400' : ''
                }`}
                onChange={(e) => {
                    const regex = /^[A-Za-z0-9_\- ]+$/
                    if (e.target.value !== '' && validator.matches(e.target.value, regex)) {
                        setInValidUserName(false)
                        setStoreUserName(String(e.target.value).toLowerCase().trim())
                        setOnChangeValues(true)
                    } else if (e.target.value === '') {
                        setStoreUserName(e.target.value)
                        setOnChangeValues(false)
                    }
                }}
                onBlur={() => {
                    const trimmed = storeUserName.trim()
                    const trimmedUpdate = trimmed.replace(/\s+/g, ' ')
                    setStoreUserName(trimmedUpdate)
                }}
            />

            {inValidUserName && storeUserName === '' && (
                <div className='text-red-600 flex gap-1 mt-1'>{t('messages:empty_user_name_message')}</div>
            )}
            {inValidUserName && storeUserName && storeUserName.length < 3 && (
                <div className='text-red-600 flex gap-1 mt-1'>{t('messages:enter_valid_user_name_message')}</div>
            )}

            <div className='flex mt-3'>
                <label className='ml-1 text-[14px] leading-[22px] font-normal text-brandGray2' id='labEmail'>
                    {t('labels:email')}
                </label>
                <span className='mandatory-symbol-color text-sm ml-1'>*</span>
            </div>

            <Input
                placeholder={t('placeholders:enter_email')}
                value={storeEmail}
                minLength={emailMinLength}
                maxLength={emailMaxLength}
                className={`!w-[50%] mt-2 ${
                    inValidEmail ? 'border-red-400 border-solid focus:border-red-400 hover:border-red-400' : ''
                }`}
                onChange={(e) => {
                    setInValidEmail(false)
                    if (e.target.value === '') {
                        setOnChangeValues(false)
                        setStoreEmail(e.target.value)
                    } else {
                        setOnChangeValues(true)
                        setStoreEmail(e.target.value.trim())
                    }
                }}
                onBlur={() => {
                    const trimmedEmail = storeEmail.trim()
                    setStoreEmail(trimmedEmail)
                }}
            />

            {inValidEmail && storeEmail === '' && (
                <div className='text-red-600 flex gap-1 mt-1'>{t('messages:empty_email_message')}</div>
            )}
            {inValidEmailFormat && storeEmail && (
                <div className='text-red-600 flex gap-1 mt-1'>{t('messages:invalid_email_format_message')}</div>
            )}

            <div className='flex space-x-3 !justify-end mt-4'>
                <Button className={'app-btn-secondary'} onClick={onClose}>
                    {t('labels:cancel')}
                </Button>
                <Button className={'app-btn-primary'} onClick={validateStorePostField}>
                    {t('labels:save')}
                </Button>
            </div>
        </div>
    )
}

export default AddStores
